import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function groupByCategory(items) {
  const map = new Map();
  for (const it of items) map.set(it.category, (map.get(it.category) ?? 0) + it.stock);
  return [...map.entries()].map(([category, stock]) => ({ category, stock }));
}

export default function ChartsPanel({ items }) {
  const byCategory = groupByCategory(items);
  const lowStock = items.filter((it) => it.stock < it.reorderLevel);

  const barData = {
    labels: byCategory.map((x) => x.category),
    datasets: [{ label: "Units in stock", data: byCategory.map((x) => x.stock) }]
  };

  const doughnutData = {
    labels: lowStock.map((x) => x.name),
    datasets: [{ label: "Stock", data: lowStock.map((x) => x.stock) }]
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Stock by category
          </Typography>
          <Box sx={{ height: 320 }}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Low stock items
          </Typography>
          {lowStock.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items are below reorder level.
            </Typography>
          ) : (
            <Box sx={{ height: 320 }}>
              <Doughnut
                data={doughnutData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
