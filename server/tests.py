import time
from collections import defaultdict

from hebrew import Hebrew

from models.mongo import LessonMetadata
from tools.utils import mongo_db
from workflows.get_torah import get_all_torah_text_variants_workflow

lesson = mongo_db.get_lesson_by_id('667752325633e218e80da883')
lesson_metadata: LessonMetadata = mongo_db.get_lesson_metadata_by_id('667752325633e218e80da883')
# text = "בראשית ברא אלוהים את השמים ואת הארץ והארץ הייתה תוהו ובוהו וחשך על פני תהום ורוח אלהים מרחפת על פני המים"

verses = get_all_torah_text_variants_workflow(lesson_metadata["pentateuch"], str(Hebrew(lesson_metadata["startChapter"]).gematria()),
                                              str(Hebrew(lesson_metadata["startVerse"]).gematria()), str(Hebrew(lesson_metadata["endChapter"]).gematria()),
                                              str(Hebrew(lesson_metadata["endVers"]).gematria()))
times = lesson['highlightsTimestamps']
print(times)
words_for_highlight = defaultdict(dict)
counter = 0
for variant, torah in verses.items():
    counter = 0
    for chapter, verses in torah.items():
        for verse, txt in verses.items():
            if verse not in words_for_highlight[chapter].keys():
                words_for_highlight[chapter].update({verse: defaultdict(dict)})
            for word in txt.split(" "):
                if counter not in words_for_highlight[chapter][verse].keys():
                    words_for_highlight[chapter][verse].update({counter: {'time': times[counter], variant: word}})
                else:
                    words_for_highlight[chapter][verse][counter].update({'time': times[counter], variant: word})
                counter += 1

for k, v in words_for_highlight.items():
    print('{', k, ':')
    for ke, val in v.items():
        print('\t{', ke, ':')

        for key, valu in val.items():
            print('\t\t{', f'{key} : {valu}','}')
        print('\t}')
    print('}')
#
# version = 'teamim'
# prev_time = 0.0
# try:
#     for k, v in words_for_highlight.items():
#         time.sleep(v['time'] - prev_time)
#         print(f'{v[version]}', end=' ', flush=True)
#         prev_time = v['time']
# except:
#     pass
