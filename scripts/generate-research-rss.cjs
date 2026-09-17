const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = path.resolve(__dirname, '..');
const articlesDir = path.join(root, 'src/research/articles');
const site = 'https://www.plotune.net';
const escapeXml = (value = '') => String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]);
const items = fs.readdirSync(articlesDir).filter((file) => file.endsWith('.mdx')).map((file) => matter(fs.readFileSync(path.join(articlesDir, file), 'utf8')).data).filter((article) => article.slug).map((article) => {
  const url = `${site}/research/articles/${article.slug}`;
  return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><description>${escapeXml(article.summary || article.title)}</description></item>`;
}).join('');
fs.mkdirSync(path.join(root, 'public/research'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/research/rss.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Plotune Research</title><link>${site}/research</link><description>Interactive research from Plotune.</description>${items}</channel></rss>`);
