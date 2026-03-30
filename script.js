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

  // ── Backend forwarding (fire-and-forget) ──
  const BACKEND_API_URL = 'https://coliville-api-626057356331.us-east1.run.app';
  const BACKEND_PROJECT_ID = 'nook';

  function forwardToBackend(endpoint, payload) {
    fetch(`${BACKEND_API_URL}/v1/public/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': BACKEND_PROJECT_ID
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  // ── Contact form submission (Web3Forms) ──
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

      // Forward to backend based on enquiry type
      const nameParts = (data.name || '').trim().split(/\s+/);
      if (data.enquiry_type === 'viewing') {
        forwardToBackend('tour-requests', {
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
        forwardToBackend('applications', {
          fullName: data.name || '',
          email: data.email,
          phone: data.phone || null,
          aboutYou: (data.enquiry_type ? '[' + data.enquiry_type + '] ' : '') + (data.message || ''),
          sourceWebsite: 'nookrent.com',
          city: 'London'
        });
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            submitBtn.innerHTML = '✓ Sent! We\'ll be in touch 🎉';
            submitBtn.style.background = 'var(--clr-sage)';
            contactForm.reset();
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 3000);
          } else {
            submitBtn.innerHTML = '✗ Something went wrong. Try again.';
            submitBtn.style.background = 'var(--clr-coral)';
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 3000);
          }
        })
        .catch(() => {
          submitBtn.innerHTML = '✗ Network error. Please try again.';
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
      submitBtn.innerHTML = '✓ Sent! We\'ll be in touch 🎉';
      submitBtn.style.background = 'var(--clr-sage)';
      submitBtn.disabled = true;

      // Forward to backend
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
      });

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
    });
  }

  // ── Other non-contact, non-apply forms (keep demo behavior) ──
  document.querySelectorAll('form:not(#contact-form):not(#apply-form)').forEach(form => {
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
