import { useEffect, useMemo, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";


import TopBar from "./components/TopBar";
import KpiCards from "./components/KpiCards";
import InventoryTable from "./components/InventoryTable";
import ChartsPanel from "./components/ChartsPanel";

import inventoryData from "./data/inventory.json";

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light");
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(inventoryData);
  }, []);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode }
      }),
    [mode]
  );

  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar mode={mode} onToggleMode={toggleMode} />

      <Container maxWidth="lg">
        <Box sx={{ py: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <KpiCards items={items} />
          <ChartsPanel items={items} />
          <InventoryTable items={items} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
