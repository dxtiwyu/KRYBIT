/* ============================================
   KRYBIT — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTerminal();
  initPipelineViz();
  initScrollReveal();
  initStatCounters();
  initWaitlistForm();
});

/* ---- Navbar scroll effect & hamburger ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        navLinks.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---- Terminal Typing Animation ---- */
function initTerminal() {
  const container = document.getElementById('terminal-lines');
  const cursor = document.getElementById('terminal-cursor');

  const lines = [
    { prompt: '❯', text: 'krybit agent --watch main', cls: '' },
    { prompt: '⠋', text: 'Webhook received: push to main (commit a3f9c2d)', cls: 'info' },
    { prompt: '⠋', text: 'Parsing diff... 3 files changed in /src/auth', cls: 'info' },
    { prompt: '✓', text: 'Mapped changes → Login.tsx, Register.tsx, AuthGuard.tsx', cls: 'success' },
    { prompt: '⠋', text: 'Spinning up sandbox → launching headless Chromium...', cls: 'info' },
    { prompt: '✓', text: 'DOM snapshot captured: 47 elements across /login, /register, /dashboard', cls: 'success' },
    { prompt: '⠋', text: 'Sending diff + DOM snapshot + existing specs to Anthropic API...', cls: 'info' },
    { prompt: '⠋', text: 'Claude analyzing affected user flows...', cls: 'info' },
    { prompt: '✓', text: 'Generated 12 new assertions for auth.spec.ts', cls: 'success' },
    { prompt: '✓', text: 'Self-healed 3 broken selectors in dashboard.spec.ts (.btn-login → .auth-submit)', cls: 'success' },
    { prompt: '⠋', text: 'Committing to branch krybit/test-update-482...', cls: 'info' },
    { prompt: '⠋', text: 'Triggering GitHub Actions → running full Playwright suite...', cls: 'warn' },
    { prompt: '✓', text: '47/47 tests passed. PR #482 auto-merged into main.', cls: 'success' },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;
  let textSpan = null;

  function typeLine() {
    if (lineIndex >= lines.length) {
      // Reset after a pause
      setTimeout(() => {
        container.innerHTML = '';
        lineIndex = 0;
        typeLine();
      }, 4000);
      return;
    }

    const line = lines[lineIndex];

    if (charIndex === 0) {
      currentLineEl = document.createElement('div');
      currentLineEl.className = `terminal-line ${line.cls}`;

      const promptSpan = document.createElement('span');
      promptSpan.className = 'prompt';
      promptSpan.textContent = line.prompt + ' ';

      textSpan = document.createElement('span');
      textSpan.className = 'cmd';

      currentLineEl.appendChild(promptSpan);
      currentLineEl.appendChild(textSpan);
      container.appendChild(currentLineEl);

      // Keep terminal scrolled to bottom
      const body = document.getElementById('terminal-body');
      body.scrollTop = body.scrollHeight;
    }

    if (charIndex < line.text.length) {
      textSpan.textContent += line.text[charIndex];
      charIndex++;
      const speed = 18 + Math.random() * 25;
      setTimeout(typeLine, speed);
    } else {
      charIndex = 0;
      lineIndex++;
      const delay = lineIndex <= 1 ? 600 : 250 + Math.random() * 400;
      setTimeout(typeLine, delay);
    }
  }

  // Start after initial delay
  setTimeout(typeLine, 1200);
}

/* ---- Pipeline Visualization ---- */
function initPipelineViz() {
  const nodes = document.querySelectorAll('.pipeline-node');
  const detailText = document.getElementById('detail-text');

  const details = [
    'git push origin main → webhook fires → Krybit GitHub App receives payload',
    'Parsing commit diff → 3 files changed: Login.tsx (+22), Register.tsx (+18), AuthGuard.tsx (+7)',
    'POST api.anthropic.com/v1/messages → diff + DOM snapshot + test context → response: updated assertions',
    'Writing auth.spec.ts → 12 new Playwright assertions → patching 3 stale selectors in dashboard.spec.ts',
    '✓ 47/47 passed → branch krybit/test-update-482 → PR opened → CI green → auto-merged'
  ];

  let currentStep = 0;
  let typeTimer = null;

  function typeDetail(text) {
    if (typeTimer) clearTimeout(typeTimer);
    detailText.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        detailText.textContent += text[i];
        i++;
        typeTimer = setTimeout(type, 12 + Math.random() * 15);
      }
    }
    type();
  }

  function activateStep(index) {
    nodes.forEach((n, i) => n.classList.toggle('active', i === index));
    typeDetail(details[index]);
  }

  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      currentStep = i;
      activateStep(i);
    });
    node.addEventListener('mouseenter', () => {
      activateStep(i);
    });
  });

  // Auto-cycle
  function autoCycle() {
    activateStep(currentStep);
    currentStep = (currentStep + 1) % nodes.length;
    setTimeout(autoCycle, 3500);
  }
  setTimeout(autoCycle, 2000);
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.pipeline-card, .stat-card, .testimonial-card, .trusted-banner, .waitlist-card, .section-header'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ---- Animated Stat Counters ---- */
function initStatCounters() {
  const statCards = document.querySelectorAll('.stat-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.stat-number');
          if (numEl && !numEl.dataset.animated) {
            numEl.dataset.animated = 'true';
            animateCounter(numEl);
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  statCards.forEach(card => observer.observe(card));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  const isLarge = target > 100000;
  const duration = 2000;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const current = easedProgress * target;

    if (isFloat) {
      el.textContent = current.toFixed(2);
    } else if (isLarge) {
      el.textContent = formatLargeNumber(Math.round(current));
    } else {
      el.textContent = Math.round(current).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (isFloat) {
        el.textContent = target.toFixed(2);
      } else if (isLarge) {
        el.textContent = formatLargeNumber(target);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
  }

  requestAnimationFrame(update);
}

function formatLargeNumber(n) {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(0) + 'K';
  }
  return n.toLocaleString();
}

/* ---- Waitlist Form ---- */
function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const btn = document.getElementById('waitlist-submit');
  const input = document.getElementById('waitlist-email');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = input.value.trim();
    if (!email) return;

    // Visual feedback
    btn.innerHTML = '<span>✓ You\'re on the list</span>';
    btn.style.background = '#28c840';
    btn.style.pointerEvents = 'none';
    input.disabled = true;
    input.value = email;

    // Reset after a few seconds
    setTimeout(() => {
      btn.innerHTML = '<span>Request Access</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.style.background = '';
      btn.style.pointerEvents = '';
      input.disabled = false;
      input.value = '';
    }, 3000);
  });
}
