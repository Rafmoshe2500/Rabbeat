import json
from collections import defaultdict

from fastapi import HTTPException
from hebrew import Hebrew
from starlette.responses import JSONResponse

from routers import torah_router
from sel import get_full_text_return_verse_with_nikud


@torah_router.get('/pentateuch/{pentateuch}/{startCh}/{startVerse}/{endCh}/{endVerse}', tags=['Torah'])
def get_verses(pentateuch, startCh, startVerse, endCh, endVerse):
    try:
        response = defaultdict(dict)
        with open(f"Torah/{pentateuch}.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        def add_verses(chapter, start, end):
            for i in range(int(start), int(end) + 1):
                he_chapter = str(Hebrew(str(Hebrew.from_number(int(chapter)))).text_only())
                he_verse = str(Hebrew(str(Hebrew.from_number(i))).text_only())
                response[he_chapter][he_verse] = data[chapter][str(i)]

        if startCh == endCh:
            add_verses(startCh, startVerse, endVerse)
        else:
            add_verses(startCh, startVerse, len(data[startCh]))
            startChapter = int(startCh)
            endChapter = int(endCh)
            startChapter += 1
            while startChapter <= endChapter:
                if startChapter < endChapter:
                    add_verses(str(startChapter), 1, len(data[str(startChapter)]))
                else:
                    add_verses(str(startChapter), 1, endVerse)
                startChapter += 1
        return JSONResponse(content=response)
    except Exception as e:
        print(e)
        raise HTTPException(400, 'נראה שהכנסת פרקים/פסוקים שלא תואמים את המציאות.')


@torah_router.post('/Nikud')
def set_vers_nikud(string):
    return {'result': get_full_text_return_verse_with_nikud(string)}


@torah_router.post('/CompareReadingToRealVerse')
def set_vers_nikud(realVerse, reading):
    if str(Hebrew(realVerse).no_taamim()) == get_full_text_return_verse_with_nikud(reading):
        return True
    return False
