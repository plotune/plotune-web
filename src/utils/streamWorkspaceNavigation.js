// Only this same-site route may be carried through login, including its shared-resource IDs.
export function streamWorkspaceReturn(value) {
  if (typeof value !== "string" || !/^\/stream\/workspace(?:\?|$)/.test(value))
    return null;
  const url = new URL(value, "https://www.plotune.net");
  if (
    url.origin !== "https://www.plotune.net" ||
    url.pathname !== "/stream/workspace"
  )
    return null;
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
