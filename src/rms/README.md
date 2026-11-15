# RMS route

`/rms` and `/rms/:workspaceId/:projectId` open the RMS browser workspace (requirement RMS-V2-001-001) inside the site, with the account session: no second login. The RMS app itself is the vendored client in `public/rms-app/`; this folder is the page around it.

- `RmsWorkspace.jsx`: the route. Signed out goes to `/login?next=...` and back. A workspace select (only when more than one has RMS) and a project select list the RMS-enabled projects from the workspace API; `/rms` opens the last used or first one. The page requests one RMS claim (`src/workspaces/claims.js`, memory only, renewed on use) and mounts the module with `apiBase` `https://rms.plotune.net`, `projectId` and `getClaim(refresh)`; it unmounts it when the project or route changes. States: loading, empty ("No project has RMS enabled"), project unavailable, claim 401 (session ended: sign in again), 403 (role or service off), 503 and network (retry), module load failure (retry).
- `embed.js`: loads the module and stylesheet named by `public/rms-app/manifest.json` at runtime (`import()` with `webpackIgnore`), so a new vendored build needs no code change. The stylesheet is attached only while a page is mounted.
- `rms.css`: lays the app out under the fixed 80 px header and the 64 px project bar (the app is built for a full-height page).

## Updating the vendored client

```sh
# in plotune-cloud
npm --prefix services/rms run build:embed
# here
node scripts/update-rms-embed.cjs <plotune-cloud>/services/rms/dist-embed
```

The script replaces `public/rms-app/`, writes `manifest.json` (the build's `.vite/` directory is a dot-directory that GitHub Pages and `gh-pages` skip), records the plotune-cloud commit in `VERSION`, and scopes the stylesheet to `.rms-mount`: the RMS build styles bare `button`, `a`, `h1`, `:root` and `body`, which would restyle the site header while RMS is open. Review the diff of `public/rms-app/` before committing.

Constraints from the embed: the site must not set a Content-Security-Policy that blocks inline styles (the embed sets its diagram frame's own meta policy and detects a host `meta http-equiv` policy), and RMS deep links inside the app use the hash (`#/<product>/<view>`), so the site's scroll handling ignores `#/...` hashes.

`/rms` is an authenticated app route: it is not prerendered, carries `noindex`, and `scripts/check-agent-content.cjs` fails if it appears in the agent exports.
