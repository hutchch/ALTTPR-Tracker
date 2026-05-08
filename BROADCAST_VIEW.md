# Broadcast View — Build Summary (v1.1.9)

The Broadcast View is a compact, streaming-friendly window that mirrors the
state of the main Item Tracker. It is launched on demand from the Item Tracker
window and is intended for use as an OBS overlay, so it supports a true
transparent background, a custom image background, and visual effects when
items are collected.

<img width="743" height="822" alt="image" src="https://github.com/user-attachments/assets/8ca7d4fc-0718-472f-9df6-ecdbd4fd18bf" />

## Files involved

- `main.js` — Electron main process. Owns the broadcast `BrowserWindow`,
  handles transparent-mode toggling (which requires window recreation), and
  exposes the `set-broadcast-bg` IPC handler.
- `preload.js` — Bridges `electronAPI.setBroadcastBg(bg)` and
  `electronAPI.launch({ which: 'broadcast', trackerBg })` from the renderer
  to the main process.
- `broadcast.html` — Self-contained renderer for the broadcast view. Builds
  the layout, owns the settings popup, and listens for state updates over a
  `BroadcastChannel`.
- `itemtracker.html` — Hosts the launch button (`📡`) that opens the
  broadcast window with the current tracker background.
- `items.js` — Source of truth for item / dungeon state. The
  `broadcastItemSnap()` function builds the snap object the broadcast view
  consumes, including dungeon prize, big key, map, compass, small keys, and
  small-key max counts.
- `package.json` — `build.files` allowlist must include `broadcast.html`
  so the file is bundled into the packaged app.

## Window lifecycle

The main process tracks a single broadcast window in module-level state
(`broadcastWin`, `broadcastBg`). Default size is 520×245 with
`useContentSize: true`; the window is resizable and the user's last bounds
are preserved across transparency toggles.

Electron does not allow toggling the `transparent` flag on an existing
`BrowserWindow`, so changing between transparent and opaque modes closes
the window and recreates it via `createBroadcastWindow(bg, bounds)`.
Bounds are captured before close so position and size are preserved.
Switching between non-transparent backgrounds (black ↔ grey ↔ white ↔
image) reuses the existing window and just swaps the native
`backgroundColor`.

On macOS in transparent mode the window uses
`titleBarStyle: 'hiddenInset'` so the traffic-light buttons remain
visible. On Windows / Linux in transparent mode it uses a custom
`titleBarOverlay` with a transparent background and white symbol color.

## Layout

The body is a flex column. The top region is the broadcast container
(items + dungeons), and a sticky bottom bar holds the Settings button.

- Container padding: `8px 6px 2px 8px` (slightly more on the left so
  content does not sit flush against the window edge).
- Three rows of items (40×40 slots) plus one row of ten dungeon slots.
- Right-column slots (Agahnim, Go Mode, Stats) are 82px wide and
  left-aligned so all three vertically line up with the stats panel.

### Item slots (rows 1–3)

Each non-special slot is a 40×40 `.bslot` with a 36×36 pixelated icon
positioned above an absolutely-positioned `::before` pseudo-element used
for the optional fill background. The bottle group is a 2×2 grid of
mini-bottles inside a single `.bslot-bottles` container, which gets a
single shared fill if any bottle is filled.

### Dungeon slots (row 4)

Each dungeon is a 46px-wide column with everything centered:

```
   LABEL
 prize bigkey
  map  compass
  key  X / Y
 chest X / Y
```

The small-keys row is hidden for dungeons whose `maxSmallKeys` is 0.
Counts go green when fully collected. Two completion-state classes drive
the slot's background tint:

- `chests-done` — blue (`#1f3a78` bg, `#5a8eff` border) when all chests
  are collected but the prize is not yet obtained.
- `prize-done` — green (`#1d5a1d` bg, `#4dff88` border) when chests are
  done **and** the prize is obtained.

The completion class is recomputed on every snap and on every `prizes`
message. Crucially, `obtained` is read from the prize image's current
`src` attribute (looking for `1.png`) rather than from a snap field —
this way a partial `items` broadcast that doesn't carry prize fields
cannot wipe out the green class.

### Stats panel

Three rows (`CHECK`, `DEATH`, `BONKS`) with a 28px fixed-width label and
a 4px gap so values stay vertically aligned but sit close to their
labels.

## Background modes

Five options exposed via the Settings popup, persisted to localStorage
under `alttp-broadcast-bg`:

- `black`, `grey`, `white` — solid `body` background.
- `transparent` — `body` background is transparent, the BrowserWindow is
  recreated with `transparent: true`. A 30px `padding-top` is applied
  via `html[data-bg="transparent"] body` so content clears the macOS
  traffic lights / Windows caption buttons; a fixed `body::before` strip
  along the top and the `.bbg-bar` itself become draggable
  (`-webkit-app-region: drag`) so the window can be moved by the user.
- `image` — uses a user-uploaded image. The image is read via
  `FileReader.readAsDataURL`, stored under
  `alttp-broadcast-bg-image`, and applied through a `--bg-image` CSS
  custom property used by the `[data-bg="image"] body` rule
  (`background-size: cover`, centered, no-repeat). A "Clear" button
  removes the stored image and falls back to black.

