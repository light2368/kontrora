// ── Enable JS-driven motion ──
document.documentElement.classList.add('js');

// ── Nav scroll effect ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });
// Set initial state
if (window.scrollY > 40) nav.classList.add('scrolled');

// ── Mobile menu ──
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ── Active nav link ──
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (currentPath === href || currentPath.startsWith(href + '/') && href !== '/')) {
    link.classList.add('active');
  }
  if (currentPath === '/' && href === '/') link.classList.add('active');
});

// ── Live Demo nav link (inject if missing) ──
(function () {
  var DEMO_URL = 'https://demo.kontrora.com/';

  // Desktop nav
  var navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="' + DEMO_URL + '"]')) {
    var li = document.createElement('li');
    li.innerHTML = '<a href="' + DEMO_URL + '" target="_blank" rel="noopener">Live Demo</a>';

    // Insert after Roadmap if present, otherwise before the dropdown.
    var roadmapAnchor = navLinks.querySelector('a[href="/roadmap"]');
    var roadmapLi = roadmapAnchor ? roadmapAnchor.closest('li') : null;
    if (roadmapLi && roadmapLi.parentNode === navLinks) {
      roadmapLi.insertAdjacentElement('afterend', li);
    } else {
      var dropdownLi = navLinks.querySelector('.nav-dropdown');
      if (dropdownLi && dropdownLi.parentNode === navLinks) {
        navLinks.insertBefore(li, dropdownLi);
      } else {
        navLinks.appendChild(li);
      }
    }
  }

  // Mobile menu
  var mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.querySelector('a[href="' + DEMO_URL + '"]')) {
    var a = document.createElement('a');
    a.href = DEMO_URL;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Live Demo';

    // Insert after Roadmap if present; otherwise append near end.
    var roadmapA = mobileMenu.querySelector('a[href="/roadmap"]');
    if (roadmapA && roadmapA.parentNode === mobileMenu) {
      roadmapA.insertAdjacentElement('afterend', a);
    } else {
      mobileMenu.appendChild(a);
    }
  }
})();

// ── Scroll animations ──
const revealSelectors = '.fade-up, .reveal, .reveal-left, .reveal-right';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = parent ? [...parent.querySelectorAll(revealSelectors)] : [];
      const index = siblings.indexOf(entry.target);
      const delay = reducedMotion ? 0 : (index >= 0 ? index * 80 : 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

if (reducedMotion) {
  document.querySelectorAll(revealSelectors).forEach(el => el.classList.add('visible'));
} else {
  document.querySelectorAll(revealSelectors).forEach(el => observer.observe(el));
}

// ── Hero parallax on scroll ──
(function () {
  if (reducedMotion) return;
  var heroBg = document.querySelector('.hero-video-bg img, .hero-video-bg video');
  if (!heroBg) return;
  window.addEventListener('scroll', function () {
    var y = Math.min(window.scrollY * 0.18, 120);
    heroBg.style.transform = 'scale(1.05) translateY(' + y + 'px)';
  }, { passive: true });
})();

// ── Counter animation ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── All Download Dropdowns ──
(function () {
  var START_TRIAL_URL = 'https://app.kontrora.com/';

  // If any legacy "download" CTA exists, clicking should go to Start Free Trial.
  function wireStartTrialClick(selector) {
    var el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener('click', function (e) {
      // If it's already an anchor to the right place, let the browser handle it.
      if (el.tagName === 'A') {
        var href = el.getAttribute('href') || '';
        if (href.indexOf(START_TRIAL_URL) === 0) return;
      }
      e.preventDefault();
      window.location.href = START_TRIAL_URL;
    });
  }

  wireStartTrialClick('.nav-download-btn');
  wireStartTrialClick('.cta-dl-btn');
  wireStartTrialClick('.hero-dl-btn');

  var pairs = [
    ['.nav-download-btn', '.nav-download-menu'],
    ['.hero-dl-btn',      '.hero-dl-menu'     ],
    ['.cta-dl-btn',       '.cta-dl-menu'      ]
  ];

  pairs.forEach(function (pair) {
    var btn  = document.querySelector(pair[0]);
    var menu = document.querySelector(pair[1]);
    if (!btn || !menu) return;

    // Teleport menu to body — escapes all overflow/stacking contexts
    document.body.appendChild(menu);

    var hideTimer = null;

    function show() {
      clearTimeout(hideTimer);
      // Position
      var r = btn.getBoundingClientRect();
      var mw = 240;
      var left = r.left + r.width / 2 - mw / 2;
      if (left < 8) left = 8;
      if (left + mw > window.innerWidth - 8) left = window.innerWidth - mw - 8;
      menu.style.top  = (r.bottom + 8) + 'px';
      menu.style.left = left + 'px';
      menu.style.display = 'flex';
    }

    function hide() {
      hideTimer = setTimeout(function () {
        menu.style.display = 'none';
      }, 150);
    }

    btn.addEventListener('mouseenter', show);
    btn.addEventListener('mouseleave', hide);
    menu.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    menu.addEventListener('mouseleave', hide);

    // Close immediately on scroll
    window.addEventListener('scroll', function () {
      clearTimeout(hideTimer);
      menu.style.display = 'none';
    }, { passive: true });
  });
})();


// ── Magnetic buttons ──
document.querySelectorAll('.btn-primary, .btn-hero-solid, .btn-hero-outline').forEach(btn => {
  btn.addEventListener('mousemove', function (e) {
    const r = this.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    this.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});

// ── Tilt cards ──
document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .download-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const r = this.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    this.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    this.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
    this.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
  });
});

