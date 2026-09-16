/* script.js — Irrigation Company Website Interactive Features */

'use strict';

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {

  // ─── PRELOADER ───────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'visible';
      }, 600);
    });
  }

  // ─── HEADER SCROLL EFFECT & BACK TO TOP ───────────────────
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 400);

    highlightActiveNav();
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── HAMBURGER / MOBILE NAV ─────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── ACTIVE NAV HIGHLIGHT (CLICK VS DIRECT SCROLL) ───────
  const allNavLinks = document.querySelectorAll('.nav-link');
  let isClickedHighlight = false;

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      allNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      isClickedHighlight = true;
    });
  });

  function highlightActiveNav() {
    // When user scrolls back near the top, reset active link to Home
    if (window.scrollY < 100 && isClickedHighlight) {
      isClickedHighlight = false;
      allNavLinks.forEach(l => l.classList.remove('active'));
      const homeL = document.querySelector('.nav-link[href="#home"]');
      if (homeL) homeL.classList.add('active');
    }
  }

  // ─── FLOATING PARTICLES ─────────────────────────────────
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * -10}%;
        animation-duration: ${Math.random() * 10 + 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ─── COUNTER ANIMATION ──────────────────────────────────
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, step);
  }

  // Trigger counters when hero is in view
  const counters   = document.querySelectorAll('.stat-number');
  let countStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countStarted) {
        countStarted = true;
        counters.forEach(c => animateCounter(c));
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // ─── SCROLL REVEAL ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        const ms    = parseFloat(delay) * 1000;
        setTimeout(() => entry.target.classList.add('visible'), ms);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── PRODUCT FILTER TABS ────────────────────────────────
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const prodCards  = document.querySelectorAll('.product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      prodCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.style.display = show ? '' : 'none';
        // Re-trigger animation
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }
      });
    });
  });

  // ─── TESTIMONIALS SLIDER ────────────────────────────────
  const track  = document.getElementById('testi-track');
  const prev   = document.getElementById('testi-prev');
  const next   = document.getElementById('testi-next');
  const dots   = document.querySelectorAll('.tdot');
  const cards  = document.querySelectorAll('.testi-card');
  let current  = 0;
  let autoSlide;

  if (track && prev && next) {
    function getVisible() {
      return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisible());
    }

    function goTo(idx) {
      const maxIdx = getMaxIndex();
      current = Math.max(0, Math.min(idx, maxIdx));
      const cardWidth = track.parentElement.offsetWidth / getVisible();
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

    function resetAuto() {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => goTo(current >= getMaxIndex() ? 0 : current + 1), 5000);
    }

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    });

    window.addEventListener('resize', () => goTo(current));
    resetAuto();
  }

  // ─── CONTACT FORM ───────────────────────────────────────
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
    e.preventDefault();

    const name     = form.querySelector('#cf-name').value.trim();
    const phone    = form.querySelector('#cf-phone').value.trim();
    const email    = form.querySelector('#cf-email').value.trim();
    const product  = form.querySelector('#cf-product').value;
    const location = form.querySelector('#cf-location').value.trim();
    const message  = form.querySelector('#cf-message').value.trim();

    if (!name) {
      shakeInput(form.querySelector('#cf-name'));
      return;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      shakeInput(form.querySelector('#cf-phone'));
      return;
    }

    const submitBtn = form.querySelector('#form-submit');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Opening WhatsApp...';

    // Save enquiry locally
    const enquiryData = {
      date: new Date().toLocaleString('en-IN'),
      name, phone, email, product, location, message
    };
    const existingEnquiries = JSON.parse(localStorage.getItem('chronic_enquiries') || '[]');
    existingEnquiries.push(enquiryData);
    localStorage.setItem('chronic_enquiries', JSON.stringify(existingEnquiries));

    // Construct formatted WhatsApp message
    let waMessage = `*New Website Enquiry - Chronic Industries*\n\n`;
    waMessage += `👤 *Name:* ${name}\n`;
    waMessage += `📞 *Phone:* ${phone}\n`;
    if (email) waMessage += `✉️ *Email:* ${email}\n`;
    if (product) waMessage += `📦 *Product Interest:* ${product}\n`;
    if (location) waMessage += `📍 *Location:* ${location}\n`;
    if (message) waMessage += `💬 *Message:* ${message}\n`;

    const encodedMsg = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/918141223399?text=${encodedMsg}`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Enquiry';
      successMsg.classList.add('show');
      form.reset();

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 800);
  });
}

  function shakeInput(el) {
    el.style.borderColor = '#ff4d4d';
    el.style.animation = 'shake 0.4s ease';
    el.focus();
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.animation = '';
    }, 1000);
  }

  // Inject shake keyframe
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  console.log('%c🌿 Irrigation Website Loaded Successfully', 'color:#5de8a0; font-size:16px; font-weight:bold;');
});

// Helper function to view all submitted enquiries stored in browser
window.showEnquiries = function() {
  const enquiries = JSON.parse(localStorage.getItem('chronic_enquiries') || '[]');
  console.table(enquiries);
  if (enquiries.length === 0) {
    alert('No enquiries submitted yet.');
  } else {
    alert(`Found ${enquiries.length} saved enquiry(ies). Check Browser Console (F12) for detailed table.`);
  }
  return enquiries;
};
