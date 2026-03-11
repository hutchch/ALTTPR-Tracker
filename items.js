const BASE_URL = "items";

// WebSocket connection
let ws = null;
let wsHost = 'localhost';
let wsPort = 23074;
let reconnectInterval = null;
let deviceName = null;
let deviceAttached = false;
let readTimer = null;
let previousSRAM = null;

const items = {
    bow: {
        states: [
            { img: `${BASE_URL}/bow00.png`, name: 'No Bow' },
            { img: `${BASE_URL}/bow10.png`, name: 'Bow' },
            { img: `${BASE_URL}/bow11.png`, name: 'Bow & Arrows' },
            { img: `${BASE_URL}/bow12.png`, name: 'Silver Arrows' }
        ],
        currentState: 0
    },
    boomerang: {
        states: [
            { img: `${BASE_URL}/boomerang00.png`, name: 'No Boomerang' },
            { img: `${BASE_URL}/boomerang10.png`, name: 'Blue Boomerang' },
            { img: `${BASE_URL}/boomerang01.png`, name: 'Red Boomerang' },
            { img: `${BASE_URL}/boomerang11.png`, name: 'Both Boomerangs' }
        ],
        currentState: 0
    },
    hookshot: {
        states: [
            { img: `${BASE_URL}/hookshot0.png`, name: 'No Hookshot' },
            { img: `${BASE_URL}/hookshot1.png`, name: 'Hookshot' }
        ],
        currentState: 0
    },
    bomb: {
        states: [
            { img: `${BASE_URL}/bomb00.png`, name: 'No Bombs' },
            { img: `${BASE_URL}/bomb10.png`, name: 'Bombs' }
        ],
        currentState: 0
    },
    mushroom: {
        states: [
            { img: `${BASE_URL}/mushroom0.png`, name: 'No Mushroom' },
            { img: `${BASE_URL}/mushroom1.png`, name: 'Mushroom' },
            { img: `${BASE_URL}/mushroom2.png`, name: 'Turned In' }
        ],
        currentState: 0
    },
    powder: {
        states: [
            { img: `${BASE_URL}/powder00.png`, name: 'No Powder' },
            { img: `${BASE_URL}/powder10.png`, name: 'Magic Powder' }
        ],
        currentState: 0
    },
    firerod: {
        states: [
            { img: `${BASE_URL}/firerod0.png`, name: 'No Fire Rod' },
            { img: `${BASE_URL}/firerod1.png`, name: 'Fire Rod' }
        ],
        currentState: 0
    },
    icerod: {
        states: [
            { img: `${BASE_URL}/icerod0.png`, name: 'No Ice Rod' },
            { img: `${BASE_URL}/icerod1.png`, name: 'Ice Rod' }
        ],
        currentState: 0
    },
    bombos: {
        states: [
            { img: `${BASE_URL}/bombos00.png`, name: 'No Bombos' },
            { img: `${BASE_URL}/bombos10.png`, name: 'Bombos' }
        ],
        currentState: 0,
        medallionLabel: ''
    },
    ether: {
        states: [
            { img: `${BASE_URL}/ether00.png`, name: 'No Ether' },
            { img: `${BASE_URL}/ether10.png`, name: 'Ether' }
        ],
        currentState: 0,
        medallionLabel: ''
    },
    quake: {
        states: [
            { img: `${BASE_URL}/quake00.png`, name: 'No Quake' },
            { img: `${BASE_URL}/quake10.png`, name: 'Quake' }
        ],
        currentState: 0,
        medallionLabel: ''
    },
    agahnim: {
        states: [
            { img: `${BASE_URL}/aga10.png`, name: 'Agahnim Alive' },
            { img: `${BASE_URL}/aga11.png`, name: 'Agahnim Defeated' }
        ],
        currentState: 0
    },
    gomode: {
        states: [
            { img: null, name: 'Go Mode Off', color: '#666' },
            { img: null, name: 'Go Mode On', color: '#2ecc71' }
        ],
        currentState: 0,
        isGoMode: true
    },
    lamp: {
        states: [
            { img: `${BASE_URL}/lamp0.png`, name: 'No Lamp' },
            { img: `${BASE_URL}/lamp1.png`, name: 'Lamp' }
        ],
        currentState: 0
    },
    hammer: {
        states: [
            { img: `${BASE_URL}/hammer0.png`, name: 'No Hammer' },
            { img: `${BASE_URL}/hammer1.png`, name: 'Hammer' }
        ],
        currentState: 0
    },
    shovel: {
        states: [
            { img: `${BASE_URL}/shovel0.png`, name: 'No Shovel' },
            { img: `${BASE_URL}/shovel1.png`, name: 'Shovel' }
        ],
        currentState: 0
    },
    flute: {
        states: [
            { img: `${BASE_URL}/flute00.png`, name: 'No Flute' },
            { img: `${BASE_URL}/flute10.png`, name: 'Flute' },
            { img: `${BASE_URL}/flute11.png`, name: 'Flute & Bird' }
        ],
        currentState: 0
    },
    net: {
        states: [
            { img: `${BASE_URL}/net0.png`, name: 'No Net' },
            { img: `${BASE_URL}/net1.png`, name: 'Net' }
        ],
        currentState: 0
    },
    book: {
        states: [
            { img: `${BASE_URL}/book0.png`, name: 'No Book' },
            { img: `${BASE_URL}/book1.png`, name: 'Book of Mudora' }
        ],
        currentState: 0
    },
    bottle: {
        states: [
            { img: `${BASE_URL}/bottle0.png`, name: 'No Bottles' },
            { img: `${BASE_URL}/bottle1.png`, name: '1 Bottle' },
            { img: `${BASE_URL}/bottle2.png`, name: '2 Bottles' },
            { img: `${BASE_URL}/bottle3.png`, name: '3 Bottles' },
            { img: `${BASE_URL}/bottle4.png`, name: '4 Bottles' }
        ],
        currentState: 0
    },
    somaria: {
        states: [
            { img: `${BASE_URL}/caneofsomaria0.png`, name: 'No Somaria' },
            { img: `${BASE_URL}/caneofsomaria1.png`, name: 'Cane of Somaria' }
        ],
        currentState: 0
    },
    byrna: {
        states: [
            { img: `${BASE_URL}/caneofbyrna0.png`, name: 'No Byrna' },
            { img: `${BASE_URL}/caneofbyrna1.png`, name: 'Cane of Byrna' }
        ],
        currentState: 0
    },
    cape: {
        states: [
            { img: `${BASE_URL}/cape0.png`, name: 'No Cape' },
            { img: `${BASE_URL}/cape1.png`, name: 'Magic Cape' }
        ],
        currentState: 0
    },
    mirror: {
        states: [
            { img: `${BASE_URL}/mirror0.png`, name: 'No Mirror' },
            { img: `${BASE_URL}/mirror1.png`, name: 'Magic Mirror' }
        ],
        currentState: 0
    },
    halfmagic: {
        states: [
            { img: `${BASE_URL}/halfmagic0.png`, name: 'No Half Magic' },
            { img: `${BASE_URL}/halfmagic1.png`, name: 'Half Magic' }
        ],
        currentState: 0
    },
    boots: {
        states: [
            { img: `${BASE_URL}/boots0.png`, name: 'No Boots' },
            { img: `${BASE_URL}/boots1.png`, name: 'Pegasus Boots' }
        ],
        currentState: 0
    },
    gloves: {
        states: [
            { img: `${BASE_URL}/gloves0.png`, name: 'No Gloves' },
            { img: `${BASE_URL}/gloves1.png`, name: 'Power Glove' },
            { img: `${BASE_URL}/gloves2.png`, name: 'Titan\'s Mitt' }
        ],
        currentState: 0
    },
    flippers: {
        states: [
            { img: `${BASE_URL}/flippers0.png`, name: 'No Flippers' },
            { img: `${BASE_URL}/flippers1.png`, name: 'Flippers' }
        ],
        currentState: 0
    },
    moonpearl: {
        states: [
            { img: `${BASE_URL}/moonpearl0.png`, name: 'No Moon Pearl' },
            { img: `${BASE_URL}/moonpearl1.png`, name: 'Moon Pearl' }
        ],
        currentState: 0
    },
    sword: {
        states: [
            { img: `${BASE_URL}/sword0.png`, name: 'No Sword' },
            { img: `${BASE_URL}/sword1.png`, name: 'Fighter\'s Sword' },
            { img: `${BASE_URL}/sword2.png`, name: 'Master Sword' },
            { img: `${BASE_URL}/sword3.png`, name: 'Tempered Sword' },
            { img: `${BASE_URL}/sword4.png`, name: 'Golden Sword' }
        ],
        currentState: 0
    },
    shield: {
        states: [
            { img: `${BASE_URL}/shield0.png`, name: 'No Shield' },
            { img: `${BASE_URL}/shield1.png`, name: 'Fighter\'s Shield' },
            { img: `${BASE_URL}/shield2.png`, name: 'Fire Shield' },
            { img: `${BASE_URL}/shield3.png`, name: 'Mirror Shield' }
        ],
        currentState: 0
    },
    tunic: {
        states: [
            { img: `${BASE_URL}/mail0.png`, name: 'Green Mail' },
            { img: `${BASE_URL}/mail1.png`, name: 'Blue Mail' },
            { img: `${BASE_URL}/mail2.png`, name: 'Red Mail' }
        ],
        currentState: 0
    }
};

