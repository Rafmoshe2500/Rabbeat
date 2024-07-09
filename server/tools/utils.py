from datetime import timedelta, datetime
from typing import List, Tuple

import jwt

from database.mongo import MongoDBApi
from models.mongo import User
from tools.consts import MONGO_URI, MONGO_DB_NAME


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
    return jwt.encode(user, 'your_secret_key', algorithm='HS256')


mongo_db = MongoDBApi(MONGO_DB_NAME, MONGO_URI)
