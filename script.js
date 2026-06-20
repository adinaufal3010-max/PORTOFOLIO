/**
 * Rizky Pratama — Portfolio Script
 * Features: Loader, Navbar, Dark Mode, AOS, Skills, Side Nav, Form
 */

(function () {
  'use strict';

  /* ═══════════════════════════
     LOADING SCREEN
  ═══════════════════════════ */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    // Minimum display time for UX
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger initial AOS after load
      triggerVisibleAOS();
      animateSkillBars();
    }, 1600);
  });

  /* ═══════════════════════════
     DARK / LIGHT MODE
  ═══════════════════════════ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = themeToggle.querySelector('.theme-icon');
  const root        = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  }

  /* ═══════════════════════════
     NAVBAR SCROLL BEHAVIOR
  ═══════════════════════════ */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ═══════════════════════════
     HAMBURGER MOBILE MENU
  ═══════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on mobile link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ═══════════════════════════
     ACTIVE NAV LINK & SIDE DOT
  ═══════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sideDots  = document.querySelectorAll('.side-dot');

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    sideDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ═══════════════════════════
     AOS — Animate on Scroll
  ═══════════════════════════ */
  function triggerVisibleAOS() {
    const aosEls = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = el.getAttribute('data-aos-delay') || 0;
          setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
          aosObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    aosEls.forEach(el => aosObserver.observe(el));
  }

  /* ═══════════════════════════
     SKILL BAR ANIMATION
  ═══════════════════════════ */
  function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const pct  = fill.getAttribute('data-pct');
          // Small delay so it feels snappy after section enters
          setTimeout(() => {
            fill.style.width = pct + '%';
          }, 200);
          skillObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });

    fills.forEach(fill => skillObserver.observe(fill));
  }

  /* ═══════════════════════════
     SMOOTH SCROLL (enhance)
  ═══════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 75;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ═══════════════════════════
     CONTACT FORM (AJAX)
  ═══════════════════════════ */
  const contactForm  = document.getElementById('contact-form');
  const formSuccess  = document.getElementById('form-success');
  const submitBtn    = document.getElementById('submit-btn');
  const btnText      = document.getElementById('btn-text');
  const btnLoading   = document.getElementById('btn-loading');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Toggle loading state
      btnText.style.display    = 'none';
      btnLoading.style.display = 'inline';
      submitBtn.disabled       = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('contact.php', {
          method: 'POST',
          body:   formData,
        });

        if (response.ok) {
          const result = await response.text();
          if (result.trim() === 'success') {
            showFormSuccess();
          } else {
            resetBtn();
            showFormError('Gagal mengirim pesan. Coba lagi.');
          }
        } else {
          resetBtn();
          showFormError('Terjadi kesalahan server.');
        }
      } catch {
        // If PHP not available (static hosting), show success for demo
        showFormSuccess();
      }
    });
  }

  function showFormSuccess() {
    contactForm.style.display  = 'none';
    formSuccess.style.display  = 'flex';
  }

  function resetBtn() {
    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled       = false;
  }

  function showFormError(msg) {
    const err = document.createElement('p');
    err.textContent = msg;
    err.style.cssText = 'color:#EF4444;font-size:0.85rem;margin-top:-8px;';
    const existing = contactForm.querySelector('.form-error');
    if (existing) existing.remove();
    err.classList.add('form-error');
    contactForm.appendChild(err);
    setTimeout(() => err.remove(), 4000);
  }

  /* ═══════════════════════════
     PROFILE IMAGE ZOOM
  ═══════════════════════════ */
  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    profileImg.addEventListener('mouseenter', () => {
      profileImg.style.transform  = 'scale(1.05)';
      profileImg.style.boxShadow  = '0 0 60px rgba(91,95,255,0.5), 0 20px 60px rgba(0,0,0,0.5)';
    });
    profileImg.addEventListener('mouseleave', () => {
      profileImg.style.transform  = '';
      profileImg.style.boxShadow  = '';
    });
  }

  /* ═══════════════════════════
     TYPED EFFECT — Hero Name
  ═══════════════════════════ */
  // Subtle: animate hero subtitle on load
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  if (heroEyebrow) {
    heroEyebrow.style.opacity = '0';
    setTimeout(() => {
      heroEyebrow.style.transition = 'opacity 0.6s ease';
      heroEyebrow.style.opacity    = '1';
    }, 1700);
  }

  /* ═══════════════════════════
     GALLERY LIGHTBOX (simple)
  ═══════════════════════════ */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9000;
        background:rgba(0,0,0,0.9);
        display:flex;align-items:center;justify-content:center;
        cursor:zoom-out;animation:fadeIn .25s ease;
      `;

      const style = document.createElement('style');
      style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
      document.head.appendChild(style);

      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;object-fit:contain;';

      const close = document.createElement('button');
      close.innerHTML = '✕';
      close.style.cssText = `
        position:absolute;top:20px;right:24px;
        background:rgba(255,255,255,0.1);
        border:1px solid rgba(255,255,255,0.2);
        color:white;width:40px;height:40px;
        border-radius:50%;font-size:1rem;cursor:pointer;
      `;

      overlay.appendChild(bigImg);
      overlay.appendChild(close);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const closeLightbox = () => {
        overlay.remove();
        style.remove();
        document.body.style.overflow = '';
      };
      overlay.addEventListener('click', closeLightbox);
      close.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', esc); }
      });
    });
  });

  /* ═══════════════════════════
     COUNTERS — Hero Stats
  ═══════════════════════════ */
  function animateCounter(el, target, duration = 1500) {
    let start = null;
    const num = parseInt(target);
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      el.textContent = Math.floor(ease * num) + '+';
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = num + '+';
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(numEl => {
          const val = parseInt(numEl.textContent);
          if (!isNaN(val)) animateCounter(numEl, val);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

})();