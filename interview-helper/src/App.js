import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { Container, Grid } from "@mui/material";
import TranscriptBox from "./components/TranscriptBox";
import ResponseBox from "./components/ResponseBox";
import io from 'socket.io-client';
import "./App.css";
import Header from "./components/Header";
import { theme } from "./theme";

const API_BASE_URL = "http://127.0.0.1:5000";
const socket = io(API_BASE_URL);

const defaultSettings = {
  record_timeout: 4,
  phrase_timeout: 3,
  energy_threshold: 1000,
  sample_rate: 16000,
};

function App() {
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [translatedHistory, setTranslatedHistory] = useState([]);
  const [response, setResponse] = useState("Click Send to Receive Response");
  const [responseStatus, setResponseStatus] = useState("empty");
  const [isRecording, setIsRecording] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    socket.on("transcription", (data) => {
      setTranscriptHistory((prevTranscriptHistory) => {
        if (prevTranscriptHistory.length === 0) {
          return [...prevTranscriptHistory, { text: data.text, isUser: true }];
        } else {
          const newTranscriptHistory = prevTranscriptHistory.slice(
            0,
            prevTranscriptHistory.length - 1
          );
          return [...newTranscriptHistory, { text: data.text, isUser: true }];
        }
      });

      setTranslatedHistory((prevTranslatedHistory) => {
        if (prevTranslatedHistory.length === 0) {
          return [
            ...prevTranslatedHistory,
            { text: data.translation, isUser: true },
          ];
        } else {
          const newTranslatedHistory = prevTranslatedHistory.slice(
            0,
            prevTranslatedHistory.length - 1
          );
          return [
            ...newTranslatedHistory,
            { text: data.translation, isUser: true },
          ];
        }
      });


    });

    socket.on("stopped", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("transcription");
      socket.off("stopped");
    };
  }, []);


  const getResponse = async () => {
    console.log("getResponse button clicked");
    if (transcriptHistory.length === 0) return;

    const lastTranscript = transcriptHistory[transcriptHistory.length - 1].text;

    const response = await fetch(`${API_BASE_URL}/response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: lastTranscript }),
    });

    const { request_id } = await response.json();
    pollForResponse(request_id);
  };

  const pollForResponse = async (request_id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/response_by_id/${request_id}`
      );
      const result = await response.json();

      if (response.ok) {
        if (result.message === "finished") {
          setResponse(result.content); 
          setResponseStatus("finished");
        } else if (result.message === "pending") {
          // If the status is pending, poll again after a delay
          setTimeout(() => pollForResponse(request_id), 1000);
          setResponse("Generating ..."); 
          setResponseStatus("pending");
        } else if (result.message === "generating") {
          setResponseStatus("generating");
          setResponse(result.content); 
          setTimeout(() => pollForResponse(request_id), 1000);
        }
        else {
          console.error("Unexpected status received:", result.message);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch response:", error);
      setResponse("Failed to get response. Please try again.");
    }
  };

  const toggleRecording = () => {
    const currentlyRecording = isRecording;
    setIsRecording(!currentlyRecording);

    if (! isRecording) {
      setTranscriptHistory((prevHistory) => [
        ...prevHistory,
        { text: "", isUser: true },
      ]);

      setTranslatedHistory((prevHistory) => [
        ...prevHistory,
        { text: "", isUser: true },
      ]);
    }
    socket.emit(currentlyRecording ? "stop_recording" : "start_recording");
  };

  const applySettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      const response = await fetch(`${API_BASE_URL}/update_settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header settings={settings} onApplySettings={applySettings} />
      <Container style={{ marginTop: "25px" }} maxWidth="lg">
        <Grid container spacing={2} style={{ height: "88vh" }}>
          <Grid item xs={12} md={5} style={{ display: "flex", height: "100%" }}>
            <TranscriptBox
              transcriptHistory={transcriptHistory}
              translatedHistory={translatedHistory}
              toggleRecording={toggleRecording}
              isRecording={isRecording}
            />
          </Grid>

          <Grid item xs={12} md={7} style={{ display: "flex", height: "100%" }}>
            <ResponseBox
              response={response}
              getResponse={getResponse}
              responseStatus={responseStatus}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
