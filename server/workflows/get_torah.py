import json
from collections import defaultdict
from typing import Dict, List, Any

from hebrew import Hebrew

from tools.consts import TEXT_VARIANTS
from tools.utils import no_p_and_s, merge_or_trim_lists


class TorahTextProcessor:
    def __init__(self, pentateuch: str):
        self.pentateuch = pentateuch
        self.data_cache = {}

    def get_words_with_times_and_variants(self, start_chapter: str, start_verse: str,
                                          end_chapter: str, end_verse: str, times: List[float]) -> Dict:
        num_start_chapter, num_start_verse = str(Hebrew(start_chapter).gematria()), str(Hebrew(start_verse).gematria())
        num_end_chapter, num_end_verse = str(Hebrew(end_chapter).gematria()), str(Hebrew(end_verse).gematria())

        verses_by_variants = self.get_all_torah_text_variants(num_start_chapter, num_start_verse,
                                                              num_end_chapter, num_end_verse)
        all_torah_words = self.get_all_torah_words(num_start_chapter, num_start_verse, num_end_chapter,
                                                   num_end_verse)

        times, merge_words = merge_or_trim_lists(times, all_torah_words)

        words_for_highlight = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

        for variant in TEXT_VARIANTS:
            counter = 0
            for chapter, verses in verses_by_variants[variant].items():
                for verse, text in verses.items():
                    words = text.split()
                    i = 0
                    while i < len(words):
                        word = words[i]
                        if word != "׀":
                            merged_word = merge_words[counter]
                            merged_word_len = len(merged_word.split())

                            if merged_word_len > 1:
                                word = " ".join(words[i:i + merged_word_len])
                                i += merged_word_len - 1

                            words_for_highlight[chapter][verse][counter].update({
                                'time': times[counter],
                                variant: word
                            })
                            counter += 1
                        else:
                            words_for_highlight[chapter][verse][counter - 1][variant] += f" {word}"
                        i += 1

        return words_for_highlight

    def get_all_torah_text_variants(self, start_chapter: str, start_verse: str,
                                    end_chapter: str, end_verse: str) -> Dict[str, Dict[str, Dict[str, str]]]:
        response = {}

        for text_type in TEXT_VARIANTS:
            if text_type not in self.data_cache:
                with open(f"Torah/{text_type}/{self.pentateuch}.json", "r", encoding="utf-8") as f:
                    self.data_cache[text_type] = json.load(f)

            response[text_type] = self._process_variant(self.data_cache[text_type], start_chapter, start_verse,
                                                        end_chapter, end_verse)

        return response

    def _process_variant(self, data: Dict[str, Any], start_chapter: str, start_verse: str,
                         end_chapter: str, end_verse: str) -> Dict[str, Dict[str, str]]:
        new_data = defaultdict(dict)
        start_chapter, end_chapter = int(start_chapter), int(end_chapter)

        for chapter in range(start_chapter, end_chapter + 1):
            he_chapter = str(Hebrew.from_number(chapter).text_only())

            start = int(start_verse) if chapter == start_chapter else 1
            end = int(end_verse) if chapter == end_chapter else len(data[str(chapter)])

            for verse in range(start, end + 1):
                he_verse = str(Hebrew.from_number(verse).text_only())
                text = no_p_and_s(Hebrew(data[str(chapter)][str(verse)]).no_maqaf())
                new_data[he_chapter][he_verse] = text

        return new_data

    def get_all_torah_words(self, start_chapter: str, start_verse: str,
                            end_chapter: str, end_verse: str) -> List[str]:
        if 'none' not in self.data_cache:
            with open(f"Torah/none/{self.pentateuch}.json", "r", encoding="utf-8") as f:
                self.data_cache['none'] = json.load(f)

        data = self.data_cache['none']
        all_words = []
        start_chapter, end_chapter = int(start_chapter), int(end_chapter)

        for chapter in range(start_chapter, end_chapter + 1):
            start = int(start_verse) if chapter == start_chapter else 1
            end = int(end_verse) if chapter == end_chapter else len(data[str(chapter)])

            chapter_words = self._get_words_from_chapter(data[str(chapter)], start, end)
            all_words.extend(chapter_words)

        return all_words

    def _get_words_from_chapter(self, chapter_data: dict, start: int, end: int) -> List[str]:
        words = []
        for verse in range(start, end + 1):
            verse_text = no_p_and_s(Hebrew(chapter_data[str(verse)]).no_maqaf())
            words.extend(verse_text.split())
        return words
