(function () {
  "use strict";

  const DOW_SHORT = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
  const DOW_MINI  = ["M","S","S","R","K","J","S"];
  const DOW_LONG  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const MONTH_LONG = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  /*
    AGENDA:
    time boleh berupa:
      "14:00"              = satu jam / waktu mulai
      "14:00 - 17:00"      = rentang waktu
      "09:30-12:15"        = rentang waktu

    Untuk agenda 14:00 - 17:00, DAY VIEW akan menandai:
    14:00, 15:00, 16:00, dan selesai pada 17:00.
  */
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
      { time: "14:00 - 15:30", title: "First Meet Kelas 13", desc: "Pertemuan Kelas 13 di Dana Galau Telkom University untuk membahas Hello World 2026" }
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

  function addDays(d, n) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + n);
    return nd;
  }

  function startOfWeek(d) {
    const nd = stripTime(d);
    nd.setDate(nd.getDate() - nd.getDay());
    return nd;
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  /*
    Parser waktu yang menerima:
    14:00
    14:00 - 17:00
    14:00-17:00
  */
  function parseTimeRange(timeText) {
    const matches = String(timeText).match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g) || [];

    if (!matches.length) {
      return { start: 0, end: 1, startText: "00:00", endText: "01:00" };
    }

    const toMinutes = (value) => {
      const [h, m] = value.split(":").map(Number);
      return h * 60 + m;
    };

    const startText = matches[0];
    const start = toMinutes(startText);

    if (matches.length >= 2) {
      const endText = matches[1];
      let end = toMinutes(endText);

      // Jika end lebih kecil, anggap agenda melewati tengah malam.
      if (end <= start) end += 24 * 60;

      return { start, end, startText, endText };
    }

    return {
      start,
      end: Math.min(start + 60, 24 * 60),
      startText,
      endText: `${pad2(Math.min(23, Math.floor((start + 60) / 60)))}:${pad2((start + 60) % 60)}`
    };
  }

  function durationText(timeText) {
    const { start, end } = parseTimeRange(timeText);
    const mins = Math.max(0, end - start);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    if (!hours) return `${minutes} menit`;
    if (!minutes) return `${hours} jam`;
    return `${hours} jam ${minutes} menit`;
  }

  function sortEvents(events) {
    return events.slice().sort((a, b) => parseTimeRange(a.time).start - parseTimeRange(b.time).start);
  }

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
    agendaClose: document.getElementById("agendaClose"),
    agendaWeekday: document.getElementById("agendaWeekday"),
    agendaDate: document.getElementById("agendaDate"),
    agendaList: document.getElementById("agendaList")
  };

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
    } else {
      label = `${DOW_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`;
    }

    el.periodTitle.textContent = label;
  }

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

    const prevMonthDate = new Date(year, month, 0);
    const prevTotal = prevMonthDate.getDate();
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();

    const nextDate = new Date(year, month + 1, 1);
    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();

    el.monthGrid.innerHTML = "";
    const cells = [];

    for (let i = firstDow - 1; i >= 0; i--) {
      cells.push({ date: new Date(prevYear, prevMonth, prevTotal - i), muted: true });
    }

    for (let d = 1; d <= totalDays; d++) {
      cells.push({ date: new Date(year, month, d), muted: false });
    }

    let nextDay = 1;
    while (cells.length < 42) {
      cells.push({ date: new Date(nextYear, nextMonth, nextDay++), muted: true });
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

      const evs = sortEvents(eventsFor(cell.date));

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

      btn.setAttribute(
        "aria-label",
        `${cell.date.getDate()} ${MONTH_LONG[cell.date.getMonth()]} ${cell.date.getFullYear()}, ${evs.length} agenda`
      );

      btn.addEventListener("click", () => openAgenda(cell.date));
      el.monthGrid.appendChild(btn);
    });
  }

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

      const evs = sortEvents(eventsFor(d));
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

  /*
    DAY VIEW utama:
    Rentang 14:00 - 17:00 benar-benar muncul pada semua jam yang dilalui:
      14:00 → mulai
      15:00 → berlangsung
      16:00 → berlangsung
      17:00 → selesai
    Jika mulai 14:45, event akan ditampilkan di slot 14:00 dan tetap diberi
    informasi waktu 14:45 - 17:00.
  */
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

    const evs = sortEvents(eventsFor(d));

    for (let h = 0; h < 24; h++) {
      const rowStart = h * 60;
      const rowEnd = rowStart + 60;

      const row = document.createElement("div");
      row.className = "hourrow";

      const label = document.createElement("div");
      label.className = "hourrow__label";
      label.textContent = `${pad2(h)}:00`;
      row.appendChild(label);

      const slot = document.createElement("div");
      slot.className = "hourrow__slot";

      const activeEvents = evs.filter(ev => {
        const range = parseTimeRange(ev.time);
        return range.start < rowEnd && range.end > rowStart;
      });

      const startingEvents = evs.filter(ev => {
        const range = parseTimeRange(ev.time);
        return Math.floor(range.start / 60) === h;
      });

      if (activeEvents.length) row.classList.add("has-event");
      if (startingEvents.length) row.classList.add("is-event-start");

      activeEvents.forEach(ev => {
        const range = parseTimeRange(ev.time);

        // Jangan menggandakan kartu event di setiap jam.
        // Baris tiap jam tetap diberi highlight, sedangkan kartu detail hanya muncul
        // pada jam tempat agenda dimulai.
        if (Math.floor(range.start / 60) !== h) return;

        const box = document.createElement("div");
        box.className = "hourevent";

        const t = document.createElement("div");
        t.className = "hourevent__time";
        t.textContent = ev.time;

        const ti = document.createElement("div");
        ti.className = "hourevent__title";
        ti.textContent = ev.title;

        const de = document.createElement("div");
        de.className = "hourevent__desc";
        de.textContent = ev.desc;

        const du = document.createElement("div");
        du.className = "hourevent__duration";
        du.textContent = `Durasi ${durationText(ev.time)}`;

        box.appendChild(t);
        box.appendChild(ti);
        box.appendChild(de);
        box.appendChild(du);
        slot.appendChild(box);
      });

      row.appendChild(slot);
      el.dayTimeline.appendChild(row);
    }
  }

  function openAgenda(date) {
    state.selected = date;

    el.agendaWeekday.textContent = DOW_LONG[date.getDay()];
    el.agendaDate.textContent = `${date.getDate()} ${MONTH_LONG[date.getMonth()]} ${date.getFullYear()}`;
    el.agendaList.innerHTML = "";

    const evs = sortEvents(eventsFor(date));

    if (!evs.length) {
      const empty = document.createElement("p");
      empty.className = "agenda__empty";
      empty.textContent = "Belum ada agenda untuk tanggal ini.";
      el.agendaList.appendChild(empty);
    } else {
      evs.forEach(ev => {
        const item = document.createElement("div");
        item.className = "agendaitem";

        const t = document.createElement("div");
        t.className = "agendaitem__time";
        t.textContent = ev.time;

        const ti = document.createElement("div");
        ti.className = "agendaitem__title";
        ti.textContent = ev.title;

        const de = document.createElement("div");
        de.className = "agendaitem__desc";
        de.textContent = ev.desc;

        const du = document.createElement("span");
        du.className = "agendaitem__duration";
        du.textContent = `Durasi ${durationText(ev.time)}`;

        item.appendChild(t);
        item.appendChild(ti);
        item.appendChild(de);
        item.appendChild(du);
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
    } else {
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

  function step(dir) {
    const d = new Date(state.current);

    if (state.view === "year") d.setFullYear(d.getFullYear() + dir);
    else if (state.view === "month") d.setMonth(d.getMonth() + dir);
    else if (state.view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);

    state.current = d;
    render();
  }

  el.btnPrev.addEventListener("click", () => step(-1));
  el.btnNext.addEventListener("click", () => step(1));

  el.btnToday.addEventListener("click", () => {
    state.current = new Date();
    state.selected = null;
    render();
  });

  el.viewSwitch.addEventListener("click", e => {
    const btn = e.target.closest(".viewbtn");
    if (!btn) return;

    state.view = btn.dataset.view;
    syncViewButtons();
    render();
  });

  el.agendaClose.addEventListener("click", closeAgenda);
  el.agendaScrim.addEventListener("click", closeAgenda);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAgenda();
  });

  syncViewButtons();
  render();
})();