// ── Cursor glow ──
(function () {
  var glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = 'position:fixed;width:400px;height:400px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(237,232,224,0.04) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.3s ease;opacity:0;';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', function () {
    glow.style.opacity = '0';
  });
})();

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Hero copy stays visible on first paint (no delayed opacity reveal).

// ── Scroll progress bar ──
(function () {
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();

// ── Particle canvas on hero ──
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35;';
  hero.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var W, H;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (var i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.6 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,194,168,' + p.o + ')';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Section label typing effect (disabled — emptied labels never re-trigger IO) ──
// Labels render as static editorial text.

// ── Shimmer sweep: plays on enter, gone when paused ──
(function () {
  var shimmerCards = document.querySelectorAll(
    '.feature-card, .testimonial-card, .hosting-card, ' +
    '.perk-card, .job-card, .group-card, .priority-card, .mini-card'
  );

  shimmerCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      // Reset position instantly (no transition), then trigger sweep
      card.classList.remove('shimmer-play');
      // Force reflow so the reset takes effect before re-adding
      void card.offsetWidth;
      card.classList.add('shimmer-play');
    });

    card.addEventListener('mouseleave', function () {
      // Remove class after sweep finishes so it resets off-screen
      setTimeout(function () {
        card.classList.remove('shimmer-play');
      }, 620); // slightly longer than the 0.6s transition
    });
  });
})();

// ── Load search index ──
(function () {
  const s = document.createElement('script');
  s.src = '/js/search-index.js';
  document.head.appendChild(s);
})();

// ── End of main.js ──

