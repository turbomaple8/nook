/* ==========================================================================
   NOOK — Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation scroll effect ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    });
  }

  // ── Mobile hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // ── Scroll-triggered animations ──
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });

      // Open clicked (if it wasn't already active)
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ── Back to Top button ──
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Modal handling ──
  const modalOverlay = document.getElementById('modal-apply');
  if (modalOverlay) {
    // Open modal buttons
    document.querySelectorAll('[data-modal="apply"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    const closeBtn = modalOverlay.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Backend API (primary submission) ──
  const BACKEND_API_URL = 'https://coliville-backend-626057356331.us-east1.run.app';
  const BACKEND_PROJECT_ID = 'nook';

  function forwardToBackend(endpoint, payload) {
    console.log('[Backend] Sending to', endpoint, payload);
    return fetch(`${BACKEND_API_URL}/v1/public/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': BACKEND_PROJECT_ID
      },
      body: JSON.stringify(payload)
    })
    .then(r => {
      console.log('[Backend] Response:', r.status, r.statusText);
      if (!r.ok) throw new Error('Backend responded with ' + r.status);
      // GA4 conversion event — fires only on 2xx backend response
      if (typeof gtag === 'function') {
        var eventName = endpoint === 'reservations' ? 'reserve_submit'
                      : endpoint === 'tour-requests' ? 'viewing_request_submit'
                      : 'contact_submit';
        var eventValue = endpoint === 'reservations' ? 100
                       : endpoint === 'tour-requests' ? 50
                       : 25;
        gtag('event', eventName, {
          currency: 'GBP',
          value: eventValue,
          form_endpoint: endpoint
        });
      }
      return r;
    });
  }

  // ── Contact form submission ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      const nameParts = (data.name || '').trim().split(/\s+/);

      let backendCall;
      if (data.enquiry_type === 'viewing') {
        backendCall = forwardToBackend('tour-requests', {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: data.email,
          phone: data.phone || null,
          property: null,
          date: new Date().toISOString().split('T')[0],
          time: 'morning',
          notes: data.message || null,
          sourceWebsite: 'nookrent.com',
          city: 'London'
        });
      } else {
        backendCall = forwardToBackend('applications', {
          fullName: data.name || '',
          email: data.email,
          phone: data.phone || null,
          aboutYou: (data.enquiry_type ? '[' + data.enquiry_type + '] ' : '') + (data.message || ''),
          sourceWebsite: 'nookrent.com',
          city: 'London'
        });
      }

      backendCall
        .then(() => {
          submitBtn.innerHTML = '✓ Sent! We\'ll be in touch 🎉';
          submitBtn.style.background = 'var(--clr-sage)';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        })
        .catch(() => {
          submitBtn.innerHTML = '✗ Something went wrong. Try again.';
          submitBtn.style.background = 'var(--clr-coral)';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  // ── Apply form submission (modal) ──
  const applyForm = document.getElementById('apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = applyForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      const name = document.getElementById('apply-name')?.value || '';
      const email = document.getElementById('apply-email')?.value || '';
      const phone = document.getElementById('apply-phone')?.value || '';
      const moveIn = document.getElementById('apply-move')?.value || '';
      const message = document.getElementById('apply-message')?.value || '';

      forwardToBackend('applications', {
        fullName: name,
        email: email,
        phone: phone || null,
        moveInDate: moveIn || null,
        aboutYou: message || null,
        sourceWebsite: 'nookrent.com',
        city: 'London'
      })
        .then(() => {
          submitBtn.innerHTML = '✓ Sent! We\'ll be in touch 🎉';
          submitBtn.style.background = 'var(--clr-sage)';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            applyForm.reset();
            const modal = applyForm.closest('.modal-overlay');
            if (modal) {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            }
          }, 3000);
        })
        .catch(() => {
          submitBtn.innerHTML = '✗ Something went wrong. Try again.';
          submitBtn.style.background = 'var(--clr-coral)';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  // ── Reserve modal handling ──
  const reserveOverlay = document.getElementById('modal-reserve');
  if (reserveOverlay) {
    document.querySelectorAll('[data-modal="reserve"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const room = btn.dataset.reserveRoom || '';
        const location = btn.dataset.reserveLocation || '';
        document.getElementById('reserve-room').value = room;
        document.getElementById('reserve-location').value = location;
        document.getElementById('reserveRoomLabel').textContent = room;
        document.getElementById('reserveLocationLabel').textContent = location;
        reserveOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const reserveClose = reserveOverlay.querySelector('.modal__close');
    if (reserveClose) {
      reserveClose.addEventListener('click', () => {
        reserveOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    reserveOverlay.addEventListener('click', (e) => {
      if (e.target === reserveOverlay) {
        reserveOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reserveOverlay.classList.contains('active')) {
        reserveOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Reserve form submission ──
  const reserveForm = document.getElementById('reserve-form');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = reserveForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Reserving...';
      submitBtn.disabled = true;

      const name = document.getElementById('reserve-name')?.value || '';
      const email = document.getElementById('reserve-email')?.value || '';
      const phone = document.getElementById('reserve-phone')?.value || '';
      const moveIn = document.getElementById('reserve-move')?.value || '';
      const room = document.getElementById('reserve-room')?.value || '';
      const location = document.getElementById('reserve-location')?.value || '';

      forwardToBackend('reservations', {
        fullName: name,
        email: email,
        phone: phone || null,
        moveInDate: moveIn || null,
        roomType: room,
        location: location,
        sourceWebsite: 'nookrent.com',
        city: 'London'
      })
        .then(() => {
          submitBtn.innerHTML = '✓ Reserved! We\'ll be in touch 🎉';
          submitBtn.style.background = 'var(--clr-sage)';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            reserveForm.reset();
            reserveOverlay.classList.remove('active');
            document.body.style.overflow = '';
          }, 3000);
        })
        .catch(() => {
          submitBtn.innerHTML = '✗ Something went wrong. Try again.';
          submitBtn.style.background = 'var(--clr-coral)';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  // ── Other non-contact, non-apply, non-reserve forms (keep demo behavior) ──
  document.querySelectorAll('form:not(#contact-form):not(#apply-form):not(#reserve-form)').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✓ Sent! We\'ll be in touch 🎉';
      submitBtn.style.background = 'var(--clr-sage)';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
        const modal = form.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 3000);
    });
  });

  // ── Filter buttons (listings page) ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const cards = document.querySelectorAll('.room-card');

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.area === filter || card.dataset.type === filter) {
            card.style.display = '';
            // Re-trigger animation
            card.classList.remove('visible');
            requestAnimationFrame(() => {
              card.classList.add('fade-in');
              requestAnimationFrame(() => {
                card.classList.add('visible');
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ── Image gallery for room detail pages ──
  const galleryThumbs = document.querySelectorAll('.room-detail__gallery-thumb');
  const galleryMain = document.querySelector('.room-detail__gallery-main img');
  if (galleryThumbs.length && galleryMain) {
    galleryThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.querySelector('img').src;
        const oldSrc = galleryMain.src;
        galleryMain.src = newSrc;
        thumb.querySelector('img').src = oldSrc;
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Parallax subtle effect on hero shapes ──
  const shapes = document.querySelectorAll('.hero__shape');
  if (shapes.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.forEach((shape, i) => {
        const speed = (i + 1) * 0.3;
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }

});

/* ==========================================================================
   Phone country-code picker (intl-tel-input) — mandatory country code → E.164
   --------------------------------------------------------------------------
   Loads intl-tel-input from a CDN and attaches it to every <input type="tel">
   so the visitor picks a country (default United Kingdom for nook) and the
   submitted phone is rewritten to E.164 (+<cc><national>) before each form's
   own submit handler reads it. A single document-level capture listener runs
   before those handlers. Fully defensive: if the CDN fails to load or the
   validation utils aren't ready yet, the form still submits with the raw
   number and the backend normalizes it — nothing ever blocks a lead.
   ========================================================================== */
