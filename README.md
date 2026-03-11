ALTTP Randomizer Tracker 
Architecture
Three separate windows launched from a central launcher (index.html), all communicating via BroadcastChannel 'alttp-tracker':

index.html — Launcher with host/port, item scale, map scale settings, and Launch Both / Items Only / Map Only buttons
itemtracker.html + items.js — Item tracker with its own WebSocket stack, handles all SRAM polling and broadcasts state to the map
map.html — Dual overworld map (LW/DW) with check dots, dungeon markers, logic coloring, and its own independent WebSocket (works without the item tracker open)


Autotracking

Connects to QUsb2Snes / SNI on port 23074 via WebSocket
SRAM split into two 0x280 chunked reads (single large reads silently fail in SNI) — chunks are merged before processing
Polls every 1 second: inventory (0x1AE bytes) + room data (two 0x280 chunks)
Map has its own independent WS connection; falls back to BroadcastChannel data from item tracker if map WS isn't connected
Auto-reconnect with 3-second retry


Item Tracker

30+ items with multi-state cycling (bow tiers, gloves, sword levels, bottles, etc.)
Dungeon slots (EP→GT) with prize cycling: crystal / red crystal / pendant / green pendant
Medallion assignment for MM and TR (bombos / ether / quake / unknown)
Crystal counter auto-tracked from SRAM boss bits
All state broadcast to map on every change


Map

LW and DW overworld maps side by side (horizontal) or stacked (vertical), switchable live
~60 overworld check dots — click to manually mark cleared, auto-cleared from SRAM
12 dungeon markers with prize images, boss-cleared state, and logic coloring
Check logic — each dot colored by item requirements:

🟢 Green = accessible now
🟡 Yellow = possible but dark room
🟠 Orange = visible/reachable but unattainable yet
🔴 Red = missing required items


Region logic — DW NW/East/South access, Death Mountain climbing, medallion checks for MM/TR
Dungeon logic covers all 12 dungeons (entrance requirements, boss requirements)
Checks cleared on page load (fresh game state every launch)
"⟳ New Game" button to reset mid-session


UI / Display

Zoom: 70%–150% in 10% steps (± buttons on map toolbar)
Window auto-resizes to fit maps when zoom or layout changes
Launch Both opens both windows simultaneously (single click gesture — avoids popup blocker)
12px black gap between LW and DW maps
Legend bar showing all 5 check states
Connection status indicator (green/yellow/red)
