# Docs audit: end-user vs Contributing scope

Audit of the public documentation site at xcodebuildmcp.com, scoped to every non-Contributing page. Goal: flag content that speaks to contributors/tool-authors (manifest schemas, MCP protocol-spec concepts, internal rendering pipeline, internal type exports, predicates, etc.) but currently lives in Overview / Getting Started / Usage / Reference / Guides.

Source: `/Volumes/Developer/xcodebuildmcp.com/app/docs/_content/`. Sidebar grouping: `/Volumes/Developer/xcodebuildmcp.com/app/docs/_data/routes.ts`.

## Executive summary

The non-Contributing surface is overwhelmingly end-user oriented and in good shape. Three pages leak developer-facing content into the user surface and deserve the most attention:

1. `output-formats.mdx` has an "Environment signal for tool authors" section (`XCODEBUILDMCP_CLI_OUTPUT_FORMAT`) that explicitly addresses tool authors, and a "Response schema reference" block that exposes an internal TypeScript type.
2. `mcp-mode.mdx` ends with a "Tool annotations" section that teaches users the MCP protocol-spec annotation keys (`readOnlyHint`, `destructiveHint`, `openWorldHint`) instead of the user-visible outcome (fewer confirmation prompts).
3. `xcode-ide.mdx` has a one-liner about internal `xcode_tools_*` CLI proxy naming that is confusing as written and should be rewritten.

Smaller rewrite candidates exist in `privacy.mdx` (one internal code sigil) and `cli.mdx` (the daemon section is a near-miss, currently user-voiced but drifts into implementation-centric phrasing). Nothing warrants a full page move into Contributing.

No new Contributing pages are needed. Every flagged passage has a natural home in an existing Contributing page (`architecture.mdx` for rendering signals, `tool-authoring.mdx` for authoring concerns) or should simply be removed/rewritten in place.

## Page-by-page findings

### Overview group

#### `introduction.mdx` &mdash; GREEN

Marketing landing page. Feature grid, two-modes block, Why XcodeBuildMCP list, Sentry callout. All outcome-oriented. No action.

### Getting Started group

#### `installation.mdx` &mdash; GREEN

Requirements, Homebrew and npm paths, doctor, uninstall. All end-user content. No action.

#### `setup.mdx` &mdash; GREEN

Wire into editor, run wizard, install skill, first build, next steps, troubleshooting pointer. Agent dialogue example is user-facing. No action.

#### `clients.mdx` &mdash; GREEN

Per-client config snippets. All drop-in config for end users. No action.

### Usage group

#### `cli.mdx` &mdash; GREEN (minor rewrite candidate)

Synopsis, top-level commands, argument forms, session-defaults auto-fill, recipes, per-workspace daemon, daemon commands, troubleshooting, CLI-vs-MCP comparison. All user-facing.

Minor rewrite candidate, not a move:

- Lines 122 to 136 "Per-workspace daemon" describes user-visible daemon behavior but the phrasing leans implementation-oriented ("Workspace identity: derived from the location of `.xcodebuildmcp/config.yaml`, or falls back to the current directory. Socket: each daemon runs on a Unix socket at ..."). This is legitimately user-visible (socket path matters when chmod fixes appear in troubleshooting), so **keep** but consider outcome-first framing: lead with "the first stateful tool call auto-starts a per-workspace daemon that shuts down after 10 minutes idle", then put socket path and workspace key as reference bullets below.

No hard findings. Proposal: **keep as-is**; gentle rewrite is optional.

#### `mcp-mode.mdx` &mdash; YELLOW

Starting the server, feature-support matrix, session defaults, workflow selection, Xcode IDE bridge pointer, tool annotations. First 4/5ths of the page are well-targeted at users. The final section is the problem.

Finding 1 (hard): Lines 128 to 136, section "## Tool annotations":

