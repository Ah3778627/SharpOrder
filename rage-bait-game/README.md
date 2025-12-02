# Rage Bait — Geometry Dash–style Practice Game

This is a small static HTML5 canvas demo inspired by Geometry Dash, designed to be intentionally challenging ("rage bait"). It includes a Practice Mode with checkpoints so you can practice hard sections without restarting the entire level.

Features
- Three handcrafted levels: Easy, Medium, Insane (punishing). 
- Auto-run player, single jump control (click or Space).
- Practice Mode: toggle checkpoints and respawn at the last checkpoint on death.
- Simple UI: level select, start, restart, practice toggle.

Run locally

- Option A (recommended): Serve with a simple HTTP server and open in the browser:

```bash
cd /home/abdul-hafiz/Desktop/python/rage-bait-game
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

- Option B: Open `index.html` directly in the browser (works in most browsers but some features may be restricted by file:// policies).

Controls
- Click / Space — Jump
- P — Toggle Practice mode
- Practice mode: reach checkpoints (thin vertical lines). On death you will respawn at the last checkpoint.

Extending
- Add more levels in `src/levels.js` by following the provided structure.
- Tweak physics (`speed`, `gravity`, `jumpForce`) per level.

Notes
- This is a static demo made for practice and fun. It intentionally contains punishing obstacle patterns to create a "rage" experience.
