const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = path.resolve(__dirname, '..');
const articlesDir = path.join(root, 'src/research/articles');
const site = 'https://www.plotune.net';
const escapeXml = (value = '') => String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]);
const articles = fs.readdirSync(articlesDir).filter((file) => file.endsWith('.mdx')).map((file) => matter(fs.readFileSync(path.join(articlesDir, file), 'utf8')).data).filter((article) => article.slug).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
const items = articles.map((article) => {
  const url = `${site}/research/articles/${article.slug}`;
  return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><description>${escapeXml(article.summary || article.title)}</description></item>`;
}).join('');
// The feed's own lastBuildDate is the most recent article's publishedAt (falls back to now
// when there are no articles yet) -- Feedly and other readers use it to tell whether a feed
// has anything new since their last fetch. atom:link rel="self" is the feed's own canonical
// URL, a standard element most feed validators (and Feedly's own) expect to find.
const lastBuildDate = (articles[0] ? new Date(articles[0].publishedAt) : new Date()).toUTCString();
fs.mkdirSync(path.join(root, 'public/research'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/research/rss.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Plotune Research</title><link>${site}/research</link><description>Interactive research from Plotune.</description><language>en-us</language><lastBuildDate>${lastBuildDate}</lastBuildDate><atom:link href="${site}/research/rss.xml" rel="self" type="application/rss+xml" />${items}</channel></rss>`);
