// Loads the vendored RMS browser client (public/rms-app/, see scripts/update-rms-embed.cjs).
//
// rms-loader.js is unhashed and reads manifest.json for the content-hashed module and stylesheet, so a new
// vendored build needs no change here. The loader attaches the (scoped) stylesheet and retries a failed load.
export const RMS_API_BASE = 'https://rms.plotune.net';
const APP_BASE = '/rms-app/';

export class EmbedLoadError extends Error {
  constructor(message) { super(message); this.name = 'EmbedLoadError'; }
}

let loader = null;

// Resolves to { mount }. A failure is an EmbedLoadError and is not remembered, so "Try again" asks again.
export async function loadRmsEmbed() {
  try {
    loader = loader || import(/* webpackIgnore: true */ `${APP_BASE}rms-loader.js`);
    const { loadRms } = await loader;
    return await loadRms(APP_BASE);
  } catch (cause) {
    loader = null;
    throw new EmbedLoadError(`RMS module: ${cause?.message || cause}`);
  }
}
