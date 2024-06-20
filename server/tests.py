import json
from collections import defaultdict
from copy import deepcopy

from hebrew import Hebrew

both = {}
nikud = {}
none = {}

pentateuchs = ['בראשית', 'שמות', 'ויקרא', 'במדבר', 'דברים']
for pentateuch in pentateuchs:
    with open(f"Torah/both/{pentateuch}.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    teamim, nikud, none = deepcopy(data), deepcopy(data), deepcopy(data)
    for k, v in none.items():
        for ke, va in v.items():
            none[k][ke] = str(Hebrew(va).text_only())

    json_object = json.dumps(none, ensure_ascii=False, indent=2)
    with open(f"Torah/none/{pentateuch}.json", "w", encoding="utf-8") as f:
        f.write(json_object)

    #  No Nikud only Taamim
    for k, v in teamim.items():
        for ke, va in v.items():
            teamim[k][ke] = str(Hebrew(va).no_niqqud())

    json_object = json.dumps(teamim, ensure_ascii=False, indent=2)
    with open(f"Torah/teamim/{pentateuch}.json", "w", encoding="utf-8") as f:
        f.write(json_object)

    #  No Taamim Only Nikud
    for k, v in nikud.items():
        for ke, va in v.items():
            nikud[k][ke] = str(Hebrew(va).no_taamim())

    json_object = json.dumps(nikud, ensure_ascii=False, indent=2)
    with open(f"Torah/nikud/{pentateuch}.json", "w", encoding="utf-8") as f:
        f.write(json_object)