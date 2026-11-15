// Loads the vendored RMS browser client (public/rms-app/, see scripts/update-rms-embed.cjs).
//
// The module is a runtime import, not part of the site's bundle: the manifest names the content-hashed
// module and stylesheet, so an update of public/rms-app/ needs no change here. The stylesheet is global
// (the embed has no scoping of its own), so it is attached only while an RMS page is open.
export const RMS_API_BASE = 'https://rms.plotune.net';
const APP_BASE = '/rms-app/';
const STYLE_ID = 'rms-embed-style';

export class EmbedLoadError extends Error {
  constructor(message) { super(message); this.name = 'EmbedLoadError'; }
}

let loading = null;
let failedLoads = 0;

export function loadRmsEmbed() {
  if (!loading) {
    loading = (async () => {
      let manifest;
      try {
        const response = await fetch(`${APP_BASE}manifest.json`, { credentials: 'omit' });
        if (!response.ok) throw new Error(`manifest ${response.status}`);
        manifest = await response.json();
      } catch (cause) { throw new EmbedLoadError(`RMS manifest: ${cause.message}`); }
      const entry = manifest?.['src/embed.tsx']?.file;
      const style = manifest?.['style.css']?.file;
      if (!entry || !style) throw new EmbedLoadError('RMS manifest has no entry.');
      try {
        // A module that failed to fetch stays failed in the browser's module map; a new query string retries it.
        const module = await import(/* webpackIgnore: true */ `${APP_BASE}${entry}${failedLoads ? `?retry=${failedLoads}` : ''}`);
        if (typeof module.mount !== 'function') throw new Error('no mount export');
        return { mount: module.mount, styleHref: `${APP_BASE}${style}` };
      } catch (cause) { throw new EmbedLoadError(`RMS module: ${cause.message}`); }
    })().catch((error) => { loading = null; failedLoads += 1; throw error; });
  }
  return loading;
}

// Adds the stylesheet and resolves when it has loaded. Pages that are open at the same time (a project switch
// mounts the next before the previous is torn down) share it; the last `detach` removes it.
let styleUsers = 0;
export function attachRmsStyle(href) {
  styleUsers += 1;
  let link = document.getElementById(STYLE_ID);
  const ready = new Promise((resolve, reject) => {
    if (link && link.dataset.loaded === 'true') { resolve(); return; }
    if (!link) {
      link = document.createElement('link');
      link.id = STYLE_ID;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
    link.addEventListener('load', () => { link.dataset.loaded = 'true'; resolve(); }, { once: true });
    link.addEventListener('error', () => reject(new EmbedLoadError('RMS stylesheet failed to load.')), { once: true });
  });
  let released = false;
  return {
    ready,
    detach: () => {
      if (released) return;
      released = true;
      styleUsers -= 1;
      if (styleUsers <= 0) { styleUsers = 0; document.getElementById(STYLE_ID)?.remove(); }
    },
  };
}
