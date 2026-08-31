const CONFIG = {
  title: "Recap Kegiatan",
  subtitle: "Daily documentation, from the PRA PKKMB until PKKMB is completed, in the form of videos or photos.",

  stats: {
    sesi: null,         // null = dihitung otomatis dari jumlah tanggal unik
       // null = dihitung otomatis dari field "time" tiap item, format "HH:MM"
  }
};



const ITEMS = [
  {
    id: "m1",
    type: "image",
    date: "2026-08-25",
    time: "15:45",
    driveLink: "https://drive.google.com/file/d/11CR2Ys3S2ob17sS8N_1qHoUeABUwRaui/view?usp=sharing",
    title: "FOTO REG 13",
    description: "Sesi foto setelah pengambilan almameter, bersama reg 13 di tult",
    tags: ["reg 13", "after almameter", "2026"],
    location: { lat:  -6.9689492, lng: 107.6281106, name: "BOJONGSOANG, BANDUNG, Jawa Barat" },
    audio: null
  },
  {
    id: "m2",
    type: "image",
    date: "2026-08-26",
    time: "16:30",
    driveLink: "https://drive.google.com/file/d/1MKOuy5YyUifc_CeCBxNxY8ywjVFAc_Gk/view?usp=sharing",
    title: "FIRST MEET 2026",
    description: "SEBUAH ACARA PERKUMPULAN MAHASISWA PRODI INFORMATIKA DENGAN JUMLAH ORANG YANG DATANG DI BAWAH 300 DARI 500 ORANG, ACARA INI UNTUK SALING KENAL ANTAR MAHASISWA",
    tags: ["first meet", "2026","INFORMATICS"],
    location: { lat: -6.97321, lng: 107.63014, name: "BENTO TELKOM UNIVERSITY" },
    audio: null
  },
  {
    id: "m3",
    type: "video",
    date: "2026-08-26",
    time: "16:50",
    driveLink: "https://drive.google.com/uc?id=1ZuxLmE0e06GVUxLnpgYWxCMJrjDtP4hD",
    title: "FIRST MEET 2026",
    description: "Rekaman singkat SETELAH SESI FOTO SAAT FIRSTMEET 2026 PRODI INFORMATIKA",
    tags: ["first meet", "2026","INFORMATICS"],
    location: { lat: -6.97321, lng: 107.63014, name: "BENTO TELKOM UNIVERSITY" },
    audio: null
  },

   {
    id: "m4",
    type: "video",
    date: "2026-08-25",
    time: "15:45",
    driveLink: "https://drive.google.com/uc?id=1T9Bz1H6Ekz9WKC-gEsQA713PHcZlL4S7",
    title: "VIDEO ANGKATAN IF 2026",
    description: "Rekaman singkat SETELAH SESI FOTO DI TULT SETELAH PENGAMBILAN ALMAMETER, BERSAMA  IF PRODI IF 2026 DENGAN JUMLAH YANG IKUT UNDER 300 AN",
    tags: ["ANGKATAN IF", "2026","INFORMATICS"],
    location: { lat:  -6.9689492, lng: 107.6281106, name: "BOJONGSOANG, BANDUNG, Jawa Barat" },
    audio: null
  },
 {
    id: "m5",
    type: "image",
    date: "2026-08-25",
    time: "15:45",
    driveLink: "https://drive.google.com/file/d/1Z0K-DhO10XikIOE4mVsp67RebloZ2OPU/view?usp=sharing",
    title: "FOTO ANGKATAN IF 2026",
    description: "Sesi foto setelah pengambilan almameter, bersama ANAGAKAATN PRODI IF 2026 di tult",
    tags: ["ANGKATAN IF", "2026","INFORMATICS"],
    location: { lat:  -6.9689492, lng: 107.6281106, name: "BOJONGSOANG, BANDUNG, Jawa Barat" },
    audio: null
  },


    {
    id: "m6",
    type: "image",
    date: "2026-08-28",
    time: "17:00",
    driveLink: "https://drive.google.com/file/d/1BRS_JGvN3TnLBu0bbiywpmAARLIkdRQ_/view?usp=sharing",
    title: "Kelompok Selaru 2008",
    description: "Pembuatan tugas kelompok berupa papan kelompok unutk pkkmb 2026 dengan nama kelompok selaru 2008 dengan jumlah angoota 55 orang. yang di pimpin oleh LO yang bernama  @aiscitraazali jurusan teknologi informasi  tahun masuk 2025 dan ada @khansasyahdaadia jurusan administrasi bisnis tahun 2024 ",
    tags: ["Selaru 2008", "Pkkmb 2026"],
    location: { lat: -6.97328, lng: 107.63034, name: "JOGLO Tel-U" },
    audio: null,
  },

     {
    id: "m7",
    type: "image",
    date: "2026-08-30",
    time: "14:50",
    driveLink: "https://drive.google.com/file/d/1P2OnYMwc-7vEyKoVP4kwAmbLS6i7PGxD/view?usp=sharing",
    title: "Kelas 13 INFORMATIKA",
    description: " Pertemuan kelas 13 di danau galau untuk membahsa helo world prodi informatika ynag akan di laksanakan tnggal 10-11 september 2026 ",
    tags: ["Kelas 13", "Pkkmb 2026", "informatika"],
    location: { lat: -6.97321, lng: 107.63014 , name: "Danau Galau TEL- U" },
    audio: null,
  },
    {

  id: "m8",
    type: "video",
    date: "2026-08-28",
    time: "16:50",
    driveLink: "https://drive.google.com/uc?id=1Hjnxh8aB8gp-VHDxD0LzOs1vknTshz0R",
    title: "Kelompok selaru 2008",
    description: "Rekaman singkat setelah pembuatan papaan kelompok untuk PKKMB 2026 ",
    tags: ["Selaru 2008", "PKKMB 2026"],
    location: { lat: -6.97328, lng: 107.63034, name: "BENTO TELKOM UNIVERSITY" },
    audio: null

  },

];