const dungeons = {
    ep: { name: 'EP', bossAddr: 0x191, bigkeyAddr: 0x367, bigkeyMask: 0x20, compassAddr: 0x365, compassMask: 0x20, mapAddr: 0x369, mapMask: 0x20, smallKeyAddr: 0x4e2, maxChests: 6, maxSmallKeys: 0, maxItems: 3, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x172,0x10],[0x154,0x10],[0x150,0x10],[0x152,0x10],[0x170,0x10],[0x191,0x08]] },
    dp: { name: 'DP', bossAddr: 0x067, bigkeyAddr: 0x367, bigkeyMask: 0x10, compassAddr: 0x365, compassMask: 0x10, mapAddr: 0x369, mapMask: 0x10, smallKeyAddr: 0x4e3, maxChests: 6, maxSmallKeys: 1, maxItems: 2, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0xe6,0x10],[0xe7,0x04],[0xe8,0x10],[0x10a,0x10],[0xea,0x10],[0x67,0x08]] },
    toh: { name: 'ToH', bossAddr: 0x00f, bigkeyAddr: 0x366, bigkeyMask: 0x20, compassAddr: 0x364, compassMask: 0x20, mapAddr: 0x368, mapMask: 0x20, smallKeyAddr: 0x4ea, maxChests: 6, maxSmallKeys: 1, maxItems: 2, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x10f,0x04],[0xee,0x10],[0x10e,0x10],[0x4e,0x10],[0x4e,0x20],[0xf,0x08]] },
    pod: { name: 'POD', bossAddr: 0x0b5, bigkeyAddr: 0x367, bigkeyMask: 0x02, compassAddr: 0x365, compassMask: 0x02, mapAddr: 0x369, mapMask: 0x02, smallKeyAddr: 0x4e6, maxChests: 14, maxSmallKeys: 6, maxItems: 5, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x12,0x10],[0x56,0x10],[0x54,0x10],[0x54,0x20],[0x74,0x10],[0x14,0x10],[0x34,0x10],[0x34,0x20],[0x34,0x40],[0x32,0x10],[0x32,0x20],[0xd4,0x10],[0xd4,0x20],[0xb5,0x08]] },
    sp: { name: 'SP', bossAddr: 0x00d, bigkeyAddr: 0x367, bigkeyMask: 0x04, compassAddr: 0x365, compassMask: 0x04, mapAddr: 0x369, mapMask: 0x04, smallKeyAddr: 0x4e5, maxChests: 10, maxSmallKeys: 1, maxItems: 6, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x50,0x10],[0x6e,0x10],[0x6c,0x10],[0x6a,0x10],[0x68,0x10],[0x8c,0x10],[0xec,0x10],[0xec,0x20],[0xcc,0x10],[0xd,0x08]] },
    sw: { name: 'SW', bossAddr: 0x053, bigkeyAddr: 0x366, bigkeyMask: 0x80, compassAddr: 0x364, compassMask: 0x80, mapAddr: 0x368, mapMask: 0x80, smallKeyAddr: 0x4e8, maxChests: 8, maxSmallKeys: 3, maxItems: 2, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0xce,0x10],[0xd0,0x10],[0xae,0x10],[0xae,0x20],[0xb0,0x10],[0xb0,0x20],[0xb2,0x10],[0x53,0x08]] },
    tt: { name: 'TT', bossAddr: 0x159, bigkeyAddr: 0x366, bigkeyMask: 0x10, compassAddr: 0x364, compassMask: 0x10, mapAddr: 0x368, mapMask: 0x10, smallKeyAddr: 0x4eb, maxChests: 8, maxSmallKeys: 1, maxItems: 4, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x1b6,0x10],[0x1b6,0x20],[0x196,0x10],[0x1b8,0x10],[0xca,0x10],[0x8a,0x10],[0x88,0x10],[0x159,0x08]] },
    ip: { name: 'IP', bossAddr: 0x1bd, bigkeyAddr: 0x366, bigkeyMask: 0x40, compassAddr: 0x364, compassMask: 0x40, mapAddr: 0x368, mapMask: 0x40, smallKeyAddr: 0x4e9, maxChests: 8, maxSmallKeys: 2, maxItems: 3, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x5c,0x10],[0x7e,0x10],[0x3e,0x10],[0xbe,0x10],[0xfc,0x10],[0x15c,0x10],[0x13c,0x10],[0x1bd,0x08]] },
    mm: { name: 'MM', bossAddr: 0x121, bigkeyAddr: 0x367, bigkeyMask: 0x01, compassAddr: 0x365, compassMask: 0x01, mapAddr: 0x369, mapMask: 0x01, smallKeyAddr: 0x4e7, maxChests: 8, maxSmallKeys: 3, maxItems: 2, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x144,0x10],[0x166,0x10],[0x184,0x10],[0x182,0x10],[0x1a2,0x10],[0x186,0x10],[0x186,0x20],[0x121,0x08]] },
    tr: { name: 'TR', bossAddr: 0x149, bigkeyAddr: 0x366, bigkeyMask: 0x08, compassAddr: 0x364, compassMask: 0x08, mapAddr: 0x368, mapMask: 0x08, smallKeyAddr: 0x4ec, maxChests: 12, maxSmallKeys: 4, maxItems: 5, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0,
        locations: [[0x1ac,0x10],[0x16e,0x10],[0x16e,0x20],[0x16c,0x10],[0x28,0x10],[0x48,0x10],[0x8,0x10],[0x1aa,0x10],[0x1aa,0x20],[0x1aa,0x40],[0x1aa,0x80],[0x149,0x08]] },
    gt: { name: 'GT', bossAddr: null, bigkeyAddr: 0x366, bigkeyMask: 0x04, compassAddr: 0x364, compassMask: 0x04, mapAddr: 0x368, mapMask: 0x04, smallKeyAddr: 0x4ed, maxChests: 27, maxSmallKeys: 4, maxItems: 20, smallKeyCount: 0, itemCount: 0, prizeState: 0, bigkeyState: 0, compassState: 0, mapState: 0, bigkeyOnly: true,
        locations: [[0x119,0x04],[0xf6,0x10],[0xf6,0x20],[0xf6,0x40],[0xf6,0x80],[0x116,0x10],[0xfa,0x10],[0xf8,0x10],[0xf8,0x20],[0xf8,0x40],[0xf8,0x80],[0x118,0x10],[0x118,0x20],[0x118,0x40],[0x118,0x80],[0x38,0x10],[0x38,0x20],[0x38,0x40],[0x11a,0x10],[0x13a,0x10],[0x13a,0x20],[0x13a,0x40],[0x13a,0x80],[0x7a,0x10],[0x7a,0x20],[0x7a,0x40],[0x9a,0x10]] }
};

