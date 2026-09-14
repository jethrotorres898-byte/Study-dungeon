# Study Dungeon — Tower of Trials

A single self-contained `index.html` — a retro pixel-art (16-bit style) RPG
dungeon crawler where every combat turn is a question pulled from **your own
study material**. Answer correctly and your character attacks; answer wrong
and the enemy hits back. No build step, no server — just open `index.html`.

The look: hand-drawn 16-bit pixel art — five 32x32 chibi heroes with real
frame-by-frame idle, walk and attack cycles, and twenty-two creatures and bosses
drawn to match, standing in a pixel dungeon of torchlit masonry, a perspective flagstone
floor and a voussoir arch, wrapped in a modern dark-fantasy UI.

## Sprites, frames and animation

Everything is drawn by hand as pixel art and animated the way 16-bit games
animated: **one whole grid per frame**. No limb is ever rotated, slid or scaled
on its own, so nothing reads as a paper cut-out.

Each hero is a **32x32 chibi sheet** — a big head and simplified body so the
character stays readable at thumbnail size — built from authored layers (cloak,
head, torso, per-pose arm and leg blocks, weapons stroked in so a blade can sit
at any angle) that are composited into flat frames.

Heads are drawn in **three-quarter view, facing right**. The back of the skull
is the heavier, darker mass and the face opening sits forward, so the hero looks
at the enemy rather than out of the screen; the battle scene mirrors the monster,
which turns it to look back.

The direction is grim, not cute. **Nobody has a face.** Every head is a closed
helm, a deep hood or a wrap, the face behind it is a black void, and the pair of
lit eyes looking out of that void is the brightest thing on the sprite. Each
class runs on **16 colours**: a low, near-black material ramp, one dull metal
trim, and exactly one glow — ember for the horned dread-knight, cold blue for
the hooded warlock, amber for the assassin, gold for the haloed cleric, blood
red for the masked pit-fighter. Cloaks hang behind the body as a darker void
still, torn along the hem, and sway with the walk. A pixel only brightens where
a broad flat form turns up into the light, and it brightens one rung up its own
material ramp, so a highlight always stays the colour of what it sits on.

- **Idle, 6 frames.** The head and shoulder line travel exactly one pixel and
  no more; the arms, weapon and feet never move. Six frames rather than two is
  what keeps it from snapping — the lift is padded on either side by frames that
  only change light, so the chest brightens one rung up its own ramp before the
  shoulders follow. The cloak hem drifts a pixel and the hot core of the eyes
  flickers. Two frames on an even cycle is a heartbeat; this eases.
- **Walk, 4 frames.** Contact, passing, contact, passing, with the legs and the
  swinging arms redrawn pixel by pixel. Robed classes get a hem that swings
  instead of legs.
- **Attack, 3 frames.** Wind up, strike, follow through; it plays once and holds
  on the last frame. The warrior raises and cuts down, the rogue throws both
  daggers through, the brawler's punch is drawn forearm and all, and the casters
  plant the staff and push the spell out.
- **Hurt, 1 frame,** with the head snapped back a pixel.

A clip renders all of its frames into a stack and CSS cuts between them with
hard opacity stops, so playback costs nothing at runtime and collapses to a
single still frame under `prefers-reduced-motion`. Combat chains the clips: a
dash or a rush closes the distance on the walk cycle, then the attack clip lands
the hit.

**Monsters are built the same way**, on a 36x36 grid: whole authored frames,
swapped rather than transformed. Six body plans — gaunt humanoid, bulk,
quadruped, floating, serpent and winged — carry eight heads, and every face is a
void with the eyes as the only light in it, exactly like the heroes. Horns,
crests, wings, ribcages, ember cracks, venom veins and a reaper's scythe hang
off those plans, so twenty-two creatures come out of one system and still read
as one bestiary. Their idle is the same light-carried breath, with a wing or a
crest settling on the exhale; attacks rear back and throw forward over two
frames.

Boss palettes were written for a brighter game, so anything merged into a sheet
gets tone-mapped rather than uniformly darkened: a bright colour is pulled hard
toward the dungeon's night while a dark one barely moves, and the glow keys are
left alone entirely. A boss also gains a broken gold circlet, placed from the
measured top of its own silhouette.

