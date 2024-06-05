import React, { useState } from 'react';
import {
  Drawer,
  Button,
  Slider,
  Typography,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#0a84ff" : "#007bff",
  height: 5,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
    "&:before": {
      boxShadow:
        "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: 0,
    backgroundColor: "unset",
    color: theme.palette.text.primary,
    "&::before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    height: 5,
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    boxShadow: "inset 0px 0px 4px -2px #000",
    backgroundColor: "#d0d0d0",
  },
}));


const Sidebar = ({ open, onClose, settings, onApply }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSliderChange = (key) => (event, value) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localSettings);
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box style={{ width: 390, padding: 20 }}>
        <Typography variant="h5">Translate Settings</Typography>
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        <Box marginY={2}>
          <FormControl fullWidth disabled>
            <InputLabel>Source Language</InputLabel>
            <Select value="English">
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Japanese">Japanese</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2, mb: 4 }}>
          <FormControl fullWidth disabled>
            <InputLabel>Target Language</InputLabel>
            <Select value="Chinese">
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Japanese">Japanese</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant="h5">Voice Settings</Typography>
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Record Timeout:</Typography>
          <IOSSlider
            value={localSettings.record_timeout}
            onChange={handleSliderChange("record_timeout")}
            min={1}
            max={10}
            step={1}
            valueLabelDisplay="on"
            sx={{ mt: 1 }}
          />
        </Box>
        <Box>
          <Typography gutterBottom>Phrase Timeout:</Typography>
          <IOSSlider
            value={localSettings.phrase_timeout}
            onChange={handleSliderChange("phrase_timeout")}
            min={1}
            max={10}
            step={1}
            sx={{ mt: 1 }}
            valueLabelDisplay="on"
          />
        </Box>
        <Box>
          <Typography gutterBottom>Energy Threshold:</Typography>
          <IOSSlider
            value={localSettings.energy_threshold}
            onChange={handleSliderChange("energy_threshold")}
            min={100}
            max={2000}
            step={100}
            sx={{ mt: 1 }}
            valueLabelDisplay="on"
          />
        </Box>
        <Box>
          <Typography gutterBottom>Sample Rate:</Typography>
          <IOSSlider
            value={localSettings.sample_rate}
            onChange={handleSliderChange("sample_rate")}
            min={8000}
            max={48000}
            step={2000}
            sx={{ mt: 1 }}
            valueLabelDisplay="on"
          />
        </Box>
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
