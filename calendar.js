
       "2026-09-02": [
      { time: "05:30 - 16:00", title: "OSPEK PKKMB TEL-U 2026", desc: "Kegiatan PKKMB 2026 TELKOM UNIVERISTY BATCYH 2 DI LAPANAGAN TELKOM" }
    ]
(function () {
  "use strict";

  /* ---------------- KONSTANTA BAHASA ---------------- */
  const DOW_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const DOW_MINI  = ["M", "S", "S", "R", "K", "J", "S"];
  const DOW_LONG  = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const MONTH_LONG = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  /* ---------------- DATA AGENDA ---------------- */
  /* title  : judul singkat
     time   : "HH:MM - HH:MM" (24 jam) — bisa juga cuma "HH:MM" 
     desc   : deskripsi detail                                    */
  const EVENTS = {

    "2026-08-25": [
      { time: "14:45 - 17:00", title: "Almamater", desc: "Pengambilan Almamater Telkom University MABA 2026" }
    ],
    "2026-08-26": [
      { time: "14:00 - 17:00", title: "First Meet Prodi", desc: "Pertemuan Mahasiswa Prodi Informatika 2026 di Bento Telkom University" }
    ],
    "2026-08-28": [
      { time: "15:00 - 17:30", title: "First Meet Kelompok", desc: "Pertemuan anggota kelompok Selaru 2008 di Joglo Telkom University untuk membuat papan kelompok" }
    ],
    "2026-08-30": [
      { time: "14:00 - 15:30", title: "First Meet Kelas 13", desc: "Pertemuan Kelas 13 di Dana Galau Telkom University untuk membahas Hello World 2026" },
    ],
         "2026-09-02": [
      { time: "05:30 - 16:00", title: "OSPEK PKKMB TEL-U 2026", desc: "Kegiatan PKKMB 2026 TELKOM UNIVERISTY BATCYH 2 DI LAPANAGAN TELKOM" }
    ]
  };


  const state = {
    current: new Date(),
    selected: null,
    view: "month"
  };
  const today = stripTime(new Date());


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

  function parseTimeRange(str) {
    const matches = String(str).match(/(\d{1,2}):(\d{2})/g) || [];
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (matches.length >= 2) {
      const start = toMinutes(matches[0]);
      let end = toMinutes(matches[1]);
      if (end <= start) end = start + 60; // jaga-jaga kalau data salah ketik
      return { start, end };
    }
    if (matches.length === 1) {
      const start = toMinutes(matches[0]);
      return { start, end: start + 60 };
    }
    return { start: 0, end: 60 };
  }

 
  function layoutDayEvents(evs) {
    const items = evs.map(ev => {
      const { start, end } = parseTimeRange(ev.time);
      return { ev, start, end, col: 0, totalCols: 1 };
    }).sort((a, b) => (a.start - b.start) || (a.end - b.end));

    const columns = []; 
    items.forEach(it => {
      let placed = -1;
      for (let c = 0; c < columns.length; c++) {
        const last = columns[c][columns[c].length - 1];
        if (it.start >= last.end) { placed = c; break; }
      }
      if (placed === -1) { placed = columns.length; columns.push([]); }
      columns[placed].push(it);
      it.col = placed;
    });

    items.forEach(it => {
      const overlapping = items.filter(o => o.start < it.end && o.end > it.start);
      it.totalCols = Math.max(...overlapping.map(o => o.col)) + 1;
    });

    return items;
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

    // header tanggal
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

    // grid: kolom label jam + jalur waktu
    const grid = document.createElement("div");
    grid.className = "timegrid";

    const labels = document.createElement("div");
    labels.className = "timegrid__labels";
    for (let h = 0; h < 24; h++) {
      const lab = document.createElement("div");
      lab.className = "hourlabel";
      lab.textContent = `${pad2(h)}:00`;
      labels.appendChild(lab);
    }
    grid.appendChild(labels);

    const track = document.createElement("div");
    track.className = "timegrid__track";
    track.style.height = "calc(var(--hour-h) * 24)";

    const laidOut = layoutDayEvents(eventsFor(d));
    laidOut.forEach(it => {
      const box = document.createElement("div");
      box.className = "timeevent";

      const startHrs = it.start / 60;
      const durHrs = Math.max((it.end - it.start) / 60, 1 / 6); 
      box.style.top = `calc(var(--hour-h) * ${startHrs})`;
      box.style.height = `calc(var(--hour-h) * ${durHrs} - 4px)`;

      const widthPct = 100 / it.totalCols;
      box.style.left = `calc(${widthPct}% * ${it.col} + 6px)`;
      box.style.width = `calc(${widthPct}% - 12px)`;

      if ((it.end - it.start) < 30) box.classList.add("timeevent--compact");

      const t = document.createElement("p");
      t.className = "timeevent__time";
      t.textContent = it.ev.time;
      const ti = document.createElement("p");
      ti.className = "timeevent__title";
      ti.textContent = it.ev.title;
      const de = document.createElement("p");
      de.className = "timeevent__desc";
      de.textContent = it.ev.desc;
      box.appendChild(t);
      box.appendChild(ti);
      box.appendChild(de);

      box.addEventListener("click", () => openAgenda(d));
      track.appendChild(box);
    });

   
    const now = new Date();
    if (isSameDay(d, now)) {
      const nowLine = document.createElement("div");
      nowLine.className = "timegrid__now";
      const nowHrs = (now.getHours() * 60 + now.getMinutes()) / 60;
      nowLine.style.top = `calc(var(--hour-h) * ${nowHrs})`;
      track.appendChild(nowLine);
    }

    grid.appendChild(track);
    el.dayTimeline.appendChild(grid);
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