/* =====================================================================
   3) GOOGLE DRIVE → EMBED HELPERS
   ===================================================================== */

function extractDriveId(link) {
  if (!link) return null;
  const patterns = [/\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];
  for (const re of patterns) {
    const m = link.match(re);
    if (m) return m[1];
  }
  return null;
}

function driveThumbUrl(id, size = "w800") {
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}
function driveFullImageUrl(id) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
}
function drivePreviewUrl(id) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

/* =====================================================================
   4) UTIL TANGGAL 
   ===================================================================== */

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function formatTanggal(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/* =====================================================================
   5) BANGUN STRUKTUR HALAMAN 
   ===================================================================== */

function groupByDate(items) {
  const map = new Map();
  items.forEach(it => {
    if (!map.has(it.date)) map.set(it.date, []);
    map.get(it.date).push(it);
  });
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, list]) => ({ date, items: list }));
}

const PAGES = groupByDate(ITEMS);
let currentPage = 0;
let flatIndex = -1; 


const FLAT_ITEMS = PAGES.flatMap(p => p.items);

/* =====================================================================
   6) RENDER HEADER
   ===================================================================== */

function renderStats() {
  document.getElementById("recapTitle").textContent = CONFIG.title;
  document.getElementById("recapSubtitle").textContent = CONFIG.subtitle;

  const sesi = CONFIG.stats.sesi ?? PAGES.length;
  const jumlahFoto = ITEMS.filter(i => i.type === "image").length;
  const jumlahVideo = ITEMS.filter(i => i.type === "video").length;

  const cards = [
    { num: sesi, label: "Sesi" },
    { num: jumlahFoto, label: "Foto" },
    { num: jumlahVideo, label: "Video" },
  ];

  document.getElementById("statRail").innerHTML = cards.map(c => `
    <div class="stat-card">
      <span class="stat-num">${c.num}</span>
      <span class="stat-label">${c.label}</span>
    </div>
  `).join("");
}

/* =====================================================================
   7) RENDER FLIPBOOK
   ===================================================================== */