(function () {
  var ITI = 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/';
  var DEFAULT_COUNTRY = 'gb'; // nook = London / United Kingdom
  var loading = false, queue = [];

  function ensureLib(cb) {
    if (window.intlTelInput) { cb(); return; }
    queue.push(cb);
    if (loading) return;
    loading = true;
    if (!document.getElementById('iti-css')) {
      var link = document.createElement('link');
      link.id = 'iti-css'; link.rel = 'stylesheet';
      link.href = ITI + 'css/intlTelInput.css';
      document.head.appendChild(link);
    }
    var s = document.createElement('script');
    s.src = ITI + 'js/intlTelInput.min.js';
    s.onload = function () { var q = queue; queue = []; q.forEach(function (f) { f(); }); };
    s.onerror = function () { loading = false; queue = []; }; // CDN blocked → leave inputs as-is
    document.head.appendChild(s);
  }

  function enhance(input) {
    if (!input || input.__itiDone) return;
    ensureLib(function () {
      if (!window.intlTelInput || input.__itiDone) return;
      input.__itiDone = true;
      var iti = window.intlTelInput(input, {
        initialCountry: DEFAULT_COUNTRY,
        separateDialCode: true,
        utilsScript: ITI + 'js/utils.js'
      });
      input.__iti = iti;
      input.__itiReady = false;
      if (iti.promise && iti.promise.then) {
        iti.promise.then(function () { input.__itiReady = true; });
      }
    });
  }

  function enhanceAll(root) {
    (root || document).querySelectorAll('input[type="tel"]').forEach(enhance);
  }

  // One capture-phase listener for the whole document: it fires before any
  // individual form's submit handler, so the rewritten E.164 value is in place
  // by the time that handler reads input.value / FormData.
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    var ti = form.querySelector('input[type="tel"]');
    if (!ti || !ti.__iti) return;
    var val = (ti.value || '').trim();
    if (val === '') return; // empty optional phone — let it through
    if (!ti.__itiReady) return; // utils not loaded yet — backend will normalize
    if (!ti.__iti.isValidNumber()) {
      e.preventDefault();
      e.stopPropagation();
      alert('Please enter a valid phone number, including the country code.');
      return;
    }
    ti.value = ti.__iti.getNumber(); // E.164
  }, true);

  window.NookPhone = { enhance: enhance, enhanceAll: enhanceAll };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { enhanceAll(); });
  } else {
    enhanceAll();
  }
})();

