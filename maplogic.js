/**
 * maplogic.js — check locations and dungeon availability logic
 * Colors: 'green'=available, 'red'=unavailable, 'orange'=visible only, 'yellow'=possible
 */

'use strict';

// ── SRAM check flags (from autot.js updatechest calls) ──────────────────────
// Single: [offset, mask]   Group: [[offset,mask],...]  All must be set to clear
window.SRAM_FLAGS = {
  0:  [0x226,0x10],
  1:  [[0x2bb,0x40],[0x216,0x10]],
  2:  [0x208,0x10],
  3:  [0x1fc,0x10],
  4:  [0x218,0x10],
  5:  [0x206,0x10],
  6:  [0x210,0x10],
  7:  [0x20c,0x10],
  8:  [0x238,0x10],
  9:  [0x214,0x10],
  10: [[0x21a,0x10],[0x21a,0x20]],
  11: [[0x1f0,0x10],[0x1f0,0x20]],
  12: [[0x20a,0x10],[0x20a,0x20],[0x20a,0x40]],
  13: [0x22e,0x10],
  14: [[0x05e,0x10],[0x05e,0x20],[0x05e,0x40],[0x05e,0x80],[0x05f,0x01]],
  15: [[0x23a,0x10],[0x23a,0x20],[0x23a,0x40],[0x23a,0x80],[0x23b,0x01]],
  16: [[0x23c,0x10],[0x23c,0x20],[0x23c,0x40],[0x23c,0x80],[0x23d,0x04]],
  17: [[0x1de,0x10],[0x1de,0x20],[0x1de,0x40],[0x1de,0x80],[0x1df,0x01],[0x1fe,0x10],[0x1fe,0x20]],
  18: [0x248,0x10],
  19: [[0x246,0x10],[0x246,0x20],[0x246,0x40],[0x246,0x80],[0x247,0x04]],
  20: [0x240,0x10],
  21: [0x078,0x80],
  22: [[0x078,0x10],[0x078,0x20],[0x078,0x40]],
  23: [0x280,0x10],
  24: [0x285,0x10],
  25: [0x28a,0x10],
  26: [0x28a,0x08],
  27: [0x290,0x10],
  28: [0x290,0x08],
  29: [0x291,0x10],
  30: [0x292,0x10],
  31: [0x293,0x10],
  32: [0x293,0x08],
  33: [0x295,0x10],
  34: [0x295,0x08],
  35: [0x298,0x10],
  36: [0x298,0x08],
  37: [0x29a,0x10],
  38: [0x29a,0x08],
  39: [0x29b,0x10],
  40: [0x29d,0x10],
  41: [0x29e,0x10],
  42: [0x2aa,0x10],
  43: [0x2aa,0x08],
  44: [0x2ab,0x10],
  45: [0x2ae,0x14],
  46: [0x2ae,0x08],
  47: [0x2b2,0x10],
  48: [0x2b2,0x08],
  49: [0x2c2,0x10],
  50: [0x2d1,0x18],
  51: [0x2d4,0x10],
  52: [0x2d4,0x08],
  53: [0x2d4,0x04],
  54: [0x2d5,0x10],
  55: [0x2d5,0x08],
  56: [0x2d6,0x10],
  57: [0x2db,0x10],
  58: [0x2de,0x10],
  59: [0x2ee,0x10],
  60: [0x2ee,0x08],
  61: [0x2ee,0x04],
  62: [0x2f4,0x10],
  63: [0x241,0x02],
  64: [0x20d,0x04],
  65: [0x3c9,0x02],
  66: [0x410,0x10],
  67: [0x410,0x08],
  68: [0x410,0x04],
  69: [0x3c9,0x10],
  70: [0x3c9,0x01],
  71: [0x411,0x01],
  72: [0x411,0x02],
  73: [0x410,0x20],
  74: [0x410,0x02],
  75: [0x410,0x01],
  76: [0x411,0x20],
  77: [0x1c3,0x02],
  78: [0x1c5,0x02],
  79: [0x1d5,0x04],
  80: [0x237,0x04],
  81: [0x237,0x02],
  82: [0x24d,0x02],
  83: [0x24f,0x04],
  84: [0x410,0x80],
  85: [0x411,0x10],
  86: [0x283,0x40],
  87: [0x285,0x40],
  88: [0x2a8,0x40],
  89: [0x2b0,0x40],
  90: [0x2b5,0x40],
  91: [0x2ca,0x40],
  92: [0x2db,0x40],
  93: [0x2e8,0x40],
  94: [0x301,0x40],
  95: [0x2aa,0x40],
  96: [[0x022,0x10],[0x022,0x20],[0x022,0x40]],
  97: [[0x3c6,0x01],[0x0aa,0x10]],
  98: [[0x0e4,0x10],[0x0e2,0x10],[0x100,0x10]],
  99: [0x024,0x10],
  100:[0x411,0x80],
  101:[0x411,0x04],
  102:[[0x22c,0x10],[0x22c,0x20]],
  103:[0x300,0x40],
  104:[0x064,0x10],
  105:[[0x228,0x10],[0x228,0x20]],
  106:[0x1c0,0x10],
  107:[0x1a0,0x10],
};

function sramCleared(data, flag) {
  if (!data || !data.length) return false;
  if (Array.isArray(flag[0])) {
    // Group flag: ALL sub-flags must be set
    for (var i = 0; i < flag.length; i++) {
      var off = flag[i][0], mask = flag[i][1];
      if (off >= data.length) return false;
      if ((data[off] & mask) === 0) return false;
    }
    return true;
  }
  // Single flag
  var off = flag[0], mask = flag[1];
  if (off >= data.length) return false;
  return (data[off] & mask) !== 0;
}
window.sramCleared = sramCleared;

