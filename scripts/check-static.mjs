import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { site, sitePath } from '../content/profile.ts';

const output = resolve(import.meta.dirname, '../out');
const requiredSections = ['about', 'education', 'research', 'publications', 'competitions', 'honors', 'news'];
let assetsChecked = 0;
for (const [file, lang] of [['index.html', 'zh-CN'], ['en/index.html', 'en']]) {
  const html = await readFile(join(output, file), 'utf8');
  assert.ok(html.includes(`<html lang="${lang}">`), `${file}: document language`);
  for (const id of requiredSections) assert.ok(html.includes(`id="${id}"`), `${file}: missing ${id}`);
  for (const path of [sitePath(), sitePath('en/')]) assert.ok(html.includes(`href="${path}"`), `${file}: missing language link ${path}`);
  assert.ok(html.includes('rel="canonical"'), `${file}: canonical missing`);
  assert.ok(html.includes('hrefLang="en"') || html.includes('hreflang="en"'), `${file}: language metadata missing`);
  const ids = new Set(Array.from(html.matchAll(/\bid="([^"<>]+)"/g), match => match[1]));
  const references = new Set(Array.from(html.matchAll(/<(?:a|link|img|script|source|video|audio)\b[^>]*?\b(?:src|href)="([^"<>]+)"/g), match => match[1].replaceAll('&amp;', '&')));
  for (const reference of references) {
    if (reference.startsWith('#')) { assert.ok(ids.has(reference.slice(1)), `${file}: broken anchor ${reference}`); continue; }
    if (/^(https?:|mailto:|data:)/.test(reference)) continue;
    assert.ok(reference.startsWith(`${site.basePath}/`), `${file}: unexpected asset path ${reference}`);
    const relative = decodeURIComponent(reference.slice(site.basePath.length + 1).split(/[?#]/)[0]);
    let asset = join(output, relative);
    const details = await stat(asset).catch(() => null);
    assert.ok(details, `${file}: missing local resource ${reference}`);
    if (details.isDirectory()) asset = join(asset, 'index.html');
    await access(asset);
    assetsChecked++;
  }
  console.log(`PASS ${file}: language, sections, navigation, metadata, local resources`);
}
await access(join(output, '.nojekyll'));
await access(join(output, '404.html'));
console.log(`PASS ${assetsChecked} static resource references; GitHub Pages artifact ready.`);
