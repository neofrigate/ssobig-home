import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const docs = ['privacy_policy', 'terms_of_service', 'refund_policy'];
const strip = (s) => s.replace(/\s*<!-- legal-generated:start -->[\s\S]*?<!-- legal-generated:end -->/g,'');
test('Generated pages match every current source text node and translation', () => {
  execFileSync(process.execPath, ['scripts/generate-legal-pages.mjs', '--check']);
});

test('All languages preserve document structure, contacts and local navigation destinations', () => {
  for (const doc of docs) {
    const original = strip(readFileSync(`public/${doc}.html`, 'utf8'));
    const rows = JSON.parse(readFileSync(`content/legal/${doc}.json`, 'utf8'));
    for (const lang of ['ko','en','ja','zh','es']) {
      const path = lang === 'ko' ? `public/${doc}.html` : `public/legal/${lang}/${doc}.html`;
      const html = readFileSync(path,'utf8');
      const tags = s => strip(s).match(/<\/?(?:h[123]|p|ul|ol|li|br)\b[^>]*>/g);
      assert.deepEqual(tags(html), tags(original));
      assert.match(html, new RegExp(`<html lang="${lang === 'zh' ? 'zh-CN' : lang}">`));
      for (const [,href] of html.matchAll(/href="(\/[^"#?]*)"/g)) assert.ok(existsSync(`public${href}`), href);
      assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
      for (const row of rows) {
        for (const contact of row.ko.match(/\b[\w.-]+@[\w.-]+\.[a-z]+|\b\d{2,4}-\d{3,4}-\d{4}\b/g) || []) assert.ok(row[lang].includes(contact), contact);
        // Retention periods, thresholds and article references retain their digits.
        // English dates and 'once' are explicitly checked below.
        if (!(['en', 'es'].includes(lang) && (/시행|적용됩니다|최초 1회/.test(row.ko)))) {
          assert.deepEqual((row[lang].replaceAll("제3자", "제삼자").match(/\d+/g) || []).sort(), (row.ko.replaceAll("제3자", "제삼자").match(/\d+/g) || []).sort(), `${doc}/${lang}: ${row.ko}`);
        }
      }
    }
  }
  assert.match(readFileSync('public/legal/en/privacy_policy.html','utf8'), /June 25, 2026/);
  assert.match(readFileSync('public/legal/en/terms_of_service.html','utf8'), /December 4, 2024/);
});

test('Legacy locale parameters resolve correctly without loops or external redirects', () => {
  const script = readFileSync('public/legal/policies.js','utf8');
  const cases = [
    ['/privacy_policy.html?lang=en', '/legal/en/privacy_policy.html?lang=en'],
    ['/terms_of_service.html?locale=ja_JP', '/legal/ja/terms_of_service.html?locale=ja_JP'],
    ['/refund_policy.html?language=zh-CN', '/legal/zh/refund_policy.html?language=zh-CN'],
    ['/legal/en/privacy_policy.html?lang=kr', '/privacy_policy.html?lang=kr'],
    ['/privacy_policy.html?lang=es_ES', '/legal/es/privacy_policy.html?lang=es_ES'],
    ['/privacy_policy.html?lang=fr', null],
    ['/privacy_policy.html', null],
    ['/legal/en/privacy_policy.html?lang=en', null],
    ['/privacy_policy.html?lang=https://example.com', null],
  ];
  for (const [path,expected] of cases) {
    const url = new URL(path,'https://www.ssobig.com');
    let redirected = null;
    vm.runInNewContext(script, { URL, URLSearchParams, location: { href: url.href, search: url.search, pathname: url.pathname, replace: value => { redirected = value; } } });
    assert.equal(redirected, expected && `https://www.ssobig.com${expected}`, path);
  }
});
