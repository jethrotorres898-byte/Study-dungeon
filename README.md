# Study Dungeon — Tower of Trials

A single self-contained `index.html` — a retro pixel-art (16-bit style) RPG
dungeon crawler where every combat turn is a question pulled from **your own
study material**. Answer correctly and your character attacks; answer wrong
and the enemy hits back. No build step, no server — just open `index.html`.

The look: hand-authored pixel-art sprites (five distinct heroes, eleven
creatures, ten unique bosses) over a drawn underground cavern — torchlit
masonry, stalactites, a portcullis arch and per-region ambience — wrapped in a
modern dark-fantasy UI.

## 3D characters on a 2D stage

Characters are **jointed 3D models**, not sprites. A tiny software renderer —
no library, no CDN, so the file stays a single offline page — draws them to a
small canvas that is scaled up pixelated, keeping the chunky look while the
geometry underneath is real. Gameplay stays flat and side-on; only the models
are 3D, the way a 2D fighter frames a 3D stage.

Every figure is a bone hierarchy: pelvis → spine → chest → head, shoulders →
upper arm → forearm → hand, hips → thigh → shin → foot, with armour, robes,
hoods and horns hung off those bones. Two things fall out of that:

- **A weapon is parented to the hand bone**, so it physically cannot detach or
  float — wherever the hand goes, the grip goes.
- **A pose is just a table of joint angles**, so an attack is an interpolation
  between two poses rather than a sprite swap. Wind-up → strike → recover reads
  as one continuous motion, and each class gets its own pair: the warrior coils
  and swings, the rogue and brawler throw both arms through, the mage and cleric
  plant the staff and push the spell out.

Lighting is computed per face from its normal, so volume is real rather than
hand-painted, and every model auto-fits its frame instead of being hand-placed.

**27 rigs**: the five classes, and every monster archetype built from one
parametric creature rig — biped, quadruped, spider, serpent, robed and floating
body plans, with flags for horns, wings, tails, hoods and ribcages.

### The Ultimate cutscene

Spending an ultimate cuts away from the battle entirely. The screen splits on an
angled diagonal — your hero framed on the left, the enemy on the right, speed
lines rushing behind both, a glowing seam slamming down the middle and the skill
name punching in over it, the whole frame shaking to build the charge. Then a
white flash, the panes fly apart, and it cuts to a full-bleed strike: the hero
charges across the frame (or channels in place, for casters), the enemy reels
back lit white, and the impact throws an expanding burst and two shockwave
rings. Damage resolves once the cutscene ends.

## Main menu

