 <!-- Script JavaScript -->
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyD_LWsMJL2j8IkeDw0O1e6Gp3gvvvixuzk",
            authDomain: "kebun-belimbing-buluh-medical.firebaseapp.com",
            projectId: "kebun-belimbing-buluh-medical",
            storageBucket: "kebun-belimbing-buluh-medical.firebasestorage.app",
            messagingSenderId: "101006363434",
            appId: "1:101006363434:web:ef0f5360e0e47c105f2c53",
            measurementId: "G-5CX6N1K1GD"
        };
        
        let db = null;
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
        } catch(e) {}

        let currentUser = JSON.parse(localStorage.getItem('medicalpro_user_profile')) || null;
        let currentLang = localStorage.getItem('medicalpro_lang') || 'ms';
        let currentCurrency = localStorage.getItem('medicalpro_currency') || 'RM';

        // Fungsi Otomatis Buat Latar Belakang Foto Jadi Transparan
        function removeImageBackground(file, callback) {
            if (!file) { callback(""); return; }
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    if (w > 400) { h *= 400 / w; w = 400; }
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    
                    const imgData = ctx.getImageData(0, 0, w, h);
                    const data = imgData.data;
                    // Ambil warna pixel pojok kiri atas sebagai warna latar belakang (background)
                    const bgR = data[0], bgG = data[1], bgB = data[2];
                    
                    for (let i = 0; i < data.length; i += 4) {
                        let r = data[i], g = data[i+1], b = data[i+2];
                        // Jika warna pixel mirip dengan warna latar belakang pojok, buat transparan (alpha = 0)
                        if (Math.abs(r - bgR) < 45 && Math.abs(g - bgG) < 45 && Math.abs(b - bgB) < 45) {
                            data[i+3] = 0;
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    callback(canvas.toDataURL('image/png'));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        const translations = {
            ms: {
                pageTitle: "Ladang Belimbing Buluh Medicalpro",
                mWelcomeTitle: "Selamat Datang ke Medicalpro",
                mWelcomeSub: "Sila masukkan nama, gelaran & foto profil anda.",
                mLblRealName: "Nama Penuh Anda",
                mLblGender: "Pilihan Gelaran (Untuk Sapaan AI Saja)",
                mBtnSaveUser: "Simpan & Masuk Sistem 🚀",
                lblGardenName: "LADANG BELIMBING BULUH",
                lblSubHeader: "Medicalpro Agro Management - Machap",
                lblPartnership: "🤝 Kerjasama: NIBM & Jimba Sdn Bhd | Jabatan Pertanian (No. MyGAP: 24.0151)",
                btnAdminPanel: "🔐 Panel Pentadbir Utama",
                lblAudioBanner: "🚨 Mod Audio AI & Sembang Suara: Sila klik butang di sebelah untuk mengaktifkan suara sistem.",
                lblAudioBtn: "Aktifkan Audio Sistem",
                lblAiName: "Asisten Ladang AI",
                lblMemActive: "🧠 Memori Global Aktif",
                aiSubtitle: "Asisten mandiri & pintar ladang Medicalpro",
                btnVoiceChat: "🎙️ Cakap AI",
                btnRepeat: "🔊 Ulang",
                btnAiSummary: "📊 Rumusan & Data Sistem",
                btnAiBaja: "🧪 Jadual Pembajaan (2 Minggu)",
                btnAiMem: "🧠 Kosa Kata & Riwayat Global",
                aiPlaceholder: "Tanya AI atau hantar pautan panduan...",
                btnAiSend: "Kirim & Simpan",
                lblWeatherCurrent: "Semasa",
                lblHourlyForecast: "Ramalan Mengikut Jam",
                lblIllustrationTitle: "Ladang Machap",
                lblIllustrationText: "Suasana di ladang.",
                lblPrecip: "Kerpasan",
                lblWind: "Angin",
                lblAiDecision: "🤖 Keputusan AI Berdasarkan Cuaca & Tanah:",
                lblBossPortalTitle: "💬 Perbincangan atau Perintah tentang Ladang Belimbing Buluh Medical Pro",
                lblChatImg: "Gambar",
                bossPlaceholder: "Taip perbincangan atau arahan untuk ke ladang...",
                btnSendOrder: "Kirim Chat",
                lblHistoryTitle: "Ruang Perbincangan & Pesan Chat (Permanen):",
                navTasks: "Tugas Harian",
                navSupply: "Stok & Bekalan",
                navStock: "Bio Baja",
                navAssets: "Aset Ladang",
                navExpenses: "Perbelanjaan",
                navIncome: "Jualan Terus Dari Ladang",
                navOffice: "Produk & Invois Luar Talian",
                navPo: "PO Masuk",
                sectionTaskTitle: "📌 Tugas Harian & Jadual Rutin",
                lblFilterFrom: "Dari:",
                lblFilterTo: "Hingga:",
                optAllMonths: "Semua Bulan (Global)",
                btnPrintTaskPdf: "🖨️ Cetak Rumusan PDF",
                taskTitlePlaceholder: "Nama Pekerjaan",
                taskCatPlaceholder: "Kategori",
                optSelectWorker: "Pilih Pekerja",
                lblUseBioStock: "Guna Stok Bio Baja?",
                optNoStock: "-- Tanpa Stok --",
                lblQtyUsed: "Jumlah Dipakai",
                lblPhotoAttach: "Lampiran Foto (HD Maks 1MB)",
                btnTaskSubmit: "Simpan Laporan Kerja",
                btnCancelTaskEdit: "Batal",
                thTaskPhoto: "Foto HD",
                thTaskTitle: "Tugasan",
                thTaskCat: "Kategori",
                thTaskWorker: "Pekerja",
                thTaskDate: "Tarikh",
                thTaskStock: "Info Stok",
                thTaskStatus: "Status",
                thTaskAction: "Tindakan",
                lblSupplyMgmtTitle: "📦 Pengurusan Stok & Bekalan Ladang",
                lblSupplyMgmtSub: "Catat hasil tuaian (masuk stok gudang) atau cetak Laporan Bekalan Ladang",
                btnPrintSupplyPdf: "🖨️ Cetak Laporan Bekalan PDF",
                supplyFormTitle: "➕ Input Hasil Tuaian Baharu (Masuk Stok)",
                lblHarvestDate: "Tarikh Tuaian",
                lblHarvestItem: "Jenis Hasil Ladang",
                lblHarvestQty: "Jumlah & Unit (Automatik)",
                lblHarvestDesc: "Keterangan / Blok Ladang",
                btnSupplySubmit: "Simpan ke Stok Gudang",
                btnCancelSupplyEdit: "Batal",
                lblStockSummaryTitle: "📊 Rumusan Baki Stok Gudang:",
                lblSupplyHistoryTitle: "📋 Riwayat & Aksi Bekalan:",
                thSupplyDate: "Tarikh",
                thSupplyItem: "Item",
                thSupplyStatus: "Status / Aksi",
                thSupplyQty: "Jumlah",
                thSupplyDesc: "Keterangan",
                thSupplyAction: "Tindakan",
                lblBioBajaTitle: "🧪 Stok Bio Baja & Nutrisi Organik",
                lblAssetTitle: "🚜 Aset & Peralatan Ladang",
                expenseFormTitle: "💰 Perbelanjaan Ladang (Bulanan)",
                btnPrintExpPdf: "🖨️ Cetak Rumusan PDF",
                expTitlePlaceholder: "Keterangan Perbelanjaan",
                lblExpReceipt: "Resit HD",
                btnExpenseSubmit: "Tambah Perbelanjaan",
                btnCancelExpenseEdit: "Batal",
                thExpReceipt: "Resit HD",
                thExpDesc: "Keterangan",
                thExpCost: "Kos",
                thExpDate: "Tarikh",
                thExpAction: "Tindakan",
                lblIncomeTitle: "💵 Jualan Terus Dari Ladang",
                lblIncomeSub: "Urus produk hasil ladang, tambah produk dengan foto, catat jualan dengan data pembeli & cetak invois rasmi",
                btnPrintIncomePdf: "🖨️ Cetak Rumusan Ladang PDF",
                lblStaffLoginTitle: "🔐 Akses Input Jualan Ladang (Staf)",
                staffStatusText: "Status: Belum Log Masuk",
                btnStaffLogin: "Log Masuk",
                lblAddGardenProd: "➕ Tambah / Kemaskini Produk Ladang & Foto",
                btnSaveGardenProd: "Simpan / Kemaskini Produk Ladang",
                lblGardenSalesTitle: "🛒 Catat Transaksi Jualan Ladang Baharu (Pesanan Pelanggan)",
                lblSelectGardenProd: "Pilih Produk Ladang",
                lblGardenQty: "Kuantiti Jualan",
                lblGardenTotalAmt: "Jumlah Harga",
                lblGardenBuyer: "Nama Pembeli (Atas Nama)",
                lblGardenBuyerAddr: "Alamat Pelanggan",
                lblGardenBuyerPhone: "Nombor Telefon",
                lblGardenSalesDate: "Tarikh Jualan",
                lblGardenSalesPhoto: "Bukti Foto / Resit (Pilihan)",
                btnGardenSalesSubmit: "Simpan Jualan & Cetak Invois Rasmi",
                lblGardenHistoryTitle: "📋 Riwayat Jualan Ladang & Pelanggan:",
                thIncDate: "Tarikh",
                thIncProd: "Produk",
                thIncQty: "Kuantiti",
                thIncTotal: "Jumlah",
                thIncBuyer: "Pembeli & Tel",
                thIncAction: "Tindakan",
                lblPoTitle: "📦 Urus Pesanan Belian (PO) Masuk daripada Pelanggan",
                lblPoSub: "Pantau pesanan masuk secara langsung, cetak invois rasmi, dan kemaskini nombor rujukan",
                lblPoLoginTitle: "Akses Dilindungi Kata Laluan Pentadbir",
                lblPoLoginSub: "Sila masukkan kata laluan pentadbir utama untuk melihat dan menguruskan pesanan PO masuk.",
                btnPoLogin: "Buka Akses",
                thPoNo: "No PO",
                thPoDate: "Tarikh",
                thPoCustomer: "Pelanggan",
                thPoItems: "Rincian Pesanan",
                thPoShipping: "Kurier & Bayaran",
                thPoStatus: "Status & Rujukan",
                thPoAction: "Tindakan",
                tdPoWait: "Sila masukkan kata laluan di atas untuk memuat pesanan masuk...",
                lblOfficeTitle: "🏢 Produk & Invois Luar Talian",
                lblOfficeSub: "Urus produk siap jualan dengan foto, khasiat/kandungan, catat pesanan pelanggan & cetak invois rasmi pejabat",
                btnPrintOfficePdf: "🖨️ Cetak Rumusan Pejabat PDF",
                lblOfficeLoginTitle: "🔐 Akses Pentadbir Produk & Invois Luar Talian",
                officeStatusText: "Status: Belum Log Masuk",
                btnOfficeLogin: "Log Masuk",
                officeFormTitleLabel: "➕ Tambah Produk Luar Talian Baharu",
                btnCancelOfficeEdit: "Batal Edit",
                lblProdBenefits: "Khasiat, Manfaat & Kandungan Produk (Dibaca AI Secara Automatik)",
                btnOfficeProdSubmit: "Simpan / Tambah Produk Luar Talian Baharu",
                officeSalesFormTitle: "🛒 Catat Transaksi Jualan Luar Talian Baharu (Pesanan Pelanggan)",
                lblSelectOfficeProd: "Pilih Produk",
                lblOfficeQty: "Kuantiti Jualan",
                lblOfficeTotalAmt: "Jumlah Harga",
                lblOfficeBuyer: "Nama Pembeli (Atas Nama)",
                lblOfficeBuyerAddr: "Alamat Pelanggan",
                lblOfficeBuyerPhone: "Nombor Telefon",
                lblOfficeSalesDate: "Tarikh Jualan",
                lblOfficeSalesPhoto: "Bukti Foto / Resit (Pilihan)",
                btnOfficeSalesSubmit: "Simpan Jualan & Cetak Invois Rasmi",
                btnCancelOfficeSalesEdit: "Batal",
                lblOfficeHistoryTitle: "📋 Riwayat Jualan Luar Talian & Pelanggan:",
                thOffDate: "Tarikh",
                thOffProd: "Produk",
                thOffQty: "Kuantiti",
                thOffTotal: "Jumlah",
                thOffBuyer: "Pembeli & Tel",
                thOffAction: "Tindakan",
                invModalMainHeader: "INVOIS JUALAN",
                invRecipientLabel: "Kepada (Pelanggan / Pembeli):",
                invMgrLabel: "Pegawai / Pengurus Bertanggungjawab:",
                lblGrandTotal: "Jumlah Keseluruhan (Grand Total):",
                lblInvFooter: "* Dokumen rasmi digital sah dikeluarkan oleh sistem Medicalpro.",
                lblInvSign: "Disahkan Oleh:",
                btnClearSign: "Padam Tandatangan",
                btnCloseInv: "Tutup ✕",
                btnPrintInvPdf: "📄 Muat Turun PDF / Cetak Laporan",
                lblAdminLogTitle: "🔐 Log Masuk Admin",
                btnAdminCancel: "Batal",
                btnAdminSubmit: "Masuk",
                lblAdminDashTitle: "⚙️ Panel Tetapan Admin",
                btnCloseAdminDash: "Tutup ✕",
                lblSetAddrTitle: "📍 Tetapan Alamat Rasmi Office / Syarikat (Untuk Invoice)",
                btnSaveAddr: "Simpan Alamat Office",
                lblWaTitle: "💬 Pengurusan Senarai Admin WhatsApp (Pilihan Customer)",
                lblWaSub: "Tambah nama admin dan nombor WhatsApp supaya customer boleh pilih siapa yang boleh terima PO.",
                btnAddWa: "Tambah Admin WhatsApp",
                lblLogoTitle: "🖼️ Ganti Logo Sistem (Permanen & Sinkron Semua HP)",
                btnSaveLogo: "Simpan Logo",
                lblAiSetTitle: "👩‍💻 Pengurusan AI Asisten Ladang",
                btnSaveAi: "Simpan Tetapan AI",
                lblWorkerSetTitle: "Pengurusan Pekerja & Job Desk Kustom",
                btnAddWorker: "Tambah Pekerja",
                lblBioSetTitle: "Tambah Master Stok Bio Baja",
                btnSaveBio: "Simpan Stok Baja",
                thInvName: "Nama",
                thInvStock: "Stok",
                thInvAction: "Aksi"
            },
            id: {
                pageTitle: "Kebun Belimbing Buluh Medicalpro",
                mWelcomeTitle: "Selamat Datang ke Medicalpro",
                mWelcomeSub: "Silakan masukkan nama, gelar & foto profil Anda.",
                mLblRealName: "Nama Lengkap Anda",
                mLblGender: "Pilihan Sapaan (Untuk Panggilan AI Saja)",
                mBtnSaveUser: "Simpan & Masuk Sistem 🚀",
                lblGardenName: "KEBUN BELIMBING BULUH",
                lblSubHeader: "Medicalpro Agro Management - Machap",
                lblPartnership: "🤝 Kerjasama: NIBM & Jimba Sdn Bhd | Jabatan Pertanian (No. MyGAP: 24.0151)",
                btnAdminPanel: "🔐 Panel Admin Utama",
                lblAudioBanner: "🚨 Mode Audio AI & Obrolan Suara: Silakan klik tombol di samping untuk mengaktifkan suara sistem.",
                lblAudioBtn: "Aktifkan Audio Sistem",
                lblAiName: "Asisten Ladang AI",
                lblMemActive: "🧠 Memori Global Aktif",
                aiSubtitle: "Asisten mandiri & pintar ladang Medicalpro",
                btnVoiceChat: "🎙️ Bicara AI",
                btnRepeat: "🔊 Ulangi",
                btnAiSummary: "📊 Rekap & Data Sistem",
                btnAiBaja: "🧪 Jadwal Pemupukan (2 Minggu)",
                btnAiMem: "🧠 Kosakata & Riwayat Global",
                aiPlaceholder: "Tanya AI atau kirim tautan panduan...",
                btnAiSend: "Kirim & Simpan",
                lblWeatherCurrent: "Saat Ini",
                lblHourlyForecast: "Prakiraan Per Jam",
                lblIllustrationTitle: "Ladang Machap",
                lblIllustrationText: "Suasana di ladang.",
                lblPrecip: "Curah Hujan",
                lblWind: "Angin",
                lblAiDecision: "🤖 Keputusan AI Berdasarkan Cuaca & Tanah:",
                lblBossPortalTitle: "💬 Perbincangan atau Perintah tentang Ladang Belimbing Buluh Medical Pro",
                lblChatImg: "Gambar",
                bossPlaceholder: "Ketik perbincangan atau perintah ke kebun...",
                btnSendOrder: "Kirim Chat",
                lblHistoryTitle: "Ruang Perbincangan & Pesan Chat (Permanen):",
                navTasks: "Tugas Harian",
                navSupply: "Stok & Suplai",
                navStock: "Bio Baja",
                navAssets: "Aset Ladang",
                navExpenses: "Pengeluaran",
                navIncome: "Jualan Terus Dari Ladang",
                navOffice: "Produk & Invoice Offline",
                navPo: "PO Masuk",
                sectionTaskTitle: "📌 Tugas Harian & Jadwal Rutin",
                lblFilterFrom: "Dari:",
                lblFilterTo: "Hingga:",
                optAllMonths: "Semua Bulan (Global)",
                btnPrintTaskPdf: "🖨️ Cetak Rekap PDF",
                taskTitlePlaceholder: "Nama Pekerjaan",
                taskCatPlaceholder: "Kategori",
                optSelectWorker: "Pilih Pekerja",
                lblUseBioStock: "Gunakan Stok Bio Baja?",
                optNoStock: "-- Tanpa Stok --",
                lblQtyUsed: "Jumlah Dipakai",
                lblPhotoAttach: "Lampiran Foto (HD Maks 1MB)",
                btnTaskSubmit: "Simpan Laporan Kerja",
                btnCancelTaskEdit: "Batal",
                thTaskPhoto: "Foto HD",
                thTaskTitle: "Tugasan",
                thTaskCat: "Kategori",
                thTaskWorker: "Pekerja",
                thTaskDate: "Tanggal",
                thTaskStock: "Info Stok",
                thTaskStatus: "Status",
                thTaskAction: "Tindakan",
                lblSupplyMgmtTitle: "📦 Manajemen Stok & Suplai Ladang",
                lblSupplyMgmtSub: "Catat hasil panen (masuk stok gudang) atau cetak Laporan Suplai Ladang",
                btnPrintSupplyPdf: "🖨️ Cetak Laporan Suplai PDF",
                supplyFormTitle: "➕ Input Hasil Panen Baru (Masuk Stok)",
                lblHarvestDate: "Tanggal Panen",
                lblHarvestItem: "Jenis Hasil Ladang",
                lblHarvestQty: "Jumlah & Satuan (Otomatis)",
                lblHarvestDesc: "Keterangan / Blok Ladang",
                btnSupplySubmit: "Simpan ke Stok Gudang",
                btnCancelSupplyEdit: "Batal",
                lblStockSummaryTitle: "📊 Ringkasan Sisa Stok Gudang:",
                lblSupplyHistoryTitle: "📋 Riwayat & Aksi Suplai:",
                thSupplyDate: "Tanggal",
                thSupplyItem: "Item",
                thSupplyStatus: "Status / Aksi",
                thSupplyQty: "Jumlah",
                thSupplyDesc: "Keterangan",
                thSupplyAction: "Tindakan",
                lblBioBajaTitle: "🧪 Stok Bio Baja & Nutrisi Organik",
                lblAssetTitle: "🚜 Aset & Peralatan Ladang",
                expenseFormTitle: "💰 Pengeluaran Ladang (Bulanan)",
                btnPrintExpPdf: "🖨️ Cetak Rekap PDF",
                lblExpReceipt: "Resit HD",
                btnExpenseSubmit: "Tambah Pengeluaran",
                btnCancelExpenseEdit: "Batal",
                thExpReceipt: "Resit HD",
                thExpDesc: "Keterangan",
                thExpCost: "Kos",
                thExpDate: "Tanggal",
                thExpAction: "Tindakan",
                lblIncomeTitle: "💵 Jualan Terus Dari Ladang",
                lblIncomeSub: "Urus produk hasil ladang, tambah produk dengan foto, catat jualan dengan data pembeli & cetak invois rasmi",
                btnPrintIncomePdf: "🖨️ Cetak Rekap Ladang PDF",
                lblStaffLoginTitle: "🔐 Akses Input Jualan Ladang (Staf)",
                staffStatusText: "Status: Belum Log Masuk",
                btnStaffLogin: "Masuk",
                lblAddGardenProd: "➕ Tambah / Kemaskini Produk Ladang & Foto",
                btnSaveGardenProd: "Simpan / Kemaskini Produk Ladang",
                lblGardenSalesTitle: "🛒 Catat Transaksi Jualan Ladang Baru (Order Pelanggan)",
                lblSelectGardenProd: "Pilih Produk Ladang",
                lblGardenQty: "Kuantiti Jualan",
                lblGardenTotalAmt: "Jumlah Harga",
                lblGardenBuyer: "Nama Pembeli (Atas Nama)",
                lblGardenBuyerAddr: "Alamat Pelanggan",
                lblGardenBuyerPhone: "Nombor Telefon",
                lblGardenSalesDate: "Tanggal Jualan",
                lblGardenSalesPhoto: "Bukti Foto / Resit (Opsional)",
                btnGardenSalesSubmit: "Simpan Jualan & Cetak Invois Rasmi",
                lblGardenHistoryTitle: "📋 Riwayat Jualan Ladang & Pelanggan:",
                thIncDate: "Tanggal",
                thIncProd: "Produk",
                thIncQty: "Kuantiti",
                thIncTotal: "Jumlah",
                thIncBuyer: "Pembeli & Tel",
                thIncAction: "Tindakan",
                lblPoTitle: "📦 Kelola Purchase Order (PO) Masuk dari Customer",
                lblPoSub: "Pantau pesanan masuk secara real-time, cetak invoice rasmi, dan kemaskini nomor resi",
                lblPoLoginTitle: "Akses Dilindungi Kata Sandi Admin",
                lblPoLoginSub: "Sila masukkan kata sandi admin utama untuk melihat dan menguruskan pesanan PO masuk.",
                btnPoLogin: "Buka Akses",
                thPoNo: "No PO",
                thPoDate: "Tanggal",
                thPoCustomer: "Pelanggan",
                thPoItems: "Rincian Pesanan",
                thPoShipping: "Kurier & Pembayaran",
                thPoStatus: "Status & Resi",
                thPoAction: "Tindakan",
                tdPoWait: "Sila masukkan kata sandi di atas untuk memuat pesanan masuk...",
                lblOfficeTitle: "🏢 Produk & Invoice Offline",
                lblOfficeSub: "Urus produk siap jualan dengan foto, khasiat/kandungan, catat order pelanggan & cetak invoice rasmi office",
                btnPrintOfficePdf: "🖨️ Cetak Rekap Office PDF",
                lblOfficeLoginTitle: "🔐 Akses Admin Produk & Invoice Offline",
                officeStatusText: "Status: Belum Log Masuk",
                btnOfficeLogin: "Masuk",
                officeFormTitleLabel: "➕ Tambah Produk Offline Baru",
                btnCancelOfficeEdit: "Batal Edit",
                lblProdBenefits: "Khasiat, Manfaat & Kandungan Produk (Dibaca AI Otomatis)",
                btnOfficeProdSubmit: "Simpan / Tambah Produk Offline Baru",
                officeSalesFormTitle: "🛒 Catat Transaksi Jualan Offline Baru (Order Pelanggan)",
                lblSelectOfficeProd: "Pilih Produk",
                lblOfficeQty: "Kuantiti Jualan",
                lblOfficeTotalAmt: "Jumlah Harga",
                lblOfficeBuyer: "Nama Pembeli (Atas Nama)",
                lblOfficeBuyerAddr: "Alamat Pelanggan",
                lblOfficeBuyerPhone: "Nombor Telefon",
                lblOfficeSalesDate: "Tanggal Jualan",
                lblOfficeSalesPhoto: "Bukti Foto / Resit (Opsional)",
                btnOfficeSalesSubmit: "Simpan Jualan & Cetak Invois Rasmi",
                btnCancelOfficeSalesEdit: "Batal",
                lblOfficeHistoryTitle: "📋 Riwayat Jualan Offline & Pelanggan:",
                thOffDate: "Tanggal",
                thOffProd: "Produk",
                thOffQty: "Kuantiti",
                thOffTotal: "Jumlah",
                thOffBuyer: "Pembeli & Tel",
                thOffAction: "Tindakan",
                invModalMainHeader: "INVOIS JUALAN",
                invRecipientLabel: "Kepada (Pelanggan / Pembeli):",
                invMgrLabel: "Pegawai / Pengurus Bertanggungjawab:",
                lblGrandTotal: "Jumlah Keseluruhan (Grand Total):",
                lblInvFooter: "* Dokumen rasmi digital sah dikeluarkan oleh sistem Medicalpro.",
                lblInvSign: "Disahkan Oleh:",
                btnClearSign: "Padam Tandatangan",
                btnCloseInv: "Tutup ✕",
                btnPrintInvPdf: "📄 Muat Turun PDF / Cetak Laporan",
                lblAdminLogTitle: "🔐 Log Masuk Admin",
                btnAdminCancel: "Batal",
                btnAdminSubmit: "Masuk",
                lblAdminDashTitle: "⚙️ Panel Tetapan Admin",
                btnCloseAdminDash: "Tutup ✕",
                lblSetAddrTitle: "📍 Tetapan Alamat Rasmi Office / Syarikat (Untuk Invoice)",
                btnSaveAddr: "Simpan Alamat Office",
                lblWaTitle: "💬 Pengurusan Senarai Admin WhatsApp (Pilihan Customer)",
                lblWaSub: "Tambah nama admin dan nombor WhatsApp supaya customer boleh pilih siapa yang boleh terima PO.",
                btnAddWa: "Tambah Admin WhatsApp",
                lblLogoTitle: "🖼️ Ganti Logo Sistem (Permanen & Sinkron Semua HP)",
                btnSaveLogo: "Simpan Logo",
                lblAiSetTitle: "👩‍💻 Pengurusan AI Asisten Ladang",
                btnSaveAi: "Simpan Tetapan AI",
                lblWorkerSetTitle: "Pengurusan Pekerja & Job Desk Kustom",
                btnAddWorker: "Tambah Pekerja",
                lblBioSetTitle: "Tambah Master Stok Bio Baja",
                btnSaveBio: "Simpan Stok Baja",
                thInvName: "Nama",
                thInvStock: "Stok",
                thInvAction: "Aksi"
            },
            zh: {
                pageTitle: "Medicalpro 槟榔果树农场",
                mWelcomeTitle: "欢迎来到 Medicalpro",
                mWelcomeSub: "请输入您的姓名、称谓和个人头像。",
                mLblRealName: "您的全名",
                mLblGender: "称谓选择 (仅用于AI称呼)",
                mBtnSaveUser: "保存并进入系统 🚀",
                lblGardenName: "槟榔果树农场",
                lblSubHeader: "Medicalpro 农业管理 - 马什卡 (Machap)",
                lblPartnership: "🤝 合作单位: NIBM & Jimba Sdn Bhd | 农业部 (MyGAP 编号: 24.0151)",
                btnAdminPanel: "🔐 主管理员面板",
                lblAudioBanner: "🚨 AI 音频与语音聊天模式：请点击旁边的按钮激活系统声音。",
                lblAudioBtn: "激活系统音频",
                lblAiName: "农场AI助手",
                lblMemActive: "🧠 全局记忆已激活",
                aiSubtitle: "Medicalpro 农场自主智能助手",
                btnVoiceChat: "🎙️ 与AI对话",
                btnRepeat: "🔊 重复",
                btnAiSummary: "📊 汇总与系统数据",
                btnAiBaja: "🧪 施肥时间表 (两周)",
                btnAiMem: "🧠 词汇与全局历史",
                aiPlaceholder: "向AI提问或发送指南链接...",
                btnAiSend: "发送并保存",
                lblWeatherCurrent: "当前",
                lblHourlyForecast: "每小时预报",
                lblIllustrationTitle: "马什卡农场",
                lblIllustrationText: "农场环境。",
                lblPrecip: "降水量",
                lblWind: "风速",
                lblAiDecision: "🤖 AI 根据天气与土壤做出的决策：",
                lblBossPortalTitle: "💬 槟榔果树农场 (Medical Pro) 相关讨论与指令",
                lblChatImg: "图片",
                bossPlaceholder: "输入农场讨论或指令...",
                btnSendOrder: "发送聊天",
                lblHistoryTitle: "讨论与聊天记录 (永久):",
                navTasks: "日常任务",
                navSupply: "库存与供应",
                navStock: "生物肥",
                navAssets: "农场资产",
                navExpenses: "开销记录",
                navIncome: "农场直销",
                navOffice: "线下产品与发票",
                navPo: "收到的订单 (PO)",
                sectionTaskTitle: "📌 日常任务与常规时间表",
                lblFilterFrom: "从:",
                lblFilterTo: "至:",
                optAllMonths: "所有月份 (全局)",
                btnPrintTaskPdf: "🖨️ 打印PDF汇总",
                taskTitlePlaceholder: "工作名称",
                taskCatPlaceholder: "类别",
                optSelectWorker: "选择工人",
                lblUseBioStock: "使用生物肥库存？",
                optNoStock: "-- 无库存 --",
                lblQtyUsed: "使用数量",
                lblPhotoAttach: "照片附件 (HD 最大 1MB)",
                btnTaskSubmit: "保存工作报告",
                btnCancelTaskEdit: "取消",
                thTaskPhoto: "高清照片",
                thTaskTitle: "任务",
                thTaskCat: "类别",
                thTaskWorker: "工人",
                thTaskDate: "日期",
                thTaskStock: "库存信息",
                thTaskStatus: "状态",
                thTaskAction: "操作",
                lblSupplyMgmtTitle: "📦 农场库存与供应管理",
                lblSupplyMgmtSub: "记录收获成果 (入库) 或打印农场供应报告",
                btnPrintSupplyPdf: "🖨️ 打印供应报告 PDF",
                supplyFormTitle: "➕ 输入新收获成果 (入库)",
                lblHarvestDate: "收获日期",
                lblHarvestItem: "农场产物类型",
                lblHarvestQty: "数量与单位 (自动)",
                lblHarvestDesc: "说明 / 农场区块",
                btnSupplySubmit: "保存到仓库库存",
                btnCancelSupplyEdit: "取消",
                lblStockSummaryTitle: "📊 仓库剩余库存汇总:",
                lblSupplyHistoryTitle: "📋 供应历史与操作:",
                thSupplyDate: "日期",
                thSupplyItem: "项目",
                thSupplyStatus: "状态 / 操作",
                thSupplyQty: "数量",
                thSupplyDesc: "说明",
                thSupplyAction: "操作",
                lblBioBajaTitle: "🧪 生物肥与有机营养库存",
                lblAssetTitle: "🚜 农场资产与设备",
                expenseFormTitle: "💰 农场开销 (每月)",
                btnPrintExpPdf: "🖨️ 打印PDF汇总",
                lblExpReceipt: "高清收据",
                btnExpenseSubmit: "添加开销",
                btnCancelExpenseEdit: "取消",
                thExpReceipt: "高清收据",
                thExpDesc: "说明",
                thExpCost: "费用",
                thExpDate: "日期",
                thExpAction: "操作",
                lblIncomeTitle: "💵 农场直销",
                lblIncomeSub: "管理农场产物、带照片添加产品、记录买家销售并打印正式发票",
                btnPrintIncomePdf: "🖨️ 打印农场汇总 PDF",
                lblStaffLoginTitle: "🔐 农场销售录入权限 (员工)",
                staffStatusText: "状态: 未登录",
                btnStaffLogin: "登录",
                lblAddGardenProd: "➕ 添加 / 更新农场产品与照片",
                btnSaveGardenProd: "保存 / 更新农场产品",
                lblGardenSalesTitle: "🛒 记录新农场销售交易 (客户订单)",
                lblSelectGardenProd: "选择农场产品",
                lblGardenQty: "销售数量",
                lblGardenTotalAmt: "总金额",
                lblGardenBuyer: "买家姓名",
                lblGardenBuyerAddr: "客户地址",
                lblGardenBuyerPhone: "电话号码",
                lblGardenSalesDate: "销售日期",
                lblGardenSalesPhoto: "照片证据 / 收据 (可选)",
                btnGardenSalesSubmit: "保存销售并打印正式发票",
                lblGardenHistoryTitle: "📋 农场销售与客户历史:",
                thIncDate: "日期",
                thIncProd: "产品",
                thIncQty: "数量",
                thIncTotal: "总额",
                thIncBuyer: "买家与电话",
                thIncAction: "操作",
                lblPoTitle: "📦 管理客户采购订单 (PO)",
                lblPoSub: "实时监控收到的订单，打印正式发票并更新快递单号",
                lblPoLoginTitle: "受管理员密码保护",
                lblPoLoginSub: "请输入主管理员密码以查看和管理收到的PO订单。",
                btnPoLogin: "打开权限",
                thPoNo: "PO编号",
                thPoDate: "日期",
                thPoCustomer: "客户",
                thPoItems: "订单明细",
                thPoShipping: "快递与支付",
                thPoStatus: "状态与单号",
                thPoAction: "操作",
                tdPoWait: "请在上方输入密码以加载收到的订单...",
                lblOfficeTitle: "🏢 线下产品与发票",
                lblOfficeSub: "管理现货产品及照片、功效/成分、记录客户订单并打印正式办公室发票",
                btnPrintOfficePdf: "🖨️ 打印办公室汇总 PDF",
                lblOfficeLoginTitle: "🔐 线下产品与发票管理员权限",
                officeStatusText: "状态: 未登录",
                btnOfficeLogin: "登录",
                officeFormTitleLabel: "➕ 添加新线下产品",
                btnCancelOfficeEdit: "取消编辑",
                lblProdBenefits: "功效、好处与成分 (AI自动读取)",
                btnOfficeProdSubmit: "保存 / 添加新线下产品",
                officeSalesFormTitle: "🛒 记录新线下销售交易 (客户订单)",
                lblSelectOfficeProd: "选择产品",
                lblOfficeQty: "销售数量",
                lblOfficeTotalAmt: "总金额",
                lblOfficeBuyer: "买家姓名",
                lblOfficeBuyerAddr: "客户地址",
                lblOfficeBuyerPhone: "电话号码",
                lblOfficeSalesDate: "销售日期",
                lblOfficeSalesPhoto: "照片证据 / 收据 (可选)",
                btnOfficeSalesSubmit: "保存销售并打印正式发票",
                btnCancelOfficeSalesEdit: "取消",
                lblOfficeHistoryTitle: "📋 线下销售与客户历史:",
                thOffDate: "日期",
                thOffProd: "产品",
                thOffQty: "数量",
                thOffTotal: "总额",
                thOffBuyer: "买家与电话",
                thOffAction: "操作",
                invModalMainHeader: "销售发票",
                invRecipientLabel: "收件人 (客户 / 买家):",
                invMgrLabel: "负责官员 / 经理:",
                lblGrandTotal: "总金额 (Grand Total):",
                lblInvFooter: "* 本数字正式文件由 Medicalpro 系统合法签发。",
                lblInvSign: "批准人:",
                btnClearSign: "清除签名",
                btnCloseInv: "关闭 ✕",
                btnPrintInvPdf: "📄 下载 PDF / 打印报告",
                lblAdminLogTitle: "🔐 管理员登录",
                btnAdminCancel: "取消",
                btnAdminSubmit: "登录",
                lblAdminDashTitle: "⚙️ 管理员设置面板",
                btnCloseAdminDash: "关闭 ✕",
                lblSetAddrTitle: "📍 办公室 / 公司正式地址设置 (用于发票)",
                btnSaveAddr: "保存办公室地址",
                lblWaTitle: "💬 WhatsApp 管理员列表管理 (客户选项)",
                lblWaSub: "添加管理员姓名和 WhatsApp 号码，以便客户选择谁来接收 PO。",
                btnAddWa: "添加 WhatsApp 管理员",
                lblLogoTitle: "🖼️ 更换系统 Logo (永久且同步所有设备)",
                btnSaveLogo: "保存 Logo",
                lblAiSetTitle: "👩‍💻 农场AI助手管理",
                btnSaveAi: "保存 AI 设置",
                lblWorkerSetTitle: "工人与自定义工作职责管理",
                btnAddWorker: "添加工人",
                lblBioSetTitle: "添加生物肥主库存",
                btnSaveBio: "保存肥料库存",
                thInvName: "名称",
                thInvStock: "库存",
                thInvAction: "操作"
            },
            hi: {
                pageTitle: "मेडिकलप्रो बेलimbing बुलुह फार्म",
                mWelcomeTitle: "मेडिकलप्रो में आपका स्वागत है",
                mWelcomeSub: "कृपया अपना नाम, उपाधि और प्रोफाइल फोटो दर्ज करें।",
                mLblRealName: "आपका पूरा नाम",
                mLblGender: "उपाधि का चयन (केवल AI संबोधन के लिए)",
                mBtnSaveUser: "सहेजें और सिस्टम में प्रवेश करें 🚀",
                lblGardenName: "बेलimbing बुलुह फार्म",
                lblSubHeader: "मेडिकलप्रो एग्रो Management - मचाप",
                lblPartnership: "🤝 सहयोग: NIBM & जिम्बा Sdn Bhd | कृषि विभाग (MyGAP No: 24.0151)",
                btnAdminPanel: "🔐 मुख्य प्रशासक पैनल",
                lblAudioBanner: "🚨 AI ऑडियो और वॉयस चैट मोड: सिस्टम ध्वनि सक्रिय करने के लिए कृपया बगल के बटन पर क्लिक करें।",
                lblAudioBtn: "सिस्टम ऑडियो सक्रिय करें",
                lblAiName: "फार्म AI सहायक",
                lblMemActive: "🧠 ग्लोबल मेमोरी सक्रिय",
                aiSubtitle: "मेडिकलप्रो फार्म स्वायत्त और स्मार्ट सहायक",
                btnVoiceChat: "🎙️ AI से बात करें",
                btnRepeat: "🔊 दोहराएं",
                btnAiSummary: "📊 सारांश और सिस्टम डेटा",
                btnAiBaja: "🧪 उर्वरक अनुसूची (2 सप्ताह)",
                btnAiMem: "🧠 शब्दावली और ग्लोबल इतिहास",
                aiPlaceholder: "AI से पूछें या गाइड लिंक भेजें...",
                btnAiSend: "भेजें और सहेजें",
                lblWeatherCurrent: "वर्तमान",
                lblHourlyForecast: "प्रति घंटा पूर्वानुमान",
                lblIllustrationTitle: "मचाप फार्म",
                lblIllustrationText: "फार्म का माहौल।",
                lblPrecip: "वर्षा",
                lblWind: "हवा",
                lblAiDecision: "🤖 मौसम और मिट्टी के आधार पर AI का निर्णय:",
                lblBossPortalTitle: "💬 बेलimbing बुलुह मेडिकल प्रो फार्म के बारे में चर्चा या आदेश",
                lblChatImg: "छवि",
                bossPlaceholder: "फार्म के लिए चर्चा या आदेश टाइप करें...",
                btnSendOrder: "चैट भेजें",
                lblHistoryTitle: "चर्चा और चैट संदेश (स्थायी):",
                navTasks: "दैनिक कार्य",
                navSupply: "स्टॉक और आपूर्ति",
                navStock: "बायो खाद",
                navAssets: "फार्म संपत्ति",
                navExpenses: "खर्च",
                navIncome: "फार्म से सीधी बिक्री",
                navOffice: "ऑफ़लाइन उत्पाद और चालान",
                navPo: "प्राप्त PO",
                sectionTaskTitle: "📌 दैनिक कार्य और नियमित अनुसूची",
                lblFilterFrom: "से:",
                lblFilterTo: "तक:",
                optAllMonths: "सभी महीने (ग्लोबल)",
                btnPrintTaskPdf: "🖨️ PDF सारांश प्रिंट करें",
                taskTitlePlaceholder: "कार्य का नाम",
                taskCatPlaceholder: "श्रेणी",
                optSelectWorker: "कर्मचारी चुनें",
                lblUseBioStock: "बायो खाद स्टॉक का उपयोग करें?",
                optNoStock: "-- स्टॉक के बिना --",
                lblQtyUsed: "उपयोग की गई मात्रा",
                lblPhotoAttach: "फोटो संलग्नक (HD अधिकतम 1MB)",
                btnTaskSubmit: "कार्य रिपोर्ट सहेजें",
                btnCancelTaskEdit: "रद्द करें",
                thTaskPhoto: "HD फोटो",
                thTaskTitle: "कार्य",
                thTaskCat: "श्रेणी",
                thTaskWorker: "कर्मचारी",
                thTaskDate: "तारीख",
                thTaskStock: "स्टॉक जानकारी",
                thTaskStatus: "स्थिति",
                thTaskAction: "कार्रवाई",
                lblSupplyMgmtTitle: "📦 फार्म स्टॉक और आपूर्ति प्रबंधन",
                lblSupplyMgmtSub: "फसल कटाई दर्ज करें (गोदाम स्टॉक में) या फार्म आपूर्ति रिपोर्ट प्रिंट करें",
                btnPrintSupplyPdf: "🖨️ आपूर्ति रिपोर्ट PDF प्रिंट करें",
                supplyFormTitle: "➕ नई फसल कटाई दर्ज करें (स्टॉक में)",
                lblHarvestDate: "कटाई की तारीख",
                lblHarvestItem: "फार्म उपज का प्रकार",
                lblHarvestQty: "मात्रा और इकाई (स्वचालित)",
                lblHarvestDesc: "विवरण / फार्म ब्लॉक",
                btnSupplySubmit: "गोदाम स्टॉक में सहेजें",
                btnCancelSupplyEdit: "रद्द करें",
                lblStockSummaryTitle: "📊 गोदाम शेष स्टॉक सारांश:",
                lblSupplyHistoryTitle: "📋 आपूर्ति इतिहास और कार्रवाई:",
                thSupplyDate: "तारीख",
                thSupplyItem: "आइटम",
                thSupplyStatus: "स्थिति / कार्रवाई",
                thSupplyQty: "मात्रा",
                thSupplyDesc: "विवरण",
                thSupplyAction: "कार्रवाई",
                lblBioBajaTitle: "🧪 बायो खाद और जैविक पोषण स्टॉक",
                lblAssetTitle: "फार्म संपत्ति और उपकरण",
                expenseFormTitle: "💰 फार्म खर्च (मासिक)",
                btnPrintExpPdf: "🖨️ PDF सारांश प्रिंट करें",
                lblExpReceipt: "HD रसीद",
                btnExpenseSubmit: "खर्च जोड़ें",
                btnCancelExpenseEdit: "रद्द करें",
                thExpReceipt: "HD रसीद",
                thExpDesc: "विवरण",
                thExpCost: "लागत",
                thExpDate: "तारीख",
                thExpAction: "कार्रवाई",
                lblIncomeTitle: "💵 फार्म से सीधी बिक्री",
                lblIncomeSub: "फार्म उत्पादों का प्रबंधन करें, फोटो के साथ उत्पाद जोड़ें, खरीदार डेटा के साथ बिक्री दर्ज करें और आधिकारिक चालान प्रिंट करें",
                btnPrintIncomePdf: "🖨️ फार्म सारांश PDF प्रिंट करें",
                lblStaffLoginTitle: "🔐 फार्म बिक्री इनपुट एक्सेस (स्टाफ)",
                staffStatusText: "स्थिति: लॉग इन नहीं है",
                btnStaffLogin: "लॉग इन",
                lblAddGardenProd: "➕ फार्म उत्पाद और फोटो जोड़ें / अपडेट करें",
                btnSaveGardenProd: "फार्म उत्पाद सहेजें / अपडेट करें",
                lblGardenSalesTitle: "🛒 नई फार्म बिक्री लेनदेन दर्ज करें (ग्राहक आदेश)",
                lblSelectGardenProd: "फार्म उत्पाद चुनें",
                lblGardenQty: "बिक्री मात्रा",
                lblGardenTotalAmt: "कुल मूल्य",
                lblGardenBuyer: "खरीदार का नाम",
                lblGardenBuyerAddr: "ग्राहक का पता",
                lblGardenBuyerPhone: "फोन नंबर",
                lblGardenSalesDate: "बिक्री की तारीख",
                lblGardenSalesPhoto: "फोटो सबूत / रसीद (वैकल्पिक)",
                btnGardenSalesSubmit: "बिक्री सहेजें और आधिकारिक चालान प्रिंट करें",
                lblGardenHistoryTitle: "📋 फार्म बिक्री और ग्राहक इतिहास:",
                thIncDate: "तारीख",
                thIncProd: "उत्पाद",
                thIncQty: "मात्रा",
                thIncTotal: "कुल",
                thIncBuyer: "खरीदार और फोन",
                thIncAction: "कार्रवाई",
                lblPoTitle: "📦 ग्राहकों से प्राप्त PO प्रबंधित करें",
                lblPoSub: "वास्तविक समय में प्राप्त आदेशों की निगरानी करें, आधिकारिक चालान प्रिंट करें और रसीद संख्या अपडेट करें",
                lblPoLoginTitle: "प्रशासन पासवर्ड द्वारा संरक्षित",
                lblPoLoginSub: "प्राप्त PO आदेशों को देखने और प्रबंधित करने के लिए कृपया मुख्य व्यवस्थापक पासवर्ड दर्ज करें।",
                btnPoLogin: "पहुँच खोलें",
                thPoNo: "PO नंबर",
                thPoDate: "तारीख",
                thPoCustomer: "ग्राहक",
                thPoItems: "आदेश विवरण",
                thPoShipping: "कूरियर और भुगतान",
                thPoStatus: "स्थिति और रसीद",
                thPoAction: "कार्रवाई",
                tdPoWait: "प्राप्त आदेश लोड करने के लिए कृपया ऊपर पासवर्ड दर्ज करें...",
                lblOfficeTitle: "🏢 ऑफ़लाइन उत्पाद और चालान",
                lblOfficeSub: "तैयार उत्पादों को फोटो, लाभ/सामग्री के साथ प्रबंधित करें, ग्राहक आदेश दर्ज करें और आधिकारिक कार्यालय चालान प्रिंट करें",
                btnPrintOfficePdf: "🖨️ कार्यालय सारांश PDF प्रिंट करें",
                lblOfficeLoginTitle: "🔐 ऑफ़लाइन उत्पाद और चालान व्यवस्थापक एक्सेस",
                officeStatusText: "स्थिति: लॉग इन नहीं",
                btnOfficeLogin: "लॉग इन",
                officeFormTitleLabel: "➕ नया ऑफ़लाइन उत्पाद जोड़ें",
                btnCancelOfficeEdit: "संपादित करना रद्द करें",
                lblProdBenefits: "उत्पाद के लाभ, गुण और सामग्री (AI द्वारा स्वचालित रूप से पढ़ा जाता है)",
                btnOfficeProdSubmit: "नया ऑफ़लाइन उत्पाद सहेजें / जोड़ें",
                officeSalesFormTitle: "🛒 नया ऑफ़लाइन बिक्री लेनदेन दर्ज करें (ग्राहक आदेश)",
                lblSelectOfficeProd: "उत्पाद चुनें",
                lblOfficeQty: "बिक्री मात्रा",
                lblOfficeTotalAmt: "कुल मूल्य",
                lblOfficeBuyer: "खरीदार का नाम",
                lblOfficeBuyerAddr: "ग्राहक का पता",
                lblOfficeBuyerPhone: "फोन नंबर",
                lblOfficeSalesDate: "बिक्री की तारीख",
                lblOfficeSalesPhoto: "फोटो सबूत / रसीद (वैकल्पिक)",
                btnOfficeSalesSubmit: "बिक्री सहेजें और आधिकारिक चालान प्रिंट करें",
                btnCancelOfficeSalesEdit: "रद्द करें",
                lblOfficeHistoryTitle: "📋 ऑफ़लाइन बिक्री और ग्राहक इतिहास:",
                thOffDate: "तारीख",
                thOffProd: "उत्पाद",
                thOffQty: "मात्रा",
                thOffTotal: "कुल",
                thOffBuyer: "खरीदार और फोन",
                thOffAction: "कार्रवाई",
                invModalMainHeader: "बिक्री चालान",
                invRecipientLabel: "को (ग्राहक / खरीदार):",
                invMgrLabel: "जिम्मेदार अधिकारी / प्रबंधक:",
                lblGrandTotal: "कुल राशि (Grand Total):",
                lblInvFooter: "* मेडिकलप्रो सिस्टम द्वारा वैध आधिकारिक डिजिटल दस्तावेज़ जारी किया गया।",
                lblInvSign: "द्वारा सत्यापित:",
                btnClearSign: "हस्ताक्षर हटाएं",
                btnCloseInv: "बंद करें ✕",
                btnPrintInvPdf: "📄 PDF डाउनलोड करें / रिपोर्ट प्रिंट करें",
                lblAdminLogTitle: "🔐 व्यवस्थापक लॉग इन",
                btnAdminCancel: "रद्द करें",
                btnAdminSubmit: "लॉग इन",
                lblAdminDashTitle: "⚙️ व्यवस्थापक सेटिंग पैनल",
                btnCloseAdminDash: "बंद करें ✕",
                lblSetAddrTitle: "📍 आधिकारिक कार्यालय / कंपनी का पता सेटिंग्स (चालान के लिए)",
                btnSaveAddr: "कार्यालय का पता सहेजें",
                lblWaTitle: "💬 व्हाट्सएप एडमिनिस्ट्रेटर सूची प्रबंधन (ग्राहक विकल्प)",
                lblWaSub: "एडमिन का नाम और व्हाट्सएप नंबर जोड़ें ताकि ग्राहक चुन सकें कि PO किसे प्राप्त होगा।",
                btnAddWa: "व्हाट्सएप एडमिन जोड़ें",
                lblLogoTitle: "🖼️ सिस्टम लोगो बदलें (स्थायी और सभी फोन पर सिंक)",
                btnSaveLogo: "लोगो सहेजें",
                lblAiSetTitle: "👩‍💻 फार्म AI सहायक प्रबंधन",
                btnSaveAi: "AI सेटिंग सहेजें",
                lblWorkerSetTitle: "कर्मचारी और कस्टम कार्य प्रबंधन",
                btnAddWorker: "कर्मचारी जोड़ें",
                lblBioSetTitle: "मुख्य बायो खाद स्टॉक जोड़ें",
                btnSaveBio: "खाद स्टॉक सहेजें",
                thInvName: "नाम",
                thInvStock: "स्टॉक",
                thInvAction: "कार्रवाई"
            },
            en: {
                pageTitle: "Medicalpro Belimbing Buluh Farm",
                mWelcomeTitle: "Welcome to Medicalpro",
                mWelcomeSub: "Please enter your name, title & profile photo.",
                mLblRealName: "Your Full Name",
                mLblGender: "Title Preference (For AI Address Only)",
                mBtnSaveUser: "Save & Enter System 🚀",
                lblGardenName: "BELIMBING BULUH FARM",
                lblSubHeader: "Medicalpro Agro Management - Machap",
                lblPartnership: "🤝 Partnership: NIBM & Jimba Sdn Bhd | Department of Agriculture (MyGAP No: 24.0151)",
                btnAdminPanel: "🔐 Main Admin Panel",
                lblAudioBanner: "🚨 AI Audio & Voice Chat Mode: Please click the button on the right to activate system sound.",
                lblAudioBtn: "Activate System Audio",
                lblAiName: "Farm AI Assistant",
                lblMemActive: "🧠 Global Memory Active",
                aiSubtitle: "Medicalpro farm autonomous & smart assistant",
                btnVoiceChat: "🎙️ Talk to AI",
                btnRepeat: "🔊 Repeat",
                btnAiSummary: "📊 Summary & System Data",
                btnAiBaja: "🧪 Fertilization Schedule (2 Weeks)",
                btnAiMem: "🧠 Vocabulary & Global History",
                aiPlaceholder: "Ask AI or send a guide link...",
                btnAiSend: "Send & Save",
                lblWeatherCurrent: "Current",
                lblHourlyForecast: "Hourly Forecast",
                lblIllustrationTitle: "Machap Farm",
                lblIllustrationText: "Farm atmosphere.",
                lblPrecip: "Precipitation",
                lblWind: "Wind",
                lblAiDecision: "🤖 AI Decision Based on Weather & Soil:",
                lblBossPortalTitle: "💬 Discussion or Orders regarding Belimbing Buluh Medical Pro Farm",
                lblChatImg: "Image",
                bossPlaceholder: "Type farm discussion or directive...",
                btnSendOrder: "Send Chat",
                lblHistoryTitle: "Discussion & Chat Messages (Permanent):",
                navTasks: "Daily Tasks",
                navSupply: "Stock & Supply",
                navStock: "Bio Fertilizer",
                navAssets: "Farm Assets",
                navExpenses: "Expenses",
                navIncome: "Direct Farm Sales",
                navOffice: "Offline Products & Invoices",
                navPo: "Incoming PO",
                sectionTaskTitle: "📌 Daily Tasks & Routine Schedule",
                lblFilterFrom: "From:",
                lblFilterTo: "To:",
                optAllMonths: "All Months (Global)",
                btnPrintTaskPdf: "🖨️ Print PDF Summary",
                taskTitlePlaceholder: "Task Name",
                taskCatPlaceholder: "Category",
                optSelectWorker: "Select Worker",
                lblUseBioStock: "Use Bio Fertilizer Stock?",
                optNoStock: "-- No Stock --",
                lblQtyUsed: "Quantity Used",
                lblPhotoAttach: "Photo Attachment (HD Max 1MB)",
                btnTaskSubmit: "Save Work Report",
                btnCancelTaskEdit: "Cancel",
                thTaskPhoto: "HD Photo",
                thTaskTitle: "Task",
                thTaskCat: "Category",
                thTaskWorker: "Worker",
                thTaskDate: "Date",
                thTaskStock: "Stock Info",
                thTaskStatus: "Status",
                thTaskAction: "Action",
                lblSupplyMgmtTitle: "📦 Farm Stock & Supply Management",
                lblSupplyMgmtSub: "Record harvest yield (warehouse stock in) or print Farm Supply Report",
                btnPrintSupplyPdf: "🖨️ Print Supply Report PDF",
                supplyFormTitle: "➕ Input New Harvest Yield (Stock In)",
                lblHarvestDate: "Harvest Date",
                lblHarvestItem: "Farm Produce Type",
                lblHarvestQty: "Quantity & Unit (Automatic)",
                lblHarvestDesc: "Description / Farm Block",
                btnSupplySubmit: "Save to Warehouse Stock",
                btnCancelSupplyEdit: "Cancel",
                lblStockSummaryTitle: "📊 Warehouse Remaining Stock Summary:",
                lblSupplyHistoryTitle: "📋 Supply History & Actions:",
                thSupplyDate: "Date",
                thSupplyItem: "Item",
                thSupplyStatus: "Status / Action",
                thSupplyQty: "Quantity",
                thSupplyDesc: "Description",
                thSupplyAction: "Action",
                lblBioBajaTitle: "🧪 Bio Fertilizer & Organic Nutrition Stock",
                lblAssetTitle: "🚜 Farm Assets & Equipment",
                expenseFormTitle: "💰 Farm Expenses (Monthly)",
                btnPrintExpPdf: "🖨️ Print PDF Summary",
                lblExpReceipt: "HD Receipt",
                btnExpenseSubmit: "Add Expense",
                btnCancelExpenseEdit: "Cancel",
                thExpReceipt: "HD Receipt",
                thExpDesc: "Description",
                thExpCost: "Cost",
                thExpDate: "Date",
                thExpAction: "Action",
                lblIncomeTitle: "💵 Direct Farm Sales",
                lblIncomeSub: "Manage farm produce, add products with photos, record sales with customer data & print official invoices",
                btnPrintIncomePdf: "🖨️ Print Farm Summary PDF",
                lblStaffLoginTitle: "🔐 Farm Sales Input Access (Staff)",
                staffStatusText: "Status: Not Logged In",
                btnStaffLogin: "Log In",
                lblAddGardenProd: "➕ Add / Update Farm Products & Photos",
                btnSaveGardenProd: "Save / Update Farm Product",
                lblGardenSalesTitle: "🛒 Record New Farm Sales Transaction (Customer Order)",
                lblSelectGardenProd: "Select Farm Product",
                lblGardenQty: "Sales Quantity",
                lblGardenTotalAmt: "Total Price",
                lblGardenBuyer: "Buyer Name",
                lblGardenBuyerAddr: "Customer Address",
                lblGardenBuyerPhone: "Phone Number",
                lblGardenSalesDate: "Sales Date",
                lblGardenSalesPhoto: "Photo Proof / Receipt (Optional)",
                btnGardenSalesSubmit: "Save Sales & Print Official Invoice",
                lblGardenHistoryTitle: "📋 Farm Sales & Customer History:",
                thIncDate: "Date",
                thIncProd: "Product",
                thIncQty: "Quantity",
                thIncTotal: "Total",
                thIncBuyer: "Buyer & Phone",
                thIncAction: "Action",
                lblPoTitle: "📦 Manage Incoming Purchase Orders (PO) from Customers",
                lblPoSub: "Monitor incoming orders in real-time, print official invoices, and update tracking numbers",
                lblPoLoginTitle: "Protected by Admin Password",
                lblPoLoginSub: "Please enter the main admin password to view and manage incoming PO orders.",
                btnPoLogin: "Open Access",
                thPoNo: "PO No",
                thPoDate: "Date",
                thPoCustomer: "Customer",
                thPoItems: "Order Details",
                thPoShipping: "Courier & Payment",
                thPoStatus: "Status & Tracking",
                thPoAction: "Action",
                tdPoWait: "Please enter the password above to load incoming orders...",
                lblOfficeTitle: "🏢 Offline Products & Invoices",
                lblOfficeSub: "Manage ready-to-sell products with photos, benefits/ingredients, record customer orders & print official office invoices",
                btnPrintOfficePdf: "🖨️ Print Office Summary PDF",
                lblOfficeLoginTitle: "🔐 Offline Products & Invoices Admin Access",
                officeStatusText: "Status: Not Logged In",
                btnOfficeLogin: "Log In",
                officeFormTitleLabel: "➕ Add New Offline Product",
                btnCancelOfficeEdit: "Cancel Edit",
                lblProdBenefits: "Benefits, Advantages & Ingredients (Read Automatically by AI)",
                btnOfficeProdSubmit: "Save / Add New Offline Product",
                officeSalesFormTitle: "🛒 Record New Offline Sales Transaction (Customer Order)",
                lblSelectOfficeProd: "Select Product",
                lblOfficeQty: "Sales Quantity",
                lblOfficeTotalAmt: "Total Price",
                lblOfficeBuyer: "Buyer Name",
                lblOfficeBuyerAddr: "Customer Address",
                lblOfficeBuyerPhone: "Phone Number",
                lblOfficeSalesDate: "Sales Date",
                lblOfficeSalesPhoto: "Photo Proof / Receipt (Optional)",
                btnOfficeSalesSubmit: "Save Sales & Print Official Invoice",
                btnCancelOfficeSalesEdit: "Cancel",
                lblOfficeHistoryTitle: "📋 Offline Sales & Customer History:",
                thOffDate: "Date",
                thOffProd: "Product",
                thOffQty: "Quantity",
                thOffTotal: "Total",
                thOffBuyer: "Buyer & Phone",
                thOffAction: "Action",
                invModalMainHeader: "SALES INVOICE",
                invRecipientLabel: "To (Customer / Buyer):",
                invMgrLabel: "Responsible Officer / Manager:",
                lblGrandTotal: "Grand Total:",
                lblInvFooter: "* Valid official digital document issued by the Medicalpro system.",
                lblInvSign: "Verified By:",
                btnClearSign: "Clear Signature",
                btnCloseInv: "Close ✕",
                btnPrintInvPdf: "📄 Download PDF / Print Report",
                lblAdminLogTitle: "🔐 Admin Log In",
                btnAdminCancel: "Cancel",
                btnAdminSubmit: "Log In",
                lblAdminDashTitle: "⚙️ Admin Settings Panel",
                btnCloseAdminDash: "Close ✕",
                lblSetAddrTitle: "📍 Official Office / Company Address Settings (For Invoice)",
                btnSaveAddr: "Save Office Address",
                lblWaTitle: "💬 WhatsApp Administrator List Management (Customer Option)",
                lblWaSub: "Add admin names and WhatsApp numbers so customers can choose who receives the PO.",
                btnAddWa: "Add WhatsApp Admin",
                lblLogoTitle: "🖼️ Replace System Logo (Permanent & Synced Across All Phones)",
                btnSaveLogo: "Save Logo",
                lblAiSetTitle: "👩‍💻 Farm AI Assistant Management",
                btnSaveAi: "Save AI Settings",
                lblWorkerSetTitle: "Worker & Custom Job Desk Management",
                btnAddWorker: "Add Worker",
                lblBioSetTitle: "Add Master Bio Fertilizer Stock",
                btnSaveBio: "Save Fertilizer Stock",
                thInvName: "Name",
                thInvStock: "Stock",
                thInvAction: "Action"
            }
        };

        const workerTextDict = {
            "Tabur baja": { ms: "Tabur baja", id: "Tabur pupuk", zh: "施肥", hi: "उर्वरक फैलाना", en: "Spread fertilizer" },
            "Potong rumput": { ms: "Potong rumput", id: "Potong rumput", zh: "割草", hi: "घास काटना", en: "Cut grass" },
            "Simbah pokok": { ms: "Simbah pokok", id: "Siram tanaman", zh: "浇树", hi: "पौधों को पानी देना", en: "Water plants" },
            "Kemas kebun": { ms: "Kemas kebun", id: "Bersihkan kebun", zh: "清理农场", hi: "फार्म की सफाई", en: "Clean farm" },
            "Rawatan pokok ladang atas (1,2,3,4)": { ms: "Rawatan pokok ladang atas (1,2,3,4)", id: "Perawatan pohon kebun atas (1,2,3,4)", zh: "上层果树护理 (1,2,3,4)", hi: "ऊपरी खेत के पेड़ों की देखभाल (1,2,3,4)", en: "Upper farm tree treatment (1,2,3,4)" },
            "Rawatan pokok ladang bawah (1,2,3,4)": { ms: "Rawatan pokok ladang bawah (1,2,3,4)", id: "Perawatan pohon kebun bawah (1,2,3,4)", zh: "下层果树护理 (1,2,3,4)", hi: "निचले खेत के पेड़ों की देखभाल (1,2,3,4)", en: "Lower farm tree treatment (1,2,3,4)" },
            "Tiada": { ms: "Tiada", id: "Tidak ada", zh: "无", hi: "कोई नहीं", en: "None" }
        };

        const dynamicTranslateMap = {
            "Selesai ✓": { ms: "Selesai ✓", id: "Selesai ✓", zh: "已完成 ✓", hi: "पूर्ण ✓", en: "Completed ✓" },
            "Belum ada perbincangan atau pesan chat.": { ms: "Belum ada perbincangan atau pesan chat.", id: "Belum ada perbincangan atau pesan chat.", zh: "暂无讨论或聊天消息。", hi: "कोई चर्चा या चैट संदेश नहीं है।", en: "No discussions or chat messages yet." },
            "Memuat perbincangan ladang...": { ms: "Memuat perbincangan ladang...", id: "Memuat perbincangan ladang...", zh: "正在加载农场讨论...", hi: "फार्म चर्चा लोड हो रही है...", en: "Loading farm discussions..." },
            "Semua Bulan (Global)": { ms: "Semua Bulan (Global)", id: "Semua Bulan (Global)", zh: "所有月份 (全局)", hi: "सभी महीने (ग्लोबल)", en: "All Months (Global)" },
            "Bulan": { ms: "Bulan", id: "Bulan", zh: "月份", hi: "महीना", en: "Month" },
            "Tunai": { ms: "Tunai", id: "Tunai", zh: "现金", hi: "नकद", en: "Cash" },
            "Walk-in": { ms: "Walk-in", id: "Walk-in", zh: "现场购买", hi: "वॉक-इन", en: "Walk-in" }
        };

        function translateDynamicText(text) {
            if (!text) return text;
            if (dynamicTranslateMap[text] && dynamicTranslateMap[text][currentLang]) {
                return dynamicTranslateMap[text][currentLang];
            }
            if (workerTextDict[text] && workerTextDict[text][currentLang]) {
                return workerTextDict[text][currentLang];
            }
            return text;
        }

        function changeLang(lang) {
            currentLang = lang;
            localStorage.setItem('medicalpro_lang', lang);
            applyLanguage();
            initAiGreeting();
            renderTasks();
            renderSupplyApp();
            renderIncomeSales();
            renderOfficeSales();
            renderAdminCustomerOrders();
            loadBossOrdersRealtime();
        }

        function changeGlobalCurrency(curr) {
            currentCurrency = curr;
            localStorage.setItem('medicalpro_currency', curr);
            document.getElementById('expCurrencyDisplay').innerText = curr;
            document.getElementById('gProdCurrencyDisplay').innerText = curr;
            document.getElementById('prodCurrencyDisplay').innerText = curr;
            document.getElementById('globalCurrencySelect').value = curr;
            renderIncomeSales();
            renderOfficeSales();
            renderAdminCustomerOrders();
            renderExpenses();
        }

        function applyLanguage() {
            const t = translations[currentLang] || translations['ms'];
            
            ['ms', 'id', 'zh', 'hi', 'en'].forEach(l => {
                const btn = document.getElementById('btnLang' + l.toUpperCase());
                if(btn) {
                    if(l === currentLang) {
                        btn.className = "px-2.5 py-1 rounded text-xs bg-blue-900 text-white font-bold";
                    } else {
                        btn.className = "px-2.5 py-1 rounded text-xs bg-yellow-600 text-white";
                    }
                }
            });

            const map = {
                pageTitle: t.pageTitle,
                mWelcomeTitle: t.mWelcomeTitle,
                mWelcomeSub: t.mWelcomeSub,
                mLblRealName: t.mLblRealName,
                mLblGender: t.mLblGender,
                mBtnSaveUser: t.mBtnSaveUser,
                lblGardenName: t.lblGardenName,
                lblSubHeader: t.lblSubHeader,
                lblPartnership: t.lblPartnership,
                btnAdminPanel: t.btnAdminPanel,
                lblAudioBanner: t.lblAudioBanner,
                lblAudioBtn: t.lblAudioBtn,
                lblAiName: t.lblAiName,
                lblMemActive: t.lblMemActive,
                aiGreetingSubtitle: t.aiSubtitle,
                btnVoiceChat: t.btnVoiceChat,
                btnRepeat: t.btnRepeat,
                btnAiSummary: t.btnAiSummary,
                btnAiBaja: t.btnAiBaja,
                btnAiMem: t.btnAiMem,
                btnAiSend: t.btnAiSend,
                lblWeatherCurrent: t.lblWeatherCurrent,
                lblHourlyForecast: t.lblHourlyForecast,
                illustrationTitle: t.lblIllustrationTitle,
                weatherIllustrationText: t.lblIllustrationText,
                lblPrecip: t.lblPrecip,
                lblWind: t.lblWind,
                lblAiDecision: t.lblAiDecision,
                lblBossPortalTitle: t.lblBossPortalTitle,
                lblChatImg: t.lblChatImg,
                btnSendOrder: t.btnSendOrder,
                lblHistoryTitle: t.lblHistoryTitle,
                navTasks: t.navTasks,
                navSupply: t.navSupply,
                navStock: t.navStock,
                navAssets: t.navAssets,
                navExpenses: t.navExpenses,
                navIncome: t.navIncome,
                navOffice: t.navOffice,
                navPo: t.navPo,
                sectionTaskTitle: t.sectionTaskTitle,
                lblFilterFrom: t.lblFilterFrom,
                lblFilterTo: t.lblFilterTo,
                optAllMonths: t.optAllMonths,
                btnPrintTaskPdf: t.btnPrintTaskPdf,
                lblUseBioStock: t.lblUseBioStock,
                optNoStock: t.optNoStock,
                lblQtyUsed: t.lblQtyUsed,
                lblPhotoAttach: t.lblPhotoAttach,
                btnTaskSubmit: t.btnTaskSubmit,
                btnCancelTaskEdit: t.btnCancelTaskEdit,
                thTaskPhoto: t.thTaskPhoto,
                thTaskTitle: t.thTaskTitle,
                thTaskCat: t.thTaskCat,
                thTaskWorker: t.thTaskWorker,
                thTaskDate: t.thTaskDate,
                thTaskStock: t.thTaskStock,
                thTaskStatus: t.thTaskStatus,
                thTaskAction: t.thTaskAction,
                lblSupplyMgmtTitle: t.lblSupplyMgmtTitle,
                lblSupplyMgmtSub: t.lblSupplyMgmtSub,
                btnPrintSupplyPdf: t.btnPrintSupplyPdf,
                supplyFormTitle: t.supplyFormTitle,
                lblHarvestDate: t.lblHarvestDate,
                lblHarvestItem: t.lblHarvestItem,
                lblHarvestQty: t.lblHarvestQty,
                lblHarvestDesc: t.lblHarvestDesc,
                btnSupplySubmit: t.btnSupplySubmit,
                btnCancelSupplyEdit: t.btnCancelSupplyEdit,
                lblStockSummaryTitle: t.lblStockSummaryTitle,
                lblSupplyHistoryTitle: t.lblSupplyHistoryTitle,
                thSupplyDate: t.thSupplyDate,
                thSupplyItem: t.thSupplyItem,
                thSupplyStatus: t.thSupplyStatus,
                thSupplyQty: t.thSupplyQty,
                thSupplyDesc: t.thSupplyDesc,
                thSupplyAction: t.thSupplyAction,
                lblBioBajaTitle: t.lblBioBajaTitle,
                lblAssetTitle: t.lblAssetTitle,
                expenseFormTitle: t.expenseFormTitle,
                btnPrintExpPdf: t.btnPrintExpPdf,
                lblExpReceipt: t.lblExpReceipt,
                btnExpenseSubmit: t.btnExpenseSubmit,
                btnCancelExpenseEdit: t.btnCancelExpenseEdit,
                thExpReceipt: t.thExpReceipt,
                thExpDesc: t.thExpDesc,
                thExpCost: t.thExpCost,
                thExpDate: t.thExpDate,
                thExpAction: t.thExpAction,
                lblIncomeTitle: t.lblIncomeTitle,
                lblIncomeSub: t.lblIncomeSub,
                btnPrintIncomePdf: t.btnPrintIncomePdf,
                lblStaffLoginTitle: t.lblStaffLoginTitle,
                staffStatusText: t.staffStatusText,
                btnStaffLogin: t.btnStaffLogin,
                lblAddGardenProd: t.lblAddGardenProd,
                btnSaveGardenProd: t.btnSaveGardenProd,
                lblGardenSalesTitle: t.lblGardenSalesTitle,
                lblSelectGardenProd: t.lblSelectGardenProd,
                lblGardenQty: t.lblGardenQty,
                lblGardenTotalAmt: t.lblGardenTotalAmt,
                lblGardenBuyer: t.lblGardenBuyer,
                lblGardenBuyerAddr: t.lblGardenBuyerAddr,
                lblGardenBuyerPhone: t.lblGardenBuyerPhone,
                lblGardenSalesDate: t.lblGardenSalesDate,
                lblGardenSalesPhoto: t.lblGardenSalesPhoto,
                btnGardenSalesSubmit: t.btnGardenSalesSubmit,
                lblGardenHistoryTitle: t.lblGardenHistoryTitle,
                thIncDate: t.thIncDate,
                thIncProd: t.thIncProd,
                thIncQty: t.thIncQty,
                thIncTotal: t.thIncTotal,
                thIncBuyer: t.thIncBuyer,
                thIncAction: t.thIncAction,
                lblPoTitle: t.lblPoTitle,
                lblPoSub: t.lblPoSub,
                lblPoLoginTitle: t.lblPoLoginTitle,
                lblPoLoginSub: t.lblPoLoginSub,
                btnPoLogin: t.btnPoLogin,
                thPoNo: t.thPoNo,
                thPoDate: t.thPoDate,
                thPoCustomer: t.thPoCustomer,
                thPoItems: t.thPoItems,
                thPoShipping: t.thPoShipping,
                thPoStatus: t.thPoStatus,
                thPoAction: t.thPoAction,
                tdPoWait: t.tdPoWait,
                lblOfficeTitle: t.lblOfficeTitle,
                lblOfficeSub: t.lblOfficeSub,
                btnPrintOfficePdf: t.btnPrintOfficePdf,
                lblOfficeLoginTitle: t.lblOfficeLoginTitle,
                officeStatusText: t.officeStatusText,
                btnOfficeLogin: t.btnOfficeLogin,
                officeFormTitleLabel: t.officeFormTitleLabel,
                btnCancelOfficeEdit: t.btnCancelOfficeEdit,
                lblProdBenefits: t.lblProdBenefits,
                btnOfficeProdSubmit: t.btnOfficeProdSubmit,
                officeSalesFormTitle: t.officeSalesFormTitle,
                lblSelectOfficeProd: t.lblSelectOfficeProd,
                lblOfficeQty: t.lblOfficeQty,
                lblOfficeTotalAmt: t.lblOfficeTotalAmt,
                lblOfficeBuyer: t.lblOfficeBuyer,
                lblOfficeBuyerAddr: t.lblOfficeBuyerAddr,
                lblOfficeBuyerPhone: t.lblOfficeBuyerPhone,
                lblOfficeSalesDate: t.lblOfficeSalesDate,
                lblOfficeSalesPhoto: t.lblOfficeSalesPhoto,
                btnOfficeSalesSubmit: t.btnOfficeSalesSubmit,
                btnCancelOfficeSalesEdit: t.btnCancelOfficeSalesEdit,
                lblOfficeHistoryTitle: t.lblOfficeHistoryTitle,
                thOffDate: t.thOffDate,
                thOffProd: t.thOffProd,
                thOffQty: t.thOffQty,
                thOffTotal: t.thOffTotal,
                thOffBuyer: t.thOffBuyer,
                thOffAction: t.thOffAction,
                invModalMainHeader: t.invModalMainHeader,
                invRecipientLabel: t.invRecipientLabel,
                invMgrLabel: t.invMgrLabel,
                lblGrandTotal: t.lblGrandTotal,
                lblInvFooter: t.lblInvFooter,
                lblInvSign: t.lblInvSign,
                btnClearSign: t.btnClearSign,
                btnCloseInv: t.btnCloseInv,
                btnPrintInvPdf: t.btnPrintInvPdf,
                lblAdminLogTitle: t.lblAdminLogTitle,
                btnAdminCancel: t.btnAdminCancel,
                btnAdminSubmit: t.btnAdminSubmit,
                lblAdminDashTitle: t.lblAdminDashTitle,
                btnCloseAdminDash: t.btnCloseAdminDash,
                lblSetAddrTitle: t.lblSetAddrTitle,
                btnSaveAddr: t.btnSaveAddr,
                lblWaTitle: t.lblWaTitle,
                lblWaSub: t.lblWaSub,
                btnAddWa: t.btnAddWa,
                lblLogoTitle: t.lblLogoTitle,
                btnSaveLogo: t.btnSaveLogo,
                lblAiSetTitle: t.lblAiSetTitle,
                btnSaveAi: t.btnSaveAi,
                lblWorkerSetTitle: t.lblWorkerSetTitle,
                btnAddWorker: t.btnAddWorker,
                lblBioSetTitle: t.lblBioSetTitle,
                btnSaveBio: t.btnSaveBio,
                thInvName: t.thInvName,
                thInvStock: t.thInvStock,
                thInvAction: t.thInvAction
            };

            for(let [id, val] of Object.entries(map)) {
                let el = document.getElementById(id);
                if(el) el.innerText = val;
            }
        }

        function checkUserProfile() {
            if (!currentUser || !currentUser.name) {
                document.getElementById('userProfileModal').classList.remove('hidden');
            } else {
                initAiGreeting();
            }
        }

        function saveUserProfile() {
            const name = document.getElementById('inputUserRealName').value.trim();
            const gender = document.getElementById('inputUserGender').value;
            const profileFile = document.getElementById('inputUserProfilePhoto').files[0];
            
            removeImageBackground(profileFile, function(transparentAvatar) {
                currentUser = { 
                    name: name || "Abdul Rojak", 
                    gender, 
                    avatar: transparentAvatar || "" 
                };
                localStorage.setItem('medicalpro_user_profile', JSON.stringify(currentUser));
                document.getElementById('userProfileModal').classList.add('hidden');
                initAiGreeting();
            });
        }

        let aiConfig = { name: "Asisten Ladang AI", avatar: "" };
        let globalLogoUrl = "";
        let officeCompanyAddress = "Machap, Johor, Malaysia | No. MyGAP: 24.0151";
        let adminWhatsappList = [];
        let lastSpokenText = "";
        let currentWeatherData = { rainSoon: false };
        let globalAiMemory = [];
        let aiTrainingRules = [];
        let aiUnresolvedLogs = [];

        function stopAllAiAudio() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            document.querySelectorAll('audio').forEach(audioEl => {
                audioEl.pause();
                audioEl.currentTime = 0;
            });
        }

        function applyGlobalLogo() {
            if (globalLogoUrl) {
                const img1 = document.getElementById('headerLogoImg');
                const img2 = document.getElementById('invModalLogoImg');
                if(img1) img1.src = globalLogoUrl;
                if(img2) img2.src = globalLogoUrl;
            }
        }

        function saveGlobalLogo() {
            const file = document.getElementById('settingLogoInput').files[0];
            compressImageHD(file, function(base64) {
                if (base64) {
                    globalLogoUrl = base64;
                    if (db) db.collection("settings").doc("global_logo").set({ url: base64 }).catch(() => {});
                    applyGlobalLogo();
                    alert("Logo sistem berjaya dikemaskini untuk semua telefon!");
                }
            });
        }

        function saveOfficeAddressSetting() {
            const addr = document.getElementById('settingOfficeAddressInput').value.trim();
            if (addr) {
                officeCompanyAddress = addr;
                if (db) db.collection("settings").doc("office_address").set({ address: addr }).catch(() => {});
                alert("Alamat rasmi pejabat berjaya dikemaskini untuk semua invois!");
            }
        }

        function addAdminWhatsapp() {
            const name = document.getElementById('adminWhatsappName').value.trim();
            const phone = document.getElementById('adminWhatsappPhone').value.trim();
            if (name && phone) {
                adminWhatsappList.push({ name, phone });
                if (db) db.collection("settings").doc("admin_whatsapp").set({ list: adminWhatsappList }).then(() => {
                    document.getElementById('adminWhatsappName').value = "";
                    document.getElementById('adminWhatsappPhone').value = "";
                    renderAdminWhatsappList();
                    alert("Pentadbir WhatsApp berjaya ditambah!");
                });
            }
        }

        function deleteAdminWhatsapp(index) {
            adminWhatsappList.splice(index, 1);
            if (db) db.collection("settings").doc("admin_whatsapp").set({ list: adminWhatsappList }).then(() => {
                renderAdminWhatsappList();
            });
        }

        function renderAdminWhatsappList() {
            const container = document.getElementById('adminWhatsappListTags');
            if (!container) return;
            container.innerHTML = "";
            if (adminWhatsappList.length === 0) {
                container.innerHTML = `<span class="text-xs text-slate-400">Belum ada pentadbir WhatsApp didaftarkan.</span>`;
                return;
            }
            adminWhatsappList.forEach((adm, idx) => {
                container.innerHTML += `
                    <div class="flex justify-between items-center bg-white p-2 rounded-lg border text-xs">
                        <span>📱 <b>${adm.name}</b> (${adm.phone})</span>
                        <button type="button" onclick="deleteAdminWhatsapp(${idx})" class="text-rose-600 font-bold px-2 py-1">Padam</button>
                    </div>
                `;
            });
        }

        function applyAiSettings() {
            document.getElementById('lblAiName').innerText = aiConfig.name || "Asisten Ladang AI";
            const settingInput = document.getElementById('settingAiName');
            if (settingInput) settingInput.value = aiConfig.name || "Asisten Ladang AI";
            if (aiConfig.avatar) {
                document.getElementById('aiAvatarContainer').innerHTML = `<img src="${aiConfig.avatar}" class="w-full h-full object-cover">`;
            }
        }

        if (db) {
            db.collection("settings").doc("ai_config").get().then((doc) => {
                if (doc.exists) { aiConfig = doc.data(); applyAiSettings(); }
            }).catch(() => {});
            db.collection("settings").doc("global_logo").get().then((doc) => {
                if (doc.exists && doc.data().url) { globalLogoUrl = doc.data().url; applyGlobalLogo(); }
            }).catch(() => {});
            db.collection("settings").doc("office_address").get().then((doc) => {
                if (doc.exists && doc.data().address) {
                    officeCompanyAddress = doc.data().address;
                    const addrInput = document.getElementById('settingOfficeAddressInput');
                    if (addrInput) addrInput.value = officeCompanyAddress;
                }
            }).catch(() => {});
            db.collection("settings").doc("admin_whatsapp").get().then((doc) => {
                if (doc.exists && doc.data().list) {
                    adminWhatsappList = doc.data().list;
                    renderAdminWhatsappList();
                }
            }).catch(() => {});
            db.collection("settings").doc("ai_training").get().then((doc) => {
                if (doc.exists && doc.data().rules) {
                    aiTrainingRules = doc.data().rules;
                    renderAiTrainingRules();
                }
            }).catch(() => {});

            db.collection("ai_global_memory").orderBy("timestamp", "desc").limit(50).onSnapshot(snapshot => {
                globalAiMemory = [];
                snapshot.forEach(doc => {
                    globalAiMemory.push(doc.data());
                });
            });

            db.collection("ai_unresolved_logs").orderBy("timestamp", "desc").limit(30).onSnapshot(snapshot => {
                aiUnresolvedLogs = [];
                snapshot.forEach(doc => {
                    aiUnresolvedLogs.push({ firestoreId: doc.id, ...doc.data() });
                });
                renderUnresolvedLogs();
            });
        } else { applyAiSettings(); }

        function saveAiSettings() {
            aiConfig.name = document.getElementById('settingAiName').value;
            compressImageHD(document.getElementById('settingAiAvatarInput').files[0], function(base64Img) {
                if (base64Img) aiConfig.avatar = base64Img;
                if (db) db.collection("settings").doc("ai_config").set(aiConfig).catch(() => {});
                applyAiSettings();
                alert("Tetapan AI berjaya dikemaskini!");
            });
        }

        function saveAiTrainingRule() {
            const prefix = document.getElementById('aiTrainPrefix').value.trim();
            const keyword = document.getElementById('aiTrainKeyword').value.trim().toLowerCase();
            const answer = document.getElementById('aiTrainAnswer').value.trim();
            if (keyword && answer) {
                aiTrainingRules.push({ prefix, keyword, answer });
                if (db) {
                    db.collection("settings").doc("ai_training").set({ rules: aiTrainingRules }).then(() => {
                        document.getElementById('aiTrainPrefix').value = "";
                        document.getElementById('aiTrainKeyword').value = "";
                        document.getElementById('aiTrainAnswer').value = "";
                        renderAiTrainingRules();
                        alert("Aturan pelatihan AI berjaya disimpan!");
                    });
                }
            } else {
                alert("Sila isi kata kunci dan kata tambahan 2!");
            }
        }

        function deleteAiTrainingRule(index) {
            aiTrainingRules.splice(index, 1);
            if (db) {
                db.collection("settings").doc("ai_training").set({ rules: aiTrainingRules }).then(() => {
                    renderAiTrainingRules();
                });
            }
        }

        function renderAiTrainingRules() {
            const container = document.getElementById('aiTrainingRulesContainer');
            if (!container) return;
            container.innerHTML = "";
            if (aiTrainingRules.length === 0) {
                container.innerHTML = `<span class="text-[11px] text-slate-400">Belum ada aturan latihan kosa kata.</span>`;
                return;
            }
            aiTrainingRules.forEach((rule, idx) => {
                container.innerHTML += `
                    <div class="flex justify-between items-center bg-white p-2 rounded border text-xs">
                        <div>
                            <span class="font-bold text-purple-900">🔑 Kunci: [${rule.keyword}]</span><br>
                            <span class="text-[10px] text-slate-600">Awalan: "${rule.prefix || '-'}" | Jawapan: "${rule.answer}"</span>
                        </div>
                        <button type="button" onclick="deleteAiTrainingRule(${idx})" class="text-rose-600 font-bold px-2 py-1 text-[11px]">Padam</button>
                    </div>
                `;
            });
        }

        function renderUnresolvedLogs() {
            const container = document.getElementById('aiUnresolvedLogsContainer');
            if (!container) return;
            container.innerHTML = "";
            if (aiUnresolvedLogs.length === 0) {
                container.innerHTML = `<span class="text-[11px] text-slate-400">Tiada pertanyaan baru yang belum dikenal.</span>`;
                return;
            }
            aiUnresolvedLogs.forEach((log) => {
                container.innerHTML += `
                    <div class="flex justify-between items-center bg-slate-50 p-1.5 rounded border text-[11px]">
                        <div>
                            <span class="font-bold text-slate-800">👤 ${log.user}:</span> "${log.query}"
                        </div>
                        <button type="button" onclick="resolveLog('${log.firestoreId}')" class="text-emerald-700 font-bold px-1.5 py-0.5 bg-emerald-100 rounded">Selesai ✓</button>
                    </div>
                `;
            });
        }

        function resolveLog(firestoreId) {
            if (db) {
                db.collection("ai_unresolved_logs").doc(firestoreId).delete().catch(() => {});
            }
        }

        function speakText(text) {
            lastSpokenText = text;
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
                
                let langCode = 'ms-MY';
                if(currentLang === 'id') langCode = 'id-ID';
                else if(currentLang === 'zh') langCode = 'zh-CN';
                else if(currentLang === 'hi') langCode = 'hi-IN';
                else if(currentLang === 'en') langCode = 'en-US';
                
                utterance.lang = langCode;
                utterance.rate = 1.0;

                let voices = window.speechSynthesis.getVoices();
                let selectedVoice = voices.find(v => (v.lang.includes(langCode.substring(0, 2)) || v.lang.includes(currentLang)) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('pria') || v.name.toLowerCase().includes('lelaki')));

                if (!selectedVoice) {
                    selectedVoice = voices.find(v => v.lang.includes(langCode.substring(0, 2)) || v.lang.includes(currentLang));
                }

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                window.speechSynthesis.speak(utterance);
            }
        }
        function speakLastAiMessage() { stopAllAiAudio(); if (lastSpokenText) speakText(lastSpokenText); }

        function getFullTitleName() {
            if (!currentUser) return "Dato Abdul Rojak";
            let title = currentUser.gender || "Dato";
            let name = currentUser.name || "Abdul Rojak";
            return `${title} ${name}`;
        }

        function getRealNameOnly() {
            if (!currentUser || !currentUser.name) return "Abdul Rojak";
            return currentUser.name;
        }

        let workers = [];
        let inventory = [];
        let tasks = [];
        let supplyData = [];
        let expenses = [];
        let gardenProducts = [];
        let incomeList = [];
        let officeProducts = [];
        let officeSales = [];
        let customerOrdersList = [];

        function saveConversationToCloud(userText, aiReply, isUnresolved = false) {
            if (db) {
                db.collection("ai_global_memory").add({
                    user: getFullTitleName(),
                    userText: userText,
                    aiReply: aiReply,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(() => {});

                if (isUnresolved) {
                    db.collection("ai_unresolved_logs").add({
                        user: getFullTitleName(),
                        query: userText,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(() => {});
                }
            }
        }

        function generateFriendlyAiResponse(queryType = 'welcome', manualText = '') {
            const fullName = getFullTitleName();

            let lowStockItems = inventory.filter(i => i.stock < 5).map(i => i.name);
            let bajaWarning = lowStockItems.length > 0 ? `⚠️ Perhatian: Stok baja berikut hampir habis: ${lowStockItems.join(', ')}!` : `✅ Stok bio baja dalam keadaan selamat dan mencukupi.`;

            let lastBajaTask = tasks.find(t => t.title.toLowerCase().includes('baja') || t.category.toLowerCase().includes('baja') || t.title.toLowerCase().includes('pupuk'));
            let daysSinceBaja = 999;
            if (lastBajaTask && lastBajaTask.date) {
                let diffTime = Math.abs(new Date() - new Date(lastBajaTask.date));
                daysSinceBaja = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            let pemupukanAdvice = "";
            if (daysSinceBaja >= 14) {
                pemupukanAdvice = `🌱 Cadangan Pembajaan: Sudah ${daysSinceBaja} hari sejak pembajaan terakhir. Hari ini sangat disarankan melakukan pembajaan bio baja.`;
            } else {
                let sisaHari = 14 - daysSinceBaja;
                pemupukanAdvice = `🌱 Cadangan Pembajaan: Pembajaan terakhir baru ${daysSinceBaja} hari lalu. Jadual pembajaan berikutnya sekitar ${sisaHari} hari lagi.`;
            }

            let totalEx = expenses.reduce((s, e) => s + parseFloat(e.amount.replace(/[^0-9.]/g, '') || 0), 0);
            let totalInc = incomeList.reduce((s, i) => s + parseFloat(i.total.replace(/[^0-9.]/g, '') || 0), 0);
            let totalOffice = officeSales.reduce((s, o) => s + parseFloat(o.total.replace(/[^0-9.]/g, '') || 0), 0);

            let responseText = "";
            let customPrefix = "Selamat datang kembali,";
            let matchedTraining = null;

            if (manualText) {
                let lowerText = manualText.toLowerCase();
                matchedTraining = aiTrainingRules.find(rule => lowerText.includes(rule.keyword));
                if (matchedTraining) {
                    if (matchedTraining.prefix) customPrefix = matchedTraining.prefix;
                    let stockInfoSummary = `📊 Rumusan Data Stok: Jumlah item stok bio baja aktif ${inventory.length} jenis.`;
                    responseText = `${customPrefix} ${fullName}! 🌿 ${matchedTraining.answer}\n\n${stockInfoSummary}\n${bajaWarning}`;
                }
            }

            if (!matchedTraining) {
                if (queryType === 'rekap') {
                    responseText = `📊 Rumusan Sistem & Kewangan Ladang (${currentCurrency}):\n• Jumlah Pekerja: ${workers.length} orang\n• Jumlah Perbelanjaan: ${currentCurrency} ${totalEx.toFixed(2)}\n• Jualan Hasil Ladang: ${currentCurrency} ${totalInc.toFixed(2)}\n• Jualan Produk & Invois Luar Talian: ${currentCurrency} ${totalOffice.toFixed(2)}\n• ${bajaWarning}`;
                } else if (queryType === 'baja') {
                    responseText = `🧪 Analisis & Jadual Pembajaan (Kitaran 2 Minggu):\n${bajaWarning}\n${pemupukanAdvice}`;
                } else if (queryType === 'memori') {
                    let recentMemoryCount = globalAiMemory.length;
                    responseText = `🧠 Memori Global & Kosa Kata Mandiri:\n• Jumlah Perbualan Disimpan: ${recentMemoryCount} interaksi.\nAI terus merekod setiap input pautan dan kosa kata baharu agar semakin pintar!`;
                } else {
                    responseText = `Selamat datang kembali, ${fullName}! 🌿 Asisten mandiri Medicalpro siap membantu. Semua riwayat perbualan dan rujukan pautan diselaraskan dengan baik.`;
                }
            }

            if (currentLang === 'id') {
                responseText = responseText
                    .replace(/Rumusan Sistem & Kewangan Ladang/g, 'Rekap Sistem & Keuangan Ladang')
                    .replace(/Jumlah Pekerja/g, 'Jumlah Pekerja')
                    .replace(/Jumlah Perbelanjaan/g, 'Total Pengeluaran')
                    .replace(/Jualan Hasil Ladang/g, 'Penjualan Hasil Kebun')
                    .replace(/Jualan Produk & Invois Luar Talian/g, 'Penjualan Produk & Invoice Offline')
                    .replace(/Perhatian/g, 'Perhatian')
                    .replace(/Stok baja berikut hampir habis/g, 'Stok pupuk berikut hampir habis')
                    .replace(/Stok bio baja dalam keadaan selamat dan mencukupi/g, 'Stok bio pupuk dalam keadaan aman dan mencukupi')
                    .replace(/Analisis & Jadual Pembajaan/g, 'Analisis & Jadwal Pemupukan')
                    .replace(/Cadangan Pembajaan/g, 'Saran Pemupukan')
                    .replace(/Sudah/g, 'Sudah')
                    .replace(/hari sejak pembajaan terakhir/g, 'hari sejak pemupukan terakhir')
                    .replace(/hari lalu/g, 'hari lalu')
                    .replace(/Jadual pembajaan berikutnya sekitar/g, 'Jadwal pemupukan berikutnya sekitar')
                    .replace(/hari lagi/g, 'hari lagi')
                    .replace(/Selamat datang kembali/g, 'Selamat datang kembali')
                    .replace(/Asisten mandiri Medicalpro siap membantu/g, 'Asisten mandiri Medicalpro siap membantu')
                    .replace(/Semua riwayat perbualan dan rujukan pautan diselaraskan dengan baik/g, 'Semua riwayat obrolan dan referensi tautan diselaraskan dengan baik');
            } else if (currentLang === 'en') {
                responseText = responseText
                    .replace(/Rumusan Sistem & Kewangan Ladang/g, 'Farm System & Financial Summary')
                    .replace(/Jumlah Pekerja/g, 'Total Workers')
                    .replace(/Jumlah Perbelanjaan/g, 'Total Expenses')
                    .replace(/Jualan Hasil Ladang/g, 'Direct Farm Sales')
                    .replace(/Jualan Produk & Invois Luar Talian/g, 'Offline Products & Invoices Sales')
                    .replace(/Perhatian/g, 'Attention')
                    .replace(/Stok baja berikut hampir habis/g, 'The following fertilizer stock is running low')
                    .replace(/Stok bio baja dalam keadaan selamat dan mencukupi/g, 'Bio fertilizer stock is safe and sufficient')
                    .replace(/Analisis & Jadual Pembajaan/g, 'Fertilization Analysis & Schedule')
                    .replace(/Cadangan Pembajaan/g, 'Fertilization Recommendation')
                    .replace(/Sudah/g, 'It has been')
                    .replace(/hari sejak pembajaan terakhir/g, 'days since last fertilization')
                    .replace(/hari lalu/g, 'days ago')
                    .replace(/Jadual pembajaan berikutnya sekitar/g, 'Next fertilization schedule in about')
                    .replace(/hari lagi/g, 'days')
                    .replace(/Selamat datang kembali/g, 'Welcome back')
                    .replace(/Asisten mandiri Medicalpro siap membantu/g, 'Medicalpro autonomous assistant is ready to help')
                    .replace(/Semua riwayat perbualan dan rujukan pautan diselaraskan dengan baik/g, 'All chat history and link references are properly synced');
            } else if (currentLang === 'zh') {
                responseText = `欢迎回来，${fullName}! 🌿 Medicalpro 智能助手随时为您服务。系统数据正常，所有云端记忆已同步。`;
            } else if (currentLang === 'hi') {
                responseText = `वापसी पर स्वागत है, ${fullName}! 🌿 मेडिकलप्रो स्मार्ट सहायक आपकी सहायता के लिए तैयार है। सभी डेटा और मेमोरी सिंक हो चुके हैं।`;
            }

            if (manualText) {
                let isUnresolved = !matchedTraining && queryType === 'product_query';
                saveConversationToCloud(manualText, responseText, isUnresolved);
            }

            return responseText;
        }

        function initAiGreeting() {
            stopAllAiAudio();
            let res = generateFriendlyAiResponse('welcome');
            const chatBox = document.getElementById('aiChatResponseBox');
            if (chatBox) chatBox.innerText = res;
            speakText(res);
        }

        function askAi(topic) {
            stopAllAiAudio();
            let res = generateFriendlyAiResponse(topic);
            const chatBox = document.getElementById('aiChatResponseBox');
            if (chatBox) chatBox.innerText = res;
            speakText(res);
        }

        function handleAiManualQuery(e) {
            e.preventDefault();
            stopAllAiAudio();
            const val = document.getElementById('aiManualInput').value.trim().toLowerCase();
            if (val) {
                let queryType = 'product_query';
                if (val.includes('rekap') || val.includes('rumusan') || val.includes('bulan')) queryType = 'rekap';
                else if (val.includes('baja') || val.includes('pupuk') || val.includes('minggu')) queryType = 'baja';
                else if (val.includes('memori') || val.includes('kosa kata') || val.includes('ingatan')) queryType = 'memori';
                
                let res = generateFriendlyAiResponse(queryType, val);
                const chatBox = document.getElementById('aiChatResponseBox');
                if (chatBox) chatBox.innerText = res;
                speakText(res);
                document.getElementById('aiManualInput').value = "";
            }
        }

        function startVoiceChat() {
            stopAllAiAudio();
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) { alert("Pelayar tidak menyokong suara."); return; }
            const recognition = new SpeechRecognition();
            let langCode = 'ms-MY';
            if(currentLang === 'id') langCode = 'id-ID';
            else if(currentLang === 'zh') langCode = 'zh-CN';
            else if(currentLang === 'hi') langCode = 'hi-IN';
            else if(currentLang === 'en') langCode = 'en-US';
            recognition.lang = langCode;
            const statusNotice = document.getElementById('voiceStatusNotice');
            statusNotice.classList.remove('hidden');

            recognition.onresult = function(event) {
                statusNotice.classList.add('hidden');
                let speech = event.results[0][0].transcript.toLowerCase();
                let qType = 'product_query';
                if (speech.includes('baja') || speech.includes('pupuk')) qType = 'baja';
                else if (speech.includes('memori')) qType = 'memori';
                else if (speech.includes('rekap') || speech.includes('rumusan')) qType = 'rekap';

                let res = generateFriendlyAiResponse(qType, speech);
                document.getElementById('aiChatResponseBox').innerText = res;
                speakText(res);
            };
            recognition.onerror = recognition.onend = function() { statusNotice.classList.add('hidden'); };
            try { recognition.start(); } catch(e) {}
        }

        function switchTab(tabId) {
            document.querySelectorAll('.tab-page').forEach(p => p.classList.add('hidden'));
            const target = document.getElementById('page-' + tabId);
            if (target) target.classList.remove('hidden');
            document.querySelectorAll('[id^="tabBtn-"]').forEach(b => {
                b.className = "bg-white text-emerald-700 p-2.5 rounded-xl shadow-sm border text-center font-semibold text-xs";
            });
            const activeBtn = document.getElementById('tabBtn-' + tabId);
            if (activeBtn) {
                if(tabId === 'office') {
                    activeBtn.className = "bg-blue-700 text-white p-2.5 rounded-xl shadow-md border text-center font-bold text-xs";
                } else if(tabId === 'customer_orders') {
                    activeBtn.className = "bg-indigo-600 text-white p-2.5 rounded-xl shadow-md border text-center font-bold text-xs";
                } else {
                    activeBtn.className = "bg-emerald-600 text-white p-2.5 rounded-xl shadow-md border text-center font-bold text-xs";
                }
            }
        }

        function updateLiveClockAndWeather() {
            const now = new Date();
            const options = { timeZone: 'Asia/Kuala_Lumpur', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
            
            const clockEl = document.getElementById('liveClock');
            if (clockEl) clockEl.innerText = timeString;

            fetch('https://api.open-meteo.com/v1/forecast?latitude=1.8227&longitude=103.3106&current_weather=true&hourly=temperature_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKuala_Lumpur')
                .then(res => res.json())
                .then(data => {
                    if (data && data.current_weather && data.hourly) {
                        const temp = Math.round(data.current_weather.temperature);
                        const windSpeed = Math.round(data.current_weather.windspeed);
                        const feelsLike = Math.round(temp + 2);
                        
                        const hourlyTime = data.hourly.time;
                        const hourlyPrecip = data.hourly.precipitation;
                        const hourlyTemp = data.hourly.temperature_2m;

                        const malaysiaHourStr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: 'numeric', hour12: false }).format(now);
                        const currentHourInt = parseInt(malaysiaHourStr, 10);

                        const todayDateStr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).split('/').reverse().join('-');
                        const currentExactIsoStr = `${todayDateStr}T${String(currentHourInt).padStart(2, '0')}:00`;

                        let idx = hourlyTime.findIndex(t => t === currentExactIsoStr);
                        if (idx === -1) {
                            idx = hourlyTime.findIndex(t => t.includes(`T${String(currentHourInt).padStart(2, '0')}:`));
                            if (idx === -1) idx = 0;
                        }

                        let isNight = currentHourInt < 6 || currentHourInt >= 18;
                        let currentPrecipNow = hourlyPrecip[idx] || 0;
                        let rainSoon = currentPrecipNow > 0.1;
                        
                        currentWeatherData = { temp, windSpeed, rainSoon, currentPrecipNow };

                        let condText = rainSoon ? "Hujan Rintik" : (isNight ? "Malam Tenang" : "Berawan Separa");
                        let mainIcon = rainSoon ? "🌧️" : (isNight ? "🌙" : "⛅");

                        let aiRecommendationText = "";
                        if (currentHourInt >= 17 || currentHourInt < 7) {
                            aiRecommendationText = `🌙 <b>Waktu Rehat Pekerja:</b> Sudah lewat pukul 5 petang. Disarankan menghentikan aktiviti ladang dan membenarkan pekerja berehat/tidur malam hingga jam 7:00–8:00 pagi esok.`;
                        } else if (currentHourInt >= 12 && currentHourInt < 14) {
                            aiRecommendationText = `☀️ <b>Waktu Rehat Tengah Hari:</b> Pukul ${currentHourInt}:00. Sesi rehat tengah hari selama 2 jam (12:00 - 14:00). Pekerja dihentikan sementara dari kerja berat.`;
                        } else if (rainSoon) {
                            aiRecommendationText = `⚠️ <b>Perhatian ${getRealNameOnly()}!</b> Terkesan potensi hujan (${currentPrecipNow} mm). Disarankan menangguhkan semburan bio baja cair supaya tidak luntur tercuci air hujan.`;
                        } else if (temp > 33) {
                            aiRecommendationText = `☀️ Suhu agak terik (${temp}°C). Pastikan penyiraman anak pokok Belimbing Buluh dan tanaman herba dicukupkan pada waktu pagi atau petang.`;
                        } else {
                            aiRecommendationText = `✨ Cuaca stabil (${temp}°C). Sesi kerja aktif berjalan. Keadaan ideal untuk aktiviti ladang.`;
                        }

                        if (document.getElementById('tempDisplay')) document.getElementById('tempDisplay').innerText = `${temp}°`;
                        if (document.getElementById('condDisplay')) document.getElementById('condDisplay').innerText = condText;
                        if (document.getElementById('feelsLikeDisplay')) document.getElementById('feelsLikeDisplay').innerText = `Terasa seperti ${feelsLike}°`;
                        if (document.getElementById('weatherMainIconContainer')) document.getElementById('weatherMainIconContainer').innerText = mainIcon;
                        if (document.getElementById('detailWind')) document.getElementById('detailWind').innerText = `${windSpeed} km/j`;
                        if (document.getElementById('smartRecommendation')) document.getElementById('smartRecommendation').innerHTML = aiRecommendationText;

                        const hContainer = document.getElementById('hourlyForecastContainer');
                        if (hContainer) {
                            hContainer.innerHTML = "";
                            for (let i = 0; i < 8; i++) {
                                let tIdx = idx + i;
                                if (tIdx < hourlyTime.length) {
                                    let timeStr = hourlyTime[tIdx];
                                    let timeHourInt = parseInt(timeStr.substring(11, 13), 10);
                                    let displayHour = i === 0 ? "Semasa" : ((timeHourInt % 12 || 12) + (timeHourInt >= 12 ? " PM" : " AM"));
                                    let pVal = hourlyPrecip[tIdx] || 0;
                                    let tVal = Math.round(hourlyTemp[tIdx]);
                                    let itemIsNight = timeHourInt < 6 || timeHourInt >= 18;
                                    let icon = pVal > 0.2 ? "🌧️" : (itemIsNight ? "🌙" : "⛅");
                                    let rainPercent = pVal > 0.1 ? Math.round(pVal * 40) + "%" : "";

                                    hContainer.innerHTML += `
                                        <div class="flex flex-col items-center justify-between py-2 px-3 bg-slate-900/60 rounded-xl border border-slate-800 min-w-[70px] text-center flex-shrink-0">
                                            <span class="text-xs font-bold text-slate-200">${tVal}°</span>
                                            <span class="text-[10px] text-cyan-400 font-bold my-1 min-h-[14px]">${rainPercent}</span>
                                            <span class="text-xl my-1">${icon}</span>
                                            <span class="text-[11px] text-slate-400 font-mono mt-1">${displayHour}</span>
                                        </div>
                                    `;
                                }
                            }
                        }
                    }
                }).catch(err => {});
        }

        let pendingChatImageBase64 = "";

        function previewChatImage() {
            const file = document.getElementById('chatImageInput').files[0];
            if (file) {
                compressImageHD(file, function(base64) {
                    pendingChatImageBase64 = base64;
                    document.getElementById('chatImageName').innerText = `📎 ${file.name} (Siap dikirim)`;
                    document.getElementById('chatImagePreviewContainer').classList.remove('hidden');
                });
            }
        }

        function cancelChatImage() {
            pendingChatImageBase64 = "";
            document.getElementById('chatImageInput').value = "";
            document.getElementById('chatImagePreviewContainer').classList.add('hidden');
        }

        function sendBossTextOrder(e) {
            e.preventDefault();
            stopAllAiAudio();
            const input = document.getElementById('bossInputMessage');
            const text = input.value.trim();
            if (!text && !pendingChatImageBase64) return;

            const senderName = getFullTitleName();
            const senderGender = currentUser ? (currentUser.gender || 'Dato') : 'Dato';
            const userAvatar = currentUser ? (currentUser.avatar || '') : '';
            
            if (db) {
                db.collection("boss_orders").add({
                    sender: senderName,
                    gender: senderGender,
                    avatar: userAvatar,
                    content: text,
                    image: pendingChatImageBase64 || "",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => { 
                    input.value = ""; 
                    cancelChatImage();
                }).catch(err => alert("Gagal menghantar mesej chat: " + err.message));
            }
        }

        function deleteBossOrder(docId) {
            if (confirm("Padam mesej chat ini secara kekal dari semua telefon?")) {
                if (db) db.collection("boss_orders").doc(docId).delete();
            }
        }

                function loadBossOrdersRealtime() {
            if (!db) return;
            
            // Kita urutkan secara ascending (dari yang terlama ke terbaru) 
            // supaya pesan terbaru otomatis jatuh ke posisi paling bawah.
            db.collection("boss_orders").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                const container = document.getElementById('bossHistoryContainer');
                if (!container) return;
                
                if (snapshot.empty) { 
                    container.innerHTML = `<div class="text-xs text-slate-500 text-center py-3">${translateDynamicText("Belum ada perbincangan atau pesan chat.")}</div>`; 
                    return; 
                }
                
                container.innerHTML = "";
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    let timeStr = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString('ms-MY') : 'Baru sahaja';
                    
                    let avatarHtml = data.avatar 
                        ? `<img src="${data.avatar}" class="w-8 h-8 rounded-full object-cover border border-amber-500 shadow-sm bg-transparent">` 
                        : `<span class="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-xs text-white">${(data.sender || 'U')[0]}</span>`;
                    
                    let contentHtml = data.content ? `<p class="text-sm text-slate-200 mt-1 ml-10">${data.content}</p>` : '';
                    let imageHtml = data.image ? `<div class="mt-2 ml-10"><img src="${data.image}" class="rounded-xl max-h-48 object-cover border border-slate-700 shadow"></div>` : '';

                    container.innerHTML += `
                        <div class="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow flex flex-col gap-1 relative group">
                            <div class="flex justify-between items-center text-xs">
                                <div class="flex items-center gap-2.5">
                                    ${avatarHtml}
                                    <span class="font-bold text-amber-400">${data.sender || 'Pengguna'}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] text-slate-500 font-mono">${timeStr}</span>
                                    <button onclick="deleteBossOrder('${id}')" class="text-rose-400 hover:text-rose-300 text-xs px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-900/50">🗑️</button>
                                </div>
                            </div>
                            ${contentHtml}
                            ${imageHtml}
                        </div>
                    `;
                });

                // Otomatis gulir (scroll) ke paling bawah setiap ada pesan baru atau halaman dimuat
                container.scrollTop = container.scrollHeight;
            });
        }

        }

        function compressImageHD(file, callback) {
            if (!file) { callback(""); return; }
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    if (w > 1200) { h *= 1200 / w; w = 1200; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    callback(canvas.toDataURL('image/jpeg', 0.85));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        let unlockAudioSystem = () => { document.getElementById('audioUnlockBanner').style.display = 'none'; alert("Audio aktif!"); };

        const secretAdminCode = "rojak123";
        let openAdminLogin = () => document.getElementById('adminLoginModal').classList.remove('hidden');
        let closeAdminLogin = () => document.getElementById('adminLoginModal').classList.add('hidden');
        let verifyAdmin = () => {
            if (document.getElementById('adminPasswordInput').value === secretAdminCode) {
                closeAdminLogin();
                document.getElementById('adminDashboardModal').classList.remove('hidden');
                renderWorkersAdmin();
                renderAdminInventoryTable();
                renderAdminWhatsappList();
                renderAiTrainingRules();
                renderUnresolvedLogs();
            } else { alert("Salah kata laluan!"); }
        };
        let closeAdminDashboard = () => document.getElementById('adminDashboardModal').classList.add('hidden');

        if (db) {
            db.collection("settings").doc("workers").get().then(doc => {
                if (doc.exists && doc.data().list) { workers = doc.data().list; renderWorkersDropdown(); }
            });
            db.collection("inventory").onSnapshot(snap => {
                inventory = [];
                snap.forEach(d => inventory.push({ firestoreId: d.id, ...d.data() }));
                renderInventory(); renderAdminInventoryTable();
            });
            db.collection("tasks").onSnapshot(snap => {
                tasks = []; let m = new Set();
                snap.forEach(d => { let x = d.data(); tasks.push({ firestoreId: d.id, ...x }); if(x.month) m.add(x.month); });
                updateMonthDropdown('filterTaskMonth', m); renderTasks();
            });
            db.collection("supply").onSnapshot(snap => {
                supplyData = []; let m = new Set();
                snap.forEach(d => { let x = d.data(); supplyData.push({ firestoreId: d.id, ...x }); if(x.month) m.add(x.month); });
                updateMonthDropdown('filterSupplyMonth', m); renderSupplyApp();
            });
            db.collection("expenses").onSnapshot(snap => {
                expenses = []; let m = new Set();
                snap.forEach(d => { let x = d.data(); expenses.push({ firestoreId: d.id, ...x }); if(x.month) m.add(x.month); });
                updateMonthDropdown('filterExpenseMonth', m); renderExpenses();
            });
            db.collection("garden_products").onSnapshot(snap => {
                gardenProducts = [];
                snap.forEach(d => gardenProducts.push({ firestoreId: d.id, ...d.data() }));
                renderGardenProducts();
            });
            db.collection("income").onSnapshot(snap => {
                incomeList = []; let m = new Set();
                snap.forEach(d => { let x = d.data(); incomeList.push({ firestoreId: d.id, ...x }); if(x.month) m.add(x.month); });
                updateMonthDropdown('filterIncomeMonth', m); renderIncomeSales();
            });
            db.collection("office_products").onSnapshot(snap => {
                officeProducts = [];
                snap.forEach(d => officeProducts.push({ firestoreId: d.id, ...d.data() }));
                renderOfficeProducts();
            });
            db.collection("office_sales").onSnapshot(snap => {
                officeSales = []; let m = new Set();
                snap.forEach(d => { let x = d.data(); officeSales.push({ firestoreId: d.id, ...x }); if(x.month) m.add(x.month); });
                updateMonthDropdown('filterOfficeMonth', m); renderOfficeSales();
            });
            db.collection("customer_orders").orderBy("timestamp", "desc").onSnapshot(snap => {
                customerOrdersList = [];
                snap.forEach(d => customerOrdersList.push({ firestoreId: d.id, ...d.data() }));
                renderAdminCustomerOrders();
            });
        }

        function verifyStaffLogin() {
            const p = document.getElementById('staffPassInput').value;
            if (p === secretAdminCode || p === "kasir123") {
                document.getElementById('staffStatusText').innerText = "Status: Berjaya Log Masuk (Staf Ladang)";
                document.getElementById('incomeMainContent').classList.remove('opacity-50', 'pointer-events-none');
                alert("Akses Jualan Terus Dari Ladang dibuka!");
            } else { alert("Kata laluan salah!"); }
        }

        function handleGardenProductSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('gProdName').value.trim();
            const stock = parseFloat(document.getElementById('gProdStock').value) || 0;
            const price = parseFloat(document.getElementById('gProdPrice').value) || 0;
            const photoFile = document.getElementById('gProdPhoto').files[0];
            if (!name) return;
            compressImageHD(photoFile, function(base64Photo) {
                let existing = gardenProducts.find(p => p.name.toLowerCase() === name.toLowerCase());
                if (db) {
                    if (existing) {
                        let updateData = { stock, price };
                        if (base64Photo) updateData.photo = base64Photo;
                        db.collection("garden_products").doc(existing.firestoreId).update(updateData).then(() => { alert("Produk Ladang dikemaskini!"); e.target.reset(); });
                    } else {
                        db.collection("garden_products").add({ id: Date.now(), name, stock, price, photo: base64Photo || "" }).then(() => { alert("Produk Ladang ditambah!"); e.target.reset(); });
                    }
                }
            });
        }

        function renderGardenProducts() {
            const sc = document.getElementById('gardenProductSummaryContainer');
            const sel = document.getElementById('gSalesProductSelect');
            if (!sc || !sel) return;
            sc.innerHTML = ""; sel.innerHTML = `<option value="">-- Pilih Produk Ladang --</option>`;
            gardenProducts.forEach(p => {
                let imgTag = p.photo ? `<img src="${p.photo}" class="w-10 h-10 object-cover rounded-lg mx-auto mb-1">` : `<span class="text-xl">🌱</span>`;
                let translatedProdName = translateDynamicText(p.name);
                sc.innerHTML += `<div class="bg-white border p-2.5 rounded-xl text-center">${imgTag}<div class="text-[11px] font-bold text-emerald-900">${translatedProdName}</div><div class="text-xs text-slate-600">Stok: <b>${p.stock}</b></div></div>`;
                sel.innerHTML += `<option value="${p.name}" data-price="${p.price}" data-stock="${p.stock}">${translatedProdName} (Stok: ${p.stock} | ${currentCurrency}${p.price})</option>`;
            });
        }

        function onGardenProductSelected() { calculateGardenTotal(); }
        function calculateGardenTotal() {
            const sel = document.getElementById('gSalesProductSelect');
            const qtyInput = document.getElementById('gSalesQty').value;
            const totalInput = document.getElementById('gSalesTotalAmount');
            const selectedOpt = sel.options[sel.selectedIndex];
            if (selectedOpt && selectedOpt.value && qtyInput) {
                let price = parseFloat(selectedOpt.getAttribute('data-price')) || 0;
                let qty = parseFloat(qtyInput) || 0;
                totalInput.value = (price * qty).toFixed(2);
            } else { totalInput.value = ""; }
        }
        document.getElementById('gSalesDate').valueAsDate = new Date();

        function handleGardenSalesSubmit(e) {
            e.preventDefault();
            const prodName = document.getElementById('gSalesProductSelect').value;
            const qty = parseFloat(document.getElementById('gSalesQty').value) || 0;
            const total = document.getElementById('gSalesTotalAmount').value;
            const customer = document.getElementById('gSalesCustomer').value || 'Tunai';
            const address = document.getElementById('gSalesAddress').value || '-';
            const phone = document.getElementById('gSalesPhone').value || '-';
            const dVal = document.getElementById('gSalesDate').value;
            const photoFile = document.getElementById('gSalesPhotoInput').files[0];
            let productObj = gardenProducts.find(p => p.name === prodName);
            if (!productObj || productObj.stock < qty) { alert("Stok tidak mencukupi atau produk tidak sah."); return; }

            compressImageHD(photoFile, function(base64Photo) {
                const salesObj = {
                    id: Date.now(), invoiceNo: `INV-GARDEN-${Date.now().toString().slice(-6)}`,
                    date: dVal, month: dVal.substring(0, 7), product: prodName, qty: qty,
                    currency: currentCurrency,
                    total: `${currentCurrency} ${parseFloat(total).toFixed(2)}`, amount: parseFloat(total) || 0,
                    customer, address, phone, photo: base64Photo || productObj.photo || ""
                };
                if (db) {
                    db.collection("income").add(salesObj).then(() => {
                        db.collection("garden_products").doc(productObj.firestoreId).update({ stock: productObj.stock - qty }).then(() => {
                            document.getElementById('gardenSalesForm').reset();
                            document.getElementById('gSalesDate').valueAsDate = new Date();
                            alert("Jualan terus dari ladang berjaya direkod!");
                            showCustomInvoiceModal(salesObj, 'Jualan Terus Dari Ladang');
                        });
                    });
                }
            });
        }

        function filterByDateRange(itemDate, startElId, endElId, monthElId) {
            let start = document.getElementById(startElId)?.value;
            let end = document.getElementById(endElId)?.value;
            let month = document.getElementById(monthElId)?.value;

            if (start && end) {
                return itemDate >= start && itemDate <= end;
            }
            if (month && month !== 'all') {
                return itemDate.startsWith(month);
            }
            return true;
        }

        function renderIncomeSales() {
            const tbody = document.getElementById('incomeTableBody');
            if (!tbody) return;
            tbody.innerHTML = "";
            let sortedIncome = [...incomeList].sort((a, b) => new Date(a.date) - new Date(b.date));

            sortedIncome.filter(s => filterByDateRange(s.date, 'filterIncomeStart', 'filterIncomeEnd', 'filterIncomeMonth')).forEach(s => {
                tbody.innerHTML += `<tr class="border-b"><td class="p-2">${s.date}</td><td class="p-2 font-medium">${translateDynamicText(s.product)}</td><td class="p-2">${s.qty}</td><td class="p-2 font-bold text-emerald-600">${s.total}</td><td class="p-2">${s.customer}</td><td class="p-2 text-center"><button type="button" onclick="showCustomInvoiceModal(${JSON.stringify(s).replace(/"/g, '&quot;')}, 'Jualan Terus Dari Ladang')" class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">📄 Invois</button></td></tr>`;
            });
        }

        function verifyOfficeLogin() {
            const p = document.getElementById('officePassInput').value;
            if (p === secretAdminCode) {
                document.getElementById('officeStatusText').innerText = "Status: Berjaya Log Masuk (Pentadbir)";
                document.getElementById('officeMainContent').classList.remove('opacity-50', 'pointer-events-none');
                alert("Akses Produk & Invois Luar Talian dibuka!");
            } else { alert("Kata laluan salah!"); }
        }

        function editOfficeProduct(firestoreId) {
            let p = officeProducts.find(item => item.firestoreId === firestoreId);
            if (!p) return;
            document.getElementById('editingOfficeProductId').value = p.firestoreId;
            document.getElementById('prodName').value = p.name || "";
            document.getElementById('prodStock').value = p.stock || 0;
            document.getElementById('prodPrice').value = p.price || 0;
            document.getElementById('prodBenefits').value = p.benefits || "";
            window.scrollTo({ top: document.getElementById('officeProductForm').offsetTop - 100, behavior: 'smooth' });
        }

        function resetOfficeProductForm() {
            document.getElementById('officeProductForm').reset();
            document.getElementById('editingOfficeProductId').value = "";
        }

        function handleOfficeProductSubmit(e) {
            e.preventDefault();
            const editingId = document.getElementById('editingOfficeProductId').value;
            const name = document.getElementById('prodName').value.trim();
            const stock = parseInt(document.getElementById('prodStock').value) || 0;
            const price = parseFloat(document.getElementById('prodPrice').value) || 0;
            const benefits = document.getElementById('prodBenefits').value.trim();
            const photoFile = document.getElementById('prodPhoto').files[0];
            if (!name) return;

            compressImageHD(photoFile, function(base64Photo) {
                if (db) {
                    if (editingId) {
                        let existing = officeProducts.find(p => p.firestoreId === editingId);
                        let updateData = { name, stock, price, benefits };
                        if (base64Photo) updateData.photo = base64Photo;
                        else if (existing && existing.photo) updateData.photo = existing.photo;
                        db.collection("office_products").doc(editingId).update(updateData).then(() => { alert("Produk Luar Talian dikemaskini!"); resetOfficeProductForm(); });
                    } else {
                        db.collection("office_products").add({ id: Date.now(), name, stock, price, benefits, photo: base64Photo || "" }).then(() => { alert("Produk Luar Talian ditambah!"); resetOfficeProductForm(); });
                    }
                }
            });
        }

        function renderOfficeProducts() {
            const sc = document.getElementById('officeProductSummaryContainer');
            const sel = document.getElementById('salesProductSelect');
            if (!sc || !sel) return;
            sc.innerHTML = ""; sel.innerHTML = `<option value="">-- Pilih Produk Luar Talian --</option>`;
            officeProducts.forEach(p => {
                let imgTag = p.photo ? `<img src="${p.photo}" class="w-12 h-12 object-cover rounded-lg mx-auto mb-1">` : `<span class="text-2xl">🏢</span>`;
                let translatedProdName = translateDynamicText(p.name);
                let translatedBenefits = translateDynamicText(p.benefits);
                sc.innerHTML += `<div class="bg-white border p-3 rounded-xl relative"><div class="absolute top-2 right-2"><button type="button" onclick="editOfficeProduct('${p.firestoreId}')" class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px]">Edit</button></div><div class="text-center">${imgTag}</div><div class="text-xs font-bold text-blue-900 truncate">${translatedProdName}</div><div class="text-[11px] text-slate-600">Stok: <b>${p.stock}</b> | ${currentCurrency} ${parseFloat(p.price).toFixed(2)}</div><div class="text-[10px] text-slate-500 mt-1"><b>Khasiat:</b> ${translatedBenefits || '-'}</div></div>`;
                sel.innerHTML += `<option value="${p.name}" data-price="${p.price}" data-stock="${p.stock}">${translatedProdName} (Stok: ${p.stock} | ${currentCurrency}${p.price})</option>`;
            });
        }

        function onOfficeProductSelected() { calculateOfficeTotal(); }
        function calculateOfficeTotal() {
            const sel = document.getElementById('salesProductSelect');
            const qtyInput = document.getElementById('salesQty').value;
            const totalInput = document.getElementById('salesTotalAmount');
            const selectedOpt = sel.options[sel.selectedIndex];
            if (selectedOpt && selectedOpt.value && qtyInput) {
                let price = parseFloat(selectedOpt.getAttribute('data-price')) || 0;
                let qty = parseFloat(qtyInput) || 0;
                totalInput.value = (price * qty).toFixed(2);
            } else { totalInput.value = ""; }
        }
        document.getElementById('salesDate').valueAsDate = new Date();

        function handleOfficeSalesSubmit(e) {
            e.preventDefault();
            const editingSalesId = document.getElementById('editingOfficeSalesId').value;
            const prodName = document.getElementById('salesProductSelect').value;
            const qty = parseInt(document.getElementById('salesQty').value) || 0;
            const total = document.getElementById('salesTotalAmount').value;
            const customer = document.getElementById('salesCustomer').value || 'Walk-in';
            const address = document.getElementById('salesAddress').value || '-';
            const phone = document.getElementById('salesPhone').value || '-';
            const dVal = document.getElementById('salesDate').value;
            const photoFile = document.getElementById('salesPhotoInput').files[0];
            let productObj = officeProducts.find(p => p.name === prodName);
            if (!productObj) { alert("Produk tidak sah."); return; }

            compressImageHD(photoFile, function(base64Photo) {
                const salesObj = {
                    id: editingSalesId ? undefined : Date.now(),
                    invoiceNo: `INV-OFFICE-${Date.now().toString().slice(-6)}`,
                    date: dVal, month: dVal.substring(0, 7), product: prodName, qty: qty,
                    currency: currentCurrency,
                    total: `${currentCurrency} ${parseFloat(total).toFixed(2)}`, amount: parseFloat(total) || 0,
                    customer, address, phone, photo: base64Photo || productObj.photo || ""
                };

                if (db) {
                    if (editingSalesId) {
                        db.collection("office_sales").doc(editingSalesId).update(salesObj).then(() => {
                            resetOfficeSalesForm();
                            alert("Riwayat jualan luar talian berjaya dikemaskini!");
                        });
                    } else {
                        db.collection("office_sales").add(salesObj).then(() => {
                            db.collection("office_products").doc(productObj.firestoreId).update({ stock: productObj.stock - qty }).then(() => {
                                resetOfficeSalesForm();
                                alert("Jualan luar talian berjaya direkod!");
                                showCustomInvoiceModal(salesObj, 'Jualan Produk & Invois Luar Talian');
                            });
                        });
                    }
                }
            });
        }

        function editOfficeSale(firestoreId) {
            let s = officeSales.find(item => item.firestoreId === firestoreId);
            if (!s) return;
            document.getElementById('editingOfficeSalesId').value = s.firestoreId;
            document.getElementById('salesProductSelect').value = s.product || "";
            document.getElementById('salesQty').value = s.qty || 1;
            document.getElementById('salesTotalAmount').value = s.amount || 0;
            document.getElementById('salesCustomer').value = s.customer || "";
            document.getElementById('salesAddress').value = s.address || "";
            document.getElementById('salesPhone').value = s.phone || "";
            document.getElementById('salesDate').value = s.date || "";
            document.getElementById('officeSalesFormTitle').innerText = "✏️ Edit Transaksi Jualan Luar Talian";
            document.getElementById('btnOfficeSalesSubmit').innerText = "Kemaskini Jualan";
            document.getElementById('btnCancelOfficeSalesEdit').classList.remove('hidden');
            window.scrollTo({ top: document.getElementById('officeSalesForm').offsetTop - 100, behavior: 'smooth' });
        }

        function resetOfficeSalesForm() {
            document.getElementById('officeSalesForm').reset();
            document.getElementById('editingOfficeSalesId').value = "";
            document.getElementById('salesDate').valueAsDate = new Date();
            document.getElementById('officeSalesFormTitle').innerText = "🛒 Catat Transaksi Jualan Luar Talian Baharu (Pesanan Pelanggan)";
            document.getElementById('btnOfficeSalesSubmit').innerText = "Simpan Jualan & Cetak Invois Rasmi";
            document.getElementById('btnCancelOfficeSalesEdit').classList.add('hidden');
        }

        function deleteOfficeSale(firestoreId) {
            if (confirm("Yakin ingin memadamkan riwayat jualan luar talian ini secara kekal?")) {
                if (db) {
                    db.collection("office_sales").doc(firestoreId).delete().then(() => {
                        alert("Riwayat jualan berjaya dipadam!");
                    }).catch(err => alert("Gagal memadam: " + err.message));
                }
            }
        }

        function renderOfficeSales() {
            const tbody = document.getElementById('officeSalesTableBody');
            if (!tbody) return;
            tbody.innerHTML = "";
            let sortedSales = [...officeSales].sort((a, b) => new Date(a.date) - new Date(b.date));

            let filtered = sortedSales.filter(s => filterByDateRange(s.date, 'filterOfficeStart', 'filterOfficeEnd', 'filterOfficeMonth'));
            if (filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Belum ada riwayat jualan luar talian.</td></tr>`;
                return;
            }
            filtered.forEach((s, index) => {
                window[`officeSale_${index}`] = s;
                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="p-2">${s.date}</td>
                        <td class="p-2 font-medium">${translateDynamicText(s.product)}</td>
                        <td class="p-2">${s.qty} unit</td>
                        <td class="p-2 font-bold text-emerald-600">${s.total}</td>
                        <td class="p-2">${s.customer}<br><span class="text-[10px] text-slate-500">${s.phone || '-'}</span></td>
                        <td class="p-2 text-center space-x-1">
                            <button type="button" onclick='showCustomInvoiceModal(window.officeSale_${index}, "Jualan Produk & Invois Luar Talian")' class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">📄 Invois</button>
                            <button type="button" onclick="editOfficeSale('${s.firestoreId}')" class="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">✏️ Edit</button>
                            <button type="button" onclick="deleteOfficeSale('${s.firestoreId}')" class="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs font-bold">🗑️ Padam</button>
                        </td>
                    </tr>
                `;
            });
        }

        function renderWorkersDropdown() {
            const sel = document.getElementById('taskWorkerSelect');
            if(!sel) return; sel.innerHTML = `<option value="">Pilih Pekerja</option>`;
            workers.forEach(w => { let n = typeof w === 'object' ? w.name : w; sel.innerHTML += `<option value="${n}">${n}</option>`; });
        }
        function renderWorkersAdmin() {
            const c = document.getElementById('workerListTags');
            if(!c) return; c.innerHTML = "";
            workers.forEach((w, i) => { let n = typeof w === 'object' ? w.name : w; c.innerHTML += `<span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-xs font-semibold flex justify-between items-center">👤 ${n} <button type="button" onclick="deleteWorker(${i})" class="text-rose-500 font-bold">×</button></span>`; });
        }
        function addWorkerWithCustomTasks() {
            const n = document.getElementById('workerNameInput').value.trim();
            if(n) {
                workers.push({ name: n, mandatory: document.getElementById('workerMandatoryTask').value, extra: document.getElementById('workerExtraTask').value });
                if(db) db.collection("settings").doc("workers").set({ list: workers });
                document.getElementById('workerNameInput').value = ""; renderWorkersAdmin(); renderWorkersDropdown();
            }
        }
        function deleteWorker(i) { workers.splice(i, 1); if(db) db.collection("settings").doc("workers").set({ list: workers }); renderWorkersAdmin(); renderWorkersDropdown(); }

        document.getElementById('inputDate').valueAsDate = new Date();
        function onSupplyItemChange() {
            const item = document.getElementById('inputItem').value;
            document.getElementById('inputUnitDisplay').value = (item === "Bunga Kantan") ? "tangkai" : "kg";
        }
        function handleSupplyFormSubmit(e) {
            e.preventDefault();
            const editingId = document.getElementById('editingSupplyId').value;
            const itemVal = document.getElementById('inputItem').value;
            const dVal = document.getElementById('inputDate').value;
            const unitVal = (itemVal === "Bunga Kantan") ? "tangkai" : "kg";
            const supplyObj = {
                date: dVal, month: dVal.substring(0, 7), item: itemVal,
                action: 'stok', qty: parseFloat(document.getElementById('inputQty').value),
                unit: unitVal, desc: document.getElementById('inputDesc').value || '-'
            };
            if(db) {
                if (editingId) {
                    db.collection("supply").doc(editingId).update(supplyObj).then(() => {
                        resetSupplyForm();
                        alert("Bekalan berjaya dikemaskini!");
                    });
                } else {
                    db.collection("supply").add({ ...supplyObj, id: Date.now() }).then(() => {
                        document.getElementById('supplyForm').reset();
                        document.getElementById('inputDate').valueAsDate = new Date();
                        alert("Bekalan disimpan!");
                    });
                }
            }
        }

        function editSupplyItem(firestoreId) {
            let s = supplyData.find(item => item.firestoreId === firestoreId);
            if (!s) return;
            document.getElementById('editingSupplyId').value = s.firestoreId;
            document.getElementById('inputDate').value = s.date || "";
            document.getElementById('inputItem').value = s.item || "";
            onSupplyItemChange();
            document.getElementById('inputQty').value = s.qty || 0;
            document.getElementById('inputDesc').value = s.desc || "";
            document.getElementById('supplyFormTitle').innerText = "✏️ Edit Hasil Tuaian / Bekalan";
            document.getElementById('btnSupplySubmit').innerText = "Kemaskini Bekalan";
            document.getElementById('btnCancelSupplyEdit').classList.remove('hidden');
            window.scrollTo({ top: document.getElementById('supplyForm').offsetTop - 100, behavior: 'smooth' });
        }

        function resetSupplyForm() {
            document.getElementById('supplyForm').reset();
            document.getElementById('editingSupplyId').value = "";
            document.getElementById('inputDate').valueAsDate = new Date();
            onSupplyItemChange();
            document.getElementById('supplyFormTitle').innerText = "➕ Input Hasil Tuaian Baharu (Masuk Stok)";
            document.getElementById('btnSupplySubmit').innerText = "Simpan ke Stok Gudang";
            document.getElementById('btnCancelSupplyEdit').classList.add('hidden');
        }

        function deleteSupplyItem(firestoreId) {
            if (confirm("Yakin ingin memadamkan data bekalan ini secara kekal?")) {
                if(db) db.collection("supply").doc(firestoreId).delete().then(() => alert("Bekalan berjaya dipadam!"));
            }
        }

        function renderSupplyApp() {
            const tbody = document.getElementById('supplyTableBody');
            const sc = document.getElementById('stockSummaryContainer');
            if(!tbody || !sc) return;
            tbody.innerHTML = ""; sc.innerHTML = "";
            let stocks = {};
            supplyData.forEach(r => { let key = `${r.item} (${r.unit})`; if(!stocks[key]) stocks[key] = 0; if(r.action === 'stok') stocks[key] += r.qty; });
            for(let [key, val] of Object.entries(stocks)) { sc.innerHTML += `<div class="bg-slate-50 border p-2 rounded text-center"><div class="text-[10px] text-slate-500">${translateDynamicText(key)}</div><div class="text-sm font-bold text-blue-600">${val}</div></div>`; }
            
            let sortedSupply = [...supplyData].sort((a, b) => new Date(a.date) - new Date(b.date));

            sortedSupply.filter(r => filterByDateRange(r.date, 'filterSupplyStart', 'filterSupplyEnd', 'filterSupplyMonth')).forEach(r => {
                let badge = r.action === 'stok' ? `<span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">📦 Stok</span>` : `<span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">🚀 Dibekalkan</span>`;
                let btn = r.action === 'stok' ? `<button type="button" onclick="markAsSupplied('${r.firestoreId}')" class="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold mr-1">Bekal</button>` : '';
                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="p-2">${r.date}</td>
                        <td class="p-2">${translateDynamicText(r.item)}</td>
                        <td class="p-2">${badge}</td>
                        <td class="p-2 font-bold">${r.qty} ${r.unit}</td>
                        <td class="p-2">${translateDynamicText(r.desc)}</td>
                        <td class="p-2 text-center space-x-1">
                            ${btn}
                            <button type="button" onclick="editSupplyItem('${r.firestoreId}')" class="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">✏️</button>
                            <button type="button" onclick="deleteSupplyItem('${r.firestoreId}')" class="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs font-bold">🗑️</button>
                        </td>
                    </tr>
                `;
            });
        }
        function markAsSupplied(firestoreId) { if(db) db.collection("supply").doc(firestoreId).update({ action: 'suplai' }); }

        function renderInventory() {
            const c = document.getElementById('inventoryContainer');
            const sel = document.getElementById('taskStockItem');
            if(!c || !sel) return; c.innerHTML = ""; sel.innerHTML = `<option value="">-- Tanpa Stok --</option>`;
            inventory.forEach(item => {
                let translatedName = translateDynamicText(item.name);
                let translatedAdvice = translateDynamicText(item.advice);
                sel.innerHTML += `<option value="${item.name}">${translatedName} (Baki: ${item.stock})</option>`;
                c.innerHTML += `<div class="bg-slate-50 border p-4 rounded-xl">${item.photo?`<img src="${item.photo}" class="w-full h-32 object-cover rounded mb-2">`:''}<h4 class="font-bold text-emerald-800">${translatedName}</h4><p class="text-xs">Baki: <b>${item.stock}</b></p><p class="text-[11px] text-slate-600 mt-1">${translatedAdvice}</p></div>`;
            });
        }
        function renderAdminInventoryTable() {
            const tbody = document.getElementById('adminInventoryTableBody');
            if(!tbody) return; tbody.innerHTML = "";
            inventory.forEach((item, i) => { tbody.innerHTML += `<tr class="border-b"><td class="p-2">${translateDynamicText(item.name)}</td><td class="p-2">${item.stock}</td><td class="p-2"><button type="button" onclick="deleteInv(${i})" class="text-rose-500">Padam</button></td></tr>`; });
        }
        function handleInventoryFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('invName').value;
            const stock = parseInt(document.getElementById('invStock').value) || 0;
            const advice = document.getElementById('invAdvice').value;
            compressImageHD(document.getElementById('invImageInput').files[0], function(base64) {
                if(db) db.collection("inventory").add({ id: Date.now(), name, stock, advice, photo: base64 });
                e.target.reset(); alert("Stok baja ditambah!");
            });
        }
        function deleteInv(i) { if(db) db.collection("inventory").doc(inventory[i].firestoreId).delete(); }

        let taskPhotoBase64 = "";
        document.getElementById('imageInput').addEventListener('change', function(e) { compressImageHD(e.target.files[0], b => { taskPhotoBase64 = b; }); });
        
        function handleTaskFormSubmit(e) {
            e.preventDefault();
            const editingId = document.getElementById('editingTaskId').value;
            const dVal = document.getElementById('taskDate').value;
            let taskObj = {
                title: document.getElementById('taskTitle').value,
                category: document.getElementById('taskCategory').value,
                worker: document.getElementById('taskWorkerSelect').value,
                date: dVal, month: dVal.substring(0, 7),
                stockUsed: document.getElementById('taskStockItem').value || "Tiada",
                status: "Selesai ✓"
            };
            if (taskPhotoBase64) taskObj.photo = taskPhotoBase64;

            if(db) {
                if (editingId) {
                    db.collection("tasks").doc(editingId).update(taskObj).then(() => {
                        resetTaskForm();
                        alert("Laporan tugas berjaya dikemaskini!");
                    });
                } else {
                    db.collection("tasks").add({ ...taskObj, id: Date.now() }).then(() => {
                        resetTaskForm();
                        alert("Tugas disimpan!");
                    });
                }
            }
        }

        function editTask(firestoreId) {
            let t = tasks.find(item => item.firestoreId === firestoreId);
            if (!t) return;
            document.getElementById('editingTaskId').value = t.firestoreId;
            document.getElementById('taskTitle').value = t.title || "";
            document.getElementById('taskCategory').value = t.category || "";
            document.getElementById('taskWorkerSelect').value = t.worker || "";
            document.getElementById('taskDate').value = t.date || "";
            document.getElementById('taskStockItem').value = t.stockUsed === "Tiada" ? "" : t.stockUsed;
            taskPhotoBase64 = t.photo || "";
            document.getElementById('btnTaskSubmit').innerText = "Kemaskini Laporan Kerja";
            document.getElementById('btnCancelTaskEdit').classList.remove('hidden');
            window.scrollTo({ top: document.getElementById('taskForm').offsetTop - 100, behavior: 'smooth' });
        }

        function resetTaskForm() {
            document.getElementById('taskForm').reset();
            document.getElementById('editingTaskId').value = "";
            taskPhotoBase64 = "";
            document.getElementById('btnTaskSubmit').innerText = "Simpan Laporan Kerja";
            document.getElementById('btnCancelTaskEdit').classList.add('hidden');
        }

        function deleteTask(firestoreId) {
            if (confirm("Yakin ingin memadamkan laporan tugas ini secara kekal?")) {
                if(db) db.collection("tasks").doc(firestoreId).delete().then(() => alert("Tugas berjaya dipadam!"));
            }
        }

        function renderTasks() {
            const tbody = document.getElementById('taskTableBody');
            if(!tbody) return; tbody.innerHTML = "";
            
            let sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

            sortedTasks.filter(t => filterByDateRange(t.date, 'filterTaskStart', 'filterTaskEnd', 'filterTaskMonth')).forEach(t => {
                let translatedTitle = translateDynamicText(t.title);
                let translatedCat = translateDynamicText(t.category);
                let translatedStatus = translateDynamicText(t.status);
                let translatedStock = translateDynamicText(t.stockUsed);
                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="p-3">${t.photo?`<img src="${t.photo}" class="w-10 h-10 object-cover rounded">`:'Tiada'}</td>
                        <td class="p-3 font-semibold">${translatedTitle}</td>
                        <td class="p-3">${translatedCat}</td>
                        <td class="p-3">${t.worker}</td>
                        <td class="p-3">${t.date}</td>
                        <td class="p-3">${translatedStock}</td>
                        <td class="p-3 text-emerald-700 font-medium">${translatedStatus}</td>
                        <td class="p-3 text-center space-x-1">
                            <button type="button" onclick="editTask('${t.firestoreId}')" class="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">✏️ Edit</button>
                            <button type="button" onclick="deleteTask('${t.firestoreId}')" class="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs font-bold">🗑️ Padam</button>
                        </td>
                    </tr>
                `;
            });
        }

        let expReceiptBase64 = "";
        document.getElementById('expReceiptInput').addEventListener('change', function(e) { compressImageHD(e.target.files[0], b => { expReceiptBase64 = b; }); });
        
        function handleExpenseFormSubmit(e) {
            e.preventDefault();
            const editingId = document.getElementById('editingExpenseId').value;
            const dVal = document.getElementById('expDate').value;
            let rawAmt = document.getElementById('expAmount').value;
            let formattedAmt = `${currentCurrency} ${parseFloat(rawAmt.replace(/[^0-9.]/g, '') || 0).toFixed(2)}`;
            let expObj = {
                title: document.getElementById('expTitle').value,
                amount: formattedAmt,
                currency: currentCurrency,
                date: dVal, month: dVal.substring(0, 7)
            };
            if (expReceiptBase64) expObj.receipt = expReceiptBase64;

            if(db) {
                if (editingId) {
                    db.collection("expenses").doc(editingId).update(expObj).then(() => {
                        resetExpenseForm();
                        alert("Perbelanjaan berjaya dikemaskini!");
                    });
                } else {
                    db.collection("expenses").add({ ...expObj, id: Date.now() }).then(() => {
                        resetExpenseForm();
                        alert("Perbelanjaan ditambah!");
                    });
                }
            }
        }

        function editExpense(firestoreId) {
            let ex = expenses.find(item => item.firestoreId === firestoreId);
            if (!ex) return;
            document.getElementById('editingExpenseId').value = ex.firestoreId;
            document.getElementById('expTitle').value = ex.title || "";
            document.getElementById('expAmount').value = (ex.amount || "").replace(/[^0-9.]/g, '');
            document.getElementById('expDate').value = ex.date || "";
            expReceiptBase64 = ex.receipt || "";
            document.getElementById('expenseFormTitle').innerText = "✏️ Edit Perbelanjaan Ladang";
            document.getElementById('btnExpenseSubmit').innerText = "Kemaskini Perbelanjaan";
            document.getElementById('btnCancelExpenseEdit').classList.remove('hidden');
            window.scrollTo({ top: document.getElementById('expenseForm').offsetTop - 100, behavior: 'smooth' });
        }

        function resetExpenseForm() {
            document.getElementById('expenseForm').reset();
            document.getElementById('editingExpenseId').value = "";
            expReceiptBase64 = "";
            document.getElementById('expenseFormTitle').innerText = "💰 Perbelanjaan Ladang (Bulanan)";
            document.getElementById('btnExpenseSubmit').innerText = "Tambah Perbelanjaan";
            document.getElementById('btnCancelExpenseEdit').classList.add('hidden');
        }

        function deleteExpense(firestoreId) {
            if (confirm("Yakin ingin memadamkan rekod perbelanjaan ini secara kekal?")) {
                if(db) db.collection("expenses").doc(firestoreId).delete().then(() => alert("Perbelanjaan berjaya dipadam!"));
            }
        }

        function renderExpenses() {
            const tbody = document.getElementById('expenseTableBody');
            if(!tbody) return; tbody.innerHTML = "";
            
            let sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

            sortedExpenses.filter(e => filterByDateRange(e.date, 'filterExpenseStart', 'filterExpenseEnd', 'filterExpenseMonth')).forEach(ex => {
                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="p-3">${ex.receipt?`<img src="${ex.receipt}" class="w-10 h-10 object-cover rounded">`:'Tiada'}</td>
                        <td class="p-3 font-semibold">${translateDynamicText(ex.title)}</td>
                        <td class="p-3 font-bold text-rose-600">${ex.amount}</td>
                        <td class="p-3">${ex.date}</td>
                        <td class="p-3 text-center space-x-1">
                            <button type="button" onclick="editExpense('${ex.firestoreId}')" class="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">✏️ Edit</button>
                            <button type="button" onclick="deleteExpense('${ex.firestoreId}')" class="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs font-bold">🗑️ Padam</button>
                        </td>
                    </tr>
                `;
            });
        }

        function updateMonthDropdown(id, set) {
            const sel = document.getElementById(id);
            if(!sel) return;
            let cv = sel.value;
            sel.innerHTML = `<option value="all">${translateDynamicText("Semua Bulan (Global)")}</option>`;
            Array.from(set).sort().reverse().forEach(m => sel.innerHTML += `<option value="${m}">${translateDynamicText("Bulan")}: ${m}</option>`);
            sel.value = cv;
        }

        let signaturePad = null;
        function initSignaturePad() {
            const canvas = document.getElementById('signatureCanvas');
            if (canvas && !signaturePad) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                signaturePad = new SignaturePad(canvas, { backgroundColor: 'rgba(0,0,0,0)', penColor: 'rgb(15, 23, 42)' });
                signaturePad.addEventListener("beginStroke", () => document.getElementById('signaturePlaceholder').style.display = 'none');
            } else if (signaturePad && canvas) {
                signaturePad.clear();
                document.getElementById('signaturePlaceholder').style.display = 'block';
            }
        }
        function clearSignature() { if(signaturePad) { signaturePad.clear(); document.getElementById('signaturePlaceholder').style.display = 'block'; } }

        function showCustomInvoiceModal(salesData, categoryTitle) {
            document.getElementById('invModalMainHeader').innerText = categoryTitle;
            document.getElementById('invModalInvoiceNo').innerText = `No: ${salesData.invoiceNo || 'INV-' + Date.now().toString().slice(-6)}`;
            document.getElementById('invModalDateNum').innerText = `Tarikh: ${salesData.date || '-'}`;
            document.getElementById('invOfficeAddressDisplay').innerText = officeCompanyAddress;
            document.getElementById('invRecipientLabel').innerText = "Kepada (Pelanggan / Pembeli):";
            document.getElementById('invCustomerName').innerText = translateDynamicText(salesData.customer) || 'Tunai';
            document.getElementById('invCustomerAddress').innerText = `Alamat: ${translateDynamicText(salesData.address) || '-'}`;
            document.getElementById('invCustomerPhone').innerText = `Tel: ${salesData.phone || '-'}`;
            document.getElementById('invModalOwner').innerText = getRealNameOnly();
            document.getElementById('invoiceGrandTotalWrapper').style.display = 'block';

            let currSymbol = salesData.currency || currentCurrency;

            document.getElementById('invoiceTableHeaderRow').innerHTML = `
                <th class="p-2.5 rounded-l-lg">No</th>
                <th class="p-2.5">Keterangan / Produk</th>
                <th class="p-2.5 text-center">Kuantiti</th>
                <th class="p-2.5 text-right">Harga Seunit</th>
                <th class="p-2.5 text-right rounded-r-lg">Jumlah</th>
            `;

            const tbody = document.getElementById('invoiceTableBody');
            tbody.innerHTML = "";
            let unitPrice = salesData.amount && salesData.qty ? (salesData.amount / salesData.qty).toFixed(2) : '0.00';

            tbody.innerHTML = `
                <tr>
                    <td class="p-2.5">1</td>
                    <td class="p-2.5 font-bold text-slate-800">${translateDynamicText(salesData.product)}</td>
                    <td class="p-2.5 text-center">${salesData.qty}</td>
                    <td class="p-2.5 text-right">${currSymbol} ${unitPrice}</td>
                    <td class="p-2.5 text-right font-bold text-emerald-700">${salesData.total}</td>
                </tr>
            `;
            document.getElementById('invoiceGrandTotal').innerText = salesData.total;
            document.getElementById('invoiceModal').classList.remove('hidden');
            setTimeout(initSignaturePad, 200);
        }

        function generateSupplyReportModal() {
            let sortedSupply = [...supplyData].sort((a, b) => new Date(a.date) - new Date(b.date));
            let dataArr = sortedSupply.filter(s => filterByDateRange(s.date, 'filterSupplyStart', 'filterSupplyEnd', 'filterSupplyMonth'));
            const todayStr = new Date().toISOString().substring(0, 10);

            let startStr = document.getElementById('filterSupplyStart').value;
            let endStr = document.getElementById('filterSupplyEnd').value;
            let periodText = (startStr && endStr) ? `${startStr} hingga ${endStr}` : (document.getElementById('filterSupplyMonth').value !== 'all' ? document.getElementById('filterSupplyMonth').value : 'Semua Tempoh (Global)');

            document.getElementById('invModalMainHeader').innerText = "LAPORAN BEKALAN LADANG";
            document.getElementById('invModalInvoiceNo').innerText = `Tempoh: ${periodText}`;
            document.getElementById('invModalDateNum').innerText = `Tarikh Cetak: ${todayStr}`;
            document.getElementById('invOfficeAddressDisplay').innerText = officeCompanyAddress;
            document.getElementById('invRecipientLabel').innerText = "Keterangan Dokumen:";
            document.getElementById('invCustomerName').innerText = "Rekod Bekalan & Hasil Tuaian Dalaman Ladang";
            document.getElementById('invCustomerAddress').innerText = "Lokasi: Ladang Machap, Johor";
            document.getElementById('invCustomerPhone').innerText = "Status: Pengiriman Dalaman Ladang (Bukan Jualan)";
            document.getElementById('invModalOwner').innerText = getRealNameOnly();

            document.getElementById('invoiceGrandTotalWrapper').style.display = 'none';

            document.getElementById('invoiceTableHeaderRow').innerHTML = `
                <th class="p-2.5 rounded-l-lg">No</th>
                <th class="p-2.5">Tarikh</th>
                <th class="p-2.5">Jenis Hasil Ladang (Item)</th>
                <th class="p-2.5 text-center">Kuantiti & Unit</th>
                <th class="p-2.5 rounded-r-lg">Keterangan / Blok</th>
            `;

            const tbody = document.getElementById('invoiceTableBody');
            tbody.innerHTML = "";
            if (dataArr.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">Tiada data bekalan untuk tempoh ini.</td></tr>`;
            } else {
                dataArr.forEach((item, idx) => {
                    tbody.innerHTML += `
                        <tr>
                            <td class="p-2.5">${idx + 1}</td>
                            <td class="p-2.5 font-mono">${item.date || '-'}</td>
                            <td class="p-2.5 font-bold text-slate-800">${translateDynamicText(item.item) || '-'}</td>
                            <td class="p-2.5 text-center font-bold text-emerald-700">${item.qty || 0} ${item.unit || 'kg'}</td>
                            <td class="p-2.5 text-slate-600">${translateDynamicText(item.desc) || '-'}</td>
                        </tr>
                    `;
                });
            }

            document.getElementById('invoiceModal').classList.remove('hidden');
            setTimeout(initSignaturePad, 200);
        }

        function generateMonthlyInvoice(type) {
            let title = "", dataArr = [];
            const todayStr = new Date().toISOString().substring(0, 10);
            
            if(type === 'supply') { generateSupplyReportModal(); return; }

            const isTaskReport = (type === 'tasks');
            const isExpenseReport = (type === 'expenses');

            let startStr = "", endStr = "", monthVal = "";

            if(type === 'tasks') { 
                title = "Rumusan Tugas Harian Ladang"; 
                dataArr = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date)).filter(t => filterByDateRange(t.date, 'filterTaskStart', 'filterTaskEnd', 'filterTaskMonth'));
                startStr = document.getElementById('filterTaskStart').value;
                endStr = document.getElementById('filterTaskEnd').value;
                monthVal = document.getElementById('filterTaskMonth').value;
            } else if(type === 'expenses') { 
                title = "Rumusan Perbelanjaan Ladang"; 
                dataArr = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date)).filter(ex => filterByDateRange(ex.date, 'filterExpenseStart', 'filterExpenseEnd', 'filterExpenseMonth'));
                startStr = document.getElementById('filterExpenseStart').value;
                endStr = document.getElementById('filterExpenseEnd').value;
                monthVal = document.getElementById('filterExpenseMonth').value;
            } else if(type === 'income') { 
                title = "Rumusan Jualan Terus Dari Ladang"; 
                dataArr = [...incomeList].sort((a, b) => new Date(a.date) - new Date(b.date)).filter(i => filterByDateRange(i.date, 'filterIncomeStart', 'filterIncomeEnd', 'filterIncomeMonth'));
                startStr = document.getElementById('filterIncomeStart').value;
                endStr = document.getElementById('filterIncomeEnd').value;
                monthVal = document.getElementById('filterIncomeMonth').value;
            } else if(type === 'office') { 
                title = "Rumusan Produk & Invois Luar Talian"; 
                dataArr = [...officeSales].sort((a, b) => new Date(a.date) - new Date(b.date)).filter(o => filterByDateRange(o.date, 'filterOfficeStart', 'filterOfficeEnd', 'filterOfficeMonth'));
                startStr = document.getElementById('filterOfficeStart').value;
                endStr = document.getElementById('filterOfficeEnd').value;
                monthVal = document.getElementById('filterOfficeMonth').value;
            }

            let periodText = (startStr && endStr) ? `${startStr} hingga ${endStr}` : (monthVal !== 'all' ? monthVal : 'Semua Tempoh (Global)');

            document.getElementById('invModalMainHeader').innerText = title;
            document.getElementById('invModalInvoiceNo').innerText = `Tempoh: ${periodText}`;
            document.getElementById('invModalDateNum').innerText = `Tarikh Cetak: ${todayStr}`;
            document.getElementById('invOfficeAddressDisplay').innerText = officeCompanyAddress;
            document.getElementById('invRecipientLabel').innerText = "Keterangan Laporan:";
            document.getElementById('invCustomerName').innerText = isTaskReport ? "Rekod Aktiviti & Tugasan Harian Pekerja Ladang" : (isExpenseReport ? "Rekod Perbelanjaan Operasi Ladang" : "Pengurusan Korporat / Umum");
            document.getElementById('invCustomerAddress').innerText = "Lokasi: Ladang Machap, Johor";
            document.getElementById('invCustomerPhone').innerText = "Status: Dokumen Rasmi Dalaman Ladang";
            document.getElementById('invModalOwner').innerText = getRealNameOnly();

            const tbody = document.getElementById('invoiceTableBody');
            tbody.innerHTML = "";

            if (isTaskReport) {
                document.getElementById('invoiceGrandTotalWrapper').style.display = 'none';
                document.getElementById('invoiceTableHeaderRow').innerHTML = `
                    <th class="p-2.5 rounded-l-lg">No</th>
                    <th class="p-2.5">Tugasan</th>
                    <th class="p-2.5">Kategori</th>
                    <th class="p-2.5">Pekerja</th>
                    <th class="p-2.5 text-center">Tarikh</th>
                    <th class="p-2.5 rounded-r-lg">Status & Stok</th>
                `;

                if (dataArr.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Tiada data tugas harian untuk tempoh ini.</td></tr>`;
                } else {
                    dataArr.forEach((item, idx) => {
                        tbody.innerHTML += `
                            <tr>
                                <td class="p-2.5">${idx + 1}</td>
                                <td class="p-2.5 font-bold text-slate-800">${translateDynamicText(item.title) || '-'}</td>
                                <td class="p-2.5">${translateDynamicText(item.category) || '-'}</td>
                                <td class="p-2.5">${item.worker || '-'}</td>
                                <td class="p-2.5 text-center font-mono">${item.date || '-'}</td>
                                <td class="p-2.5 text-emerald-700 font-semibold">${translateDynamicText(item.status) || 'Selesai'} (${translateDynamicText(item.stockUsed) || 'Tiada'})</td>
                            </tr>
                        `;
                    });
                }
            } else {
                document.getElementById('invoiceGrandTotalWrapper').style.display = 'block';
                document.getElementById('invoiceTableHeaderRow').innerHTML = `
                    <th class="p-2.5 rounded-l-lg">No</th>
                    <th class="p-2.5">Keterangan / Produk</th>
                    <th class="p-2.5 text-center">Kuantiti</th>
                    <th class="p-2.5 text-right">Harga Seunit</th>
                    <th class="p-2.5 text-right rounded-r-lg">Jumlah</th>
                `;

                let grandTot = 0;
                dataArr.forEach((item, idx) => {
                    let desc = translateDynamicText(item.title || item.item || item.product || '-');
                    let qty = item.qty || 1;
                    let amt = parseFloat((item.total || item.amount || '0').toString().replace(/[^0-9.]/g, '')) || 0;
                    grandTot += amt;
                    tbody.innerHTML += `<tr><td class="p-2.5">${idx+1}</td><td class="p-2.5 font-medium">${desc}</td><td class="p-2.5 text-center">${qty}</td><td class="p-2.5 text-right">-</td><td class="p-2.5 text-right font-bold text-emerald-700">${currentCurrency} ${amt.toFixed(2)}</td></tr>`;
                });
                document.getElementById('invoiceGrandTotal').innerText = `${currentCurrency} ${grandTot.toFixed(2)}`;
            }

            document.getElementById('invoiceModal').classList.remove('hidden');
            setTimeout(initSignaturePad, 200);
        }

        function closeInvoiceModal() { document.getElementById('invoiceModal').classList.add('hidden'); }
        function downloadInvoicePdfOrText() { window.print(); }

        function verifyPoLogin() {
            const pass = document.getElementById('poPassInput').value;
            if (pass === secretAdminCode) {
                document.getElementById('poLoginPanel').classList.add('hidden');
                document.getElementById('poMainContent').classList.remove('opacity-50', 'pointer-events-none');
                alert("Akses PO Masuk berjaya dibuka!");
            } else {
                alert("Kata laluan salah! Sila masukkan kata laluan pentadbir yang sah.");
            }
        }

        function renderAdminCustomerOrders() {
            const tbody = document.getElementById('adminCustomerOrdersTableBody');
            if (!tbody) return;
            tbody.innerHTML = "";
            if (customerOrdersList.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400">Belum ada Pesanan Belian (PO) masuk.</td></tr>`;
                return;
            }
            customerOrdersList.forEach((o, index) => {
                let itemsText = (o.items || []).map(i => `${translateDynamicText(i.name)} (${i.qty} unit)`).join(', ');
                window[`orderData_${index}`] = o;

                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="p-2 font-mono font-bold">${o.invoiceNo || 'INV-PO-' + o.id}</td>
                        <td class="p-2">${o.date || '-'}</td>
                        <td class="p-2 font-semibold">${translateDynamicText(o.customerName) || 'Pelanggan'}<br><span class="text-[10px] text-slate-500">${o.customerPhone || '-'}</span></td>
                        <td class="p-2 text-xs">${itemsText}</td>
                        <td class="p-2 text-xs">Kurir: ${o.shipping || '-'}<br>Bayar: ${translateDynamicText(o.payment) || '-'}</td>
                        <td class="p-2">
                            <input type="text" id="resi_${o.firestoreId}" value="${o.trackingNo || ''}" placeholder="No Rujukan..." class="border p-1 rounded text-xs w-28 mb-1">
                            <button type="button" onclick="saveTrackingResi('${o.firestoreId}')" class="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]">Simpan</button>
                        </td>
                        <td class="p-2 text-center space-y-1">
                            <button type="button" onclick='showCustomerOrderInvoice(window.orderData_${index})' class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold block w-full shadow cursor-pointer">📄 Invois</button>
                            <a href="https://wa.me/${(o.customerPhone || '').replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Halo ' + (o.customerName || 'Pelanggan') + ', pesanan PO dengan nombor ' + (o.invoiceNo || '') + ' sedang diproses.')}" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs block font-semibold">💬 WhatsApp</a>
                            <button type="button" onclick="deleteCustomerOrder('${o.firestoreId}')" class="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-xs block w-full font-semibold">🗑️ Padam</button>
                        </td>
                    </tr>
                `;
            });
        }

        function saveTrackingResi(firestoreId) {
            let resiVal = document.getElementById(`resi_${firestoreId}`).value.trim();
            if (db) {
                db.collection("customer_orders").doc(firestoreId).update({ 
                    trackingNo: resiVal, 
                    status: resiVal ? "Dalam Penghantaran 🚚" : "Sedang Diproses 📦" 
                }).then(() => {
                    alert("Nombor rujukan & status berjaya dikemaskini ke sistem pelanggan!");
                }).catch(err => alert("Gagal menyimpan nombor rujukan: " + err.message));
            }
        }

        function deleteCustomerOrder(firestoreId) {
            if (confirm("Yakin ingin memadamkan riwayat PO ini secara kekal dari sistem?")) {
                if (db) {
                    db.collection("customer_orders").doc(firestoreId).delete().then(() => {
                        alert("Riwayat PO berjaya dipadam!");
                    }).catch(err => alert("Gagal memadam: " + err.message));
                }
            }
        }

        function showCustomerOrderInvoice(orderObj) {
            if (!orderObj) return;
            
            document.getElementById('invModalMainHeader').innerText = "INVOIS PESANAN BELIAN (PO)";
            document.getElementById('invModalInvoiceNo').innerText = `No: ${orderObj.invoiceNo || 'INV-PO-' + (orderObj.id || '')}`;
            document.getElementById('invModalDateNum').innerText = `Tarikh: ${orderObj.date || '-'}`;
            document.getElementById('invOfficeAddressDisplay').innerText = officeCompanyAddress;
            document.getElementById('invRecipientLabel').innerText = "Kepada (Pelanggan / Pembeli):";
            document.getElementById('invCustomerName').innerText = translateDynamicText(orderObj.customerName) || 'Pelanggan Umum';
            document.getElementById('invCustomerAddress').innerText = `Alamat: ${translateDynamicText(orderObj.customerAddress) || '-'}`;
            document.getElementById('invCustomerPhone').innerText = `Tel: ${orderObj.customerPhone || '-'}`;
            document.getElementById('invModalOwner').innerText = getRealNameOnly();
            document.getElementById('invoiceGrandTotalWrapper').style.display = 'block';

            let currSymbol = orderObj.currency || currentCurrency;

            document.getElementById('invoiceTableHeaderRow').innerHTML = `
                <th class="p-2.5 rounded-l-lg">No</th>
                <th class="p-2.5">Keterangan / Produk</th>
                <th class="p-2.5 text-center">Kuantiti</th>
                <th class="p-2.5 text-right">Harga Seunit</th>
                <th class="p-2.5 text-right rounded-r-lg">Jumlah</th>
            `;

            const tbody = document.getElementById('invoiceTableBody');
            tbody.innerHTML = "";
            
            let grandTot = 0;
            if (orderObj.items && Array.isArray(orderObj.items)) {
                orderObj.items.forEach((item, idx) => {
                    let itemTotal = (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0);
                    grandTot += itemTotal;
                    tbody.innerHTML += `
                        <tr>
                            <td class="p-2.5">${idx + 1}</td>
                            <td class="p-2.5 font-bold text-slate-800">${translateDynamicText(item.name) || 'Produk'}</td>
                            <td class="p-2.5 text-center">${item.qty || 1}</td>
                            <td class="p-2.5 text-right">${currSymbol} ${(parseFloat(item.price) || 0).toFixed(2)}</td>
                            <td class="p-2.5 text-right font-bold text-emerald-700">${currSymbol} ${itemTotal.toFixed(2)}</td>
                        </tr>
                    `;
                });
            } else {
                grandTot = parseFloat(orderObj.grandTotal) || 0;
                tbody.innerHTML += `
                    <tr>
                        <td class="p-2.5">1</td>
                        <td class="p-2.5 font-bold text-slate-800">Pesanan Produk Medicalpro</td>
                        <td class="p-2.5 text-center">1</td>
                        <td class="p-2.5 text-right">${currSymbol} ${grandTot.toFixed(2)}</td>
                        <td class="p-2.5 text-right font-bold text-emerald-700">${currSymbol} ${grandTot.toFixed(2)}</td>
                    </tr>
                `;
            }

            document.getElementById('invoiceGrandTotal').innerText = `${currSymbol} ${grandTot.toFixed(2)}`;
            document.getElementById('invoiceModal').classList.remove('hidden');
            setTimeout(initSignaturePad, 200);
        }

                // Inisialisasi Utama Saat Halaman Dimuat
        window.addEventListener('DOMContentLoaded', () => {
            applyLanguage();
            changeGlobalCurrency(currentCurrency);
            checkUserProfile();
            updateLiveClockAndWeather();
            loadBossOrdersRealtime();
            
            // Jalankan pembersihan otomatis riwayat chat > 7 hari di latar belakang
            autoCleanOldChat();
        });

        function getTitleEmoji(gender) {
            switch (gender) {
                case 'Dato': return '👑';
                case 'Tuan': return '🎩';
                case 'Puan': return '👒';
                case 'Abang': return '🧢';
                case 'Akak': return '🧕';
                case 'Pakcik': return '👴';
                case 'Makcik': return '👵';
                default: return '👤';
            }
        }

        // Fungsi untuk menghapus otomatis chat yang umurnya lebih dari 7 hari (1 minggu)
        function autoCleanOldChat() {
            if (!db) return;
            
            // Hitung waktu 7 hari yang lalu
            let satuMingguLalu = new Date();
            satuMingguLalu.setDate(satuMingguLalu.getDate() - 7);

            db.collection("boss_orders")
              .where("timestamp", "<", satuMingguLalu)
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      // Hapus otomatis pesan yang lebih dari 1 minggu
                      doc.ref.delete().catch(() => {});
                  });
              })
              .catch((err) => console.log("Gagal membersihkan chat lama:", err));
        }
    </script>
</body>
</html>
