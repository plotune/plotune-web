import { attachRmsStyle, EmbedLoadError, loadRmsEmbed } from './embed';

// The module import itself is a browser-only runtime import (webpackIgnore); here only the steps around it.
describe('loadRmsEmbed', () => {
  afterEach(() => { delete global.fetch; });

  test('a missing manifest is an EmbedLoadError, and the next call asks again', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(loadRmsEmbed()).rejects.toBeInstanceOf(EmbedLoadError);
    await expect(loadRmsEmbed()).rejects.toBeInstanceOf(EmbedLoadError);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch.mock.calls[0]).toEqual(['/rms-app/manifest.json', { credentials: 'omit' }]);
  });

  test('a manifest without the entry or the stylesheet is refused', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ 'src/embed.tsx': { file: 'assets/x.js' } }) });
    await expect(loadRmsEmbed()).rejects.toThrow('no entry');
  });

  test('a module that cannot be imported is an EmbedLoadError', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ 'src/embed.tsx': { file: 'assets/x.js' }, 'style.css': { file: 'assets/x.css' } }) });
    await expect(loadRmsEmbed()).rejects.toBeInstanceOf(EmbedLoadError);
  });
});

describe('attachRmsStyle', () => {
  afterEach(() => { document.head.innerHTML = ''; });
  const link = () => document.getElementById('rms-embed-style');

  test('one stylesheet is shared by pages that overlap, and the last one out removes it', async () => {
    const first = attachRmsStyle('/rms-app/assets/a.css');
    link().dispatchEvent(new Event('load'));
    await first.ready;
    const second = attachRmsStyle('/rms-app/assets/a.css');
    await second.ready;
    expect(document.querySelectorAll('#rms-embed-style')).toHaveLength(1);
    first.detach(); first.detach();
    expect(link()).not.toBeNull();
    second.detach();
    expect(link()).toBeNull();
  });

  test('a stylesheet that fails to load rejects', async () => {
    const style = attachRmsStyle('/rms-app/assets/missing.css');
    link().dispatchEvent(new Event('error'));
    await expect(style.ready).rejects.toBeInstanceOf(EmbedLoadError);
    style.detach();
  });
});
