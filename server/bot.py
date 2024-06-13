from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("dicta-il/dictalm2.0-instruct")
tokenizer = AutoTokenizer.from_pretrained("dicta-il/dictalm2.0-instruct")

messages = [
    {"role": "user", "content": "איזה רוטב אהוב עליך?"},
    {"role": "assistant",
     "content": "טוב, אני די מחבב כמה טיפות מיץ לימון סחוט טרי. זה מוסיף בדיוק את הכמות הנכונה של טעם חמצמץ לכל מה שאני מבשל במטבח!"},
    {"role": "user", "content": "האם יש לך מתכונים למיונז?"}
]

encoded = tokenizer.apply_chat_template(messages, return_tensors="pt")

generated_ids = model.generate(encoded, max_new_tokens=50, do_sample=True)
decoded = tokenizer.batch_decode(generated_ids)
print(decoded[0])

# from transformers import AutoTokenizer, AutoModelForCausalLM
#
# tokenizer = AutoTokenizer.from_pretrained("yam-peleg/Hebrew-Mistral-7B")
# model = AutoModelForCausalLM.from_pretrained("yam-peleg/Hebrew-Mistral-7B")
#
# input_text = "שלום! מה שלומך היום?"
# input_ids = tokenizer(input_text, return_tensors="pt")
#
# outputs = model.generate(**input_ids)
# print(tokenizer.decode(outputs[0]))


# import vertexai
# from vertexai.generative_models import GenerativeModel
# import os
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
#
# # TODO(developer): Update and un-comment below line
# project_id = "graphical-envoy-425419-a8"
#
# vertexai.init(project=project_id, location="us-central1")
#
# model = GenerativeModel(model_name="gemini-1.5-flash-001")
#
#
# def get_answer(question, parasha):
#     return model.generate_content([f' דבר איתי בנושא: {parasha} ', question])
