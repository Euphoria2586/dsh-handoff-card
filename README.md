# DSH Handoff Card
**Leave a good next step.** An explicit checkpoint for your next self or next agent.

[简体中文](README.zh-CN.md) · MIT · Node.js 22+ · Zero plugin runtime dependencies

![Offline handoff card studio](docs/assets/gallery-desktop.png)

## Try it in a minute
With Git and Node.js 22+ installed, run:

```sh
git clone https://github.com/Euphoria2586/dsh-handoff-card.git
cd dsh-handoff-card
node cli.mjs serve
```

Open <http://127.0.0.1:4188>. You can also use **Code → Download ZIP**, extract it, and run `node cli.mjs serve` in that folder. The offline demo needs no account, API key or package install. Try the demo first; install into DSH below when you are ready.

## Install into DSH
A native Cordis plugin for **@deepseek-ai/dsh 0.2.1-rc.2**, registering a human command and model-facing tool:
```sh
node setup.mjs --write ./cordis.yml
npx @deepseek-ai/dsh@0.2.1-rc.2 web --patch ./cordis.yml --no-open
```
Run inside this directory. DSH is a separate host dependency. Setup creates an absolute-path Cordis insert patch and never overwrites an existing file. Omit arguments to print YAML. Regenerate the patch if you move the project.

## Human command
```text
/handoff set {"goal":"Ship the parser","progress":["Core implemented"],"next":["Run regression tests"],"blockers":[],"links":[]}
/handoff show
/handoff json
/handoff clear
```
`set` replaces the whole checkpoint after validation. `show` produces readable Markdown; `json` exports the exact normalized card. `clear` removes only plugin memory, not prior DSH history.

## Model-facing tool
The plugin injects `commands` and `tools`, then registers `handoff_update` with a raw JSON Schema and a canonical string output contract. The tool accepts the same five fields as the command; `goal` is required. Ask the model to record an explicit checkpoint with this tool. It returns a short confirmation; view/export the card with `/handoff show` or `/handoff json`.

Raw tool arguments are validated in the engine before the current checkpoint is replaced. The tool checks cancellation and resolves the receiving `exec.agent.session`. Commands and tools share a WeakMap keyed by Session, so independent sessions do not share notes.

## Input contract
- `goal`: nonempty string, at most 300 characters.
- `progress`, `next`, `blockers`, `links`: arrays of up to 12 nonempty strings, at most 500 characters each.
- Optional arrays default to empty. Unknown fields are rejected; normalized JSON adds `version:1`.
- Links must be absolute HTTP(S) URLs without embedded username/password.
- JSON text imports are limited to 128 KiB. Control characters are rejected.
- Notes and links are supplied claims; nothing is inferred from the transcript or verified against files.

## Persistence and privacy
The checkpoint exists only in the live plugin's session memory. Export it before process restart or plugin reload; there is no automatic disk storage or recovery. `recordInput:false` prevents this command's raw input from being duplicated in `command/run`, **but DSH may persist displayed command results and model tool arguments/results in its own history**. Never include secrets. Clear does not delete earlier host logs.

## Offline studio
```sh
node cli.mjs serve
# Open http://127.0.0.1:4188
node cli.mjs inspect examples/card.json --format md
node cli.mjs inspect examples/card.json --format svg > handoff.svg
node --test
```
The browser is an offline card studio with synthetic sample notes, not a connection to a DSH session. It prepares a reviewable `/handoff set` command but never sends it. Export JSON, Markdown or SVG. DOM rendering uses text nodes; SVG text is escaped.

## Compatibility and tests
Contracts were verified against [DSH commit 687f282](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/cookbook/extension-cookbook.md), [commands](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/interaction/commands/src/index.ts), [tool authoring](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/cookbook/adding-a-tool.md), and [tools runtime](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/core/tools/src/index.ts), checked 2026-10-22.

The batch integration check loaded the plugin in real Cordis 4.0.5 with commands/tools 0.2.1-rc.2 and verified command dispatch, tool execution/validation, session isolation and disposal. It does not claim a complete live-model run. Standalone tests cover the engine, native registration contracts, cancellation, session isolation, escaping and loopback server boundaries. Pin the host version because RC APIs can change.

Contributions: add explicit formats, accessible card designs and tests. Do not invent progress, mine private history, or add automatic file writes. [Launch kit](LAUNCH.md). Independent community project, not affiliated with DeepSeek.

## Recent checkpoints and undo
The native plugin retains **at most five checkpoints including the current one**, separately per Session. Human `set` and model `handoff_update` use the same bounded history. Identical consecutive updates do not consume a slot. Invalid or cancelled updates do not replace the current card or add history.
```text
/handoff history
/handoff undo
/handoff show zh
/handoff history zh
/handoff undo zh
/handoff clear zh
```
`history` lists revision numbers and goals. `undo` discards the newest checkpoint and restores the previous one; there is no redo and the final remaining checkpoint cannot be undone. Further saves use a new revision number. `clear` removes the current card **and all undo history**. Nothing is written to disk; DSH's earlier command/tool logs are unaffected.

The offline studio has equivalent local history, undo and clear controls. Clicking Save handoff card saves a checkpoint; merely editing fields does not. Undo discards unsaved edits. Loading a demo or importing a valid card also adds a checkpoint. Closing the tab loses all history, so export anything you need first.

## Chinese support
Use the selector or initialize with `?lang=zh` / `?lang=en`; switching preserves inputs, history, preview and invalid-export state. English stays the default without a valid parameter. User notes are never automatically translated. Load Demo after switching to Chinese to use a Chinese synthetic fixture. Native human commands support a `zh` suffix, and Markdown/SVG exports follow the interface language. JSON keeps its existing fields.

Optional browser checks: provide Playwright separately (or `PLAYWRIGHT_MODULE_PATH`), then `node scripts/browser-smoke.mjs`. Optional `PLAYWRIGHT_CHANNEL=msedge`. Checks include URL initialization, switching with unsaved input, bounded history, undo, clear, invalid input, Chinese exports and mobile overflow.

![Chinese handoff studio](docs/assets/zh-desktop.png)

