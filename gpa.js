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
    return status !== 'not taken' && status !== 'non credit';
  }

  /* Tekrar kuralı için dersin grup anahtarı: repeated-with derste hedef dersin adı,
     diğerlerinde dersin kendi adı. Adsız dersler tekil sayılır (gruplanmaz). */
  function effectiveKey(course) {
    var name = (course.status === 'repeated with'
      ? (course.repeatedLesson || course.lesson)
      : course.lesson) || '';
    var trimmed = name.trim().toLowerCase();
    return trimmed || ('__anon_' + course.id);
  }

  /* [0..endIdx] dönem aralığı için tekrar kuralı uygulanmış kümülatif değerler */
  function cumulative(semesters, endIdx) {
    var groups = new Map();
    for (var i = 0; i <= endIdx && i < semesters.length; i++) {
      semesters[i].courses.forEach(function (course) {
        if (courseCredit(course) === null) return;
        var key = effectiveKey(course);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ course: course, semIdx: i });
      });
    }

    var points = 0, credits = 0, attempted = 0, completed = 0;
    groups.forEach(function (attempts) {
      var latest = attempts[0];
      attempts.forEach(function (a) {
        if (a.semIdx > latest.semIdx) latest = a;
        else if (a.semIdx === latest.semIdx && a.course.status === 'repeated with') latest = a;
      });
      var c = latest.course;
      var cr = courseCredit(c);
      var g = gradeValue(c.grade);
      if (countsAsAttempt(c.status)) attempted += cr;
      if (countsForGpa(c.status) && !isNaN(g)) {
        points += g * cr;
        credits += cr;
        if (g > 0) completed += cr;
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

  global.GPACalc = {
    GRADE_MAP: GRADE_MAP,
    gradeValue: gradeValue,
    computeAll: computeAll
  };
})(typeof window !== 'undefined' ? window : globalThis);