const layout = [
    ['bow', 'boomerang', 'hookshot', 'bomb', 'mushroom', 'powder', 'moonpearl', 'sword', 'ep'],
    ['firerod', 'icerod', 'bombos', 'ether', 'quake', 'boots', 'gloves', 'shield', 'dp'],
    ['lamp', 'hammer', 'shovel', 'flute', 'net', 'book', 'flippers', 'tunic', 'toh'],
    ['bottle', 'somaria', 'byrna', 'cape', 'mirror', 'halfmagic', 'agahnim', 'gomode'],
    ['pod', 'sp', 'sw', 'tt', 'ip', 'mm', 'tr', 'gt']
];

function createTracker() {
    // Clear cache on load
    localStorage.removeItem('alttp-tracker-state');
    
    const container = document.querySelector('.tracker-container');
    
    layout.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'tracker-row';
        
        row.forEach(itemKey => {
            // Check if this is a dungeon
            if (dungeons[itemKey]) {
                const dungeonSlot = document.createElement('div');
                dungeonSlot.className = 'dungeon-slot';
                dungeonSlot.dataset.dungeonKey = itemKey;
                
                // Check if this is a pendant dungeon (EP, DP, ToH)
                const isPendantDungeon = ['ep', 'dp', 'toh'].includes(itemKey);
                if (isPendantDungeon) {
                    dungeonSlot.classList.add('pendant-dungeon');
                }
                
                // Container for label and prize (left side for pendant dungeons)
                const dungeonContent = document.createElement('div');
                dungeonContent.className = 'dungeon-content';
                
                const label = document.createElement('div');
                label.className = 'dungeon-label';
                label.textContent = dungeons[itemKey].name;
                dungeonContent.appendChild(label);
                
                // Only add prize image if not bigkeyOnly
                if (!dungeons[itemKey].bigkeyOnly) {
                    const prizeImg = document.createElement('img');
                    prizeImg.className = 'prize-img';
                    prizeImg.src = `${BASE_URL}/crystal0.png`;
                    prizeImg.alt = 'Crystal';
                    dungeonContent.appendChild(prizeImg);
                    
                    dungeonSlot.addEventListener('click', () => cycleDungeonPrize(itemKey, dungeonSlot));
                }
                
                dungeonSlot.appendChild(dungeonContent);
                
                // Container for dungeon items (bigkey, compass, map)
                const itemsContainer = document.createElement('div');
                itemsContainer.className = 'dungeon-items';
                
                const bigkeyImg = document.createElement('img');
                bigkeyImg.className = 'bigkey-img';
                bigkeyImg.src = `${BASE_URL}/bigkey0.png`;
                bigkeyImg.alt = 'Big Key';
                itemsContainer.appendChild(bigkeyImg);
                
                const compassImg = document.createElement('img');
                compassImg.className = 'compass-img';
                compassImg.src = `${BASE_URL}/compass0.png`;
                compassImg.alt = 'Compass';
                itemsContainer.appendChild(compassImg);
                
                const mapImg = document.createElement('img');
                mapImg.className = 'map-img';
                mapImg.src = `${BASE_URL}/map0.png`;
                mapImg.alt = 'Map';
                itemsContainer.appendChild(mapImg);
                
                dungeonSlot.appendChild(itemsContainer);
                
                // Add small key and item count displays
                const countsContainer = document.createElement('div');
                countsContainer.className = isPendantDungeon ? 'dungeon-counts-pendant' : 'dungeon-counts';
                
                // Small key count with icon (only if maxSmallKeys > 0)
                if (dungeons[itemKey].maxSmallKeys > 0) {
                    const keyContainer = document.createElement('div');
                    keyContainer.className = 'count-item';
                    
                    const keyImg = document.createElement('img');
                    keyImg.className = 'count-icon';
                    keyImg.src = `${BASE_URL}/smallkey0.png`;
                    keyImg.alt = 'Small Key';
                    
                    const keyCount = document.createElement('span');
                    keyCount.className = 'key-count';
                    keyCount.textContent = `0/${dungeons[itemKey].maxSmallKeys}`;
                    keyCount.dataset.dungeonKey = itemKey;
                    
                    keyContainer.appendChild(keyImg);
                    keyContainer.appendChild(keyCount);
                    countsContainer.appendChild(keyContainer);
                }
                
                // Non-dungeon item count with icon
                const itemContainer = document.createElement('div');
                itemContainer.className = 'count-item';
                
                const chestImg = document.createElement('img');
                chestImg.className = 'count-icon';
                chestImg.src = `${BASE_URL}/chest0.png`;
                chestImg.alt = 'Items';
                
                const itemCount = document.createElement('span');
                itemCount.className = 'item-count';
                itemCount.textContent = `0/${dungeons[itemKey].maxItems}`;
                itemCount.dataset.dungeonKey = itemKey;
                
                itemContainer.appendChild(chestImg);
                itemContainer.appendChild(itemCount);
                countsContainer.appendChild(itemContainer);
                
                dungeonSlot.appendChild(countsContainer);
                
                rowDiv.appendChild(dungeonSlot);
            } else {
                // Regular item
                const itemSlot = document.createElement('div');
                itemSlot.className = 'item-slot';
                itemSlot.dataset.itemKey = itemKey;
                itemSlot.dataset.itemName = items[itemKey].states[0].name;
                
                if (items[itemKey].isGoMode) {
                    itemSlot.classList.add('go-mode');
                    itemSlot.textContent = 'GO';
                    itemSlot.style.color = items[itemKey].states[0].color;
                } else {
                    const img = document.createElement('img');
                    img.src = items[itemKey].states[0].img;
                    img.alt = items[itemKey].states[0].name;
                    itemSlot.appendChild(img);
                    
                    // Add medallion label container for bombos, ether, quake
                    if (['bombos', 'ether', 'quake'].includes(itemKey)) {
                        const label = document.createElement('div');
                        label.className = 'medallion-label';
                        itemSlot.appendChild(label);
                    }
                }
                
                itemSlot.addEventListener('click', () => cycleItem(itemKey, itemSlot));
                itemSlot.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (['bombos', 'ether', 'quake'].includes(itemKey)) {
                        cycleMedallionLabel(itemKey, itemSlot);
                    }
                });
                
                rowDiv.appendChild(itemSlot);
            }
        });
        
        container.appendChild(rowDiv);
    });
}

