# Investigation: Architecture doc accuracy audit

## Summary

`xcodebuildmcp.com/app/docs/_content/architecture.mdx` is overwhelmingly accurate. Six concrete corrections were identified and **all six have been applied** as of 2026-04-25:

1. CLI entry pattern was too narrow (omitted top-level commands). Fixed.
2. Manifest availability did not actually include daemon mode. Fixed.
3. Tool factory list missed session-aware variants. Fixed.
4. Next-step "tools do not hand-write follow-up instructions" claim was too absolute. Fixed.
5. Daemon idle-shutdown wording was too narrow. Fixed.
6. `liveProgressEnabled` and `streamingFragmentsEnabled` were undocumented booleans on `ToolHandlerContext`. Fields removed from the doc; code-level removal tracked in [getsentry/XcodeBuildMCP#360](https://github.com/getsentry/XcodeBuildMCP/issues/360).

All other claims (manifest layout, workflow selection, rendering strategies, streaming taxonomy, build pipeline) checked out against the code and required no changes.

## Symptoms

The architecture page makes many specific code-level claims (module paths, function names, type shapes, manifest fields, runtime behavior, build steps). Some had drifted as the codebase evolved.

## Background / Prior Research

Not needed. This audit is entirely in-workspace verification of doc claims against `XcodeBuildMCP/` source.

## Investigator Findings

### Verified accurate (no change needed)

- Two runtimes share one tool implementation layer. Same `toolModule.handler` is used by MCP and CLI/daemon. (`src/utils/tool-registry.ts:288-301`, `src/runtime/tool-catalog.ts:124-149`)
- `xcodebuildmcp mcp` is the MCP entry. (`src/cli.ts:82-87`, `src/cli/commands/mcp.ts:6-10`)
- Manifest dirs and field schemas: `manifests/tools/`, `manifests/workflows/`, `manifests/resources/` with the exact field sets the doc lists. (`src/core/manifest/load-manifest.ts:64-69,166-169`, `src/core/manifest/schema.ts:80-119,144-168,188-220`)
- `loadManifest()` reads YAML and validates with Zod. (`src/core/manifest/load-manifest.ts:28-48,72-117,169-198`)
- `importToolModule()` lazily imports tool modules from manifest `module` paths. (`src/core/manifest/import-tool-module.ts:26-45`)
- The YAML manifest example matches the actual schema. (`manifests/tools/list_sims.yaml:1-8` against `src/core/manifest/schema.ts:80-119`)
- Three-layer visibility model: workflow selection / predicate filtering / runtime availability. (`src/utils/tool-registry.ts:198-241`, `src/visibility/exposure.ts:147-175`)
- Default workflow is `simulator`. (`manifests/workflows/simulator.yaml:1-7`)
- `session-management` is auto-included. (`manifests/workflows/session-management.yaml:1-10`, `src/visibility/exposure.ts:157-162`)
- `workflow-discovery` is auto-included only when its experimental predicate passes. (`manifests/workflows/workflow-discovery.yaml:1-10`, `src/visibility/predicate-registry.ts:17-19`)
- Tool modules export `schema` and `handler`. Importer enforces named exports. (`src/core/manifest/import-tool-module.ts:43-51`)
- `ToolHandlerContext` shape exactly matches doc: `emit`, `attach`, `liveProgressEnabled`, `streamingFragmentsEnabled`, `nextStepParams?`, `nextSteps?`, `structuredOutput?`. (`src/rendering/types.ts:37-45`)
- All eight named example tools (streaming and non-streaming) exist with matching executor types. (`src/mcp/tools/...`, manifests under `manifests/tools/`)
- Domain fragments and results live where the doc says. (`src/types/domain-fragments.ts:37-182`, `src/types/domain-results.ts:1-31,385-415`)
- Structured output shape `{ result, schema, schemaVersion }` lives in `src/rendering/types.ts:30-35`. (Doc also accurately notes the optional `renderHints?` is part of this type, though it is not called out.)
- Rendering strategies are `text`, `cli-text`, `raw`. (`src/rendering/types.ts:5`, `src/rendering/render.ts:160-171`) Behaviors match: `text` buffers and finalizes (lines 100-109), `cli-text` streams with TTY-aware progress (lines 146-157, plus `src/cli/register-tool-commands.ts:302-306`), `raw` writes transcript fragments to stderr and final non-transcript text to stdout (`src/rendering/render.ts:111-143`).
- `json` and `jsonl` are CLI boundary modes, not render strategies. (`src/cli/output.ts:1`, `src/cli/register-tool-commands.ts:302-360`)
- MCP `--output json` waits for structured output before printing; `jsonl` writes fragments as they arrive without final response. (`src/cli/register-tool-commands.ts:347-358`)
- `postProcessSession()` resolves templates after handler completes, filters success/failure, merges runtime params, normalizes names, attaches steps. (`src/runtime/tool-invoker.ts:25-194,464-469`)
- CLI vs MCP next-step formatting differs at the runtime boundary. (`src/runtime/tool-invoker.ts:193-194,463-468`, `src/utils/tool-registry.ts:306-312`)
- Daemon socket path is `~/.xcodebuildmcp/daemons/<workspace-key>/daemon.sock`, overridable by `XCODEBUILDMCP_SOCKET`. (`src/daemon/socket-path.ts:6-13,26-38,48-58`)
- Daemon auto-starts on first stateful invocation. (`src/runtime/tool-invoker.ts:389-441`, `src/cli/daemon-control.ts:113-144`)
- Workspace identity derived from project config location or cwd. (`src/daemon/socket-path.ts:14-24`)
- 10-minute default idle timeout. (`src/daemon/idle-shutdown.ts:3-4`)
- Daemon streams fragments back to CLI then returns structured output and next-step data. (`src/daemon/daemon-server.ts:160-197`, `src/daemon/protocol.ts:42-52`)
- Build pipeline: `npm run build` → Wireit `build` target → `build:tsup` → `generate:version` + `tsup`. (`package.json:18-21,101-104`)
- `tsup` produces unbundled ESM in `build/`; rewrites `.ts`→`.js` import specifiers; chmods `cli.js`, `doctor-cli.js`, `daemon.js`. (`tsup.config.ts:8-27,35-66`)
- Manifests and structured-output schemas are package assets read at runtime, not generated loaders. (`package.json:70-76`, `src/core/resource-root.ts:64-77`, `src/core/manifest/load-manifest.ts:64-72`)

### Inaccuracies (require correction)

#### Finding 1: CLI entry pattern omits top-level commands

**Claim:** "CLI: `xcodebuildmcp <workflow> <tool>`"

**Reality:** The CLI registers the workflow command tree alongside several non-workflow top-level commands. Verified in `src/cli/yargs-app.ts:75-95`:

```typescript
registerMcpCommand(app);          // mcp
registerInitCommand(app, ...);    // init
registerSetupCommand(app);        // setup
registerUpgradeCommand(app);      // upgrade
registerToolsCommand(app);        // tools
registerToolCommands(...);        // <workflow> <tool>
registerDaemonCommands(...);      // daemon
```

Top-level commands include `mcp`, `init`, `setup`, `upgrade`, `tools`, and `daemon`. The `<workflow> <tool>` pattern is only for tool invocations.

**Correction:** Reframe the CLI runtime row to acknowledge both shapes. **Status (2026-04-25): applied.**

#### Finding 2: Manifest availability does not include daemon

**Claim:** "Whether a manifest entry is exposed to MCP, CLI, or daemon mode."

**Reality:** Manifest `availability` is a Zod object with only two flags:

```typescript
// src/core/manifest/schema.ts:10-15
export const availabilitySchema = z
  .object({
    mcp: z.boolean().default(true),
    cli: z.boolean().default(true),
  })
  .strict();
```

Daemon exposure is special-cased in code (`src/visibility/exposure.ts:18-24,46-52`). Daemon serves CLI-routed stateful tools rather than appearing as a manifest availability flag.

**Correction:** Drop "daemon" from the manifest availability description; note daemon exposure is derived, not declared. **Status (2026-04-25): applied.**

#### Finding 3: Tool factory list omits session-aware variants

**Claim:** "A handler created with `createTypedTool(...)` or `createTypedToolWithContext(...)`."

**Reality:** Two more factories exist and are used by many tools:

```typescript
// src/utils/typed-tool-factory.ts:186, :202
export function createSessionAwareTool<TParams>(opts: { ... })
export function createSessionAwareToolWithContext<TParams, TContext>(opts: { ... })
```

Real tool examples using `createSessionAwareTool`: `src/mcp/tools/simulator/build_sim.ts:224-232`, `src/mcp/tools/project-discovery/show_build_settings.ts:141-150`. These are the factories that integrate session-default merging into validation.

**Correction:** Add the session-aware variants to the export row in the tool contract table. **Status (2026-04-25): applied.**

#### Finding 4: Next-step framing is too absolute

**Claim:** "Tools do not hand-write follow-up instructions. Next steps come from two places: 1. Static templates in the tool manifest. 2. Runtime params from `ctx.nextStepParams` or explicit `ctx.nextSteps`."

**Reality:** The two-bullet list itself is right, but the leading sentence ("Tools do not hand-write follow-up instructions") contradicts bullet 2. Handlers can set explicit `ctx.nextSteps` (`src/rendering/types.ts:42-44`), and `postProcessSession()` honors them (`src/runtime/tool-invoker.ts:148-190`). Manifests are the preferred and most common path; explicit handler steps are the escape hatch for dynamic follow-ups manifest templates cannot represent.

**Correction:** Rephrase the lede to reflect the preference + escape hatch rather than an absolute prohibition. **Status (2026-04-25): applied.**

#### Finding 5: Daemon idle shutdown wording is too narrow

**Claim:** "The daemon shuts down after 10 minutes idle by default, when no stateful sessions are active."

**Reality:** The idle check requires three conditions, verified in `src/daemon.ts:336-360`:

```typescript
if (idleForMs < idleTimeoutMs) return;       // (1) idle time elapsed
if (inFlightRequests > 0) return;             // (2) no in-flight requests
if (hasActiveRuntimeSessions(...)) return;    // (3) no active runtime sessions
```

`hasActiveRuntimeSessions` is `activeOperationCount > 0` (`src/daemon/idle-shutdown.ts:24-26`). The doc's "no stateful sessions are active" only covers condition (3); it omits the in-flight-requests check.

**Correction:** Expand the daemon facts row to include in-flight requests. **Status (2026-04-25): applied.**

#### Finding 6: `liveProgressEnabled` vs `streamingFragmentsEnabled` are not explained

**Claim:** The doc lists both `liveProgressEnabled: boolean` and `streamingFragmentsEnabled: boolean` on `ToolHandlerContext` without explaining the distinction. The verbatim interface shape is technically correct (both fields exist in `src/rendering/types.ts:40-41`), but a tool author reading the doc reasonably asks why both are there.

**Reality:** They are not redundant. Verified in `src/utils/tool-execution-compat.ts:7-22`:

- **`liveProgressEnabled`** controls whether the tool's logic *produces* live progress (extra work to surface stages, periodic updates).
- **`streamingFragmentsEnabled`** controls whether emitted fragments are *forwarded* through the render pipeline or silently dropped at the wire boundary.

In most boundaries they track each other (both true for CLI text/jsonl, both false for MCP and CLI json/raw). They diverge in the daemon case (`src/daemon/daemon-server.ts:181-182`): `liveProgressEnabled: false` (the daemon does not render its own progress) and `streamingFragmentsEnabled: true` (it forwards fragments back to the CLI client over the daemon protocol, which then renders them).

**Correction:** Drop both fields from the documented `ToolHandlerContext` shape rather than explaining them. They are slated for removal from the API itself in [getsentry/XcodeBuildMCP#360](https://github.com/getsentry/XcodeBuildMCP/issues/360); documenting dead/about-to-be-removed surface area is worse than omitting it. **Status (2026-04-25): applied** — the interface block in `architecture.mdx` no longer references these fields.

### Additional gap (worth mentioning, not blocking)

The architecture doc does not mention the `XCODEBUILDMCP_DAEMON_IDLE_TIMEOUT_MS` env var, which overrides the 10-minute default (`src/daemon/idle-shutdown.ts:3-22`). This is a nicety; including it would make the daemon facts row complete.

## Investigation Log

### Phase 1 – Initial assessment
**Hypothesis:** The architecture doc has drifted in places.
**Findings:** Identified ~50 verifiable claims across 9 subsystems (runtimes, manifests, workflow selection, tool contract, streaming, domain types, rendering, next-steps, daemon, build pipeline).
**Conclusion:** Proceed via context_builder + oracle synthesis.

### Phase 2 – Context builder + oracle audit
**Hypothesis:** Claims may have drifted as code evolved.
**Findings:** context_builder seeded 71 files (58 full, 13 codemap) covering every claim area. Oracle's response_type=question pass produced a claim-by-claim verification with file:line evidence. Five inaccuracies identified, all the rest verified accurate.
**Evidence:** Oracle export at `prompt-exports/oracle-question-2026-04-25-094309-architecture-audit-c-65ef.md`.
**Conclusion:** Five corrections needed; remaining claims are accurate.

### Phase 3 – Spot verification
**Hypothesis:** Oracle's load-bearing line references should be verified against actual files.
**Findings:** Direct reads confirmed:
- `src/core/manifest/schema.ts:11-15` only declares `mcp` and `cli` in availability.
- `src/utils/typed-tool-factory.ts:186,202` declares both `createSessionAwareTool` and `createSessionAwareToolWithContext`.
- `src/cli/yargs-app.ts:75-95` registers six top-level commands plus the workflow tool tree.
- `src/daemon.ts:337-358` confirms three idle-check conditions: time, in-flight requests, active runtime sessions.
- `src/rendering/types.ts:37-45` confirms `ToolHandlerContext.nextSteps?` exists, supporting handler-set follow-ups.
- `src/daemon/socket-path.ts:53-58` confirms `XCODEBUILDMCP_SOCKET` override.
**Conclusion:** All five oracle-flagged inaccuracies confirmed against source.

## Root Cause

Doc drift, not implementation bugs. Five sentences in `architecture.mdx` describe earlier states of the codebase or oversimplify. The remaining content has stayed in sync.

## Recommendations

Apply these six textual corrections to `xcodebuildmcp.com/app/docs/_content/architecture.mdx`. Suggested replacement text per finding:

### 1. CLI runtime row in "The two runtimes" table

**Current** (entry point cell):
> `xcodebuildmcp <workflow> <tool>`

**Replace with:**
> `xcodebuildmcp <workflow> <tool>` for tool invocations. Top-level commands such as `mcp`, `init`, `setup`, `upgrade`, `tools`, and `daemon` are also registered.

### 2. Runtime availability row in "Workflow selection" table

**Current:**
> Whether a manifest entry is exposed to MCP, CLI, or daemon mode.

**Replace with:**
> Whether a manifest entry is exposed to MCP or CLI. Daemon exposure is derived: the daemon serves CLI-routed stateful tools rather than appearing as a manifest flag.

### 3. Tool contract `handler` export description

**Current:**
> A handler created with `createTypedTool(...)` or `createTypedToolWithContext(...)`.

**Replace with:**
> A handler created with `createTypedTool(...)`, `createTypedToolWithContext(...)`, `createSessionAwareTool(...)`, or `createSessionAwareToolWithContext(...)`.

### 4. Next-step resolution lede

**Current:**
> Tools do not hand-write follow-up instructions. Next steps come from two places: 1. Static templates in the tool manifest. 2. Runtime params from `ctx.nextStepParams` or explicit `ctx.nextSteps`.

**Replace with:**
> Follow-up instructions normally come from static templates in the tool manifest. Handlers should prefer setting `ctx.nextStepParams` to provide runtime values for those templates, but may set explicit `ctx.nextSteps` when a dynamic follow-up cannot be represented by a template.

### 5. Daemon idle-shutdown row in "Daemon facts" table

**Current:**
> The daemon shuts down after 10 minutes idle by default, when no stateful sessions are active.

**Replace with:**
> The daemon shuts down after 10 minutes idle by default (overridable via `XCODEBUILDMCP_DAEMON_IDLE_TIMEOUT_MS`), once no in-flight requests are pending and no active runtime sessions remain.

### 6. ToolHandlerContext interface block

**Current** (just the interface, no field-level explanation):
```ts
interface ToolHandlerContext {
  emit: (fragment: AnyFragment) => void
  attach: (image: ImageAttachment) => void
  liveProgressEnabled: boolean
  streamingFragmentsEnabled: boolean
  nextStepParams?: NextStepParamsMap
  nextSteps?: NextStep[]
  structuredOutput?: StructuredToolOutput
}
```

**Replace with the same interface plus a follow-up explainer:**

> `liveProgressEnabled` and `streamingFragmentsEnabled` look redundant but they govern different stages. `liveProgressEnabled` tells the tool's logic whether to *produce* progress events at all. `streamingFragmentsEnabled` tells the wire boundary whether emitted fragments should be *forwarded* through the render pipeline or silently dropped. They track each other in most cases (both true for CLI text/jsonl, both false for MCP and CLI json/raw). They diverge for daemon-routed calls: the daemon does not render its own progress (`liveProgressEnabled: false`) but does forward fragments back to the CLI client over the daemon protocol (`streamingFragmentsEnabled: true`).

## Preventive Measures

- **Tie key claims to code as the codebase evolves.** Periodic targeted audits like this one catch drift cheaply because each architecture-doc paragraph maps to a small set of source files.
- **Prefer claim shapes that age well.** "Manifest availability declares MCP/CLI exposure; daemon exposure is derived" survives refactors better than "MCP, CLI, or daemon mode" because it states intent rather than enumerating an implementation detail.
- **Note escape hatches even when the happy path dominates.** "Manifests are the source of next steps" is briefer but misleads contributors who hit cases where they need `ctx.nextSteps`. Stating the escape hatch explicitly removes a future bug-report-or-PR cycle.