## The dungeon behind them

The backdrop is a 200x96 pixel scene, not vector art, and it is lit the way a
dungeon should be: **two torches against the dark**. Every colour is a mix
between a cold near-black and the region's own stone, and the only thing that
pulls a surface out of that black is how close it sits to a flame — so shadows
go blue, the lit middle goes warm, and the corners simply go.

Torchlit masonry picks each brick's value from the falloff of the two sconces;
the floor is laid out on a one-point perspective with its joints walked line by
line so a receding seam stays an unbroken stroke; buttresses frame the shot
under a stalactite ceiling and a cornice.

At the vanishing point is a **stairway down**, not a door — this is a dungeon,
you descend. Each tread behind the last is narrower and darker with its own lit
nose, so the flight drops away into black, and the landing spills three steps
out of the archway. The enemy stands on that landing: the way down is behind the
thing in your way, so killing it is what opens it, and the hero walks into it on
the walk cycle when the fight is won.

The flagstones are **littered with what the dungeon leaves behind** — a sword
driven into a crack, a split shield, a picked-clean ribcage, a burst crate, a
torn sack, pot shards, a coil of chain, a rusted cap, a fallen board and loose
bone. Nothing decorative for its own sake; it is the wreckage of whoever came
down these stairs first. Items further back are drawn smaller, and both
fighters' footing is left clear.

Every region then paints its own landmarks into the same pixels — bones and
corner webs in the crypt, algae and standing water in the grotto, lava seams in
the foundry, icicles and frost, vines and mushrooms, cracks and rubble, sky
breaches, burial niches, magma and banners. Only the torch flames and their
light pools animate on top.

Everything that has to stay visible lives inside x 44..156, because the panel
crops the scene to its own aspect — sides on a phone, top and bottom on a
desktop.

## Skill effects and the ultimate

**Every skill draws itself, and the hero poses to match it.** A skill names a
`pose`, a `kind` and a `hue`. The pose picks which of the hero's clips plays —
a swing, a **shield bash** where the shield leads and the sword stays down, a
straight **thrust**, an overhead **raise** for casts and calls, or a rising
**uppercut** — so Shield Bash uses the shield rather than the sword and Staff
Strike is a melee blow rather than a spell. The kind is the effect on the
target, placed from its measured box so a slash lands on the enemy instead of
hanging in the air above it: crescent **slashes** (one to four, each at its own
angle), an impact **hit**, a thrown **bolt** with a trail, an expanding **nova**,
a **beam** dropped onto the target, ice or bone **shards** driven up out of the
floor, a ground-shaking **quake**, and a **flurry** of rapid sparks, over eight
hues. Anything that heals, drains or costs blood also flares on the caster. A
skill can override how its class fights, which is why the mage walks its staff
in for Staff Strike and Arcane Blade and casts for everything else.

**An ultimate charges before it lands.** The scene drops into darkness, motes
drag in out of the dark toward the hero, an aura winds inward, a pillar of light
stands up underneath them and the skill's name punches in while the sprite
rim-lights and trembles. Then the charge breaks on a white flash and the skill
itself runs — the same effect it always has, at its big size. No cutaway and no
versus panel: the release runs straight into the attack.

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
- Attacks are animated per class and per skill (see **Skill effects** above),
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

## Class passives

Each class always has one thing working for it, shown as a live tag on the
battle screen:

- **Warrior — Bulwark.** Takes 15% less damage, and below half HP deals up to
  +30% more. It hits hardest the closer it gets to going down.
- **Mage — Attunement.** Every skill ignores 20% of the enemy's defense, and a
  critical spell refunds 1 energy.
- **Rogue — Ambush.** The first strike on each floor is a guaranteed critical,
  and all crits hit 15% harder.
- **Cleric — Grace.** Every correct answer mends 4% of max HP, so a long clean
  streak is its own healing.
- **Brawler — Combo.** Every consecutive correct answer adds +8% damage, up to
  +40%.

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
