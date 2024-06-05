import React from "react";
import {Typography, Button } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";

const Header = ({}) => {
  return (
    <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
      <a href="/" style={{ textDecoration: "none" }}>
        <Button size="small">Home</Button>
      </a>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        sx={{ flex: 1 }}
      >
        Interview Assistant
      </Typography>

      <a href="/" style={{ textDecoration: "none" }}>
        <Button size="small">Login</Button>
      </a>
    </Toolbar>
  );
};

export default Header;
