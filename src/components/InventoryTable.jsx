import { useMemo, useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TableSortLabel from "@mui/material/TableSortLabel";
import DownloadIcon from "@mui/icons-material/Download";

import { downloadTextFile, rowsToCsv } from "../utils/csv";

const COLUMNS = [
  { key: "sku", label: "SKU", sortable: true },
  { key: "name", label: "Product", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
  { key: "reorderLevel", label: "Reorder level", sortable: true },
  { key: "price", label: "Price (€)", sortable: true }
];

function compare(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export default function InventoryTable({ items }) {
  const [query, setQuery] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [orderBy, setOrderBy] = useState("stock");
  const [order, setOrder] = useState("asc"); // "asc" | "desc"

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((it) => {
      const isLow = it.stock < it.reorderLevel;
      if (lowOnly && !isLow) return false;

      if (!q) return true;

      return (
        it.sku.toLowerCase().includes(q) ||
        it.name.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
      );
    });
  }, [items, query, lowOnly]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((x, y) => {
      const res = compare(x[orderBy], y[orderBy]);
      return order === "asc" ? res : -res;
    });
    return copy;
  }, [filtered, orderBy, order]);

  const onRequestSort = (key) => {
    if (orderBy === key) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  const onExport = () => {
    const rows = sorted.map((it) => ({
      ...it,
      price: it.price.toFixed(2)
    }));
    const csv = rowsToCsv(rows, COLUMNS);
    downloadTextFile("inventory.csv", csv);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Inventory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search, sort columns, and filter low-stock items.
          </Typography>

          <Box sx={{ mt: 1.5, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small"
              label="Search (SKU / name / category)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FormControlLabel
              control={<Switch checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />}
              label="Low stock only"
            />
            <Typography variant="body2" color="text.secondary">
              Showing {sorted.length} items
            </Typography>
          </Box>
        </Box>

        <Button variant="contained" startIcon={<DownloadIcon />} onClick={onExport}>
          Export CSV
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((c) => (
                <TableCell key={c.key} sx={{ fontWeight: 700 }}>
                  {c.sortable ? (
                    <TableSortLabel
                      active={orderBy === c.key}
                      direction={orderBy === c.key ? order : "asc"}
                      onClick={() => onRequestSort(c.key)}
                    >
                      {c.label}
                    </TableSortLabel>
                  ) : (
                    c.label
                  )}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted.map((it) => {
              const low = it.stock < it.reorderLevel;

              return (
                <TableRow
                  key={it.id}
                  hover
                  sx={{
                    ...(low && {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 90, 90, 0.12)"
                          : "rgba(255, 0, 0, 0.06)"
                    })
                  }}
                >
                  <TableCell>{it.sku}</TableCell>
                  <TableCell>{it.name}</TableCell>
                  <TableCell>{it.category}</TableCell>
                  <TableCell>{it.stock}</TableCell>
                  <TableCell>{it.reorderLevel}</TableCell>
                  <TableCell>{it.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {low ? (
                      <Chip size="small" color="warning" label="Low stock" />
                    ) : (
                      <Chip size="small" color="success" label="OK" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
