import json

from hebrew import Hebrew

result = {}
with open(f"Torah/parashot/all.json", "r", encoding="utf-8") as f:
    torah_data = json.load(f)

for k, v in torah_data.items():
    for ke, va in v.items():
        if isinstance(va, dict):
            for key, val in va.items():
                torah_data[k][ke][key] = str(Hebrew(val).text_only()).replace("'", "").replace('"', "")

print(torah_data)

with open("Torah/parashot/all.json", "w", encoding="utf-8") as json_file:
    json.dump(torah_data, json_file, ensure_ascii=False, indent=4)
