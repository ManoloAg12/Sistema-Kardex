// ==========================================
// CONTROLADOR DE DATOS LOCALES (LocalStorage)
// ==========================================

const StorageManager = {
    KEYS: {
        INVENTARIO: 'it_inv_v4',
        SERVIDORES: 'it_srv_v4', // Cambiamos la versión para limpiar el caché anterior
        KARDEX: 'it_kar_v4'
    },

    defaultInventario: [
        { id: "RAM-32G-ECC", desc: "Memoria RAM 32GB ECC DDR4", demandaDiaria: 1, leadTime: 5, safetyStock: 5 },
        { id: "SSD-ENT-2TB", desc: "Disco Sólido Enterprise 2TB", demandaDiaria: 1, leadTime: 4, safetyStock: 3 },
        { id: "HDD-SAS-4TB", desc: "Disco Duro SAS 4TB 10K RPM", demandaDiaria: 1, leadTime: 5, safetyStock: 3 },
        { id: "PSU-1000W-R", desc: "Fuente de Poder Redundante 1000W", demandaDiaria: 1, leadTime: 7, safetyStock: 2 },
        { id: "FAN-SRV-120", desc: "Ventilador de Chasis Servidor 120mm", demandaDiaria: 2, leadTime: 3, safetyStock: 10 },
        { id: "BTY-UPS-12V", desc: "Batería de Reemplazo UPS 12V", demandaDiaria: 1, leadTime: 5, safetyStock: 5 },
        { id: "CBL-DAC-10G", desc: "Cable de Red DAC SFP+ 10Gbps", demandaDiaria: 3, leadTime: 2, safetyStock: 15 },
        { id: "PST-TRM-PRO", desc: "Pasta Térmica Alto Rendimiento 50g", demandaDiaria: 1, leadTime: 2, safetyStock: 5 },
        { id: "NIC-PCIE-4P", desc: "Tarjeta de Red PCIe 4 Puertos Gigabit", demandaDiaria: 1, leadTime: 4, safetyStock: 2 },
        { id: "CTRL-RAID-8", desc: "Controlador RAID 8 Puertos", demandaDiaria: 1, leadTime: 7, safetyStock: 1 }
    ],

    // ¡COLA DE SERVIDORES VACÍA PARA LA PRESENTACIÓN EN VIVO!
    defaultServidores: [],

    // Inventario Inicial
    defaultKardex: {
        "RAM-32G-ECC": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 15, vu: 120.00 }],
        "SSD-ENT-2TB": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 8, vu: 250.00 }],
        "HDD-SAS-4TB": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 12, vu: 180.00 }],
        "PSU-1000W-R": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 10, vu: 300.00 }],
        "FAN-SRV-120": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 20, vu: 25.00 }],
        "BTY-UPS-12V": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 10, vu: 45.00 }],
        "CBL-DAC-10G": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 30, vu: 15.00 }],
        "PST-TRM-PRO": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 15, vu: 12.00 }],
        "NIC-PCIE-4P": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 8, vu: 85.00 }],
        "CTRL-RAID-8": [{ fecha: "2026-03-26", detalle: "Inventario Inicial", tipo: "entrada", cant: 5, vu: 450.00 }]
    },

    init: function() {
        if (!localStorage.getItem(this.KEYS.INVENTARIO)) this.saveInventario(this.defaultInventario);
        if (!localStorage.getItem(this.KEYS.SERVIDORES)) this.saveServidores(this.defaultServidores);
        if (!localStorage.getItem(this.KEYS.KARDEX)) this.saveKardex(this.defaultKardex);
    },

    getInventario: function() { return JSON.parse(localStorage.getItem(this.KEYS.INVENTARIO)) || []; },
    getServidores: function() { return JSON.parse(localStorage.getItem(this.KEYS.SERVIDORES)) || []; },
    getKardex: function() { return JSON.parse(localStorage.getItem(this.KEYS.KARDEX)) || {}; },

    saveInventario: function(data) { localStorage.setItem(this.KEYS.INVENTARIO, JSON.stringify(data)); },
    saveServidores: function(data) { localStorage.setItem(this.KEYS.SERVIDORES, JSON.stringify(data)); },
    saveKardex: function(data) { localStorage.setItem(this.KEYS.KARDEX, JSON.stringify(data)); },

    resetData: function() {
        localStorage.clear();
        this.init();
        location.reload();
    }
};

StorageManager.init();