# InterviewPal

<h1 align="center">
  <img src="./Image/00.png" width="800">
</h1>

<h4 align="center">💁‍♀️ Your new best friend</h4>

<p align="center">
  <a href=""><img src="https://img.shields.io/badge/license-MIT-blue.svg?label=License&style=flat" /></a>
  <a href=""><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" /></a>
  <br>
</p>

## 👋 Introduction

Welcome to InterviewPal, your real-time interview assistant designed to streamline the interview process. InterviewPal leverages advanced speech recognition and natural language processing technologies to transcribe interviews in real-time, translate them, and provide instant feedback using OpenAI's GPT-3.5 API. This tool is perfect for interviewers, recruiters, and HR professionals looking to enhance their interview experience with cutting-edge AI technology.

## Why Us?

**Real-Time Transcription:** Get instant and accurate transcriptions of your interviews, making it easier to focus on the conversation rather than taking notes.
Multi-Language Support: Translate your transcriptions to multiple languages on the fly, breaking language barriers and expanding your reach.

**AI-Powered Insights:** Utilize OpenAI's powerful GPT-4 to get real-time responses and insights, helping you to quickly evaluate candidate responses and make informed decisions.
User-Friendly Interface: Our intuitive and easy-to-use interface ensures you can start using InterviewPal with minimal setup and training

## 🚀 Getting Started
### Prerequisites

- Python 3.6+
- Node.js 14+
- Flask
- Flask-SocketIO
- Flask-CORS
- SpeechRecognition
- Google-Cloud-Translate
- OpenAI
- React
- Material-UI
- Socket.IO

### Setup
Clone the Repository

```bash
git clone https://github.com/bochendong/interviewpal.git
```

#### Backend

1. Navigate to the Backend Directory
    ```bash
    git clone https://github.com/yourusername/interviewpal.git
    cd interviewpal/backend
    ```

2. Create a Virtual Environment and Install Dependencies
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.tx
    ```

3. Set Up OpenAI Environment Key: follow the openai offical document. [Click Here](https://platform.openai.com/docs/quickstart)

4. Run the Backend Server
    ```
    python3 app.py
    ```

#### Frontend
Navigate to the Frontend Directory

1. Navigate to the Frontend Directory
    ```
    cd interviewer-helper
    ```

2. Install Dependencies
    ```
    npm install
    ```

3. Start the React App
    ```
    npm start
    ```

4. Your application should now be running at http://localhost:3000



## Usage

1. **Start Recording**: Click the "Start Recording" button to begin transcribing the interview in real-time.
2. **Stop Recording**: Click the "Stop Recording" button to stop the transcription and process the final transcript.
3. **Get Response**: Click the "Get Response" button to get AI-powered insights and responses based on the most recent transcrition.
4. Translate: Use the translation feature to translate the transcriptions into the desired language.

## 👨 Contributors

We welcome contributions to enhance InterviewPal. Feel free to open issues or submit pull requests on GitHub.

<table>
  <tbody>
        <td align="center" valign="middle" width="128">
         <a href="https://github.com/bochendong">
          <img src="https://github.com/bochendong.png?size=128" />
          Bochen Dong
        </a>
        <br>
        <sub><sup>Team Leader</sup></sub>
      </td>
  </tbody>
</table>


## 📝 License

[MIT License](https://github.com/leon-ai/leon/blob/develop/LICENSE.md)