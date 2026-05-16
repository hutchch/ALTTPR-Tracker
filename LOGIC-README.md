# Hutch-ALTTPR Tracker — Logic Reference

## Color Legend

| Color | Meaning |
|-------|---------|
| 🟢 Green | All requirements met — fully accessible |
| 🟡 Yellow | Accessible but may not be completable (dark room, missing item, back-entrance only) |
| 🟠 Orange | Visible/reachable but cannot obtain yet |
| 🔴 Red | Not accessible with current items |
| ⬛ Grey | Cleared |

---

## General Notes

- **Lamp vs Flute**: Lamp is required for dark rooms (green). Without lamp, dark rooms show yellow. Flute counts as light for Death Mountain traversal but NOT for dark rooms.
- **Swordless mode**: Hammer replaces sword requirements where noted.
- **Enemizer**: When Enemizer is OFF, bow is required for Eastern Palace.
- **Medallions**: MM and TR require the assigned medallion item to be obtained. If all three medallions (Bombos, Ether, Quake) are obtained, assignment doesn't matter. If unassigned (no right-click label), dungeon stays red.

---

## Standard / Open Mode

### Region Access

| Region | Requirements |
|--------|-------------|
| Death Mountain (climb) | Glove OR Flute |
| Death Mountain (east) | (Glove OR Flute) + (Hookshot OR Mirror+Hammer) |
| DW North West | Moon Pearl + (Titans Mitt OR Glove+Hammer OR Aga+Hookshot route) |
| DW East | Moon Pearl + (Agahnim OR Hammer+Glove OR Titans+Flippers) |
| DW South | Moon Pearl + (Titans Mitt OR Glove+Hammer OR Aga+Hookshot route) |

### Dungeons

| Dungeon | Access Requirements | Green Requirements |
|---------|--------------------|--------------------|
| **EP** | Always | Lamp (+ Bow if non-Enemizer) |
| **DP** | Book OR (Mirror+Flute+Titans Mitt) | Boots + Glove + Lamp/Firerod |
| **TOH** | (Flute+Mirror) OR (Flute+Hook+Hammer) OR (Lamp+Glove+Mirror) OR (Lamp+Glove+Hook+Hammer) | Lamp or Firerod |
| **HC** | Always | Lamp |
| **CT** | Lamp | Master Sword OR Cape (+ 2 small keys KS/MCK) |
| **POD** | Moon Pearl + DW East | Hammer + Lamp + Bow |
| **SP** | Moon Pearl + Mirror + Flippers + DW South | Hookshot (+ Hammer) |
| **SW** | Moon Pearl + DW NW | Firerod (+ Sword) |
| **TT** | Moon Pearl + DW NW | Hammer |
| **IP** | Moon Pearl + Flippers + Titans Mitt + Bombos/Firerod | Hammer+Hookshot; 2 keys OR 1 key+Somaria (KS/MCK) |
| **MM** | Flute + Titans Mitt + assigned Medallion + Boots/Hookshot | Somaria + Lamp |
| **TR** | Moon Pearl + Hammer + Titans Mitt + Somaria + assigned Medallion + Sword | Firerod + Lamp |
| **GT** | N crystals (configurable 1–7) | N crystals |

---

## Inverted Mode

### Key Differences
- **DW is the home world** — no Moon Pearl needed to navigate DW
- **LW requires Moon Pearl + portal access**
- **Aga1 is at GT's DW Death Mountain location**
- **Ganon is at CT's LW location**
- **Flute must be activated in LW** — requires LW Village access to use for DW travel

### LW Access Routes (Inverted)

| Route | Requirements |
|-------|-------------|
| **LW Village Portal** | Moon Pearl + (Aga1 defeated OR Titans Mitt OR Glove+Hammer) |
| **LW DM left side** | Glove only (no pearl) — Old Man, Spectacle Rock Cave |
| **LW DM top-left** | Pearl + Hammer + (Glove+Hookshot OR Titans Mitt+Hammer) — Ether Tablet, TOH, Spectacle Rock |
| **LW DM right side** | Pearl + Glove + (Titans Mitt OR Hookshot) — Spiral Cave, Paradox Cave, Mimic Cave, Floating Island |

### DW Access Routes (Inverted)

| Region | Requirements |
|--------|-------------|
| DW Death Mountain | Glove OR (Flute + LW Village Access) |
| DW East | Hammer OR (Flute + LW Village Access) OR Flippers |
| DW North West | Always (home world) |
| DW South | Always (home world) |
| DW Mire | (Flute + LW Village Access) OR (Mirror + LW Village Access) |

### Overworld Checks (Inverted — notable changes)

