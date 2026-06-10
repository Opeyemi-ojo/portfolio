/* ========== WAIT FOR DOM TO LOAD ========== */

document.addEventListener('DOMContentLoaded', function() {

  /* =========SCROLL PROGRESS INDICATOR ========== */

  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', updateScrollProgress);
  window.addEventListener('resize', updateScrollProgress);

  /* ========= SECTION FADE-IN ON SCROLL ========== */

  const fadeInSections = document.querySelectorAll('.fade-in-section');

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  fadeInSections.forEach(section => fadeInObserver.observe(section));

  /* ======== PER-CARD REVEAL OBSERVER ========== */

  const revealCards = document.querySelectorAll('.reveal-card');

  const cardRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealCards.forEach(card => cardRevealObserver.observe(card));

  /* ========== TOAST NOTIFICATION HELPER ========== */

  function showToast(message, type = 'success') {
    const existing = document.getElementById('portfolioToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'portfolioToast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: ${type === 'success' ? '#4fffb0' : '#e53935'};
      color: #080c10; font-weight: 700; font-size: 14px; letter-spacing: 0.04em;
      padding: 12px 28px; border-radius: 40px;
      box-shadow: 0 8px 30px rgba(79,255,176,0.35);
      z-index: 9999; opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none; font-family: 'Syne', sans-serif;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  /* ========== THEME TOGGLE ========== */

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  const body = document.body;

  if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  }

  /* ========= AVAILABILITY STATUS ========== */

  const availabilityStatus = document.querySelector('.availability-status');
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');

  if (availabilityStatus) {
    const isAvailable = true;
    if (isAvailable) {
      statusDot.classList.remove('busy');
      statusText.textContent = 'Available for projects';
    } else {
      statusDot.classList.add('busy');
      statusText.textContent = 'Currently booked';
    }

    availabilityStatus.addEventListener('click', () => {
      const currentText = statusText.textContent;
      if (currentText === 'Available for projects') {
        statusText.textContent = "Let's work together!";
        setTimeout(() => { statusText.textContent = 'Available for projects'; }, 2000);
      } else if (currentText === 'Currently booked') {
        statusText.textContent = 'Back in 2 weeks';
        setTimeout(() => { statusText.textContent = 'Currently booked'; }, 2000);
      }
    });
  }

     /* ========== 5. DOWNLOAD CV ========== */
 
  const downloadCVBtn = document.getElementById('downloadCVBtn');
 
  if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', async (e) => {
      e.preventDefault();
 
      const fileUrl      = downloadCVBtn.getAttribute('href');
      const fileName     = downloadCVBtn.getAttribute('download') || 'Opeyemi_Ojo_CV.pdf';
      const originalHTML = downloadCVBtn.innerHTML;
 
      downloadCVBtn.innerHTML = '<span class="download-icon">⏳</span> Downloading…';
      downloadCVBtn.style.pointerEvents = 'none';
 
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('fetch failed');
 
        const blob       = await response.blob();
        const forcedBlob = new Blob([blob], { type: 'application/octet-stream' });
        const blobURL    = URL.createObjectURL(forcedBlob);
 
        const tempLink         = document.createElement('a');
        tempLink.href          = blobURL;
        tempLink.download      = fileName;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        setTimeout(() => URL.revokeObjectURL(blobURL), 2000);
 
        showToast('⬇ CV download started!', 'success');
      } catch (err) {

        showToast('⚠ error downloading cv', 'error');
        console.warn('CV fetch blocked — likely running on file:// protocol.', err);
      } finally {
        downloadCVBtn.innerHTML = originalHTML;
        downloadCVBtn.style.pointerEvents = '';
      }
    });
  }

  /* ========= MOBILE MENU TOGGLE ========== */

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('show');
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        menuToggle.textContent = '☰';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        menuToggle.textContent = '☰';
      }
    });
  }

  /* =========HERO WORD ROTATOR ========== */

  const rotator = document.getElementById('rotator');

  if (rotator) {
    const words = rotator.querySelectorAll('span');
    let current = 0;

    function rotateWord() {
      const prev = words[current];
      current = (current + 1) % words.length;
      const next = words[current];

      prev.classList.add('leaving');
      setTimeout(() => {
        prev.classList.remove('visible', 'leaving');
        next.classList.add('visible');
      }, 450);
    }

    setInterval(rotateWord, 2600);
  }

  /* ========= HERO MARQUEE BUILD ========== */

  const techStack = [
    { name: 'React',         dot: 'g' },
    { name: 'TypeScript',    dot: 'p' },
    { name: 'Next.js',       dot: '' },
    { name: 'Node.js',       dot: 'g' },
    { name: 'Tailwind CSS',  dot: 'p' },
    { name: 'GraphQL',       dot: 'r' },
    { name: 'Figma',         dot: 'r' },
    { name: 'Vite',          dot: 'g' },
    { name: 'PostgreSQL',    dot: 'p' },
    { name: 'Three.js',      dot: 'g' },
    { name: 'Docker',        dot: '' },
    { name: 'JavaScript',    dot: 'r' },
    { name: 'Supabase',      dot: 'g' },
    { name: 'Chart.js',       dot: 'p' },
    { name: 'Web3.js',       dot: 'r' },
    { name: 'MySQL',          dot: 'g' },
  ];

  function buildMarquee() {
    const track = document.getElementById('marquee-track');
    if (!track) return;
    const doubled = [...techStack, ...techStack];
    track.innerHTML = doubled.map(t => `
      <div class="marquee-item">
        <span class="marquee-dot ${t.dot}"></span>
        ${t.name}
      </div>
    `).join('');
  }
  buildMarquee();

  /* ==========HERO STATS COUNTER ========== */

  function animateHeroCounter(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => animateHeroCounter(document.getElementById('c1'), 30, 1600), 100);
        setTimeout(() => animateHeroCounter(document.getElementById('c2'), 18, 1800), 200);
        setTimeout(() => animateHeroCounter(document.getElementById('c3'), 2,  1400), 300);
        setTimeout(() => animateHeroCounter(document.getElementById('c4'), 120, 2000), 400);
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) statsObs.observe(statsRow);

  /* ========= HERO PILL MOUSE PARALLAX ========== */

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    document.querySelectorAll('.pill').forEach((pill, i) => {
      const depth = 0.3 + (i % 4) * 0.15;
      const x = dx * 18 * depth;
      const y = dy * 12 * depth;
      pill.style.transform = `translate(${x}px, ${y}px)`;
    });

    document.querySelectorAll('.orb').forEach((orb, i) => {
      const d = 0.04 + i * 0.02;
      orb.style.transform = `translate(${dx * 30 * d}px, ${dy * 20 * d}px)`;
    });
  });

  /* ========== SCROLL TO TOP BUTTON ========== */

  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========PROJECT FILTERS ========== */

 const filterBtns = document.querySelectorAll('.btn-filter');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');

      if (
        filterValue === 'all' ||
        categories.includes(filterValue)
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

  /* ========== 13. TESTIMONIALS CAROUSEL ========== */

  function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialTrack');
    if (!track || track.children.length === 0) return;

    const config = { autoplayInterval: 4000, transitionDuration: 600, pauseOnHover: true };
    let currentIndex = 0, autoplayTimer = null, isTransitioning = false;
    let cardsPerView = getCardsPerView();
    const originalCards = Array.from(track.children);
    const totalCards = originalCards.length;

    function getCardsPerView() { return window.innerWidth <= 768 ? 1 : 2; }
    function getGap() { return parseInt(window.getComputedStyle(track).gap) || 0; }
    function getCardWidth() { const first = track.children[0]; return first ? first.offsetWidth : 0; }

    function setupCards() {
      const cards = Array.from(track.children);
      cards.forEach((card, i) => { if (i >= totalCards) track.removeChild(card); });
      const cloneCount = Math.max(cardsPerView, totalCards);
      for (let i = 0; i < cloneCount; i++) {
        const clone = originalCards[i % totalCards].cloneNode(true);
        track.appendChild(clone);
      }
      currentIndex = 0;
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
    }

    function goToSlide(index, animate = true) {
      if (isTransitioning) return;
      isTransitioning = true;
      const slideDistance = getCardWidth() + getGap();
      track.style.transition = animate
        ? `transform ${config.transitionDuration}ms cubic-bezier(0.4,0,0.2,1)` : 'none';
      track.style.transform = `translateX(${-(index * slideDistance)}px)`;
      currentIndex = index;

      if (animate) {
        setTimeout(() => {
          if (currentIndex >= totalCards) {
            track.style.transition = 'none';
            currentIndex = currentIndex % totalCards;
            track.style.transform = `translateX(${-(currentIndex * slideDistance)}px)`;
            track.offsetHeight;
          }
          isTransitioning = false;
        }, config.transitionDuration);
      } else {
        isTransitioning = false;
      }
    }

    function nextSlide() { if (!isTransitioning) goToSlide(currentIndex + 1, true); }
    function startAutoplay() { stopAutoplay(); autoplayTimer = setInterval(nextSlide, config.autoplayInterval); }
    function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }

    let resizeTimeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newCPV = getCardsPerView();
        if (newCPV !== cardsPerView) {
          cardsPerView = newCPV;
          stopAutoplay(); setupCards(); startAutoplay();
        } else {
          goToSlide(currentIndex % totalCards, false);
        }
      }, 250);
    }

    if (config.pauseOnHover) {
      track.addEventListener('mouseenter', stopAutoplay);
      track.addEventListener('mouseleave', startAutoplay);
    }

    window.addEventListener('resize', handleResize);
    setupCards();
    startAutoplay();
  }

  initTestimonialsCarousel();

  /* ========== 14. INDUSTRIES TOGGLE ========== */

  const toggleIndustriesBtn = document.getElementById('toggleIndustriesBtn');
  const hiddenIndustries = document.querySelectorAll('.industry-card.hidden');

  if (toggleIndustriesBtn) {
    let industriesExpanded = false;
    toggleIndustriesBtn.addEventListener('click', () => {
      industriesExpanded = !industriesExpanded;
      hiddenIndustries.forEach(card => {
        card.classList.toggle('hidden', !industriesExpanded);
      });
      toggleIndustriesBtn.textContent = industriesExpanded ? 'See Less ▲' : 'See More ▼';
    });
  }

  /* ========== 15. CERTIFICATES TOGGLE ========== */

  const toggleCertificatesBtn = document.getElementById('toggleCertificatesBtn');
  const hiddenCertificates = document.querySelectorAll('.certificate-card.hidden');

  if (toggleCertificatesBtn) {
    let certificatesExpanded = false;
    toggleCertificatesBtn.addEventListener('click', () => {
      certificatesExpanded = !certificatesExpanded;
      hiddenCertificates.forEach(card => {
        card.classList.toggle('hidden', !certificatesExpanded);
      });
      toggleCertificatesBtn.textContent = certificatesExpanded ? 'See Less ▲' : 'See More ▼';
    });
  }


  /* ========== 17. FAQ ACCORDION ========== */

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('show');
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('show'));
      document.querySelectorAll('.faq-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        answer.classList.add('show');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ========== 18. SMOOTH SCROLL ========== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      if (targetId.length > 1) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
      }
    });
  });

  /* ========== 19. ACTIVE NAV ON SCROLL ========== */

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.hero-nav .nav-links a[href^="#"]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

 /* ========== 20. CONTACT FORM ========== */
  /* ====— Web3Forms ========== */
 
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
 
  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
 
      const name    = contactForm.querySelector('input[name="name"]').value.trim();
      const email   = contactForm.querySelector('input[name="email"]').value.trim();
      const message = contactForm.querySelector('textarea[name="message"]').value.trim();
 
      if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all fields.';
        formMessage.className   = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }
 
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText  = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;
      formMessage.style.display = 'none';
 
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const json = await response.json();
 
        if (json.success) {
          formMessage.textContent   = "✓ Message sent! I’ll get back to you shortly.";
          formMessage.className     = 'form-message success';
          formMessage.style.display = 'block';
          contactForm.reset();
          showToast('Message sent successfully! 🎉', 'success');
          setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
        } else {
          throw new Error(json.message || 'Send failed');
        }
      } catch (err) {
        formMessage.textContent   = '⚠ Could not send. Please email me directly at ojoopeyemi234@gmail.com';
        formMessage.className     = 'form-message error';
        formMessage.style.display = 'block';
        console.error('Web3Forms error:', err);
      } finally {
        submitBtn.textContent = origText;
        submitBtn.disabled    = false;
      }
    });
  }