// ── Cookie Consent Banner ──
(function () {
  if (localStorage.getItem('cookie_consent')) return;

  if (!document.getElementById('cookie-banner-styles')) {
    const style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent = `
      .cookie-banner {
        background: #FFFFFF !important;
        border-top: 1px solid rgba(5, 5, 5, 0.12) !important;
      }
      .cookie-banner-text { color: #5C5852 !important; }
      .cookie-banner-text a { color: #050505 !important; }
      .cookie-banner-text a:hover { color: #3D3A36 !important; }
      .cookie-btn-manage,
      .cookie-btn-decline {
        background: transparent !important;
        color: #3D3A36 !important;
        border: 1px solid rgba(5, 5, 5, 0.28) !important;
      }
      .cookie-btn-manage:hover,
      .cookie-btn-decline:hover {
        background: rgba(5, 5, 5, 0.06) !important;
        color: #050505 !important;
      }
      .cookie-btn-accept {
        background: #050505 !important;
        color: #EDE8E0 !important;
        border: 1px solid #050505 !important;
      }
      .cookie-btn-accept:hover {
        background: #171717 !important;
        border-color: #171717 !important;
        color: #EDE8E0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p class="cookie-banner-text">
      Select "Accept all" to agree to our use of cookies and similar technologies to enhance your browsing experience, security, analytics and customization. Select "Manage cookies" to make more choices or opt out.
      <a href="/privacy">Privacy Policy</a>
    </p>
    <div class="cookie-banner-actions">
      <button class="cookie-btn-manage" id="cookie-manage">Manage Cookies</button>
      <button class="cookie-btn-decline" id="cookie-decline">Decline All</button>
      <button class="cookie-btn-accept" id="cookie-accept">Accept All</button>
    </div>
  `;
  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem('cookie_consent', choice);
    banner.classList.add('hidden');
    setTimeout(() => banner.remove(), 400);
  }

  document.getElementById('cookie-accept').addEventListener('click', () => dismiss('accepted'));
  document.getElementById('cookie-decline').addEventListener('click', () => dismiss('declined'));
  document.getElementById('cookie-manage').addEventListener('click', () => dismiss('managed'));
})();

// ── Contact forms (footer + /contact page) → send-contact edge function ──
(function () {
  var SUPABASE_URL = 'https://smmwvvimcbfqrtgwcyzw.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbXd2dmltY2JmcXJ0Z3djeXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MjUzOTYsImV4cCI6MjEwMjAwMTM5Nn0.HsTFzGMINEnsBjl8kIra1USjikguxbAJfdVcLKyo7G4';
  var ENDPOINT = SUPABASE_URL + '/functions/v1/send-contact';

  function sendContact(payload, btn) {
    var original = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.text().then(function (text) {
        var data = {};
        if (text) {
          try { data = JSON.parse(text); } catch (e) {
            if (!r.ok) throw new Error(text.slice(0, 200) || (r.status + ' ' + r.statusText));
            throw new Error('Unexpected response from server.');
          }
        }
        if (!r.ok) throw new Error((data && (data.error || data.message)) || ('Request failed (' + r.status + ')'));
        return data;
      });
    }).finally(function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }

  // Contact page form (#contact-form)
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof contactForm.checkValidity === 'function' && !contactForm.checkValidity()) {
        if (typeof contactForm.reportValidity === 'function') contactForm.reportValidity();
        return;
      }
      var btn = contactForm.querySelector('[type="submit"]');
      var first = (document.getElementById('first-name') || {}).value || '';
      var last = (document.getElementById('last-name') || {}).value || '';
      var email = (document.getElementById('email') || {}).value || '';
      var company = (document.getElementById('company') || {}).value || '';
      var subject = (document.getElementById('subject') || {}).value || '';
      var message = (document.getElementById('message') || {}).value || '';

      sendContact({
        first_name: first.trim(),
        last_name: last.trim(),
        email: email.trim(),
        company: company.trim(),
        subject: subject,
        message: message.trim()
      }, btn).then(function () {
        var success = document.getElementById('success-msg');
        if (success) success.classList.add('show');
        contactForm.reset();
      }).catch(function (err) {
        alert('Could not send message: ' + (err && err.message ? err.message : 'Unknown error') +
          '\n\nPlease email contact@kontrora.com directly.');
      });
    });
  }

  // Footer forms (#fn-contact-form) — may appear on multiple pages
  document.querySelectorAll('#fn-contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var subject = (form.querySelector('[name="subject"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';
      var parts = name.trim().split(/\s+/);
      var first = parts[0] || name.trim() || 'Visitor';
      var last = parts.slice(1).join(' ') || '';

      sendContact({
        first_name: first,
        last_name: last,
        email: email.trim(),
        company: '',
        subject: subject || 'other',
        message: message.trim()
      }, btn).then(function () {
        form.reset();
        alert('Message sent! We\'ll get back to you within one business day.');
      }).catch(function (err) {
        alert('Could not send message: ' + (err && err.message ? err.message : 'Unknown error') +
          '\n\nPlease email contact@kontrora.com directly.');
      });
    });
  });
})();