function cycleDungeonPrize(dungeonKey, slot) {
    const dungeon = dungeons[dungeonKey];
    const prizeImages = ['crystal0.png', 'redcrystal0.png', 'pendant0.png', 'greenpendant0.png'];
    
    dungeon.prizeState = (dungeon.prizeState + 1) % prizeImages.length;
    
    const prizeImg = slot.querySelector('.prize-img');
    prizeImg.src = `${BASE_URL}/${prizeImages[dungeon.prizeState]}`;
    
    // Hook for external listeners (e.g. map window sync)
    if (typeof window.onPrizeCycled === 'function') window.onPrizeCycled();
}

function updateDungeonCountDisplay(dungeonKey) {
    const dungeon = dungeons[dungeonKey];
    const slot = document.querySelector(`[data-dungeon-key="${dungeonKey}"]`);
    
    if (slot) {
        // Update small key count
        if (dungeon.maxSmallKeys > 0) {
            const keyCountSpan = slot.querySelector('.key-count');
            if (keyCountSpan) {
                keyCountSpan.textContent = `${dungeon.smallKeyCount}/${dungeon.maxSmallKeys}`;
            }
        }
        
        // Update item count
        const itemCountSpan = slot.querySelector('.item-count');
        if (itemCountSpan) {
            itemCountSpan.textContent = `${dungeon.itemCount}/${dungeon.maxItems}`;
        }
        
        // Check completion status
        const allItemsCollected = dungeon.itemCount >= dungeon.maxItems;
        
        // Check if prize is collected (prize image has 1.png instead of 0.png)
        const prizeImg = slot.querySelector('.prize-img');
        const prizeCollected = prizeImg && prizeImg.src.includes('1.png');
        
        // Remove all completion classes first
        slot.classList.remove('completed-items', 'completed-full');
        
        if (allItemsCollected && prizeCollected) {
            // Bright green - all items + prize collected
            slot.classList.add('completed-full');
        } else if (allItemsCollected) {
            // Dark green - only items collected
            slot.classList.add('completed-items');
        }
    }
}

