# from transformers import AutoModelForCausalLM, AutoTokenizer
#
# model = AutoModelForCausalLM.from_pretrained("dicta-il/dictalm2.0-instruct")
# tokenizer = AutoTokenizer.from_pretrained("dicta-il/dictalm2.0-instruct")
#
# messages = [
#     {"role": "user", "content": "איזה רוטב אהוב עליך?"},
#     {"role": "assistant",
#      "content": "טוב, אני די מחבב כמה טיפות מיץ לימון סחוט טרי. זה מוסיף בדיוק את הכמות הנכונה של טעם חמצמץ לכל מה שאני מבשל במטבח!"},
#     {"role": "user", "content": "האם יש לך מתכונים למיונז?"}
# ]
#

import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
import os

from tools.consts import PROJECT_ID

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

# TODO(developer): Update and un-comment below line
vertexai.init(project=PROJECT_ID, location="us-central1")

model = GenerativeModel(model_name="gemini-1.5-flash-001")

# Generation config
generation_config = GenerationConfig(
    max_output_tokens=1024
)


def get_answer(question, topic):
    return model.generate_content([topic, 'תשובה קצרה', question])
