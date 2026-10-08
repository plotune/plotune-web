import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { createFilteredExport } from "./exportModel";

function safeName(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
}

export default function ExportEvents({ events, query, projectName }) {
  const [format, setFormat] = useState("csv");
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  const exportEvents = async () => {
    setError("");
    setProgress({ done: 0, total: null });
    try {
      const result = await createFilteredExport(events, query, format, (done, total) => setProgress({ done, total }));
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `plotune-stream-${safeName(projectName)}-${new Date().toISOString().slice(0, 10)}.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
      setProgress({ done: result.count, total: result.count });
      window.setTimeout(() => setProgress(null), 3500);
    } catch (cause) {
      setError(cause.message || "Export failed. Try again.");
      setProgress(null);
    }
  };

  return (
    <div className="mvp-export">
      <label>Export format
        <select value={format} onChange={(event) => setFormat(event.target.value)} aria-label="Export format">
          <option value="json">JSON</option><option value="tsv">TSV</option><option value="csv">CSV</option>
        </select>
      </label>
      <button className="sw-button" type="button" onClick={exportEvents} disabled={!!progress}>
        <FiDownload /> {progress ? "Preparing…" : "Export"}
      </button>
      {progress && progress.total !== null && (
        <progress aria-label="Export progress" max={Math.max(progress.total, 1)} value={progress.done} />
      )}
      {progress && progress.total === null && <span role="status">Preparing matching events…</span>}
      {progress && progress.total !== null && <span role="status">{progress.done} matching events exported</span>}
      {error && <span role="alert">{error}</span>}
      <span className="mvp-export-note">Frontend preview export · all matches, not just this page</span>
    </div>
  );
}
