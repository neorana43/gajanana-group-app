export function downloadCSV(data: object[], filename = "data.csv") {
  if (!data || data.length === 0) return;

  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(","), // header
    ...data.map((row) =>
      keys.map((k) => JSON.stringify(row[k] ?? "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
