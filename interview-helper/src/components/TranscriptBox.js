import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Mic, MicOff } from "@mui/icons-material";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const TranscriptBox = ({
  transcriptHistory,
  translatedHistory,
  toggleRecording,
  isRecording,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef();

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptHistory, translatedHistory]);

  return (
    <Paper
      elevation={3}
      style={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      ref={scrollRef}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Tabs value={tabIndex} onChange={handleChange} centered>
          <Tab label="Transcript" />
          <Tab label="Translate" />
        </Tabs>
        <IconButton onClick={toggleRecording} color="primary">
          {isRecording ? <PauseCircleIcon /> : <Mic />}
        </IconButton>
      </Box>
      <Box style={{ height: "90%", overflowY: "auto" }}>
        {tabIndex === 0 && (
          <List>
            {transcriptHistory.map((transcript, index) => (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: transcript.isUser ? "flex-start" : "flex-end",
                }}
              >
                <Paper
                  style={{
                    padding: "8px",
                    backgroundColor: transcript.isUser ? "#e1f5fe" : "#ffffff",
                    borderRadius: "16px",
                    maxWidth: "80%",
                  }}
                >
                  <ListItemText primary={transcript.text} />
                </Paper>
              </ListItem>
            ))}
          </List>
        )}
        {tabIndex === 1 && (
          <List>
            {translatedHistory.map((transcript, index) => (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: transcript.isUser ? "flex-start" : "flex-end",
                }}
              >
                <Paper
                  style={{
                    padding: "8px",
                    backgroundColor: transcript.isUser ? "#e1f5fe" : "#ffffff",
                    borderRadius: "16px",
                    maxWidth: "80%",
                  }}
                >
                  <ListItemText primary={transcript.text} />
                </Paper>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default TranscriptBox;