function cycleItem(itemKey, slot) {
    const item = items[itemKey];
    item.currentState = (item.currentState + 1) % item.states.length;
    
    const newState = item.states[item.currentState];
    
    if (item.isGoMode) {
        slot.style.color = newState.color;
        slot.dataset.itemName = newState.name;
    } else {
        const img = slot.querySelector('img');
        img.src = newState.img;
        img.alt = newState.name;
        slot.dataset.itemName = newState.name;
    }
}

function cycleMedallionLabel(itemKey, slot) {
    const item = items[itemKey];
    const labels = ['', 'MM', 'TR', 'BOTH'];
    const currentIndex = labels.indexOf(item.medallionLabel);
    item.medallionLabel = labels[(currentIndex + 1) % labels.length];
    
    const labelDiv = slot.querySelector('.medallion-label');
    labelDiv.textContent = item.medallionLabel;
}

const SAVEDATA_START = 0xF5F000;

function connectWebSocket() {
    try {
        ws = new WebSocket(`ws://${wsHost}:${wsPort}`);
        ws.binaryType = 'arraybuffer';
        
        ws.onopen = () => {
            console.log('WebSocket connected - requesting device list');
            updateConnectionStatus('Connecting');
            
            // Request device list from QUsb2Snes
            ws.send(JSON.stringify({
                Opcode: 'DeviceList',
                Space: 'SNES'
            }));
            
            if (reconnectInterval) {
                clearInterval(reconnectInterval);
                reconnectInterval = null;
            }
        };
        
        ws.onmessage = handleWebSocketMessage;
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateConnectionStatus('Error');
        };
        
        ws.onclose = () => {
            console.log('WebSocket disconnected');
            updateConnectionStatus('Disconnected');
            deviceAttached = false;
            
            if (readTimer) {
                clearInterval(readTimer);
                readTimer = null;
            }
            
            // Attempt to reconnect every 5 seconds
            if (!reconnectInterval) {
                reconnectInterval = setInterval(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 5000);
            }
        };
    } catch (e) {
        console.error('Failed to create WebSocket connection:', e);
        updateConnectionStatus('Error');
    }
}

function handleWebSocketMessage(event) {
    try {
        // Handle binary data (SRAM reads)
        if (event.data instanceof ArrayBuffer) {
            const data = new Uint8Array(event.data);
            processSRAMData(data);
            return;
        }
        
        // Handle JSON responses
        const response = JSON.parse(event.data);
        
        if (response.Results) {
            if (!deviceAttached) {
                // DeviceList response
                if (response.Results.length > 0) {
                    deviceName = response.Results[0];
                    console.log('Found device:', deviceName);
                    
                    // Attach to device
                    ws.send(JSON.stringify({
                        Opcode: 'Attach',
                        Space: 'SNES',
                        Operands: [deviceName]
                    }));
                    
                    deviceAttached = true;
                    updateConnectionStatus('Connected');
                    
                    // Start reading SRAM
                    startSRAMReading();
                } else {
                    updateConnectionStatus('No device found');
                }
            }
        }
    } catch (e) {
        console.error('Failed to handle WebSocket message:', e);
    }
}

function startSRAMReading() {
    if (readTimer) {
        clearInterval(readTimer);
    }
    
    // Read SRAM every second
    readTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN && deviceAttached) {
            // Read inventory data (0x1ae bytes from F5F340)
            ws.send(JSON.stringify({
                Opcode: 'GetAddress',
                Space: 'SNES',
                Operands: [(SAVEDATA_START + 0x340).toString(16), '1ae']
            }));

            // Read room/event data in TWO chunks of 0x280 each (matches original tracker)
            // Chunk 1: F5F000 + 0x000, length 0x280 (rooms 0x000-0x27F)
            ws.send(JSON.stringify({
                Opcode: 'GetAddress',
                Space: 'SNES',
                Operands: [(SAVEDATA_START).toString(16), '280']
            }));
            // Chunk 2: F5F000 + 0x280, length 0x280 (rooms 0x280-0x4FF, includes NPC 0x410/0x411)
            ws.send(JSON.stringify({
                Opcode: 'GetAddress',
                Space: 'SNES',
                Operands: [(SAVEDATA_START + 0x280).toString(16), '280']
            }));
        }
    }, 1000);
}

let previousRoomData = null;
let roomChunk1 = null;        // first 0x280 chunk
let roomChunk1Time = 0;       // timestamp when chunk1 was stored

