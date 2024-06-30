import json
from collections import defaultdict
from typing import List

from hebrew import Hebrew

from tools.consts import TEXT_VARIANTS
# from tests import merge
from tools.utils import merge_or_trim_lists
from tools.utils import no_p_and_s


def get_all_torah_text_variants_workflow(pentateuch, start_chapter, start_verse, end_chapter, end_verse):
    #  TODO Refactor to class inherit from BaseWorkflow
    response = defaultdict(dict)
    for text_type in TEXT_VARIANTS:
        new_data = defaultdict(dict)
        with open(f"Torah/{text_type}/{pentateuch}.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        def add_verses(chapter, start, end):
            for i in range(int(start), int(end) + 1):
                he_chapter = str(Hebrew(str(Hebrew.from_number(int(chapter)))).text_only())
                he_verse = str(Hebrew(str(Hebrew.from_number(i))).text_only())
                new_data[he_chapter][he_verse] = no_p_and_s(str(Hebrew(data[chapter][str(i)]).no_maqaf()))

        if start_chapter == end_chapter:
            add_verses(start_chapter, start_verse, end_verse)
        else:
            add_verses(start_chapter, start_verse, len(data[start_chapter]))
            startChapter = int(start_chapter)
            endChapter = int(end_chapter)
            startChapter += 1
            while startChapter <= endChapter:
                if startChapter < endChapter:
                    add_verses(str(startChapter), 1, len(data[str(startChapter)]))
                else:
                    add_verses(str(startChapter), 1, end_verse)
                startChapter += 1
        response[text_type] = new_data
    return response


def get_words_with_times_and_variants(pentateuch, start_chapter, start_verse, end_chapter, end_verse,
                                      times: List[float]):
    num_start_chapter, num_start_verse = str(Hebrew(start_chapter).gematria()), str(Hebrew(start_verse).gematria()),
    num_end_chapter, num_end_verse = str(Hebrew(end_chapter).gematria()), str(Hebrew(end_verse).gematria())

    verses_by_variants = get_all_torah_text_variants_workflow(pentateuch, num_start_chapter, num_start_verse,
                                                              num_end_chapter, num_end_verse)
    all_torah_words = get_all_torah_words(pentateuch, num_start_chapter, num_start_verse, num_end_chapter,
                                          num_end_verse)

    times, merge_words = merge_or_trim_lists(times, all_torah_words)

    words_for_highlight = defaultdict(dict)
    for variant, torah in verses_by_variants.items():
        counter = 0
        skip = 0  # If is there merge words
        for chapter, verses_by_variants in torah.items():
            for verse, txt in verses_by_variants.items():
                if verse not in words_for_highlight[chapter].keys():
                    words_for_highlight[chapter].update({verse: defaultdict(dict)})
                words = txt.split(" ")
                for i, word in enumerate(words):
                    if word != "׀":
                        if skip == 0:
                            if counter not in words_for_highlight[chapter][verse].keys():
                                words_for_highlight[chapter][verse].update(
                                    {counter: {'time': times[counter], variant: word}})
                            else:
                                words_for_highlight[chapter][verse][counter].update(
                                    {'time': times[counter], variant: word})
                            if len(merge_words[counter].split(" ")) > 1:
                                skip = len(merge_words[counter].split(" ")) - 1
                            counter += 1
                        else:
                            skip -= 1
                            words_for_highlight[chapter][verse][counter - 1][variant] += f" {words[i]}"
                    else:
                        words_for_highlight[chapter][verse][counter - 1][variant] += f" {word}"
    return words_for_highlight


def get_all_torah_words(pentateuch, start_chapter, start_verse, end_chapter, end_verse):
    all_words = []
    with open(f"Torah/none/{pentateuch}.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    def get_all_words_from_chapter(chapter, start, end):
        all_words_from_chapter = []
        for i in range(int(start), int(end) + 1):
            all_words_from_chapter += [word for word in
                                       no_p_and_s(str(Hebrew(data[chapter][str(i)]).no_maqaf())).split(" ")]
        return all_words_from_chapter

    if start_chapter == end_chapter:
        all_words += get_all_words_from_chapter(start_chapter, start_verse, end_verse)
    else:
        all_words += get_all_words_from_chapter(start_chapter, start_verse, len(data[start_chapter]))
        startChapter = int(start_chapter)
        endChapter = int(end_chapter)
        startChapter += 1
        while startChapter <= endChapter:
            if startChapter < endChapter:
                all_words += get_all_words_from_chapter(str(startChapter), 1, len(data[str(startChapter)]))
            else:
                all_words += get_all_words_from_chapter(str(startChapter), 1, end_verse)
            startChapter += 1
    return all_words
