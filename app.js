document.addEventListener('DOMContentLoaded', async () => {
    console.log("Memuatkan komponen modular HTML...");

    // Function to load external HTML partials
    const loadComponent = async (containerId, filePath) => {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const html = await response.text();
                document.getElementById(containerId).innerHTML = html;
            } else {
                console.error(`Gagal memuatkan ${filePath}`);
            }
        } catch (error) {
            console.error(`Ralat semasa mengambil ${filePath}:`, error);
        }
    };

    // Load Sidebar and Topbar components
    await loadComponent('sidebarContainer', 'components/sidebar.html');
    await loadComponent('topbarContainer', 'components/topbar.html');

    // Setup navigation and interactions after components are loaded
    setTimeout(() => {
        setupNavigation();
    }, 100);
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentBody = document.getElementById('contentBody');
    
    const renderSection = (target) => {
        switch(target) {
            case 'dashboard':
                contentBody.innerHTML = `
                    <h2>Dashboard Utama</h2>
                    <div class="grid-4" style="margin-top: 20px;">
                        <div class="card"><h3>Jumlah Pokok</h3><p style="font-size:24px; font-weight:700; color:var(--primary);">1,250 Pokok</p></div>
                        <div class="card"><h3>Stok Teh Belimbing</h3><p style="font-size:24px; font-weight:700; color:var(--accent);">480 Kotak</p></div>
                        <div class="card"><h3>Stok Spunbond</h3><p style="font-size:24px; font-weight:700; color:#3B82F6;">3,200 Helai</p></div>
                        <div class="card"><h3>Cuaca Machap</h3><p style="font-size:24px; font-weight:700; color:#F59E0B;">29°C (Cerah)</p></div>
                    </div>
                `;
                break;
            case 'weather':
                contentBody.innerHTML = `<h2>Cuaca Semasa - Simpang Renggam, Johor (Machap)</h2><div class="card" style="margin-top:20px;"><p>Suhu: <strong>29°C</strong> | Kelembapan: <strong>78%</strong> | Angin: <strong>12 km/j</strong></p><p style="margin-top:10px; color:var(--primary);">Cadangan AI: Sesuai untuk semburan bio baja pada sebelah petang.</p></div>`;
                break;
            case 'tasks':
                contentBody.innerHTML = `<h2>Tugas Harian & Rutin Pekerja</h2><div class="card" style="margin-top:20px;"><p>Tiada tugas tertangguh hari ini. Semua jadual pembajaan berjalan lancar.</p></div>`;
                break;
            case 'stock':
                contentBody.innerHTML = `<h2>Stok & Bekalan Ladang</h2><div class="card" style="margin-top:20px;"><p>Senarai inventori hasil tuaian belimbing buluh dan bahan mentah.</p></div>`;
                break;
            case 'fertilizer':
                contentBody.innerHTML = `<h2>Stok Bio Baja & Nutrisi Organik</h2><div class="card" style="margin-top:20px;"><p>Baki Baja Kompos: 15 tong | Baja Foliar: 8 liter.</p></div>`;
                break;
            case 'assets':
                contentBody.innerHTML = `<h2>Aset & Peralatan Ladang</h2><div class="card" style="margin-top:20px;"><p>Status mesin rumput 2-stroke dan pam air dalam keadaan baik.</p></div>`;
                break;
            case 'finance':
                contentBody.innerHTML = `<h2>Kewangan & Invois Rasmi</h2><div class="card" style="margin-top:20px;"><p>Janaan invois automatik untuk pelanggan Medical Pro & ILHAM SPUNBOND.</p></div>`;
                break;
            case 'po':
                contentBody.innerHTML = `<h2>PO Masuk (Purchase Order)</h2><div class="card" style="margin-top:20px;"><p>Senarai pesanan belian pelanggan aktif.</p></div>`;
                break;
            case 'ai-assistant':
                contentBody.innerHTML = `<h2>Asisten AI Pintar Ladang</h2><div class="card" style="margin-top:20px;"><p>Tanya apa sahaja berkaitan agronomi belimbing buluh atau pengurusan stok.</p></div>`;
                break;
            case 'settings':
                contentBody.innerHTML = `<h2>Tetapan & Profil Pengguna</h2><div class="card" style="margin-top:20px;"><p>Nama Pentadbir: <strong>Abdul Rojak</strong> | Lokasi: <strong>Machap, Malaysia & Rajeg, Tangerang</strong></p></div>`;
                break;
            default:
                contentBody.innerHTML = `<h2>Dashboard</h2>`;
        }
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            renderSection(item.getAttribute('data-target'));
        });
    });
    
    // Initial load
    renderSection('dashboard');
    
    // Sidebar toggle for mobile (using event delegation or checking elements)
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.toggle('active');
        });
    }
}