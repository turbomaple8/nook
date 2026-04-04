/* ── Reserve Popup – Nook Rent ── */
(function () {
  if (sessionStorage.getItem('reservePopupDismissed')) return;

  var BACKEND_API_URL = 'https://coliville-api-626057356331.us-east1.run.app';
  var BACKEND_PROJECT_ID = 'nook';

  var LOCATIONS = [
    { name: 'Canary Wharf', slug: 'canary-wharf' },
    { name: 'Central London', slug: 'central-london' },
    { name: 'Islington', slug: 'islington' }
  ];

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = '\
    @keyframes rpSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }\
    .rp-overlay { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:1rem; }\
    .rp-backdrop { position:absolute; inset:0; background:rgba(66,48,32,0.4); }\
    .rp-card { position:relative; width:100%; max-width:380px; border-radius:16px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); background:var(--clr-warm-white,#FFFDF9); animation:rpSlideUp 0.4s ease-out; }\
    .rp-close { position:absolute; right:12px; top:12px; z-index:2; background:none; border:none; cursor:pointer; padding:6px; border-radius:50%; transition:background 0.2s; color:rgba(255,255,255,0.8); }\
    .rp-close:hover { background:rgba(0,0,0,0.1); }\
    .rp-close--dark { color:var(--clr-text-muted,#999); }\
    .rp-header { padding:20px 24px; text-align:center; color:#fff; background:linear-gradient(135deg,var(--clr-coral,#E8855B) 0%,var(--clr-coral-dark,#D4693F) 100%); }\
    .rp-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.18); border-radius:50px; padding:4px 12px; font-size:12px; font-weight:500; margin-bottom:8px; }\
    .rp-pulse { width:6px; height:6px; border-radius:50%; background:#ef4444; animation:rpPulse 2s infinite; }\
    @keyframes rpPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }\
    .rp-title { font-size:18px; font-weight:700; margin:0; font-family:var(--font-display,"Playfair Display",serif); }\
    .rp-sub { font-size:14px; margin:4px 0 0; opacity:0.85; }\
    .rp-body { padding:20px 24px; text-align:center; }\
    .rp-body p { font-size:14px; color:var(--clr-text-light,#777); line-height:1.6; margin:0; }\
    .rp-body strong { color:var(--clr-brown,#6B4226); }\
    .rp-cta { display:block; width:100%; margin-top:16px; padding:12px; border:none; border-radius:50px; font-size:14px; font-weight:600; color:#fff; background:var(--clr-coral,#E8855B); cursor:pointer; transition:filter 0.2s; }\
    .rp-cta:hover { filter:brightness(1.1); }\
    .rp-hint { font-size:11px; color:var(--clr-text-muted,#aaa); margin-top:10px; }\
    .rp-options { padding:12px 24px 24px; display:flex; flex-direction:column; gap:12px; }\
    .rp-option { display:flex; align-items:center; gap:14px; padding:14px 18px; border:1px solid var(--clr-peach-light,#FFF0DE); border-radius:12px; background:var(--clr-warm-white,#FFFDF9); cursor:pointer; text-align:left; transition:box-shadow 0.2s; }\
    .rp-option:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); }\
    .rp-icon { width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }\
    .rp-icon--primary { background:var(--clr-coral,#E8855B); color:#fff; }\
    .rp-icon--muted { background:var(--clr-peach-light,#FFF0DE); color:var(--clr-coral-dark,#D4693F); }\
    .rp-option-title { font-size:14px; font-weight:600; color:var(--clr-brown,#6B4226); margin:0; }\
    .rp-option-desc { font-size:12px; color:var(--clr-text-muted,#aaa); margin:2px 0 0; }\
    .rp-back { position:absolute; left:12px; top:12px; z-index:2; background:none; border:none; cursor:pointer; padding:6px; border-radius:50%; color:var(--clr-text-muted,#999); transition:background 0.2s; }\
    .rp-back:hover { background:rgba(0,0,0,0.05); }\
    .rp-list { padding:12px 24px 24px; display:flex; flex-direction:column; gap:8px; }\
    .rp-list-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border:1px solid var(--clr-peach-light,#FFF0DE); border-radius:12px; background:var(--clr-warm-white,#FFFDF9); cursor:pointer; text-align:left; transition:box-shadow 0.2s; }\
    .rp-list-item:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); }\
    .rp-list-initial { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; background:var(--clr-coral,#E8855B); color:#fff; flex-shrink:0; }\
    .rp-list-name { font-size:14px; font-weight:500; color:var(--clr-brown,#6B4226); }\
    .rp-list-arrow { margin-left:auto; color:var(--clr-peach,#FFDAB3); }\
    .rp-center { text-align:center; padding:16px 24px 8px; }\
    .rp-center h3 { font-size:18px; font-weight:700; color:var(--clr-brown,#6B4226); margin:0; font-family:var(--font-display,"Playfair Display",serif); }\
    .rp-center p { font-size:13px; color:var(--clr-text-muted,#aaa); margin:4px 0 0; }\
    @media (max-width:480px) { .rp-overlay { align-items:flex-end; } }\
  ';
  document.head.appendChild(style);

  var overlayEl = null;
  var selectedLocation = null;

  function closeSvg() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  }
  function backSvg() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>';
  }
  function arrowSvg() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  }

  function dismiss() {
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    sessionStorage.setItem('reservePopupDismissed', '1');
  }

  function render(html) {
    if (overlayEl) overlayEl.remove();
    overlayEl = document.createElement('div');
    overlayEl.className = 'rp-overlay';
    overlayEl.innerHTML = '<div class="rp-backdrop"></div>' + html;
    document.body.appendChild(overlayEl);
    overlayEl.querySelector('.rp-backdrop').addEventListener('click', dismiss);
    var closeBtn = overlayEl.querySelector('.rp-close');
    if (closeBtn) closeBtn.addEventListener('click', dismiss);
  }

  function showBanner() {
    render('\
      <div class="rp-card">\
        <button class="rp-close" aria-label="Close">' + closeSvg() + '</button>\
        <div class="rp-header">\
          <div class="rp-badge"><span class="rp-pulse"></span> Few rooms left</div>\
          <h3 class="rp-title">Reserve Now</h3>\
          <p class="rp-sub">No payment or signup required.</p>\
        </div>\
        <div class="rp-body">\
          <p>Make an instant reservation in just a few clicks. Your room will be held for <strong>24 hours</strong> — completely free.</p>\
          <button class="rp-cta" id="rpBannerCta">Reserve a Room — Free</button>\
          <p class="rp-hint">Takes less than 30 seconds</p>\
        </div>\
      </div>\
    ');
    document.getElementById('rpBannerCta').addEventListener('click', showChoose);
  }

  function showChoose() {
    render('\
      <div class="rp-card">\
        <button class="rp-close rp-close--dark" aria-label="Close">' + closeSvg() + '</button>\
        <div class="rp-center"><h3>How would you like to reserve?</h3><p>Pick an option to continue</p></div>\
        <div class="rp-options">\
          <button class="rp-option" id="rpAny">\
            <div class="rp-icon rp-icon--primary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>\
            <div><p class="rp-option-title">Any Room</p><p class="rp-option-desc">We\'ll match you with the best available</p></div>\
          </button>\
          <button class="rp-option" id="rpSelect">\
            <div class="rp-icon rp-icon--muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>\
            <div><p class="rp-option-title">Select a Location</p><p class="rp-option-desc">Choose a specific area to reserve</p></div>\
          </button>\
        </div>\
      </div>\
    ');
    document.getElementById('rpAny').addEventListener('click', function () {
      selectedLocation = null;
      openReserveForm(null);
    });
    document.getElementById('rpSelect').addEventListener('click', showLocationList);
  }

  function showLocationList() {
    var items = LOCATIONS.map(function (loc) {
      return '<button class="rp-list-item" data-loc="' + loc.slug + '" data-name="' + loc.name + '"><span class="rp-list-initial">' + loc.name.charAt(0) + '</span><span class="rp-list-name">' + loc.name + '</span><span class="rp-list-arrow">' + arrowSvg() + '</span></button>';
    }).join('');

    render('\
      <div class="rp-card">\
        <button class="rp-back" id="rpBack" aria-label="Back">' + backSvg() + '</button>\
        <button class="rp-close rp-close--dark" aria-label="Close">' + closeSvg() + '</button>\
        <div class="rp-center"><h3>Select a Location</h3><p>Choose where you\'d like to stay</p></div>\
        <div class="rp-list">' + items + '</div>\
      </div>\
    ');
    document.getElementById('rpBack').addEventListener('click', showChoose);
    overlayEl.querySelectorAll('.rp-list-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedLocation = { name: btn.dataset.name, slug: btn.dataset.loc };
        openReserveForm(selectedLocation);
      });
    });
  }

  function openReserveForm(location) {
    dismiss();
    // If on a room page with existing reserve modal, use it
    var existingModal = document.getElementById('modal-reserve');
    if (existingModal) {
      var roomInput = document.getElementById('reserve-room');
      var locInput = document.getElementById('reserve-location');
      var roomLabel = document.getElementById('reserveRoomLabel');
      var locLabel = document.getElementById('reserveLocationLabel');
      if (location) {
        if (locInput) locInput.value = location.name;
        if (roomInput) roomInput.value = '';
        if (roomLabel) roomLabel.textContent = 'Any Room';
        if (locLabel) locLabel.textContent = location.name;
      } else {
        if (locInput) locInput.value = 'Any Location';
        if (roomInput) roomInput.value = 'Any Room';
        if (roomLabel) roomLabel.textContent = 'Any Room';
        if (locLabel) locLabel.textContent = 'Any Location';
      }
      existingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      return;
    }

    // Standalone form for pages without existing modal
    showStandaloneForm(location);
  }

  function showStandaloneForm(location) {
    var locDisplay = location ? location.name : 'Any Location';
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'rpStandaloneReserve';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(66,48,32,0.5);';
    overlay.innerHTML = '\
      <div class="modal" style="position:relative;">\
        <button class="modal__close" data-close-rp>&times;</button>\
        <h2>Reserve Your Room 🏡</h2>\
        <p style="margin-bottom:1rem;color:var(--clr-text-light,#777);">No payment required. Secure your spot in seconds.</p>\
        <div style="background:var(--clr-cream-dark,#f0e6d6);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;">\
          <strong>Any Room</strong>\
          <span style="display:block;font-size:0.85rem;color:var(--clr-text-muted,#aaa);margin-top:0.15rem;">' + locDisplay + '</span>\
        </div>\
        <form id="rpStandaloneForm">\
          <div class="form-group"><label for="rp-name">Full Name</label><input type="text" id="rp-name" placeholder="Your name" required></div>\
          <div class="form-group"><label for="rp-email">Email</label><input type="email" id="rp-email" placeholder="hello@example.com" required></div>\
          <div class="form-group"><label for="rp-phone">Phone</label><input type="tel" id="rp-phone" placeholder="+44 7000 000 000"></div>\
          <div class="form-group"><label for="rp-move">Preferred Move-in</label><input type="date" id="rp-move"></div>\
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%;">Reserve – No Payment Required</button>\
          <p style="text-align:center;font-size:0.75rem;color:var(--clr-text-muted,#aaa);margin-top:0.75rem;">24-hour hold, no payment, no obligation.</p>\
        </form>\
      </div>\
    ';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closeStandalone() {
      overlay.remove();
      document.body.style.overflow = '';
    }
    overlay.querySelector('[data-close-rp]').addEventListener('click', closeStandalone);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeStandalone(); });

    document.getElementById('rpStandaloneForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('rp-name').value;
      var email = document.getElementById('rp-email').value;
      var phone = document.getElementById('rp-phone').value;
      var moveIn = document.getElementById('rp-move').value;

      fetch(BACKEND_API_URL + '/v1/public/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Project-Id': BACKEND_PROJECT_ID },
        body: JSON.stringify({
          fullName: name,
          email: email,
          phone: phone || null,
          moveInDate: moveIn || null,
          roomType: 'Any Room',
          location: locDisplay,
          sourceWebsite: 'nookrent.com',
          city: 'London'
        })
      }).catch(function () {});

      var formParent = e.target.parentElement;
      var formEl = e.target;
      formEl.innerHTML = '\
        <div style="text-align:center;padding:1.5rem 0;">\
          <div style="width:56px;height:56px;border-radius:50%;background:#ecfdf5;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">\
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>\
          </div>\
          <h3 style="margin:0 0 0.25rem;">You\'re all set!</h3>\
          <p style="color:var(--clr-coral,#E8855B);font-weight:500;margin:0 0 1rem;">Your room is reserved for 24 hours.</p>\
          <div style="background:var(--clr-cream-dark,#f0e6d6);border-radius:8px;padding:0.6rem 1rem;margin-bottom:1rem;"><strong>Any Room</strong><br><span style="font-size:0.85rem;color:var(--clr-text-muted,#aaa);">' + locDisplay + '</span></div>\
          <p style="color:var(--clr-text-light,#777);font-size:0.9rem;">No payment was charged. A member of our team will reach out shortly.</p>\
          <div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:8px;padding:0.5rem 1rem;margin-top:0.75rem;"><p style="font-size:0.75rem;color:#92400e;margin:0;">This hold expires in 24 hours.</p></div>\
        </div>\
      ';
    });
  }

  /* ── Init: show after 10 seconds ── */
  setTimeout(showBanner, 10000);
})();
