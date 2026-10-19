import { queryEvents } from "./filterModel";

// Frontend-only source boundary. A production adapter can yield cursor pages
// with the same matching semantics without changing Explorer or export UI.
export async function* getMatchingEventPages(events, query, { pageSize = 250 } = {}) {
  const matching = queryEvents(events, query);
  for (let offset = 0; offset < matching.length; offset += pageSize) {
    yield {
      items: matching.slice(offset, offset + pageSize),
      total: matching.length,
      nextCursor: offset + pageSize < matching.length
        ? { id: matching[offset + pageSize - 1].id, timestamp: matching[offset + pageSize - 1].timestamp }
        : null,
    };
  }
  if (!matching.length) yield { items: [], total: 0, nextCursor: null };
}
