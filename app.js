// ==========================================
// APP.JS - Core State & Navigation Logic
// ==========================================

const AppState = {
    currentTab: 'home',
    user: {
        name: 'Abdul Rojak',
        role: 'Estate Manager & Technician',
        location: 'Machap, Malaysia / Rajeg, Tangerang'
    },
    data: {
        tasks: [],
        inventory: [],
        expenses: [],
        sales: [],
        chatMessages: []
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log("Aplikasi Ladang Belimbing Buluh dimulakan...");
    loadStoredData();
    setupEventListeners();
    switchTab('home');
    initRealTimeClock();
}

function switchTab(tabId) {
    AppState.currentTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
    });
    const target = document.getElementById(`tab-${tabId}`);
    if (target) {
        target.classList.remove('hidden');
    }
    
    // Trigger specific tab initializers if needed
    if (tabId === 'ai') initAIAssistantUI();
    if (tabId === 'chat') scrollToBottomChat();
}

function setupEventListeners() {
    // Global event delegation for tabs
    document.querySelectorAll('[data-target-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.getAttribute('data-target-tab');
            switchTab(tab);
        });
    });
}

function loadStoredData() {
    const saved = localStorage.getItem('medical_pro_app_data');
    if (saved) {
        try {
            AppState.data = JSON.parse(saved);
        } catch (e) {
            console.error("Gagal memuat data tersimpan:", e);
        }
    }
}

function saveAppData() {
    localStorage.setItem('medical_pro_app_data', JSON.stringify(AppState.data));
}

function initRealTimeClock() {
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ms-MY');
        const clockEl = document.getElementById('realtime-clock');
        if (clockEl) clockEl.innerText = timeString;
    }, 1000);
}
