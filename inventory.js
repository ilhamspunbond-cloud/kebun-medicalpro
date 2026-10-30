// ==========================================
// INVENTORY.JS - Warehouse & Asset Logic
// ==========================================

const InventoryManager = {
    addItem(name, category, quantity, unit) {
        const item = {
            id: 'INV-' + Date.now(),
            name,
            category, // cth: 'Baja', 'Peralatan', 'Produk Proses'
            quantity: parseFloat(quantity),
            unit,
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        AppState.data.inventory.push(item);
        saveAppData();
        this.renderInventoryGrid();
    },

    updateQuantity(id, changeAmount) {
        const item = AppState.data.inventory.find(i => i.id === id);
        if (item) {
            item.quantity += parseFloat(changeAmount);
            if (item.quantity < 0) item.quantity = 0;
            item.lastUpdated = new Date().toISOString().split('T')[0];
            saveAppData();
            this.renderInventoryGrid();
        }
    },

    renderInventoryGrid() {
        const container = document.getElementById('inventory-grid-container');
        if (!container) return;

        container.innerHTML = '';
        AppState.data.inventory.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 p-4 rounded-lg border border-gray-700 shadow';
            card.innerHTML = `
                <h4 class="font-bold text-lg text-emerald-400">${item.name}</h4>
                <p class="text-sm text-gray-400">Kategori: ${item.category}</p>
                <p class="text-xl font-semibold my-2">${item.quantity} ${item.unit}</p>
                <div class="flex gap-2 mt-3">
                    <button onclick="InventoryManager.updateQuantity('${item.id}', 1)" class="bg-green-600 px-3 py-1 rounded text-white text-sm">+ Tambah</button>
                    <button onclick="InventoryManager.updateQuantity('${item.id}', -1)" class="bg-yellow-600 px-3 py-1 rounded text-white text-sm">- Kurang</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
};
