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

// ===== TEXT TYPE ANIMATION =====
function initTextType() {
    const contentEl = document.getElementById('textTypeContent');
    if (!contentEl) return;

    const texts = [
        'Muhammad Reza',
        'Welcome To My Portfolio',
        'Frontend UI/UX Dev',
        'Software Engineer'
    ];
    const typingSpeed   = 75;
    const deletingSpeed = 55;
    const pauseDuration = 1500;
    const loopDelay     = 200;

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting       = false;
    let displayedText    = '';

    function tick() {
        const currentText = texts[currentTextIndex];

        if (!isDeleting) {
            if (currentCharIndex < currentText.length) {
                displayedText = currentText.slice(0, currentCharIndex + 1);
                contentEl.textContent = displayedText;
                currentCharIndex++;
                setTimeout(tick, typingSpeed);
            } else {
                setTimeout(() => { isDeleting = true; tick(); }, pauseDuration);
            }
        } else {
            if (displayedText.length > 0) {
                displayedText = displayedText.slice(0, -1);
                contentEl.textContent = displayedText;
                setTimeout(tick, deletingSpeed);
            } else {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                currentCharIndex = 0;
                setTimeout(tick, loopDelay);
            }
        }
    }

    tick();
}

// ===== PROFILE CARD TILT ENGINE =====
function initProfileCard() {
    const wrap = document.getElementById('profileCard');
    if (!wrap) return;
    const shell = wrap.querySelector('.pc-card-shell');
    if (!shell) return;

    const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
    const round = (v, p = 3) => parseFloat(v.toFixed(p));
    const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

    let rafId = null, running = false, lastTs = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let initialUntil = 0;
    const DEFAULT_TAU = 0.14, INITIAL_TAU = 0.6;

    function setVars(x, y) {
        const w = shell.clientWidth || 1;
        const h = shell.clientHeight || 1;
        const px = clamp((100 / w) * x);
        const py = clamp((100 / h) * y);
        const cx = px - 50, cy = py - 50;
        const props = {
            '--pointer-x': `${px}%`,
            '--pointer-y': `${py}%`,
            '--background-x': `${adjust(px, 0, 100, 35, 65)}%`,
            '--background-y': `${adjust(py, 0, 100, 35, 65)}%`,
            '--pointer-from-center': `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
            '--pointer-from-top': `${py / 100}`,
            '--pointer-from-left': `${px / 100}`,
            '--rotate-x': `${round(-(cx / 5))}deg`,
            '--rotate-y': `${round(cy / 4)}deg`
        };
        for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
    }

    function step(ts) {
        if (!running) return;
        if (lastTs === 0) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;
        const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
        const k = 1 - Math.exp(-dt / tau);
        currentX += (targetX - currentX) * k;
        currentY += (targetY - currentY) * k;
        setVars(currentX, currentY);
        const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
        if (stillFar || document.hasFocus()) {
            rafId = requestAnimationFrame(step);
        } else {
            running = false; lastTs = 0;
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
    }

    function startLoop() {
        if (running) return;
        running = true; lastTs = 0;
        rafId = requestAnimationFrame(step);
    }

    function setTarget(x, y) { targetX = x; targetY = y; startLoop(); }
    function toCenter() { setTarget(shell.clientWidth / 2, shell.clientHeight / 2); }

    currentX = (shell.clientWidth || 300) - 70;
    currentY = 60;
    setVars(currentX, currentY);
    toCenter();
    initialUntil = performance.now() + 1200;
    startLoop();

    let enterTimer = null;
    shell.addEventListener('pointerenter', e => {
        const rect = shell.getBoundingClientRect();
        shell.classList.add('active', 'entering');
        if (enterTimer) clearTimeout(enterTimer);
        enterTimer = setTimeout(() => shell.classList.remove('entering'), 180);
        setTarget(e.clientX - rect.left, e.clientY - rect.top);
    });
    shell.addEventListener('pointermove', e => {
        const rect = shell.getBoundingClientRect();
        setTarget(e.clientX - rect.left, e.clientY - rect.top);
    });
    shell.addEventListener('pointerleave', () => {
        toCenter();
        function checkSettle() {
            if (Math.hypot(targetX - currentX, targetY - currentY) > 0.6)
                requestAnimationFrame(checkSettle);
            else shell.classList.remove('active');
        }
        requestAnimationFrame(checkSettle);
    });

    const btn = wrap.querySelector('.pc-contact-btn');
    if (btn) btn.addEventListener('click', () => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
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

// ===== LOGO LOOP (100px/s + hover pause) =====
function handleLogoLoop() {
    const track = document.getElementById('skills-logoloop-track');
    const container = track?.closest('.logoloop');
    if (!track || !container) return;

    function setSpeed() {
        const firstList = track.querySelector('.logoloop__list');
        if (!firstList) return;
        const listWidth = firstList.getBoundingClientRect().width;
        if (listWidth > 0) {
            const duration = listWidth / 80;
            track.style.animationDuration = duration + 's';
        }
    }

    setSpeed();
    window.addEventListener('resize', setSpeed);

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
    initTextType();
    initProfileCard();
    handleSmoothScroll();
    handleCardGlow();
    handleButtonRipple();
    handleCountUp();
    handleLogoLoop();
});