// ── Dungeon map positions [left%, top%] ──────────────────────────────────────
// LW dungeons on map_lw, DW dungeons on map_dw
window.DUNGEON_POSITIONS = {
  ep:  { world: 'lw', left: 95.0, top: 38.8, label: 'EP'  },
  dp:  { world: 'lw', left:  7.6, top: 78.4, label: 'DP'  },
  toh: { world: 'lw', left: 57.0, top:  3.0, label: 'ToH' },
  ct:  { world: 'lw', left: 50.0, top: 52.6, label: 'AT'  },
  pod: { world: 'dw', left: 96.0, top: 40.0, label: 'POD' },
  sp:  { world: 'dw', left: 47.0, top: 91.0, label: 'SP'  },
  sw:  { world: 'dw', left:  8.0, top:  7.2, label: 'SW'  },
  tt:  { world: 'dw', left: 12.8, top: 47.9, label: 'TT'  },
  ip:  { world: 'dw', left: 79.6, top: 85.8, label: 'IP'  },
  mm:  { world: 'dw', left:  9.5, top: 82.5, label: 'MM'  },
  tr:  { world: 'dw', left: 92.8, top:  7.2, label: 'TR'  },
  gt:  { world: 'dw', left: 57.0, top:  2.0, label: 'GT'  },
};

// ── Dungeon logic ─────────────────────────────────────────────────────────────
// Returns 'green','yellow','orange','red'
function dungeonColor(key) {
  var it = window.trackerItems;
  var hasMedallion = function(dungeonKey) {
    if (it.mmMedallion > 0 && dungeonKey === 'mm') {
      var med = it.mmMedallion; // 1=bombos,2=ether,3=quake
      return (med === 1 && it.bombos) || (med === 2 && it.ether) || (med === 3 && it.quake);
    }
    if (it.trMedallion > 0 && dungeonKey === 'tr') {
      var med = it.trMedallion;
      return (med === 1 && it.bombos) || (med === 2 && it.ether) || (med === 3 && it.quake);
    }
    // If unset, any medallion works as possibility
    return it.bombos || it.ether || it.quake;
  };

  switch (key) {
    case 'ep':
      // Yellow until lamp found; green with lamp
      return it.lamp ? 'green' : 'yellow';

    case 'dp':
      // Red until (Book or (Mirror + Flute + TitansMitt))
      // Yellow if those but missing Boots; green with boots
      var hasAccess = it.book || (it.mirror && it.flute && it.gloves >= 2);
      if (!hasAccess) return 'red';
      return it.boots ? 'green' : 'yellow';

    case 'toh':
      // Red until (PowerGloves or Flute+Mirror or PowerGloves or Flute) AND (Hammer+Hookshot for alt)
      // Simplified: need gloves>=1 OR (flute AND mirror) OR (flute AND hammer AND hookshot)
      var hasAccess = (it.gloves >= 1) || (it.flute && it.mirror) || (it.flute && it.hammer && it.hookshot);
      if (!hasAccess) return 'red';
      // Yellow if missing lamp or firerod
      return (it.lamp || it.firerod) ? 'green' : 'yellow';

    case 'hc':
      // Hyrule Castle - always accessible in standard
      return it.lamp ? 'green' : 'yellow';

    case 'ct':
      // Castle Tower - need agahnim fight, sword required
      return (it.sword >= 1) ? 'green' : 'red';

    case 'pod':
      // Red until moonpearl + (hammer+bow OR bow+hammer+hookshot OR flippers)
      if (!it.moonpearl) return 'red';
      var canEnter = (it.hammer && it.bow) || (it.bow && it.hammer && it.hookshot) || it.flippers;
      if (!canEnter) return 'red';
      return (it.lamp || it.firerod) ? 'green' : 'yellow';

    case 'sp':
      // Red until moonpearl + mirror + flippers
      if (!it.moonpearl || !it.mirror || !it.flippers) return 'red';
      return it.hookshot ? 'green' : 'yellow';

    case 'sw':
      // Red until moonpearl + gloves>=1 + hammer
      if (!it.moonpearl || !(it.gloves >= 1) || !it.hammer) return 'red';
      return it.firerod ? 'green' : 'yellow';

    case 'tt':
      // Red until moonpearl
      if (!it.moonpearl) return 'red';
      return it.hammer ? 'green' : 'yellow';

    case 'ip':
      // Red until moonpearl + flippers + titansMitt + (bombos or firerod)
      if (!it.moonpearl || !it.flippers || it.gloves < 2) return 'red';
      if (!it.bombos && !it.firerod) return 'red';
      return 'green';

    case 'mm':
      // Red until moonpearl + flute + medallion + (hookshot or boots)
      if (!it.moonpearl || !it.flute) return 'red';
      if (!hasMedallion('mm')) return 'red';
      if (!it.hookshot && !it.boots) return 'red';
      return (it.somaria && it.lamp) ? 'green' : 'yellow';

    case 'tr':
      // Red until moonpearl + medallion + hammer + titansMitt + somaria
      if (!it.moonpearl) return 'red';
      if (!hasMedallion('tr')) return 'red';
      if (!it.hammer || it.gloves < 2 || !it.somaria) return 'red';
      return (it.firerod && it.lamp) ? 'green' : 'yellow';

    case 'gt':
      // Red until 7 crystals
      return it.crystals >= 7 ? 'green' : 'red';

    default:
      return 'green';
  }
}
window.dungeonColor = dungeonColor;
