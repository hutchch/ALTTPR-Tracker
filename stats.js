// QUsb2Snes Connection and Memory Reading Module
class QUsb2SnesConnection {
    constructor() {
        this.ws = null;
        this.memoryCheckInterval = null;
        this.reconnectTimer = null;
        this.statusCallback = null;
        this.memoryCallback = null;
        this.isActive = false;
        this.host = 'ws://localhost:23074';
        this.deviceName = '';
        this.timeoutDelay = 5000;
        this.refreshInterval = 500;
        this.selectedStats = [];
        
        // Memory addresses for qusb2snes (using WRAM format)
        const WRAM_START = 0xF50000;
        const SRAM_START = 0xF5F000;
        
        this.ALL_ADDRESSES = {
            bonks: SRAM_START + 0x420,
            checks: SRAM_START + 0x423,
            saveandquit: SRAM_START + 0x42D,
            heartpieces: SRAM_START + 0x36B,            // Heart Pieces (out of 4 for next container)
            screentransitions: SRAM_START + 0x43C,      // NEW: Screen Transitions (2 bytes)
            screentransitions_hi: SRAM_START + 0x43D,   // NEW: High byte for screen transitions
            deaths: SRAM_START + 0x449,
            damage: SRAM_START + 0x46A,                 // NEW: Damage Counter (2 bytes)
            damage_hi: SRAM_START + 0x46B,              // NEW: High byte for damage
            flutes: SRAM_START + 0x44B,
            magic: SRAM_START + 0x46C,                  // NEW: Magic Counter (2 bytes)
            magic_hi: SRAM_START + 0x46D,               // NEW: High byte for magic
            revivals: SRAM_START + 0x453,
            dungeonmirrors: SRAM_START + 0x43B,
            overworldmirrors: SRAM_START + 0x43A,
            timer: WRAM_START + 0x00,
            gamemode: WRAM_START + 0x10
        };
        
        this.ADDRESSES = {};
        this.currentValues = {};
        this.pendingReads = new Map();
        this.wordValues = {}; // Store 16-bit values
    }

    setStatusCallback(callback) {
        this.statusCallback = callback;
    }

    setMemoryCallback(callback) {
        this.memoryCallback = callback;
    }

    setSelectedStats(stats) {
        this.selectedStats = stats;
        // Rebuild ADDRESSES based on selected stats
        const WRAM_START_INIT = 0xF50000;
        const SRAM_START_INIT = 0xF5F000;
        
        this.ADDRESSES = { 
            timer: WRAM_START_INIT + 0x00,
            gamemode: WRAM_START_INIT + 0x10
        };
        
        this.selectedStats.forEach(stat => {
            if (this.ALL_ADDRESSES[stat]) {
                this.ADDRESSES[stat] = this.ALL_ADDRESSES[stat];
                
                // Add high byte for 16-bit values
                if (stat === 'screentransitions' || stat === 'damage' || stat === 'magic') {
                    const hiByteName = stat + '_hi';
                    if (this.ALL_ADDRESSES[hiByteName]) {
                        this.ADDRESSES[hiByteName] = this.ALL_ADDRESSES[hiByteName];
                    }
                }
            }
        });
    }

    setHost(host, port) {
        this.host = `ws://${host}:${port}`;
    }

