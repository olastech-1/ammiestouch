window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  const heroTitle = document.getElementById('hero-title');
  setTimeout(() => {
    loader.classList.add('is-hidden');
    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('is-visible'), 200);
    }
  }, 600);
});

const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = percent + '%';
}
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

const siteNav = document.getElementById('site-nav');
function updateNavBackground() {
  siteNav.classList.toggle('is-scrolled', window.scrollY > 40);
}
updateNavBackground();
window.addEventListener('scroll', updateNavBackground);

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.querySelectorAll('[data-nav]').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateActiveNav() {
  let currentId = '';
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentId = '#' + section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === currentId);
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay') || 0;
        setTimeout(() => el.classList.add('is-visible'), Number(delay));
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((counter) => counterObserver.observe(counter));

function animateCounter(el) {
  const target = Number(el.getAttribute('data-target'));
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(tick);
}

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.masonry-item').forEach((item) => {
      const match = filter === 'all' || item.getAttribute('data-category') === filter;
      item.classList.toggle('is-hidden', !match);
    });
  });
});

const magneticButtons = document.querySelectorAll('[data-magnetic]');
magneticButtons.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

document.querySelectorAll('[data-ba-slider]').forEach((slider) => {
  const afterWrap = slider.querySelector('.ba-after-wrap');
  const handle = slider.querySelector('[data-ba-handle]');
  let dragging = false;

  function setPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    afterWrap.style.width = percent + '%';
    handle.style.left = percent + '%';
  }

  handle.addEventListener('mousedown', () => { dragging = true; });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (dragging) setPosition(e.clientX);
  });

  handle.addEventListener('touchstart', () => { dragging = true; });
  window.addEventListener('touchend', () => { dragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (dragging && e.touches[0]) setPosition(e.touches[0].clientX);
  });

  slider.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    setPosition(e.clientX);
  });
});

const testimonialTrack = document.getElementById('testimonial-track');
const testimonialDotsWrap = document.getElementById('testimonial-dots');
if (testimonialTrack) {
  const slides = testimonialTrack.children;
  let activeSlide = 0;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    testimonialDotsWrap.appendChild(dot);
  }

  function goToSlide(index) {
    activeSlide = index;
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    Array.from(testimonialDotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  setInterval(() => {
    const next = (activeSlide + 1) % slides.length;
    goToSlide(next);
  }, 6000);
}

document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

function validateForm(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach((field) => {
    const group = field.closest('.form-group');
    const filled = field.type === 'file' ? field.files.length > 0 : field.value.trim() !== '';
    if (!filled) {
      isValid = false;
      if (group) group.classList.add('has-error');
    } else if (group) {
      group.classList.remove('has-error');
    }
  });
  return isValid;
}

document.querySelectorAll('.form-group input, .form-group select').forEach((field) => {
  field.addEventListener('input', () => {
    const group = field.closest('.form-group');
    const filled = field.type === 'file' ? field.files.length > 0 : field.value.trim() !== '';
    if (filled && group) group.classList.remove('has-error');
  });
});

const serviceSelect = document.getElementById('service');
const selectedServiceChip = document.getElementById('selected-service-chip');
const selectedServiceText = document.getElementById('selected-service-text');
const paymentServiceName = document.getElementById('payment-service-name');
const paymentServicePrice = document.getElementById('payment-service-price');
const paymentRowAmount = document.getElementById('payment-row-amount');

function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG');
}

function updatePaymentDisplay() {
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  if (!selectedOption || !selectedOption.value) {
    selectedServiceChip.style.display = 'none';
    paymentServiceName.textContent = 'Select a service above';
    paymentServicePrice.textContent = '—';
    if (paymentRowAmount) paymentRowAmount.textContent = 'As agreed for your service';
    return;
  }
  const name = selectedOption.value;
  const price = selectedOption.getAttribute('data-price');
  selectedServiceChip.style.display = 'block';
  selectedServiceText.textContent = 'Selected: ' + name + ' — ' + formatNaira(price);
  paymentServiceName.textContent = name;
  paymentServicePrice.textContent = formatNaira(price);
  if (paymentRowAmount) paymentRowAmount.textContent = formatNaira(price);
}