/* ==========================================================================
   WhatsApp floating button — injected on every page
   ========================================================================== */
(function () {
  var WHATSAPP_URL = 'https://wa.me/19177356528';
  var ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M19.11 17.36c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.14-.19.29-.74.93-.9 1.12-.17.19-.33.22-.62.07-.29-.14-1.21-.45-2.3-1.42-.85-.76-1.42-1.7-1.59-1.98-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.4 0 1.41 1.03 2.78 1.17 2.97.14.19 2.03 3.1 4.91 4.34.69.3 1.22.47 1.64.61.69.22 1.31.19 1.81.11.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM16.03 27.06h-.01a10.9 10.9 0 0 1-5.55-1.52l-.4-.24-4.13 1.08 1.1-4.02-.26-.41a10.86 10.86 0 0 1-1.67-5.82c0-6.02 4.9-10.92 10.93-10.92a10.85 10.85 0 0 1 10.91 10.93c0 6.02-4.9 10.92-10.92 10.92zm9.3-20.22A13.06 13.06 0 0 0 16.02 3C8.83 3 3 8.83 3 16.02c0 2.3.6 4.54 1.74 6.52L3 29l6.6-1.73a13.02 13.02 0 0 0 6.42 1.68h.01c7.19 0 13.03-5.84 13.03-13.03 0-3.48-1.36-6.75-3.73-9.08z"/></svg>';

  function injectWhatsAppFab() {
    if (document.querySelector('.whatsapp-fab')) return;
    var a = document.createElement('a');
    a.className = 'whatsapp-fab';
    a.href = WHATSAPP_URL;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat with us on WhatsApp');
    a.innerHTML = ICON;
    a.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { link_url: WHATSAPP_URL });
      }
    });
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWhatsAppFab);
  } else {
    injectWhatsAppFab();
  }
})();
