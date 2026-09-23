/*
 * GPACalc — not ortalaması hesaplama modülü (saf fonksiyonlar, DOM'a dokunmaz)
 *
 * Kurallar (Boğaziçi):
 *  - SPA: yalnızca o dönemdeki 'taken' / 'repeated with' dersler.
 *  - Kümülatif GPA: bir ders birden çok kez alındıysa yalnızca EN SON alınışı sayılır
 *    ('repeated with' derslerde hedef ders repeatedLesson ile eşleştirilir).
 *  - 'not taken' (çekilen) ve 'non credit' dersler ortalamaya ve denenen krediye girmez.
 *  - Tamamlanan kredi: FF (0.00) üstü not alınan derslerin kredisi.
 */
(function (global) {
  'use strict';

  var GRADE_MAP = { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0 };

  function gradeValue(grade) {
    if (Object.prototype.hasOwnProperty.call(GRADE_MAP, grade)) return GRADE_MAP[grade];
    var num = parseFloat(grade);
    return isNaN(num) ? NaN : num;
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

  /* [0..endIdx] dönem aralığındaki kredili denemeleri tekrar grubuna göre toplar */
  function groupAttempts(semesters, endIdx) {
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
    return groups;
  }

  /* Bir grubun GPA'ya sayılan denemesi (yoksa null).
     GPA'yı yalnızca SONUÇLANMIŞ denemeler belirler: geçerli (sayısal) notu olan
     taken/repeated-with denemeleri. Devam eden (notsuz) veya çekilen (W) bir
     tekrar, önceki notu SİLMEZ — resmi transkript davranışıyla birebir aynı. */
  function countedAttempt(attempts) {
    var concluded = attempts.filter(function (a) {
      return countsForGpa(a.course.status) && !isNaN(gradeValue(a.course.grade));
    });
    if (!concluded.length) return null;
    var latest = concluded[0];
    concluded.forEach(function (a) {
      if (a.semIdx > latest.semIdx) latest = a;
      else if (a.semIdx === latest.semIdx && a.course.status === 'repeated with') latest = a;
    });
    return latest;
  }

  /* [0..endIdx] dönem aralığı için tekrar kuralı uygulanmış kümülatif değerler */
  function cumulative(semesters, endIdx) {
    var groups = groupAttempts(semesters, endIdx);

    var points = 0, credits = 0, attempted = 0, completed = 0;
    groups.forEach(function (attempts) {
      var latest = countedAttempt(attempts);
      if (latest) {
        var c = latest.course;
        var cr = courseCredit(c);
        var g = gradeValue(c.grade);
        points += g * cr;
        credits += cr;
        if (g > 0) completed += cr;
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
     semesters: [{ name, courses: [{ id, lesson, status, grade, credit, repeatedLesson }] }] */
  function computeAll(semesters) {
    var perSemester = semesters.map(function (sem, idx) {
      var points = 0, credits = 0, attempted = 0, completed = 0;
      sem.courses.forEach(function (course) {
        var cr = courseCredit(course);
        if (cr === null) return;
        var g = gradeValue(course.grade);
        if (countsAsAttempt(course.status)) attempted += cr;
        if (countsForGpa(course.status) && !isNaN(g)) {
          points += g * cr;
          credits += cr;
          if (g > 0) completed += cr;
        }
      });
      var running = cumulative(semesters, idx);
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
      ? cumulative(semesters, semesters.length - 1)
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

    return { perSemester: perSemester, overall: overall, repeatedTargets: repeatedTargets };
  }

  /* Ders kodunun alan öneki: "MATH 101" / "math101" -> "MATH", "TK221" -> "TK".
     Harfle başlamayan adlar null döner (gruplanmaz). */
  function subjectOf(lesson) {
    var m = String(lesson || '').trim().toUpperCase().match(/^[A-ZÇĞİÖŞÜ]+/);
    return m ? m[0] : null;
  }

  /* Ders alanlarına göre performans: kümülatif GPA'ya sayılan denemeler
     (tekrar kuralı uygulanmış) ders kodunun önekine göre gruplanır. Tüm
     alanların puan/kredi toplamı, önekli dersler için GPA ile birebir tutar.
     Dönüş: [{ subject, gpa, points, credits, courses: [{ lesson, grade, credit, value }] }]
     — krediye göre azalan sırada. */
  function bySubject(semesters) {
    var groups = groupAttempts(semesters, semesters.length - 1);
    var subjects = new Map();
    groups.forEach(function (attempts) {
      var latest = countedAttempt(attempts);
      if (!latest) return;
      var c = latest.course;
      var subject = subjectOf(c.lesson);
      if (!subject) return;
      var cr = courseCredit(c);
      var g = gradeValue(c.grade);
      if (!subjects.has(subject)) subjects.set(subject, { subject: subject, points: 0, credits: 0, courses: [] });
      var s = subjects.get(subject);
      s.points += g * cr;
      s.credits += cr;
      s.courses.push({ lesson: String(c.lesson).trim(), grade: c.grade, credit: cr, value: g });
    });
    var list = Array.from(subjects.values());
    list.forEach(function (s) {
      s.gpa = s.credits > 0 ? s.points / s.credits : 0;
      s.courses.sort(function (a, b) { return a.lesson.localeCompare(b.lesson, 'en', { numeric: true }); });
    });
    list.sort(function (a, b) { return b.credits - a.credits || a.subject.localeCompare(b.subject); });
    return list;
  }

  global.GPACalc = {
    GRADE_MAP: GRADE_MAP,
    gradeValue: gradeValue,
    computeAll: computeAll,
    subjectOf: subjectOf,
    bySubject: bySubject
  };
})(typeof window !== 'undefined' ? window : globalThis);
