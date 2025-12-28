function escapeCsvValue(value) {
  const s = String(value ?? "");
  const needsQuotes = /[",\n]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function rowsToCsv(rows, columns) {
  const header = columns.map((c) => escapeCsvValue(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsvValue(row[c.key])).join(","))
    .join("\n");
  return `${header}\n${body}\n`;
}

export function downloadTextFile(filename, text, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
