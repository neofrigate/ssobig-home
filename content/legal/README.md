# Policy translations

The Korean documents in `public/{privacy_policy,terms_of_service,refund_policy}.html`
are the source policy text. Each JSON file maps every nonempty body text node, in
order, to Korean, English, Japanese and Simplified Chinese. Preserve all clauses,
numbers, dates and contact information when updating translations.

1. Update the Korean policy and the matching `ko`, `en`, `ja`, `zh` rows together.
2. Run `npm run legal:generate` to regenerate all 12 public pages.
3. Run `npm run test:legal` and `npm run build`.

The build runs `legal:check` and fails if source text has changed without updating
translations or if generated pages are stale. Do not edit translated HTML directly.
The generation step preserves the Korean body and all nested list structure.

Korean URLs remain `/<document>.html`; translated URLs are
`/legal/{en,ja,zh}/<document>.html`. Each page links to all four languages and the
other policies in the same language. Static content and links work without JS.
For external app compatibility, the legacy pages accept `lang`, `locale` or
`language` query parameters, including aliases such as `kr`, `ja_JP`, `zh-CN`.
Those explicit parameters redirect in the browser; no language is guessed.

Existing Korean policy wording, including potentially overlapping refund periods,
is translated as written. This change does not revise the policy conditions.