| Check | Requirements | Notes |
|-------|-------------|-------|
| King's Tomb | Titans Mitt + Boots | Mirror route not available |
| Old Man | DW DM (Glove) + Lamp | Shown on DW map |
| Spectacle Rock Cave | DW DM (Glove) | Green/yellow based on lamp |
| Spectacle Rock | DW DM (Glove) → orange; top-left access → green/yellow | Always visible from left side DM |
| Spiral Cave | DW DM + right side LW DM | Green/yellow based on lamp |
| Paradox Cave | DW DM + right side LW DM | Green/yellow based on lamp |
| Floating Island | DW DM + right side LW DM | Green/yellow based on lamp |
| Mimic Cave | Right side LW DM + Hammer | Hammer required for chest |
| Ether Tablet | Top-left LW DM + Book + Master Sword (or Swordless Hammer) | Orange without weapon |
| Bombos Tablet | LW Village + Book + weapon | No mirror needed |
| Hookshot Cave Bottom | DW DM + (Boots OR Hookshot) | Green/yellow based on lamp |
| Hookshot Cave Top (3) | DW DM + Hookshot | Green/yellow based on lamp |
| Super Bunny Cave | DW DM | Green with lamp, yellow without |
| Mire Shed | LW Village + (Flute OR Mirror) | — |
| Checkerboard Cave | LW Village | No flute or mirror needed |
| Cave 45 | LW Village | No mirror needed |
| Desert West Ledge | LW Village → orange; + Book → green | Always visible with LW access |
| Lake Hylia Island | LW Village + Flippers | No mirror needed |
| Graveyard Ledge | LW Village | No mirror needed |
| Bumper Cave Ledge | Always orange; LW Village + Mirror + Cape → green | DW check, always visible |
| Magic Bat | Powder + Hammer | No mirror needed |
| Hammer Pegs | Hammer + Mirror OR Titans Mitts + LW Village | — |
| Blacksmith | Mirror OR Titans Mitts + LW Village | — |
| Purple Chest | Mirror OR Titans Mitts + LW Village | — |
| Pyramid | DW East (Hammer OR Flute+LW OR Flippers) | Aga1 defeat does not give DW East access |

### Dungeons (Inverted)

| Dungeon | Location | Access | Green Requirements |
|---------|----------|--------|--------------------|
| **EP** | LW | LW Village | Lamp (+ Bow non-Enemizer) |
| **DP** | LW | LW Village + Book (mirror route unavailable) | Boots + Glove + Lamp/Firerod |
| **TOH** | LW DM top-left | Pearl + Hammer + (Glove+Hookshot OR Titans+Hammer) | Lamp or Firerod |
| **HC** | LW | LW Village | Lamp |
| **CT/Aga1** | DW DM (GT position) | DW DM + Lamp + Sword OR Hammer OR Cape | + 2 small keys KS/MCK |
| **POD** | DW | DW East (Hammer OR Flute+LW OR Flippers) | Hammer + Lamp + Bow |
| **SP** | DW | Mirror + Flippers + DW South | Hookshot |
| **SW** | DW | Always | Firerod (+ Sword) |
| **TT** | DW | Always | Hammer |
| **IP** | DW | Flippers + Bombos/Firerod (no Titans Mitt needed) | Hammer+Hookshot; 2 keys OR 1 key+Somaria (KS/MCK) |
| **MM** | DW Mire | LW Village + (Flute OR Mirror) + Medallion + Boots/Hookshot | Somaria + Lamp |
| **TR** | DW DM | **Front entrance**: DW DM + Somaria + Medallion + Sword | Firerod + Lamp |
| | | **Back entrance**: DW DM + Pearl + (Titans+Hammer OR Hookshot) + Mirror → yellow | — |
| **GT/Ganon** | LW (CT position) | LW Village + N crystals | N crystals |

### Key Sanity / MCK — CT Checks (Inverted)

| Check | Requirements |
|-------|-------------|
| CT Room 03 (109) | DW DM access → yellow without lamp/flute, green with lamp/flute |
| CT Dark Maze (110) | DW DM + Lamp + 1 small key |
| Aga1 dungeon marker | DW DM + Lamp + Sword/Hammer/Cape + 2 small keys |

---

## Key Sanity / MCK Additional Requirements (All Modes)

| Dungeon | Small Keys | Big Key | Notes |
|---------|-----------|---------|-----------|
| DP | 1 | KS only | |
| TOH | 1 | KS only | |
| CT | 2 | — | |
| POD | 6 | KS only | Possible with 5 Small Keys |
| SP | 1 | KS only | |
| SW | — | KS only | |
| TT | 1 | KS only | |
| IP | 2 keys OR 1 key + Somaria | KS only | |
| MM | — | KS only | |
| TR | 4 | KS only | Possible with 3 Small Keys |

---

## Medallion Assignment (MM / TR)

- Right-click **Bombos**, **Ether**, or **Quake** on the item tracker to assign it to MM, TR, or BOTH
- The dungeon shows **red** until the assigned medallion is obtained
- If **all three** medallions are obtained, assignment doesn't matter
- If **unassigned** (no label), dungeon stays red until assigned

---

*Generated from tracker source — v1.1.6*
