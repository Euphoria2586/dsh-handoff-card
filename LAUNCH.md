# DSH Handoff Card — launch kit

## What this is
A native DSH command and model tool for explicit per-session handoff notes, with an offline card studio and reviewable export formats.
Target: DSH 0.2.1-rc.2. Independently authored community plugin, not an official DeepSeek product. Native Cordis registration, not a generic MCP wrapper.

## Primary-source hook
DeepSeek Harness exposes native hooks, human commands and model tools in its open-source runtime. This project uses those actual extension points. We do not claim measured popularity or invent a release date. Sources pinned to 687f282e8625c6b8d11ff58211a90524be2e4317, checked 2026-10-22:
- [DeepSeek Harness native extension cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/cookbook/extension-cookbook.md)
- [DeepSeek Harness command registry](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/interaction/commands/src/index.ts)
- [DSH tool authoring contract](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/cookbook/adding-a-tool.md)
- [DSH tools runtime](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/core/tools/src/index.ts)

## English draft
Future me deserves a better handoff than “almost done.”

DSH Handoff Card adds /handoff and a model tool to DeepSeek Harness. Record the goal, progress, blockers and next steps; export a small card when you want to carry the checkpoint forward.

Explicit notes, no transcript mining. State is session memory, so export before restart. There is also an offline card studio that prepares a command for you to review.
[Source code](https://github.com/Euphoria2586/dsh-handoff-card)

## 中文草稿
给下一位自己或 Agent 留张接得住的交接卡。

DSH Handoff Card 原生提供 /handoff 与 handoff_update 工具：明确记录目标、进展、阻塞和下一步，再导出 Markdown / JSON / SVG。

不挖对话、不编进展。状态只在当前 session 内存中，重启前记得导出。自带离线卡片工作台，生成的命令由你检查后再粘贴。
[开源仓库](https://github.com/Euphoria2586/dsh-handoff-card)

## Demo script
1. Edit the goal and next steps
2. Click Save handoff card
3. Review the generated /handoff set command
4. Export the card as Markdown or SVG
Then show the generated Cordis patch and native command registration in plugin.mjs.

## Release notes and guardrails
- Run standalone tests and the real DSH registry smoke check; label any untested live-model workflow clearly.
- Use synthetic data in screenshots. Do not include credentials, private prompts or private project links.
- Ship both README languages, MIT, setup.mjs, examples, tests and screenshots.
- Replace repository placeholders before publishing; no fabricated benchmarks, usage numbers, endorsements or stars.
- Tags: deepseek-harness, dsh-plugin, cordis, agent-handoff, developer-tools.

