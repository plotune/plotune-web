import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiDownload } from "react-icons/fi";
import { createFilteredExport } from "./exportModel";

const safeName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";

export default function ExportMenu({ events, query, projectName, createExport }) {
  const active = useRef(null);
  const timers = useRef([]);
  useEffect(() => () => { active.current?.abort(); timers.current.forEach(clearTimeout); }, []);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  const run = async (format) => {
    setOpen(false); setError(""); setProgress({ done: 0, total: null });
    const controller = new AbortController(); active.current = controller;
    try {
      const result = createExport ? await createExport(format, (done, total) => { if (!controller.signal.aborted) setProgress({ done, total }); }, controller.signal) : await createFilteredExport(events, query, format, (done, total) => { if (!controller.signal.aborted) setProgress({ done, total }); });
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `plotune-stream-${safeName(projectName)}-${new Date().toISOString().slice(0, 10)}.${format}`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setProgress({ done: result.count, total: result.count, complete: true });
      timers.current.push(window.setTimeout(() => setProgress(null), 3500));
      active.current = null;
    } catch (cause) {
      if (controller.signal.aborted) return;
      active.current = null;
      setError(cause.message || "Export failed. Try again."); setProgress(null);
    }
  };

  return (
    <div className="mvp-export-menu">
      <button className="sw-button" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} disabled={!!progress}>
        <FiDownload /> Export <FiChevronDown />
      </button>
      {open && <>
        <button className="mvp-popover-dismiss" aria-label="Close export menu" onClick={() => setOpen(false)} />
        <div className="mvp-export-options" role="menu" aria-label="Export matching events">
          {["json", "csv", "tsv"].map((format) => <button role="menuitem" key={format} type="button" onClick={() => run(format)}>{format.toUpperCase()}</button>)}
        </div>
      </>}
      {progress && <span className="mvp-export-status" role="status">{progress.complete ? `Exported ${progress.done} matching events` : progress.total === null ? `Retrieved ${progress.done} matching events…` : `Preparing ${progress.done} / ${progress.total} events…`}</span>}
      {progress && active.current && <button className="sw-link" onClick={() => { active.current?.abort(); active.current = null; setProgress(null); }}>Cancel</button>}
      {error && <span className="mvp-export-status error" role="alert">{error}</span>}
    </div>
  );
}
