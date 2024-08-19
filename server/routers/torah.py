import json

from fastapi import HTTPException
from hebrew import Hebrew
from starlette.responses import JSONResponse

from database.mongo import mongo_db
from models.response import ResponseVersesByALia, AudioCompareResponse
from models.tests import AudioCompareRequest
from models.torah import TextCompare
from routers import torah_router
from tests import AudioComparator
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


@torah_router.get('/alia/{parasha}/{aliya}', tags=['Torah'], status_code=200, response_model=ResponseVersesByALia)
async def get_verses_by_alia(parasha, aliya):
    response = {}
    with open(f"Torah/parashot/all.json", "r", encoding="utf-8") as f:
        torah_data = json.load(f)

    if parasha not in torah_data:
        raise HTTPException(status_code=404, detail="Parashah not found")

    parasha_data = torah_data[parasha]

    if aliya not in parasha_data:
        raise HTTPException(status_code=404, detail="Aliyah not found")
    response.update({"pentateuch": parasha_data["pentateuch"],
                     "startChapter": parasha_data[aliya]["startChapter"],
                     "startVerse": parasha_data[aliya]["startVerse"],
                     "endChapter": parasha_data[aliya]["endChapter"],
                     "endVerse": parasha_data[aliya]["endVerse"]})
    return response


@torah_router.post('/compare-two-texts')
def compare_two_texts(texts: TextCompare):
    try:
        text_comparator = HebrewTextComparator(texts.source, texts.sttText).run()
        return JSONResponse(content=text_comparator)
    except Exception as e:
        raise HTTPException(500, 'אופס, נראה שמשהו השתבש במהלך האנליזה של ההקלטה... סליחה על אי הנוחות')


@torah_router.post("/compare-audio/", response_model=AudioCompareResponse)
async def compare_audio(request: AudioCompareRequest):
    comparator = AudioComparator()
    try:
        audio1 = comparator.decode_base64_audio(request.testAudio)
        lesson = mongo_db.get_lesson_by_id(request.lessonId)
        audio2 = comparator.decode_base64_audio(lesson['audio'])
        text_comparator = HebrewTextComparator(request.sourceText, request.sttText).run()

        success_word_counter = 0
        for word in text_comparator:
            if word[1]:
                success_word_counter += 1

        text_score = (success_word_counter / len(text_comparator)) * 100
        print(f'text_score: {text_score}')
        audio_score = comparator.compare_audios(audio1, audio2)
        print(f'audio_score: {audio_score}')
        total_score = audio_score * 0.6 + text_score * 0.4
        print(f'total_score: {total_score}')
        rating = comparator.get_rating(total_score)

        return AudioCompareResponse(score=total_score, rating=rating)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
