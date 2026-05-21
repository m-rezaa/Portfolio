// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 40;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 20 + 15) + 's';
        p.style.animationDelay = (Math.random() * 20) + 's';
        container.appendChild(p);
    }
}

// ===== DARK MODE TOGGLE =====
function handleThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ===== NAVBAR SCROLL (sticky + blur) =====
function handleNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ===== ACTIVE NAV LINK =====
function handleActiveNav() {
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });
}

// ===== 3D TILT ON HERO CARD =====
function handle3DTilt() {
    const card = document.querySelector('.card-inner');
    const wrapper = document.querySelector('.visual-3d-card');
    if (!card || !wrapper) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

// ===== SMOOTH SCROLL =====
function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ===== PROJECT CARD GLOW FOLLOW =====
function handleCardGlow() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = (e.clientX - rect.left - 100) + 'px';
                glow.style.top = (e.clientY - rect.top - 100) + 'px';
            }
        });
    });
}

// ===== BUTTON RIPPLE EFFECT =====
function handleButtonRipple() {
    document.querySelectorAll('.btn, .project-cta').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== STATS COUNT UP ANIMATION =====
function handleCountUp() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = el.textContent;
                if (target === '∞') return;
                let count = 0;
                const end = parseInt(target);
                const duration = 1000;
                const step = duration / end;
                const timer = setInterval(() => {
                    count++;
                    el.textContent = count + (target.includes('+') ? '+' : '');
                    if (count >= end) clearInterval(timer);
                }, step);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
}

// ===== LOGO LOOP HOVER PAUSE =====
function handleLogoLoop() {
    const track = document.getElementById('skills-logoloop-track');
    const container = track?.closest('.logoloop');
    if (!track || !container) return;
    container.addEventListener('mouseenter', () => track.classList.add('paused'));
    container.addEventListener('mouseleave', () => track.classList.remove('paused'));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80
    });

    createParticles();
    handleThemeToggle();
    handleNavScroll();
    handleActiveNav();
    handle3DTilt();
    handleSmoothScroll();
    handleCardGlow();
    handleButtonRipple();
    handleCountUp();
    handleLogoLoop();
});
