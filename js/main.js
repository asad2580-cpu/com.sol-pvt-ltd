/* ============================================================
   Com.Sol Pvt Ltd — Main JavaScript
   Scroll animations · Navbar · Mobile menu · Contact modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active nav link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Navbar scroll effect ────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger menu ───────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveal (IntersectionObserver) ────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── Animated counter ────────────────────────────────────── */
  function animateCounter(el, target, duration = 1600) {
    const start     = performance.now();
    const isDecimal = target % 1 !== 0;
    const update    = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const value    = ease * target;
      el.textContent = isDecimal
        ? value.toFixed(1)
        : Math.floor(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.count);
          animateCounter(el, target);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => counterObs.observe(el));
  }

  /* ── Stagger child cards ─────────────────────────────────── */
  document.querySelectorAll('.stagger-children').forEach(parent => {
    parent.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  /* ── Contact modal ───────────────────────────────────────── */
  const EMAIL = 'Cosopvtltd@gmail.com';

  const modal = document.createElement('div');
  modal.id = 'contact-modal';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box">
      <button class="modal-close" aria-label="Close">&times;</button>
      <span class="section-label" style="display:block;margin-bottom:0.5rem;">Get In Touch</span>
      <h3 style="margin-bottom:0.25rem;">Contact <span class="accent">Com.Sol</span></h3>
      <p style="font-size:0.88rem;margin-bottom:1.75rem;">Reach out to us for available roles in Delhi NCR. We typically respond within 1 business day.</p>

      <div class="modal-email-box">
        <span class="modal-email-label">📧 Our Email</span>
        <span class="modal-email-addr" id="modal-email-text">${EMAIL}</span>
        <button class="modal-copy-btn" id="modal-copy-btn">Copy</button>
      </div>

      <div class="modal-actions">
        <a href="mailto:${EMAIL}" class="btn btn-primary" style="flex:1;justify-content:center;">Open Mail App</a>
      </div>

      <div class="modal-office">
        <span style="color:var(--grey);font-size:0.82rem;">📍 Or visit our Head Office —</span>
        <span style="color:var(--grey-light);font-size:0.82rem;">Plot No. 3, Vardhman City Centre, 3rd Floor, Office No. 324, Near Tikka Junction, Shastri Nagar Metro Station (Gate 2), Delhi – 110052</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const copyBtn = modal.querySelector('#modal-copy-btn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = 'rgba(37,99,235,0.3)';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.style.background = '';
      }, 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    });
  });

  document.querySelectorAll('[data-contact]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

});