function processSRAMData(data) {
    if (data.length === 0x1ae) {
        processInventoryData(data);
    } else if (data.length === 0x280) {
        const now = Date.now();
        if (roomChunk1 === null || (now - roomChunk1Time) > 1500) {
            // No pending chunk, or the stored one is stale (>1.5s old) — store as first chunk
            roomChunk1 = data;
            roomChunk1Time = now;
        } else {
            // Have a fresh chunk1 — merge and process
            const merged = new Uint8Array(0x500);
            merged.set(roomChunk1, 0);
            merged.set(data, 0x280);
            roomChunk1 = null;
            roomChunk1Time = 0;
            processRoomData(merged);
        }
    } else if (data.length === 0x400 || data.length === 0x420 || data.length === 0x500) {
        processRoomData(data);
    }
}

function processRoomData(data) {
    // Check boss defeats and track chests
    for (const [key, dungeon] of Object.entries(dungeons)) {
        // Check boss defeat
        if (dungeon.bossAddr && dungeon.bossAddr < data.length) {
            const roomByte = data[dungeon.bossAddr];
            const bossDefeated = (roomByte & 0x08) !== 0;
            
            const slot = document.querySelector(`[data-dungeon-key="${key}"]`);
            if (slot && bossDefeated) {
                const prizeImg = slot.querySelector('.prize-img');
                if (prizeImg) {
                    const currentSrc = prizeImg.src;
                    if (currentSrc.includes('0.png')) {
                        prizeImg.src = currentSrc.replace('0.png', '1.png');
                        // Update completion status when prize is collected
                        updateDungeonCountDisplay(key);
                        if (typeof window.onPrizeCycled === 'function') window.onPrizeCycled();
                    }
                }
            }
        }
        
        // Track chests using [room, bitmask] locations
        if (dungeon.locations) {
            let chestsOpened = 0;
            
            for (const [room, bitmask] of dungeon.locations) {
                if (room < data.length && (data[room] & bitmask) !== 0) {
                    chestsOpened++;
                }
            }
            
            // Calculate items = total chests - dungeon items - small keys
            let dungeonItems = 0;
            if (dungeon.compassState > 0) dungeonItems++;
            if (dungeon.mapState > 0) dungeonItems++;
            if (dungeon.bigkeyState > 0) dungeonItems++;
            
            // Use the high-water mark of small keys ever held so that using a key
            // doesn't cause the chest subtraction to drop and inflate the item count
            const smallKeys = dungeon.smallKeyMax || dungeon.smallKeyCount;
            
            // Items = total chests - map - compass - bigkey - smallkeys
            let items = chestsOpened - dungeonItems - smallKeys;
            if (items < 0) items = 0;
            
            // Update if changed
            if (items !== dungeon.itemCount) {
                dungeons[key].itemCount = items;
                updateDungeonCountDisplay(key);
            }
        }
    }
    
    previousRoomData = new Uint8Array(data);

    // Broadcast room data to map window via BroadcastChannel
    if (window._itemsBc) {
        window._itemsBc.postMessage({ type: 'rooms', data: Array.from(data) });
    }
}

