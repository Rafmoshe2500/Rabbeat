import json
from collections import defaultdict
from typing import List

from hebrew import Hebrew

from tools.consts import TEXT_VARIANTS
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
    verses_by_variants = get_all_torah_text_variants_workflow(pentateuch,
                                                              str(Hebrew(start_chapter).gematria()),
                                                              str(Hebrew(start_verse).gematria()),
                                                              str(Hebrew(end_chapter).gematria()),
                                                              str(Hebrew(end_verse).gematria()))
    words_for_highlight = defaultdict(dict)
    for variant, torah in verses_by_variants.items():
        counter = 0
        for chapter, verses_by_variants in torah.items():
            for verse, txt in verses_by_variants.items():
                if verse not in words_for_highlight[chapter].keys():
                    words_for_highlight[chapter].update({verse: defaultdict(dict)})
                for word in txt.split(" "):
                    if word != "׀":
                        if counter not in words_for_highlight[chapter][verse].keys():
                            words_for_highlight[chapter][verse].update({counter: {'time': times[counter], variant: word}})
                        else:
                            words_for_highlight[chapter][verse][counter].update({'time': times[counter], variant: word})
                        counter += 1
                    else:
                        words_for_highlight[chapter][verse][counter - 1][variant] += f" {word}"
    return words_for_highlight
