// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particles');
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

// ===== NAVBAR SCROLL =====
function handleNavScroll() {
    const nav = document.getElementById('navbar');
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

// ===== SCROLL REVEAL =====
function handleReveal() {
    const reveals = document.querySelectorAll('.project-card, .section-header, .contact-card');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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

// ===== PROJECT CARD HOVER GLOW FOLLOW =====
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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    handleNavScroll();
    handleActiveNav();
    handle3DTilt();
    handleReveal();
    handleSmoothScroll();
    handleCardGlow();
});
