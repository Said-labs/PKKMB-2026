/* =========================================================
   TELUTIZEN STARTER BOOK — SCRIPT
   Dibagi per-bagian, cari komentar besar "===== NAMA BAGIAN ====="
   untuk lompat ke bagian yang mau diedit.

   Catatan: semua konten (teks & foto) sudah statis di index.html,
   jadi tidak ada lagi logika upload foto atau autosave teks di sini.
   Yang tersisa cuma interaksi tampilan: sidebar, popup menu, dan
   kartu SWOT yang bisa dibalik.

   Daftar isi:
   1. Sidebar (buka/tutup, sama di semua ukuran layar)
   2. Popup menu (titik tiga)
   3. Kartu SWOT (flip card)
========================================================= */
(function(){
  "use strict";

  /* ===================== 1. SIDEBAR (BUKA/TUTUP) =====================
     Satu sumber kebenaran: class "is-open" pada #sidebar & "sidebar-open"
     pada <body>. Perilakunya identik di semua ukuran layar (desktop,
     tablet, mobile): sidebar digeser masuk dari kiri, dan konten
     (.book) ikut didorong ke kanan lewat CSS — jadi sidebar TIDAK
     pernah menutupi/menumpuk halaman. */
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("openSidebar");
  const closeBtn = document.getElementById("closeSidebar");

  function openSidebar(){
    sidebar?.classList.add("is-open");
    document.body.classList.add("sidebar-open");
    openBtn?.setAttribute("aria-expanded", "true");
  }
  function closeSidebar(){
    sidebar?.classList.remove("is-open");
    document.body.classList.remove("sidebar-open");
    openBtn?.setAttribute("aria-expanded", "false");
  }
  function toggleSidebar(){
    sidebar?.classList.contains("is-open") ? closeSidebar() : openSidebar();
  }

  openBtn?.addEventListener("click", toggleSidebar);
  closeBtn?.addEventListener("click", closeSidebar);

  // klik di luar sidebar (misalnya di area konten yang terdorong)
  // saat sidebar terbuka akan menutupnya kembali.
  document.addEventListener("click", (e)=>{
    const isOpen = sidebar?.classList.contains("is-open");
    if(!isOpen) return;
    if(sidebar.contains(e.target) || e.target.closest("#openSidebar")) return;
    closeSidebar();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeSidebar();
  });

  // menutup sidebar otomatis saat salah satu menunya diklik
  sidebar?.querySelectorAll(".sidebar__item:not(.sidebar__item--menu)").forEach(item=>{
    item.addEventListener("click", closeSidebar);
  });

  // tulisan judul di topbar disembunyikan begitu halaman discroll,
  // dan muncul lagi saat kembali ke paling atas. Berlaku sama di
  // semua ukuran layar.
  const topbar = document.getElementById("topbar");
  function updateTopbarOnScroll(){
    if(!topbar) return;
    topbar.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateTopbarOnScroll, { passive:true });
  updateTopbarOnScroll();

  /* ===================== 2. POPUP MENU (TITIK TIGA) ===================== */
  const menuPopup = document.getElementById("menuPopup");
  document.getElementById("menuToggle")?.addEventListener("click", (e)=>{
    e.stopPropagation();
    menuPopup?.classList.toggle("open");
  });
  document.addEventListener("click", (e)=>{
    if(menuPopup && !menuPopup.contains(e.target) && e.target.id !== "menuToggle"){
      menuPopup.classList.remove("open");
    }
  });

  /* ===================== 3. KARTU SWOT (FLIP) ===================== */
  document.querySelectorAll(".flipcard").forEach(card=>{
    card.addEventListener("click", ()=> card.classList.toggle("flipped"));
  });
})();

const downloadPortfolio = document.getElementById("downloadPortfolio");

downloadPortfolio.addEventListener("click", function () {
    const text = this.querySelector("span:last-child");
    const icon = this.querySelector(".download-icon");

    text.textContent = "Mengunduh...";
    icon.textContent = "↓";

    setTimeout(() => {
        text.textContent = "Download Portofolio";
        icon.textContent = "↓";
    }, 2000);
});