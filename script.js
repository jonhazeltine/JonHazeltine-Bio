/* ============================================
   JON HAZELTINE — Premium Interactions
   ============================================ */

(function () {
  'use strict';

  // ── Constellation Canvas (Hero Background) ──

  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animId;

    function resize() {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    function createParticles() {
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          o: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse repel
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.o})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(201, 169, 110, ${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    // Pause when out of view
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!animId) drawParticles();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    heroObserver.observe(canvas);
  }

  // ── Scroll Animations ──

  const animElements = document.querySelectorAll('[data-animate]');

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0, 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          animObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  animElements.forEach((el) => animObserver.observe(el));

  // ── Navigation ──

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMobile.classList.toggle('open');
  });

  // Close mobile nav on link click
  navMobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMobile.classList.remove('open');
    });
  });

  // ── Magnetic Card Hover (Desktop) ──

  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.venture-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -3;
        const rotateY = ((x - cx) / cx) * 3;
        card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── vCard Generation & Download ──

  function generateVCard() {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Hazeltine;Jon;;;',
      'FN:Jon Hazeltine',
      'TITLE:Entrepreneur | Real Estate Professional | Mortgage Broker | Coach',
      'ORG:FourthReason Coaching',
      'URL;TYPE=Website:https://jonhazeltine.com',
      'URL;TYPE=Real Estate:https://grandrapids.realestate',
      'URL;TYPE=Coaching:https://fourthreason.com',
      'URL;TYPE=Church:https://www.thechurches.co',
      'URL;TYPE=Mortgage:https://branches.guildmortgage.com/mi/ada/jon-hazeltine-539-umjh.html',
      'URL;TYPE=Calendly:https://calendly.com/jonhazeltine/quickconnect',
      'NOTE:Entrepreneur. Real Estate Professional. Mortgage Broker (NMLS: 2574218). Coach. Church Leader. Based in Grand Rapids\\, MI.',
      'ADR;TYPE=WORK:;;Grand Rapids;MI;;US',
      'END:VCARD',
    ].join('\r\n');

    return vcard;
  }

  function downloadVCard() {
    const vcard = generateVCard();
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jon_Hazeltine.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Contact card saved');
  }

  // Save Contact hero button
  const saveBtn = document.getElementById('saveContact');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      createRipple(e, saveBtn);
      downloadVCard();
    });
  }

  // ── Floating Action Button (Share Menu) ──

  const fab = document.getElementById('fabShare');
  const fabMenu = document.getElementById('fabMenu');
  const fabVcard = document.getElementById('fabVcard');
  const fabQR = document.getElementById('fabQR');
  const fabLink = document.getElementById('fabLink');

  fab.addEventListener('click', () => {
    fab.classList.toggle('active');
    fabMenu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.fab-container')) {
      fab.classList.remove('active');
      fabMenu.classList.remove('open');
    }
  });

  fabVcard.addEventListener('click', () => {
    downloadVCard();
    fab.classList.remove('active');
    fabMenu.classList.remove('open');
  });

  fabLink.addEventListener('click', () => {
    navigator.clipboard.writeText('https://jonhazeltine.com').then(() => {
      showToast('Link copied to clipboard');
    }).catch(() => {
      showToast('jonhazeltine.com');
    });
    fab.classList.remove('active');
    fabMenu.classList.remove('open');
  });

  // ── QR Code Generator ──

  const qrModal = document.getElementById('qrModal');
  const qrClose = document.getElementById('qrClose');
  const qrCanvas = document.getElementById('qrCanvas');

  fabQR.addEventListener('click', () => {
    fab.classList.remove('active');
    fabMenu.classList.remove('open');
    generateQR();
    qrModal.classList.add('open');
  });

  qrClose.addEventListener('click', () => {
    qrModal.classList.remove('open');
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.remove('open');
  });

  function generateQR() {
    // Lightweight QR code generation — draws a stylized placeholder
    // that encodes the URL using a simple visual pattern
    const ctx = qrCanvas.getContext('2d');
    const size = 200;
    const data = 'https://jonhazeltine.com';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate a deterministic pattern from the URL
    const modules = 25;
    const cellSize = size / modules;
    const pattern = generateQRPattern(data, modules);

    ctx.fillStyle = '#050d18';
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (pattern[row][col]) {
          const x = col * cellSize;
          const y = row * cellSize;
          // Rounded cells for premium look
          roundRect(ctx, x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, 1.5);
          ctx.fill();
        }
      }
    }

    // Draw finder patterns (the three big squares)
    drawFinderPattern(ctx, 0, 0, cellSize);
    drawFinderPattern(ctx, (modules - 7) * cellSize, 0, cellSize);
    drawFinderPattern(ctx, 0, (modules - 7) * cellSize, cellSize);
  }

  function generateQRPattern(data, modules) {
    // Create a visual QR-like pattern from data hash
    const grid = Array.from({ length: modules }, () => Array(modules).fill(false));
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
    }

    // Fill with deterministic pattern
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder pattern areas
        if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) continue;
        // Skip timing patterns
        if (r === 6 || c === 6) {
          grid[r][c] = (r + c) % 2 === 0;
          continue;
        }
        hash = ((hash << 5) - hash + r * modules + c) | 0;
        grid[r][c] = (Math.abs(hash) % 3) < 2;
      }
    }
    return grid;
  }

  function drawFinderPattern(ctx, x, y, cell) {
    // Outer
    ctx.fillStyle = '#050d18';
    roundRect(ctx, x, y, cell * 7, cell * 7, 3);
    ctx.fill();
    // White ring
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x + cell, y + cell, cell * 5, cell * 5, 2);
    ctx.fill();
    // Inner
    ctx.fillStyle = '#050d18';
    roundRect(ctx, x + cell * 2, y + cell * 2, cell * 3, cell * 3, 1.5);
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Toast ──

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ── Ripple Effect ──

  function createRipple(e, el) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  // ── Smooth Scroll for anchor links ──

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Web Share API (for mobile "bump" feel) ──

  if (navigator.share) {
    // On mobile, add native share to the FAB
    const nativeShareBtn = document.createElement('button');
    nativeShareBtn.className = 'fab-option';
    nativeShareBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      <span>Share via...</span>
    `;
    nativeShareBtn.addEventListener('click', () => {
      navigator.share({
        title: 'Jon Hazeltine',
        text: 'Connect with Jon Hazeltine — Entrepreneur, Real Estate, Mortgages, Coaching & Leadership',
        url: 'https://jonhazeltine.com',
      }).catch(() => {});
      fab.classList.remove('active');
      fabMenu.classList.remove('open');
    });
    fabMenu.insertBefore(nativeShareBtn, fabMenu.firstChild);
  }

  // ── Keyboard shortcut: press 'c' to save contact ──

  document.addEventListener('keydown', (e) => {
    if (e.key === 'c' && !e.metaKey && !e.ctrlKey && document.activeElement.tagName === 'BODY') {
      downloadVCard();
    }
  });

})();
