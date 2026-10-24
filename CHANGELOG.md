# Changelog

## 0.2.1 — 2026-10-23

- Restore unsaved notes from the current checkpoint, show when the preview is older, and copy the DSH command. Full quoted checkpoints now round-trip within a 128 KiB UTF-8 import limit.
- Add a short getting-started panel with one concrete action; standalone pages stay independent.

## 0.2.0 — 2026-10-22

- Added bounded session history: at most 5 checkpoints including current, shared by human commands and model tool updates.
- Added `/handoff history` and `/handoff undo`; identical saves do not consume history, rejected/cancelled saves leave history untouched, and clear removes all revisions.
- Added offline studio undo, recent-checkpoint list and full clear; unsaved edits remain unsaved until Prepare.
- Added state-preserving Chinese/English switching, `?lang=zh|en` initialization, Chinese native reports and Markdown/SVG labels. User notes and JSON fields are not translated.
- Added Chinese SVG width-aware clipping and regression tests for session isolation, history bounds, mixed human/model updates, cancellation and Chinese exports.
- 中文说明：新增最近5次检查点、撤销与完整清空；中英切换保留输入和历史，不增加磁盘存储、认证或外部调用。
