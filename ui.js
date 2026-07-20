/*
 * GPAUI — ortak arayüz bileşenleri
 *  - GPAUI.toast(mesaj, tip?, süreMs?)        tip: 'info' | 'success' | 'error'
 *  - GPAUI.confirm({ title, message, confirmText, cancelText, danger }) -> Promise<boolean>
 * alert()/confirm() yerine kullanılır; stiller base.css içindedir.
 */
(function (global) {
  'use strict';

  function ensureToastContainer() {
    var container = document.getElementById('gpa-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gpa-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function toast(message, type, duration) {
    var container = ensureToastContainer();
    var item = document.createElement('div');
    item.className = 'gpa-toast' + (type && type !== 'info' ? ' ' + type : '');
    item.textContent = message;
    container.appendChild(item);

    var show = function () { item.classList.add('show'); };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(show);
    else setTimeout(show, 0);

    setTimeout(function () {
      item.classList.remove('show');
      setTimeout(function () { item.remove(); }, 300);
    }, duration || 3200);
  }

  function confirmDialog(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'gpa-modal-overlay';

      var modal = document.createElement('div');
      modal.className = 'gpa-modal';

      var title = document.createElement('h3');
      title.textContent = opts.title || 'Emin misiniz?';
      modal.appendChild(title);

      if (opts.message) {
        var message = document.createElement('p');
        message.textContent = opts.message;
        modal.appendChild(message);
      }

      var actions = document.createElement('div');
      actions.className = 'gpa-modal-actions';

      var cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = opts.cancelText || 'Vazgeç';

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'modal-confirm' + (opts.danger ? ' danger' : '');
      confirmBtn.textContent = opts.confirmText || 'Evet';

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      function close(result) {
        document.removeEventListener('keydown', onKey);
        overlay.classList.remove('show');
        setTimeout(function () { overlay.remove(); }, 200);
        resolve(result);
      }

      function onKey(e) {
        if (e.key === 'Escape') close(false);
      }

      cancelBtn.addEventListener('click', function () { close(false); });
      confirmBtn.addEventListener('click', function () { close(true); });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close(false);
      });
      document.addEventListener('keydown', onKey);

      var show = function () { overlay.classList.add('show'); };
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(show);
      else setTimeout(show, 0);
      confirmBtn.focus();
    });
  }

  global.GPAUI = { toast: toast, confirm: confirmDialog };
})(window);
