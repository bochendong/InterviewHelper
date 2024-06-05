import React, { useState } from "react";
import { Typography, Button, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "./SideBar";

const Header = ({ settings, onApplySettings }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Button size="small" onClick={handleMenuClick}>
        <MenuIcon />
      </Button>
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
      <SideBar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
        settings={settings}
        onApply={onApplySettings}
      />
    </Toolbar>
  );
};

export default Header;
