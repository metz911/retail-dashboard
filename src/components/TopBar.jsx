import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function TopBar({ mode, onToggleMode }) {
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Retail Inventory & Analytics
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
          <IconButton color="inherit" onClick={onToggleMode}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
