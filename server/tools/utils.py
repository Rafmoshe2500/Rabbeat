from typing import List, Tuple, Dict, Union

import jwt
import keyring

from models.response import ExtendLessonDetailsResponse, LessonDetailsResponse
from tools.consts import SECRET_KEY


def object_id_str(obj):
    return {**obj, "_id": str(obj["_id"])}


def no_p_and_s(text: str):
    text = str(text).replace(' (פ)', '')
    text = str(text).replace(' (ס)', '')
    return text


def merge_or_trim_lists(numbers: List[float], words: List[str]) -> Tuple[List[float], List[str]]:
    len_numbers, len_words = len(numbers), len(words)
    difference = len_words - len_numbers

    if difference == 0:
        return numbers, words

    if difference > 0:
        return merge_words(numbers, words, difference)
    else:
        return trim_numbers(numbers, words, -difference)


def merge_words(numbers: List[float], words: List[str], difference: int) -> Tuple[List[float], List[str]]:
    diffs = [(abs(numbers[i] - numbers[i + 1]), i) for i in range(len(numbers) - 1)]
    diffs.sort(key=lambda x: x[0])
    merged_indices = set()

    for _, idx in diffs[:difference]:
        if idx not in merged_indices and idx + 1 not in merged_indices:
            words[idx] += " " + words[idx + 1]
            merged_indices.add(idx + 1)

    return numbers, [word for i, word in enumerate(words) if i not in merged_indices]


def trim_numbers(numbers: List[float], words: List[str], difference: int) -> Tuple[List[float], List[str]]:
    numbered = list(enumerate(numbers))
    numbered.sort(key=lambda x: x[1], reverse=True)
    removed_indices = set(idx for idx, _ in numbered[:difference])
    return [num for i, num in enumerate(numbers) if i not in removed_indices], words


def create_jwt_token(user: dict):
    return jwt.encode(user, SECRET_KEY, algorithm='HS256')


def decode_token(token):
    print(token)
    print(SECRET_KEY)
    return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])


def sorted_lessons(lessons: List[Union[LessonDetailsResponse, ExtendLessonDetailsResponse, Dict]]):
    def get_sort_keys(lesson):
        if isinstance(lesson, dict):
            details = lesson['details']
        else:
            details = lesson.details

        return (
            details['pentateuch'] if isinstance(details, dict) else details.pentateuch,
            details['startChapter'] if isinstance(details, dict) else details.startChapter,
            details['startVerse'] if isinstance(details, dict) else details.startVerse
        )

    return sorted(lessons, key=get_sort_keys)


def is_string_numeric(s):
    return s.isdigit()


def number_to_torah_style(number):
    units = ["", "אחד", "שניים", "שלושה", "ארבעה", "חמישה", "שישה", "שבעה", "שמונה", "תשעה"]
    tens = ["", "עשרה", "עשרים", "שלושים", "ארבעים", "חמישים", "שישים", "שבעים", "שמונים", "תשעים"]
    hundreds = ["", "מאה", "מאתיים", "שלוש מאות", "ארבע מאות", "חמש מאות", "שש מאות", "שבע מאות", "שמונה מאות",
                "תשע מאות"]
    thousands = ["", "אלף", "אלפיים", "שלושת אלפים", "ארבעת אלפים", "חמשת אלפים", "ששת אלפים", "שבעת אלפים",
                 "שמונת אלפים", "תשעת אלפים"]

    word = ""

    if number >= 100000:
        word += hundreds[number // 100000] + " אלף"
        number %= 100000

    if number >= 10000:
        if word:
            word += " ו"
        word += tens[number // 10000] + " אלף"
        number %= 10000

    if number >= 1000:
        if word:
            word += " ו"
        if number // 1000 > 1:
            word += thousands[number // 1000]
        else:
            word += "אלף"
        number %= 1000

    if number >= 100:
        if word:
            word += " ו"
        word += hundreds[number // 100]
        number %= 100

    if number >= 10:
        if word:
            word += " ו"
        word += tens[number // 10]
        number %= 10

    if number > 0:
        if word:
            word += " ו"
        word += units[number]

    return word


def split_text_maybe_with_numbers_to_words(text):
    res = []
    for word in text.split(' '):
        if is_string_numeric(word):
            hebrew_numbers = number_to_torah_style(int(word))
            for hebrew_number in hebrew_numbers.split(" "):
                res.append(hebrew_number)
        else:
            res.append(word)
    return res
