// Plotune RMS embed loader (unhashed, next to manifest.json). It loads the content-hashed module and its stylesheet and retries a failed load: a later
// attempt refreshes the module and the chunks it imports at start (cache: 'reload'), then imports the module under `?retry=n`, because the browser
// remembers a failed import() of the same URL. Rarely used views are separate chunks that the module loads when they are first opened.
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
      // A failed import() of a URL is remembered by the browser, so a retry imports the module under a different address (`?retry=n`; nothing imports the
      // module back, so there is still one copy of it). The files it imports at start are refreshed in the HTTP cache first; a chunk whose own load failed stays
      // failed until the page is reloaded.
      if (attempt > 0) for (const file of [entry.file, ...(entry.imports ?? []).map(key => manifest[key]?.file).filter(Boolean)]) {
        const response = await fetcher(root + file, { cache: 'reload' });
        if (!response.ok) throw new Error(`RMS module answered ${response.status}`);
      }
      const module = await importer(attempt ? `${url}?retry=${attempt}` : url);
      if (typeof module.mount !== 'function') throw new Error('RMS module has no mount');
      // The asset base (logo, font) is passed along so the module needs no guess about where it was loaded from.
      return { mount: (element, mountOptions) => module.mount(element, { assetBase: root, ...mountOptions }) };
    } catch (error) { failure = error; }
  }
  throw failure;
}
