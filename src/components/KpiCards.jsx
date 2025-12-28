import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function KpiCard({ title, value, hint }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {hint}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function KpiCards({ items }) {
  const totalSkus = items.length;
  const totalUnits = items.reduce((sum, it) => sum + it.stock, 0);
  const lowStock = items.filter((it) => it.stock < it.reorderLevel).length;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <KpiCard title="Total SKUs" value={totalSkus} hint="Unique products" />
      </Grid>
      <Grid item xs={12} md={4}>
        <KpiCard title="Units in stock" value={totalUnits} hint="Sum of all stock" />
      </Grid>
      <Grid item xs={12} md={4}>
        <KpiCard title="Low stock" value={lowStock} hint="Needs attention" />
      </Grid>
    </Grid>
  );
}
