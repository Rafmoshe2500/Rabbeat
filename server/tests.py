from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.cloud import speech
import base64
import os

# Initialize FastAPI app
from tools.utils import mongo_db

app = FastAPI()


# Define the Pydantic model for the request body
class Audio(BaseModel):
    audio: str


# Ensure the GCP credentials are set
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"


# Route for processing the audio and returning the transcription with timestamps
# @app.post("/transcribe")

def correct_padding(b64_string: str) -> str:
    """
    Add padding to the base64 string if necessary.
    """
    padding_needed = len(b64_string) % 4
    if padding_needed:
        b64_string += '=' * (4 - padding_needed)
    return b64_string

# Route for processing the audio and returning the transcription with timestamps
def transcribe():
    audion= mongo_db.get_lesson_by_id('66810eb7e7da755f8346e4b4')
    client = speech.SpeechClient()

    # Decode the base64 audio string with padding correction
    try:
        audio_content = base64.b64decode(correct_padding(audion['audio']))
    except base64.binascii.Error as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 encoding: {str(e)}")

    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
        enable_word_time_offsets=True,
    )

    try:
        operation = client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=90)

        if not response.results:
            raise HTTPException(status_code=400, detail="No transcriptions found")

        # Extracting words and their timestamps
        transcription_with_timestamps = []
        for result in response.results:
            alternative = result.alternatives[0]
            for word_info in alternative.words:
                word_data = {
                    "word": word_info.word,
                    "start_time": word_info.start_time.total_seconds(),
                    "end_time": word_info.end_time.total_seconds(),
                }
                transcription_with_timestamps.append(word_data)

        return {"transcription": transcription_with_timestamps}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

print(transcribe())
