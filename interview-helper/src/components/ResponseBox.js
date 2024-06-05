import React, { useState } from "react";
import { Paper, Box, Tabs, Tab, IconButton, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

const ResponseBox = ({ response, getResponse, responseStatus }) => {
  const [tabValue, setTabValue] = useState(0);
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
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Tabs value={tabValue} centered>
          <Tab value={0} label="Response" />
        </Tabs>
        <IconButton onClick={getResponse} color="default">
          <Send />
        </IconButton>
      </Box>
      {responseStatus === "empty" || responseStatus === "pending" ? (
        <Box
          style={{
            height: "90%",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{ color: "gray", textAlign: "center", width: "100%" }}
          >
            {response}
          </Typography>
        </Box>
      ) : (
        <Box
          style={{
            height: "90%",
            overflowY: "auto",
          }}
          paddingX={"2%"}
        >
          <ReactMarkdown style={{ width: "100%" }}>{response}</ReactMarkdown>
        </Box>
      )}
    </Paper>
  );
};

export default ResponseBox;
