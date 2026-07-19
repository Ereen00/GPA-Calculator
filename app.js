/*
 * GPA Planlayıcı — durum (state) tabanlı editör
 *
 * Mimari:
 *  - state: tek doğruluk kaynağı { semesters: [{ name, courses: [...] }] }
 *  - render(): state'ten tüm DOM'u kurar (yapısal değişikliklerde)
 *  - refreshComputed(): yalnızca hesaplanan değerleri günceller (alan düzenlemelerinde)
 *  - GPAStorage: localStorage veri katmanı (storage.js)
 *  - GPACalc: ortalama hesapları (gpa.js)
 *  - Sortable: sürükle-bırak (SortableJS, CDN)
 */
(function () {
  'use strict';

  // ---------- Sabitler ----------
  var STATUS_OPTIONS = [
    { value: 'taken', label: 'Alındı' },
    { value: 'repeated with', label: 'Tekrar (Yerine)' },
    { value: 'not taken', label: 'Çekildi (W)' },
    { value: 'non credit', label: 'Kredisiz' }
  ];
  var VALID_STATUSES = STATUS_OPTIONS.map(function (o) { return o.value; });
  var GRADE_OPTIONS = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF', 'W', ''];
  var REPEAT_CANDIDATE_GRADES = ['DC', 'DD', 'FF'];

  // ---------- Durum ----------
  var state = { semesters: [] };
  var idSeq = 1;
  var sortables = [];

  var semestersContainer = document.getElementById('semesters-container');
  var emptyStateEl = document.getElementById('empty-state');

  function newCourseId() {
    return 'card-' + Date.now() + '-' + (idSeq++);
  }

  // ---------- Küçük DOM yardımcıları ----------
  function el(tag, props) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        var val = props[key];
        if (key === 'class') node.className = val;
        else if (key === 'text') node.textContent = val;
        else if (key === 'dataset') Object.keys(val).forEach(function (d) { node.dataset[d] = val[d]; });
        else node[key] = val;
      });
    }
    return node;
  }

  function fmtNum(n) {
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
  }

  // ---------- Veri dönüşümleri (storage biçimi <-> editör durumu) ----------
  function normalizeCourse(raw) {
    var status = raw.status;
    if (status === 'withdrawed' || status === 'withdrawn') status = 'not taken';
    if (VALID_STATUSES.indexOf(status) === -1) status = 'taken';
    return {
      id: raw.id || newCourseId(),
      lesson: raw.lesson || '',
      status: status,
      grade: raw.grade != null ? String(raw.grade) : '',
      credit: (raw.credit != null && raw.credit !== '') ? String(raw.credit) : '',
      repeatedLesson: raw.repeatedLesson || ''
    };
  }

  function toEditorState(data) {
    var byId = {};
    (data.cards || []).forEach(function (c) { byId[c.id] = c; });
    var used = new Set();

    var semesters = (data.semesters || []).map(function (s) {
      return {
        name: s.name || 'Dönem',
        courses: (s.cards || [])
          .map(function (id) { used.add(id); return byId[id]; })
          .filter(Boolean)
          .map(normalizeCourse)
      };
    });

    // Hiçbir döneme yerleştirilmemiş kartlar kaybolmasın
    var orphans = (data.cards || []).filter(function (c) { return !used.has(c.id); });
    if (orphans.length) {
      semesters.push({ name: 'Yerleştirilmemiş Dersler', courses: orphans.map(normalizeCourse) });
    }

    return { semesters: semesters };
  }

  function toStorageData(current) {
    var cards = [];
    var semesters = current.semesters.map(function (sem) {
      return {
        name: sem.name,
        cards: sem.courses.map(function (course) {
          cards.push({
            id: course.id,
            lesson: course.lesson,
            lessonInputType: course.status === 'repeated with' ? 'select' : 'input',
            status: course.status,
            grade: course.grade,
            credit: String(course.credit),
            repeatedLesson: course.repeatedLesson || ''
          });
          return course.id;
        })
      };
    });
    return { semesters: semesters, cards: cards };
  }

  // ---------- Sürükle-bırak ----------
  function makeSortable(target, opts) {
    if (typeof Sortable === 'undefined') return; // CDN engellenirse uygulama çalışmaya devam eder
    sortables.push(new Sortable(target, opts));
  }

  function destroySortables() {
    while (sortables.length) {
      try { sortables.pop().destroy(); } catch (_) {}
    }
  }

  function onCourseDragEnd(evt) {
    var fromIdx = parseInt(evt.from.dataset.semIndex, 10);
    var toIdx = parseInt(evt.to.dataset.semIndex, 10);
    if (isNaN(fromIdx) || isNaN(toIdx)) return;
    if (fromIdx === toIdx && evt.oldIndex === evt.newIndex) return;

    var moved = state.semesters[fromIdx].courses.splice(evt.oldIndex, 1)[0];
    if (!moved) { render(); return; }
    state.semesters[toIdx].courses.splice(evt.newIndex, 0, moved);
    render();
    scheduleSave();
  }

  function onSemesterDragEnd(evt) {
    if (evt.oldIndex === evt.newIndex) return;
    var moved = state.semesters.splice(evt.oldIndex, 1)[0];
    if (!moved) { render(); return; }
    state.semesters.splice(evt.newIndex, 0, moved);
    render();
    scheduleSave();
  }

  // ---------- Tekrar (yerine) aday listesi ----------
  function repeatCandidates(current) {
    var names = [];
    state.semesters.forEach(function (sem) {
      sem.courses.forEach(function (c) {
        if (c === current) return;
        if (REPEAT_CANDIDATE_GRADES.indexOf(c.grade) === -1) return;
        var name = (c.lesson || '').trim();
        if (name && names.indexOf(name) === -1) names.push(name);
      });
    });
    return names;
  }

  // ---------- Satır ve kart kurucuları ----------
  function buildCourseRow(course) {
    var row = el('div', { class: 'course-row', dataset: { courseId: course.id } });

    row.appendChild(el('span', { class: 'drag-handle', text: '⠿', title: 'Sürükleyerek taşı' }));

    var lessonInput = el('input', {
      class: 'course-lesson', type: 'text', value: course.lesson,
      placeholder: 'Ders kodu (örn. CMPE 150)', title: 'Ders kodu / adı'
    });
    lessonInput.addEventListener('input', function () {
      course.lesson = lessonInput.value;
      refreshComputed();
      scheduleSave();
    });
    row.appendChild(lessonInput);

    var statusSel = el('select', { class: 'course-status', title: 'Ders durumu' });
    STATUS_OPTIONS.forEach(function (o) {
      statusSel.appendChild(el('option', { value: o.value, text: o.label }));
    });
    statusSel.value = course.status;
    statusSel.addEventListener('change', function () {
      course.status = statusSel.value;
      render(); // "yerine" alanının görünürlüğü değişir
      scheduleSave();
      focusCourse(course.id, course.status === 'repeated with' ? '.course-repeat' : '.course-status');
    });
    row.appendChild(statusSel);

    if (course.status === 'repeated with') {
      var repSel = el('select', { class: 'course-repeat', title: 'Hangi dersin yerine sayılıyor?' });
      repSel.appendChild(el('option', { value: '', text: '— yerine geçtiği ders —' }));
      repeatCandidates(course).forEach(function (name) {
        repSel.appendChild(el('option', { value: name, text: name }));
      });
      if (course.repeatedLesson && !Array.prototype.some.call(repSel.options, function (o) { return o.value === course.repeatedLesson; })) {
        repSel.appendChild(el('option', { value: course.repeatedLesson, text: course.repeatedLesson }));
      }
      repSel.value = course.repeatedLesson || '';
      repSel.addEventListener('change', function () {
        course.repeatedLesson = repSel.value;
        refreshComputed();
        scheduleSave();
      });
      row.appendChild(repSel);
    }

    var gradeSel = el('select', { class: 'course-grade', title: 'Not' });
    GRADE_OPTIONS.forEach(function (g) {
      gradeSel.appendChild(el('option', { value: g, text: g === '' ? '--' : g }));
    });
    if (!Array.prototype.some.call(gradeSel.options, function (o) { return o.value === course.grade; })) {
      gradeSel.appendChild(el('option', { value: course.grade, text: course.grade }));
    }
    gradeSel.value = course.grade;
    gradeSel.addEventListener('change', function () {
      course.grade = gradeSel.value;
      refreshComputed();
      scheduleSave();
    });
    row.appendChild(gradeSel);

    var creditInput = el('input', {
      class: 'course-credit', type: 'number', min: '0', step: '0.5',
      value: course.credit, title: 'Kredi', placeholder: 'Kr'
    });
    creditInput.addEventListener('input', function () {
      course.credit = creditInput.value;
      refreshComputed();
      scheduleSave();
    });
    row.appendChild(creditInput);

    var delBtn = el('button', { class: 'course-delete', type: 'button', text: '✕', title: 'Dersi sil' });
    delBtn.addEventListener('click', function () {
      var sem = state.semesters.find(function (s) { return s.courses.indexOf(course) !== -1; });
      if (sem) sem.courses.splice(sem.courses.indexOf(course), 1);
      render();
      scheduleSave();
    });
    row.appendChild(delBtn);

    return row;
  }

  function makeChip(label, key, cls, title) {
    var chip = el('span', { class: 'chip ' + cls, title: title || '' });
    chip.appendChild(el('span', { class: 'chip-label', text: label }));
    var value = el('span', { class: 'chip-value', text: '0.00' });
    value.dataset.chip = key;
    chip.appendChild(value);
    return chip;
  }

  function buildSemesterCard(sem, semIdx) {
    var card = el('section', { class: 'sem-card', dataset: { semIndex: String(semIdx) } });

    // Başlık
    var header = el('div', { class: 'sem-header' });
    header.appendChild(el('span', { class: 'sem-drag-handle', text: '⠿', title: 'Dönemi sürükleyerek sırala' }));

    var nameInput = el('input', {
      class: 'sem-name', type: 'text', value: sem.name, title: 'Dönem adını düzenlemek için tıklayın'
    });
    nameInput.addEventListener('input', function () {
      sem.name = nameInput.value;
      scheduleSave();
    });
    header.appendChild(nameInput);

    var chips = el('div', { class: 'sem-chips' });
    chips.appendChild(makeChip('SPA', 'spa', 'chip-spa', 'Bu dönemin not ortalaması'));
    chips.appendChild(makeChip('GPA', 'gpa', 'chip-gpa', 'Bu dönem sonundaki kümülatif ortalama'));
    var detail = el('span', { class: 'chip-detail', title: 'Bu dönemde denenen ve tamamlanan krediler' });
    detail.dataset.chip = 'detail';
    chips.appendChild(detail);
    header.appendChild(chips);

    var semDelBtn = el('button', { class: 'sem-delete', type: 'button', text: '✕', title: 'Dönemi sil' });
    semDelBtn.addEventListener('click', function () {
      var count = sem.courses.length;
      if (count > 0 && !confirm('"' + sem.name + '" dönemi ve içindeki ' + count + ' ders silinsin mi?')) return;
      var idx = state.semesters.indexOf(sem);
      if (idx !== -1) state.semesters.splice(idx, 1);
      render();
      scheduleSave();
    });
    header.appendChild(semDelBtn);
    card.appendChild(header);

    // Ders listesi
    var list = el('div', { class: 'course-list', dataset: { semIndex: String(semIdx) } });
    sem.courses.forEach(function (course) {
      list.appendChild(buildCourseRow(course));
    });
    card.appendChild(list);

    makeSortable(list, {
      group: 'courses',
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'course-ghost',
      onEnd: onCourseDragEnd
    });

    // Ders ekle
    var addBtn = el('button', { class: 'add-course-btn', type: 'button', text: '➕ Ders Ekle' });
    addBtn.addEventListener('click', function () {
      var course = { id: newCourseId(), lesson: '', status: 'taken', grade: 'AA', credit: '3', repeatedLesson: '' };
      sem.courses.push(course);
      render();
      scheduleSave();
      focusCourse(course.id, '.course-lesson');
    });
    card.appendChild(el('div', { class: 'sem-footer' })).appendChild(addBtn);

    return card;
  }

  function focusCourse(courseId, selector) {
    var row = semestersContainer.querySelector('.course-row[data-course-id="' + courseId + '"]');
    if (!row) return;
    var target = row.querySelector(selector);
    if (target) target.focus();
  }

  // ---------- Ana çizim ----------
  function render() {
    destroySortables();
    semestersContainer.innerHTML = '';

    state.semesters.forEach(function (sem, idx) {
      semestersContainer.appendChild(buildSemesterCard(sem, idx));
    });

    makeSortable(semestersContainer, {
      animation: 160,
      handle: '.sem-drag-handle',
      onEnd: onSemesterDragEnd
    });

    refreshComputed();
  }

  /* Hesaplanan tüm değerleri (rozetler, satır renkleri, alt bar) günceller */
  function refreshComputed() {
    var stats = GPACalc.computeAll(state.semesters);

    state.semesters.forEach(function (sem, idx) {
      var cardEl = semestersContainer.querySelector('.sem-card[data-sem-index="' + idx + '"]');
      if (!cardEl) return;
      var s = stats.perSemester[idx];

      setChip(cardEl, 'spa', s.spa.toFixed(2));
      setChip(cardEl, 'gpa', s.runningGpa.toFixed(2));
      setChip(cardEl, 'detail', 'Denenen ' + fmtNum(s.semesterAttempted) + ' · Tamamlanan ' + fmtNum(s.semesterCompleted));

      sem.courses.forEach(function (course) {
        var row = cardEl.querySelector('.course-row[data-course-id="' + course.id + '"]');
        if (!row) return;
        row.classList.remove('tint-red', 'tint-orange');
        var name = (course.lesson || '').trim().toLowerCase();
        if (course.status === 'not taken' || course.grade === 'FF') {
          row.classList.add('tint-red');
        } else if (name && course.status !== 'repeated with' && stats.repeatedTargets.has(name)) {
          row.classList.add('tint-orange'); // sonradan tekrar edildiği için GPA'da etkisiz
        }
      });
    });

    document.getElementById('gpa-value').textContent = stats.overall.gpa.toFixed(2);
    document.getElementById('total-credit-display').textContent = 'Toplam Kredi: ' + fmtNum(stats.overall.credits);
    document.getElementById('overall-attempted').textContent = 'Denenen: ' + fmtNum(stats.overall.attempted);
    document.getElementById('overall-completed').textContent = 'Tamamlanan: ' + fmtNum(stats.overall.completed);

    var totalCourses = state.semesters.reduce(function (acc, s) { return acc + s.courses.length; }, 0);
    if (emptyStateEl) emptyStateEl.hidden = totalCourses > 0;
  }

  function setChip(cardEl, key, text) {
    var target = cardEl.querySelector('[data-chip="' + key + '"]');
    if (target) target.textContent = text;
  }

  // ---------- Dönem ekleme ----------
  function suggestNextSemesterName() {
    var last = state.semesters[state.semesters.length - 1];
    if (last && last.name) {
      var m = last.name.match(/^(\d{4})-(\d{4})\s+(.+)$/);
      if (m) {
        var y1 = parseInt(m[1], 10), y2 = parseInt(m[2], 10);
        var tail = m[3].toLowerCase();
        var isEnglish = /fall|spring|summer/.test(tail);
        if (tail.indexOf('güz') !== -1 || tail.indexOf('fall') !== -1) {
          return m[1] + '-' + m[2] + (isEnglish ? ' Spring Term' : ' Bahar Dönemi');
        }
        if (/bahar|spring|yaz|summer/.test(tail)) {
          return (y1 + 1) + '-' + (y2 + 1) + (isEnglish ? ' Fall Term' : ' Güz Dönemi');
        }
      }
    }
    return 'Dönem ' + (state.semesters.length + 1);
  }

  document.getElementById('add-semester-btn').addEventListener('click', function () {
    state.semesters.push({ name: suggestNextSemesterName(), courses: [] });
    render();
    scheduleSave();
    var lastCard = semestersContainer.lastElementChild;
    if (lastCard && typeof lastCard.scrollIntoView === 'function') {
      lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // ---------- Otomatik kayıt ----------
  var autosaveEnabled = false;
  var saveTimer = null;

  function persistNow() {
    if (!autosaveEnabled || !window.GPAStorage) return;
    clearTimeout(saveTimer);
    saveTimer = null;
    var ok = GPAStorage.save(toStorageData(state), 'editor');
    var statusEl = document.getElementById('autosave-status');
    if (statusEl) {
      statusEl.textContent = ok
        ? '☁ Kaydedildi ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        : '⚠ Kaydedilemedi';
      statusEl.classList.toggle('error', !ok);
    }
  }

  function scheduleSave() {
    if (!autosaveEnabled) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persistNow, 400);
  }

  window.addEventListener('beforeunload', function () {
    if (saveTimer) persistNow();
  });

  // ---------- Yedekleme (JSON dışa/içe aktarma) ----------
  document.getElementById('save-btn').addEventListener('click', function () {
    GPAStorage.exportDownload(toStorageData(state));
  });

  document.getElementById('load-btn').addEventListener('click', function () {
    document.getElementById('load-input').click();
  });

  document.getElementById('load-input').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
      try {
        var data = JSON.parse(evt.target.result);
        if (!window.GPAStorage || !GPAStorage.isValidData(data)) {
          throw new Error('Geçersiz dosya biçimi');
        }
        var existing = GPAStorage.load();
        if (existing && existing.cards.length > 0 &&
            !confirm('Yedek dosyası mevcut planınızın üzerine yazılacak. Devam edilsin mi?')) {
          return;
        }
        state = toEditorState(data);
        render();
        scheduleSave();
      } catch (err) {
        alert('Dosya yüklenemedi: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // ---------- Başlangıç ----------
  (function init() {
    var saved = window.GPAStorage ? GPAStorage.load() : null;
    if (saved && (saved.semesters.length > 0 || saved.cards.length > 0)) {
      state = toEditorState(saved);
    } else {
      state = { semesters: [{ name: 'Dönem 1', courses: [] }] };
    }
    render();
    autosaveEnabled = true;
    scheduleSave(); // normalize edilmiş veriyi bir kez geri yaz
  })();
})();
