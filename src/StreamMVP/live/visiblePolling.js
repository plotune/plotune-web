// No background-tab requests; resuming a visible page refreshes once immediately.
// Wait for a request to finish before scheduling another one.
export function pollWhileVisible(load, interval) {
  let stopped = false, running = false, timer;
  const run = async () => {
    clearTimeout(timer);
    if (stopped || running || document.visibilityState === "hidden") return;
    running = true;
    try { await load(); }
    finally {
      running = false;
      if (!stopped && document.visibilityState !== "hidden") timer = setTimeout(run, interval);
    }
  };
  const changed = () => {
    clearTimeout(timer);
    if (document.visibilityState !== "hidden") run();
  };
  document.addEventListener("visibilitychange", changed);
  run();
  return () => { stopped = true; clearTimeout(timer); document.removeEventListener("visibilitychange", changed); };
}
