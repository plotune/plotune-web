# Agent discovery and public information

`npm run build` prerenders the public routes, exports their rendered content, and runs `npm run check:agent-content`. Generated files live in `build/` and are deployed with the existing static site:

- `/llms.txt`: concise grouped index linking to Markdown sources.
- `/llms-full.txt`: combined public content with canonical source URLs.
- `<page>/index.md` (including `/index.md`): headings, prose, lists, links, tables and code from the published page.
- `/agent-content.json`: the same public content and source metadata for browser tools.

The root HTML advertises `llms.txt` with `rel="describedby"`. Pages using `Seo` advertise their Markdown alternate. Add new public routes to `scripts/prerender.cjs`; new research articles, Nexus documents and solution segments are discovered from their existing content sources. The build fails if prerendering fails or expected exports are missing. Exporting rendered content preserves MDX-generated tables and examples. Interactive charts and controls are omitted; associated prose and tables remain. FAQ answers are also read from the page's existing FAQPage structured data so collapsed answers are available.

Generated content covers public information only. It never reads account state, credentials, submissions, device data, or authenticated API responses. Research and documentation retain their published qualifications and dates. This does not change crawler access rules in `robots.txt` or guarantee that any particular AI service will use the files.

References: [llms.txt proposal](https://llmstxt.org/) and [WebMCP draft](https://webmachinelearning.github.io/webmcp/).

## WebMCP

`src/agents/webmcp.js` registers three read-only browser tools:

- `plotune_list_public_pages`: public sources and canonical/Markdown URLs.
- `plotune_search_public_content`: ranked full-text matches and excerpts; maximum 20 results.
- `plotune_get_public_page`: full Markdown for an exact catalog path.

Registration prefers the current draft's `document.modelContext.registerTool`, falling back to the earlier `navigator.modelContext.registerTool`. Unsupported browsers do nothing. There is no polyfill, global MCP server, authenticated operation, or UI change. The public catalog is fetched only when a tool executes, with credentials omitted. This WebMCP interface is separate from Nexus's device MCP endpoints.

Run `CI=true npm test -- --watchAll=false --runInBand` for unit checks and `npm run check:webmcp` after building for production browser checks. The browser checks use API stubs to verify both registration surfaces, real production search/retrieval and static files; they do not certify native browser or agent support. WebMCP is evolving, so native discovery also depends on the user's browser and agent implementation.
