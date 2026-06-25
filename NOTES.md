# Teaching Notes

## Session 0 — 2025-06-24

- User invoked `/teach teach me about chess` with no prior chess workspace.
- Mission established: 2000 Elo for tournament play.
- Baseline: played years ago, knows very basics only.
- First lesson delivered: `0001-board-coordinates.html`.

## Session 1 — 2025-06-24

- User asked for another lesson (`/teach give another lesson`).
- Lesson 002 delivered: `0002-rules-and-special-moves.html` — castling, en passant, promotion, stalemate, touch-move.
- New assets: piece rendering in `board.js`, `rules-quiz.js` multiple-choice widget.
- New reference: `reference/special-moves.html`.
- Next in ZPD: basic checkmates (Lesson 003).

## Session 2 — 2025-06-24

- User won first rated game; reported **415 Elo**.
- Lesson 003 delivered: `0003-basic-checkmates.html` — queen+king and rook+king vs lone king, stalemate traps.
- New assets: `mate-quiz.js` multiple-choice mate recognition widget.
- New reference: `reference/basic-checkmates.html`.
- Learning record: `0002-first-win-baseline.md`.
- Next in ZPD: tactics introduction — forks, pins, loose pieces (Lesson 004).

## Session 3 — 2025-06-25

- User asked to prepare next lesson for tomorrow.
- Lesson 004 delivered: `0004-tactics-intro.html` — forks, pins, loose pieces, scan habit.
- New assets: `tactics-quiz.js` multiple-choice tactic recognition widget.
- New reference: `reference/basic-tactics.html`.
- Glossary updated: fork, pin, loose piece.
- Next in ZPD: more tactic patterns — skewers, discovered attacks, or daily puzzle routine (Lesson 005).

## Preferences

- **Learning style:** visual (to be validated — try other formats occasionally)
- **Time:** ~1 hour/day max
- **Budget:** ~$10/month for books (can bulk-save)
- **Play:** online + over-the-board
- **Out of scope:** nothing declared
- **Technical:** lessons must use plain `<script>` tags, not ES modules — browsers block `import` on `file://` URLs.
- **GitHub Pages:** site at `https://avistian.github.io/chess/` once pushed and Actions enabled (Settings → Pages → Source: GitHub Actions).
- **Cursor `/teach` skill:** canonical source is `.agents/skills/teach/`; mirror it at `.cursor/skills/teach/` (real directory with file symlinks, not a directory symlink) so the agents window slash palette discovers it. Do not also add `.cursor/commands/teach.toml` — same name collides with the skill.
