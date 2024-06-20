import json
from collections import defaultdict
from copy import deepcopy

from hebrew import Hebrew

d = defaultdict(dict)

pentateuchs = ['בראשית', 'שמות', 'ויקרא', 'במדבר', 'דברים']
for pentateuch in pentateuchs:

    with open(f"Torah/both/{pentateuch}.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for k,v in data.items():
        d[pentateuch][str(Hebrew.from_number(int(k)))] = [str(Hebrew.from_number(int(num))) for num in v.keys()]

json_c = json.dumps(d, ensure_ascii=False, indent=2)

with open("./all_chars_and_vers.json", "w", encoding="utf-8") as f:
    f.write(json_c)
# print(d)
# for k,v in d.items():
#     print(k)
#     for p,s in v.items():
#         print(f'\t{p} : {s}')