> Every tool declares read-only, destructive, and open-world hints. MCP clients that respect annotations (Codex, recent Claude Code) use them to reduce unnecessary confirmation prompts.
>
> | Annotation | Meaning |
> |------------|---------|
> | `readOnlyHint: true` | Tool does not modify state. |
> | `destructiveHint: true` | Tool may delete or overwrite. |
> | `openWorldHint: true` | Tool makes network/filesystem requests beyond the project. |

This is pure MCP-protocol-spec vocabulary. End users don't set these keys; they observe their effect. The raw key names only matter to someone inspecting tool metadata or writing a new tool (which belongs in `tool-authoring.mdx` &mdash; note that page already references `annotations` at lines 124 to 141).

Proposal: **rewrite in user voice**. Replace the table with one sentence of user outcome, e.g. "Every XcodeBuildMCP tool flags itself as read-only, destructive, or network-touching. MCP clients that respect those hints (Codex, recent Claude Code) skip confirmation prompts for read-only tools and prompt on destructive ones." Drop the `readOnlyHint`/`destructiveHint`/`openWorldHint` table. The keys are already documented for tool authors inside `tool-authoring.mdx` at lines 124 to 141.

#### `workflows.mdx` &mdash; GREEN

Enabling workflows, auto-generated workflow list, custom workflows, experimental discovery, context-savings callout. All user-facing. No action.

### Reference group

#### `tools.mdx` &mdash; GREEN

Live-generated tool catalog plus a `build_run_sim` worked example and the MCP-vs-CLI name explainer. All user-facing. No action.

#### `output-formats.mdx` &mdash; RED (two clear developer-facing passages)

This is the worst offender on the site: it explains CLI output formats for users (good), then slips into an internal TypeScript-type reference block and ends with a section explicitly titled "Environment signal for tool authors".

Finding 1 (hard): Lines 187 to 199, section "## Response schema reference":

> The response fields, as exported from the source TypeScript types:
>
> ```ts
> interface StructuredOutputEnvelope<TData> {
>   schema: string
>   schemaVersion: string
>   didError: boolean
>   error: string | null
>   data: TData | null
> }
> ```

The table at lines 59 to 65 already describes these five fields in user-friendly prose. Repeating them as an internal TypeScript interface, framed with "as exported from the source TypeScript types", pulls the reader into XcodeBuildMCP's source instead of their own client/CLI consumption model. It duplicates the fields table and then editorializes about internal exports.

Proposal: **rewrite in user voice**. Drop the TypeScript interface. Keep the two schema-file links (lines 201 to 204). Suggested replacement:

