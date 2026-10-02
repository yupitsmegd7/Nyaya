# API keys and setup

The website works without paid credentials: the Law Book, rights atlas, crime catalogue, helplines, curated situation API, official PIB refresh and source snapshots are available immediately. There are **two optional external keys**.

| Variable | Secret? | When needed | Get it from |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Generated situation answers with official-domain web search | Your project at [OpenAI API keys](https://platform.openai.com/api-keys) |
| `OPENAI_MODEL` | No | Optional model selection; defaults to `gpt-4.1-mini` | A model your OpenAI project can use with Responses API + `web_search` |
| `DATA_GOV_API_KEY` | Yes | The optional government JSON dataset connector | Your registered [data.gov.in](https://www.data.gov.in/) account; [official help](https://www.data.gov.in/help) |
| `DATA_GOV_RESOURCE_ID` | No | Required alongside the OGD key; a real dataset resource UUID | The API page of your selected official resource |

No GitHub token is required by the website. No key is needed for the current public PIB feed, the verified source snapshots, statute links or helpline directory. ChatGPT subscriptions do not substitute for an OpenAI API project with available billing/credits. Provider usage can incur charges.

## Where to enter the values

### Local development (Vinext / Cloudflare)

1. Copy `.dev.vars.example` to `.dev.vars` in the project root.
2. Enter your values after `=` in `.dev.vars`.
3. Run `pnpm install`, then `pnpm dev`; restart after changing credentials.

`.env.example` documents the same variable names for other server/hosting configurations. The current Worker reads runtime bindings through `env` from `cloudflare:workers`; do not assume that merely creating `.env` on a different host supplies Worker bindings. Use `.dev.vars` locally and runtime secrets on the deployed Worker.

### Hosted site

Add `OPENAI_API_KEY` and, if wanted, `DATA_GOV_API_KEY` as **secret runtime environment variables** in the site/hosting configuration. Add `OPENAI_MODEL` and `DATA_GOV_RESOURCE_ID` as ordinary runtime variables. Publish a new deployment after changing values. On Sites, these are managed through its environment-variable settings/tools. For a separately hosted Cloudflare Worker, use the Worker's Settings → Variables and Secrets and bind the same names.

Never enter API keys in the public website, a `NEXT_PUBLIC_*`/`VITE_*` variable, GitHub source, an issue or a chat message. `.env*` and `.dev.vars*` are ignored except the empty templates. If a key is ever committed, revoke it; deleting the file does not remove it from history.

## OpenAI connection

`POST /api/ask` accepts:

```json
{"situation":"I was injured in a road accident and the hospital asks for payment","region":"Odisha","incidentDate":"2026-10-01"}
```

- Without a key: returns `mode: "retrieval"`, ranked curated laws, exact source excerpts and related guides.
- With a key: calls the OpenAI Responses API with `web_search`, official-domain filters, `store: false` and a 45-second timeout. The key stays on the server.
- AI results require citations to allowlisted official HTTPS domains; the UI displays clickable inline citations. Generated prose is labelled AI, and original quotations are copied from curated records separately.
- An unavailable model, invalid credential, timeout or missing/invalid source citations falls back visibly to curated retrieval.
- `GET /api/ask` reports configuration mode, never the secret. A configured status is not proof of valid billing or a successful provider call; submit a test question and confirm `mode: "ai"`.
- The endpoint caps input length and uses a best-effort per-Worker-instance IP limiter (6 requests/minute). For a large public launch, add durable edge rate limiting and provider spending limits; the in-memory limit is not a global billing cap.

Situation text is sent to the server and, when configured, OpenAI. Nyaya does not write it to an application database or log it in application code. `store: false` disables stored Responses objects; it is not a promise about provider abuse-monitoring retention or infrastructure logging. Avoid personal identifiers.

Official documentation: [Web search](https://developers.openai.com/api/docs/guides/tools-web-search), [API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

## Government dataset connection

1. Register with OGD India and obtain your authorised API key.
2. Choose an actual NCRB/MHA or other relevant official dataset that offers API access.
3. Verify the publisher, resource UUID, reporting years, units and field definitions.
4. Enter both `DATA_GOV_API_KEY` and `DATA_GOV_RESOURCE_ID` and redeploy.
5. Open Sources & credits → Connection status. The server fetches up to 100 records from `https://api.data.gov.in/resource/{resource-id}` and displays them separately.

This is a configurable resource connector, **not an already activated nationwide real-time crime feed**. No resource is preselected, and no demonstration key is used. It does not replace or silently combine the verified chart series: datasets have different schemas and need an explicit reviewed mapping before that would be valid. The existing cybercrime chart refreshes a fixed official publication, and the broader 2020–2022 comparison is a historical verified snapshot.
