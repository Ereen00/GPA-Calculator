/*
 * GPACalc — not ortalaması hesaplama modülü (saf fonksiyonlar, DOM'a dokunmaz)
 *
 * Not tablosu ve kurallar ÜNİVERSİTE PROFİLİNDEN gelir (universities.js). Profil
 * verilmezse aktif profil, o da yoksa aşağıdaki Boğaziçi varsayılanı kullanılır —
 * böylece modül tek başına da (ör. testte) çalışır.
 *
 * Kurallar:
 *  - SPA/YANO: yalnızca o dönemdeki 'taken' / 'repeated with' dersler.
 *  - Kümülatif GPA/AGNO: bir ders birden çok kez alındıysa yalnızca EN SON alınışı sayılır
 *    ('repeated with' derslerde hedef ders repeatedLesson ile eşleştirilir).
 *  - 'not taken' (çekilen) ve 'non credit' dersler ortalamaya ve denenen krediye girmez.
 *  - Tamamlanan kredi: FF (0.00) üstü not alınan derslerin kredisi.
 *  - profile.rules.excludeFromCumulative: son notu bu listede olan ders kümülatif
 *    ortalamanın PAYINA DA PAYDASINA DA girmez; dönem ortalamasına ise normal girer
 *    (YTÜ'deki F0 davranışı — bkz. docs/ytu-notlandirma.md §4).
 */
