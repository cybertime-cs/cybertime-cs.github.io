import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { startProdServer } from 'vinext/server/prod-server';
import { profile, site, sitePath } from '../content/profile.ts';

// Vinext beta's built-in prerender misses basePath + trailingSlash. Render the
// real public URLs using its production server, then stage only public assets.
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'out');
if (dirname(output) !== root || output !== join(root, 'out')) throw new Error('Unsafe output directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const client = join(root, 'dist', 'client');
for (const entry of await readdir(client, { withFileTypes: true })) {
  if (entry.name === '_next' || entry.name.startsWith('.') || entry.name === site.basePath.slice(1) || entry.name.endsWith('-manifest.json')) continue;
  await cp(join(client, entry.name), join(output, entry.name), { recursive: true });
}
await cp(join(client, site.basePath.replace(/^\//, ''), '_next'), join(output, '_next'), { recursive: true });
await writeFile(join(output, '.nojekyll'), '');
const { server, port } = await startProdServer({ port: 0, host: '127.0.0.1', outDir: join(root, 'dist'), noCompression: true, silent: true });
try {
  for (const [route, file, language] of [[sitePath(), 'index.html', 'zh-CN'], [sitePath('en/'), 'en/index.html', 'en']]) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, { redirect: 'manual', signal: AbortSignal.timeout(30_000) });
    if (response.status !== 200) throw new Error(`${route} returned ${response.status}`);
    const html = await response.text();
    if (!html.includes(`<html lang="${language}">`) || !html.includes('id="name-heading"')) throw new Error(`Invalid rendered page: ${route}`);
    const destination = join(output, file);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html);
    console.log(`Exported ${route} -> out/${file}`);
  }
  await writeFile(join(output, '404.html'), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 · 页面未找到</title><style>body{max-width:640px;margin:18vh auto;padding:24px;font:16px/1.9 system-ui;color:#243347;background:#fafbfc}h1{font:60px Georgia;color:#172b42}a{color:#245f83}p{color:#637286}</style></head><body><h1>404</h1><h2>这个页面不存在</h2><p lang="en">The page you are looking for could not be found.</p><a href="${sitePath()}">返回中文主页</a> · <a lang="en" href="${sitePath('en/')}">English homepage</a></body></html>`);
  if (profile.ready) {
    const urls = [sitePath(), sitePath('en/')].map(path => `<url><loc>${site.origin}${path}</loc><lastmod>${profile.updated}</lastmod></url>`).join('');
    await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  }
} finally {
  server.closeIdleConnections();
  await new Promise((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose()));
}
console.log('Static export complete. Only out/ is published.');
