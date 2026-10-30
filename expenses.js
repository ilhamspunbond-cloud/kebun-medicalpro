// ==========================================
// EXPENSES.JS - Financial & Expense Logic
// ==========================================

const ExpenseManager = {
    addExpense(category, amount, description) {
        const newExpense = {
            id: 'EXP-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            category,
            amount: parseFloat(amount),
            description
        };

        AppState.data.expenses.push(newExpense);
        saveAppData();
        this.renderExpensesTable();
        this.updateExpenseSummary();
    },

    deleteExpense(id) {
        AppState.data.expenses = AppState.data.expenses.filter(item => item.id !== id);
        saveAppData();
        this.renderExpensesTable();
        this.updateExpenseSummary();
    },

    calculateTotal() {
        return AppState.data.expenses.reduce((sum, item) => sum + item.amount, 0);
    },

    renderExpensesTable() {
        const tbody = document.getElementById('expenses-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        AppState.data.expenses.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="p-2 border-b border-gray-700">${item.date}</td>
                <td class="p-2 border-b border-gray-700">${item.category}</td>
                <td class="p-2 border-b border-gray-700">${item.description}</td>
                <td class="p-2 border-b border-gray-700">RM ${item.amount.toFixed(2)}</td>
                <td class="p-2 border-b border-gray-700">
                    <button onclick="ExpenseManager.deleteExpense('${item.id}')" class="text-red-400 hover:text-red-300">Padam</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    updateExpenseSummary() {
        const totalEl = document.getElementById('total-expenses-display');
        if (totalEl) {
            totalEl.innerText = `RM ${this.calculateTotal().toFixed(2)}`;
        }
    }
};