function processInventoryData(data) {
    // Data starts at offset 0x340 in SRAM, we read up to 0x38F
    const changed = (offset) => {
        return !previousSRAM || data[offset] !== previousSRAM[offset];
    };
    
    const newbit = (offset, mask) => {
        return changed(offset) && (data[offset] & mask) !== 0 && (!previousSRAM || (previousSRAM[offset] & mask) === 0);
    };
    
    // Based on autot.js tracking logic
    if (changed(0x00)) { // 0x340 - Bow
        const bowValue = data[0x00];
        if (bowValue === 0x00) updateItemState('bow', 0);
        else if (bowValue === 0x01) updateItemState('bow', 1);
        else if (bowValue === 0x02) updateItemState('bow', 2);
        else if (bowValue === 0x03) updateItemState('bow', 3);
        else if (bowValue === 0x04) updateItemState('bow', 3); // Silver arrows
    }
    
    // Boomerang - check randomizer logic first (0x38c)
    if (changed(0x4C)) {
    //if (changed(0x4C)) { // 0x38C - Randomizer boomerang tracking
        const bits = data[0x4C] & 0xC0;
        if (bits === 0x80) updateItemState('boomerang', 1); // Blue boomerang
        else if (bits === 0x40) updateItemState('boomerang', 2); // Red boomerang
        else if (bits === 0xC0) updateItemState('boomerang', 3); // Both
        else if (changed(0x01)) { // Fallback to vanilla 0x341
            updateItemState('boomerang', data[0x01]);
        }
    //} else if (changed(0x01)) { // 0x341 - Vanilla boomerang
    //    updateItemState('boomerang', data[0x01]);
    }
    
    if (newbit(0x02, 0x01)) updateItemState('hookshot', 1); // 0x342
    if (changed(0x03)) updateItemState('bomb', data[0x03] > 0 ? 1 : 0); // 0x343
    
    // Mushroom/Powder - check randomizer logic first (0x38c)
    if (changed(0x4C)) { // 0x38C - Randomizer mushroom/powder/flute/shovel tracking
        const bits38c = data[0x4C];
        
        // Mushroom tracking
        const mushroomBits = bits38c & 0x28;
        if (mushroomBits === 0x28) updateItemState('mushroom', 1); // Has mushroom
        else if (mushroomBits === 0x08) updateItemState('mushroom', 2); // Turned in
        else updateItemState('mushroom', 0);
        
        // Powder tracking
        if (bits38c & 0x10) updateItemState('powder', 1);
        
        // Flute tracking (bits 0x03)
        const fluteState = bits38c & 0x03;
        if (fluteState === 0x01 || fluteState === 0x03) updateItemState('flute', 2); // Active flute
        else if (fluteState === 0x02) updateItemState('flute', 1); // Inactive flute
        else updateItemState('flute', 0);
        
        // Shovel tracking - once obtained, it stays (bit 0x04)
        if ((bits38c & 0x04) && items.shovel.currentState === 0) {
            updateItemState('shovel', 1);
        }
    } // else if (changed(0x04)) { // 0x344 - Vanilla mushroom/powder
      //  const powderValue = data[0x04];
      //  if (powderValue === 0x01) {
      //      updateItemState('mushroom', 1);
      //     updateItemState('powder', 0);
      //  } else if (powderValue === 0x02) {
      //      updateItemState('powder', 1);
      //      updateItemState('mushroom', 2);
      //  } else {
      //      updateItemState('mushroom', 0);
      //      updateItemState('powder', 0);
      //  }
    // }
    
    if (newbit(0x05, 0x01)) updateItemState('firerod', 1); // 0x345
    if (newbit(0x06, 0x01)) updateItemState('icerod', 1); // 0x346
    if (newbit(0x07, 0x01)) updateItemState('bombos', 1); // 0x347
    if (newbit(0x08, 0x01)) updateItemState('ether', 1); // 0x348
    if (newbit(0x09, 0x01)) updateItemState('quake', 1); // 0x349
    if (newbit(0x0A, 0x01)) updateItemState('lamp', 1); // 0x34A
    if (newbit(0x0B, 0x01)) updateItemState('hammer', 1); // 0x34B
    if (newbit(0x0D, 0x01)) updateItemState('net', 1); // 0x34D
    if (newbit(0x0E, 0x01)) updateItemState('book', 1); // 0x34E
    
    // Bottles 0x35C-0x35F
    let bottleCount = 0;
    for (let i = 0x1C; i <= 0x1F; i++) {
        if (data[i] > 0) bottleCount++;
    }
    updateItemState('bottle', bottleCount);
    
    if (newbit(0x10, 0x01)) updateItemState('somaria', 1); // 0x350
    if (newbit(0x11, 0x01)) updateItemState('byrna', 1); // 0x351
    if (newbit(0x12, 0x01)) updateItemState('cape', 1); // 0x352
    if (newbit(0x13, 0x02)) updateItemState('mirror', 1); // 0x353
    
    if (changed(0x14)) updateItemState('gloves', data[0x14]); // 0x354
    if (newbit(0x15, 0x01)) updateItemState('boots', 1); // 0x355
    if (newbit(0x16, 0x01)) updateItemState('flippers', 1); // 0x356
    if (newbit(0x17, 0x01)) updateItemState('moonpearl', 1); // 0x357
    if (changed(0x19)) updateItemState('sword', data[0x19] === 0xFF ? 0 : data[0x19]); // 0x359
    if (changed(0x1A)) updateItemState('shield', data[0x1A]); // 0x35A
    if (changed(0x1B)) updateItemState('tunic', data[0x1B]); // 0x35B
    if (changed(0x3B)) updateItemState('halfmagic', data[0x3B] > 0 ? 1 : 0); // 0x37B
    
    // Agahnim tracking (0x3C5 - offset 0x85 from 0x340)
    if (changed(0x85)) {
        const agaValue = data[0x85];
        if (agaValue >= 3) {
            updateItemState('agahnim', 1); // Defeated
        } else {
            updateItemState('agahnim', 0); // Alive
        }
    }
    
    // Small key tracking for dungeons (0x4E0-0x4ED range)
    for (const [key, dungeon] of Object.entries(dungeons)) {
        if (dungeon.smallKeyAddr) {
            const keyOffset = dungeon.smallKeyAddr - 0x340;
            if (keyOffset >= 0 && keyOffset < data.length && changed(keyOffset)) {
                // Cap key count at maxSmallKeys (hard limit for dungeons like ToH and DP with only 1 key)
                const rawKeyCount = data[keyOffset];
                const keyCount = (dungeon.maxSmallKeys > 0) ? Math.min(rawKeyCount, dungeon.maxSmallKeys) : rawKeyCount;
                if (keyCount !== dungeon.smallKeyCount) {
                    dungeons[key].smallKeyCount = keyCount;
                    // Track the high-water mark so used keys don't reduce the chest subtraction
                    if (keyCount > (dungeons[key].smallKeyMax || 0)) {
                        dungeons[key].smallKeyMax = keyCount;
                    }
                    updateDungeonCountDisplay(key);
                }
            }
        }
    }
    
    // Big key, Compass, and Map tracking (0x364-0x369)
    // Check bytes 0x24-0x29 (offsets from 0x340)
    if (changed(0x24) || changed(0x25) || changed(0x26) || changed(0x27) || changed(0x28) || changed(0x29)) {
        for (const [key, dungeon] of Object.entries(dungeons)) {
            const slot = document.querySelector(`[data-dungeon-key="${key}"]`);
            if (!slot) continue;
            
            // Big key tracking
            const bigkeyOffset = dungeon.bigkeyAddr - 0x340;
            if (bigkeyOffset >= 0 && bigkeyOffset < data.length) {
                const bigkeyByte = data[bigkeyOffset];
                const hasBigKey = (bigkeyByte & dungeon.bigkeyMask) !== 0;
                
                if (hasBigKey && dungeons[key].bigkeyState === 0) {
                    dungeons[key].bigkeyState = 1;
                    const bigkeyImg = slot.querySelector('.bigkey-img');
                    if (bigkeyImg) {
                        bigkeyImg.src = `${BASE_URL}/bigkey1.png`;
                    }
                }
            }
            
            // Compass tracking
            const compassOffset = dungeon.compassAddr - 0x340;
            if (compassOffset >= 0 && compassOffset < data.length) {
                const compassByte = data[compassOffset];
                const hasCompass = (compassByte & dungeon.compassMask) !== 0;
                
                if (hasCompass && dungeons[key].compassState === 0) {
                    dungeons[key].compassState = 1;
                    const compassImg = slot.querySelector('.compass-img');
                    if (compassImg) {
                        compassImg.src = `${BASE_URL}/compass1.png`;
                    }
                }
            }
            
            // Map tracking
            const mapOffset = dungeon.mapAddr - 0x340;
            if (mapOffset >= 0 && mapOffset < data.length) {
                const mapByte = data[mapOffset];
                const hasMap = (mapByte & dungeon.mapMask) !== 0;
                
                if (hasMap && dungeons[key].mapState === 0) {
                    dungeons[key].mapState = 1;
                    const mapImg = slot.querySelector('.map-img');
                    if (mapImg) {
                        mapImg.src = `${BASE_URL}/map1.png`;
                    }
                }
            }
        }
    }
    
    // Store current data for next comparison
    previousSRAM = new Uint8Array(data);

    // Broadcast item states to map window via BroadcastChannel
    if (window._itemsBc) {
        var snap = {};
        var copyKeys = ['bow','boomerang','hookshot','bomb','mushroom','powder','firerod','icerod',
                        'bombos','ether','quake','lamp','hammer','shovel','flute','net','book',
                        'bottle','somaria','byrna','cape','mirror','boots','gloves','flippers',
                        'moonpearl','sword','shield','tunic','agahnim','halfmagic'];
        copyKeys.forEach(function(k) {
            if (items[k]) snap[k] = items[k].currentState;
        });
        // Crystal count from trackerItems if available, else from items
        snap.crystals = (window.trackerItems && window.trackerItems.crystals) || 0;
        snap.mmMedallion = (window.trackerItems && window.trackerItems.mmMedallion) || 0;
        snap.trMedallion = (window.trackerItems && window.trackerItems.trMedallion) || 0;

        // Count prizes from dungeon prizeStates for check logic
        // prizeState: 0=crystal, 1=redcrystal, 2=pendant(non-green), 3=greenpendant
        var crystalCount = 0, redCrystalCount = 0, pendantCount = 0, greenPendantCount = 0;
        Object.values(dungeons).forEach(function(d) {
            if (d.prizeState === 0) crystalCount++;
            else if (d.prizeState === 1) { crystalCount++; redCrystalCount++; }
            else if (d.prizeState === 2) pendantCount++;
            else if (d.prizeState === 3) { pendantCount++; greenPendantCount++; }
        });
        snap.redCrystal = redCrystalCount;
        snap.pendants   = pendantCount;
        snap.greenPendant = greenPendantCount;
        window._itemsBc.postMessage({ type: 'items', data: snap });

        // Broadcast dungeon completion state (boss beaten + all items collected)
        var dungeonSnap = {};
        Object.keys(dungeons).forEach(function(key) {
            var d = dungeons[key];
            var slot = document.querySelector('[data-dungeon-key="' + key + '"]');
            var prizeCollected = false;
            if (slot) {
                var prizeImg = slot.querySelector('.prize-img');
                prizeCollected = prizeImg && prizeImg.src.includes('1.png');
            }
            dungeonSnap[key] = {
                allItems: d.itemCount >= d.maxItems,
                prizeCollected: prizeCollected
            };
        });
        window._itemsBc.postMessage({ type: 'dungeonComplete', data: dungeonSnap });
    }
}

