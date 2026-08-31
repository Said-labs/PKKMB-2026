

(function () {
  "use strict";

  /* ---------------- KONSTANTA BAHASA ---------------- */
  const DOW_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const DOW_MINI  = ["M", "S", "S", "R", "K", "J", "S"];
  const DOW_LONG  = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const MONTH_LONG = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  /* ---------------- DATA AGENDA (edit di sini) ---------------- */
  /* title  : judul singkat
     time   : "HH:MM" (24 jam)
     desc   : deskripsi detail                                    */
  const EVENTS = {
    "2026-08-03": [
      { time: "09:00", title: "Rapat perencanaan tim", desc: "Susun target sprint bulan Agustus bersama divisi produk." }
    ],
    "2026-08-05": [
      { time: "13:30", title: "Panggilan klien — PT Nusantara", desc: "Presentasi progres proyek fase kedua dan Q&A." }
    ],
    "2026-08-10": [
      { time: "08:00", title: "Olahraga pagi", desc: "Lari santai 5K di taman kota." },
      { time: "19:00", title: "Kelas bahasa Jepang", desc: "Materi: kata kerja bentuk lampau." }
    ],
    "2026-08-14": [
      { time: "10:00", title: "Servis motor", desc: "Ganti oli dan cek rem di bengkel langganan." }
    ],
    "2026-08-17": [
      { time: "07:30", title: "Upacara Kemerdekaan RI", desc: "Upacara bendera bersama warga kompleks." },
      { time: "16:00", title: "Nonton lomba 17-an", desc: "Lomba panjat pinang di lapangan RW." }
    ],
    "2026-08-21": [
      { time: "14:00", title: "Review desain aplikasi", desc: "Tinjau ulang mockup halaman utama dengan tim desain." }
    ],
    "2026-08-24": [
      { time: "09:30", title: "Medical check-up tahunan", desc: "Pemeriksaan rutin di klinik keluarga." }
    ],
    "2026-08-27": [
      { time: "18:30", title: "Makan malam keluarga", desc: "Kumpul keluarga besar di rumah nenek." }
    ],
    "2026-08-29": [
      { time: "11:00", title: "Belanja bulanan", desc: "Stok kebutuhan dapur untuk dua minggu ke depan." }
    ],
    "2026-08-31": [
      { time: "09:00", title: "Standup mingguan", desc: "Sinkronisasi progres kerja seluruh anggota tim." },
      { time: "15:00", title: "Deadline laporan bulanan", desc: "Kirim laporan keuangan Agustus ke atasan." },
      { time: "20:00", title: "Nonton film bersama", desc: "Malam santai menonton film di rumah." }
    ],
    "2026-09-02": [
      { time: "10:00", title: "Rapat evaluasi bulanan", desc: "Bahas capaian dan kendala bulan lalu." }
    ],
    "2026-09-09": [
      { time: "09:00", title: "Workshop desain UI", desc: "Pelatihan internal seputar sistem desain terbaru." }
    ],
    "2026-09-15": [
      { time: "12:00", title: "Makan siang alumni", desc: "Reuni kecil bersama teman kuliah." }
    ],
    "2026-09-24": [
      { time: "08:00", title: "Donor darah", desc: "Kegiatan donor darah rutin di kantor." }
    ],
    "2026-10-05": [
      { time: "09:00", title: "Kick-off proyek baru", desc: "Pembukaan proyek kuartal keempat." }
    ],
    "2026-10-20": [
      { time: "19:00", title: "Webinar keuangan pribadi", desc: "Materi tentang perencanaan dana darurat." }
    ],
    "2026-11-11": [
      { time: "10:00", title: "Audit internal", desc: "Pemeriksaan dokumen dan proses kerja tim." }
    ],
    "2026-11-25": [
      { time: "18:00", title: "Perayaan ulang tahun kantor", desc: "Syukuran ulang tahun perusahaan ke-12." }
    ],
    "2026-12-24": [
      { time: "20:00", title: "Malam Natal bersama keluarga", desc: "Ibadah malam dan makan malam bersama." }
    ],
    "2026-12-31": [
      { time: "21:00", title: "Tahun baru bersama teman", desc: "Kumpul dan bakar jagung di rumah Rani." }
    ],
    "2027-01-01": [
      { time: "00:00", title: "Tahun Baru", desc: "Libur nasional — awal tahun 2027." }
    ]
  };

  /* ---------------- STATE ---------------- */
  const state = {
    current: new Date(),  
    selected: null,        
    view: "month"          
  };
  const today = stripTime(new Date());

  /* ---------------- HELPERS ---------------- */
  function pad2(n) { return String(n).padStart(2, "0"); }

  function stripTime(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function dateKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function eventsFor(d) {
    return EVENTS[dateKey(d)] || [];
  }

  function startOfWeek(d) {
    const nd = stripTime(d);
    nd.setDate(nd.getDate() - nd.getDay());
    return nd;
  }

  function addDays(d, n) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + n);
    return nd;
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  /* ---------------- ELEMENTS ---------------- */
  const el = {
    periodTitle: document.getElementById("periodTitle"),
    btnPrev: document.getElementById("btnPrev"),
    btnNext: document.getElementById("btnNext"),
    btnToday: document.getElementById("btnToday"),
    viewSwitch: document.getElementById("viewSwitch"),

    viewYear: document.getElementById("viewYear"),
    viewMonth: document.getElementById("viewMonth"),
    viewWeek: document.getElementById("viewWeek"),
    viewDay: document.getElementById("viewDay"),

    yearGrid: document.getElementById("yearGrid"),
    monthWeekdayRow: document.getElementById("monthWeekdayRow"),
    monthGrid: document.getElementById("monthGrid"),
    weekGrid: document.getElementById("weekGrid"),
    dayTimeline: document.getElementById("dayTimeline"),

    agenda: document.getElementById("agenda"),
    agendaScrim: document.getElementById("agendaScrim"),
    agendaSheet: document.getElementById("agendaSheet"),
    agendaClose: document.getElementById("agendaClose"),
    agendaWeekday: document.getElementById("agendaWeekday"),
    agendaDate: document.getElementById("agendaDate"),
    agendaList: document.getElementById("agendaList")
  };

  /* ---------------- RENDER: TOPBAR ---------------- */
  function renderTopbar() {
    const d = state.current;
    let label = "";
    if (state.view === "year") {
      label = String(d.getFullYear());
    } else if (state.view === "month") {
      label = `${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`;
    } else if (state.view === "week") {
      const start = startOfWeek(d);
      const end = addDays(start, 6);
      if (start.getMonth() === end.getMonth()) {
        label = `${start.getDate()}–${end.getDate()} ${MONTH_LONG[start.getMonth()]} ${start.getFullYear()}`;
      } else {
        label = `${start.getDate()} ${MONTH_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`;
      }
    } else if (state.view === "day") {
      label = `${DOW_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`;
    }
    el.periodTitle.textContent = label;
  }

  /* ---------------- RENDER: YEAR VIEW ---------------- */
  function renderYear() {
    const year = state.current.getFullYear();
    el.yearGrid.innerHTML = "";

    for (let m = 0; m < 12; m++) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "minimonth";
      card.setAttribute("aria-label", `Buka ${MONTH_LONG[m]} ${year}`);

      const title = document.createElement("p");
      title.className = "minimonth__title";
      title.textContent = MONTH_LONG[m];
      card.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "minimonth__grid";

      DOW_MINI.forEach(l => {
        const dow = document.createElement("span");
        dow.className = "minimonth__dow";
        dow.textContent = l;
        grid.appendChild(dow);
      });

      const firstDow = new Date(year, m, 1).getDay();
      const total = daysInMonth(year, m);

      for (let i = 0; i < firstDow; i++) {
        const blank = document.createElement("span");
        blank.className = "minimonth__day is-muted";
        blank.textContent = "0";
        grid.appendChild(blank);
      }

      for (let day = 1; day <= total; day++) {
        const cellDate = new Date(year, m, day);
        const span = document.createElement("span");
        span.className = "minimonth__day";
        if (isSameDay(cellDate, today)) span.classList.add("is-today");
        if (eventsFor(cellDate).length) span.classList.add("has-event");
        span.textContent = String(day);
        grid.appendChild(span);
      }

      card.appendChild(grid);
      card.addEventListener("click", () => {
        state.current = new Date(year, m, 1);
        state.view = "month";
        syncViewButtons();
        render();
      });

      el.yearGrid.appendChild(card);
    }
  }

  /* ---------------- RENDER: MONTH VIEW ---------------- */
  function renderMonth() {
    el.monthWeekdayRow.innerHTML = "";
    DOW_SHORT.forEach(l => {
      const s = document.createElement("span");
      s.textContent = l;
      el.monthWeekdayRow.appendChild(s);
    });

    const year = state.current.getFullYear();
    const month = state.current.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(year, month);
    const prevTotal = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);
    const prevYear = month - 1 < 0 ? year - 1 : year;
    const prevMonth = month - 1 < 0 ? 11 : month - 1;
    const nextYear = month + 1 > 11 ? year + 1 : year;
    const nextMonth = month + 1 > 11 ? 0 : month + 1;

    el.monthGrid.innerHTML = "";

    const cells = [];
    for (let i = firstDow - 1; i >= 0; i--) {
      cells.push({ date: new Date(prevYear, prevMonth, prevTotal - i), muted: true });
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ date: new Date(year, month, d), muted: false });
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const nextIdx = cells.length - (firstDow + totalDays) + 1;
      cells.push({ date: new Date(nextYear, nextMonth, nextIdx), muted: true });
      if (cells.length >= 42) break;
    }

    cells.forEach(cell => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "daycell";
      if (cell.muted) btn.classList.add("is-muted");
      if (isSameDay(cell.date, today)) btn.classList.add("is-today");
      if (state.selected && isSameDay(cell.date, state.selected)) btn.classList.add("is-selected");

      const num = document.createElement("span");
      num.className = "daynum";
      num.textContent = String(cell.date.getDate());
      btn.appendChild(num);

      const evs = eventsFor(cell.date);
      if (evs.length) {
        const wrap = document.createElement("span");
        wrap.className = "dayevents";
        evs.slice(0, 2).forEach(ev => {
          const chip = document.createElement("span");
          chip.className = "eventchip";
          chip.textContent = `${ev.time} ${ev.title}`;
          wrap.appendChild(chip);
        });
        if (evs.length > 2) {
          const more = document.createElement("span");
          more.className = "eventmore";
          more.textContent = `+${evs.length - 2} lainnya`;
          wrap.appendChild(more);
        }
        btn.appendChild(wrap);
      }

      btn.setAttribute("aria-label", `${cell.date.getDate()} ${MONTH_LONG[cell.date.getMonth()]} ${cell.date.getFullYear()}, ${evs.length} agenda`);
      btn.addEventListener("click", () => openAgenda(cell.date));
      el.monthGrid.appendChild(btn);
    });
  }

  /* ---------------- RENDER: WEEK VIEW ---------------- */
  function renderWeek() {
    el.weekGrid.innerHTML = "";
    const start = startOfWeek(state.current);

    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      const col = document.createElement("button");
      col.type = "button";
      col.className = "weekcol";
      if (isSameDay(d, today)) col.classList.add("is-today");
      if (state.selected && isSameDay(d, state.selected)) col.classList.add("is-selected");

      const head = document.createElement("div");
      head.className = "weekcol__head";
      const dow = document.createElement("span");
      dow.className = "weekcol__dow";
      dow.textContent = DOW_SHORT[d.getDay()];
      const num = document.createElement("span");
      num.className = "weekcol__num";
      num.textContent = String(d.getDate());
      head.appendChild(dow);
      head.appendChild(num);
      col.appendChild(head);

      const evs = eventsFor(d);
      const evWrap = document.createElement("div");
      evWrap.className = "weekcol__events";
      if (!evs.length) {
        const empty = document.createElement("span");
        empty.className = "weekcol__empty";
        empty.textContent = "Tidak ada agenda";
        evWrap.appendChild(empty);
      } else {
        evs.forEach(ev => {
          const chip = document.createElement("span");
          chip.className = "eventchip";
          chip.textContent = `${ev.time} ${ev.title}`;
          evWrap.appendChild(chip);
        });
      }
      col.appendChild(evWrap);

      col.addEventListener("click", () => openAgenda(d));
      el.weekGrid.appendChild(col);
    }
  }

  /* ---------------- RENDER: DAY VIEW ---------------- */
  function renderDay() {
    const d = state.current;
    el.dayTimeline.innerHTML = "";

    const header = document.createElement("div");
    header.className = "dayheader";
    const dow = document.createElement("p");
    dow.className = "dayheader__dow";
    dow.textContent = DOW_LONG[d.getDay()];
    const dateP = document.createElement("p");
    dateP.className = "dayheader__date";
    dateP.textContent = `${d.getDate()} ${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`;
    header.appendChild(dow);
    header.appendChild(dateP);
    el.dayTimeline.appendChild(header);

    const evs = eventsFor(d).slice().sort((a, b) => a.time.localeCompare(b.time));
    const byHour = {};
    evs.forEach(ev => {
      const h = parseInt(ev.time.split(":")[0], 10);
      (byHour[h] = byHour[h] || []).push(ev);
    });

    for (let h = 0; h < 24; h++) {
      const row = document.createElement("div");
      row.className = "hourrow";

      const label = document.createElement("div");
      label.className = "hourrow__label";
      label.textContent = `${pad2(h)}:00`;
      row.appendChild(label);

      const slot = document.createElement("div");
      slot.className = "hourrow__slot";
      (byHour[h] || []).forEach(ev => {
        const box = document.createElement("div");
        box.className = "hourevent";
        const t = document.createElement("p");
        t.className = "hourevent__time";
        t.textContent = ev.time;
        const ti = document.createElement("p");
        ti.className = "hourevent__title";
        ti.textContent = ev.title;
        const de = document.createElement("p");
        de.className = "hourevent__desc";
        de.textContent = ev.desc;
        box.appendChild(t);
        box.appendChild(ti);
        box.appendChild(de);
        slot.appendChild(box);
      });
      row.appendChild(slot);
      el.dayTimeline.appendChild(row);
    }
  }

  /* ---------------- AGENDA PANEL ---------------- */
  function openAgenda(date) {
    state.selected = date;
    el.agendaWeekday.textContent = DOW_LONG[date.getDay()];
    el.agendaDate.textContent = `${date.getDate()} ${MONTH_LONG[date.getMonth()]} ${date.getFullYear()}`;

    el.agendaList.innerHTML = "";
    const evs = eventsFor(date).slice().sort((a, b) => a.time.localeCompare(b.time));

    if (!evs.length) {
      const empty = document.createElement("p");
      empty.className = "agenda__empty";
      empty.textContent = "Belum ada agenda untuk tanggal ini.";
      el.agendaList.appendChild(empty);
    } else {
      evs.forEach(ev => {
        const item = document.createElement("div");
        item.className = "agendaitem";
        const t = document.createElement("p");
        t.className = "agendaitem__time";
        t.textContent = ev.time;
        const ti = document.createElement("p");
        ti.className = "agendaitem__title";
        ti.textContent = ev.title;
        const de = document.createElement("p");
        de.className = "agendaitem__desc";
        de.textContent = ev.desc;
        item.appendChild(t);
        item.appendChild(ti);
        item.appendChild(de);
        el.agendaList.appendChild(item);
      });
    }

    el.agenda.classList.add("is-open");
    // refresh highlight in whichever grid view is active
    if (state.view === "month") renderMonth();
    if (state.view === "week") renderWeek();
  }

  function closeAgenda() {
    el.agenda.classList.remove("is-open");
  }

  /* ---------------- VIEW DISPATCH ---------------- */
  function render() {
    [el.viewYear, el.viewMonth, el.viewWeek, el.viewDay].forEach(v => v.hidden = true);
    renderTopbar();

    if (state.view === "year") {
      el.viewYear.hidden = false;
      renderYear();
    } else if (state.view === "month") {
      el.viewMonth.hidden = false;
      renderMonth();
    } else if (state.view === "week") {
      el.viewWeek.hidden = false;
      renderWeek();
    } else if (state.view === "day") {
      el.viewDay.hidden = false;
      renderDay();
    }
  }

  function syncViewButtons() {
    el.viewSwitch.querySelectorAll(".viewbtn").forEach(btn => {
      const active = btn.dataset.view === state.view;
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  /* ---------------- NAVIGASI PREV / NEXT / TODAY ---------------- */
  function step(dir) {
    const d = new Date(state.current);
    if (state.view === "year") d.setFullYear(d.getFullYear() + dir);
    else if (state.view === "month") d.setMonth(d.getMonth() + dir);
    else if (state.view === "week") d.setDate(d.getDate() + dir * 7);
    else if (state.view === "day") d.setDate(d.getDate() + dir);
    state.current = d;
    render();
  }

  el.btnPrev.addEventListener("click", () => step(-1));
  el.btnNext.addEventListener("click", () => step(1));
  el.btnToday.addEventListener("click", () => {
    state.current = new Date();
    render();
  });

  el.viewSwitch.addEventListener("click", (e) => {
    const btn = e.target.closest(".viewbtn");
    if (!btn) return;
    state.view = btn.dataset.view;
    syncViewButtons();
    render();
  });

  el.agendaClose.addEventListener("click", closeAgenda);
  el.agendaScrim.addEventListener("click", closeAgenda);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAgenda();
  });

  /* ---------------- INIT ---------------- */
  syncViewButtons();
  render();

})();
