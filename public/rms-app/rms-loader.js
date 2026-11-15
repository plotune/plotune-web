// Plotune RMS embed loader (unhashed, next to manifest.json). It loads the content-hashed module and its stylesheet and retries a failed load
// WITHOUT a cache-busting query: a second attempt fetches the module bytes afresh (cache: 'reload') and imports them from a blob: URL, because a
// failed dynamic import() of the same URL may be remembered by the browser.
//
//   const { loadRms } = await import(/* webpackIgnore: true */ '/rms-app/rms-loader.js');
//   const { mount } = await loadRms('/rms-app/');                       // retries 2 more times, 400 ms apart by default
//   const app = mount(element, { apiBase, projectId, getClaim, onSessionEnd, onError });
//
// Options (second argument): retries, delayMs, importer(url), fetcher(url, init) (for tests).
export async function loadRms(base, options = {}) {
  const { retries = 2, delayMs = 400, importer = url => import(/* @vite-ignore */ url), fetcher = (url, init) => fetch(url, init) } = options;
  const root = new URL(base.endsWith('/') ? base : `${base}/`, typeof document === 'undefined' ? 'http://localhost/' : document.baseURI).href;
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  let failure;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await pause(delayMs);
    try {
      const manifest = await (await fetcher(`${root}manifest.json`, { cache: attempt ? 'reload' : 'default' })).json();
      const entry = manifest['src/embed.tsx'], style = manifest['style.css'];
      if (!entry || !style) throw new Error('RMS manifest is incomplete');
      if (typeof document !== 'undefined' && !document.querySelector(`link[data-rms-style="${style.file}"]`)) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = root + style.file; link.dataset.rmsStyle = style.file; document.head.appendChild(link);
      }
      const url = root + entry.file;
      let module;
      if (attempt === 0) module = await importer(url);
      else {
        const response = await fetcher(url, { cache: 'reload' });
        if (!response.ok) throw new Error(`RMS module answered ${response.status}`);
        const blob = URL.createObjectURL(new Blob([await response.text()], { type: 'text/javascript' }));
        try { module = await importer(blob); } finally { URL.revokeObjectURL(blob); }
      }
      if (typeof module.mount !== 'function') throw new Error('RMS module has no mount');
      // From a blob: URL the module cannot find its own folder, so the asset base is passed along.
      return { mount: (element, mountOptions) => module.mount(element, { assetBase: root, ...mountOptions }) };
    } catch (error) { failure = error; }
  }
  throw failure;
}
