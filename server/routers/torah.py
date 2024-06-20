import json
from collections import defaultdict

from fastapi import HTTPException
from hebrew import Hebrew
from starlette.responses import JSONResponse

from routers import torah_router
from sel import get_full_text_return_verse_with_nikud
from workflows.get_torah import get_all_torah_text_variants


@torah_router.get('/pentateuch/{pentateuch}/{startCh}/{startVerse}/{endCh}/{endVerse}', tags=['Torah'])
def get_verses(pentateuch: str, startCh: str, startVerse: str, endCh: str, endVerse: str):
    """
    <h4><ul>
    <li>pentateuch: חומש</li>
    <li>startCh: פרק התחלה</li>
    <li>startVerse: פסוק התחלה</li>
    <li>endCh: פרק סופי</li>
    <li>endVerse: פסוק סופי</li>
    </h4></ul<
    :param pentateuch:
    :param startCh:
    :param startVerse:
    :param endCh:
    :param endVerse:
    :return:
    """
    startCh, startVerse = str(Hebrew(startCh).gematria()), str(Hebrew(startVerse).gematria())
    endCh, endVerse = str(Hebrew(endCh).gematria()), str(Hebrew(endVerse).gematria())
    try:
        response = get_all_torah_text_variants(pentateuch, startCh, startVerse, endCh, endVerse)
        return JSONResponse(content=response)
    except Exception as e:
        print(e)
        raise HTTPException(404, 'נראה שהכנסת פרקים/פסוקים שלא תואמים את המציאות.')


@torah_router.post('/Nikud')
def set_vers_nikud(string):
    return {'result': get_full_text_return_verse_with_nikud(string)}


@torah_router.post('/CompareReadingToRealVerse')
def set_vers_nikud(realVerse, reading):
    if str(Hebrew(realVerse).no_taamim()) == get_full_text_return_verse_with_nikud(reading):
        return True
    return False
