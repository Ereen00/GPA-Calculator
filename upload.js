/*
 * PDF Dönüştürücü sayfası mantığı
 * Akış: PDF seç/sürükle -> metin çıkar (pdf.js) -> ayrıştır (parser.js, tamamen tarayıcıda) ->
 *       localStorage'a kaydet (GPAStorage) -> Planlayıcı/İstatistik bağlantıları.
 * Dosya cihazdan hiç çıkmaz; sunucu yoktur. Dönüştürme dosya seçilir seçilmez otomatik başlar.
 */
(function () {
  'use strict';

  function t(key) { return window.GPAI18N ? GPAI18N.t(key) : key; }

  var PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  var ARROW_RIGHT = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';

  var fileInput = document.getElementById('file-input');
  var dropLabel = document.getElementById('drop-area');
  var fileLabelText = document.getElementById('file-label-text');
  var statusDiv = document.getElementById('status-message');
  var resultDiv = document.getElementById('result-actions');

  var lastResult = null; // isteğe bağlı yedek indirme için son başarılı sonuç
  var busy = false;

  // ---------- Durum kutusu ----------
  function setStatus(type, text) {
    statusDiv.innerHTML = '';
    if (!text) return;
    var box = document.createElement('div');
    box.className = 'status-box status-' + type;
    box.textContent = text;
    statusDiv.appendChild(box);
  }

  function clearResults() {
    resultDiv.innerHTML = '';
  }

  function showSuccess(data) {
    setStatus('success', t('upload.status.success')
      .replace('{n}', data.cards.length)
      .replace('{m}', data.semesters.length));

    clearResults();
    var row = document.createElement('div');
    row.className = 'action-row';

    var openPlanner = document.createElement('a');
    openPlanner.href = 'planner.html';
    openPlanner.className = 'btn-action';
    openPlanner.innerHTML = '<span>' + t('upload.action.openPlanner') + '</span>' + ARROW_RIGHT;
    row.appendChild(openPlanner);

    var openStats = document.createElement('a');
    openStats.href = 'statistics.html';
    openStats.className = 'btn-action secondary';
    openStats.textContent = t('upload.action.openStats');
    row.appendChild(openStats);

    resultDiv.appendChild(row);

    var backupBtn = document.createElement('button');
    backupBtn.type = 'button';
    backupBtn.className = 'backup-link';
    backupBtn.textContent = t('upload.action.backup');
    backupBtn.addEventListener('click', function () {
      if (lastResult && GPAStorage.exportDownload(lastResult)) {
        GPAUI.toast(t('upload.toast.backup'), 'success');
      }
    });
    resultDiv.appendChild(backupBtn);
  }

  // ---------- PDF metin çıkarma ----------
  function extractPdfText(file) {
    return new Promise(function (resolve, reject) {
      if (typeof pdfjsLib === 'undefined') {
        reject(new Error(t('upload.libNotLoaded')));
        return;
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

      var reader = new FileReader();
      reader.onerror = function () { reject(new Error(t('upload.fileReadError'))); };
      reader.onload = function () {
        pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise
          .then(async function (pdf) {
            var extracted = '';
            for (var i = 1; i <= pdf.numPages; i++) {
              var page = await pdf.getPage(i);
              var content = await page.getTextContent();
              extracted += '\n--- Sayfa ' + i + ' ---\n' +
                content.items.map(function (item) { return item.str; }).join(' ') + '\n';
            }
            resolve(extracted);
          })
          .catch(reject);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // ---------- Dönüştürme ve kaydetme (tamamen tarayıcıda) ----------
  async function convertAndStore(text) {
    setStatus('loading', t('upload.status.parsing'));

    var data = GPAParser.parse(text);
    if (!window.GPAStorage || !GPAStorage.isValidData(data) || data.cards.length === 0) {
      throw new Error(t('upload.status.noCourses'));
    }

    // Mevcut plan varsa üzerine yazmadan önce onay al
    if (GPAStorage.hasData()) {
      var ok = await GPAUI.confirm({
        title: t('upload.confirm.overwriteTitle'),
        message: t('upload.confirm.overwriteMsg'),
        confirmText: t('upload.confirm.overwriteBtn'),
        cancelText: t('upload.confirm.cancelBtn'),
        danger: true
      });
      if (!ok) {
        setStatus('error', t('upload.status.cancelled'));
        return;
      }
    }

    lastResult = data;
    if (GPAStorage.save(data, 'pdf')) {
      showSuccess(data);
    } else {
      // localStorage kullanılamıyorsa (ör. gizli mod) yedek dosyası tek seçenek
      GPAStorage.exportDownload(data);
      setStatus('error', t('upload.status.saveFailed'));
    }
  }

  // ---------- Ana akış ----------
  async function handleFile(file) {
    if (!file || busy) return;

    var isPdf = (file.type === 'application/pdf') || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      GPAUI.toast(t('upload.toast.notPdf'), 'error');
      return;
    }

    busy = true;
    clearResults();
    fileLabelText.textContent = t('upload.selectedFile').replace('{name}', file.name);
    dropLabel.classList.add('has-file');

    try {
      setStatus('loading', t('upload.status.reading'));
      var text;
      try {
        text = await extractPdfText(file);
      } catch (readErr) {
        console.error(readErr);
        setStatus('error', t('upload.status.readError'));
        return;
      }
      await convertAndStore(text);
    } catch (err) {
      setStatus('error', err.message);
    } finally {
      busy = false;
    }
  }

  // ---------- Olaylar: dosya seçimi + sürükle-bırak ----------
  fileInput.addEventListener('change', function () {
    handleFile(fileInput.files[0]);
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach(function (evName) {
    dropLabel.addEventListener(evName, function (e) {
      e.preventDefault();
      dropLabel.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(function (evName) {
    dropLabel.addEventListener(evName, function (e) {
      e.preventDefault();
      dropLabel.classList.remove('dragover');
    });
  });

  dropLabel.addEventListener('drop', function (e) {
    var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  });
})();
