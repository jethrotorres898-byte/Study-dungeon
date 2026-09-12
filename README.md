# Tower of Trials — Study Dungeon

A single self-contained HTML study app with a pixel-art RPG dungeon crawler where
combat turns are driven by answering study questions correctly.

## Running it

Just open `index.html` in a browser — no build step, no server required.

- **Home / Study Guide / Upload & Analyze / Flashcards** use a clean light UI
  (Inter for headings/UI, Lora for long-form notes).
- **Dungeon** is full retro pixel-RPG styling (Press Start 2P / VT323), with
  100 procedurally-scaled floors across 10 named regions, hand-drawn pixel
  monster/player sprites, an energy-based skill system, equipment/runes/
  artifacts, and a Drop Editor for authoring custom loot.

Persistence uses `window.storage` when available (e.g. inside a hosted
artifact runtime), falling back to `localStorage` automatically so the app
also works as a plain static file. AI-graded note analysis calls
`https://api.anthropic.com/v1/messages` directly from the browser and
degrades gracefully (with an on-screen error in the Upload log) if that
endpoint isn't reachable from wherever the file is opened.

Dungeon question content is currently a procedural multiplication-table
generator — a stand-in so the full combat loop (questions → energy → skills →
loot → checkpoints) can be exercised end-to-end before real subject-driven
questions are wired in. See the in-app **Character** screen and code comments
for other noted simplifications (Warrior is the only class so far).
