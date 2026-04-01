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
  const BACKEND_API_URL = 'https://coliville-api-626057356331.us-east1.run.app';
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
