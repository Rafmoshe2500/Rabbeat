# Helper function to convert ObjectId to string
from database.mongo import MongoDBApi
from tools.consts import MONGO_URI, MONGO_DB_NAME


def object_id_str(obj):
    return {**obj, "_id": str(obj["_id"])}


def no_p_and_s(text: str):
    text = text.replace(' (פ)', '')
    text = text.replace(' (ס)', '')
    return text


def merge_or_trim_lists(numbers, words):
    len_numbers = len(numbers)
    len_words = len(words)
    difference = len_words - len_numbers

    if difference > 0:
        # Find the smallest differences between numbers
        diff_pairs = []
        for i in range(len_numbers - 1):
            for j in range(i + 1, len_numbers):
                diff_pairs.append((abs(numbers[i] - numbers[j]), i, j))

        # Sort pairs by the smallest difference
        diff_pairs.sort()

        # Use a set to keep track of merged indices
        merged_indices = set()

        # Merge words based on the selected pairs
        for i in range(difference):
            _, idx1, idx2 = diff_pairs[i]
            if idx1 not in merged_indices and idx2 not in merged_indices and idx1 < len_words - 1:
                words[idx1] += " " + words[idx1 + 1]
                merged_indices.add(idx1 + 1)

        # Remove the merged words
        words = [word for idx, word in enumerate(words) if idx not in merged_indices]

    elif difference < 0:
        # Convert difference to positive
        difference = abs(difference)

        # Find the smallest differences between numbers
        diff_pairs = []
        for i in range(len_numbers - 1):
            for j in range(i + 1, len_numbers):
                diff_pairs.append((abs(numbers[i] - numbers[j]), i, j))

        # Sort pairs by the smallest difference
        diff_pairs.sort()

        # Remove the largest numbers based on the indices from diff_pairs
        removed_indices = set()
        for i in range(difference):
            _, idx1, idx2 = diff_pairs[i]
            if idx1 not in removed_indices and idx2 not in removed_indices:
                if numbers[idx1] > numbers[idx2]:
                    removed_indices.add(idx1)
                else:
                    removed_indices.add(idx2)

        # Remove identified numbers
        numbers = [num for idx, num in enumerate(numbers) if idx not in removed_indices]

    # Ensure the lists are now the same length
    min_length = min(len(numbers), len(words))
    numbers = numbers[:min_length]
    words = words[:min_length]

    return numbers, words


mongo_db = MongoDBApi(MONGO_DB_NAME, MONGO_URI)
