/* ============================================================
   PORTFOLIO — ALEXANDRE GAILLARD
   script.js — Interactions & Animations
   ============================================================ */

/* ============================================================
   1. THÈME DARK / LIGHT
   ============================================================ */

const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const toggleIcon   = themeToggle.querySelector('.toggle-icon');

// Restaurer le thème sauvegardé (défaut : dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
});

function updateIcon(theme) {
    toggleIcon.textContent = theme === 'dark' ? '☀' : '☾';
}

/* ============================================================
   2. MENU MOBILE
   ============================================================ */

const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
});

// Fermer le menu au clic sur un lien
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
    });
});

// Fermer si on clique en dehors
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
    }
});

/* ============================================================
   3. EFFET DE FRAPPE (HERO)
   ============================================================ */

const phrases = [
    'Développeur Web en formation.',
    'Passionné par le Full Stack.',
    'Curieux. Créatif. Déterminé.',
    'En route vers le développement Full Stack.',
    'HTML · CSS · JavaScript Vanilla.',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

const typedEl = document.getElementById('typed-text');

function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 38 : 75;

    if (!isDeleting && charIndex === current.length) {
        // Pause en fin de phrase
        delay      = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Passer à la phrase suivante
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay       = 450;
    }

    setTimeout(type, delay);
}

// Lancer avec un léger retard pour laisser la page se charger
setTimeout(type, 600);

/* ============================================================
   4. SCROLL REVEAL + ANIMATION DES BARRES DE COMPÉTENCES
   ============================================================ */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        // Dés-observer après animation (performance)
        // Note : les barres de compétences sont gérées par skillObserver (section 9)
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold:  0.15,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   5. LIEN ACTIF DANS LA NAVIGATION AU SCROLL
   ============================================================ */

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        navItems.forEach(item => {
            item.classList.toggle(
                'active',
                item.getAttribute('href') === '#' + id
            );
        });
    });
}, {
    rootMargin: '-40% 0px -55% 0px'
});

sections.forEach(sec => sectionObserver.observe(sec));

/* ============================================================
   6. FORMULAIRE DE CONTACT
   ============================================================ */

const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simuler un envoi (à remplacer par un vrai backend / EmailJS)
    submitBtn.textContent  = 'Envoi en cours…';
    submitBtn.disabled     = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        submitBtn.textContent   = '✓ Message envoyé !';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '#22c55e';

        setTimeout(() => {
            submitBtn.textContent  = 'Envoyer le message';
            submitBtn.disabled     = false;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    }, 1200);
});

/* ============================================================
   7. ANNÉE DYNAMIQUE DANS LE FOOTER
   ============================================================ */

document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   8. PHOTO DE PROFIL — CLIC POUR CHANGER
   ============================================================ */

const profilePhoto = document.getElementById('profilePhoto');
const photoInput   = document.getElementById('photoInput');

if (profilePhoto && photoInput) {
    profilePhoto.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            // Supprimer les éléments texte
            profilePhoto.querySelector('.profile-initials').style.display = 'none';
            profilePhoto.querySelector('.profile-hint').style.display = 'none';

            // Insérer ou remplacer l'image
            let img = profilePhoto.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                profilePhoto.appendChild(img);
            }
            img.src = ev.target.result;
            img.alt = 'Alexandre Gaillard';
        };
        reader.readAsDataURL(file);
    });
}

/* ============================================================
   9. COMPTEUR ANIMÉ SUR LES POURCENTAGES DE COMPÉTENCES
   ============================================================ */

function animateCounter(el, target, duration = 1200) {
    let start     = 0;
    const step    = 16; // ~60fps
    const steps   = duration / step;
    const increment = target / steps;

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = Math.round(start) + '%';
    }, step);
}

// Observer dédié aux skill-items pour déclencher le compteur
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const percentEl = entry.target.querySelector('.skill-percent');
        const fillEl    = entry.target.querySelector('.skill-fill');

        if (percentEl && fillEl) {
            const target = parseInt(fillEl.dataset.width);
            percentEl.textContent = '0%';
            setTimeout(() => {
                animateCounter(percentEl, target);
                fillEl.style.width = target + '%';
            }, 150);
        }

        skillObserver.unobserve(entry.target);
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

/* ============================================================
   10. MODALE IMAGE — CLIC SUR LES THUMBNAILS
   ============================================================ */

const modal         = document.getElementById('imageModal');
const modalImg      = document.getElementById('modalImg');
const modalCaption  = document.getElementById('modalCaption');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

// Ouvrir la modale au clic sur une thumbnail
document.querySelectorAll('.project-thumbnail img').forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src        = img.src;
        modalImg.alt        = img.alt;
        modalCaption.textContent = img.alt;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

// Fermer via le bouton ✕ ou le backdrop
function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Fermer avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ============================================================
   11. SCROLL FLUIDE — NAVBAR SE RENFORCE AU DÉFILEMENT
   ============================================================ */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 1px 24px rgba(0,0,0,0.25)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });
