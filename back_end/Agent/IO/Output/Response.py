import os
import openai
from openai import OpenAI
from ...Utils.ReadSettings import read_user_settings, get_prompt
import logging
from threading import Thread
import uuid
from flask import current_app
from flask import Blueprint, request, jsonify

openai.api_key = os.environ["OPENAI_API_KEY"]
client = OpenAI(
    api_key = openai.api_key
)

ai_responses = {}
Response = Blueprint('Response', __name__)

def get_GPT_response(request, prompt_path = None):
    rtn = ""

    if (prompt_path is not None):
        prompt = get_prompt(prompt_path)
    else:
        prompt = ""
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt + request }
            ],
            model = "gpt-4-1106-preview"
        )
        rtn = response.choices[0].message.content
    except Exception as e:
        print(f"An Error occurred: {e}")

    return rtn


def get_ai_stream_repsonse(userRequest, request_id, prompt_path = None):
    prompt = ""
    response_content = ""

    if prompt_path:
        prompt = get_prompt(prompt_path)
    try:
        for chunk in client.chat.completions.create(
            messages=[
                    {
                        "role": "user",
                        "content": prompt + userRequest 
                    }
            ],
            model="gpt-4-1106-preview",
            stream= True,
            ):
            content = chunk.choices[0].delta.content
            if content:
                response_content += content
                ai_responses[request_id] = ("generating", response_content)
        
        ai_responses[request_id] = ("finished", response_content)
    except Exception as e:
        print(f"An error occurred on Chatgpt: {e}")
        return None

def response_AI(request, request_id, app):
    with app.app_context():
        response = get_ai_stream_repsonse(request, request_id, prompt_path = None)
        return response
    
@Response.route('/response', methods=['POST'])
def get_response():
    data = request.json
    transcript = data.get('transcript')
    
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    
    app = current_app._get_current_object()

    request_id = str(uuid.uuid4())
    Thread(target=response_AI, args=(transcript, request_id, app)).start()
    return jsonify({'request_id': request_id})

@Response.route('/response_by_id/<request_id>', methods=['GET'])
def get_response_by_id(request_id):
    if request_id in ai_responses:
        response_message = ai_responses.pop(request_id)
        return jsonify({'message': response_message[0], 'content': response_message[1]})
    else:
        logging.error('Ai Pending')
        return jsonify({'message': 'pending'})