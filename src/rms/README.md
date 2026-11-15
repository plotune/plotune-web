# RMS route

`/rms` and `/rms/:workspaceId/:projectId` open the RMS browser workspace (requirement RMS-V2-001-001) inside the site, with the account session: no second login. The RMS app itself is the vendored client in `public/rms-app/`; this folder is the page around it.

- `RmsWorkspace.jsx`: the route, full screen like `/stream/workspace` (no site header, footer or bar; `App.js` hides the layout for `/rms` and `/rms/*`). Signed out goes to `/login?next=...` and back. The RMS-enabled projects of every workspace come from the workspace API and are handed to the app as its own project switcher (`switcher`, grouped by workspace; selecting one navigates to `/rms/:workspace/:project`; `manageHref` is the workspace page). `/rms` opens the last used project (localStorage, checked against the account's projects) or the first. The page requests one RMS claim (`src/workspaces/claims.js`, memory only, renewed on use) and mounts the module with `apiBase` `https://rms.plotune.net`; it unmounts it when the project or route changes. Full-screen states: loading, empty ("No project has RMS enabled"), project unavailable, claim 401 / `onSessionEnd` (sign in again), 403, 503 and network (retry), module load failure (retry).
- `embed.js`: imports the unhashed `public/rms-app/rms-loader.js` at runtime (`webpackIgnore`); `loadRms` reads `manifest.json`, attaches the scoped stylesheet and retries a failed load, so a new vendored build needs no code change. The app reports `onSessionEnd` (sign in again) and `onError` (error state).
- `rms.css`: the full-viewport page and the full-screen states.

## Updating the vendored client

```sh
# in plotune-cloud
npm --prefix services/rms run build:embed
# here
node scripts/update-rms-embed.cjs <plotune-cloud>/services/rms/dist-embed
```

The script replaces `public/rms-app/` with the build unchanged (loader, `manifest.json`, hashed module and CSS scoped under `.rms-mount`, logo, font, licence) and records the plotune-cloud commit in `VERSION`. Review the diff of `public/rms-app/` before committing.

Constraints from the embed: the site must not set a Content-Security-Policy that blocks inline styles (the embed sets its diagram frame's own meta policy and detects a host `meta http-equiv` policy), and RMS views inside the app use the hash (`#/<product>/<view>`), so the site's scroll handling ignores `#/...` hashes.

`/rms` is an authenticated app route: it is not prerendered, carries `noindex`, and `scripts/check-agent-content.cjs` fails if it appears in the agent exports.
