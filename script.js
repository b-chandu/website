/* ============================================================
   Chandan B — Personal Website
   Main JavaScript
   ============================================================ */

'use strict';

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Scrolled class for background
    if (currentScroll > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    updateActiveNav();
}, { passive: true });

// ===== Active Nav Link =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Mobile Menu =====
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});

// Close on nav link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (navLinksEl.classList.contains('open') &&
        !navbar.contains(e.target)) {
        closeMobileMenu();
    }
});

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-height')) || 68;

        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ===== Counter Animation =====
function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const fps = 60;
    const steps = duration / (1000 / fps);
    const increment = target / steps;

    let current = 0;
    let frame = 0;

    // Ease-out quad
    function easeOut(t) { return t * (2 - t); }

    const timer = setInterval(() => {
        frame++;
        const progress = Math.min(frame / steps, 1);
        current = target * easeOut(progress);

        el.textContent = Math.floor(current) + suffix;

        if (progress >= 1) {
            el.textContent = target + suffix;
            clearInterval(timer);
        }
    }, 1000 / fps);
}

// ===== Intersection Observer: Counters =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    counterObserver.observe(el);
});

// ===== Intersection Observer: Fade-up Animations =====
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, stop observing to save resources
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

// Elements to animate on scroll
const animateSelectors = [
    '.skill-category',
    '.timeline-card',
    '.cert-card',
    '.contact-card',
    '.highlight-item',
    '.education-card',
    '.section-header',
    '.stat-card'
];

animateSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.add('fade-up');
        fadeObserver.observe(el);
    });
});

// ===== Typed Text Effect (Hero Title) =====
(function initTyped() {
    const titleEl = document.querySelector('.hero-title');
    if (!titleEl) return;

    // Run only once, on initial load
    const fullText = titleEl.innerHTML;
    const textNode = titleEl.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const staticText = textNode.textContent; // "Cloud Solutions "
    textNode.textContent = '';

    let i = 0;
    const speed = 60;

    function type() {
        if (i <= staticText.length) {
            textNode.textContent = staticText.slice(0, i);
            i++;
            setTimeout(type, speed);
        }
    }

    // Delay so hero animation plays first
    setTimeout(type, 600);
})();

// ===== Parallax Orbs (subtle, performance-safe) =====
(function initParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    if (!orbs.length) return;

    // Only enable on desktop/non-touch
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            orbs.forEach((orb, i) => {
                const factor = (i + 1) * 8;
                orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
            });

            ticking = false;
        });
    }, { passive: true });
})();

// ===== Cloud Badge hover sparkle =====
document.querySelectorAll('.cloud-badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    badge.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.25s ease';
    });
});

// ===== Skill tag — subtle click ripple =====
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
        this.style.transform = 'scale(0.94)';
        setTimeout(() => { this.style.transform = ''; }, 150);
    });
});

// ===== Timeline card entrance stagger =====
(function staggerTimeline() {
    const cards = document.querySelectorAll('.timeline-card');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // already handled by fadeObserver, just add delay
                entry.target.style.transitionDelay = `${idx * 0.05}s`;
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    cards.forEach(card => obs.observe(card));
})();

// ===== Init on DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav
    updateActiveNav();

    // Add scrolled state if page loads mid-scroll
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    }
});
