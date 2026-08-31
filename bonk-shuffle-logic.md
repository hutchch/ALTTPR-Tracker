# Bonk Shuffle — check logic

Reference for the 41 bonk-drop locations on the map. Taken from `map.html` (`initBonkChecks`), which was transcribed from alttptracker-main's `data/logic/logic_nondungeon_checks.js`.

## The rule that applies to every location

Every bonk location needs a **bonkable item**:

> **Pegasus Boots**, or **any sword together with the Quake medallion**

The sword + Quake route is quake-dashing — boots are not strictly required. Without one of these, every bonk location stays red no matter what else you are holding.

## Colours

| Colour | Meaning |
|---|---|
| Green | Reachable now |
| Yellow | Reachable, but out of logic — only the lamp case below produces this |
| Grey | You have clicked it as collected |
| Red | Not reachable |

Bonk markers are the small 11px squares, distinguishable from the 18px check dots. They appear only when **Bonk Shuffle** is ticked in the launcher, and they show in both Standard and Entrance Shuffle.

## Worked example — Eastern Palace Tree

Eastern Palace Tree (id 41) belongs to the Agahnim group, so it turns green only when you hold all three of:

1. a bonkable item — boots, or sword + Quake
2. Agahnim defeated
3. the lamp

With 1 and 2 but no lamp it sits **yellow**. Missing 1 or 2, it is **red**.

## Groups

### Light World — no extra gating — 17 locations

**Green:** you have a bonkable item.

**Red:** you do not.

*In Inverted these also need Light World access (Moon Pearl plus a portal route).*

| id | Location | Map |
|---|---|---|
| 23 | Lost Woods Hideout Tree | Light |
| 25 | Mountain Entry Pull Tree | Light |
| 26 | Mountain Entry Southeast Tree | Light |
| 27 | Lost Woods Pass West Tree | Light |
| 28 | Kakariko Portal Tree | Light |
| 29 | Fortune Bonk Rocks | Light |
| 32 | Sanctuary Tree | Light |
| 34 | River Bend East Tree | Light |
| 35 | Blinds Hideout Tree | Light |
| 36 | Kakariko Welcome Tree | Light |
| 37 | Forgotten Forest Southwest Tree | Light |
| 38 | Forgotten Forest Central Tree | Light |
| 39 | Hyrule Castle Tree | Light |
| 40 | Wooden Bridge Tree | Light |
| 44 | Central Bonk Rocks Tree | Light |
| 47 | Flute Boy Approach South Tree | Light |
| 48 | Flute Boy Approach North Tree | Light |

### East Death Mountain — 1 location

**Green:** bonkable item **and** East Death Mountain access.

**Red:** otherwise.

*East DM access = (gloves **or** flute) and (hookshot **or** mirror + hammer). Inverted also needs the Moon Pearl.*

| id | Location | Map |
|---|---|---|
| 24 | Death Mountain Bonk Rocks | Light |

### Light World — behind Agahnim — 8 locations

**Green:** bonkable item **and** Agahnim defeated **and** lamp.

**Yellow:** bonkable item and Agahnim, but no lamp.

**Red:** otherwise.

*The only group that ever shows yellow — the lamp is what separates green from yellow here. Inverted also needs the Moon Pearl.*

| id | Location | Map |
|---|---|---|
| 30 | Kakariko Pond Tree | Light |
| 31 | Bonk Rocks Tree | Light |
| 33 | River Bend West Tree | Light |
| 41 | Eastern Palace Tree | Light |
| 42 | Flute Boy South Tree | Light |
| 43 | Flute Boy East Tree | Light |
| 45 | Tree Line Tree 2 | Light |
| 46 | Tree Line Tree 4 | Light |

### Dark World — West / Village of Outcasts — 6 locations

**Green:** bonkable item **and** Dark World West access.

**Red:** otherwise.

*DW West = Moon Pearl plus one of: Titan's Mitts, glove + hammer, or the Agahnim + hookshot route. Free in Inverted, where the Dark World is the home world.*

| id | Location | Map |
|---|---|---|
| 49 | Dark Lumberjack Tree | Dark |
| 50 | Dark Fortune Bonk Rocks (2) | Dark |
| 51 | Dark Graveyard West Bonk Rocks | Dark |
| 52 | Dark Graveyard North Bonk Rocks | Dark |
| 53 | Dark Graveyard Tomb Bonk Rocks | Dark |
| 54 | Qirn Jump West Tree | Dark |

### Dark World — East — 5 locations

**Green:** bonkable item **and** Dark World East access.

**Red:** otherwise.

*DW East = Moon Pearl plus one of: Agahnim, hammer + glove, or Titan's Mitts + flippers.*

| id | Location | Map |
|---|---|---|
| 57 | Pyramid Area | Dark |
| 58 | Palace of Darkness Area | Dark |
| 59 | Dark Tree Line Tree 2 | Dark |
| 60 | Dark Tree Line Tree 3 | Dark |
| 61 | Dark Tree Line Tree 4 | Dark |

### Dark World — East, across the water — 2 locations

**Green:** bonkable item **and** Dark World East access **and** one of glove / hammer / flippers.

**Red:** otherwise.

*Dark World East plus a way across the water.*

| id | Location | Map |
|---|---|---|
| 55 | Qirn Jump East Tree | Dark |
| 56 | Dark Witch Tree | Dark |

### Dark World — South — 1 location

**Green:** bonkable item **and** Dark World South access.

**Red:** otherwise.

*Free in Inverted.*

| id | Location | Map |
|---|---|---|
| 62 | Hype Cave Area | Dark |

### Ice Palace interior — 1 location

**Green:** bonkable item **and** bombs.

**Red:** otherwise.

*Hidden entirely when Entrance Shuffle is on, because it is an interior location and its overworld position is meaningless there. Inverted also needs Light World access and the Moon Pearl.*

| id | Location | Map |
|---|---|---|
| 63 | Cold Fairy Statue | Light |

## Notes

**The Agahnim requirement** on those eight Light World trees comes straight from the reference tracker's logic data. No in-game rationale is recorded there, so it is reproduced as-is rather than reasoned out from the map.

**A known simplification.** The reference distinguishes `canBreach` (reachable, possibly out of logic) from `canReach` (in logic). This tracker has a single region test per area, so those two collapse — region-gated bonk locations are green or red with no intermediate state. The Agahnim group's lamp clause is the only surviving yellow.

**Autotracking.** All 41 are auto-detected from SRAM; the offsets already existed in `window.SRAM_FLAGS` under ids 23–63. Clicking a marker also marks it collected manually.