(function (global) {
  'use strict';

  var GRADE_MAP = { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0 };

  function resolveProfile(profile) {
    if (profile && profile.grades) return profile;
    if (global.GPAUniversities) {
      var active = global.GPAUniversities.resolve(profile);
      if (active && active.grades) return active;
    }
    return null;
  }

  function gradeMapOf(profile) {
    return (profile && profile.grades) || GRADE_MAP;
  }

  function gradeValue(grade, profile) {
    var map = gradeMapOf(profile);
    if (Object.prototype.hasOwnProperty.call(map, grade)) return map[grade];
    var num = parseFloat(grade);
    return isNaN(num) ? NaN : num;
  }

  /* "Tamamlanan kredi"ye sayılan en düşük not. Profil belirtmezse sıfırın üstündeki
     her not tamamlanmış sayılır (eski davranış). YTÜ'de eşik DC (1.5): FD (0.5) ve
     DD (1.0) alan ders tamamlanmış sayılmaz. */
  function isCompleted(gradeVal, profile) {
    var min = profile && profile.rules && profile.rules.completedMinGrade;
    return typeof min === 'number' ? gradeVal >= min : gradeVal > 0;
  }

  function courseCredit(course) {
    var cr = parseFloat(course.credit);
    return (isNaN(cr) || cr <= 0) ? null : cr;
  }

  function countsForGpa(status) {
    return status === 'taken' || status === 'repeated with';
  }

  function countsAsAttempt(status) {
    // 'withdrawed': eski yedek dosyalarında görülebilen alternatif yazım
    return status !== 'not taken' && status !== 'non credit' && status !== 'withdrawed';
  }

  function courseKey(name, course) {
    var trimmed = (name || '').trim().toLowerCase();
    return trimmed || ('__anon_' + course.id);
  }

  /* Zincirleme tekrarlar için takma-ad haritası: "B dersi A yerine alındı" ise
     alias[B] = A. Böylece A -> B -> C zinciri tek bir derse indirgenir
     (ör. ESC 301 yerine PHIL417, onun da yerine PHIL314 alınmışsa üçü aynı gruptadır). */
  function buildAliasMap(semesters, endIdx) {
    var alias = new Map();
    for (var i = 0; i <= endIdx && i < semesters.length; i++) {
      semesters[i].courses.forEach(function (course) {
        if (course.status !== 'repeated with') return;
        var from = (course.lesson || '').trim().toLowerCase();
        var to = (course.repeatedLesson || '').trim().toLowerCase();
        if (from && to && from !== to && !alias.has(from)) alias.set(from, to);
      });
    }
    return alias;
  }

  /* Tekrar kuralı için dersin grup anahtarı: repeated-with derste hedef dersin adı,
     diğerlerinde dersin kendi adı — ardından takma-ad zinciri kökene kadar izlenir.
     Adsız dersler tekil sayılır (gruplanmaz). */
  function effectiveKey(course, alias) {
    var name = (course.status === 'repeated with'
      ? (course.repeatedLesson || course.lesson)
      : course.lesson) || '';
    var key = courseKey(name, course);

    // Zinciri kökene kadar izle; hatalı veride döngü oluşmasına karşı korumalı
    var seen = new Set([key]);
    while (alias && alias.has(key)) {
      var next = alias.get(key);
      if (seen.has(next)) break;
      seen.add(next);
      key = next;
    }
    return key;
  }

  /* [0..endIdx] dönem aralığı için tekrar kuralı uygulanmış kümülatif değerler */
  function cumulative(semesters, endIdx, profile) {
    var excluded = (profile && profile.rules && profile.rules.excludeFromCumulative) || [];
    var alias = buildAliasMap(semesters, endIdx);
    var groups = new Map();
    for (var i = 0; i <= endIdx && i < semesters.length; i++) {
      semesters[i].courses.forEach(function (course) {
        if (courseCredit(course) === null) return;
        var key = effectiveKey(course, alias);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ course: course, semIdx: i });
      });
    }

    var points = 0, credits = 0, attempted = 0, completed = 0;
    groups.forEach(function (attempts) {
      // GPA'yı yalnızca SONUÇLANMIŞ denemeler belirler: geçerli (sayısal) notu olan
      // taken/repeated-with denemeleri. Devam eden (notsuz) veya çekilen (W) bir
      // tekrar, önceki notu SİLMEZ — resmi transkript davranışıyla birebir aynı.
      var concluded = attempts.filter(function (a) {
        return countsForGpa(a.course.status) && !isNaN(gradeValue(a.course.grade, profile));
      });
      if (concluded.length > 0) {
        var latest = concluded[0];
        concluded.forEach(function (a) {
          if (a.semIdx > latest.semIdx) latest = a;
          else if (a.semIdx === latest.semIdx && a.course.status === 'repeated with') latest = a;
        });
        var c = latest.course;
        // Son notu profilde "kümülatif dışı" işaretliyse (YTÜ: F0) ders AGNO'ya hiç girmez
        if (excluded.indexOf(c.grade) === -1) {
          var cr = courseCredit(c);
          var g = gradeValue(c.grade, profile);
          points += g * cr;
          credits += cr;
          if (isCompleted(g, profile)) completed += cr;
        }
      }
      // Denenen kredi: dersin en son denemesinin durumuna göre
      // (devam eden dersler de denenmiş sayılır; çekilenler sayılmaz)
      var latestAny = attempts[0];
      attempts.forEach(function (a) {
        if (a.semIdx > latestAny.semIdx) latestAny = a;
      });
      if (countsAsAttempt(latestAny.course.status)) {
        attempted += courseCredit(latestAny.course);
      }
    });

    return {
      gpa: credits > 0 ? points / credits : 0,
      points: points,
      credits: credits,
      attempted: attempted,
      completed: completed
    };
  }

  /* Tüm dönemler için SPA + kümülatif istatistikler.
     semesters: [{ name, courses: [{ id, lesson, status, grade, credit, repeatedLesson }] }]
     profile:   üniversite profili (verilmezse aktif profil kullanılır) */
  function computeAll(semesters, profile) {
    profile = resolveProfile(profile);

    var perSemester = semesters.map(function (sem, idx) {
      var points = 0, credits = 0, attempted = 0, completed = 0;
      sem.courses.forEach(function (course) {
        var cr = courseCredit(course);
        if (cr === null) return;
        var g = gradeValue(course.grade, profile);
        if (countsAsAttempt(course.status)) attempted += cr;
        if (countsForGpa(course.status) && !isNaN(g)) {
          points += g * cr;
          credits += cr;
          if (isCompleted(g, profile)) completed += cr;
        }
      });
      var running = cumulative(semesters, idx, profile);
      return {
        spa: credits > 0 ? points / credits : 0,
        semesterCredits: credits,
        semesterAttempted: attempted,
        semesterCompleted: completed,
        runningGpa: running.gpa,
        overallAttempted: running.attempted,
        overallCompleted: running.completed
      };
    });

    var overall = semesters.length
      ? cumulative(semesters, semesters.length - 1, profile)
      : { gpa: 0, points: 0, credits: 0, attempted: 0, completed: 0 };

    /* Sonradan tekrar edilen derslerin adları (satır renklendirme: "etkisiz" dersler) */
    var repeatedTargets = new Set();
    semesters.forEach(function (sem) {
      sem.courses.forEach(function (course) {
        if (course.status === 'repeated with' && course.repeatedLesson) {
          repeatedTargets.add(course.repeatedLesson.trim().toLowerCase());
        }
      });
    });

    return {
      perSemester: perSemester,
      overall: overall,
      repeatedTargets: repeatedTargets,
      profile: profile
    };
  }

  global.GPACalc = {
    GRADE_MAP: GRADE_MAP,          // Boğaziçi varsayılanı (geriye dönük uyumluluk)
    gradeMapOf: gradeMapOf,
    gradeValue: gradeValue,
    computeAll: computeAll
  };
})(typeof window !== 'undefined' ? window : globalThis);
