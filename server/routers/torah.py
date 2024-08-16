import json

from fastapi import HTTPException
from hebrew import Hebrew
from starlette.responses import JSONResponse

from models.torah import TextCompare
from routers import torah_router
from workflows.get_torah import TorahTextProcessor
from workflows.text_comparator import HebrewTextComparator


@torah_router.get('/pentateuch/{pentateuch}/{startCh}/{startVerse}/{endCh}/{endVerse}', tags=['Torah'])
def get_verses(pentateuch: str, startCh: str, startVerse: str, endCh: str, endVerse: str):
    """
    <h4><ul>
    <li>pentateuch: חומש</li>
    <li>startCh: פרק התחלה</li>
    <li>startVerse: פסוק התחלה</li>
    <li>endCh: פרק סופי</li>
    <li>endVerse: פסוק סופי</li>
    </h4></ul
    :param pentateuch:
    :param startCh:
    :param startVerse:
    :param endCh:
    :param endVerse:
    :return:
    """
    torah_processor = TorahTextProcessor(pentateuch)
    startCh, startVerse = str(Hebrew(startCh).gematria()), str(Hebrew(startVerse).gematria())
    endCh, endVerse = str(Hebrew(endCh).gematria()), str(Hebrew(endVerse).gematria())
    try:
        response = torah_processor.get_all_torah_text_variants(startCh, startVerse, endCh, endVerse)
        return JSONResponse(content=response)
    except Exception as e:
        print(e)
        raise HTTPException(404, 'נראה שהכנסת פרקים/פסוקים שלא תואמים את המציאות.')


@torah_router.get('/parasha/{parashah}/{aliyah}', tags=['Torah'])
async def get_verses_by_alia(parashah, aliyah):
    response = {}
    with open(f"Torah/parashot/all.json", "r", encoding="utf-8") as f:
        torah_data = json.load(f)

    """
    Retrieve aliyah information for a given parashah and aliyah.
    """
    if parashah not in torah_data:
        raise HTTPException(status_code=404, detail="Parashah not found")

    parashah_data = torah_data[parashah]

    if aliyah not in parashah_data:
        raise HTTPException(status_code=404, detail="Aliyah not found")
    torah_processor = TorahTextProcessor(parashah_data["pentateuch"])
    return torah_processor.get_all_torah_text_variants(parashah_data[aliyah]["startChapter"],
                                                       parashah_data[aliyah]["startVerse"],
                                                       parashah_data[aliyah]["endChapter"],
                                                       parashah_data[aliyah]["endVerse"])


@torah_router.post('/compare-two-texts')
def compare_two_texts(texts: TextCompare):
    try:
        text_comparator = HebrewTextComparator(texts.source, texts.sttText).run()
        return JSONResponse(content=text_comparator)
    except Exception as e:
        raise HTTPException(500, 'אופס, נראה שמשהו השתבש במהלך האנליזה של ההקלטה... סליחה על אי הנוחות')