function thumbHTML(item) {
  const id = extractDriveId(item.driveLink);
  if (item.type === "video") {
    return `<img src="${id ? driveThumbUrl(id) : ''}" alt="${item.title}" loading="lazy"><span class="vid-badge">▶ video</span>`;
  }
  return `<img src="${id ? driveThumbUrl(id) : ''}" alt="${item.title}" loading="lazy">`;
}

function renderPages() {
  const pagesEl = document.getElementById("pages");
  pagesEl.innerHTML = PAGES.map((page, pIdx) => `
    <section class="page" data-index="${pIdx}">
      <h2 class="page-date">${formatTanggal(page.date)} <span class="stamp">${page.items.length} media</span></h2>
      <div class="page-grid">
        ${page.items.map(item => `
          <div class="thumb" data-id="${item.id}" role="button" tabindex="0" aria-label="Buka ${item.title}">
            ${thumbHTML(item)}
            <span class="thumb-title">${item.title}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `).join("");

  document.getElementById("dateTabs").innerHTML = PAGES.map((page, i) => `
    <button class="date-tab" data-index="${i}">${formatTanggal(page.date).split(", ")[1] || page.date}</button>
  `).join("");

  pagesEl.querySelectorAll(".thumb").forEach(el => {
    el.addEventListener("click", () => openLightboxById(el.dataset.id));
    el.addEventListener("keydown", e => { if (e.key === "Enter") openLightboxById(el.dataset.id); });
  });

  document.getElementById("dateTabs").querySelectorAll(".date-tab").forEach(btn => {
    btn.addEventListener("click", () => goToPage(parseInt(btn.dataset.index, 10)));
  });

  updateBookView();
}

function updateBookView() {
  const pageEls = document.querySelectorAll(".page");
  pageEls.forEach((el, i) => {
    el.classList.remove("is-active", "is-prevstack", "is-nextstack");
    if (i === currentPage) el.classList.add("is-active");
    else if (i < currentPage) el.classList.add("is-prevstack");
    else el.classList.add("is-nextstack");
  });

  document.querySelectorAll(".date-tab").forEach((btn, i) => {
    btn.classList.toggle("active", i === currentPage);
  });

  document.getElementById("btnPrev").disabled = currentPage === 0;
  document.getElementById("btnNext").disabled = currentPage === PAGES.length - 1;
  document.getElementById("pageIndicator").textContent = `Halaman ${currentPage + 1} dari ${PAGES.length}`;
}

function goToPage(i) {
  currentPage = Math.max(0, Math.min(PAGES.length - 1, i));
  updateBookView();
}

document.getElementById("btnPrev").addEventListener("click", () => goToPage(currentPage - 1));
document.getElementById("btnNext").addEventListener("click", () => goToPage(currentPage + 1));
document.addEventListener("keydown", e => {
  if (lightboxOpen()) return;
  if (e.key === "ArrowLeft") goToPage(currentPage - 1);
  if (e.key === "ArrowRight") goToPage(currentPage + 1);
});

/* =====================================================================
   8) LIGHTBOX
   ===================================================================== */

const lb = document.getElementById("lightbox");
const lbFrame = document.getElementById("lbFrame");
const zoomRange = document.getElementById("zoomRange");
const brightRange = document.getElementById("brightRange");

function lightboxOpen() { return lb.classList.contains("open"); }

function openLightboxById(id) {
  const idx = FLAT_ITEMS.findIndex(i => i.id === id);
  if (idx === -1) return;
  flatIndex = idx;
  renderLightboxItem();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  const audio = document.getElementById("lbAudio");
  audio.pause();
}

function renderLightboxItem() {
  const item = FLAT_ITEMS[flatIndex];
  const driveId = extractDriveId(item.driveLink);

  // media utama
  zoomRange.value = 1;
  brightRange.value = 100;
  if (item.type === "video") {
    lbFrame.innerHTML = `<iframe src="${driveId ? drivePreviewUrl(driveId) : ''}" allow="autoplay" allowfullscreen></iframe>`;
  } else {
    lbFrame.innerHTML = `<img src="${driveId ? driveFullImageUrl(driveId) : ''}" alt="${item.title}" id="lbMedia">`;
  }
  applyFrameStyle();

  // teks
  document.getElementById("lbDate").textContent = formatTanggal(item.date) + (item.time ? ` · ${item.time}` : "");
  document.getElementById("lbTitle").textContent = item.title;
  document.getElementById("lbDesc").textContent = item.description || "";
  document.getElementById("lbTags").innerHTML = (item.tags || []).map(t => `<span class="tag-pill">#${t}</span>`).join("");

  // audio
  const audioBlock = document.getElementById("lbAudioBlock");
  const audioEl = document.getElementById("lbAudio");
  if (item.audio) {
    audioBlock.hidden = false;
    audioEl.src = item.audio;
  } else {
    audioBlock.hidden = true;
    audioEl.removeAttribute("src");
  }

  // peta
  const mapBlock = document.getElementById("lbMapBlock");
  const mapEl = document.getElementById("lbMap");
  if (item.location) {
    mapBlock.hidden = false;
    mapEl.src = `https://www.google.com/maps?q=${item.location.lat},${item.location.lng}&z=15&output=embed`;
  } else {
    mapBlock.hidden = true;
    mapEl.removeAttribute("src");
  }

  // share
  const shareUrl = `${location.origin}${location.pathname}#${item.id}`;
  const shareText = encodeURIComponent(`${item.title} — ${CONFIG.title}`);
  document.getElementById("shareWA").href = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
  document.getElementById("shareFB").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  document.getElementById("shareTW").href = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
  document.getElementById("shareTG").href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;
  document.getElementById("shareCopy").onclick = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      const note = document.getElementById("copyNote");
      note.textContent = "Tautan disalin!";
      setTimeout(() => note.textContent = "", 1800);
    });
  };

  history.replaceState(null, "", `#${item.id}`);
}

