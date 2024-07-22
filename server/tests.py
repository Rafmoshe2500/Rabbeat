# import os
# import asyncio
# import websockets
# from google.cloud import speech
# import google.api_core.exceptions
# import logging
#
# # Set up logging
# logging.basicConfig(level=logging.DEBUG)
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
#
# client = speech.SpeechClient()
#
# config = speech.RecognitionConfig(
#     encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#     sample_rate_hertz=16000,
#     language_code="en-US",
# )
#
# streaming_config = speech.StreamingRecognitionConfig(
#     config=config, interim_results=True
# )
#
# async def transcribe_audio(websocket, path):
#     async def receive():
#         while True:
#             try:
#                 audio_chunk = await websocket.recv()
#                 logging.debug(f"Received audio chunk of size: {len(audio_chunk)} bytes")
#                 yield speech.StreamingRecognizeRequest(audio_content=audio_chunk)
#             except websockets.exceptions.ConnectionClosed:
#                 break
#
#     try:
#         async for response in client.streaming_recognize(streaming_config, receive().__aiter__()):
#             for result in response.results:
#                 if result.is_final:
#                     await websocket.send(result.alternatives[0].transcript)
#     except google.api_core.exceptions.Unknown as e:
#         logging.error(f"Unknown gRPC error: {e}")
#     except Exception as e:
#         logging.error(f"Error: {e}", exc_info=True)
#
# start_server = websockets.serve(transcribe_audio, "localhost", 8765)
#
# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()