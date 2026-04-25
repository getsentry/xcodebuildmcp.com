# Project Rules

- Never use em dashes (—) in any content. Use commas, periods, colons, or parentheses instead.

## Docs site

### Audience and voice

- These docs are for end users of XcodeBuildMCP (developers using the CLI and MCP server in their workflow), not contributors working on XcodeBuildMCP itself.
- Write about what the command or feature does for the user and when to use it. Skip the "how it works" details: which APIs are called, what the lookup strategy is, internal fallbacks, file layouts, timeout values, protocol specifics, parsing rules.
- Keep callouts and notes focused on things that affect the user's decisions (when to use a flag, when something will not work for them), not on justifying the implementation.
- If you find yourself writing a per-channel mechanics table, a "fetched from ... by ..." sentence, or a "we chose X because Y" explanation, cut it.

### Adding or editing a page

Content lives at `app/docs/_content/<slug>.mdx`. To add a new page, also update:

- `app/docs/_data/routes.ts`: add the slug to `DocSlug`, `PAGES_ORDER`, `PAGE_META`, and a `SIDEBAR_GROUPS` entry (top-level `items` or a `children` entry for sub-nav).
- `app/docs/_content/index.ts`: import the MDX and add it to `PAGE_COMPONENTS`.

### Available in every MDX file (no imports needed)

- `<Callout variant="info|warn|danger|success" title="...">body</Callout>`
- `<Tabs tabs={[{ label, content: <>...</> }, ...]} />`
- `<ToolExplorer />` (full tool catalog)
- `<LiveToolCount />`, `<LiveWorkflowCount />`, `<LiveVersion />`, `<LiveRef />`, `<LiveWorkflowToolCount workflow="..." />` (inline values)
- `<LiveWorkflowsTable />`, `<LiveChangelog limit={10} />`
- Fenced code blocks render with a copy button and language badge.

### Import explicitly in MDX when needed

- `<PageHeader breadcrumbs={[...]} title="..." lede="..." meta={[...]} />` from `../_components/page-header`
- `<Hero />` (intro only) from `../_components/hero`
- `<Icons.* />` from `../_components/icons`

### Dynamic data

- Prefer `<LiveToolCount />` etc. over hardcoding counts, workflow names, or versions. These pull from the latest release of `getsentry/XcodeBuildMCP` with a 1-hour revalidation window.
- Refresh the bundled fallback snapshot with `pnpm run docs:sync` when you need up-to-the-minute data during local development.

### Routing

- The introduction is served at `/docs`, not `/docs/introduction` (the latter 404s).
- Link to a heading with `/docs/<slug>#<kebab-heading>`. Heading ids are generated automatically.

### Commands

- `pnpm dev`: local dev server
- `pnpm build`: production build (static-generates every docs route)
- `pnpm run docs:sync`: refresh the bundled XcodeBuildMCP manifest snapshot