- **Play** — opens the **realm picker**: one card per subject, plus **Infinity**.
  Enter a realm and you get its hub — Enter Dungeon, Inventory, Craft, Index,
  Gem Shop, and (once you've beaten a 10th-floor boss at least once) **Boss
  Rush**, which lets you refight any boss you've cleared as many times as you
  like to farm cores and artifacts.
- **Study** — Subjects, Notes, Upload to AI, Flashcards, Quiz Practice, AI Settings.
- **Characters** — pick a class and build its skill tree (for the realm you're in).

## Realms — one dungeon per subject

Every subject is its own separate dungeon world. Your **character, levels, skill
tree, gear, gold, gems, cores, materials and blueprints all belong to the realm
you earned them in** — a level-40 Warrior in Mathematics walks into Science as a
level-1 nobody with nothing. Switch realms any time from **Play**; each realm
keeps its own run in progress.

- **Subject realms** — one per subject. Questions come from that subject only.
  **Mathematics** ships built in and drills the **multiplication tables**;
  upload your own files to a subject and its flashcards become its questions.
- **Infinity** — every subject shuffled together, every note you have ever
  uploaded, all in one dungeon. Its gear is its own too: nothing you earned in
  a subject comes with you.
- **The Index is the one thing that carries everywhere.** Every weapon, armor
  piece, artifact and monster you have ever discovered, in any realm, stays
  discovered in all of them — so you always walk in knowing what's coming.

Add, rename and delete subjects in the **Study** tab; a new subject immediately
becomes a new realm. Deleting a subject deletes its realm (the Index survives).

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
- **You gain +1 Energy every round, then choose your difficulty** — Easy,
  Medium or Hard — before the question is even drawn. The choice is a real
  gamble, not a label:

  | | Damage you deal | Damage you take | XP | Energy | Question |
  |---|---|---|---|---|---|
  | 🟢 **Easy** | ×0.75 | ×0.85 | ×0.7 | — | small numbers / cards you've mastered, **3 choices** |
  | 🟡 **Medium** | ×1.0 | ×1.0 | ×1.0 | — | the full tables / normal draw, **4 choices** |
  | 🔴 **Hard** | ×1.6 | ×1.35 | ×1.8 | **+1 ⚡** | big numbers, chained products, missing factors / your weakest cards — **type the answer, no options** |

  A correct **Hard** answer pays a bonus point of Energy on top of the round's
  +1, so taking the risky question is how you fund your ultimate. A wrong one
  pays nothing.

  In Mathematics that means Easy is `4 × 7`, Medium is the full tables plus
  missing-factor problems (`8 × ? = 56`), and Hard is `17 × 14`, `9 × 6 × 4`
  and `? × 13 = 195` typed from memory. In a subject built from your own files,
  difficulty picks *which* cards you face: Easy favours cards you've mastered,
  Hard drags up the ones you keep getting wrong and makes you type the answer.
- Flashcard questions are weighted toward cards you've gotten wrong or haven't
  reviewed recently — a lightweight spaced-repetition scheduler. A subject with
  no flashcards yet falls back to a built-in demo deck so it's playable at once.
- Correct answer → you attack. Wrong answer → the enemy attacks. Both the
  player and the monster have HP and Energy bars; a boss's HP bar is bigger
  and sits at the top-center of the screen. Monsters "charge up" an Energy
  bar of their own — if they're fully charged when they get to attack, that
  hit is amplified, so don't get complacent.
- Answer correctly and a battle menu opens with four moves — a free **basic
  attack**, two costed skills (2⚡ / 3⚡) and your class **ultimate** (5⚡) —
  plus **Inventory**, to drink a potion mid-fight. Skill books learned from
  monsters appear in the same menu. The damage estimates on each move already
  include the difficulty you picked.
- Attacks are animated per class (see **Sprites, joints and animation** above),
  with hit-flash, impact bursts, screen shake and floating damage/heal numbers —
  and ultimates cut to their own split-screen cutscene.

## After every floor

Clear an ordinary floor and the stair down waits while you take **one** action —
or none at all:

- **🔎 Search the floor** — turn over the rubble. Most of the time you find
  potions, cores, crafting materials, gold or gems; about a quarter of the time
  it's empty. **Searching is also how the rare encounters find you**: the
  Mysterious Merchant (~10%), a golden chest (~3%), and the Dwarf's Trial
  (~6% from floor 6, and at most once in a run). Walk straight past and you
  never meet them.
- **🔥 Rest** — heal 18% of max HP and shake off poison and burning.
- **⤓ Straight down** — skip both and take the stairs.

## After every boss

Clearing a 10th-floor boss opens a bigger choice before the stair down:

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
  Core for three charges. Cores are also a **crafting material in their own
  right** — recipes ask for them by tier ("4× Glimmering Core or better"), and a
  brighter core always stands in for a duller one. Legendary recipes demand Boss
  Cores by name. Cores get their own **Cores** tab in the inventory.
- **Crafting materials** drop as you descend: Iron Ore, Timber, Cloth Scrap and
  Tough Hide from anything, plus a signature material per monster family — Bone
  Shard, Bog Resin, Ember Cinder, Frost Crystal, Venom Sac, Rune Stone, Storm
  Feather, Ectoplasm, Magma Clot and Ashen Dust. Salvaging gear returns
  materials too. Drop rates are weighted toward **what the forge actually asks
  for** — iron is the most common by a wide margin, then hide, cloth and timber
  — and stacks grow as you descend, so deep recipes stay reachable without
  grinding shallow floors. A monster's signature material only drops from that
  family, and the rest of the game's material rewards (scavenging, chests, the
  merchant's stock) use the same weighting instead of picking evenly from all
  fourteen.
- **Potions**: health, energy, three buffs (attack / defense / crit for 3
  turns) and three debuffs you throw at the enemy (weaken, corrode, drain its
  charge). Usable from the battle Inventory action.
- **Gem Shop** (Play hub) sells one-time blessings that activate on your next
  run and are then spent: Draught of Might, Ironhide Charm, Lucky Coin,
  Scholar's Insight (3 free hints), Phoenix Feather (one revive).
- **Mysterious Merchant** — found by searching a cleared floor. Sells potions,
  cores, materials and a **monster skill book** for your class, priced in the
  gold you've collected this run.
- **Skill books** teach a monster's own move (Bone Shard, Life Siphon, Ember
  Burst, Frost Nova, Venom Fang, Stone Fist, Gale Slash, Soul Drain, Molten
  Bite, Dark Pact) and only work for compatible classes.

## The Dwarf's Trial (rare event)

Search a cleared floor deep enough in and a soot-black dwarf may flag you down:
something is nesting in his side-tunnel. He turns up at most once per run. Accept and the dungeon gives way to a forge-lit trial — the floor
counter becomes **Stage 1/5** and five unique foes come at you in sequence
(Rustplate Sentinel, Cavern Lurker, Grudge Wraith, Forge Hound, Deep Warden),
each with its own mechanic. Clear them and Durin asks how he can repay you:

- **Shop** — his pack: epic and legendary gear, bulk materials, Boss Cores, and
  sometimes a **legendary blueprint** (it goes into your Backpack as an item to
  study). The pieces he values most cost serious gold.
- **Steal** — he unstraps a gold-chased greataxe. He is one of the four who
  walked to the hundredth floor, and only he walked back. Legendary plate turns
  aside half of every hit, charged swings land twice, and he drinks a draught at
  half health. Expect to need ~80 floors of progress and legendary gear. Beat
  him and you take his weapon, two blueprint items, gold, gems and Boss Cores.
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
  need a deeper Highest Floor reached. **Legendary recipes are invisible at the
  forge until you learn them.** A blueprint drops as an *item* into your
  Backpack (only a certain dwarf carries them); **Study blueprint** consumes it
  and permanently unlocks that one legendary weapon/armor recipe — which then
  appears in Craft with its material, core and Boss Core costs.
- **Inventory** shows your character with Weapon/Head/Chest/Legs/Artifact
  slots, a Backpack (gear, potions, materials and unread blueprints), a **Cores**
  tab, a separate long-term **Stash**, and the Artifact Shrine (equip/recharge
  artifacts).
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

- **Subjects**: the subject bar creates, renames and deletes subjects. Each one
  is both a study deck and its own dungeon realm, and picks up a fitting icon
  from its name.
- **Upload to AI**: drop in `.txt` / `.md` / `.pdf` files. Each chunk is
  analyzed into study notes *and* flashcards for the selected subject, which
  immediately double as that realm's combat questions.
- Works fully **offline**: if no AI key is set (or a call fails), a local
  extractive-summary + term/definition + cloze-deletion generator produces
  notes and flashcards instead, so nothing is required to get started.
- **AI Settings**: paste your own Anthropic API key to enable live AI
  analysis (sent directly from your browser to `api.anthropic.com`; stored
  only in this browser's local storage, never anywhere else).
- **Flashcards**: flip-card review with a mastery bar and spaced-repetition
  weighting (wrong/unseen cards resurface sooner).
- **Quiz Practice**: risk-free practice using the same question engine as the
  Dungeon, with the same Easy / Medium / Hard switch.
- Overall flashcard mastery across all subjects feeds a small combat crit
  bonus — real studying makes your character stronger.

## Persistence

Uses `window.storage` when available (e.g. inside a hosted artifact
runtime), falling back to `localStorage` automatically, so the app also
works as a plain static file. Realms are stored separately from the shared
Index, and saves from earlier versions are migrated into the realm you were
last playing.