if (serviceSelect) {
  serviceSelect.addEventListener('change', updatePaymentDisplay);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.book-trigger');
  if (!btn) return;
  e.preventDefault();
  const serviceName = btn.getAttribute('data-service');
  const price = btn.getAttribute('data-price');
  let matchOption = Array.from(serviceSelect.options).find((opt) => opt.value === serviceName);

  if (!matchOption && serviceName) {
    matchOption = document.createElement('option');
    matchOption.value = serviceName;
    matchOption.setAttribute('data-price', price || '0');
    matchOption.textContent = serviceName + ' — ' + formatNaira(price || 0);
    serviceSelect.appendChild(matchOption);
  }

  if (matchOption) {
    serviceSelect.value = serviceName;
    updatePaymentDisplay();
  }
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');
const bookingRefDisplay = document.getElementById('booking-ref-display');
const proofBookingIdField = document.getElementById('proofBookingId');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(bookingForm)) return;

    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const bookingData = {
      full_name: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim(),
      email: document.getElementById('email').value.trim(),
      service: selectedOption ? selectedOption.value : '',
      price: selectedOption ? Number(selectedOption.getAttribute('data-price')) : 0,
      preferred_date: document.getElementById('date').value,
      preferred_time: document.getElementById('time').value,
      message: document.getElementById('message').value.trim(),
      status: 'pending'
    };

    let bookingRef = 'PENDING';

    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      try {
        const result = await supabaseClient.from('bookings').insert([bookingData]).select().single();
        if (result.error) throw result.error;
        bookingRef = result.data.id;
      } catch (err) {
        console.warn('Could not save booking to Supabase:', err.message);
      }
    }

    sessionStorage.setItem('lastBookingId', bookingRef);
    if (proofBookingIdField) proofBookingIdField.value = bookingRef;
    if (bookingRefDisplay) bookingRefDisplay.textContent = '#' + bookingRef;

    bookingForm.style.display = 'none';
    bookingSuccess.classList.add('is-visible');
    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

const proofForm = document.getElementById('proof-form');
const proofSuccess = document.getElementById('proof-success');

if (proofForm) {
  proofForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(proofForm)) return;

    const fileInput = document.getElementById('proofFile');
    const file = fileInput.files[0];
    const bookingId = proofBookingIdField ? proofBookingIdField.value : sessionStorage.getItem('lastBookingId');

    const proofData = {
      booking_id: bookingId || null,
      transaction_ref: document.getElementById('txRef').value.trim(),
      amount_paid: document.getElementById('amountPaid').value.trim(),
      note: document.getElementById('proofNote').value.trim(),
      screenshot_path: '',
      status: 'pending'
    };

    if (typeof supabaseClient !== 'undefined' && supabaseClient && file) {
      try {
        const filePath = (bookingId || 'unmatched') + '/' + Date.now() + '_' + file.name;
        const uploadResult = await supabaseClient.storage.from('payment-proofs').upload(filePath, file);
        if (uploadResult.error) throw uploadResult.error;
        proofData.screenshot_path = filePath;

        const insertResult = await supabaseClient.from('payment_proofs').insert([proofData]);
        if (insertResult.error) throw insertResult.error;
      } catch (err) {
        console.warn('Could not save payment proof to Supabase:', err.message);
      }
    }

    proofForm.style.display = 'none';
    proofSuccess.classList.add('is-visible');
    proofSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

const newsletterForm = document.getElementById('newsletter-form');
const newsletterSuccess = document.getElementById('newsletter-success');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailField = document.getElementById('newsletterEmail');
    if (emailField.value.trim() !== '') {
      newsletterForm.reset();
      newsletterSuccess.classList.add('is-visible');
    }
  });
}

async function loadGalleryFromSupabase() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  const gallery = document.getElementById('results-gallery');
  const note = document.getElementById('gallery-note');
  try {
    const result = await supabaseClient.from('gallery_images').select('*').order('created_at', { ascending: false });
    if (result.error) throw result.error;
    const data = result.data;
    if (!data || data.length === 0) return;

    gallery.innerHTML = '';
    data.forEach((img) => {
      const item = document.createElement('div');
      item.className = 'pin-item is-visible';
      item.innerHTML = '<img src="' + img.image_url + '" alt="' + (img.caption || "Ammie's Touch gallery photo") + '" loading="lazy" data-lightbox>';
      gallery.appendChild(item);
    });
    attachLightboxHandlers();
    if (note) note.textContent = 'Fresh from the studio ✦';
  } catch (err) {
    console.warn('Could not load gallery from Supabase:', err.message);
  }
}
loadGalleryFromSupabase();

/* ---------- Nails & Braiding: load from Supabase "services" table if configured ---------- */

