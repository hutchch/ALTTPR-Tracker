<h1>ALTTPR Tracker (v0.0.1a Alpha release)</h1>
<p>
<i><strong>This is still being tested, and logic adjusted, but works for use. </strong> </i>

This is as-is.  These files are to assist in the game, and provided to help other out with their own projects, or to use for their games.  I will correct issues as I see them.
</p>
<h2> Descriptions/Instructions</h2>
A browser-based item and map tracker for A Link to the Past Randomizer runs. Tracks your items, dungeon progress, and overworld checks with real-time logic coloring — and supports autotracking via QUsb2Snes or SNI.

Features
- Item Tracker — click to cycle all items, weapons, and equipment through their states
- Dual overworld maps — Light World and Dark World with color-coded logic dots for every check
- Dungeon markers — shows accessibility, boss status, and prize state for all 12 dungeons
- Medallion assignment — right-click Bombos/Ether/Quake to mark MM, TR, or BOTH requirements
- Autotracking — connects to QUsb2Snes / SNI (ws://localhost:23074) to update items and dungeon state automatically
- No install required — runs entirely in the browser, locally

Quick Start

Option 1 — Open directly in Chrome or Edge
Launch Chrome or Edge with the --allow-file-access-from-files flag, then open index.html.

Windows — add the flag to your browser shortcut's Target field:

<code>"C:\Program Files\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files</code>

macOS — run from Terminal:

<code>open -a "Google Chrome" --args --allow-file-access-from-files</code>

Option 2 — Python local server - Python needs to be installed.

<code>bashcd alttpr-tracker
python -m http.server 8080
</code>

Then open <code>http://localhost:8080</code> in any browser.
Usage

1. Open index.html and click Launch Both to open the Item Tracker and Map windows
2. Left-click items to mark them obtained; right-click to cycle backward
3. Right-click Bombos, Ether, or Quake to assign dungeon medallion requirements (MM / TR / BOTH)
4. Click dungeon prize icons to cycle prize type (Crystal → Red Crystal → Pendant → Green Pendant)
5. Map dots and dungeon boxes update automatically based on your items

For full instructions see [ALTTP_Tracker_Guide.pdf](https://github.com/hutchch/ALTTPR-Tracker/blob/main/ALTTP_Tracker_Guide.pdf).

Autotracking
Start QUsb2Snes or SNI before launching the tracker. The connection status bar at the bottom of each window shows the current state. Click Reconnect if the connection drops.
Color Reference
<img width="660" height="297" alt="image" src="https://github.com/user-attachments/assets/c321533d-26ff-45df-a7fb-d18acc79f840" />


---------------------------------------------------------------------------------------------------------------------------------


ALTTP Randomizer Tracker 
Architecture

Three separate windows launched from a central launcher (index.html), all communicating via BroadcastChannel 'alttp-tracker':

- index.html — Launcher with host/port, item scale, map scale settings, and Launch Both / Items Only / Map Only buttons
- itemtracker.html + items.js — Item tracker with its own WebSocket stack, handles all SRAM polling and broadcasts state to the map
- map.html — Dual overworld map (LW/DW) with check dots, dungeon markers, logic coloring, and its own independent WebSocket (works without the item tracker open)

Autotracking

- Connects to QUsb2Snes / SNI on port 23074 via WebSocket
- SRAM split into two 0x280 chunked reads (single large reads silently fail in SNI) — chunks are merged before processing
- Polls every 1 second: inventory (0x1AE bytes) + room data (two 0x280 chunks)
- Map has its own independent WS connection; falls back to BroadcastChannel data from item tracker if map WS isn't connected
- Auto-reconnect with 3-second retry

Item Tracker

- 30+ items with multi-state cycling (bow tiers, gloves, sword levels, bottles, etc.)
- Dungeon slots (EP→GT) with prize cycling: crystal / red crystal / pendant / green pendant
- Medallion assignment for MM and TR (bombos / ether / quake / unknown)
- Crystal counter auto-tracked from SRAM boss bits
- All state broadcast to map on every change

Map

- LW and DW overworld maps side by side (horizontal) or stacked (vertical), switchable live
- ~60 overworld check dots — click to manually mark cleared, auto-cleared from SRAM
- 12 dungeon markers with prize images, boss-cleared state, and logic coloring
- Check logic — each dot colored by item requirements:
    🟢 Green = accessible now
    🟡 Yellow = possible but dark room
    🟠 Orange = visible/reachable but unattainable yet
    🔴 Red = missing required items

- Region logic — DW NW/East/South access, Death Mountain climbing, medallion checks for MM/TR
- Dungeon logic covers all 12 dungeons (entrance requirements, boss requirements)
- Checks cleared on page load (fresh game state every launch)
- "⟳ New Game" button to reset mid-session


UI / Display

- Zoom: 70%–150% in 10% steps (± buttons on map toolbar)
- Window auto-resizes to fit maps when zoom or layout changes
- Launch Both opens both windows simultaneously (single click gesture — avoids popup blocker)
- 12px black gap between LW and DW maps
- Legend bar showing all 5 check states
- Connection status indicator (green/yellow/red)

Horizontal:
<img width="1075" height="588" alt="image" src="https://github.com/user-attachments/assets/de13335d-c609-4fc2-ad8a-72b93ed0292d" />

Vertical:
<img width="1229" height="1140" alt="image" src="https://github.com/user-attachments/assets/7c946064-12bd-4ca7-9f38-caeae051ada6" />

Item Tracking with Map:
<img width="1319" height="1209" alt="image" src="https://github.com/user-attachments/assets/f86c5a8a-ea50-4a29-a3f2-25d5f95317df" />
