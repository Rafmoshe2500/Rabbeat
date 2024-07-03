from collections import defaultdict

from fastapi import HTTPException
from hebrew import Hebrew
from starlette.responses import JSONResponse

from routers import torah_router
from workflows.get_torah import TorahTextProcessor  # Import the new class
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


@torah_router.post('/compare-two-texts/')
def compare_two_texts(source, need_to_compare):
    try:
        text_comparator = HebrewTextComparator(source, need_to_compare).run()
        return JSONResponse(content=text_comparator)
    except Exception as e:
        raise HTTPException(500, 'אופס, נראה שמשהו השתבש במהלך האנליזה של ההקלטה... סליחה על אי הנוחות')

