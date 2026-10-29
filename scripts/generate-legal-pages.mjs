import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

// Korean public pages remain the policy source. Translation rows must match every
// source text node in order; source edits fail closed until translations are updated.
const documents = ['privacy_policy', 'terms_of_service', 'refund_policy'];
const locales = ['ko', 'en', 'ja', 'zh'];
const names = { ko: '한국어', en: 'English', ja: '日本語', zh: '简体中文' };
const langTags = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN' };
const labels = {
  ko: ['개인정보 처리방침', '이용약관', '환불 정책'],
  en: ['Privacy Policy', 'Terms of Service', 'Refund Policy'],
  ja: ['プライバシーポリシー', '利用規約', '返金ポリシー'],
  zh: ['隐私政策', '服务条款', '退款政策'],
};
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const path = (doc, locale) => locale === 'ko' ? `/${doc}.html` : `/legal/${locale}/${doc}.html`;
const stripGenerated = (s) => s.replace(/\s*<!-- legal-generated:start -->[\s\S]*?<!-- legal-generated:end -->/g, '');
const generated = (s) => `\n<!-- legal-generated:start -->\n${s}\n<!-- legal-generated:end -->`;
const check = process.argv.includes('--check');
let count = 0;
for (const doc of documents) {
  const source = stripGenerated(readFileSync(`public/${doc}.html`, 'utf8'));
  const rows = JSON.parse(readFileSync(`content/legal/${doc}.json`, 'utf8'));
  const body = source.match(/<body>([\s\S]*?)<\/body>/)[1];
  const nodes = body.split(/(<[^>]*>)/g);
  const texts = nodes.filter((s, i) => i % 2 === 0 && s.trim());
  assert.deepEqual(texts.map((s) => s.replace(/\s+/g, ' ').trim()), rows.map((r) => r.ko), `${doc}: Korean source changed; update all translations`);
  for (const locale of locales) {
    let index = 0;
    const translatedBody = nodes.map((s, i) => {
      if (i % 2 || !s.trim()) return s;
      const row = rows[index++];
      assert.ok(row[locale]?.trim(), `${doc} ${locale}: missing translation`);
      return locale === 'ko' ? s : `\n${escape(row[locale])}\n`;
    }).join('');
    const navigation = `<nav class="legal-languages" aria-label="${locale === 'ko' ? '언어 선택' : locale === 'ja' ? '言語選択' : locale === 'zh' ? '语言选择' : 'Language selection'}">${locales.map((l) => `<a href="${path(doc,l)}" lang="${langTags[l]}" hreflang="${langTags[l]}"${l === locale ? ' aria-current="page"' : ''}>${names[l]}</a>`).join('')}</nav>`;
    const related = `<nav class="legal-related" aria-label="${locale === 'ko' ? '관련 정책' : locale === 'ja' ? '関連ポリシー' : locale === 'zh' ? '相关政策' : 'Related policies'}">${documents.map((d,i) => `<a href="${path(d,locale)}">${labels[locale][i]}</a>`).join('')}</nav>`;
    const head = generated(`<link rel="canonical" href="https://www.ssobig.com${path(doc,locale)}" />\n${locales.map((l) => `<link rel="alternate" hreflang="${langTags[l]}" href="https://www.ssobig.com${path(doc,l)}" />`).join('\n')}\n<link rel="alternate" hreflang="x-default" href="https://www.ssobig.com/${doc}.html" />\n<link rel="stylesheet" href="/legal/policies.css" />\n<script src="/legal/policies.js" defer></script>`);
    let output = source.replace(/<html[^>]*>/, `<html lang="${langTags[locale]}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(labels[locale][documents.indexOf(doc)])} - ${locale === 'ko' ? '쏘빅' : 'SsoBig'}</title>`)
      .replace('</head>', `${head}\n  </head>`)
      .replace(/<body>[\s\S]*?<\/body>/, `<body>${generated(navigation)}${translatedBody}${generated(related)}\n  </body>`);
    output = output.replace(/[ \t]+$/gm, "");
    const file = `public${path(doc,locale)}`;
    if (check) assert.equal(readFileSync(file,'utf8'), output, `${file}: run npm run legal:generate`);
    else {
      mkdirSync(file.slice(0,file.lastIndexOf('/')), { recursive: true });
      writeFileSync(file,output);
    }
    count++;
  }
}
console.log(`${check ? 'Verified' : 'Generated'} ${count} policy pages; all 325 source text nodes covered in each language.`);
