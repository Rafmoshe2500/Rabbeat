import json
from collections import defaultdict

from hebrew import Hebrew

from tools.consts import TEXT_VARIANTS


def get_all_torah_text_variants(pentateuch, start_chapter, start_verse, end_chapter, end_verse):
    response = defaultdict(dict)
    for text_type in TEXT_VARIANTS:
        new_data = defaultdict(dict)
        with open(f"Torah/{text_type}/{pentateuch}.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        def add_verses(chapter, start, end):
            for i in range(int(start), int(end) + 1):
                he_chapter = str(Hebrew(str(Hebrew.from_number(int(chapter)))).text_only())
                he_verse = str(Hebrew(str(Hebrew.from_number(i))).text_only())
                new_data[he_chapter][he_verse] = data[chapter][str(i)]

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
