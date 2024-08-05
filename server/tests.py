# import logging
# import os
#
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from google.cloud import speech_v1p1beta1 as speech
#
# app = FastAPI()
# logging.basicConfig(level=logging.INFO)
#
# # Set the path to the service account key file
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
#
#
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     logging.info("WebSocket connection accepted")
#
#     client = speech.SpeechClient()
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=16000,
#         language_code="he-IL",
#         enable_word_time_offsets=True
#     )
#     streaming_config = speech.StreamingRecognitionConfig(
#         config=config,
#         interim_results=True
#     )
#
#     async def generate_requests():
#         while True:
#             try:
#                 data = await websocket.receive_bytes()
#                 logging.info(f"Received {len(data)} bytes")
#                 yield speech.StreamingRecognizeRequest(audio_content=data)
#             except WebSocketDisconnect:
#                 logging.info("WebSocket disconnected")
#                 break
#             except Exception as e:
#                 logging.error(f"Exception occurred while receiving data: {e}")
#                 break
#
#     requests = generate_requests()
#     try:
#         responses = client.streaming_recognize(streaming_config, requests)
#         async for response in responses:
#             for result in response.results:
#                 alternative = result.alternatives[0]
#                 words = [
#                     {"word": word_info.word, "start_time": word_info.start_time.total_seconds(),
#                      "end_time": word_info.end_time.total_seconds()}
#                     for word_info in alternative.words
#                 ]
#                 logging.info(f"Transcription: {alternative.transcript}")
#                 await websocket.send_json({"transcript": alternative.transcript, "words": words})
#     except Exception as e:
#         logging.error(f"Exception occurred while processing responses: {e}")
#         await websocket.close()
#
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="0.0.0.0", port=8000)
