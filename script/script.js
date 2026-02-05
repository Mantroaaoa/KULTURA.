
// ==========================================
// 0. AUTHENTICATION & ACCOUNT LOGIC
// ==========================================
// Transient Membership Status (Resets on refresh)
window.isMember = false;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Default to All
    renderShop('all');
    checkLoginStatus();
    updateStoreStatus();
    setInterval(updateStoreStatus, 60000); // Check every minute
    loadTrack(0); // Initialize Music Player
});

// Toggle Mobile Menu
window.toggleMenu = function () {
    const menu = document.querySelector('.center-menu');
    menu.classList.toggle('active');
};

// --- STORE STATUS LOGIC ---
function updateStoreStatus() {
    const statusEl = document.getElementById('store-status');
    if (!statusEl) return;

    const now = new Date();
    const hour = now.getHours();

    // Open from 10:00 to 22:00 (10 PM)
    const isOpen = hour >= 10 && hour < 22;

    const lang = localStorage.getItem('kulturaLang') || 'en';

    if (isOpen) {
        statusEl.innerText = lang === 'id' ? "• TOKO BUKA" : "• WE ARE OPEN";
        statusEl.className = "store-status status-open";
    } else {
        statusEl.innerText = lang === 'id' ? "• TOKO TUTUP" : "• WE ARE CLOSED";
        statusEl.className = "store-status status-closed";
    }
}