const emptyStateStyle = document.createElement('style');
emptyStateStyle.textContent =
  '.empty-service-state{grid-column:1/-1;column-span:all;text-align:center;background:#fff;border-radius:20px;padding:48px 32px;box-shadow:0 12px 30px rgba(43,36,32,0.08);}' +
  '.empty-service-title{font-family:"Fraunces",serif;font-size:1.3rem;color:#2B2420;margin-bottom:12px;}' +
  '.empty-service-desc{font-size:0.94rem;line-height:1.7;color:rgba(43,36,32,0.65);max-width:440px;margin:0 auto 22px;}' +
  '.empty-service-cta{justify-content:center;}';
document.head.appendChild(emptyStateStyle);

function emptyStateHtml(craft) {
  return '<div class="empty-service-state">' +
    '<p class="empty-service-title">Beautiful new ' + craft + ' looks are on the way ✦</p>' +
    '<p class="empty-service-desc">Ammie is putting together something special. Message us on WhatsApp and we\'ll help you pick the perfect style for your next appointment.</p>' +
    '<a href="https://wa.me/2348081156211" target="_blank" rel="noopener" class="btn-whatsapp-inline empty-service-cta">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.44-1.35a9.9 9.9 0 004.6 1.14h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.15c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.91-1.26-4.81-4.19-4.96-4.38-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.36.76-.36h.55c.18 0 .42-.02.65.5.24.55.82 1.9.9 2.04.07.14.12.3.02.49-.1.19-.15.3-.3.46-.14.16-.3.36-.43.48-.14.13-.29.28-.13.56.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.45.12.61-.08.16-.2.7-.83.9-1.11.19-.28.38-.23.63-.14.26.1 1.62.77 1.9.91.27.14.46.2.53.32.07.11.07.66-.17 1.33z"/></svg>' +
    'Chat with Ammie on WhatsApp</a>' +
    '</div>';
}

function renderNailCard(item) {
  const tall = item.subcategory === 'gel' || item.subcategory === 'repair' ? '' : ' masonry-tall';
  return '<div class="masonry-item" data-category="' + (item.subcategory || 'all') + '">' +
    '<div class="masonry-card' + tall + '">' +
    '<img src="' + item.image_url + '" alt="' + (item.name || 'Nail style') + '" loading="lazy">' +
    '<div class="masonry-overlay">' +
    '<span class="masonry-tag">' + (item.subcategory || 'Nails') + '</span>' +
    '<h3 class="masonry-title">' + item.name + '</h3>' +
    '<p class="masonry-price">From ' + formatNaira(item.price) + '</p>' +
    '<a href="#booking" class="masonry-book book-trigger" data-service="' + item.name + '" data-price="' + item.price + '">Book Now</a>' +
    '</div></div></div>';
}

function renderBraidCard(item) {
  return '<div class="hair-card">' +
    '<div class="hair-card-media"><img src="' + item.image_url + '" alt="' + (item.name || 'Braiding style') + '" loading="lazy"></div>' +
    '<div class="hair-card-body">' +
    '<h3 class="hair-card-title">' + item.name + '</h3>' +
    '<p class="hair-card-desc">' + (item.description || '') + '</p>' +
    '<div class="hair-card-footer">' +
    '<span class="hair-card-price">From ' + formatNaira(item.price) + '</span>' +
    '<a href="#booking" class="hair-card-cta book-trigger" data-service="' + item.name + '" data-price="' + item.price + '">Book Now</a>' +
    '</div></div></div>';
}

/* Rebuilds an <optgroup> in the booking form's Service dropdown from live data.
   Keeps the currently selected value selected if it still exists after the rebuild. */
function rebuildOptgroup(optgroupId, items) {
  const optgroup = document.getElementById(optgroupId);
  if (!optgroup || !items || items.length === 0) return;
  const previousValue = serviceSelect ? serviceSelect.value : '';
  optgroup.innerHTML = items.map((item) =>
    '<option value="' + escapeAttr(item.name) + '" data-price="' + Number(item.price) + '">' +
    escapeAttr(item.name) + ' — ' + formatNaira(item.price) + (item.period ? item.period : '') +
    '</option>'
  ).join('');
  if (previousValue && serviceSelect) {
    const stillExists = Array.from(serviceSelect.options).some((opt) => opt.value === previousValue);
    if (stillExists) serviceSelect.value = previousValue;
  }
}

function escapeAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function loadServicesFromSupabase() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  const nailsGrid = document.getElementById('nails-grid');
  const braidingGrid = document.getElementById('braiding-grid');

  try {
    const result = await supabaseClient.from('services').select('*').order('created_at', { ascending: false });
    if (result.error) throw result.error;
    const data = result.data || [];

    const nails = data.filter((item) => item.category === 'nails');
    const braiding = data.filter((item) => item.category === 'braiding');

    if (nails.length > 0) {
      nailsGrid.innerHTML = nails.map(renderNailCard).join('');
      rebuildOptgroup('optgroup-nails', nails);
    } else {
      nailsGrid.innerHTML = emptyStateHtml('nail');
    }

    if (braiding.length > 0) {
      braidingGrid.innerHTML = braiding.map(renderBraidCard).join('');
      rebuildOptgroup('optgroup-braiding', braiding);
    } else {
      braidingGrid.innerHTML = emptyStateHtml('braiding');
    }
  } catch (err) {
    console.warn('Could not load services from Supabase:', err.message);
  }
}
loadServicesFromSupabase();

/* ---------- Pricing Packages & Membership: load from Supabase "packages" table ---------- */

function renderPricingCard(pkg) {
  const features = Array.isArray(pkg.features) ? pkg.features : [];
  const popularClass = pkg.is_featured ? ' pricing-popular' : '';
  const badge = pkg.is_featured ? '<span class="pricing-badge">' + (pkg.badge_text || 'Most Popular') + '</span>' : '';
  const ctaClass = pkg.is_featured ? 'pricing-cta pricing-cta-primary book-trigger' : 'pricing-cta book-trigger';
  return '<div class="pricing-card' + popularClass + '">' +
    badge +
    '<h3 class="pricing-name">' + escapeAttr(pkg.name) + '</h3>' +
    '<p class="pricing-sub">' + escapeAttr(pkg.subtitle || '') + '</p>' +
    '<div class="pricing-amount"><span>₦</span>' + Number(pkg.price).toLocaleString('en-NG') + '</div>' +
    '<ul class="pricing-features">' + features.map((f) => '<li>' + escapeAttr(f) + '</li>').join('') + '</ul>' +
    '<a href="#booking" class="' + ctaClass + '" data-service="' + escapeAttr(pkg.name) + '" data-price="' + Number(pkg.price) + '">Book ' + escapeAttr(pkg.name) + '</a>' +
    '</div>';
}

function renderVipCard(pkg) {
  const features = Array.isArray(pkg.features) ? pkg.features : [];
  const featuredClass = pkg.is_featured ? ' vip-card-featured' : '';
  const badge = pkg.is_featured ? '<span class="vip-badge">' + (pkg.badge_text || 'Best Value') + '</span>' : '';
  const ctaClass = pkg.is_featured ? 'vip-cta vip-cta-primary book-trigger' : 'vip-cta book-trigger';
  return '<div class="vip-card' + featuredClass + '">' +
    badge +
    '<h3 class="vip-name">' + escapeAttr(pkg.name) + '</h3>' +
    '<div class="vip-price"><span>₦</span>' + Number(pkg.price).toLocaleString('en-NG') + '<span class="vip-period">' + escapeAttr(pkg.period || '/month') + '</span></div>' +
    '<ul class="vip-features">' + features.map((f) => '<li>' + escapeAttr(f) + '</li>').join('') + '</ul>' +
    '<a href="#booking" class="' + ctaClass + '" data-service="' + escapeAttr(pkg.name) + '" data-price="' + Number(pkg.price) + '">Join ' + escapeAttr(pkg.name) + '</a>' +
    '</div>';
}

async function loadPackagesFromSupabase() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  const pricingGrid = document.getElementById('pricing-grid');
  const vipGrid = document.getElementById('vip-grid');

  try {
    const result = await supabaseClient.from('packages').select('*').order('price', { ascending: true });
    if (result.error) throw result.error;
    const data = result.data || [];

    const packages = data.filter((item) => item.type === 'package');
    const memberships = data.filter((item) => item.type === 'membership');

    if (packages.length > 0) {
      pricingGrid.innerHTML = packages.map(renderPricingCard).join('');
      rebuildOptgroup('optgroup-packages', packages);
    }
    if (memberships.length > 0) {
      vipGrid.innerHTML = memberships.map(renderVipCard).join('');
      rebuildOptgroup('optgroup-membership', memberships.map((m) => ({ name: m.name, price: m.price, period: m.period || '/month' })));
    }
  } catch (err) {
    console.warn('Could not load packages from Supabase:', err.message);
  }
}
loadPackagesFromSupabase();

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function attachLightboxHandlers() {
  document.querySelectorAll('[data-lightbox]').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    });
  });
}
attachLightboxHandlers();

function closeLightbox() {
  lightbox.classList.remove('is-open');
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 600);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});