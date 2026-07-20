/*
 * İstatistik sayfası mantığı
 * Veri kaynağı: GPAStorage (localStorage, otomatik) veya JSON yedeği (isteğe bağlı).
 * Grafikler: Chart.js (CDN). Tüm hesaplar istemci tarafında yapılır.
 */
(function () {
  'use strict';

  // i18n yardımcısı — i18n.js yoksa anahtarın kendisini döndürür.
  function tr(key) { return window.GPAI18N ? GPAI18N.t(key) : key; }
  function lang() { return window.GPAI18N ? GPAI18N.lang() : 'tr'; }

  // --- Configuration ---
  const gradeMap = { 'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0 };
  const gradeOrder = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'];
  const statusOrder = ['taken', 'repeated with', 'withdrawed', 'not taken'];

  // Boğaziçi markasına göre grafik paleti (lacivert + Boğaz mavisi çekirdek).
  // Anahtar adları eski kodla uyumlu tutuldu; değerler markaya güncellendi.
  const COLORS = {
    indigo: '#1a4b9d',     // marka laciverti
    indigoDark: '#133c81',
    green: '#0d8a63',
    red: '#d3294a',
    redDark: '#b0203c',
    amber: '#e0952b',
    purple: '#6d5ac4',
    orange: '#3bb3e6',     // Boğaz mavisi vurgusu
    slate: '#475569',
    gray: '#94a3b8'
  };

  const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark';

  // Eksen yazıları, ızgara çizgileri ve koyu palet renkleri temaya uyarlanır
  function applyChartTheme() {
    const dark = isDarkTheme();
    COLORS.slate = dark ? '#cbd5e1' : '#334155';
    if (window.Chart && Chart.defaults) {
      Chart.defaults.font = Chart.defaults.font || {};
      Chart.defaults.font.family = "'Inter', 'Segoe UI', system-ui, sans-serif";
      Chart.defaults.color = dark ? '#94a3b8' : '#64748b';
      Chart.defaults.borderColor = dark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)';
    }
  }
  applyChartTheme();

  // Global vars for simulator
  let globalTotalPoints = 0;
  let globalTotalCredits = 0;

  // --- Statistical Helpers ---
  const mean = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const stdDev = (arr) => {
    if (arr.length < 2) return 0;
    const mu = mean(arr);
    return Math.sqrt(mean(arr.map(a => (a - mu) ** 2)));
  };
  const linearRegression = (x, y) => {
    const n = x.length;
    const xm = mean(x), ym = mean(y);
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - xm) * (y[i] - ym);
      den += (x[i] - xm) ** 2;
    }
    const m = num / den;
    return { m, c: ym - m * xm, predict: (val) => m * val + (ym - m * xm) };
  };
  const correlationCoefficient = (x, y) => {
    if (x.length < 2) return 0;
    const xm = mean(x), ym = mean(y);
    let num = 0, den1 = 0, den2 = 0;
    for (let i = 0; i < x.length; i++) {
      num += (x[i] - xm) * (y[i] - ym);
      den1 += (x[i] - xm) ** 2;
      den2 += (y[i] - ym) ** 2;
    }
    return num / Math.sqrt(den1 * den2);
  };

  function getSeasonFromText(text) {
    const t = text.toLowerCase();
    if (t.includes('fall') || t.includes('güz')) return 'Güz / Fall';
    if (t.includes('spring') || t.includes('bahar')) return 'Bahar / Spring';
    if (t.includes('summer') || t.includes('yaz')) return 'Yaz / Summer';
    return 'Diğer / Other';
  }

  // --- Chart yönetimi ---
  // Aynı canvas'a ikinci kez çizim yapmadan önce eski grafiği yok eder
  const chartRegistry = {};
  function makeChart(id, config) {
    if (chartRegistry[id]) chartRegistry[id].destroy();
    chartRegistry[id] = new Chart(document.getElementById(id), config);
    return chartRegistry[id];
  }

  // Tema değişince grafiklerin son veriyle yeniden çizilebilmesi için tutulur
  let lastAnalysis = null;

  window.addEventListener('gpa:themechange', () => {
    applyChartTheme();
    if (lastAnalysis) analyzeData(lastAnalysis.json, lastAnalysis.sourceLabel);
  });

  // Dil değişince tüm üretilen metinler ve grafik etiketleri yeniden çizilir.
  window.addEventListener('gpa:langchange', () => {
    if (lastAnalysis) analyzeData(lastAnalysis.json, lastAnalysis.sourceLabel);
  });

  // --- Main Logic ---
  // Veriyi çözümleyip tüm panelleri oluşturur (kaynak: 'auto' = tarayıcı kaydı, 'file' = JSON yedeği)
  function analyzeData(json, sourceLabel) {
    lastAnalysis = { json, sourceLabel };
    let cards = [], semesters = [], semNames = [];

    if (json.cards && json.semesters) {
      cards = json.cards;
      const validSemesters = json.semesters.filter(s => Array.isArray(s.cards) && s.cards.length > 0);
      semNames = validSemesters.map(s => s.name);
      let idToCard = {};
      cards.forEach(c => idToCard[c.id] = c);
      semesters = validSemesters.map(s => s.cards.map(cid => idToCard[cid]).filter(Boolean));
    } else {
      cards = Array.isArray(json) ? json : json.cards;
      const semSize = 6;
      for (let i = 0; i < cards.length; i += semSize) {
        const group = cards.slice(i, i + semSize);
        if (group.length) semesters.push(group);
      }
      semNames = semesters.map((_, i) => `${tr('editor.defaultSemester')} ${i + 1}`);
    }

    document.getElementById('upload-info').textContent = sourceLabel === 'auto'
      ? tr('stats.info.auto').replace('{s}', semesters.length).replace('{c}', cards.length)
      : tr('stats.info.file').replace('{s}', semesters.length).replace('{c}', cards.length);

    document.getElementById('stats-empty').hidden = true;
    document.getElementById('stats-content').hidden = false;
    document.getElementById('sim-section').style.display = 'block';
    runAnalysis(semesters, semNames, cards);
  }

  document.getElementById('stats-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        analyzeData(JSON.parse(evt.target.result), 'file');
      } catch (err) {
        GPAUI.toast(tr('stats.toast.parseError').replace('{msg}', err.message), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // --- SIMULATOR LOGIC ---
  function updateSimulation() {
    if (globalTotalCredits === 0) return;

    const targetCredits = parseFloat(document.getElementById('grad-credits').value) || 146;
    const futureGrade = document.getElementById('future-grade').value;
    const futurePoints = gradeMap[futureGrade];

    const remainingCredits = targetCredits - globalTotalCredits;

    const infoDiv = document.getElementById('sim-info');
    const resDiv = document.getElementById('projected-gpa');

    if (remainingCredits <= 0) {
      resDiv.textContent = (globalTotalPoints / globalTotalCredits).toFixed(2);
      infoDiv.textContent = tr('stats.sim.done');
    } else {
      const projectedTotalPoints = globalTotalPoints + (remainingCredits * futurePoints);
      const projectedGPA = projectedTotalPoints / targetCredits;
      resDiv.textContent = projectedGPA.toFixed(2);
      infoDiv.textContent = tr('stats.sim.projection').replace('{n}', remainingCredits).replace('{g}', futureGrade);
    }
  }

  document.getElementById('grad-credits').addEventListener('input', updateSimulation);
  document.getElementById('future-grade').addEventListener('change', updateSimulation);

  function runAnalysis(semesters, semNames, allCards) {
    // --- Calculate Global Totals for Simulator ---
    globalTotalPoints = 0;
    globalTotalCredits = 0;

    // --- 1. Basic Semester Metrics ---
    const semesterMetrics = semesters.map(sem => {
      let totalPts = 0, totalCr = 0, attemptCr = 0;
      let grades = [];
      let withdrawals = 0;
      let gradeDist = {};
      gradeOrder.forEach(g => gradeDist[g] = 0);

      sem.forEach(c => {
        const cr = parseFloat(c.credit);
        if (isNaN(cr) || cr <= 0) return;

        let status = c.status;
        if (status === 'withdrawed' || status === 'not taken') {
          withdrawals++;
          status = 'withdrawed';
        } else {
          attemptCr += cr;
        }

        let gVal = gradeMap[c.grade];
        if (gVal === undefined) gVal = parseFloat(c.grade);

        if ((status === 'taken' || status === 'repeated with') && !isNaN(gVal)) {
          totalPts += gVal * cr;
          totalCr += cr;
          grades.push(gVal);
          if (gradeDist.hasOwnProperty(c.grade)) gradeDist[c.grade]++;
        }
      });

      return {
        spa: totalCr > 0 ? totalPts / totalCr : 0,
        creditsTaken: totalCr,
        creditsAttempted: attemptCr,
        volatility: stdDev(grades),
        withdrawals: withdrawals,
        gradeDist: gradeDist
      };
    });

    // --- 2. Cumulative GPA (GPACalc — planlayıcı ile aynı kurallar) ---
    // Tekrar kuralı, YRN eşleştirmesi ve sonuçlanmamış tekrarların eski notu
    // silmemesi dahil tüm mantık gpa.js'te tek yerden yönetilir.
    const gpaStats = GPACalc.computeAll(semesters.map(sem => ({ courses: sem })));
    const cumulativeGPA = gpaStats.perSemester.map(p => p.runningGpa);
    globalTotalPoints = gpaStats.overall.points;
    globalTotalCredits = gpaStats.overall.credits;
    updateSimulation();

    // --- 3. Seasonal Logic ---
    const seasons = ['Güz / Fall', 'Bahar / Spring', 'Yaz / Summer'];
    const seasonalStats = {
      'Güz / Fall': { totalSpa: 0, totalLoad: 0, count: 0 },
      'Bahar / Spring': { totalSpa: 0, totalLoad: 0, count: 0 },
      'Yaz / Summer': { totalSpa: 0, totalLoad: 0, count: 0 },
      'Diğer / Other': { totalSpa: 0, totalLoad: 0, count: 0 }
    };

    semNames.forEach((name, idx) => {
      const seasonKey = getSeasonFromText(name);
      const metrics = semesterMetrics[idx];
      if (metrics.creditsAttempted > 0) {
        seasonalStats[seasonKey].totalSpa += metrics.spa;
        seasonalStats[seasonKey].totalLoad += metrics.creditsAttempted;
        seasonalStats[seasonKey].count++;
      }
    });

    const seasonalAverages = seasons.map(s => {
      const data = seasonalStats[s];
      return {
        season: s,
        avgSpa: data.count ? (data.totalSpa / data.count) : 0,
        avgLoad: data.count ? (data.totalLoad / data.count) : 0,
        count: data.count
      };
    });

    // --- 4. Other Data Prep ---
    const reg = linearRegression(semesterMetrics.map((_, i) => i), semesterMetrics.map(m => m.spa));
    const spaDiffs = semesterMetrics.map((m, i) => i === 0 ? 0 : m.spa - semesterMetrics[i - 1].spa);

    // Correlation Data
    const loads = semesterMetrics.map(m => m.creditsAttempted);
    const spas = semesterMetrics.map(m => m.spa);

    // Repeated
    const lessonCounts = {};
    allCards.forEach(c => {
      let name = c.lesson;
      if (name) {
        if (!lessonCounts[name]) lessonCounts[name] = 0;
        lessonCounts[name]++;
      }
    });
    const topRepeated = Object.entries(lessonCounts).filter(([_, c]) => c > 1).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Status
    const statusCounts = {};
    statusOrder.forEach(s => statusCounts[s] = 0);
    allCards.forEach(c => {
      let s = c.status === 'not taken' ? 'withdrawed' : c.status;
      if (statusCounts.hasOwnProperty(s)) statusCounts[s] += parseFloat(c.credit) || 0;
    });

    // Hardest/Easiest
    const courseStats = {};
    allCards.forEach(c => {
      let name = (c.status === 'repeated with' ? c.repeatedLesson : c.lesson) || c.lesson;
      if (!name) return;
      if (!courseStats[name]) courseStats[name] = { total: 0, count: 0 };
      let g = gradeMap[c.grade] ?? parseFloat(c.grade);
      if (!isNaN(g)) { courseStats[name].total += g; courseStats[name].count++; }
    });
    const courseAvg = Object.entries(courseStats).map(([n, s]) => ({ name: n, avg: s.count ? s.total / s.count : 0 }));
    courseAvg.sort((a, b) => a.avg - b.avg);
    const hardest = courseAvg.slice(0, 5);
    const easiest = [...courseAvg].reverse().slice(0, 5);

    // --- 5. Render Functions ---
    renderSummaryCards(semesterMetrics, cumulativeGPA, reg);
    renderCharts(semNames, semesterMetrics, cumulativeGPA, reg, spaDiffs, topRepeated, statusCounts, hardest, easiest, allCards, seasonalAverages, loads, spas);
  }

  function renderSummaryCards(metrics, cumGPA, reg) {
    const current = cumGPA[cumGPA.length - 1] || 0;
    const nextPred = reg.predict(metrics.length).toFixed(2);
    const best = Math.max(...metrics.map(m => m.spa));
    const totalW = metrics.reduce((a, b) => a + b.withdrawals, 0);

    document.getElementById('summary-cards').innerHTML = `
        <div class="summary-card"><h3>${tr('stats.card.cumGpa')}</h3><div class="value">${current.toFixed(2)}</div><div class="desc">${tr('stats.card.cumGpaDesc')}</div></div>
        <div class="summary-card ${parseFloat(nextPred) > current ? 'success' : 'danger'}"><h3>${tr('stats.card.nextSpa')}</h3><div class="value">${nextPred}</div><div class="desc">${tr('stats.card.nextSpaDesc')}</div></div>
        <div class="summary-card success"><h3>${tr('stats.card.bestSpa')}</h3><div class="value">${best.toFixed(2)}</div><div class="desc">${tr('stats.card.bestSpaDesc')}</div></div>
        <div class="summary-card ${totalW > 0 ? 'danger' : ''}"><h3>${tr('stats.card.totalW')}</h3><div class="value">${totalW}</div><div class="desc">${tr('stats.card.totalWDesc')}</div></div>
    `;
  }

  function renderCharts(labels, metrics, cumGPA, reg, diffs, repeated, statusData, hardest, easiest, allCards, seasonalAvg, loads, spas) {

    // 1. Seasonal
    const seasonLabels = seasonalAvg.map(s => s.season);
    const seasonSpa = seasonalAvg.map(s => s.avgSpa);
    const seasonLoad = seasonalAvg.map(s => s.avgLoad);

    let insightMsg = tr('stats.seasonal.insufficient');
    if (seasonalAvg.length > 0) {
      const maxSpaSeason = seasonalAvg.reduce((p, c) => p.avgSpa > c.avgSpa ? p : c);
      const maxLoadSeason = seasonalAvg.reduce((p, c) => p.avgLoad > c.avgLoad ? p : c);

      insightMsg = tr('stats.seasonal.insight')
        .replace('{spa}', maxSpaSeason.avgSpa.toFixed(2))
        .replace('{sSeason}', maxSpaSeason.season)
        .replace('{load}', maxLoadSeason.avgLoad.toFixed(1))
        .replace('{lSeason}', maxLoadSeason.season);
    }
    document.getElementById('seasonal-analysis').innerHTML = insightMsg;

    makeChart('seasonalChart', {
      type: 'bar',
      data: {
        labels: seasonLabels,
        datasets: [
          { label: tr('stats.ds.avgSpa'), data: seasonSpa, backgroundColor: COLORS.indigo, yAxisID: 'y' },
          { label: tr('stats.ds.avgLoad'), data: seasonLoad, type: 'line', borderColor: COLORS.orange, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#fff', yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { type: 'linear', display: true, position: 'left', title: { display: true, text: tr('stats.axis.spa') }, min: 0, max: 4 },
          y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: tr('stats.axis.load') }, grid: { drawOnChartArea: false } }
        }
      }
    });

    // 2. Trend
    const trendData = labels.map((_, i) => reg.predict(i));
    const currentGPA = cumGPA[cumGPA.length - 1];
    const nextPred = reg.predict(metrics.length);
    const trendMsg = tr('stats.trend.slope').replace('{m}', reg.m.toFixed(3));
    document.getElementById('trend-analysis').textContent = nextPred > currentGPA
      ? tr('stats.trend.positive').replace('{slope}', trendMsg)
      : tr('stats.trend.negative').replace('{slope}', trendMsg);

    makeChart('gpaChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: tr('stats.ds.termSpa'), data: metrics.map(m => m.spa), borderColor: COLORS.indigo, backgroundColor: COLORS.indigo, tension: 0.3 },
          { label: tr('stats.ds.cumGpa'), data: cumGPA, borderColor: COLORS.green, borderDash: [5, 5], tension: 0.1 },
          { label: tr('stats.ds.trend'), data: trendData, borderColor: COLORS.amber, borderWidth: 2, pointRadius: 0, fill: false }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 4 } }
      }
    });

    // 3. Grade Dist By Sem
    makeChart('gradeDistBySemChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: gradeOrder.map((g, i) => ({ label: g, data: metrics.map(m => m.gradeDist[g]), backgroundColor: `rgba(26, 75, 157, ${1 - i * 0.1})` }))
      },
      options: {
        maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true } }
      }
    });

    // 4. Improvement
    makeChart('improvementChart', {
      type: 'bar',
      data: { labels: labels, datasets: [{ label: tr('stats.ds.spaChange'), data: diffs, backgroundColor: diffs.map(d => d >= 0 ? COLORS.green : COLORS.red) }] },
      options: { maintainAspectRatio: false }
    });

    // 5. Volatility
    makeChart('volatilityChart', {
      type: 'bar',
      data: { labels: labels, datasets: [{ label: tr('stats.ds.stdDev'), data: metrics.map(m => m.volatility), backgroundColor: COLORS.purple }] },
      options: { maintainAspectRatio: false }
    });

    // 6. Repeated
    makeChart('topRepeatedLessonsChart', {
      type: 'bar',
      data: { labels: repeated.map(r => r[0]), datasets: [{ label: tr('stats.ds.repeatCount'), data: repeated.map(r => r[1]), backgroundColor: COLORS.amber }] },
      options: { indexAxis: 'y', maintainAspectRatio: false }
    });

    // 7. Withdrawals
    makeChart('mostWithdrawalsChart', {
      type: 'bar',
      data: { labels: labels, datasets: [{ label: tr('stats.ds.withdrawCount'), data: metrics.map(m => m.withdrawals), backgroundColor: COLORS.red }] },
      options: { maintainAspectRatio: false }
    });

    // 8. Difficulty
    makeChart('difficultyChart', {
      type: 'bar',
      data: { labels: hardest.map(c => c.name), datasets: [{ label: tr('stats.ds.avgGrade'), data: hardest.map(c => c.avg), backgroundColor: COLORS.redDark }] },
      options: { indexAxis: 'y', maintainAspectRatio: false, scales: { x: { min: 0, max: 4 } } }
    });

    // 9. Mastery
    makeChart('masteryChart', {
      type: 'bar',
      data: { labels: easiest.map(c => c.name), datasets: [{ label: tr('stats.ds.avgGrade'), data: easiest.map(c => c.avg), backgroundColor: COLORS.green }] },
      options: { indexAxis: 'y', maintainAspectRatio: false, scales: { x: { min: 0, max: 4 } } }
    });

    // 10. Global Grade Dist
    const globalDist = {};
    gradeOrder.forEach(g => globalDist[g] = 0);
    allCards.forEach(c => { if (globalDist.hasOwnProperty(c.grade)) globalDist[c.grade]++; });
    makeChart('gradeDistChart', {
      type: 'doughnut',
      data: {
        labels: gradeOrder,
        datasets: [{ data: gradeOrder.map(g => globalDist[g]), backgroundColor: [COLORS.indigo, COLORS.green, COLORS.amber, COLORS.purple, COLORS.orange, COLORS.redDark, COLORS.gray, COLORS.slate] }]
      },
      options: { maintainAspectRatio: false }
    });

    // 11. Status
    makeChart('creditByStatusChart', {
      type: 'pie',
      data: { labels: statusOrder, datasets: [{ data: statusOrder.map(s => statusData[s]), backgroundColor: [COLORS.indigo, COLORS.amber, COLORS.redDark, COLORS.gray] }] },
      options: { maintainAspectRatio: false }
    });

    // 12. Correlation
    const corr = correlationCoefficient(loads, spas);
    let corrMsg = '';
    if (Math.abs(corr) < 0.3) corrMsg = tr('stats.corr.none');
    else if (corr < 0) corrMsg = tr('stats.corr.negative');
    else corrMsg = tr('stats.corr.positive');

    document.getElementById('corr-analysis').textContent = tr('stats.corr.result')
      .replace('{c}', corr.toFixed(2))
      .replace('{msg}', corrMsg);

    makeChart('correlationChart', {
      type: 'scatter',
      data: {
        datasets: [{
          label: tr('stats.ds.termsLoadVsSuccess'),
          data: loads.map((l, i) => ({ x: l, y: spas[i] })),
          backgroundColor: COLORS.slate,
          pointRadius: 6
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: tr('stats.axis.creditsTaken') } },
          y: { title: { display: true, text: tr('stats.axis.spa') }, min: 0, max: 4 }
        }
      }
    });
  }

  // --- OTOMATİK YÜKLEME ---
  // Planlayıcı/PDF dönüştürücüden kaydedilen veriler varsa analiz otomatik başlar.
  // i18n.js DOMContentLoaded'da statik metinleri uygular; bu yüzden otomatik
  // yüklemeyi ondan SONRA çalıştırırız ki JS'in ürettiği analiz metinleri
  // (trend, korelasyon, sezonluk, upload-info) placeholder'a geri dönmesin.
  function autoLoad() {
    const saved = window.GPAStorage ? GPAStorage.load() : null;
    if (saved && saved.cards && saved.cards.length > 0) {
      analyzeData(saved, 'auto');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoLoad);
  } else {
    autoLoad();
  }
})();
