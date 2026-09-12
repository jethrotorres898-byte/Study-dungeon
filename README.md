# Study Dungeon — Tower of Trials

A single self-contained `index.html` — a retro pixel-art (16-bit style) RPG
dungeon crawler where every combat turn is a question pulled from **your own
study material**. Answer correctly and your character attacks; answer wrong
and the enemy hits back. No build step, no server — just open `index.html`.

The look: hand-authored pixel-art sprites (four distinct heroes, eleven
creatures, ten unique bosses) over a drawn underground cavern — torchlit
masonry, stalactites, a portcullis arch and per-region ambience — wrapped in a
modern dark-fantasy UI.

## Main menu

- **Play** — Enter (starts a run at Floor 1), Craft, Index, Inventory, and
  (once you've beaten a 10th-floor boss at least once) **Boss Rush**, which
  lets you refight any boss you've cleared as many times as you like to farm
  cores and artifacts.
- **Study** — Notes, Upload to AI, Flashcards, Quiz Practice, AI Settings.
- **Characters** — pick a class and build its skill tree.

## The Dungeon

- 100 floors across 10 themed regions. Every 10th floor is a **unique boss**
  with its own artwork, its own fight mechanic and its own signature drop:
  Crypt Warden (Bone Armor), Grotto Serpent (Constrict), Foundry Golem (Molten
  Core), Rime Wraith (Deep Freeze), Thicket Matriarch (Venom), Ruin Colossus
  (Stoneskin), Thunder Roc (Stormcall), Duskbound Reaper (Soul Harvest), the
  Flame Dragon (Infernal Breath) — and on floor 100 the final boss, **Malakor,
  the Unwritten**, a crowned bone tyrant who devours a memory every third turn
  (healing itself and sealing your hints) and breaks his bindings below half
  health. Each boss drops a relic you can find nowhere else (25% chance).
- Each turn shows one question built from your active subject's flashcards
  (weighted toward cards you've gotten wrong or haven't reviewed recently —
  a lightweight spaced-repetition scheduler). If a subject has no flashcards
  yet, a built-in demo deck is used so the dungeon is playable immediately.
- Correct answer → you attack. Wrong answer → the enemy attacks. Both the
  player and the monster have HP and Energy bars; a boss's HP bar is bigger
  and sits at the top-center of the screen. Monsters "charge up" an Energy
  bar of their own — if they're fully charged when they get to attack, that
  hit is amplified, so don't get complacent.
- **You gain +1 Energy every round.** Answer correctly and a battle menu opens
  with four moves — a free **basic attack**, two costed skills (2⚡ / 3⚡) and
  your class **ultimate** (5⚡) — plus **Inventory**, to drink a potion mid-fight.
  Skill books learned from monsters appear in the same menu.
- Attacks are animated (dash + slash, weapon-icon skill swing, hit-flash,
  impact burst, screen shake, floating damage/heal numbers).

## After every boss

Clearing a 10th-floor boss opens a choice before the stair down:

- **Rest** — heal 45% of max HP and clear poison and burning.
- **Train** — a random blessing for the rest of the run (+25% Attack, +35%
  Defense, +20% Max HP or +15% Crit).
- **Scavenge** — half the time the rubble is empty; otherwise potions,
  cores, materials, gold or gems — and a 5% chance of a **golden chest**
  (an epic/legendary item, a pile of gold, gems and Boss Cores, materials,
  potions, and a small chance at an artifact).

## Loot, currency and materials

- Monsters drop **gold** (spent in-run, reset every time you re-enter the
  dungeon) and **gems** 💎 — the only currency, permanent, shown in the top bar.
- **Cores are inventory items, not currency.** Their look tells you what killed
  them: a monster core is a round gem that is dull and cloudy from shallow
  floors and blazes with light from deep ones — Dull (floors 1-25), Glimmering
  (26-50), Radiant (51-75), Blazing (76-100) — plus the red **Boss Core** torn
  from bosses. Each carries *core power* (1/2/3/4, and 9 for a Boss Core);
  recharging an artifact costs 3 core power (dullest spent first) or one Boss
  Core for three charges. Legendary forging needs Boss Cores specifically.
- **Crafting materials** drop as you descend: Iron Ore, Timber, Cloth Scrap and
  Tough Hide from anything, plus a signature material per monster family — Bone
  Shard, Bog Resin, Ember Cinder, Frost Crystal, Venom Sac, Rune Stone, Storm
  Feather, Ectoplasm, Magma Clot and Ashen Dust. Salvaging gear returns
  materials too.
- **Potions**: health, energy, three buffs (attack / defense / crit for 3
  turns) and three debuffs you throw at the enemy (weaken, corrode, drain its
  charge). Usable from the battle Inventory action.
- **Gem Shop** (Play hub) sells one-time blessings that activate on your next
  run and are then spent: Draught of Might, Ironhide Charm, Lucky Coin,
  Scholar's Insight (3 free hints), Phoenix Feather (one revive).
- **Mysterious Merchant** — a rare event after clearing a floor. Sells potions,
  cores, materials and a **monster skill book** for your class, priced in the
  gold you've collected this run.
- **Skill books** teach a monster's own move (Bone Shard, Life Siphon, Ember
  Burst, Frost Nova, Venom Fang, Stone Fist, Gale Slash, Soul Drain, Molten
  Bite, Dark Pact) and only work for compatible classes.

