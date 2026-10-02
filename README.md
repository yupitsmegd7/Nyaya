# Nyaya · न्याय

Independent Indian legal information, styled in sandstone, ivory, bronze and deep red inspired by the Supreme Court. No government emblem or official affiliation is claimed.

## Features

- A rights atlas indexing every Part III article (30 entries, including omissions and qualifications), all 20 Part IV articles, and 8 other constitutional safeguards.
- A searchable Law Book with 76 constitutional and statutory entries, original official headings/excerpts, plain-language summaries and qualifications.
- 48 BNS crime entries searchable by offence, section, family or situation; links to relevant special-law sources.
- `POST /api/ask`: a real server-backed situation finder over the legal collection. Optional OpenAI answers search only allowed official domains and show citations. Unconfigured or failed AI visibly falls back to curated retrieval.
- Eight practical situation guides, six national helplines, bookmarks and a downloadable lawyer-preparation brief.
- Nine national NCRB statistical series (2020–2022, MHA Annual Report 2024–25); increases and decreases, chart and table.
- Official cybercrime statistics (2020–2024) across all 36 states/UTs and national crime heads, annual change, CSV export and source refresh.
- A configurable OGD JSON API connector and government PIB RSS updates.

## Start and configure

Node 22.13+ and pnpm. Existing dependencies and lockfile are preserved.

```bash
pnpm install
cp .dev.vars.example .dev.vars
# Enter optional server-side keys in .dev.vars, then:
pnpm dev
```

Build: `pnpm build`. Type-check: `pnpm exec tsc --noEmit`. The project uses Vinext, React, TypeScript and Cloudflare Worker runtime bindings, with Sites hosting integration. A normal fresh checkout uses the portable execution profile. `.openai/hosting.json` identifies the current Site; it contains no API keys. `.sites-runtime` is checkout-local and excluded from Git.

**Read [API key setup](docs/API_KEYS.md).** Only `OPENAI_API_KEY` is needed for AI-generated situation answers. `DATA_GOV_API_KEY` plus a verified `DATA_GOV_RESOURCE_ID` is optional for OGD records. All other current features work without keys. The templates contain no credentials. Do not put secrets in frontend code or commit `.dev.vars`/`.env` files.

## API endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/ask` | Safe configuration status, no key disclosure |
| `POST /api/ask` | Situation → source references, guides and optional cited AI explanation |
| `GET /api/crime` | Fixed official PIB cybercrime publication, validated parser and snapshot fallback |
| `GET /api/updates` | Official PIB RSS feed, explicit unavailable/empty states |
| `GET /api/data-gov` | Optional configured official resource; first 100 records |

## Coverage and data provenance

“All rights” is implemented as a complete **Part III article index**, not a claim to contain every judicial interpretation or every entitlement in all Indian central and state statutes. Directive Principles are distinguished from enforceable fundamental rights. Omitted articles and constitutional qualifications are not presented as current individual rights. The Constitution source is the official bilingual edition as on 1 May 2024, with its amendment and judgment footnotes. Review date: 2 October 2026; content is manually curated and is not an automated amendment tracker.

Most added entries quote the **official article or section heading**, expressly labelled in the detail view, followed by an editorial summary. BNS offences are not automatically interchangeable with historical IPC statistical categories. Commencement, special-law interaction, older incidents and local law must be checked. Summaries are not a lawyer-reviewed opinion; matches do not establish guilt, eligibility or compensation.

- `lib/constitution.json`: 58 constitutional entries.
- `lib/crime-catalogue.json`: 48 BNS entries; source is the MHA Gazette text.
- `lib/legal-data.ts`: combined law library, practical guides, helplines and source register.
- `lib/national-crime.json`: Chapter IV, printed pp. 53–59 of the [MHA Annual Report 2024–25](https://www.mha.gov.in/sites/default/files/AREnglish_24032026.pdf), source NCRB. Historical reporting years 2020–2022. Categories overlap; do not sum them.
- `lib/crime-snapshot.json`: [National Cyber Crime Data, PIB, 21 July 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287039), Annexures I–II, reporting years 2020–2024.

The PIB routes cache for 15 minutes. Fetching an existing release does not discover newer NCRB editions. Publication dates, reporting years and retrieval times are distinct. Registered cases are not convictions or a measure of all actual crime. Missing values are not zeros; a zero baseline has no percentage change. There is no fabricated real-time crime counter.

## Privacy and security

Situation text goes to the server, and to OpenAI if that optional connection is configured; requests use `store: false`. Provider and hosting retention policies still apply. No situation-text database or application-level query logging is implemented. Preparation notes remain in page memory until locally downloaded. Bookmarks store law IDs only in browser local storage. No police report, email or lawyer message is sent by using this site.

API keys are server bindings only. External data URLs are fixed or restricted to a validated OGD resource UUID; visitors cannot select arbitrary upstream URLs. AI citation URLs must be official HTTPS sources. This is a private Site by default; add durable abuse limits before opening a paid AI endpoint to a large public audience.

## Verification

The repository includes `scripts/check-content.mjs` to check catalogue coverage, referential integrity, statistical reconciliation and retrieval/AI failure cases. Run `node scripts/check-content.mjs`; it uses the installed TypeScript compiler to load source modules in a temporary test directory. Type-check and production build are also run before publishing. Real external AI and OGD calls require credentials and are not claimed as tested until configured. Browser visual verification depends on an available supported browser-control context.

## Credits

Legislative Department (Constitution); India Code and MHA (statutes); NCRB/MHA/PIB (statistics); MoRTH/PIB (PM RAHAT); NALSA, I4C, Ministry of Women and Child Development and Department of Consumer Affairs (services). Source ownership and dataset licences remain with the named authorities. Nyaya explanations and interface are independent editorial work. Official references are linked throughout the website.