// ==========================================
// MUSIC PLAYER LOGIC
// ==========================================
const musicTracks = [
    { title: "Lush Life", src: "img/lushLife.mpeg" },
    { title: "Lofi Beats", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Acoustic Breeze", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer = new Audio();
audioPlayer.volume = 0.2; // Low volume as requested

// Load Initial Track
function loadTrack(index) {
    if (index < 0) index = musicTracks.length - 1;
    if (index >= musicTracks.length) index = 0;

    currentTrackIndex = index;
    audioPlayer.src = musicTracks[index].src;
    document.getElementById('music-title').innerText = musicTracks[index].title;
    updateTimeDisplay();
}

function playPauseTrack() {
    const btn = document.getElementById('play-pause-btn');
    if (isPlaying) {
        audioPlayer.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    } else {
        // Initialize if empty
        if (!audioPlayer.src) loadTrack(currentTrackIndex);

        audioPlayer.play().then(() => {
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }).catch(e => {
            console.log("Autoplay prevented or error:", e);
            showToast("Play failed. Please interact with the page first.", 'error');
        });
    }
}

function nextTrack() {
    loadTrack(currentTrackIndex + 1);
    if (isPlaying) audioPlayer.play();
}

function prevTrack() {
    loadTrack(currentTrackIndex - 1);
    if (isPlaying) audioPlayer.play();
}

audioPlayer.addEventListener('timeupdate', () => {
    updateTimeDisplay();
});

audioPlayer.addEventListener('ended', () => {
    nextTrack();
});

function updateTimeDisplay() {
    const current = formatTime(audioPlayer.currentTime);
    const duration = formatTime(audioPlayer.duration || 0);
    const timeDisplay = document.getElementById('music-time');
    if (timeDisplay) timeDisplay.innerText = `${current} / ${duration}`;
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function checkLoginStatus() {
    // Check Auth
    const user = localStorage.getItem('kulturaUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    updateUserDisplay();

    // Check Purchase Persistence
    const purchaseStatus = localStorage.getItem('kulturaHasPurchased');
    if (purchaseStatus) {
        console.log("Welcome back, verified customer!");
    }

    // Check Theme
    const savedTheme = localStorage.getItem('kulturaTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.checked = true;
    }

    // Check Language
    const savedLang = localStorage.getItem('kulturaLang') || 'en'; // Default English
    setLanguage(savedLang);
    const langSelect = document.getElementById('lang-select');
    if (langSelect) langSelect.value = savedLang;
}

// TRANSLATION DICTIONARY
const translations = {
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_shop: "Shop",
        nav_contact: "Contact",
        settings_title: "Settings",
        logout: "Log Out",
        theme_title: "Dark Mode",
        theme_desc: "Switch between light and dark themes",
        lang_title: "Language",
        lang_desc: "Switch between English and Bahasa",
        notif_title: "Notifications",
        notif_desc: "Receive updates about new products",
        hero_title: "Elegance in Every Stitch",
        hero_subtitle: "Discover the finest collection of apparel that defines your style. Quality craftsmanship meets modern design.",
        hero_cta: "Shop Now",
        shop_title: "Shop Our Products",
        prop_shipping_title: "Fast Shipping",
        prop_shipping_desc: "Get your orders delivered comfortably to your door.",
        prop_quality_title: "Premium Quality",
        prop_quality_desc: "We use only the finest materials for our products.",
        prop_support_title: "24/7 Support",
        prop_support_desc: "Our team is here to help you anytime, anywhere.",
        about_title: "About Us",
        about_desc: "We are passionate about creating clothing that not only looks good but feels good. Our journey began with a simple idea: to make high-quality fashion accessible to everyone.",
        about_readmore: "Read Our Story",
        ratings_title: "What Our Customers Say",
        ratings_subtitle: "Trusted by thousands of happy customers worldwide.",
        faq_title: "Frequently Asked Questions",
        faq_q1: "How long is shipping?",
        faq_a1: "Shipping usually takes 2-3 business days for Jabodetabek and 3-5 days for other regions.",
        faq_q2: "Can I exchange sizes?",
        faq_a2: "Yes, we provide size exchange within 7 days of receiving the item, provided tags are attached.",
        faq_q3: "How to track my order?",
        faq_a3: "Once shipped, we send a tracking number via email or WhatsApp.",
        footer_desc: "Redefining modern fashion with elegance and quality.",
        footer_links: "Quick Links",
        footer_follow: "Follow Us",
        footer_copyright: "&copy; 2024 Kultura. All rights reserved.",
        cat_all: "All",
        cat_clothing: "Clothing",
        cat_pants: "Pants",
        cat_socks: "Socks",
        cat_shoes: "Shoes",
        cat_hats: "Hats",
        newsletter_title: "Join Our Newsletter",
        newsletter_desc: "Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.",
        newsletter_btn: "Subscribe",
        btn_write_review: "Write a Review",
        btn_view_all_reviews: "View All Reviews",
        modal_review_title: "Write a Review",
        label_comment: "Comment",
        review_rating_label: "Rating",
        btn_view_all_products: "See All Products",
        btn_submit_review: "Submit Review",
        footer_care: "Customer Care",
        music_title_label: "Background Music",
        care_shipping: "Shipping & Returns",
        care_size: "Size Guide",
        care_track: "Track Order",
        care_faq: "FAQs",
        care_shipping_title: "Shipping & Returns Policy",
        care_shipping_body: "<p><strong>Domestic Shipping:</strong> We ship nationwide via JNE/J&T. Orders are processed within 24 hours.</p><p><strong>Returns:</strong> You may return items within 7 days of receipt for exchange or store credit, provided tags are attached.</p>",
        care_size_title: "Size Guide",
        care_size_body: "<p><strong>Apparel:</strong></p><ul><li>S: Chest 90cm</li><li>M: Chest 96cm</li><li>L: Chest 102cm</li><li>XL: Chest 110cm</li></ul><p><strong>Shoes:</strong> Standard EUR sizing (38-44).</p>",
        care_track_title: "Track Your Order",
        care_track_body: "<p>Enter your Order ID on the tracking page sent to your email. If you did not receive one, please contact support via WhatsApp.</p>",
        care_faq_title: "Frequently Asked Questions",
        care_faq_body: "<p><strong>Q: Is this authentic?</strong><br>A: Yes, 100% original designs manufactured in Indonesia.</p><p><strong>Q: Payment methods?</strong><br>A: We accept Bank Transfer, QRIS, and Credit Cards via Midtrans.</p>",
        mem_card_title: "Join Membership",
        mem_card_desc: "Unlock exclusive perks and get 10% off your purchase immediately.",
        btn_join_member: "Join Now",
        mem_promo_text: "Join member to get discount 10%!",
        mem_toggle_text: "Use Member Discount (10%)",
        mem_already_joined: "You are already a member!"
    },

    id: {
        nav_home: "Beranda",
        nav_about: "Tentang",
        nav_shop: "Belanja",
        nav_contact: "Kontak",
        settings_title: "Pengaturan",
        logout: "Keluar",
        theme_title: "Mode Gelap",
        theme_desc: "Beralih antara tema terang dan gelap",
        lang_title: "Bahasa",
        lang_desc: "Beralih antara Inggris dan Bahasa Indonesia",
        notif_title: "Notifikasi",
        notif_desc: "Terima pembaruan tentang produk baru",
        hero_title: "Elegan di Setiap Jahitan",
        hero_subtitle: "Temukan koleksi pakaian terbaik yang mendefinisikan gaya Anda. Kualitas pengerjaan bertemu desain modern.",
        hero_cta: "Belanja Sekarang",
        shop_title: "Belanja Produk Kami",
        prop_shipping_title: "Pengiriman Cepat",
        prop_shipping_desc: "Pesanan Anda diantar dengan nyaman ke depan pintu Anda.",
        prop_quality_title: "Kualitas Premium",
        prop_quality_desc: "Kami hanya menggunakan bahan terbaik untuk produk kami.",
        prop_support_title: "Dukungan 24/7",
        prop_support_desc: "Tim kami siap membantu Anda kapan saja, di mana saja.",
        about_title: "Tentang Kami",
        about_desc: "Kami bersemangat menciptakan pakaian yang tidak hanya terlihat bagus tapi nyaman. Perjalanan kami dimulai dengan ide sederhana: membuat fashion berkualitas tinggi dapat diakses oleh semua orang.",
        about_readmore: "Baca Cerita Kami",
        ratings_title: "Apa Kata Pelanggan Kami",
        ratings_subtitle: "Dipercaya oleh ribuan pelanggan bahagia di seluruh dunia.",
        faq_title: "Pertanyaan yang Sering Diajukan",
        faq_q1: "Berapa lama pengiriman barang?",
        faq_a1: "Pengiriman biasanya memakan waktu 2-3 hari kerja untuk Jabodetabek dan 3-5 hari untuk luar pulau.",
        faq_q2: "Apakah bisa tukar size?",
        faq_a2: "Ya, kami menyediakan garansi tukar size dalam waktu 7 hari setelah barang diterima, dengan syarat tag masih terpasang.",
        faq_q3: "Bagaimana cara melacak pesanan?",
        faq_a3: "Setelah dikirim, kami akan mengirimkan nomor resi melalui email atau WhatsApp.",
        footer_desc: "Mendefinisikan ulang fashion modern dengan keanggunan dan kualitas.",
        footer_links: "Tautan Cepat",
        footer_follow: "Ikuti Kami",
        footer_copyright: "&copy; 2024 Kultura. Hak cipta dilindungi.",
        cat_all: "Semua",
        cat_clothing: "Baju",
        cat_pants: "Celana",
        cat_socks: "Kaos Kaki",
        cat_shoes: "Sepatu",
        cat_hats: "Topi",
        newsletter_title: "Berlangganan Newsletter",
        newsletter_desc: "Dapatkan penawaran spesial, hadiah gratis, dan diskon menarik.",
        newsletter_btn: "Langganan",
        btn_write_review: "Beri Ulasan",
        btn_view_all_reviews: "Lihat Semua Ulasan",
        modal_review_title: "Tulis Ulasan",
        label_comment: "Komentar",
        review_rating_label: "Penilaian",
        btn_view_all_products: "Lihat Semua Produk",
        btn_submit_review: "Kirim Ulasan",
        footer_care: "Layanan Pelanggan",
        music_title_label: "Musik Latar",
        care_shipping: "Pengiriman & Pengembalian",
        care_size: "Panduan Ukuran",
        care_track: "Lacak Pesanan",
        care_faq: "Tanya Jawab (FAQ)",
        care_shipping_title: "Kebijakan Pengiriman & Retur",
        care_shipping_body: "<p><strong>Pengiriman Domestik:</strong> Kami mengirim ke seluruh Indonesia via JNE/J&T. Pesanan diproses dalam 24 jam.</p><p><strong>Retur:</strong> Penukaran barang maksimal 7 hari setelah diterima, dengan syarat, tag masih terpasang.</p>",
        care_size_title: "Panduan Ukuran",
        care_size_body: "<p><strong>Pakaian:</strong></p><ul><li>S: Dada 90cm</li><li>M: Dada 96cm</li><li>L: Dada 102cm</li><li>XL: Dada 110cm</li></ul><p><strong>Sepatu:</strong> Ukuran Standar EUR (38-44).</p>",
        care_track_title: "Lacak Pesanan Anda",
        care_track_body: "<p>Masukkan ID Pesanan Anda pada halaman pelacakan yang dikirim ke email. Jika belum menerima, hubungi admin via WhatsApp.</p>",
        care_faq_title: "Pertanyaan Umum (FAQ)",
        care_faq_body: "<p><strong>Q: Apakah ini otentik?</strong><br>A: Ya, 100% desain asli buatan Indonesia.</p><p><strong>Q: Metode pembayaran?</strong><br>A: Kami menerima Transfer Bank, QRIS, dan Kartu Kredit via Midtrans.</p>",
        mem_card_title: "Gabung Member",
        mem_card_desc: "Dapatkan keuntungan eksklusif dan diskon 10% untuk pembelian Anda.",
        btn_join_member: "Gabung Sekarang",
        mem_promo_text: "Gabung member untuk dapat diskon 10%!",
        mem_toggle_text: "Gunakan Diskon Member (10%)",
        mem_already_joined: "Anda sudah menjadi member!"
    }
};

window.setLanguage = function (lang) {
    localStorage.setItem('kulturaLang', lang);
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Trigger store status update on language change
    updateStoreStatus();
    renderShop('all'); // Re-render to update product cards if needed
    updateSidebarMemberUI(); // Update sidebar member text
    renderMemberCard(); // Update member card text in footer


    // CUSTOMER CARE MODAL LOGIC
    window.openCustomerCare = function (type) {
        const modal = document.getElementById('customer-care-modal');
        const title = document.getElementById('care-modal-title');
        const body = document.getElementById('care-modal-body');
        if (!modal) return;

        const lang = localStorage.getItem('kulturaLang') || 'en';
        const t = translations[lang];

        let contentKey = "";
        if (type === 'shipping') contentKey = "care_shipping";
        if (type === 'size') contentKey = "care_size";
        if (type === 'track') contentKey = "care_track";
        if (type === 'faq') contentKey = "care_faq";

        if (t) {
            title.innerText = t[contentKey + "_title"];
            body.innerHTML = t[contentKey + "_body"];
        }

        modal.classList.add('active');
    };

    window.closeCustomerCare = function () {
        const modal = document.getElementById('customer-care-modal');
        if (modal) modal.classList.remove('active');
    };

    // Update Filter Text Manually if needed (buttons handled by data-i18n)
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeBtn ? getCategoryFromBtn(activeBtn) : 'all';
    renderShop(activeCategory); // Re-render products with new language
};

function getCategoryFromBtn(btn) {
    // Reverse map button text/attribute to category key if needed
    // Simplified: relying on onclick logic or storing category in dataset
    // For now, let's trust the filter logic or default to all
    return 'all'; // Fallback for now to prevent broken views
}

// LOGIN FORM REMOVED FROM HERE (Handled in login.html)


function updateUserDisplay() {
    const userData = JSON.parse(localStorage.getItem('kulturaUser'));
    if (userData) {
        const popupUsername = document.getElementById('popup-username');
        const popupEmail = document.getElementById('popup-email');
        const popupInitial = document.getElementById('popup-initial');

        if (popupUsername) popupUsername.textContent = userData.username;
        if (popupEmail) popupEmail.textContent = userData.email;

        // Profile Picture Logic
        const storedImg = localStorage.getItem('kulturaProfilePic');
        const navIcon = document.getElementById('nav-user-icon');

        if (storedImg) {
            // Apply image to popup avatar
            if (popupInitial) {
                popupInitial.innerHTML = `<img src="${storedImg}" style="width:100%; height:100%; object-fit:cover;">`;
                popupInitial.style.backgroundColor = 'transparent';
            }
            // Apply image to nav icon
            if (navIcon) {
                navIcon.innerHTML = `<img src="${storedImg}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            }
        } else {
            // Revert to Initial
            if (popupInitial) {
                popupInitial.textContent = userData.username.charAt(0).toUpperCase();
                popupInitial.style.backgroundColor = '#2c3e50'; // Default Color
                popupInitial.innerHTML = userData.username.charAt(0).toUpperCase(); // Ensure text is set
            }
            // Revert Nav Icon to Initial Circle
            if (navIcon) {
                navIcon.innerHTML = userData.username.charAt(0).toUpperCase();
                navIcon.style.backgroundColor = '#2c3e50';
                navIcon.style.color = '#fff';
                navIcon.style.borderRadius = '50%';
                navIcon.style.fontSize = '0.9rem';
                navIcon.style.fontWeight = 'bold';
                navIcon.style.display = 'flex';
                navIcon.style.alignItems = 'center';
                navIcon.style.justifyContent = 'center';
                navIcon.style.border = 'none';
            }
        }
    }
}

// TOAST NOTIFICATION FUNCTION
// TOAST NOTIFICATION FUNCTION
// TOAST NOTIFICATION FUNCTION
window.showToast = function (message, type = 'success') {
    // Check Notification Setting
    const notifToggle = document.getElementById('notif-toggle');
    if (notifToggle && !notifToggle.checked) {
        // Notifications disabled by user
        return;
    }

    let toast = document.getElementById('toast-notif');

    // Create toast if it doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notif';
        document.body.appendChild(toast);
    }

    // Set content - allowing HTML for icons
    toast.innerHTML = message;

    // Determine Base Class
    let baseClass = "toast";
    if (type === 'error') baseClass += " error";

    // Reset animation
    toast.className = baseClass;
    void toast.offsetWidth; // Trigger reflow
    toast.className = baseClass + " show";

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
};

// PROFILE PICTURE FUNCTIONS
window.handleProfileUpload = function (input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            // Compress/limit size if needed, but for now direct save (be careful of localStorage limits)
            try {
                localStorage.setItem('kulturaProfilePic', imgData);
                updateUserDisplay();
                showToast("Profile picture updated successfully!");
                closeProfileOptions();
            } catch (err) {
                showToast("Image too large! Please choose a smaller one.", 'error');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.removeProfilePicture = function () {
    localStorage.removeItem('kulturaProfilePic');
    updateUserDisplay();
    showToast("Profile picture removed.");
    closeProfileOptions();
};

// LOGOUT FUNCTION
window.logoutUser = function () {
    localStorage.removeItem('kulturaUser');
    window.location.href = 'index.html';
};

// ==========================================
// MEMBERSHIP LOGIC (TRANSIENT)
// ==========================================
window.joinMember = function () {
    if (window.isMember) {
        // Already member
        showToast("You are already a member!", "success");
        return;
    }

    // Set Transient State
    window.isMember = true;
    showToast("Welcome to the club! Discount unlocked.", "success");

    // Update UI
    updateSidebarMemberUI();
    renderMemberCard(); // Update card in footer
};

window.updateSidebarMemberUI = function () {
    const container = document.getElementById('sidebar-member-ui');
    if (!container) return;

    const lang = localStorage.getItem('kulturaLang') || 'en';
    const t = translations[lang] || translations['en'];

    if (!window.isMember) {
        // Show Promo
        container.innerHTML = `
            <div class="sidebar-member-promo">
                <p><i class="fas fa-crown"></i> ${t.mem_promo_text || "Join member to get discount 10%!"}</p>
                <a onclick="document.querySelector('.bottom-engagement-section').scrollIntoView({behavior: 'smooth'})">
                    ${t.btn_join_member || "Join Now"}
                </a>
            </div>
        `;
    } else {
        // Show Toggle
        container.innerHTML = `
            <div class="sidebar-member-toggle">
                <span><i class="fas fa-check-circle"></i> ${t.mem_toggle_text || "Use Member Discount (10%)"}</span>
                <label class="switch">
                    <input type="checkbox" id="member-toggle" onchange="hitungTotal()">
                    <span class="slider round"></span>
                </label>
            </div>
        `;
    }
    // Re-calculate total to ensure UI is fresh
    hitungTotal();
};

window.renderMemberCard = function () {
    const actionArea = document.getElementById('mem-action-area');
    if (!actionArea) return;

    const lang = localStorage.getItem('kulturaLang') || 'en';
    const t = translations[lang] || translations['en'];

    if (window.isMember) {
        actionArea.innerHTML = `<button class="btn-join-member" style="background:#27ae60; color:white; cursor:default;">
            <i class="fas fa-check"></i> ${t.mem_already_joined || "Member Active"}
        </button>`;
    } else {
        actionArea.innerHTML = `<button class="btn-join-member" onclick="joinMember()">
            ${t.btn_join_member || "Join Now"}
        </button>`;
    }
};

// Hook into bukaKasir to refresh UI
const originalBukaKasir = window.bukaKasir;
window.bukaKasir = function () {
    if (originalBukaKasir) originalBukaKasir(); // Call original if it exists (it's defined later in file, might need checking)
    // Actually bukaKasir is defined in script.js around line 1250 usually, let's find it or just override carefully.
    // Instead of overriding, let's just make sure updateSidebarMemberUI is called when sidebar opens.
    // Since we can't easily wrap without seeing line numbers for bukaKasir, let's just add it to 'updateCartBadge' or similar frequency.

    updateSidebarMemberUI();

    // Also show sidebar logic (re-implementing basic open if override failed, but better to just run the UI update)
    document.getElementById('sidebarCart').classList.add('active');
    document.querySelector('.sidebar-overlay').classList.add('active');

    // Add event listener to close button inside sidebar if needed, but HTML has onclick="tutupKasir()"
};

// Also loop updateSidebarMemberUI on load
document.addEventListener('DOMContentLoaded', () => {
    updateSidebarMemberUI();
    renderMemberCard();
});


// HELPER: Format Rupiah
function formatRupiah(price) {
    if (price === undefined || price === null) return "Rp 0";
    return "Rp " + price.toLocaleString('id-ID');
}

// TOGGLE ACCOUNT POPUP
const userLink = document.querySelector('.user-link');
const accountPopup = document.getElementById('account-popup');

if (userLink) {
    userLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing
        accountPopup.classList.toggle('active');
    });
}

document.addEventListener('click', (e) => {
    if (accountPopup && accountPopup.classList.contains('active')) {
        if (!accountPopup.contains(e.target) && !userLink.contains(e.target)) {
            accountPopup.classList.remove('active');
        }
    }
});

// SETTINGS MODAL LOGIC
window.openSettings = function () {
    const modal = document.getElementById('settings-modal');
    const popup = document.getElementById('account-popup');
    if (popup) popup.classList.remove('active'); // Close popup
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

window.closeSettings = function () {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// PROFILE OPTIONS MODAL LOGIC
window.openProfileOptions = function () {
    const modal = document.getElementById('profile-options-modal');
    const popup = document.getElementById('account-popup');
    if (popup) popup.classList.remove('active'); // Close popup
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

window.closeProfileOptions = function () {
    const modal = document.getElementById('profile-options-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// THEME TOGGLE
window.toggleTheme = function () {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('kulturaTheme', 'dark');
    } else {
        localStorage.setItem('kulturaTheme', 'light');
    }
};

window.changeLanguage = function () {
    const langSelect = document.getElementById('lang-select');
    const newLang = langSelect.value;
    setLanguage(newLang);
};

// ==========================================
// 1. DATA PRODUK (Expanded to 25 items)
// ==========================================
const productsDB = [
    // --- BAJU ---
    {
        id: 101,
        category: "Baju",
        price: 50000,
        image: "img/baju1T.png",
        name: { id: "Polo nit Cream", en: "Cream Knit Polo" },
        shortDesc: { id: "Gaya kasual klasik.", en: "Classic casual style." },
        description: { id: "Baju polo rajut berwarna cream yang memberikan kesan elegan namun tetap santai. Terbuat dari bahan katun rajut premium yang lembut di kulit, bernapas, dan menyerap keringat dengan baik, sehingga sangat nyaman digunakan sepanjang hari. Desain kerah yang rapi dengan aksen garis tipis memberikan sentuhan klasik yang timeless. Cocok dipadukan dengan celana chino untuk tampilan semi-formal atau jeans untuk gaya yang lebih santai. Pilihan tepat untuk pria yang mengutamakan kenyamanan dan gaya dalam satu paket.", en: "Cream knitted polo shirt giving an elegant yet relaxed vibe. Made from premium knitted cotton." },
        details: { id: "Material: Cotton Knit Premium", en: "Material: Premium Cotton Knit" }
    },
    {
        id: 102,
        category: "Baju",
        price: 50000,
        image: "img/baju2T.png",
        name: { id: "Kaos Hitam Minimalis", en: "Minimalist Black Tee" },
        shortDesc: { id: "Esensial setiap saat.", en: "Essential every day." },
        description: { id: "Kaos hitam polos dengan potongan reguler fit yang pas di badan.", en: "Plain black t-shirt with a regular fit that fits perfectly." },
        details: { id: "Material: Cotton Bamboo", en: "Material: Cotton Bamboo" }
    },
    {
        id: 103,
        category: "Baju",
        price: 50000,
        image: "img/baju3T.png",
        name: { id: "Kaos Grafis Street", en: "Street Graphic Tee" },
        shortDesc: { id: "Ekspresikan dirimu.", en: "Express yourself." },
        description: { id: "Kaos hitam dengan sablon grafis artistik di bagian depan.", en: "Black t-shirt with artistic graphic screen printing on the front." },
        details: { id: "Material: Cotton Combed 24s", en: "Material: Cotton Combed 24s" }
    },
    {
        id: 104,
        category: "Baju",
        price: 50000,
        image: "img/baju4T.png",
        name: { id: "Jersey Sport Hitam", en: "Black Sport Jersey" },
        shortDesc: { id: "Performa maksimal.", en: "Maximum performance." },
        description: { id: "Baju olahraga jersey berwarna hitam dengan aksen garis klasik di lengan.", en: "Black sports jersey with classic stripe accents on the sleeves." },
        details: { id: "Material: Polyester Dry-Fit", en: "Material: Dry-Fit Polyester" }
    },
    {
        id: 105,
        category: "Baju",
        price: 50000,
        image: "img/BajuT.png",
        name: { id: "Kemeja Motif Abstrak", en: "Abstract Print Shirt" },
        shortDesc: { id: "Bold dan unik.", en: "Bold and unique." },
        description: { id: "Kemeja lengan pendek dengan print motif api abstrak yang berani.", en: "Short-sleeved shirt with a bold abstract fire motif print." },
        details: { id: "Material: Rayon Viscose", en: "Material: Rayon Viscose" }
    },

    // --- CELANA ---
    {
        id: 201,
        category: "Celana",
        price: 100000,
        image: "img/celana1T.png",
        name: { id: "Celana Baggy Hitam", en: "Black Baggy Pants" },
        shortDesc: { id: "Siluet modern.", en: "Modern silhouette." },
        description: { id: "Celana panjang model baggy dengan potongan lebar yang sedang hits.", en: "Baggy trousers with a wide cut that is currently popular." },
        details: { id: "Material: Cotton Twill", en: "Material: Cotton Twill" }
    },
    {
        id: 202,
        category: "Celana",
        price: 100000,
        image: "img/celana2T.png",
        name: { id: "Celana Pendek Cargo", en: "Cargo Shorts" },
        shortDesc: { id: "Fungsional.", en: "Functional." },
        description: { id: "Celana pendek model cargo dengan banyak saku multifungsi di samping.", en: "Cargo shorts with many multifunctional pockets on the side." },
        details: { id: "Material: Ripstop Canvas", en: "Material: Ripstop Canvas" }
    },
    {
        id: 203,
        category: "Celana",
        price: 100000,
        image: "img/celana3T.png",
        name: { id: "Short Sport Style", en: "Sport Style Shorts" },
        shortDesc: { id: "Sporty look.", en: "Sporty look." },
        description: { id: "Celana pendek olahraga dengan desain strip tiga klasik di samping.", en: "Sports shorts with classic three-stripe design on the side." },
        details: { id: "Material: Lotto Premium", en: "Material: Lotto Premium" }
    },
    {
        id: 204,
        category: "Celana",
        price: 100000,
        image: "img/celana4T.png",
        name: { id: "Celana Kulot Lebar", en: "Wide Culottes" },
        shortDesc: { id: "Gaya santai.", en: "Relaxed style." },
        description: { id: "Celana kulot super lebar yang menyerupai rok, memberikan ilusi kaki jenjang.", en: "Super wide culottes that resemble a skirt, giving the illusion of long legs." },
        details: { id: "Material: Crinkle Airflow", en: "Material: Crinkle Airflow" }
    },
    {
        id: 205,
        category: "Celana",
        price: 100000,
        image: "img/celanaT.png",
        name: { id: "Celana Cargo Panjang", en: "Long Cargo Pants" },
        shortDesc: { id: "Tangguh & Keren.", en: "Tough & Cool." },
        description: { id: "Celana panjang cargo dengan desain tactical modern.", en: "Long cargo pants with modern tactical design." },
        details: { id: "Material: Washed Canvas", en: "Material: Washed Canvas" }
    },

    // --- KAOS KAKI ---
    {
        id: 301,
        category: "Kaos Kaki",
        price: 15000,
        image: "img/kaosT.png",
        name: { id: "Paket Kaos Kaki Ankle", en: "Ankle Socks Pack" },
        shortDesc: { id: "Simpel 3 pasang.", en: "Simple 3 pairs." },
        description: { id: "Paket hemat berisi 3 pasang kaos kaki pendek semata kaki.", en: "Value pack containing 3 pairs of ankle socks." },
        details: { id: "Material: Cotton Spandex", en: "Material: Cotton Spandex" }
    },
    {
        id: 302,
        category: "Kaos Kaki",
        price: 15000,
        image: "img/kaos2T.png",
        name: { id: "Kaos Kaki Sport Putih", en: "White Sport Socks" },
        shortDesc: { id: "Bersih & Klasik.", en: "Clean & Classic." },
        description: { id: "Kaos kaki olahraga berwarna putih bersih dengan logo kecil.", en: "Clean white sports socks with small logo." },
        details: { id: "Material: Cotton Terry", en: "Material: Cotton Terry" }
    },
    {
        id: 303,
        category: "Kaos Kaki",
        price: 15000,
        image: "img/kaos3T.png",
        name: { id: "Kaos Kaki Mix Abu", en: "Mixed Grey Socks" },
        shortDesc: { id: "Variasi warna.", en: "Color variety." },
        description: { id: "Set kaos kaki dengan kombinasi warna putih dan abu-abu.", en: "Socks set with white and grey combination." },
        details: { id: "Material: Polyester Blend", en: "Material: Polyester Blend" }
    },
    {
        id: 304,
        category: "Kaos Kaki",
        price: 15000,
        image: "img/kaos4T.png",
        name: { id: "Kaos Kaki Kru Hitam", en: "Black Crew Socks" },
        shortDesc: { id: "Standar Crew.", en: "Standard Crew." },
        description: { id: "Kaos kaki model crew length (setengah betis) warna hitam.", en: "Black crew length socks." },
        details: { id: "Material: Cotton Nylon", en: "Material: Cotton Nylon" }
    },
    {
        id: 305,
        category: "Kaos Kaki",
        price: 15000,
        image: "img/kaos5T.png",
        name: { id: "Kaos Kaki Streetwear", en: "Streetwear Socks" },
        shortDesc: { id: "Aksen Tulisan.", en: "Text Accent." },
        description: { id: "Kaos kaki hitam dengan detail tulisan grafis putih di bagian atas.", en: "Black socks with white graphic text details on top." },
        details: { id: "Material: Combed Cotton", en: "Material: Combed Cotton" }
    },

    // --- SEPATU ---
    {
        id: 401,
        category: "Sepatu",
        price: 200000,
        image: "img/sepatu.png",
        name: { id: "Sneakers Klasik Hitam", en: "Black Classic Sneakers" },
        shortDesc: { id: "Timeless icon.", en: "Timeless icon." },
        description: { id: "Sneakers model klasik dengan desain low-top yang tidak pernah ketinggalan zaman.", en: "Classic low-top sneakers that never go out of style." },
        details: { id: "Material: Faux Leather & Gum Sole", en: "Material: Faux Leather & Gum Sole" }
    },
    {
        id: 402,
        category: "Sepatu",
        price: 200000,
        image: "img/sepatu1.png",
        name: { id: "Sepatu Lari Teal", en: "Teal Running Shoes" },
        shortDesc: { id: "Ringan & Cepat.", en: "Light & Fast." },
        description: { id: "Sepatu lari dengan warna teal yang fresh dan energik.", en: "Running shoes in fresh and energetic teal." },
        details: { id: "Material: Mesh & Phylon", en: "Material: Mesh & Phylon" }
    },
    {
        id: 403,
        category: "Sepatu",
        price: 200000,
        image: "img/sepatu2.png",
        name: { id: "Sneakers High-Top Putih", en: "White High-Top Sneakers" },
        shortDesc: { id: "Basket vibes.", en: "Basketball vibes." },
        description: { id: "Sneakers model high-top berwarna putih dengan aksen biru muda.", en: "White high-top sneakers with light blue accents." },
        details: { id: "Material: Synthetic Leather", en: "Material: Synthetic Leather" }
    },
    {
        id: 404,
        category: "Sepatu",
        price: 200000,
        image: "img/sepatu3.png",
        name: { id: "Sepatu Bola Putih", en: "White Soccer Shoes" },
        shortDesc: { id: "Untuk lapangan.", en: "For the field." },
        description: { id: "Sepatu bola dengan pul (studs) yang dirancang untuk lapangan rumput.", en: "Soccer shoes with studs designed for grass fields." },
        details: { id: "Material: Synthetic Upper", en: "Material: Synthetic Upper" }
    },
    {
        id: 405,
        category: "Sepatu",
        price: 200000,
        image: "img/sepatu4.png",
        name: { id: "Sneakers Merah Sporty", en: "Sporty Red Sneakers" },
        shortDesc: { id: "Racing style.", en: "Racing style." },
        description: { id: "Sneakers kasual dengan desain ramping ala sepatu balap.", en: "Casual sneakers with sleek racing-style design." },
        details: { id: "Material: Suede & Rubber", en: "Material: Suede & Rubber" }
    },

    // --- TOPI ---
    {
        id: 501,
        category: "Topi",
        price: 20000,
        image: "img/topi.png",
        name: { id: "Topi Snapback Putih", en: "White Snapback Cap" },
        shortDesc: { id: "Urban style.", en: "Urban style." },
        description: { id: "Topi model snapback dengan visor datar yang lebar.", en: "Snapback cap with wide flat visor." },
        details: { id: "Material: Acrylic Wool", en: "Material: Acrylic Wool" }
    },
    {
        id: 502,
        category: "Topi",
        price: 20000,
        image: "img/topi1.png",
        name: { id: "Topi Baseball Hijau", en: "Green Baseball Cap" },
        shortDesc: { id: "Warna kalem.", en: "Calm color." },
        description: { id: "Topi baseball dengan lengkungan visor yang pas.", en: "Baseball cap with perfect visor curve." },
        details: { id: "Material: Cotton Twill", en: "Material: Cotton Twill" }
    },
    {
        id: 503,
        category: "Topi",
        price: 20000,
        image: "img/topi2.png",
        name: { id: "Topi Trucker Klasik", en: "Classic Trucker Cap" },
        shortDesc: { id: "Breathable.", en: "Breathable." },
        description: { id: "Topi model trucker dengan bagian belakang jaring-jaring (mesh) untuk sirkulasi udara terbaik. Kombinasi warna biru navy dan cream yang vintage. Patch logo bordir di depan menambah nilai estetika. Sangat cocok dipakai saat cuaca panas terik.", en: "Trucker cap with mesh back." },
        details: { id: "Material: Foam & Mesh", en: "Material: Foam & Mesh" }
    },
    {
        id: 504,
        category: "Topi",
        price: 20000,
        image: "img/topi3.png",
        name: { id: "Topi Distro Cokelat", en: "Brown Distro Cap" },
        shortDesc: { id: "Earth tone.", en: "Earth tone." },
        description: { id: "Topi baseball warna cokelat tua dengan desain simpel. Bordir logo brand lifestyle yang subtle. Warna earth tone yang sedang tren. Cocok untuk Anda yang menyukai gaya low profile dan tidak mencolok.", en: "Dark brown baseball cap with simple design." },
        details: { id: "Material: Washed Canvas", en: "Material: Washed Canvas" }
    },
    {
        id: 505,
        category: "Topi",
        price: 20000,
        image: "img/topi4.png",
        name: { id: "Topi Olahraga Hitam", en: "Black Sports Cap" },
        shortDesc: { id: "Performance.", en: "Performance." },
        description: { id: "Topi khusus olahraga berwarna hitam sleek.", en: "Sleek black sports cap." },
        details: { id: "Material: Polyester Microfiber", en: "Material: Polyester Microfiber" }
    }
];

// Helper function to render a list of products
function renderProducts(productList) {
    const shopContainer = document.querySelector('.shop-content');
    if (!shopContainer) return;

    shopContainer.innerHTML = ''; // Clear existing content

    if (productList.length === 0) {
        shopContainer.innerHTML = '<div style="width:100%; text-align:center; padding: 40px; color: #666;">Produk tidak ditemukan untuk pencarian ini.</div>';
        return;
    }

    const lang = localStorage.getItem('kulturaLang') || 'en';

    // Translation items that are hardcoded in JS
    const txt_view_detail = lang === 'id' ? "Lihat Produk Lebih Detail" : "View Product Details";
    const txt_details_link = lang === 'id' ? "Lihat Lebih Detail" : "View Details";

    productList.forEach(product => {
        const pName = product.name[lang] || product.name['id']; // Fallback to ID
        const pShortDesc = product.shortDesc[lang] || product.shortDesc['id'];

        // --- Generate Random Rating ---
        if (!product.rating) {
            // Generate a random rating between 4.0 and 5.0
            product.rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
        }

        // Generate Star HTML based on rating value
        let starsHTML = '';
        const ratingVal = parseFloat(product.rating); // Ensure number

        for (let i = 1; i <= 5; i++) {
            if (ratingVal >= i) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (ratingVal >= i - 0.5) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }

        const itemHTML = `
            <div class="shop-item reveal-up">
                <div class="product-image">
                    <img src="${product.image}" alt="${pName}">
                    <div class="product-overlay">
                        <span>${txt_view_detail}</span>
                    </div>
                </div>
                <div class="product-info">
                    <h2>${pName}</h2>
                    <div class="price-box">
                        ${product.originalPrice ? `<p class="price" style="text-decoration: line-through; color: #888; font-size: 0.9rem;">${formatRupiah(product.originalPrice)}</p>` : ''}
                        <p class="price" style="color: #e74c3c; font-weight: bold; font-size: 1.1rem;">${formatRupiah(product.price)}</p>
                    </div>
                    <p class="short-desc">${pShortDesc}</p>
                    <div class="product-rating">
                         ${starsHTML}
                         <span class="rating-text">(${product.rating.replace('.', ',')})</span>
                    </div>
                    <div class="product-actions-new">
                        <button class="btn-add-cart" onclick="addToCart(${product.id}, this)">
                             <i class="fas fa-cart-plus" style="font-size: 1.1rem;"></i>
                        </button>
                         <a href="javascript:void(0)" class="details-link-new" onclick="openProductModal(${product.id});">${txt_details_link}</a>
                    </div>
                </div>
            </div>
        `;
        shopContainer.innerHTML += itemHTML;
    });

    // Re-trigger scroll animations for new items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.shop-item').forEach(el => observer.observe(el));
}

// Render Shop Items Dynamically with Filter
function renderShop(category = 'all') {
    let filteredProducts = [];

    if (category === 'all') {
        filteredProducts = productsDB;
    } else if (category === 'bestseller') {
        // PICK BEST SELLERS (1 per category)
        const categories = ['Baju', 'Celana', 'Kaos Kaki', 'Sepatu', 'Topi'];
        categories.forEach(cat => {
            const product = productsDB.find(p => p.category === cat);
            if (product) filteredProducts.push(product);
        });
    } else {
        filteredProducts = productsDB.filter(p => p.category === category);
    }

    renderProducts(filteredProducts);
}

// Global Filter Function for HTML Buttons
window.filterProduk = function (category) {
    renderShop(category);

    // Update Active Button State
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        // Simple check: does the onclick attribute contain the category?
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });
};

// Search Logic
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render handled by main listener (renderBestSellers)

    // Attach Search Listener
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        // Auto Scroll to Shop on Focus
        searchInput.addEventListener('focus', () => {
            document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length > 0) {
                // Filter by Name
                const filtered = productsDB.filter(p => {
                    // Check against both english and indo names just in case
                    const nameId = p.name.id.toLowerCase();
                    const nameEn = p.name.en.toLowerCase();
                    return nameId.includes(query) || nameEn.includes(query);
                });
                renderProducts(filtered);

                // Optional: Remove active class from category filters to indicate custom search
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            } else {
                // If empty, return to default (All)
                renderShop('all');
                // Reset 'Semua' as active
                const allBtn = Array.from(document.querySelectorAll('.filter-btn')).find(b => b.innerText === 'Semua');
                if (allBtn) {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    allBtn.classList.add('active');
                }
            }
        });
    }
});

// Filter Logic
window.filterSelection = function (category) {
    renderShop(category);

    // Manage Active Class
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        // Simple text matching or dataset usage. 
        // For now, simple text check:
        const text = btn.innerText;
        if (category === 'all' && text === 'Semua') {
            btn.classList.add('active');
        } else if (text === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// Call render on load - REMOVED (Handled at top) 
// document.addEventListener('DOMContentLoaded', () => {
//     renderShop('all');
// });

window.openProductModal = function (id) {
    const product = productsDB.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;

    // Populate Data
    // Populate Data
    const lang = localStorage.getItem('kulturaLang') || 'en';
    const pName = product.name[lang] || product.name['id'];
    const pDesc = product.description[lang] || product.description['id'];
    const pDetails = product.details[lang] || product.details['id'];

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = pName;
    document.getElementById('modal-price').innerText = formatRupiah(product.price);
    // Use the longer description here
    document.getElementById('modal-desc').innerText = pDesc;
    document.getElementById('modal-details').innerText = pDetails;

    // Handle Size Selection Visibility & Content
    const sizeSelect = document.getElementById('det-size');
    if (sizeSelect) {
        sizeSelect.innerHTML = ''; // Clear existing options

        if (product.category === 'Topi') {
            sizeSelect.style.display = 'none';
        } else if (product.category === 'Sepatu') {
            sizeSelect.style.display = 'block';
            // Numeric sizes for shoes
            const sizes = [38, 39, 40, 41, 42, 43, 44];
            sizes.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.innerText = s;
                sizeSelect.appendChild(opt);
            });
        } else {
            // Default S, M, L, XL for Baju, Celana, Kaos Kaki
            sizeSelect.style.display = 'block';
            const sizes = ['S', 'M', 'L', 'XL'];
            sizes.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.innerText = s;
                sizeSelect.appendChild(opt);
            });
        }
    }

    // Setup Add to Cart Button in Modal
    // Setup Add to Cart Button in Modal
    const btn = document.getElementById('modal-add-btn');
    btn.onclick = function () {
        const sizeSelect = document.getElementById('det-size');
        const selectedSize = sizeSelect ? sizeSelect.value : null;
        addToCart(product.id, this, selectedSize); // Pass 'this' and size
    };

    modal.classList.add('active');
};

window.closeProductModal = function () {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.remove('active');
};

// ==========================================
// 2. EXISTING UI LOGIC (Scroll, Slider, Modal)
// ==========================================
const nav = document.querySelector('nav');
const logo = document.querySelector('.logo');
const centerMenuLinks = document.querySelectorAll('.center-menu a');
const navIcons = document.querySelectorAll('.nav-icons i, .nav-icons svg, .search-btn');
let lastScrollY = window.scrollY;

function changeNav() {
    // Style Change on Scroll
    if (window.scrollY > 5) {
        nav.classList.add('scrolled');
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.1)';
        nav.style.backdropFilter = 'blur(10px)';
        logo.style.color = 'black';
        centerMenuLinks.forEach(link => link.style.color = 'black');
        navIcons.forEach(icon => icon.style.color = 'black');

        // Ensure search input visible in light mode


    } else {
        nav.classList.remove('scrolled');
        nav.style.backgroundColor = 'transparent';
        nav.style.boxShadow = 'none';
        logo.style.color = 'white';
        centerMenuLinks.forEach(link => link.style.color = 'white');
        navIcons.forEach(icon => icon.style.color = 'white');
        nav.style.backdropFilter = 'none';


    }

    lastScrollY = window.scrollY;
}
window.addEventListener('scroll', changeNav);

/* Hero Slider Logic */
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
if (slides.length > 0) {
    setInterval(nextSlide, 5000);
}

/* Modal Logic */
function toggleModal() {
    const modal = document.getElementById('aboutModal');
    if (modal) modal.classList.toggle('active');
}

// ==========================================
// 3. CART LOGIC (Revised)
// ==========================================
let cart = [];
const toast = document.getElementById('toast-notif');
const badge = document.getElementById('cart-badge');

window.addToCart = function (productId, buttonElement, size = null) {
    // 1. Logic Update State
    const product = productsDB.find(p => p.id === productId);
    if (!product) return;

    // Use a unique key for cart item based on ID and Size
    const existing = cart.find(i => i.id === productId && i.size === size);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1, size: size });
    }

    updateCartBadge();

    // Fix: Extract name string correctly
    const lang = localStorage.getItem('kulturaLang') || 'en';
    let pName = product.name;
    if (typeof product.name === 'object') {
        pName = product.name[lang] || product.name['id'];
    }
    showToast(`${pName} Added!`);

    if (document.getElementById('sidebarCart').classList.contains('active')) {
        renderCartList();
        hitungTotal();
    }

    // 2. Flying Animation
    const cartIcon = document.querySelector('.cart-link svg');
    let productImg = null;

    // Check if triggered from Modal (buttonElement is #modal-add-btn)
    if (buttonElement && buttonElement.id === 'modal-add-btn') {
        // Source is the Modal Image
        productImg = document.getElementById('modal-img');
    } else {
        // Source is the Card Image
        const shopItem = buttonElement.closest('.shop-item');
        productImg = shopItem ? shopItem.querySelector('img') : null;
    }

    if (productImg && cartIcon) {
        const flyImg = productImg.cloneNode();
        flyImg.classList.add('fly-item');
        const imgRect = productImg.getBoundingClientRect();

        // Ensure z-index is higher than modal
        flyImg.style.zIndex = '3000';

        flyImg.style.left = `${imgRect.left}px`;
        flyImg.style.top = `${imgRect.top}px`;
        flyImg.style.width = `${imgRect.width}px`;
        flyImg.style.height = `${imgRect.height}px`;

        document.body.appendChild(flyImg);

        const cartRect = cartIcon.getBoundingClientRect();

        // Small delay to allow browser to render initial position
        setTimeout(() => {
            flyImg.style.left = `${cartRect.left}px`;
            flyImg.style.top = `${cartRect.top}px`;
            flyImg.style.width = '20px';
            flyImg.style.height = '20px';
            flyImg.style.opacity = '0.5';
        }, 50);

        setTimeout(() => {
            flyImg.remove();
        }, 850);
    }
};

function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
        badge.innerText = count;
        // Bump animation
        badge.style.transition = 'transform 0.2s';
        badge.style.transform = 'scale(1.5)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
}

function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ==========================================
// 4. SIDEBAR LOGIC (New)
// ==========================================
window.bukaKasir = function () {
    renderCartList();
    hitungTotal();

    const sidebar = document.getElementById('sidebarCart');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.add('active');
    if (overlay) {
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.add('active'), 10); // Fade in
    }
};

window.tutupKasir = function () {
    const sidebar = document.getElementById('sidebarCart');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 400); // Wait for fade out
    }
};

function renderCartList() {
    const listContainer = document.getElementById('cart-items-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (cart.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:50px;">Your cart is empty.</p>';
        return;
    }

    // Reverse order: Newest items at the top
    let allItemsHTML = '';
    [...cart].reverse().forEach((item) => {
        // Find the ORIGINAL index of this item in the 'cart' array
        // We need the original index for updateCartItemQty() to work correctly
        const originalIndex = cart.indexOf(item);

        const itemTotal = item.price * item.qty;

        // Use ID for name if object (fallback)
        const lang = localStorage.getItem('kulturaLang') || 'en';
        let pName = item.name;
        if (typeof item.name === 'object') {
            pName = item.name[lang] || item.name['id'];
        }

        // Add Image to Cart Item
        allItemsHTML += `
            <div class="cart-item-row" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${pName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                <div class="item-info" style="flex: 1;">
                    <h5 style="margin: 0; font-size: 14px;">
                        ${pName} 
                        ${item.size ? `<span style="font-weight:normal; color:#666; font-size:12px;">(Size: ${item.size})</span>` : ''}
                    </h5>
                    <small style="color: #666;">${formatRupiah(item.price)}</small>
                    <div class="cart-qty-control" style="margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                        <button class="mini-btn" onclick="updateCartItemQty(${originalIndex}, -1)" style="padding: 2px 8px;">-</button>
                        <span class="cart-qty-display">${item.qty}</span>
                        <button class="mini-btn" onclick="updateCartItemQty(${originalIndex}, 1)" style="padding: 2px 8px;">+</button>
                    </div>
                </div>
                <div style="font-weight:bold; font-size: 14px;">${formatRupiah(itemTotal)}</div>
            </div>
            `;
    });
    listContainer.innerHTML = allItemsHTML;
}

window.updateCartItemQty = function (index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderCartList();
    hitungTotal();
    updateCartBadge();
};

window.hitungTotal = function () {
    let subTotalAwal = 0;
    // Map Categories for Discount Logic based on NEW category names
    let catTotals = { "Baju": 0, "Celana": 0, "Sepatu": 0, "Kaos Kaki": 0, "Topi": 0 };
    let catQtys = { "Baju": 0, "Celana": 0, "Sepatu": 0, "Kaos Kaki": 0, "Topi": 0 };

    cart.forEach(item => {
        let t = item.price * item.qty;
        subTotalAwal += t;

        if (catTotals[item.category] !== undefined) {
            catTotals[item.category] += t;
            catQtys[item.category] += item.qty;
        }
    });

    // --- DISCOUNT LOGIC (Refactored) ---
    let diskonBarang = 0;

    // Baju >= 5 -> 15%
    if (catQtys["Baju"] >= 5) diskonBarang += catTotals["Baju"] * 0.15;
    // Celana >= 4 -> 10%
    if (catQtys["Celana"] >= 4) diskonBarang += catTotals["Celana"] * 0.10;
    // Kaos Kaki >= 7 -> 25%
    if (catQtys["Kaos Kaki"] >= 7) diskonBarang += catTotals["Kaos Kaki"] * 0.25;
    // Sepatu >= 3 -> 20%
    if (catQtys["Sepatu"] >= 3) diskonBarang += catTotals["Sepatu"] * 0.20;

    let totalSetelahDiskonBarang = subTotalAwal - diskonBarang;

    // Threshold Discount
    let diskonBelanja = 0;
    let infoDiskonBelanja = "0%";

    if (totalSetelahDiskonBarang >= 1000000) {
        diskonBelanja = totalSetelahDiskonBarang * 0.25;
        infoDiskonBelanja = "25%";
    }
    else if (totalSetelahDiskonBarang >= 500000) {
        diskonBelanja = totalSetelahDiskonBarang * 0.20;
        infoDiskonBelanja = "20%";
    }

    let totalSetelahDiskonBelanja = totalSetelahDiskonBarang - diskonBelanja;

    // Member Discount (Dropdown Logic)
    let diskonMember = 0;
    // New Logic: Check Toggle
    const memberToggle = document.getElementById('member-toggle');

    // Check if toggle exists and is checked
    if (memberToggle && memberToggle.checked) {
        diskonMember = totalSetelahDiskonBelanja * 0.10;
    }

    let totalAkhir = totalSetelahDiskonBelanja - diskonMember;

    // UPDATE UI
    document.getElementById('txt-subtotal').innerText = formatRupiah(subTotalAwal);

    const rowDiskonBarang = document.getElementById('row-diskon-barang');
    if (rowDiskonBarang) {
        if (diskonBarang > 0) {
            document.getElementById('txt-diskon-barang').innerText = "- " + formatRupiah(diskonBarang);
            rowDiskonBarang.style.display = 'flex';
        } else {
            rowDiskonBarang.style.display = 'none';
        }
    }

    const rowDiskonBelanja = document.getElementById('row-diskon-belanja');
    if (rowDiskonBelanja) {
        if (diskonBelanja > 0) {
            document.getElementById('txt-diskon-belanja').innerText = `- ${formatRupiah(diskonBelanja)} (${infoDiskonBelanja})`;
            rowDiskonBelanja.style.display = 'flex';
        } else {
            rowDiskonBelanja.style.display = 'none';
        }
    }

    const rowDiskonMember = document.getElementById('row-diskon-member');
    if (rowDiskonMember) {
        if (diskonMember > 0) {
            document.getElementById('txt-diskon-member').innerText = "- " + formatRupiah(diskonMember);
            rowDiskonMember.style.display = 'flex';
        } else {
            rowDiskonMember.style.display = 'none';
        }
    }

    document.getElementById('txt-total-akhir').innerText = formatRupiah(totalAkhir);

    window.currentTotal = Math.floor(totalAkhir);
    cekUang();
};

window.cekUang = function () {
    const bayarVal = document.getElementById('input-bayar').value;
    const statusEl = document.getElementById('status-bayar');
    const btnBayar = document.getElementById('btn-bayar');

    if (cart.length === 0) {
        statusEl.innerText = "Keranjang kosong";
        btnBayar.disabled = true;
        return;
    }

    if (!bayarVal) {
        statusEl.innerText = "Menunggu input...";
        statusEl.style.color = "#888";
        btnBayar.disabled = true;
        return;
    }

    const uang = parseInt(bayarVal);
    const total = window.currentTotal || 0;

    if (uang >= total) {
        const kembalian = uang - total;
        statusEl.innerText = "Kembalian: " + formatRupiah(kembalian);
        statusEl.style.color = "green";
        btnBayar.disabled = false;
        btnBayar.style.backgroundColor = "#27ae60"; // Green for ready
    } else {
        statusEl.innerText = "Uang tidak mencukupi";
        statusEl.style.color = "red";
        btnBayar.disabled = true;
    }
};

// ==========================================
// 5. SUCCESS CELEBRATION LOGIC
// ==========================================
window.prosesBayar = function () {
    // 1. Play Custom Voice Message (Bilingual)
    const lang = localStorage.getItem('kulturaLang') || 'en';
    let audioSrc = lang === 'id' ? 'img/trmksBerbelanja.mpeg' : 'img/ThxShopping.mpeg';
    const audio = new Audio(audioSrc);
    audio.play().catch(e => console.log("Audio play failed:", e));

    // 2. Fire Confetti
    if (typeof confetti === 'function') {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // 3. Show Success Modal (High Five)
    const modal = document.getElementById('success-modal');
    // Reset animations
    const checkmark = modal.querySelector('.checkmark');
    const checkCircle = modal.querySelector('.checkmark__circle');
    const checkTick = modal.querySelector('.checkmark__check');

    if (checkmark) {
        checkmark.style.animation = 'none';
        checkmark.offsetHeight; /* trigger reflow */
        checkmark.style.animation = '';
    }
    if (checkCircle) {
        checkCircle.style.animation = 'none';
        checkCircle.offsetHeight; /* trigger reflow */
        checkCircle.style.animation = '';
    }
    if (checkTick) {
        checkTick.style.animation = 'none';
        checkTick.offsetHeight; /* trigger reflow */
        checkTick.style.animation = '';
    }

    modal.classList.add('active');

    // 4. Cleanup & Record Purchase
    cart = [];
    updateCartBadge();
    tutupKasir();

    // RECORD PURCHASE FOR REVIEW PERMISSION
    localStorage.setItem('kulturaHasPurchased', 'true');
    console.log("Purchase recorded - Review access granted.");
};

window.closeSuccessModal = function () {
    document.getElementById('success-modal').classList.remove('active');
};

// ==========================================
// 6. CONTACT MODAL LOGIC
// ==========================================
window.openContact = function () {
    // Close other overlays if open
    tutupKasir();
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.style.display = 'flex'; // Ensure display flex before opacity
        setTimeout(() => contactModal.classList.add('active'), 10);
    }
};

window.closeContact = function () {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.classList.remove('active');
        setTimeout(() => contactModal.style.display = 'none', 300);
    }
};

// Close modals when clicking outside
window.onclick = function (event) {
    const contactModal = document.getElementById('contact-modal');
    if (event.target == contactModal) {
        closeContact();
    }
    const successModal = document.getElementById('success-modal');
    if (event.target == successModal) {
        closeSuccessModal();
    }
};

// ==========================================
// 8. SEARCH BAR INTERACTION
// ==========================================
const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('.search-input');

if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        // e.preventDefault();
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    });
}

// Close search when clicking outside
document.addEventListener('click', (e) => {
    if (searchBox && !searchBox.contains(e.target) && searchBox.classList.contains('active')) {
        searchBox.classList.remove('active');
    }
});

// Optional: Submit on Enter
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            // Scroll to product section
            const productsSection = document.getElementById('produk');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
                // Optional: Filter products logic here
            }
            searchBox.classList.remove('active');
        }
    });
}

// ==========================================
// 7. SCROLL ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: false,
        mirror: false,
        offset: 50
    });

    // --- SCROLL ANIMATIONS ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Support both class naming conventions if necessary, or just 'visible'
                // The CSS uses .reveal-up.visible etc.
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const hiddenElements = document.querySelectorAll('.reveal-up, .fade-in, .slide-in-left, .slide-in-right, .card-hover, .product-card, .shop-item, .about-text, .about-video, .footer-col');
    hiddenElements.forEach(el => observer.observe(el));

    // --- FAQ ACCORDION LOGIC ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;

            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });
});

function formatRupiah(angka) {
    // Ensure we floor the final display value to integers
    return "Rp " + Math.floor(angka).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ==========================================
// 8. LIGHTBOX LOGIC
// ==========================================
// Event delegation for dynamically added images
document.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG' && e.target.closest('.shop-item')) {
        const src = e.target.src;
        openLightbox(src);
    }
});

function openLightbox(src) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img) {
        img.src = src;
        modal.classList.add('active');
    }
}

window.closeLightbox = function () {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
}

// Scroll Indicator Logic
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    const target = document.querySelector('.value-props') || document.querySelector('#shop');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
});

// Sound Effect on Scroll (Y=0 -> >0)
let isVoiceLooping = false;
let scrollVoiceCount = 0;
const MAX_LOOPS = 5;

// Helper for Text-to-Speech
function speakText(text, langCode = 'id-ID', onEndCallback = null) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any current speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 1.0;

        if (onEndCallback) {
            utterance.onend = onEndCallback;
        }

        window.speechSynthesis.speak(utterance);
    }
}

function playScrollLoop() {
    if (window.scrollY !== 0 || scrollVoiceCount >= MAX_LOOPS) {
        isVoiceLooping = false;
        return;
    }

    isVoiceLooping = true;
    scrollVoiceCount++;

    const lang = localStorage.getItem('kulturaLang') || 'en';
    const audioSrc = lang === 'id' ? 'img/gulirKebawah.mpeg' : 'img/scrollDown.mpeg';

    // Create Audio Object
    const scrollAudio = new Audio(audioSrc);

    // Play Audio
    scrollAudio.play().catch(e => {
        console.log("Scroll audio blocked:", e);
        isVoiceLooping = false;
    });

    // Handle Loop Logic on End
    scrollAudio.onended = function () {
        if (window.scrollY === 0 && isVoiceLooping && scrollVoiceCount < MAX_LOOPS) {
            // Check again after small delay
            setTimeout(() => {
                if (window.scrollY === 0) playScrollLoop();
            }, 1000);
        } else {
            isVoiceLooping = false;
        }
    };

    // Expose audio to be cancelable globally if needed, or just let it finish. 
    // Ideally we track it to stop it if user scrolls, but for short clips letting it finish is usually fine.
    // If exact cut-off is needed:
    window.currentScrollAudio = scrollAudio;
}

window.addEventListener('scroll', () => {
    // Logic: Provide voice waiting at top (Y=0)
    if (window.scrollY === 0) {
        if (!isVoiceLooping && scrollVoiceCount < MAX_LOOPS) {
            playScrollLoop();
        }
    } else {
        // Stop immediately if scrolling down
        if (isVoiceLooping) {
            isVoiceLooping = false;
            // Stop audio if currently playing (if we tracked it)
            if (window.currentScrollAudio) {
                window.currentScrollAudio.pause();
                window.currentScrollAudio.currentTime = 0;
            }
            if ('speechSynthesis' in window) window.speechSynthesis.cancel(); // Backup safety
        }
        // Reset count so it can play again if user returns to top
        scrollVoiceCount = 0;
    }
});



// ==========================================
// 10. REVIEW SYSTEM LOGIC
// ==========================================
function openReviewModal() {
    // CHECK PURCHASE HISTORY FIRST
    const hasPurchased = localStorage.getItem('kulturaHasPurchased');
    if (!hasPurchased) {
        showToast("Access Denied: Please purchase a product first.", 'error');
        return;
    }

    console.log('Opening review modal');
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.style.display = 'flex'; // This is essential
        // Force all visibility properties
        modal.style.zIndex = '200000';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.pointerEvents = 'auto';

        // Also ensure the inner content is visible
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }
    } else {
        console.error('Review modal not found');
        console.error('Review modal not found');
        showToast('Error: Review Modal element missing', 'error');
    }
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
}

function selectStar(rating) {
    document.getElementById('review-rating').value = rating;
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.replace('far', 'fas');
            star.classList.add('active');
        } else {
            star.classList.replace('fas', 'far');
            star.classList.remove('active');
        }
    });
}

function submitReview(event) {
    event.preventDefault();
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    if (!rating) {
        showToast('Please select a star rating!', 'error');
        return;
    }

    // Mock Review Addition
    const reviewGrid = document.querySelector('.rating-grid'); // Adds to the main grid
    const user = JSON.parse(localStorage.getItem('kulturaUser')) || { username: 'Guest' };

    // Generate Stars HTML
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        starsHtml += i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }

    // Create New Card
    const newCard = document.createElement('div');
    newCard.className = 'rating-card';
    newCard.innerHTML = `
        <div class="stars">${starsHtml}</div>
        <p class="review-text">"${comment}"</p>
        <div class="reviewer-info">
             <div class="reviewer-img" style="background-color:#333; display:flex; justify-content:center; align-items:center; color:white; font-weight:bold;">${user.username.charAt(0).toUpperCase()}</div>
             <div class="reviewer-text">
                 <h4>${user.username}</h4>
                 <span>Verified Reviewer</span>
             </div>
        </div>
    `;

    // Insert after the header, or prepend to grid
    // Add to Extra Reviews container (at the bottom)
    const extraReviewsEnv = document.getElementById('extra-reviews');
    extraReviewsEnv.appendChild(newCard); // Append to bottom

    // Ensure the section is visible
    if (extraReviewsEnv.style.display === 'none') {
        toggleAllReviews(); // Expand if hidden
    }

    // Scroll to new review
    setTimeout(() => {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newCard.style.animation = 'fadeInUp 0.6s ease forwards';
    }, 100);

    closeReviewModal();
    document.getElementById('review-form').reset();
    showToast('Review submitted successfully!');
}

function toggleAllReviews() {
    const extraReviews = document.getElementById('extra-reviews');
    const icon = document.getElementById('icon-view-all');

    if (extraReviews.style.display === 'none') {
        extraReviews.style.display = 'grid';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');

        // Add animation class to children
        const cards = extraReviews.querySelectorAll('.rating-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0'; // Start hidden
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('fade-in-up');
        });

    } else {
        extraReviews.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value;
    const btn = document.querySelector('.newsletter-form button');

    if (email) {
        // Change button to loading state
        const originalBtnText = btn.innerText;
        btn.innerText = "Sending...";
        btn.disabled = true;

        const templateParams = {
            to_email: email,
            from_name: "Kultura Store",
            message: "Thank you for subscribing to our newsletter! Stay tuned for updates."
        };

        // Send Email via EmailJS
        // REPLACE 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values from EmailJS Dashboard
        emailjs.send('service_2bb3t32', 'template_mz4khdj', templateParams)
            .then(() => {
                const lang = localStorage.getItem('kulturaLang') || 'en';
                const msg = lang === 'id' ? `Email sukses dikirim ke ${email}` : `Success! Email sent to ${email}`;

                showToast(msg);
                emailInput.value = ''; // Clear input
            })
            .catch((error) => {
                console.error('FAILED...', error);
                showToast("Failed to send email. Check API Keys.", 'error');
            })
            .finally(() => {
                // Reset button
                btn.innerText = originalBtnText;
                btn.disabled = false;
            });
    }
}