    connect() {
        if (this.ws !== null) {
            return;
        }
        
        try {
            this.ws = new WebSocket(this.host);
            this.ws.binaryType = 'arraybuffer';
        } catch (e) {
            console.error('Failed to create WebSocket:', e);
            if (this.statusCallback) this.statusCallback('error');
            return;
        }

        this.ws.onopen = () => {
            if (this.statusCallback) this.statusCallback('connecting');
            
            // Clear any pending reconnect timer
            if (this.reconnectTimer !== null) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
            
            // Request device list
            this.ws.send(JSON.stringify({
                Opcode: "DeviceList",
                Space: "SNES"
            }));
            
            // Set a new timeout for device list response
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                this.cleanup();
                if (this.isActive) {
                    this.connect();
                }
            }, this.timeoutDelay);
        };

        this.ws.onmessage = (event) => {
            this.handleDeviceList(event);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (this.statusCallback) this.statusCallback('error');
        };

        this.ws.onclose = (event) => {
            this.cleanup();
            if (this.statusCallback) this.statusCallback('disconnected');
            
            // Auto-reconnect on close
            if (this.isActive) {
                setTimeout(() => {
                    if (this.isActive) {
                        this.connect();
                    }
                }, 2000);
            }
        };
    }

    handleDeviceList(event) {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            console.error('Failed to parse device list:', e);
            return;
        }
        
        if (!data.Results || data.Results.length < 1) {
            this.cleanup();
            if (this.statusCallback) this.statusCallback('no_device');
            return;
        }

        this.deviceName = data.Results[0];

        // Attach to the device
        this.ws.send(JSON.stringify({
            Opcode: "Attach",
            Space: "SNES",
            Operands: [this.deviceName]
        }));

        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.statusCallback) this.statusCallback('connected');

        // Switch to memory reading mode
        this.ws.onmessage = (event) => {
            this.handleMemoryData(event);
        };

        // Wait a bit after attach before starting memory reads
        setTimeout(() => {
            this.startReading();
        }, 500);
    }

    handleMemoryData(event) {
        // Data comes back as binary ArrayBuffer
        const bytes = new Uint8Array(event.data);
        
        if (bytes.length > 0) {
            const value = bytes[0];
            
            // Get the next pending read
            if (this.pendingReads.size > 0) {
                const [key, address] = this.pendingReads.entries().next().value;
                this.pendingReads.delete(key);
                
                // Check if this is a high byte of a 16-bit value
                if (key.endsWith('_hi')) {
                    const baseName = key.replace('_hi', '');
                    if (!this.wordValues[baseName]) {
                        this.wordValues[baseName] = { low: 0, high: 0 };
                    }
                    this.wordValues[baseName].high = value;
                    
                    // Combine into 16-bit value (little-endian)
                    const combinedValue = this.wordValues[baseName].low | (this.wordValues[baseName].high << 8);
                    
                    // Call memory callback with combined value
                    if (this.memoryCallback) {
                        this.memoryCallback(baseName, combinedValue);
                    }
                } else if (key === 'screentransitions' || key === 'damage' || key === 'magic') {
                    // Store low byte
                    if (!this.wordValues[key]) {
                        this.wordValues[key] = { low: 0, high: 0 };
                    }
                    this.wordValues[key].low = value;
                    // Don't callback yet, wait for high byte
                } else {
                    // Regular 8-bit value
                    if (this.memoryCallback) {
                        this.memoryCallback(key, value);
                    }
                }
            }
        }
    }

    startReading() {
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
        }

        this.memoryCheckInterval = setInterval(() => {
            this.readMemoryAddresses();
        }, this.refreshInterval);
    }

    readMemoryAddresses() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // Reset reconnect timer on each read (like autot.js does)
            if (this.reconnectTimer !== null) {
                clearTimeout(this.reconnectTimer);
            }
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                this.cleanup();
                this.connect();
            }, this.timeoutDelay);

            // Clear pending reads and queue new ones
            this.pendingReads.clear();

            // Read each address with a small delay between requests
            let delay = 0;
            for (let [key, address] of Object.entries(this.ADDRESSES)) {
                setTimeout(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        const hexAddress = address.toString(16).toUpperCase();
                        this.pendingReads.set(key, address);
                        this.ws.send(JSON.stringify({
                            Opcode: "GetAddress",
                            Space: "SNES",
                            Operands: [hexAddress, "1"]
                        }));
                    }
                }, delay);
                delay += 10; // 10ms delay between each request
            }
        }
    }

    startMonitoring() {
        if (!this.isActive) {
            this.isActive = true;
            this.connect();
        }
    }

    stopMonitoring() {
        this.isActive = false;
        this.disconnect();
    }

    disconnect() {
        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.cleanup();
    }

    cleanup() {
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
            this.memoryCheckInterval = null;
        }

        if (this.ws !== null) {
            this.ws.onopen = () => {};
            this.ws.onclose = () => {};
            this.ws.onmessage = () => {};
            this.ws.onerror = () => {};
            this.ws.close();
            this.ws = null;
        }

        this.currentValues = {};
        this.wordValues = {};
        this.pendingReads.clear();
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}
