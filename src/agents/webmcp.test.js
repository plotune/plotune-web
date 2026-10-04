import { createPublicContentTools, initializeWebMCP } from './webmcp';

const pages = [
  { path: '/docs/nexus/security-model', title: 'Security & Trust Model', description: 'Device access', markdown: '# Security\n\nOwner custody and closed-network access.', url: 'https://www.plotune.net/docs/nexus/security-model', markdownUrl: 'https://www.plotune.net/docs/nexus/security-model/index.md' },
  { path: '/research/example', title: 'Research', markdown: 'Security is evaluated in this illustrative benchmark.' },
];
const setup = () => {
  const fetcher = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ version: 1, pages }) });
  const tools = createPublicContentTools(fetcher);
  return { fetcher, list: tools[0], search: tools[1], read: tools[2] };
};

test('searches full public content and returns ranked citation sources', async () => {
  const { search, read, fetcher } = setup();
  const result = JSON.parse(await search.execute({ query: 'security', limit: 1 }));
  expect(result.total).toBe(2);
  expect(result.results[0].path).toBe(pages[0].path);
  expect(JSON.parse(await read.execute({ path: pages[0].path + '/' })).markdown).toContain('Owner custody');
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher).toHaveBeenCalledWith('/agent-content.json', expect.objectContaining({ credentials: 'omit' }));
});

test('validates arguments and never fetches arbitrary or private URLs', async () => {
  const { search, read, fetcher } = setup();
  for (const path of ['/dashboard', '/../profile', 'https://evil.example/', '/docs/nexus/security-model?token=secret']) {
    await expect(read.execute({ path })).rejects.toThrow('Unknown public page');
  }
  await expect(search.execute({ query: ' ', limit: 100 })).rejects.toThrow();
  await expect(search.execute({ query: '!!!' })).rejects.toThrow();
  await expect(read.execute({ path: '/', extra: true })).rejects.toThrow();
  expect(fetcher.mock.calls.every(([url]) => url === '/agent-content.json')).toBe(true);
});

test('retries a failed catalog request and honors cancellation', async () => {
  const { list, fetcher } = setup();
  fetcher.mockRejectedValueOnce(new Error('Offline'));
  await expect(list.execute({})).rejects.toThrow('Offline');
  expect(JSON.parse(await list.execute({})).pages).toHaveLength(2);
  const controller = new AbortController(); controller.abort();
  await expect(list.execute({}, { signal: controller.signal })).rejects.toThrow('aborted');
});

test('feature detection is inert without native support, registers both API versions', async () => {
  expect(await initializeWebMCP({}, {})).toBe(false);
  const modern = { registerTool: jest.fn().mockResolvedValue(undefined) };
  const legacy = { registerTool: jest.fn() };
  await initializeWebMCP({ modelContext: modern }, { modelContext: legacy });
  expect(modern.registerTool).toHaveBeenCalledTimes(3);
  expect(legacy.registerTool).not.toHaveBeenCalled();
  await initializeWebMCP({}, { modelContext: legacy });
  expect(legacy.registerTool).toHaveBeenCalledTimes(3);
  expect(modern.registerTool.mock.calls.every(([tool]) => tool.annotations.readOnlyHint)).toBe(true);
});
