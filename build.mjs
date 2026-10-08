// Static site builder — no dependencies.
//   node build.mjs          → writes ./dist
//   node build.mjs --serve  → builds and serves ./dist on http://localhost:4173
//
// Pages in src/pages use {{> partial}} includes and {{TOKENS}} taken from site.config.json,
// so renaming the brand is a one-line change in the config.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const dist = join(root, 'dist');
const cfg = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));

const whatsappDigits = (cfg.whatsapp || '').replace(/\D/g, '');
const tokens = {
  BRAND: cfg.brand,
  BRAND_LOWER: cfg.brand.toLowerCase(),
  BRAND_FULL_PT: cfg.brandFullPt,
  BRAND_FULL_EN: cfg.brandFullEn,
  SITE_URL: cfg.siteUrl.replace(/\/$/, ''),
  EMAIL: cfg.email,
  WHATSAPP_DIGITS: whatsappDigits,
  LOCATION: cfg.location,
  OWNER: cfg.owner || '',
  WHATSAPP_DISPLAY: whatsappDigits.startsWith('258') && whatsappDigits.length === 12 ? `+258 ${whatsappDigits.slice(3, 5)} ${whatsappDigits.slice(5, 8)} ${whatsappDigits.slice(8)}` : (cfg.whatsapp || ''),
  NUIT: cfg.nuit || '',
  LINKEDIN: cfg.linkedin || '',
  YEAR: String(new Date().getFullYear()),
};

const partials = {};
for (const f of readdirSync(join(src, 'partials'))) {
  partials[f.replace(/\.html$/, '')] = readFileSync(join(src, 'partials', f), 'utf8');
}

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function render(html) {
  // page meta from comments: <!--@title ...--> <!--@desc ...--> <!--@page name-->
  const meta = {};
  html = html.replace(/<!--@(\w+)\s+([\s\S]*?)-->\s*/g, (_, k, v) => { meta[k] = v.trim(); return ''; });
  const local = { ...tokens, PAGE_TITLE: meta.title || cfg.brand, PAGE_DESC: meta.desc || '', PAGE_PATH: meta.path || '' };
  for (let i = 0; i < 3; i++) html = html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => partials[n] ?? '');
  // optional blocks: {{#KEY}}…{{/KEY}} are kept only when the token has a value
  html = html.replace(/\{\{#([A-Z_]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, k, body) => (local[k] ? body : ''));
  const sub = (t) => t.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in local ? local[k] : m));
  return sub(sub(html));
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const d of ['css', 'js', 'img']) if (existsSync(join(src, d))) cpSync(join(src, d), join(dist, d), { recursive: true });
if (existsSync(join(src, 'estudos-assets'))) cpSync(join(src, 'estudos-assets'), join(dist, 'estudos', 'img'), { recursive: true });

const urls = [];
for (const file of walk(join(src, 'pages'))) {
  const rel = relative(join(src, 'pages'), file);
  const out = join(dist, rel);
  mkdirSync(dirname(out), { recursive: true });
  if (extname(file) === '.html') {
    writeFileSync(out, render(readFileSync(file, 'utf8')));
    if (!/n1-dashboard/.test(rel)) urls.push('/' + rel.replace(/index\.html$/, '').replace(/\.html$/, ''));
  } else {
    cpSync(file, out);
  }
}

const base = tokens.SITE_URL;
writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n') + `\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);

const warn = [];
if (/exemplo\.com/.test(cfg.email)) warn.push('email is still the placeholder (site.config.json → "email")');
if (!whatsappDigits) warn.push('no WhatsApp number set (optional)');
if (!cfg.linkedin) warn.push('no LinkedIn URL set (optional — link is hidden)');
console.log(`Built ${urls.length} pages → dist/` + (warn.length ? '\nWARNINGS:\n - ' + warn.join('\n - ') : ''));

if (process.argv.includes('--serve')) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
  createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    const cands = [p, p + '.html', join(p, 'index.html')];
    const hit = cands.map((c) => join(dist, c)).find((c) => existsSync(c) && statSync(c).isFile());
    if (!hit) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[extname(hit)] || 'application/octet-stream' });
    res.end(readFileSync(hit));
  }).listen(4173, () => console.log('http://localhost:4173'));
}
