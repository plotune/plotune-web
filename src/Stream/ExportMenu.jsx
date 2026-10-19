import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiDownload } from "react-icons/fi";
import { createFilteredExport } from "./exportModel";

const safeName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";

export default function ExportMenu({ events, query, projectName, createExport }) {
  const active = useRef(null);
  const trigger = useRef(null);
  const menu = useRef(null);
  const [position, setPosition] = useState({});
  const closeMenu = () => { setOpen(false); trigger.current?.focus(); };
  const timers = useRef([]);
  useEffect(() => () => { active.current?.abort(); timers.current.forEach(clearTimeout); }, []);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const anchor = trigger.current?.getBoundingClientRect();
      const popup = menu.current?.getBoundingClientRect();
      if (!anchor || !popup) return;
      const below = anchor.bottom + 7;
      setPosition({ position: "fixed", left: Math.max(12, Math.min(anchor.right - popup.width, window.innerWidth - popup.width - 12)), top: below + popup.height <= window.innerHeight - 12 ? below : Math.max(12, anchor.top - popup.height - 7) });
    };
    place();
    menu.current?.querySelector('[role="menuitem"]')?.focus();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open]);
  const onMenuKeyDown = (event) => {
    if (!open || !menu.current) return;
    if (event.key === "Escape") { event.preventDefault(); closeMenu(); }
    if (event.key === "Tab") closeMenu();
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const items = [...menu.current.querySelectorAll('[role="menuitem"]')];
      const index = items.indexOf(document.activeElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
      items[next]?.focus();
    }
  };
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  const run = async (format) => {
    closeMenu(); setError(""); setProgress({ done: 0, total: null });
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
    <div className="st-export-menu" onKeyDown={onMenuKeyDown}>
      <button ref={trigger} className="sw-button" type="button" aria-haspopup="menu" aria-expanded={open} onKeyDown={(event) => { if (["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); setOpen(true); } }} onClick={() => setOpen((value) => !value)} disabled={!!progress}>
        <FiDownload /> Export <FiChevronDown />
      </button>
      {open && <>
        <button className="st-popover-dismiss" aria-label="Close export menu" tabIndex={-1} onClick={closeMenu} />
        <div ref={menu} style={position} className="st-export-options" role="menu" aria-label="Export matching events">
          {["json", "csv", "tsv"].map((format) => <button role="menuitem" tabIndex={-1} key={format} type="button" onClick={() => run(format)}>{format.toUpperCase()}</button>)}
        </div>
      </>}
      {progress && <span className="st-export-status" role="status">{progress.complete ? `Exported ${progress.done} matching events` : progress.total === null ? `Retrieved ${progress.done} matching events…` : `Preparing ${progress.done} / ${progress.total} events…`}</span>}
      {progress && active.current && <button className="sw-link" onClick={() => { active.current?.abort(); active.current = null; setProgress(null); }}>Cancel</button>}
      {error && <span className="st-export-status error" role="alert">{error}</span>}
    </div>
  );
}
