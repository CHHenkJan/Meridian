/* ══════════════════════════════════════════
   MERIDIAN — Main JavaScript
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Disclaimer Modal (first visit) ---
  const modal = document.getElementById('disclaimerModal');
  if (modal && !localStorage.getItem('meridian_disclaimer_accepted')) {
    modal.classList.add('active');
  }

  const acceptBtn = document.getElementById('acceptDisclaimer');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('meridian_disclaimer_accepted', 'true');
      modal.classList.remove('active');
      showCookieBanner();
    });
  }

  // --- Cookie Banner ---
  function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner && !localStorage.getItem('meridian_cookies_set')) {
      banner.classList.add('active');
    }
  }

  // Show cookie banner if disclaimer already accepted
  if (localStorage.getItem('meridian_disclaimer_accepted')) {
    showCookieBanner();
  }

  const acceptCookies = document.getElementById('acceptCookies');
  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('meridian_cookies_set', 'accepted');
      document.getElementById('cookieBanner').classList.remove('active');
    });
  }

  const manageCookies = document.getElementById('manageCookies');
  if (manageCookies) {
    manageCookies.addEventListener('click', () => {
      localStorage.setItem('meridian_cookies_set', 'minimal');
      document.getElementById('cookieBanner').classList.remove('active');
    });
  }

  // --- Mobile Nav Toggle ---
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