/* ====— Whatsapp form ========== */
 
  const whatsappBtn = document.getElementById("whatsappBtn");

whatsappBtn.addEventListener("click", () => {
  const name = document.querySelector('input[name="name"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const message = document.querySelector('textarea[name="message"]').value;

  if (!name || !email || !message) {
    alert("Please fill in all fields first.");
    return;
  }

  const whatsappMessage = `Hello Opeyemi,

I found your portfolio and would like to reach out.

Name: ${name}
Email: ${email}

Message:
${message}`;

  const phoneNumber = "2348144645537";

  const whatsappURL =
    `https://wa.me/${2348144645537}?text=${encodeURIComponent(whatsappMessage)}`;

  window.open(whatsappURL, "_blank");
});

/* ==========Image Modal========== */

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");

document.querySelectorAll(".industries-image").forEach(img => {
  img.addEventListener("click", () => {
    modal.classList.add("active");
    modalImage.src = img.src;
    modalImage.alt = img.alt;

    document.body.style.overflow = "hidden";
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

  /* ========== 21. KEYBOARD NAVIGATION ========== */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nav = document.getElementById('navLinks');
      if (nav && nav.classList.contains('show')) {
        nav.classList.remove('show');
        menuToggle.textContent = '☰';
      }
      const modal = document.getElementById('certificateModal');
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  /* ========== CONSOLE MESSAGE ========== */

  console.log('%c👋 Hello Developer!', 'font-size: 20px; color: #4fffb0; font-weight: bold;');
  console.log('%cInterested in how this portfolio was built?', 'font-size: 14px; color:#4fffb0;');
  console.log('%cFeel free to reach out for collaborations!', 'font-size: 14px; color: #e53935;');

});