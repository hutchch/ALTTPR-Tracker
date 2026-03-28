<h1>ALTTPR Tracker (v1.1.0a release)</h1>
<p>

This is as-is.  These files are to assist in the game, and provided to help other out with their own projects, or to use for their games.  I will correct issues as I see them. Watch for release updates. 

 - Currently this is a selectable (1-7) crystal Ganon Tower
 - Standard or open game start.
 - Either normal or enemizer.
 - Key Sanity.

Tracker Application can be downloaded under [Releases](https://github.com/hutchch/ALTTPR-Tracker/releases)
</p>

______________________________________________________________________
 
 Coming Soon:
-  Map/Compass and Map/Compass/Small Key modes
-  Key Logic for MCK and KS Modes
 <img width="491" height="160" alt="image" src="https://github.com/user-attachments/assets/45fc91a9-c21e-4aeb-a608-b25acb6694e2" />
______________________________________________________________________

<h2> Descriptions/Instructions</h2>
<p>A browser-based item and map tracker for A Link to the Past Randomizer runs. Tracks your items, dungeon progress, and overworld checks with real-time logic coloring — and supports autotracking via QUsb2Snes or SNI.

Quick Setup Guide: [Quick Setup](https://github.com/hutchch/blob/main/Hutch-ALTTPR%20Tracker.pdf)<br>
User Guide: [User Guide](https://github.com/hutchch/ALTTPR-Tracker/blob/main/Hutch-ALTTPR-Tracker-User-Guide.pdf)

</p>
______________________________________________________________________

<h3>NOTE: Launch Order </h3>

For best results here is the launch order that was tested.

1. Launch QUSB2SNES or SNI
2. Open the Emulator (RetroArch)
3. Launch the game to the title screen
4. Launch the various tracker components (map, Items, timer)
    - These should all show connected 
5. Start the game

______________________________________________________________________
Features
- Item Tracker — click to cycle all items, weapons, and equipment through their states
- Dual overworld maps — Light World and Dark World with color-coded logic dots for every check
- Dungeon markers — shows accessibility, boss status, and prize state for all 12 dungeons
- Medallion assignment — right-click Bombos/Ether/Quake to mark MM, TR, or BOTH requirements
- Autotracking — connects to QUsb2Snes / SNI (ws://localhost:23074) to update items and dungeon state automatically
- No install required — runs entirely in the browser, locally
- Stat counters for Checks, Deaths and Bonks.

1. Open the program and click Launch Both to open the Item Tracker and Map windows
2. Left-click items to mark them obtained; right-click to cycle backward
3. Right-click Bombos, Ether, or Quake to assign dungeon medallion requirements (MM / TR / BOTH)
   NOTE: There may be instances where the medallion has to be remarked in order for the map to update.  
4. Click dungeon prize icons to cycle prize type (Crystal → Red Crystal → Pendant → Green Pendant)
5. Map dots and dungeon boxes update automatically based on your items

Autotracking
Start QUsb2Snes or SNI before launching the tracker. The connection status bar at the bottom of each window shows the current state. Click Reconnect if the connection drops.
Color Reference
<img width="660" height="297" alt="image" src="https://github.com/user-attachments/assets/c321533d-26ff-45df-a7fb-d18acc79f840" />

For best gaming experience, set Retroarch not to pause the game.  Under Settings -> User Interface, and turn off the pause content settings.
<img width="1798" height="602" alt="image" src="https://github.com/user-attachments/assets/9a5d9e2c-b0d6-4e75-a3bc-5939ac62c63b" />

______________________________________________________________________

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
    - 🟢 Green = accessible now
    - 🟡 Yellow = possible but dark room
    - 🟠 Orange = visible/reachable but unattainable yet
    - 🔴 Red = missing required items
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
<img width="1060" height="959" alt="image" src="https://github.com/user-attachments/assets/a86a2e49-c7c6-4eef-badf-463df188b98c" />


Vertical:

<img width="538" height="1480" alt="image" src="https://github.com/user-attachments/assets/87c1d2f3-2e83-49b2-b3e1-761c971b61a5" />


Key Sanity Item Tracking with Map and Timer:
<img width="1196" height="1519" alt="image" src="https://github.com/user-attachments/assets/bc0dbeee-3cd5-4a18-8289-fba106830840" />


Key Sanity Completionist:
<img width="1288" height="1239" alt="image" src="https://github.com/user-attachments/assets/3b6f6856-fcf8-48f8-b1bf-470974d7d71d" />

Logic
<img width="1163" height="1000" alt="image" src="https://github.com/user-attachments/assets/22d2cc5f-d273-4571-bc4b-c246be144a63" />
______________________________________________________________________
Special Thanks to  [Jedi Master T8ter](https://linktr.ee/jedi_master_t8ter) for showing this tracker on stream and testing it.  
Thanks to [LordHoell](https://linktr.ee/lordhoell) for indirectly providing ideas for the ItemTracker and for providing the idea on how to vibe code the map, [Max2dgam1ng](https://linktr.ee/max2dgam1ng) for getting me into this game, and playing on stream, [Limpbagel](https://linktr.ee/limpbagel) for tutorials, game knowledge and pointing me to [Stonks tracker](https://thettracker.vercel.app/) which gave ideas on some of the elements used in the Itemtracker, and finally the [ALTTPR community](https://alttpr.com) their hard work with randomizer as well as providing the [Community Tracker](https://alttprtracker.mfns.dev/index.html).
