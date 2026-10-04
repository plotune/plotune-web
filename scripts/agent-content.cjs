// Executed inside the prerender browser. Export the same content visitors can read.
function extractAgentContent() {
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const root = (document.querySelector('main') || document.getElementById('root')).cloneNode(true);
  root.querySelectorAll('script,style,nav,footer,button,input,textarea,select,[aria-hidden="true"],svg,canvas,.js-plotly-plot').forEach(node => node.remove());
  root.querySelectorAll('header').forEach(node => { if (!node.closest('article')) node.remove(); });
  const inline = node => node.textContent.replace(/\s+/g, ' ').trim();
  const render = node => {
    if (node.nodeType === 3) return node.textContent.replace(/\s+/g, ' ');
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    const children = () => Array.from(node.childNodes).map(render).join('');
    if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${inline(node)}\n\n`;
    if (tag === 'pre') return `\n\n\`\`\`\n${node.textContent.trim()}\n\`\`\`\n\n`;
    if (tag === 'code') return `\`${node.textContent}\``;
    if (tag === 'a') {
      const href = node.getAttribute('href');
      if (!href || !/^(https?:|\/|#)/.test(href)) return children();
      return `[${inline(node)}](${new URL(href, canonical || `https://www.plotune.net${location.pathname}`).href})`;
    }
    if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr')).map(row => Array.from(row.querySelectorAll('th,td')).map(cell => inline(cell).replace(/\|/g, '\\|')));
      if (!rows.length) return '';
      return '\n\n' + rows.map((row, i) => `| ${row.join(' | ')} |\n${i === 0 ? '| ' + row.map(() => '---').join(' | ') + ' |\n' : ''}`).join('') + '\n';
    }
    if (tag === 'li') return `\n- ${children().trim()}\n`;
    if (tag === 'br') return '\n';
    if (tag === 'img') return node.alt ? ` ${node.alt} ` : '';
    const text = children();
    if (['span', 'strong', 'em'].includes(tag)) return ` ${text} `;
    return ['p','div','section','article','ul','ol','dl','dt','dd','blockquote','figure','figcaption'].includes(tag) ? `\n\n${text.trim()}\n\n` : text;
  };
  const title = document.querySelector('h1')?.textContent.trim() || document.title;
  const description = document.querySelector('meta[name="description"]')?.content || '';
  let markdown = render(root).replace(/\n{3,}/g, '\n\n').trim();
  markdown = `# ${title}\n\n${markdown.replace(/^# .*$/m, '').trim()}`;
  // Collapsed FAQ answers remain public and are already published as structured data.
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    const schema = JSON.parse(script.textContent);
    if (schema['@type'] === 'FAQPage') {
      markdown += '\n\n' + schema.mainEntity.map(item => `## ${item.name}\n\n${item.acceptedAnswer.text}`).join('\n\n');
    }
  }
  return { title, description, canonical, markdown };
}

function writeAgentContent(buildDir, pages) {
  const fs = require('fs');
  const path = require('path');
  const site = 'https://www.plotune.net';
  const sections = { 'Product and workflows': [], 'Technical documentation': [], Research: [], Optional: [] };
  for (const page of pages) {
    page.url = site + page.path;
    page.markdownUrl = site + (page.path === '/' ? '' : page.path) + '/index.md';
    const file = path.join(buildDir, page.path, 'index.md');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${page.markdown}\n\nSource: ${page.url}\n`);
    const section = page.path.startsWith('/docs') ? 'Technical documentation' : page.path.startsWith('/research') ? 'Research' : /^\/(nexus|solutions)(\/|$)/.test(page.path) || page.path === '/' ? 'Product and workflows' : 'Optional';
    sections[section].push(`- [${page.title.replace(/[\[\]\n]/g, '')}](${page.markdownUrl}): ${page.description.replace(/\s+/g, ' ') || 'Published page content.'}`);
  }
  const intro = '# Plotune\n\n> Plotune provides a DataOps platform and Plotune Nexus, an appliance connecting AI agents to bounded engineering and hardware test workflows.\n\nTechnical documentation describes implementation status and limitations. Research includes benchmarks and illustrative workflows; retain its dates, methodology, and qualifications when citing claims. Website WebMCP tools search and retrieve public content; Nexus MCP tools operate the product and are a separate interface.\n';
  fs.writeFileSync(path.join(buildDir, 'llms.txt'), intro + Object.entries(sections).map(([title, links]) => `\n## ${title}\n\n${links.join('\n')}\n`).join(''));
  fs.writeFileSync(path.join(buildDir, 'llms-full.txt'), intro + pages.map(page => `\n---\n\n${page.markdown}\n\nSource: ${page.url}\n`).join(''));
  fs.writeFileSync(path.join(buildDir, 'agent-content.json'), JSON.stringify({ version: 1, pages }, null, 2) + '\n');
}
module.exports = { extractAgentContent, writeAgentContent };
