import { getMatchingEventPages } from "./eventQueryService";

test("mock retrieval yields cursor-sized pages from the shared query result", async () => {
  const events = Array.from({ length: 5 }, (_, index) => ({
    id: String(index), event: "sample", timestamp: `2026-10-08T09:0${index}:00Z`, properties: { keep: index % 2 === 0 },
  }));
  const pages = [];
  for await (const page of getMatchingEventPages(events, {
    range: "all", now: "2026-10-08T10:00:00Z", conditions: [{ path: "keep", operator: "is_true" }],
  }, { pageSize: 2 })) pages.push(page);

  expect(pages.map((page) => page.items.map((event) => event.id))).toEqual([["4", "2"], ["0"]]);
  expect(pages[0].nextCursor).toEqual({ id: "2", timestamp: "2026-10-08T09:02:00Z" });
  expect(pages[1].nextCursor).toBeNull();
});
