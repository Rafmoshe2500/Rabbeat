import base64
import io

import librosa
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pydub import AudioSegment
from scipy.spatial.distance import cosine

app = FastAPI()


class AudioCompareRequest(BaseModel):
    audio1: str  # base64 encoded audio
    audio2: str  # base64 encoded audio


class AudioCompareResponse(BaseModel):
    score: float
    rating: str


class AudioComparator:
    def __init__(self):
        self.sample_rate = 22050  # Standard sample rate for librosa

    def decode_base64_audio(self, base64_string):
        """Decode base64 audio and convert it to WAV format."""
        try:
            # Remove MIME type prefix if it exists
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]

            audio_data = base64.b64decode(base64_string)
            audio_io = io.BytesIO(audio_data)

            # Use pydub to load the audio and convert it to WAV
            audio = AudioSegment.from_file(audio_io)
            audio = audio.set_frame_rate(self.sample_rate).set_channels(1)

            wav_io = io.BytesIO()
            audio.export(wav_io, format="wav")
            wav_io.seek(0)

            y, sr = librosa.load(wav_io, sr=self.sample_rate)
            return y

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid audio data: {str(e)}")

    def extract_features(self, audio):
        """Extract chroma and MFCC features from the audio."""
        chroma = librosa.feature.chroma_stft(y=audio, sr=self.sample_rate)
        mfcc = librosa.feature.mfcc(y=audio, sr=self.sample_rate)
        return chroma, mfcc

    def pad_features(self, feature1, feature2):
        """Pad features to the same length for comparison."""
        if feature1.shape[1] > feature2.shape[1]:
            pad_width = ((0, 0), (0, feature1.shape[1] - feature2.shape[1]))
            feature2 = np.pad(feature2, pad_width, mode='constant')
        else:
            pad_width = ((0, 0), (0, feature2.shape[1] - feature1.shape[1]))
            feature1 = np.pad(feature1, pad_width, mode='constant')
        return feature1, feature2

    def compare_features(self, feature1, feature2):
        """Compare features using cosine similarity."""
        feature1, feature2 = self.pad_features(feature1, feature2)
        similarity = 1 - cosine(feature1.flatten(), feature2.flatten())
        return similarity

    def compare_audios(self, audio1, audio2):
        """Compare two audio arrays and return a similarity score."""
        chroma1, mfcc1 = self.extract_features(audio1)
        chroma2, mfcc2 = self.extract_features(audio2)

        chroma_similarity = self.compare_features(chroma1, chroma2)
        mfcc_similarity = self.compare_features(mfcc1, mfcc2)

        overall_similarity = (chroma_similarity + mfcc_similarity) / 2
        score = overall_similarity * 100

        return score

    def get_rating(self, score):
        """Convert numerical score to rating."""
        if score < 50:
            return "Failed"
        elif score < 75:
            return "Reasonable"
        else:
            return "Excellent"


comparator = AudioComparator()


@app.post("/compare-audio/", response_model=AudioCompareResponse)
async def compare_audio(request: AudioCompareRequest):
    try:
        audio1 = comparator.decode_base64_audio(request.audio1)
        audio2 = comparator.decode_base64_audio(request.audio2)

        score = comparator.compare_audios(audio1, audio2)
        rating = comparator.get_rating(score)

        return AudioCompareResponse(score=score, rating=rating)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
