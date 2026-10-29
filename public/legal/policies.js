// Legacy URLs support explicit locale parameters used by external apps.
// Static translations and language links also work with JavaScript disabled.
(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang') || params.get('locale') || params.get('language');
  if (!requested) return;
  const code = requested.trim().toLowerCase().replaceAll('_', '-').split('-')[0];
  const locale = ({ ko: 'ko', kr: 'ko', en: 'en', es: 'es', ja: 'ja', jp: 'ja', zh: 'zh', cn: 'zh' })[code];
  const match = location.pathname.match(/\/(privacy_policy|terms_of_service|refund_policy)\.html$/);
  if (!locale || !match) return;
  const path = `${locale === 'ko' ? '' : `/legal/${locale}`}/${match[1]}.html`;
  if (location.pathname === path) return;
  const target = new URL(location.href);
  target.pathname = path;
  location.replace(target.href);
})();
