# Teaching Notes

## Session 0 — 2025-06-24

- User invoked `/teach teach me about chess` with no prior chess workspace.
- Mission established: 2000 Elo for tournament play.
- Baseline: played years ago, knows very basics only.
- First lesson delivered: `0001-board-coordinates.html`.

## Preferences

- **Learning style:** visual (to be validated — try other formats occasionally)
- **Time:** ~1 hour/day max
- **Budget:** ~$10/month for books (can bulk-save)
- **Play:** online + over-the-board
- **Out of scope:** nothing declared
- **Technical:** lessons must use plain `<script>` tags, not ES modules — browsers block `import` on `file://` URLs.
- **GitHub Pages:** site at `https://avistian.github.io/chess/` once pushed and Actions enabled (Settings → Pages → Source: GitHub Actions).
- **Cursor `/teach` skill:** canonical source is `.agents/skills/teach/`; mirror it at `.cursor/skills/teach/` (real directory with file symlinks, not a directory symlink) so the agents window slash palette discovers it. Do not also add `.cursor/commands/teach.toml` — same name collides with the skill.