function updateItemState(itemKey, state) {
    const item = items[itemKey];
    if (!item || item.isGoMode) return;
    
    // Ensure state is within valid range
    state = Math.min(state, item.states.length - 1);
    item.currentState = state;
    
    const slot = document.querySelector(`[data-item-key="${itemKey}"]`);
    if (slot) {
        const img = slot.querySelector('img');
        const newState = item.states[item.currentState];
        img.src = newState.img;
        img.alt = newState.name;
        slot.dataset.itemName = newState.name;
    }
}

function manualReconnect() {
    const btn = document.querySelector('.reconnect-btn');
    if (btn) {
        btn.classList.add('reconnecting');
        btn.disabled = true;
    }

    // Clear auto-reconnect timer so we take full control
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }

    // Stop SRAM polling
    if (readTimer) {
        clearInterval(readTimer);
        readTimer = null;
    }

    // Close existing socket cleanly
    if (ws) {
        ws.onclose = null; // Prevent the onclose handler from starting auto-reconnect
        ws.onerror = null;
        ws.close();
        ws = null;
    }

    deviceAttached = false;
    previousSRAM = null;
    updateConnectionStatus('Connecting');
    connectWebSocket();

    // Re-enable button after a moment regardless of outcome
    setTimeout(() => {
        if (btn) {
            btn.classList.remove('reconnecting');
            btn.disabled = false;
        }
    }, 3000);
}

function ensureReconnectButton() {
    if (document.querySelector('.reconnect-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'reconnect-btn';
    btn.textContent = '↻';
    btn.title = 'Reconnect to QUsb2Snes';
    btn.addEventListener('click', manualReconnect);
    document.body.appendChild(btn);
}

function updateConnectionStatus(status) {
    ensureReconnectButton();

    let statusDiv = document.querySelector('.connection-status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.className = 'connection-status';
        document.body.appendChild(statusDiv);
    }
    
    const statusText = {
        'Connected': '● Connected',
        'Connecting': '○ Connecting',
        'Disconnected': '○ Disconnected',
        'Error': '○ Error',
        'No device found': '○ No device'
    };
    
    const statusColor = {
        'Connected': '#2ecc71',
        'Connecting': '#f39c12',
        'Disconnected': '#e74c3c',
        'Error': '#e74c3c',
        'No device found': '#e67e22'
    };
    
    statusDiv.textContent = statusText[status] || status;
    statusDiv.style.color = statusColor[status] || '#95a5a6';
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        createTracker();
        // WebSocket is managed by tracker.js / itemtracker.html
    } catch (error) {
        console.error('Error initializing tracker:', error);
    }
});
