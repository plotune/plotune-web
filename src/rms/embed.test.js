import { EmbedLoadError, loadRmsEmbed } from './embed';

// The loader is a browser-only runtime import (webpackIgnore); under jest it cannot be fetched, which is the failure path.
test('a loader that cannot be loaded is an EmbedLoadError, and the next call tries again', async () => {
  await expect(loadRmsEmbed()).rejects.toBeInstanceOf(EmbedLoadError);
  await expect(loadRmsEmbed()).rejects.toBeInstanceOf(EmbedLoadError);
});
