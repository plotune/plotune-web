// Only these same-site routes may be carried through login. The workspace keeps its
// shared-resource IDs; the MCP consent page keeps only its opaque signed request blob.
export function streamWorkspaceReturn(value) {
  if (typeof value !== "string" || !/^\/stream\/(?:workspace|authorize)(?:\?|$)/.test(value))
    return null;
  const url = new URL(value, "https://www.plotune.net");
  if (url.origin !== "https://www.plotune.net")
    return null;
  if (url.pathname === "/stream/authorize") {
    const request = url.searchParams.get("request");
    return request ? `/stream/authorize?request=${encodeURIComponent(request)}` : "/stream/authorize";
  }
  const params = new URLSearchParams();
  ["project", "view", "dashboard", "filter"].forEach((key) => {
    if (url.searchParams.get(key)) params.set(key, url.searchParams.get(key));
  });
  const query = params.toString();
  return `/stream/workspace${query ? `?${query}` : ""}`;
}
export function streamWorkspaceLogin(search = "") {
  return `/login?next=${encodeURIComponent(streamWorkspaceReturn(`/stream/workspace${search}`) || "/stream/workspace")}`;
}
