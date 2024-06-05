from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from queue import Queue
from datetime import datetime
from Agent.IO.Input.input import get_source_recoder, capture_and_save_audio_background, speech_to_text
from Agent.IO.Output.Response import Response
from Agent.Utils.SaveFile import save_audio, save_transcription
import threading
from time import sleep
import speech_recognition as sr
import io
from translate import Translator

app = Flask(__name__)
CORS(app)
app.register_blueprint(Response)

socketio = SocketIO(app, cors_allowed_origins="*")
translator = Translator(to_lang="zh")

data_queue = Queue()
data_buffer = []
transcript_record = ""

stop_event = threading.Event()

def translate_text(text):
    translation = translator.translate(text)
    return translation

@socketio.on('start_recording')
def start_recording():
    global data_buffer
    stop_event.clear()
    source, recorder, record_timeout, _ = get_source_recoder()
    stop_listening = capture_and_save_audio_background(data_buffer, source, recorder, record_timeout)
    threading.Thread(target=transcription_loop, args=(source,)).start()

def transcription_loop(source):
    global stop_event
    global data_buffer
    last_sample = bytes()
    while not stop_event.is_set():
        try:
            if data_buffer != []:
                for data in data_buffer:
                    last_sample += data
                
                audio_data = sr.AudioData(last_sample, source.SAMPLE_RATE, source.SAMPLE_WIDTH)
                wav_data = io.BytesIO(audio_data.get_wav_data())

                file_path = save_audio(wav_data)

                transcription = speech_to_text(file_path)
                translated_text = translate_text(transcription)
                save_transcription(transcription, "User")
                print(transcription)
                socketio.emit('transcription', {'text': transcription, 'translation': translated_text})
                last_sample = bytes()
        except KeyboardInterrupt:
            break
            
        sleep(0.5)

@socketio.on('stop_recording')
def stop_recording():
    global stop_event
    global data_buffer
    stop_event.set()
    data_buffer = []
    emit('stopped', {'data': 'Recording stopped, processing final transcript...'})

if __name__ == '__main__':
    socketio.run(app, debug=True)