> The same envelope fields are published as canonical JSON schemas under [`schemas/structured-output/`](https://github.com/getsentry/XcodeBuildMCP/tree/main/schemas/structured-output). Concrete examples:

(i.e. just remove lines 189 to 199 and keep the rest.)

Finding 2 (hard): Lines 329 to 332, section "## Environment signal for tool authors":

> The CLI stores the selected mode in `XCODEBUILDMCP_CLI_OUTPUT_FORMAT` while a tool invocation runs. Treat `--output` as the user-facing interface. The env var is useful when internal code needs to know whether the current CLI invocation selected `text`, `json`, `jsonl`, or `raw`.

This is explicitly titled for tool authors and says "internal code needs to know". It has no business on the public user-facing output-formats page.

Proposal: **move to `tool-authoring.mdx`**, under a new "Runtime signals" subsection inside an existing area (e.g. near "Streaming example" at lines 198 to 220 or as a closing bullet in "Common mistakes" at lines 271 to 282). Alternative home: `architecture.mdx` under "Rendering pipeline" (lines 112 to 138), since the env var is effectively a runtime-only boundary signal. Either way, delete from `output-formats.mdx`.

Finding 3 (soft): Lines 335 to 340, the "## Related" list includes links to `architecture` and `tool-authoring`:

> - [Architecture](/docs/architecture), contributor-level rendering model
> - [Tool Authoring](/docs/tool-authoring), adding schemas and structured results

These are fine as cross-links but the descriptor "contributor-level rendering model" explicitly surfaces the contributor split &mdash; which is appropriate if the audit logic holds. **Keep**, this is the boundary working correctly.

#### `configuration.mdx` &mdash; GREEN

Config file location, layering, full schema, quick-reference table. All user-visible options, each tied to a user-visible behavior. No action.

#### `session-defaults.mdx` &mdash; GREEN

How it works, runtime/config/env paths for setting, reference table, named profiles, opt-out, CLI behavior. All end-user. The page is agent-addressed as well as user-addressed (JSON snippets for `session_set_defaults` calls are literally what agents emit), but that is user-facing output in a client transcript, not an internal-protocol leak. No action.

Note to reviewer: audit prompt asks whether this page "explains the internal profile store". It does not. The "Named profiles" block is pure user-facing schema. **Open question below** is the opposite: whether the page should expand, not contract.

#### `env-vars.mdx` &mdash; GREEN

Two tables (general settings, session-default bootstrap) plus an example and the `setup --format mcp-json` pointer. All end-user. No action.

#### `xcode-ide.mdx` &mdash; YELLOW

Overview, requirements, enable, tools exposed, trust prompts, debug tools, Xcode-scoping env vars. Mostly user-facing.

Finding 1 (hard): Line 46:

> The CLI continues to use dynamic `xcode_tools_*` proxy naming.

Placed as a dangling trailing sentence after the "Tools exposed" table (lines 38 to 44), this is a confusing internal-detail throwaway. Users who skim will read "The two gateway tools `xcode_ide_list_tools` and `xcode_ide_call_tool` are stable" (good) and then bump into a reference to `xcode_tools_*` (what is that, did the previous sentence lie?).

Proposal: **rewrite in user voice**. Either drop the sentence, or expand it into a short explicit paragraph: "In CLI mode, the proxied Xcode tools are still exposed under their dynamic `xcode_tools_*` names rather than the two MCP gateway tools above." This is user-relevant when a user is running the CLI against the bridge.

Other sections:

- Lines 48 to 54 "Trust prompts" and lines 56 to 62 "Debug tools" mention `xcode_tools_bridge_status` / `xcode_tools_bridge_sync` / `xcode_tools_bridge_disconnect`. These are user-visible tools gated by `debug: true` and the troubleshooting flow is user-facing. **Keep**.

### Guides group

#### `device-signing.mdx` &mdash; GREEN

One-time Xcode setup, capability table, verify command, Wi-Fi note. All user-facing. No action.

#### `skills.mdx` &mdash; GREEN

Install, flags, unsupported-client fallback, why-skills bullets. All user-facing. No action.

#### `demos.mdx` &mdash; GREEN

Three media embeds with user-benefit captions. No action.

#### `migration-v2.mdx` &mdash; GREEN

Two breaking changes, detailed reference, CLI + skills announcement, project config announcement. All user-facing. The "Why default workflows changed" section (lines 96 to 100) briefly mentions LLM context-window mechanics; that is user-education, not internals. No action.

#### `privacy.mdx` &mdash; GREEN (one micro-rewrite)

Finding 1 (soft): Line 15:

> - **Internal operational logs** only when explicitly marked for Sentry (`{ sentry: true }` in server code). Standard console logs are not auto-forwarded.

The `{ sentry: true }` literal and "in server code" phrasing leaks an internal convention into an otherwise tight user-trust document. End users can't set that flag and don't need to know it is an object-literal key.

Proposal: **rewrite in user voice**. Example:

> - **Internal operational logs** only when the server explicitly tags an event for Sentry. Standard console logs are not auto-forwarded.

Small change, preserves the honesty of the boundary without exposing an implementation detail. **Keep the rest of the page as-is.**

#### `troubleshooting.mdx` &mdash; GREEN

Triage checklist, doctor, UI-automation, tool timeouts, missing tools, Xcode-agent PATH, device signing, stale simulators, daemon, socket perms, where to file. All end-user. No action.

#### `changelog.mdx` &mdash; GREEN

Pure `<LiveChangelog />` placeholder. No action.

## Consolidated proposal

Ordered by priority. "Find" column is line ranges to aid a follow-up agent.

| Priority | Page | Find | Action | Destination / replacement |
|----------|------|------|--------|---------------------------|
| P0 | `output-formats.mdx` | 329 to 332 | Move | `tool-authoring.mdx` (new "Runtime signals" subsection near lines 198 to 220) OR `architecture.mdx` under "Rendering pipeline" (lines 112 to 138). Remove from `output-formats.mdx`. |
| P0 | `mcp-mode.mdx` | 128 to 136 | Rewrite in user voice | Replace table with one sentence of user outcome. Drop the `readOnlyHint`/`destructiveHint`/`openWorldHint` keys. They are already documented for authors in `tool-authoring.mdx` lines 124 to 141. |
| P1 | `output-formats.mdx` | 187 to 199 | Remove (or trim) | The five envelope fields are already documented in the table at lines 59 to 65. Drop the TypeScript interface block and the "as exported from the source TypeScript types" sentence. Keep the two schema links at lines 201 to 204. |
| P2 | `xcode-ide.mdx` | 46 | Rewrite in user voice | Either drop the `xcode_tools_*` sentence or expand into a clear paragraph: "In CLI mode, proxied Xcode tools are exposed under dynamic `xcode_tools_*` names rather than the two gateway tools above." |
| P3 | `privacy.mdx` | 15 | Rewrite in user voice | Replace `` `{ sentry: true }` in server code `` with "when the server explicitly tags an event for Sentry." |
| P4 | `cli.mdx` | 122 to 136 | Optional rewrite | Lead with outcome ("first stateful call auto-starts a per-workspace daemon; it shuts down after 10 minutes idle"), demote socket path / workspace identity to reference bullets below. No move. |

No page-level moves into Contributing are warranted. Every finding can be resolved by trimming a paragraph, rewriting a sentence, or moving a single four-line passage (the `XCODEBUILDMCP_CLI_OUTPUT_FORMAT` one).

## Open questions for reviewer

1. **Tool annotations visibility.** `mcp-mode.mdx` currently teaches the raw annotation keys. End users can observe the effect (no confirmation prompt), but power users occasionally want to audit which tools claim `destructiveHint` before handing the keys to their agent. Options:
   - (A) Drop the keys entirely (current proposal).
   - (B) Keep the keys but reframe as "what XcodeBuildMCP advertises to your client" rather than "annotations declared per tool".
   - (C) Move the table to `tools.mdx` as a filter in the live `<ToolExplorer />` (this is a real user workflow but would be a feature, not a doc edit).
   Recommend (A) for now; revisit if (C) is ever shipped.

2. **`XCODEBUILDMCP_CLI_OUTPUT_FORMAT` destination.** The env-var note is legitimately useful for tool authors but it's also a runtime-layer concern. Move to `tool-authoring.mdx` (closer to the audience) or `architecture.mdx` (closer to the mechanism)? My default is `tool-authoring.mdx`, appended near the bottom of "Streaming example" or in a new one-line "Runtime env signals" bullet, because that is where someone first encounters CLI output format in their own code. Confirm before moving.

3. **Session defaults internal state.** Audit prompt specifically asks whether `session-defaults.mdx` "explains the internal profile store". It does not; the whole page is user-observable behavior and YAML schema. No change. Flagging in case the prompt intended a different target.

4. **Daemon phrasing in `cli.mdx`.** The "Per-workspace daemon" section (lines 122 to 136) is not quite implementation-voiced but is close. Is the current outcome-plus-reference mix the right level for users, or would a lede-first rewrite be clearer? Low-impact, low-risk &mdash; deferrable.

5. **Contributor cross-links on user pages.** `output-formats.mdx` Related section labels the Architecture link "contributor-level rendering model" (line 339). Keep as-is (it accurately tells the user they are crossing a boundary), or simplify to just the title? I recommend **keep**, because the label is the only signal to a skim-reader that the linked page is not for them.

## Execution decisions (locked in by reviewer)

The audit's findings are being actioned. Decisions recorded here so sub-agents working on specific items can see the full picture.

### Reframing: tool annotations are public API, not internal

`readOnlyHint`, `destructiveHint`, `openWorldHint` are part of the public MCP response XcodeBuildMCP advertises. They **stay** in end-user-visible docs. The original P0 recommendation to drop them is reversed. Full treatment moves to a new **`mcp-protocol-support.mdx`** page under the Reference group; `mcp-mode.mdx` keeps a short outcome-focused section that links to the new page.

Per-tool annotation **pills** in `<ToolExplorer />` (badge beside each tool in the catalog) are a good future feature but **out of scope** for this pass — requires a component change in `_components/tool-explorer.tsx` and a data change in the generated manifest JSON.

### Open questions — resolved

- **Q1 (tool annotation visibility)** — keep as public API. New page.
- **Q2 (`XCODEBUILDMCP_CLI_OUTPUT_FORMAT` destination)** — **Option C: delete entirely**. It is an internal mechanism; no reason for end users or tool authors to know about it moving forward. Not moved to `tool-authoring.mdx` or `architecture.mdx` — removed.
- **Q3 (session-defaults internal state)** — confirmed no leak. No action.
- **Q4 (`cli.mdx` daemon lede)** — **rewrite**. Do not assume users know what a daemon is. Open with the user-facing concept: "some tools rely on long-running background processes". Then introduce that XcodeBuildMCP calls this a daemon, cover lifecycle, workspace scoping (tied to `.xcodebuildmcp/config.yaml`), and available management commands. `.xcodebuildmcp/config.yaml` is part of the public feature — treat it as such.
- **Q5 (cross-link label on `output-formats.mdx`)** — **keep as-is**. The qualifier "contributor-level rendering model" is a useful boundary signal.

### Sidebar placement

New page slug: `mcp-protocol-support`. Sidebar group: **Reference**. Suggested position: after `tools` and before `output-formats` (so the user flow is "what tools exist → which MCP features do they flow through → what does the output look like"). Update `/Volumes/Developer/xcodebuildmcp.com/app/docs/_data/routes.ts`:
- Add `"mcp-protocol-support"` to `DocSlug` union
- Add `"mcp-protocol-support"` to `PAGES_ORDER` in the chosen position
- Add a `PAGE_META` entry (title "MCP Protocol Support", group "Reference", description calling out that the page declares which MCP spec features XcodeBuildMCP implements)
- Add `{ slug: "mcp-protocol-support" }` to the Reference `SidebarGroup.items`

### Execution plan (three parallel work items)

- [x] **Item 1 — prose trims in existing pages** (done)
  - `output-formats.mdx`: remove lines 329–332 ("Environment signal for tool authors" section)
  - `output-formats.mdx`: remove lines 187–199 (TypeScript `StructuredOutputEnvelope<TData>` interface block and the "as exported from the source TypeScript types" sentence). Keep the two schema links immediately below.
  - `xcode-ide.mdx`: rewrite line 46 (`xcode_tools_*` dangling sentence) into a clear user-facing paragraph — recommended: "In CLI mode, proxied Xcode tools are exposed under dynamic `xcode_tools_*` names rather than the two gateway tools above."
  - `privacy.mdx`: rewrite line 15 — replace `` the `{ sentry: true }` in server code `` sigil with "when the server explicitly tags an event for Sentry."
  - No other changes to these files.

- [x] **Item 2 — `cli.mdx` daemon section rewrite (lines 122–136)** (done)
  - Open with the user-facing concept before naming the daemon. Suggested lede: "Some XcodeBuildMCP tools (log capture, debugging, long-running builds, test runs) need a background process to keep state across commands. The first time you use one of these, XcodeBuildMCP auto-starts a small scoped background process — a daemon — that survives between CLI invocations."
  - Then explain lifecycle (shuts down after 10 min idle), workspace scoping (keyed off `.xcodebuildmcp/config.yaml`, or the current directory when absent), and the user-visible management commands (`daemon start`, `daemon status`, `daemon stop`, plus whatever else exists — the agent should verify by reading the current CLI surface).
  - Socket path stays but becomes reference detail under a "Reference" heading, not the opening sentence.
  - Result: a user who has never heard the word "daemon" can understand why this exists and what to do about it, without reading implementation-first phrasing.

- [x] **Item 3 — new `mcp-protocol-support.mdx` page + `mcp-mode.mdx` trim + `routes.ts` registration** (done)
  - Create `/Volumes/Developer/xcodebuildmcp.com/app/docs/_content/mcp-protocol-support.mdx`.
  - Investigate the actual XcodeBuildMCP MCP server surface before writing. Do **not** fabricate feature claims. Starting points:
    - `/Volumes/Developer/XcodeBuildMCP/src/server/` — server entry + capability declarations
    - `/Volumes/Developer/XcodeBuildMCP/src/mcp/` — MCP-facing adapters, tools, resources
    - `/Volumes/Developer/XcodeBuildMCP/src/core/manifest/` — manifest layer that annotations flow through
    - `/Volumes/Developer/XcodeBuildMCP/schemas/structured-output/` — structured content envelope schemas
  - Page content, minimum coverage (expand if more is actually implemented):
    - Short intro: the MCP protocol has many optional features; this page declares which ones XcodeBuildMCP implements (so MCP-literate readers can evaluate coverage).
    - Feature table or sections for: tools (list + call), tool annotations (full `readOnlyHint`/`destructiveHint`/`openWorldHint`/`idempotentHint`/`openWorldHint` as actually declared, with user-outcome framing), structured content (the envelope + schemas we publish), resources (if any), notifications (tool-list changes, progress if emitted, logs if forwarded), prompts (honest "not implemented" if that's the state), server capabilities advertised on initialize.
    - Cross-links: to `tools` (catalog), `output-formats` (envelope details), `mcp-mode` (how to run the server).
    - Keep tone direct, no emoji, technical prose.
  - Trim `mcp-mode.mdx` tool annotations section (lines 128–136) to a short outcome-focused paragraph plus a link to the new page. Suggested content: one sentence covering "every tool declares read-only / destructive / open-world hints so compliant clients can reduce confirmation prompts", then "See [MCP Protocol Support](/docs/mcp-protocol-support) for the full list of MCP features XcodeBuildMCP implements." Drop the raw annotation-keys table — the full table lives on the new page.
  - Update `routes.ts` as described under "Sidebar placement" above.
  - Check the file `/Volumes/Developer/xcodebuildmcp.com/app/docs/_content/index.ts` for any registration the new slug needs.

### Cross-cutting notes for all three items

- Do not touch legacy `/Volumes/Developer/XcodeBuildMCP/docs/*.md` files. They are being replaced by the docs site.
- Audience framing is captured in `/Volumes/Developer/XcodeBuildMCP/CLAUDE.md` and `AGENTS.md` under `## Docs > ### Audience`. Read it before writing new prose.
- All three items run in parallel in separate agents. File ownership does not overlap.

## Scope checks honored

- Only pages under the non-Contributing groups were audited (`introduction`, `installation`, `setup`, `clients`, `cli`, `mcp-mode`, `workflows`, `tools`, `output-formats`, `configuration`, `session-defaults`, `env-vars`, `xcode-ide`, `device-signing`, `skills`, `demos`, `migration-v2`, `privacy`, `troubleshooting`, `changelog`). Each page was read in full.
- Contributing pages (`contributing.mdx`, `architecture.mdx`, `tool-authoring.mdx`, `testing.mdx`) were read only to confirm they are the right landing zones for flagged content. Their own content is out of scope.
- No sidebar restructuring is proposed beyond relocations into existing Contributing pages.
- No new pages are proposed; if one is needed in future, see open question 2.
- Legacy `/Volumes/Developer/XcodeBuildMCP/docs/` markdown files were not examined.
- No `.mdx` files were modified.
