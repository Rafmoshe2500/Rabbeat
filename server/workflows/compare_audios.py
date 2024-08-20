import base64
import io

import librosa
import numpy as np
from fastapi import HTTPException
from pydub import AudioSegment
from scipy.spatial.distance import cosine


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
        """Compare two audio arrays and return a similarity score and detailed feedback."""
        chroma1, mfcc1 = self.extract_features(audio1)
        chroma2, mfcc2 = self.extract_features(audio2)

        chroma_similarity = self.compare_features(chroma1, chroma2)
        mfcc_similarity = self.compare_features(mfcc1, mfcc2)

        overall_similarity = (chroma_similarity + mfcc_similarity) / 2
        score = overall_similarity * 100

        return score

    @staticmethod
    def get_feedback(text_score, audio_score) -> (str, str):
        if text_score >= 90:
            text_feedback = "מעולה! ביטאת את המילים בצורה ברורה ומובנית מאוד. כל הכבוד!"
        elif text_score >= 80:
            text_feedback = "יפה מאוד! ציון הטקסט שלך מצוין. המשך להתאמן, אתה בדרך הנכונה."
        elif text_score >= 70:
            text_feedback = "עבודה טובה מאוד! ציון הטקסט שלך מספק וניכר שהשקעת מאמץ."
        elif text_score >= 60:
            text_feedback = "ציון הטקסט שלך טוב. אתה יכול להשתפר עוד, אל תוותר!"
        elif text_score >= 40:
            text_feedback = "ציון הטקסט שלך טוב, אבל יש מקום לשיפור. המשך להתאמן על ביטוי המילים בצורה ברורה."
        elif text_score >= 20:
            text_feedback = "ציון הטקסט שלך יכול להשתפר, אבל אל תתייאש. המשך להשקיע ותראה התקדמות."
        else:
            text_feedback = "ציון הטקסט שלך דורש עוד התמקדות והשקעה, אבל אתה בהחלט מסוגל להשתפר. אל תוותר!"

        if audio_score >= 80:
            audio_feedback = "מצוין! איכות השמע שלך מעולה, אתה בהחלט בדרך הנכונה להצליח בשיעור הזה."
        elif audio_score >= 70:
            audio_feedback = "כל הכבוד! איכות השמע שלך טובה מאוד, ההתקדמות ניכרת."
        elif audio_score >= 60:
            audio_feedback = "יפה מאוד! איכות השמע שלך טובה, המשך להתאמן ובכך תשתפר עוד יותר."
        elif audio_score >= 40:
            audio_feedback = "איכות השמע שלך טובה, אבל יש מקום לשיפור. המשך להתאמן על ההגייה והבהירות שלך."
        else:
            audio_feedback = "איכות השמע שלך יכולה להשתפר, אבל אל תתייאש. המשך להתאמן ותראה התקדמות בהדרגה."

        return text_feedback, audio_feedback
