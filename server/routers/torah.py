from collections import defaultdict

from fastapi import HTTPException
from hebrew import Hebrew
from starlette.responses import JSONResponse

from routers import torah_router
from sel import get_full_text_return_verse_with_nikud
from workflows.get_torah import TorahTextProcessor  # Import the new class


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


@torah_router.post('/Nikud')
def set_vers_nikud(string):
    return {'result': get_full_text_return_verse_with_nikud(string)}


@torah_router.post('/CompareReadingToRealVerse')
def set_vers_nikud(real_verse, reading):
    response = defaultdict(dict)
    original_words = str(Hebrew(real_verse).no_taamim().no_sof_passuk().no_maqaf()).split(" ")
    words = str(Hebrew(real_verse).text_only().no_sof_passuk().no_maqaf()).split(" ")
    reading_words = str(Hebrew(get_full_text_return_verse_with_nikud(reading)).text_only()).split(" ")
    for i in range(len(words)):
        if words[i] == reading_words[i]:
            response[i].update({"word": original_words[i], "status": True})
        elif 'יהוה' in str(Hebrew(words[i]).text_only()):
            if 'אדני' in str(Hebrew(reading_words[i]).text_only()) or 'אדוני' in str(
                    Hebrew(reading_words[i]).text_only()):
                response[i].update({"word": original_words[i], "status": True})
            else:
                response[i].update({"word": original_words[i], "status": False})
        else:
            response[i].update({"word": original_words[i], "status": False})
    return response
