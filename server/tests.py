import re
from difflib import SequenceMatcher
from typing import List, Tuple, Set, Dict
from abc import ABC, abstractmethod


class BaseWorkflow(ABC):

    @abstractmethod
    def run(self):
        pass


class HebrewTextComparator(BaseWorkflow):
    def __init__(self, source: str, stt: str, threshold: float = 0.7):
        self.source = source
        self.stt = stt
        self.threshold = threshold
        self.result = {}

        self.nikud_pattern = re.compile(r'[\u0591-\u05C7]')
        self.final_forms = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'}
        self.spelling_replacements = {
            'או': 'ו', 'יי': 'י', 'ווו': 'ו',
            'אלוהים': 'אלהים', 'כול': 'כל', 'אומר': 'אמר', 'אוכל': 'אכל',
            'קודש': 'קדש', 'חודש': 'חדש', 'ראוש': 'ראש', 'ראשון': 'רשון',
            'שלוש': 'שלש', 'שלושה': 'שלשה', 'אוהל': 'אהל', 'תוהו': 'תהו',
            'לאמור': 'לאמר', 'יעקוב': 'יעקב', 'יחזקאל': 'יחזקל', 'דויד': 'דוד',
            'אליהו': 'אליה', 'ירושלים': 'ירושלם', 'בראשית': 'בראשת',
            'תולדות': 'תלדות', 'נוח': 'נח', 'אברהם': 'אברם', 'יוסף': 'יסף',
            'אהרון': 'אהרן', 'יהושוע': 'יהושע', 'שאול': 'שאל', 'ישעיהו': 'ישעיה',
            'ירמיהו': 'ירמיה', 'עמוס': 'עמס', 'סדום': 'סדם', 'עמורה': 'עמרה',
            'שילה': 'שלה', 'תורה': 'תרה', 'מצווה': 'מצוה', 'עולה': 'עלה',
            'קורבן': 'קרבן', 'כוהן': 'כהן', 'נביא': 'נבא', 'מועד': 'מעד',
            'חטאת': 'חטת', 'בכור': 'בכר', 'שופר': 'שפר', 'סוכה': 'סכה',
            'אתרוג': 'אתרג', 'אות': 'את', 'אור': 'אר', 'גוי': 'גי',
            'חוק': 'חק', 'יום': 'ים', 'כבוד': 'כבד', 'לאום': 'לאם',
            'מאור': 'מאר', 'עוון': 'עון', 'צום': 'צם', 'קול': 'קל',
            'רוח': 'רח', 'שלום': 'שלם', 'תוך': 'תך', }
        self.substitutions = {
            'יהוה': 'אדוני',
            'אלהים': 'אלוקים',
        }
        self.letter_confusions = [
            ('ש', 'ס'),
            ('ב', 'ו'),
            ('כ', 'ח'),
            ('א', 'ה', 'ע')
        ]

    def remove_nikud(self, text: str) -> str:
        return self.nikud_pattern.sub('', text)

    def normalize_final_forms(self, text: str) -> str:
        return ''.join(self.final_forms.get(char, char) for char in text)

    def normalize_spelling(self, word: str) -> str:
        for full, defective in self.spelling_replacements.items():
            word = word.replace(full, defective)
        return word

    def handle_substitutions(self, word: str) -> str:
        return self.substitutions.get(word, word)

    def handle_letter_confusion(self, word: str) -> Set[str]:
        variations = {word}
        for confusion_group in self.letter_confusions:
            new_variations = set()
            for variation in variations:
                for char in confusion_group:
                    for replace_char in confusion_group:
                        if char != replace_char:
                            new_variation = variation.replace(char, replace_char)
                            if new_variation != variation:
                                new_variations.add(new_variation)
            variations.update(new_variations)
        return variations

    def preprocess_hebrew(self, text: str) -> List[Tuple[str, str, Set[str]]]:
        words = self.remove_nikud(text).split()
        processed_words = []
        for original_word in words:
            normalized_word = self.normalize_final_forms(original_word)
            normalized_word = self.normalize_spelling(normalized_word)
            normalized_word = self.handle_substitutions(normalized_word)
            variations = self.handle_letter_confusion(normalized_word)
            processed_words.append((original_word, normalized_word, variations))
        return processed_words

    @staticmethod
    def word_similarity(word1: str, word2: str) -> float:
        return SequenceMatcher(None, word1, word2).ratio()

    def compare_hebrew_strings(self) -> Dict[str, bool]:
        source_words = self.preprocess_hebrew(self.source.replace('\n', ' '))
        stt_words = self.preprocess_hebrew(self.stt)

        result = {original_word: False for original_word, _, _ in source_words}
        used_indices = set()

        for i, (original_word1, normalized_word1, variations1) in enumerate(source_words):
            best_match = 0
            best_index = -1

            for j, (original_word2, normalized_word2, variations2) in enumerate(stt_words):
                if j in used_indices:
                    continue

                if variations1.intersection(variations2):
                    best_match = 1
                    best_index = j
                    break

                if j < len(stt_words) - 1:
                    _, next_normalized_word, next_variations = stt_words[j + 1]
                    combined_variations = {v1 + v2 for v1 in variations2 for v2 in next_variations}
                    if variations1.intersection(combined_variations):
                        best_match = 1
                        best_index = j
                        break

                if any(v2.startswith(v1) for v1 in variations1 for v2 in variations2):
                    best_match = len(normalized_word2) / len(normalized_word1)
                    best_index = j
                    continue

                similarity = max(self.word_similarity(v1, v2) for v1 in variations1 for v2 in variations2)
                if similarity > best_match:
                    best_match = similarity
                    best_index = j

            if best_match >= self.threshold:
                result[original_word1] = True
                if best_index != -1:
                    used_indices.add(best_index)

        return result

    def run(self):
        self.result = self.compare_hebrew_strings()
        return self.result

    def print_results(self):
        for word, matched in self.result.items():
            print(f"{word}: {'אמת' if matched else 'שקר'}")

        true_count = sum(1 for matched in self.result.values() if matched)
        false_count = sum(1 for matched in self.result.values() if not matched)
        print(f"\nTotal words: {len(self.result)}")
        print(f"Matched (אמת): {true_count}")
        print(f"Not matched (שקר): {false_count}")


def main():
    source = """ויפגע במקום וילן שם כי בא השמש ויקח מאבני המקום וישם מראשתיו וישכב במקום ההוא ויחלם והנה סלם מצב ארצה וראשו מגיע השמימה והנה מלאכי אלהים עלים וירדים בו"""
    stt = """ויפגע במקום וילין שם כי בא השמש ויקח מאבנו המקום והיו שם מראשותיו וישכב במקום ההוא ויחלם לם והנה סולם מוצב ארצה ורעושו מגיע השוממה והנה מלאכי אלוקים עלים ויורדעמים בו"""

    comparator = HebrewTextComparator(source, stt, threshold=0.85)
    comparator.run()
    comparator.print_results()


if __name__ == "__main__":
    main()