// No polyfill or global bridge: only browsers with native WebMCP expose these tools.
export function createPublicContentTools(fetchContent = (...args) => fetch(...args)) {
  let catalog;
  const load = async signal => {
    if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');
    if (!catalog) {
      const response = await fetchContent('/agent-content.json', { credentials: 'omit', signal });
      if (!response.ok) throw new Error('Public content is unavailable. Try again later.');
      const data = await response.json();
      if (data.version !== 1 || !Array.isArray(data.pages)) throw new Error('Invalid public content catalog.');
      catalog = data.pages;
    }
    return catalog;
  };
  const metadata = ({ path, title, description, url, markdownUrl }) => ({ path, title, description, url, markdownUrl });
  const schema = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
  const tool = (name, description, inputSchema, run) => ({
    name, description, inputSchema,
    annotations: { readOnlyHint: true },
    execute: async (input, options = {}) => JSON.stringify(await run(input, options.signal)),
  });
  const validate = (input, allowed) => {
    if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !allowed.includes(key))) {
      throw new Error('Invalid tool arguments.');
    }
  };
  return [
    tool('plotune_list_public_pages', 'List published Plotune product, workflow, documentation, research and policy pages, with canonical and Markdown URLs. Reads public build content only.', schema({}), async (input, signal) => {
      validate(input, []);
      return { pages: (await load(signal)).map(metadata) };
    }),
    tool('plotune_search_public_content', 'Search the full text of published Plotune pages. Returns ranked canonical sources and matching excerpts. No account data or external search is accessed.', schema({
      query: { type: 'string', minLength: 1, maxLength: 200 },
      limit: { type: 'integer', minimum: 1, maximum: 20, default: 5 },
    }, ['query']), async (input, signal) => {
      validate(input, ['query', 'limit']);
      const { query, limit = 5 } = input;
      if (typeof query !== 'string' || !query.trim() || query.length > 200 || !Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error('Provide a query of 1–200 characters and a limit of 1–20.');
      const terms = [...new Set(query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])];
      if (!terms.length) throw new Error('Query must contain letters or numbers.');
      const results = (await load(signal)).map(page => {
        const text = page.markdown.toLowerCase();
        const title = page.title.toLowerCase();
        const matched = terms.filter(term => text.includes(term) || title.includes(term));
        const score = matched.reduce((sum, term) => sum + 1 + (title.includes(term) ? 5 : 0), 0);
        const offset = Math.max(0, text.indexOf(matched[0]) - 120);
        return { ...metadata(page), score, matches: matched.length, excerpt: page.markdown.slice(offset, offset + 600) };
      }).filter(page => page.score > 0).sort((a, b) => b.matches - a.matches || b.score - a.score || a.path.localeCompare(b.path));
      return { query, total: results.length, results: results.slice(0, limit).map(({ matches, ...result }) => result) };
    }),
    tool('plotune_get_public_page', 'Read the full Markdown content of a published Plotune page using a path returned by list or search, such as /docs/nexus/security-model. Returns its canonical source for citation.', schema({ path: { type: 'string', maxLength: 200 } }, ['path']), async (input, signal) => {
      validate(input, ['path']);
      if (typeof input.path !== 'string' || input.path.length > 200) throw new Error('Provide a published page path.');
      const normalized = input.path.replace(/\/+$/, '') || '/';
      const page = (await load(signal)).find(item => item.path === normalized);
      if (!page) throw new Error('Unknown public page. Use plotune_list_public_pages or plotune_search_public_content.');
      return { ...metadata(page), markdown: page.markdown };
    }),
  ];
}

export async function initializeWebMCP(documentObject = document, navigatorObject = navigator) {
  const context = typeof documentObject.modelContext?.registerTool === 'function'
    ? documentObject.modelContext : navigatorObject.modelContext;
  if (typeof context?.registerTool !== 'function') return false;
  // Each registration may return a promise in the current draft, or void in older browsers.
  for (const tool of createPublicContentTools()) {
    try {
      await context.registerTool(tool);
    } catch (error) {
      console.warn(`WebMCP could not register ${tool.name}:`, error);
    }
  }
  return true;
}