function applyFrameStyle() {
  const media = lbFrame.querySelector("img, iframe, video");
  if (!media) return;
  media.style.transform = `scale(${zoomRange.value})`;
  media.style.filter = `brightness(${brightRange.value}%)`;
}

zoomRange.addEventListener("input", applyFrameStyle);
brightRange.addEventListener("input", applyFrameStyle);
document.getElementById("lbReset").addEventListener("click", () => {
  zoomRange.value = 1; brightRange.value = 100; applyFrameStyle();
});

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => stepLightbox(-1));
document.getElementById("lbNext").addEventListener("click", () => stepLightbox(1));

function stepLightbox(dir) {
  flatIndex = (flatIndex + dir + FLAT_ITEMS.length) % FLAT_ITEMS.length;
  renderLightboxItem();
}

document.addEventListener("keydown", e => {
  if (!lightboxOpen()) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

// pan gambar saat di-zoom 
(function enablePan() {
  let dragging = false, startX = 0, startY = 0, curX = 0, curY = 0;
  lbFrame.addEventListener("pointerdown", e => {
    if (zoomRange.value <= 1) return;
    dragging = true; startX = e.clientX - curX; startY = e.clientY - curY;
  });
  window.addEventListener("pointermove", e => {
    if (!dragging) return;
    curX = e.clientX - startX; curY = e.clientY - startY;
    const media = lbFrame.querySelector("img, iframe, video");
    if (media) media.style.transform = `scale(${zoomRange.value}) translate(${curX / zoomRange.value}px, ${curY / zoomRange.value}px)`;
  });
  window.addEventListener("pointerup", () => dragging = false);
  zoomRange.addEventListener("input", () => { curX = 0; curY = 0; });
})();

/* =====================================================================
   9) INIT
   ===================================================================== */

renderStats();
renderPages();


if (location.hash) {
  const id = location.hash.slice(1);
  const pageIdx = PAGES.findIndex(p => p.items.some(i => i.id === id));
  if (pageIdx !== -1) { currentPage = pageIdx; updateBookView(); openLightboxById(id); }
}
