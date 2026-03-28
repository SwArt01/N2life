/**
 * N2Life Spor — Main JavaScript
 * Global interactions, navigation, reveal animations
 */

// ── Navigation ──────────────────────────────────────
(function initNav() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll → nav background change
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    });
  });

  // Active nav link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Scroll Reveal Animation ──────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

// ── Animated Counter ─────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString('tr-TR');
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ── Gallery Lightbox ─────────────────────────────────
window.initLightbox = function () {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox DOM
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-overlay"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="Kapat">✕</button>
      <button class="lb-prev" aria-label="Önceki">‹</button>
      <button class="lb-next" aria-label="Sonraki">›</button>
      <img class="lb-img" src="" alt="Galeri görseli">
      <p class="lb-caption"></p>
    </div>
  `;
  document.body.appendChild(lb);

  const lbEl = document.getElementById('lightbox');
  const lbImg = lbEl.querySelector('.lb-img');
  const lbCaption = lbEl.querySelector('.lb-caption');
  let current = 0;

  const show = (index) => {
    current = index;
    const item = items[index];
    lbImg.src = item.querySelector('img').src;
    lbCaption.textContent = item.dataset.caption || '';
    lbEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const hide = () => {
    lbEl.classList.remove('active');
    document.body.style.overflow = '';
  };

  items.forEach((item, i) => item.addEventListener('click', () => show(i)));
  lbEl.querySelector('.lb-close').addEventListener('click', hide);
  lbEl.querySelector('.lb-overlay').addEventListener('click', hide);
  lbEl.querySelector('.lb-prev').addEventListener('click', () => show((current - 1 + items.length) % items.length));
  lbEl.querySelector('.lb-next').addEventListener('click', () => show((current + 1) % items.length));

  document.addEventListener('keydown', (e) => {
    if (!lbEl.classList.contains('active')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show((current - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') show((current + 1) % items.length);
  });
};

// ── BMI Calculator ───────────────────────────────────
window.initBMICalculator = function () {
  const form = document.getElementById('bmi-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('bmi-height').value) / 100;
    const weight = parseFloat(document.getElementById('bmi-weight').value);

    if (!height || !weight || height <= 0 || weight <= 0) return;

    const bmi = weight / (height * height);
    const rounded = bmi.toFixed(1);

    let category, color;
    if (bmi < 18.5)      { category = 'Zayıf'; color = '#5BC0EB'; }
    else if (bmi < 25)   { category = 'Normal'; color = '#CCFF00'; }
    else if (bmi < 30)   { category = 'Fazla Kilolu'; color = '#FFB347'; }
    else                 { category = 'Obez'; color = '#FF6B6B'; }

    const result = document.getElementById('bmi-result');
    result.style.display = 'block';
    document.getElementById('bmi-value').textContent = rounded;
    document.getElementById('bmi-value').style.color = color;
    document.getElementById('bmi-category').textContent = category;
    document.getElementById('bmi-category').style.color = color;

    // Needle position
    const pct = Math.min(Math.max((bmi - 10) / (45 - 10), 0), 1) * 100;
    document.getElementById('bmi-needle').style.left = pct + '%';

    result.classList.remove('reveal');
    void result.offsetWidth;
    result.classList.add('reveal', 'visible');
  });
};

// ── TDEE Calculator ──────────────────────────────────
window.initTDEECalculator = function () {
  const form = document.getElementById('tdee-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const age    = parseFloat(document.getElementById('tdee-age').value);
    const weight = parseFloat(document.getElementById('tdee-weight').value);
    const height = parseFloat(document.getElementById('tdee-height').value);
    const gender = document.getElementById('tdee-gender').value;
    const activity = parseFloat(document.getElementById('tdee-activity').value);

    // Mifflin-St Jeor
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = Math.round(bmr * activity);
    const protein = Math.round(weight * 2);  // 2g/kg
    const carbs   = Math.round((tdee * 0.45) / 4);
    const fat     = Math.round((tdee * 0.25) / 9);

    document.getElementById('tdee-result').style.display = 'block';
    document.getElementById('tdee-calories').textContent = tdee.toLocaleString('tr-TR');
    document.getElementById('tdee-protein').textContent  = protein + 'g';
    document.getElementById('tdee-carbs').textContent    = carbs + 'g';
    document.getElementById('tdee-fat').textContent      = fat + 'g';

    // Bars
    const total = protein * 4 + carbs * 4 + fat * 9;
    document.getElementById('bar-protein').style.width = Math.round(protein * 4 / total * 100) + '%';
    document.getElementById('bar-carbs').style.width   = Math.round(carbs * 4 / total * 100) + '%';
    document.getElementById('bar-fat').style.width     = Math.round(fat * 9 / total * 100) + '%';

    const res = document.getElementById('tdee-result');
    res.classList.remove('reveal');
    void res.offsetWidth;
    res.classList.add('reveal', 'visible');
  });
};

// ── Contact Form ─────────────────────────────────────
window.initContactForm = function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'GÖNDERİLDİ ✓';
    btn.style.background = '#CCFF00';
    btn.style.color = '#283500';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'MESAJ GÖNDER';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
};

// ── Fat Percentage Calculator ────────────────────────
window.initFatCalculator = function () {
  const form = document.getElementById('fat-form');
  if (!form) return;

  const maleRadio = document.getElementById('fat-gender-male');
  const femaleRadio = document.getElementById('fat-gender-female');
  const hipGroup = document.getElementById('fat-hip-group');

  if (maleRadio && femaleRadio) {
    maleRadio.addEventListener('change', () => { if (hipGroup) hipGroup.style.display = 'none'; });
    femaleRadio.addEventListener('change', () => { if (hipGroup) hipGroup.style.display = 'block'; });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isMale = maleRadio.checked;
    const h = parseFloat(document.getElementById('fat-height').value);
    const w = parseFloat(document.getElementById('fat-weight').value);
    const neck = parseFloat(document.getElementById('fat-neck').value);
    const waist = parseFloat(document.getElementById('fat-waist').value);
    const hip = parseFloat(document.getElementById('fat-hip').value) || 0;

    if (!h || !w || !neck || !waist) return;
    if (!isMale && !hip) return;

    let bodyFat;
    if (isMale) {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
    }

    bodyFat = Math.max(2, Math.min(bodyFat, 60)); // clamp between a realistic range

    let category, color;
    if (isMale) {
      if (bodyFat < 6) { category = 'Esansiyel Yağ'; color = '#5BC0EB'; }
      else if (bodyFat <= 13) { category = 'Atletik'; color = '#CCFF00'; }
      else if (bodyFat <= 17) { category = 'Fit'; color = '#ABD600'; }
      else if (bodyFat <= 24) { category = 'Normal'; color = '#FFB347'; }
      else { category = 'Obez'; color = '#FF6B6B'; }
    } else {
      if (bodyFat < 14) { category = 'Esansiyel Yağ'; color = '#5BC0EB'; }
      else if (bodyFat <= 20) { category = 'Atletik'; color = '#CCFF00'; }
      else if (bodyFat <= 24) { category = 'Fit'; color = '#ABD600'; }
      else if (bodyFat <= 31) { category = 'Normal'; color = '#FFB347'; }
      else { category = 'Obez'; color = '#FF6B6B'; }
    }

    const leanBodyMass = w * (1 - (bodyFat / 100));

    document.getElementById('fat-result').style.display = 'block';
    document.getElementById('fat-value').textContent = bodyFat.toFixed(1);
    document.getElementById('fat-value').style.color = color;
    document.getElementById('fat-category').textContent = category;
    document.getElementById('fat-category').style.color = color;
    document.getElementById('fat-lean-mass').textContent = leanBodyMass.toFixed(1) + ' kg';

    const res = document.getElementById('fat-result');
    res.classList.remove('reveal');
    void res.offsetWidth;
    res.classList.add('reveal', 'visible');
  });
};

// ── 1RM Calculator ───────────────────────────────────
window.initOneRMCalculator = function () {
  const form = document.getElementById('onerm-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('onerm-weight').value);
    const reps   = parseFloat(document.getElementById('onerm-reps').value);

    if (!weight || !reps || weight <= 0 || reps <= 0) return;

    let oneRM;
    if (reps === 1) {
      oneRM = weight;
    } else {
      // Epley Formula
      oneRM = weight * (1 + 0.0333 * reps);
    }

    document.getElementById('onerm-result').style.display = 'block';
    document.getElementById('onerm-value').textContent = Math.round(oneRM);
    
    document.getElementById('onerm-95').textContent = Math.round(oneRM * 0.95) + ' kg';
    document.getElementById('onerm-90').textContent = Math.round(oneRM * 0.90) + ' kg';
    document.getElementById('onerm-85').textContent = Math.round(oneRM * 0.85) + ' kg';
    document.getElementById('onerm-80').textContent = Math.round(oneRM * 0.80) + ' kg';
    document.getElementById('onerm-75').textContent = Math.round(oneRM * 0.75) + ' kg';
    document.getElementById('onerm-70').textContent = Math.round(oneRM * 0.70) + ' kg';

    const res = document.getElementById('onerm-result');
    res.classList.remove('reveal');
    void res.offsetWidth;
    res.classList.add('reveal', 'visible');
  });
};
