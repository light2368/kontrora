// ── Kontrora Auth – runs on every page ──
(function () {
  const SUPABASE_URL = 'https://swvpmoffserpatwxuxsl.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dnBtb2Zmc2VycGF0d3h1eHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDAwMDgsImV4cCI6MjA5MTc3NjAwOH0.rAiHFcYbRY_ZjCVHN67YXyOY9Zs7_B1bUkRrOSoVfIY';
  const APP_URL = 'https://app.kontrora.com/';
  const START_TRIAL_URL = APP_URL;

  if (!window._kontroraSb) {
    window._kontroraSb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  const sb = window._kontroraSb;
  const currentPath = window.location.pathname;

  sb.auth.getSession().then(({ data: { session } }) => { renderNav(session); });
  sb.auth.onAuthStateChange((_event, session) => { renderNav(session); });

  function renderNav(session) {
    const authSlot = document.getElementById('nav-actions-auth');
    const navActionsRoot = document.getElementById('nav-actions') || document.querySelector('.nav-actions');
    const navActions = authSlot || navActionsRoot;
    const mobileAuthSlot = document.getElementById('mobile-auth-slot');
    if (!navActions) return;

    function ensureStartTrialButton() {
      if (!navActionsRoot) return;
      // If any Start free trial exists already, do nothing.
      // Do not match Sign In (also APP_URL): trial CTAs use these classes.
      if (navActionsRoot.querySelector('.nav-download-btn, .nav-start-trial')) return;

      const trial = document.createElement('a');
      trial.href = START_TRIAL_URL;
      trial.className = 'btn btn-outline nav-start-trial';
      trial.textContent = 'Start free trial';

      // Insert left of auth controls if possible.
      if (authSlot && authSlot.parentNode === navActionsRoot) {
        navActionsRoot.insertBefore(trial, authSlot);
        return;
      }

      const signInBtn = navActionsRoot.querySelector('a.btn.btn-primary, a[href="/auth"], a[href="/auth/"], a[href="' + APP_URL + '"]');
      if (signInBtn && signInBtn.parentNode === navActionsRoot) {
        navActionsRoot.insertBefore(trial, signInBtn);
      } else {
        navActionsRoot.insertBefore(trial, navActionsRoot.firstChild);
      }
    }

    if (session) {
      const name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
      const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      navActions.innerHTML = `
        <div class="nav-user-menu" id="nav-user-menu">
          <button class="nav-user-btn" id="nav-user-btn" aria-haspopup="true" aria-expanded="false">
            <span class="nav-user-avatar">${initials}</span>
            <span class="nav-user-name">${name.split(' ')[0]}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-user-dropdown" id="nav-user-dropdown">
            <div class="nav-user-info">
              <span class="nav-user-fullname">${name}</span>
              <span class="nav-user-email">${session.user.email}</span>
            </div>
            <div class="nav-user-divider"></div>
            <a href="/profile" class="nav-user-profile-link">View Profile</a>
            <div class="nav-user-divider"></div>
            <button class="nav-user-signout" id="nav-signout-btn">Sign Out</button>
          </div>
        </div>
      `;
      const userMenu = document.getElementById('nav-user-menu');
      const userDropdown = document.getElementById('nav-user-dropdown');
      const userBtn = document.getElementById('nav-user-btn');
      let hideTimer = null;
      function openDropdown() { clearTimeout(hideTimer); userBtn.setAttribute('aria-expanded','true'); userDropdown.classList.add('open'); }
      function closeDropdown() { hideTimer = setTimeout(() => { userBtn.setAttribute('aria-expanded','false'); userDropdown.classList.remove('open'); }, 150); }
      userMenu.addEventListener('mouseenter', openDropdown);
      userMenu.addEventListener('mouseleave', closeDropdown);
      userDropdown.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      userDropdown.addEventListener('mouseleave', closeDropdown);
      document.getElementById('nav-signout-btn').addEventListener('click', async () => { await sb.auth.signOut(); window.location.reload(); });
      if (mobileAuthSlot) {
        mobileAuthSlot.innerHTML = `<button class="btn btn-outline" id="mobile-signout">Sign Out</button>`;
        document.getElementById('mobile-signout').addEventListener('click', async () => { await sb.auth.signOut(); window.location.reload(); });
      }
    } else {
      // Logged out: show Sign In, and add Start free trial only if navbar doesn't already have one.
      if (authSlot) {
        authSlot.innerHTML = `<a href="${APP_URL}" class="btn btn-primary">Sign In</a>`;
      } else if (navActionsRoot) {
        navActionsRoot.innerHTML = `<a href="${APP_URL}" class="btn btn-primary">Sign In</a>`;
      }

      ensureStartTrialButton();

      if (mobileAuthSlot) {
        mobileAuthSlot.innerHTML = `<a href="${APP_URL}" class="btn btn-primary">Sign In</a>`;
      }
    }

    // Auto-detect language from IP on first visit, then inject nav controls
    autoDetectLang().then(function() {
      injectSearchAndLang(navActions);
    });
  }

  // ── Language Switcher ──
  const LANGS = [
    { code: 'en', label: 'English',  flag: 'US' },
    { code: 'es', label: 'Español',  flag: 'ES' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'zh', label: '中文',      flag: 'CN' },
    { code: 'ru', label: 'Русский',  flag: 'RU' },
    { code: 'de', label: 'Deutsch',  flag: 'DE' },
  ];

  function getCurrentLang() {
    return localStorage.getItem('kontrora_lang') || 'en';
  }

  // ── Country → language map ──
  const COUNTRY_LANG_MAP = {
    // Spanish
    ES:'es', MX:'es', AR:'es', CO:'es', CL:'es', PE:'es', VE:'es',
    EC:'es', GT:'es', CU:'es', BO:'es', DO:'es', HN:'es', PY:'es',
    SV:'es', NI:'es', CR:'es', PA:'es', UY:'es', GQ:'es',
    // French
    FR:'fr', BE:'fr', CH:'fr', CA:'fr', SN:'fr', CI:'fr', CM:'fr',
    MG:'fr', BF:'fr', ML:'fr', NE:'fr', GN:'fr', TG:'fr', BJ:'fr',
    CD:'fr', CG:'fr', GA:'fr', RW:'fr', BI:'fr', DJ:'fr', KM:'fr',
    // Chinese
    CN:'zh', TW:'zh', HK:'zh', MO:'zh', SG:'zh',
    // Russian
    RU:'ru', BY:'ru', KZ:'ru', KG:'ru', TJ:'ru', UZ:'ru', AM:'ru',
    AZ:'ru', GE:'ru', MD:'ru', UA:'ru',
    // German
    DE:'de', AT:'de', LI:'de', LU:'de',
  };

  // ── Auto-detect language from IP on first visit ──
  function autoDetectLang() {
    // Only run if user hasn't manually chosen a language
    if (localStorage.getItem('kontrora_lang')) return Promise.resolve();

    return fetch('https://ipapi.co/json/', { cache: 'force-cache' })
      .then(r => r.json())
      .then(data => {
        const country = (data && data.country_code) ? data.country_code.toUpperCase() : '';
        const detectedLang = COUNTRY_LANG_MAP[country] || 'en';
        if (detectedLang !== 'en') {
          localStorage.setItem('kontrora_lang', detectedLang);
        }
      })
      .catch(() => { /* silently fail — default to English */ });
  }

  function injectSearchAndLang() {
    if (document.getElementById('nav-search-btn')) return; // already injected

    const navActions = document.getElementById('nav-actions-auth') || document.getElementById('nav-actions');
    if (!navActions) return;

    const currentLang = getCurrentLang();
    const langObj = LANGS.find(l => l.code === currentLang) || LANGS[0];

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    wrapper.innerHTML = `
      <!-- Language switcher -->
      <div class="nav-lang-menu notranslate" id="nav-lang-menu" translate="no">
        <button class="nav-lang-btn" id="nav-lang-btn">
          <span class="nav-lang-flag">${langObj.flag}</span>
          ${langObj.flag.toUpperCase() === langObj.code.toUpperCase() ? '' : `<span>${langObj.code.toUpperCase()}</span>`}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-lang-dropdown notranslate" id="nav-lang-dropdown" translate="no">
          ${LANGS.map(l => `
            <button class="nav-lang-option ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}">
              <span class="nav-lang-flag">${l.flag}</span><span>${l.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <!-- Search button -->
      <button class="nav-search-btn" id="nav-search-btn" aria-label="Search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    `;

    // Order: Lang → Search → Divider → Download → Sign In
    const topNavActions = document.getElementById('nav-actions')
      || document.querySelector('.nav-actions')
      || navActions;
    const downloadWrap = topNavActions.querySelector('.nav-download-wrap');

    // Add divider if not already present
    if (!topNavActions.querySelector('.nav-actions-divider')) {
      const divider = document.createElement('div');
      divider.className = 'nav-actions-divider';
      if (downloadWrap) {
        topNavActions.insertBefore(divider, downloadWrap);
        topNavActions.insertBefore(wrapper, divider);
      } else {
        topNavActions.insertBefore(wrapper, topNavActions.firstChild);
        wrapper.insertAdjacentElement('afterend', divider);
      }
    } else if (downloadWrap) {
      topNavActions.insertBefore(wrapper, downloadWrap);
    } else {
      topNavActions.insertBefore(wrapper, topNavActions.firstChild);
    }

    // Lang dropdown hover
    const langMenu = document.getElementById('nav-lang-menu');
    const langDropdown = document.getElementById('nav-lang-dropdown');
    let langTimer = null;
    langMenu.addEventListener('mouseenter', () => { clearTimeout(langTimer); langDropdown.classList.add('open'); });
    langMenu.addEventListener('mouseleave', () => { langTimer = setTimeout(() => langDropdown.classList.remove('open'), 150); });
    langDropdown.addEventListener('mouseenter', () => clearTimeout(langTimer));
    langDropdown.addEventListener('mouseleave', () => { langTimer = setTimeout(() => langDropdown.classList.remove('open'), 150); });

    // Lang selection
    langDropdown.querySelectorAll('.nav-lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.lang;
        localStorage.setItem('kontrora_lang', code);
        const selected = LANGS.find(l => l.code === code);
        document.getElementById('nav-lang-btn').innerHTML = `
          <span class="nav-lang-flag">${selected.flag}</span>
          ${selected.flag.toUpperCase() === selected.code.toUpperCase() ? '' : `<span>${selected.code.toUpperCase()}</span>`}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        `;
        langDropdown.querySelectorAll('.nav-lang-option').forEach(b => b.classList.toggle('active', b.dataset.lang === code));
        langDropdown.classList.remove('open');
        // For English, reload the page to restore original content
        if (code === 'en') {
          window.location.reload();
        } else {
          applyGoogleTranslate(code);
        }
      });
    });

    // Apply saved lang on load
    if (currentLang !== 'en') applyGoogleTranslate(currentLang);

    // Search
    document.getElementById('nav-search-btn').addEventListener('click', openSearch);
    buildSearchOverlay();
  }

  // ── Google Translate integration ──
  function applyGoogleTranslate(langCode) {
    const gtCode = { en: 'en', es: 'es', fr: 'fr', zh: 'zh-CN', ru: 'ru', de: 'de' }[langCode] || 'en';

    // Show loading spinner on lang button
    function showLangLoading() {
      const btn = document.getElementById('nav-lang-btn');
      if (btn) btn.setAttribute('data-loading', 'true');
    }
    function hideLangLoading() {
      const btn = document.getElementById('nav-lang-btn');
      if (btn) btn.removeAttribute('data-loading');
    }

    function suppressToolbar() {
      // Hide the Google Translate iframe/widget that appears top-left
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) banner.style.display = 'none';
      document.body.style.top = '0px';
      const tt = document.getElementById('goog-gt-tt');
      if (tt) tt.remove();
      // Hide the floating Google Translate widget
      const gadget = document.querySelector('.goog-te-gadget');
      if (gadget) gadget.style.display = 'none';
      // Hide any skiptranslate iframes
      document.querySelectorAll('iframe.skiptranslate, .skiptranslate').forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
      });
      // Reset body top offset Google Translate adds
      document.body.style.top = '0px';
      document.documentElement.style.top = '0px';
    }

    const obs = new MutationObserver(suppressToolbar);
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    function doTranslate() {
      // If switching back to English, restore original
      if (gtCode === 'en') {
        const restore = document.querySelector('.goog-te-menu-value span');
        if (restore) restore.click();
        // Try the combo select
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
        // Use Google Translate's restore function if available
        if (window.google && window.google.translate) {
          const el = document.querySelector('.goog-te-gadget');
          if (el) {
            const iframe = document.querySelector('.goog-te-banner-frame');
            if (iframe) {
              const iDoc = iframe.contentDocument || iframe.contentWindow.document;
              const restoreBtn = iDoc.querySelector('.goog-close-link');
              if (restoreBtn) restoreBtn.click();
            }
          }
        }
        setTimeout(suppressToolbar, 300);
        hideLangLoading();
        return;
      }

      showLangLoading();
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = gtCode;
        select.dispatchEvent(new Event('change'));
        setTimeout(() => { suppressToolbar(); hideLangLoading(); }, 600);
      }
    }

    if (window.google && window.google.translate) {
      doTranslate();
      return;
    }

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'es,fr,zh-CN,ru,de', autoDisplay: false },
          'google_translate_element'
        );
        suppressToolbar();
        setTimeout(() => { doTranslate(); suppressToolbar(); }, 400);
      };
      const el = document.createElement('div');
      el.id = 'google_translate_element';
      el.style.display = 'none';
      document.body.appendChild(el);
      const s = document.createElement('script');
      s.id = 'google-translate-script';
      s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(s);
    } else {
      // Script already loaded, just translate
      setTimeout(doTranslate, 100);
    }
  }

  // ── Search overlay ──
  function buildSearchOverlay() {
    if (document.getElementById('search-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-box">
        <div class="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" id="search-input" placeholder="Search Kontrora..." autocomplete="off" spellcheck="false" />
          <button class="search-close" id="search-close">ESC</button>
        </div>
        <div class="search-results" id="search-results">
          <div class="search-empty">Start typing to search...</div>
        </div>
        <div class="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
    document.getElementById('search-close').addEventListener('click', closeSearch);
    document.getElementById('search-input').addEventListener('input', e => runSearch(e.target.value));
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') closeSearch();
    });
  }

  function openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    setTimeout(() => document.getElementById('search-input')?.focus(), 50);
  }

  function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  function runSearch(query) {
    const results = document.getElementById('search-results');
    if (!results) return;
    const q = query.trim().toLowerCase();

    if (!q) {
      results.innerHTML = '<div class="search-empty">Start typing to search...</div>';
      return;
    }

    const index = window.KONTRORA_SEARCH_INDEX || [];
    const matches = index.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!matches.length) {
      results.innerHTML = `<div class="search-empty">No results for "<strong>${query}</strong>"</div>`;
      return;
    }

    function highlight(text, q) {
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
      return text.replace(re, '<mark>$1</mark>');
    }

    results.innerHTML = matches.map(item => `
      <a class="search-result-item" href="${item.url}">
        <div class="search-result-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          <div class="search-result-title">${highlight(item.title, q)}</div>
          <div class="search-result-snippet">${highlight(item.snippet.slice(0, 100) + '...', q)}</div>
        </div>
      </a>
    `).join('');

    // Close on result click
    results.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', closeSearch);
    });
  }
})();
