
(function(){
  "use strict";

 
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

  
  document.addEventListener("click", (e)=>{
    const isOpen = sidebar?.classList.contains("is-open");
    if(!isOpen) return;
    if(sidebar.contains(e.target) || e.target.closest("#openSidebar")) return;
    closeSidebar();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeSidebar();
  });


  sidebar?.querySelectorAll(".sidebar__item:not(.sidebar__item--menu)").forEach(item=>{
    item.addEventListener("click", closeSidebar);
  });


  const topbar = document.getElementById("topbar");
  function updateTopbarOnScroll(){
    if(!topbar) return;
    topbar.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateTopbarOnScroll, { passive:true });
  updateTopbarOnScroll();

  /* ===================== 2. POPUP MENU ===================== */
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

  /* ===================== 3. KARTU SWOT  ===================== */
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


const timelineItems = document.querySelectorAll(".timeline__item");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

timelineItems.forEach((item) => revealObserver.observe(item));



const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const photoButtons = document.querySelectorAll(".timeline__photo");

function openLightbox(fullSrc, altText) {
  lightboxImg.src = fullSrc;
  lightboxImg.alt = altText || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  lightboxImg.src = "";
}

photoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const fullSrc = button.dataset.full;
    const altText = button.querySelector("img")?.alt || "";
    openLightbox(fullSrc, altText);
  });
});

// tombol X
lightboxClose.addEventListener("click", closeLightbox);


lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// tombol ESC buat nutup
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});
