import io
import threading
from queue import Queue
from time import sleep
import speech_recognition as sr
from translate import Translator
from datetime import datetime, timedelta

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from Agent.IO.Output.Response import Response
from Agent.IO.Output.Translation import translate_text
from Agent.IO.Input.input import get_source_recoder, capture_and_save_audio_background, speech_to_text
from Agent.Utils.ReadSettings import create_data_folder, read_voice_settings
from Agent.Utils.SaveFile import save_audio, save_transcription, save_settings


app = Flask(__name__)
CORS(app)
app.register_blueprint(Response)
settings = read_voice_settings() 
socketio = SocketIO(app, cors_allowed_origins="*")
translator = Translator(to_lang="zh")

data_buffer = Queue()
stop_event = threading.Event()

def generate_transcription(source, last_sample):
    audio_data = sr.AudioData(last_sample, source.SAMPLE_RATE, source.SAMPLE_WIDTH)
    wav_data = io.BytesIO(audio_data.get_wav_data())

    file_path = save_audio(wav_data)

    transcription = speech_to_text(file_path)
    translation = translate_text(transcription)
    save_transcription(transcription, "User")
    return transcription, translation

def transcription_loop(source, phrase_timeout):
    global data_buffer
    last_sample = bytes()
    phrase_time = None
    transcription_history = []
    translate_history = []

    prev_transcription = ""
    prev_translation = ""

    while not stop_event.is_set():
        now = datetime.utcnow()
        try:
            now = datetime.utcnow()
            if not data_buffer.empty():
                if (phrase_time and now - phrase_time >  timedelta(seconds=phrase_timeout)):
                    prev_transcription = prev_transcription.strip('\n')
                    prev_translation = prev_translation.strip('\n')
                    transcription_history.append(prev_transcription)
                    translate_history.append(prev_translation)
                    last_sample = bytes()

                phrase_time = now

                while not data_buffer.empty():
                    data = data_buffer.get()
                    last_sample += data
                
                transcription, translation = generate_transcription(source, last_sample)
                prev_transcription = transcription
                prev_translation = translation

                socketio.emit('transcription', {'text': (" ").join(transcription_history) + transcription, 
                                                'translation': (" ").join(translate_history) + translation})
        
        except KeyboardInterrupt:
            break
            
        sleep(1)

@app.route('/update_settings', methods=['POST'])
def update_settings():
    global settings
    new_settings = request.json
    settings.update(new_settings)
    save_settings(new_settings)
    return jsonify({"status": "success", "updated_settings": settings}), 200

@socketio.on('start_recording')
def start_recording():
    global data_buffer
    stop_event.clear()
    source, recorder, record_timeout, phrase_timeout, pause_threshold = get_source_recoder()
    # recorder.
    stop_listening = capture_and_save_audio_background(data_buffer, source, recorder, record_timeout)
    threading.Thread(target=transcription_loop, args=(source, phrase_timeout)).start()


@socketio.on('stop_recording')
def stop_recording():
    global stop_event
    global data_buffer
    stop_event.set()
    data_buffer = Queue()
    emit('stopped', {'data': 'Recording stopped, processing final transcript...'})

if __name__ == '__main__':
    create_data_folder()
    socketio.run(app, debug=True)