## The Dwarf's Trial (rare event)

Deeper in, a soot-black dwarf may flag you down: something is nesting in his
side-tunnel. Accept and the dungeon gives way to a forge-lit trial — the floor
counter becomes **Stage 1/5** and five unique foes come at you in sequence
(Rustplate Sentinel, Cavern Lurker, Grudge Wraith, Forge Hound, Deep Warden),
each with its own mechanic. Clear them and Durin asks how he can repay you:

- **Shop** — his pack: epic and legendary gear, bulk materials, Boss Cores, and
  sometimes a **legendary blueprint**. The pieces he values most cost serious
  gold.
- **Steal** — he unstraps a gold-chased greataxe. He is one of the four who
  walked to the hundredth floor, and only he walked back. Legendary plate turns
  aside half of every hit, charged swings land twice, and he drinks a draught at
  half health. Expect to need ~80 floors of progress and legendary gear. Beat
  him and you take his weapon, two blueprints, gold, gems and Boss Cores.
- **Nothing** — he refuses to accept that and presses gold and Boss Cores on you
  anyway.

## Artifacts

Four fixed artifacts, each recharged with cores (3 core power per charge, or
one Boss Core for three). You can **equip 2 at once**:

1. **Phoenix Ember** — revives you at 30% HP once per fall.
2. **Owl's Lens** — use mid-question to eliminate a wrong option / reveal a hint.
3. **Fortune Coin** — +15% item/artifact drop chance while charged.
4. **Titan's Core** — permanently boosts a base stat of your choice (HP/ATK/DEF/Energy) while charged.

Every 10th-floor boss has a 10% chance to drop an artifact you don't yet
own, and boss floors are repeatable forever via Boss Rush.

## Crafting, Inventory & Index

- **Craft** forges weapons and armor from materials and cores; higher rarities
  need a deeper Highest Floor reached. **Legendary gear also needs its
  blueprint**, which only a certain dwarf carries.
- **Inventory** shows your character with Weapon/Head/Chest/Legs/Artifact
  slots, a Backpack, a separate long-term **Stash**, and the Artifact Shrine
  (equip/recharge artifacts).
- **Index** is a discovery-gated bestiary/catalog — undiscovered weapons,
  armor, artifacts and monsters render in grayscale as "???" until you find
  them; discovered entries show full stats, description and drop chance.

## Characters

Five classes, each with its own persistent level, weapon line and 8-node skill
tree (3 tier-1 passives, 3 tier-2 passives/ultimate unlock, 2 tier-3
**evolutions** — pick one of two). Switching class keeps that class's own
progress, and **Reset Skill Tree** is free, so you can try both evolutions.

| Class | Style | Passive | Evolutions |
|---|---|---|---|
| Warrior | Sword & shield bruiser | — | Berserker / Paladin |
| Mage | Ranged spellcaster | — | Pyromancer / Battlemage |
| Rogue | Crit and utility | — | Assassin / Trickster |
| Cleric | Self-healing support | — | Templar / Oracle |
| **Brawler** | Masked pit-fighter, bare fists | **Combo** — each consecutive correct answer adds +8% damage, up to +40% | Grandmaster / Iron Monk |

The Brawler chains multi-hit strikes (One-Two, Uppercut, Hundred Fists) and is
rewarded for answer streaks — one wrong answer and the combo resets.

## Study tools

- **Upload to AI**: drop in `.txt` / `.md` / `.pdf` files. Each chunk is
  analyzed into study notes *and* flashcards, which immediately double as
  Dungeon combat questions.
- Works fully **offline**: if no AI key is set (or a call fails), a local
  extractive-summary + term/definition + cloze-deletion generator produces
  notes and flashcards instead, so nothing is required to get started.
- **AI Settings**: paste your own Anthropic API key to enable live AI
  analysis (sent directly from your browser to `api.anthropic.com`; stored
  only in this browser's local storage, never anywhere else).
- **Flashcards**: flip-card review with a mastery bar and spaced-repetition
  weighting (wrong/unseen cards resurface sooner).
- **Quiz Practice**: risk-free practice using the same question engine as
  the Dungeon.
- Overall flashcard mastery across all subjects feeds a small combat crit
  bonus — real studying makes your character stronger.

## Persistence

Uses `window.storage` when available (e.g. inside a hosted artifact
runtime), falling back to `localStorage` automatically, so the app also
works as a plain static file.