A small inline `<script>` in `<head>` reads the URL's `bg` query param
and the `--bg-image` from localStorage immediately, so the correct
background is applied before the body renders (no flash of the wrong
color on transparent or image launches).

## Item fill feature

When enabled, every item / bottle / right-column slot fills its
background with a chosen color whenever the item's state goes from 0
to >0. The icon stays on top via z-index. Settings live under the
"Item Background" section of the popup:

- **Item Fill** (checkbox) — master toggle.
- **Fill Color** — `green` / `blue` / `purple` / `custom`. The custom
  option pairs with a native `<input type="color">` color picker.
- **Fill Effect** — `none` / `falling` / `starburst`.

The chosen color is exposed via `--item-fill-color` on
`document.documentElement`. The `::before` element uses that variable
as its `background`, with `opacity: 0.7` when filled (chosen so picked
colors are close to what the user sees in the color picker while still
letting the pixel-art icon read clearly through transparent areas).

### Effects

Effects are applied as classes added at the moment the slot transitions
into the filled state. Each is a one-shot CSS animation:

- **No Effect** (`fx-edges`) — a `radial-gradient` mask reveals the fill
  from the edges inward. Driven by a registered custom property
  (`@property --edges-reveal`) animated from 80% to 0%, so the
  percentage interpolates smoothly. `1.0s ease-in`.
- **Falling** (`fx-falling`) — fill slides down from above via
  `translateY(-100%) → translateY(0)`. `0.6s ease-out`.
- **Starburst** (`fx-fade`) — uniform opacity fade-in from 0 to 0.7.
  `0.9s ease-out`.

The `applyFill(key, container, isFilled)` helper in the renderer manages
class state. When transitioning into the filled state it clears any
prior effect classes, adds `filled`, forces a layout (`offsetWidth`),
then adds the effect class so the animation always retriggers.

## Settings popup

A modal overlay (`#settings-overlay`) anchored to the body. The
sections are:

- **Main Background** — radio buttons for `black / grey / white /
  transparent / image`, plus `Choose Image…` and `Clear` controls.
- **Item Background** — `Item Fill` checkbox plus the color and effect
  sub-sections (the sub-section is visually disabled when `Item Fill`
  is off).

`SETTINGS` is a single in-memory object. `loadSettings()` rehydrates it
from localStorage (and falls back to `'black'` if `'image'` is selected
but no image is stored). Every change in the popup persists immediately
via `saveSettings()` (or `saveBgImage()` for the image data URL, which
is wrapped in try/catch and shows an alert on quota errors).

Persisted keys (under localStorage):

- `alttp-broadcast-bg`
- `alttp-broadcast-bg-image`
- `alttp-broadcast-fill-enabled`
- `alttp-broadcast-fill-color`
- `alttp-broadcast-fill-custom`
- `alttp-broadcast-fill-effect`

## Inter-window communication

The broadcast view subscribes to a `BroadcastChannel` named
`alttp-tracker`. It handles four message types:

- `items` / `snap` — full state snap from `items.js broadcastItemSnap()`
  → routed into `applySnap(data)`. Updates every item, every dungeon
  count, and stats. Only updates the prize image / completion class when
  the snap actually includes the prize fields.
- `prizes` — prize-only update from `broadcastPrizes()` (fired by
  `onPrizeCycled`, including the auto-tracker's boss-detection path) →
  routed into `applyPrizes(prizes)`. This was added to fix a bug where
  the auto-tracker would update the item tracker but the broadcast
  would never see the prize change.
- `stats` — direct stats update.
- `newgame` — triggers `resetAll()`, restoring all state to defaults.

On startup the broadcast view sends `{ type: 'requestSnap' }` after
500 ms so the item tracker re-emits the current snap.

## Snap shape (relevant new fields)

Extended `items.js broadcastItemSnap()` to carry the following per
dungeon `k` (in addition to the pre-existing chest / big-key / small-key
fields):

- `${k}Map` — 0 / 1
- `${k}Compass` — 0 / 1
- `${k}MaxSmallKeys` — derived from the dungeon definition
- `${k}BigKeyOnly` — flags GT specifically
- `${k}Prize` — `crystal` / `redcrystal` / `pendant` / `greenpendant` /
  `unknown`
- `${k}PrizeObtained` — boolean derived from
  `prizeImg.src.includes('1.png')`

## Packaging note

Because `build.files` in `package.json` is an explicit allowlist, any
new file added to the project must be listed there or it will be
stripped from the packaged `.dmg` / `.exe`. `broadcast.html` was added
to that list during this build.

## Quick reference: visual states

| Slot type     | Class condition                          | Result                               |
| ------------- | ---------------------------------------- | ------------------------------------ |
| Item slot     | `state > 0 && fillEnabled`               | Tinted with `--item-fill-color`      |
| Bottles group | any of bottle1..4 > 0 + fillEnabled      | Tinted parent, mini-icons unchanged  |
| Dungeon slot  | `chests >= max && !prizeObtained`        | `chests-done` (blue background)      |
| Dungeon slot  | `chests >= max && prizeObtained`         | `prize-done` (green background)      |
| Dungeon slot  | pendant prize obtained, chests not done  | `pendant` border tint                |
