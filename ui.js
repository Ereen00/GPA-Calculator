/*
 * GPAUI — ortak arayüz bileşenleri
 *  - GPAUI.toast(mesaj, tip?, süreMs?)        tip: 'info' | 'success' | 'error'
 *  - GPAUI.confirm({ title, message, confirmText, cancelText, danger }) -> Promise<boolean>
 *  - GPAUI.theme.current() / .apply('dark'|'light') / .toggle()
 *    Tema değişince window üzerinde 'gpa:themechange' olayı yayınlanır.
 * alert()/confirm() yerine kullanılır; stiller base.css içindedir.
 */
(function (global) {
  'use strict';

  /* ---------- Tema ---------- */
  var THEME_KEY = 'gpa-planner:theme';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  var ICON_SUN = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  var ICON_MOON = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"></path></svg>';

  function syncThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var dark = currentTheme() === 'dark';
    btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    var label = dark
      ? (window.GPAI18N ? { tr: 'Aydınlık temaya geç', en: 'Switch to light theme' }[GPAI18N.lang()] : 'Aydınlık temaya geç')
      : (window.GPAI18N ? { tr: 'Karanlık temaya geç', en: 'Switch to dark theme' }[GPAI18N.lang()] : 'Karanlık temaya geç');
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }

  function applyTheme(theme) {
    if (theme !== 'dark') theme = 'light';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* gizli modda kota olmayabilir */ }
    syncThemeToggle();
    var evt;
    try {
      evt = new CustomEvent('gpa:themechange', { detail: { theme: theme } });
    } catch (e) {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('gpa:themechange', false, false, { theme: theme });
    }
    global.dispatchEvent(evt);
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
    syncThemeToggle();
  }

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

  if (window.GPAI18N) GPAI18N.onChange(syncThemeToggle);

  /* ---------- Kaydırmayla belirme (scroll reveal) ----------
   * .reveal sınıflı öğeler görünür olduğunda .visible eklenir (base.css).
   * prefers-reduced-motion durumunda IntersectionObserver hiç kurulmaz;
   * öğeler CSS tarafında zaten görünür bırakılır. */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // IntersectionObserver yoksa animasyon kurulmaz; öğeler zaten görünür kalır.
    if (typeof IntersectionObserver === 'undefined') return;

    // Buradan itibaren gizle-belir devrede: <html>'e işaret sınıfı ekle.
    // (prefers-reduced-motion durumunda CSS öğeleri anında görünür yapar.)
    document.documentElement.classList.add('reveal-on');

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('visible'); }, (i % 4) * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });

    // Güvenlik ağı: 2 sn içinde herhangi bir nedenle tetiklenmeyen öğeler
    // (ör. sekme arka planda açıldı) yine de görünür yapılır.
    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains('visible')) el.classList.add('visible');
      });
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  /* ---------- Mobil gezinme menüsü ---------- */
  var ICON_MENU = '<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"></path></svg>';
  var ICON_CLOSE = '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg>';

  function initNavMenu() {
    var toggle = document.getElementById('nav-menu-toggle');
    var links = document.getElementById('primary-nav');
    if (!toggle || !links) return;
    toggle.innerHTML = ICON_MENU;

    function close() {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = ICON_MENU;
    }

    function open() {
      links.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.innerHTML = ICON_CLOSE;
    }

    toggle.addEventListener('click', function () {
      if (links.classList.contains('open')) close(); else open();
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.addEventListener('click', function (e) {
      if (!links.classList.contains('open')) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavMenu);
  } else {
    initNavMenu();
  }

  global.GPAUI = {
    toast: toast,
    confirm: confirmDialog,
    theme: { current: currentTheme, apply: applyTheme, toggle: toggleTheme }
  };
})(window);
