# Project Rules

- Never use em dashes (—) in any content. Use commas, periods, colons, or parentheses instead.

## Docs site

### Audience
Two audiences share the public facing groups (Overview, Getting Started, Usage, Reference, Guides). Both sit on the public API side of XcodeBuildMCP:

- **End user**: a developer using a coding agent (via their MCP client) or the CLI to build iOS or macOS apps. XcodeBuildMCP extends their agent's capabilities.
- **Agent / MCP client**: the tool integrating with the MCP server.

Public docs cover the public API only: MCP spec features XcodeBuildMCP implements (structured content, resources, notifications, tool annotations, and so on), tools and what they do, MCP resources, configuration, session defaults, env vars, workflow management, CLI and its API, CLI and MCP output formats. Tool annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`) are part of the public MCP response, so document them in public pages, not Contributing.

The **Contributing** group is for people modifying XcodeBuildMCP itself. In scope: tool manifest files, tool authoring, internal architecture a contributor needs to add, edit, or remove a tool or workflow (rendering pipeline, tool registration, schemas, testing strategy). Contributors only need internals inside their authoring domain. Other internals do not need a doc home.

Placement rules when writing or moving content:

- An end user or MCP client needs it to use XcodeBuildMCP: public group.
- Only a contributor adding, editing, or removing a tool, workflow, or manifest needs it: Contributing.
- Neither: delete, do not invent a home for it.
- Frame public docs by user visible outcome, not implementation. Never leak source code literals (for example `{ sentry: true }` in server code, internal type names, private function names) into public pages.
- When a spec feature is part of the public MCP response, it belongs in public docs regardless of how MCP literate the reader is.

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
