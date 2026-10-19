import { pollWhileVisible } from "./visiblePolling";
let visibility;
beforeEach(() => { jest.useFakeTimers(); visibility = "visible"; Object.defineProperty(document, "visibilityState", { configurable: true, get: () => visibility }); });
afterEach(() => { delete document.visibilityState; jest.useRealTimers(); });
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
test("polling stops in hidden tabs and resumes once immediately without overlapping requests", async () => {
  let finish;
  const load = jest.fn().mockResolvedValue(undefined);
  const stop = pollWhileVisible(load, 60000);
  await flush(); expect(load).toHaveBeenCalledTimes(1);
  visibility = "hidden"; document.dispatchEvent(new Event("visibilitychange"));
  jest.advanceTimersByTime(10 * 60000); await flush(); expect(load).toHaveBeenCalledTimes(1);
  load.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  visibility = "visible"; document.dispatchEvent(new Event("visibilitychange"));
  document.dispatchEvent(new Event("visibilitychange")); expect(load).toHaveBeenCalledTimes(2);
  jest.advanceTimersByTime(60000); await flush(); expect(load).toHaveBeenCalledTimes(2);
  finish(); await flush(); jest.advanceTimersByTime(60000); await flush(); expect(load).toHaveBeenCalledTimes(3);
  stop(); jest.advanceTimersByTime(60000); await flush(); expect(load).toHaveBeenCalledTimes(3);
});
test("an initially hidden page performs no requests until it becomes visible", async () => {
  visibility = "hidden"; const load = jest.fn().mockResolvedValue(undefined), stop = pollWhileVisible(load, 5000);
  jest.advanceTimersByTime(60000); expect(load).not.toHaveBeenCalled();
  visibility = "visible"; document.dispatchEvent(new Event("visibilitychange")); await flush(); expect(load).toHaveBeenCalledTimes(1);
  stop();
});
