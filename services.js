/* ============================================================
   PORTFOLIO — ALEXANDRE GAILLARD
   services.js — Interactions de la page services.html

   Pourquoi un fichier séparé ?
   script.js référence des éléments DOM qui n'existent que sur
   index.html (typed-text, contactForm, imageModal, profilePhoto…).
   Les inclure ici provoquerait des erreurs JavaScript dès le
   chargement. Ce fichier ne reprend que les comportements
   communs à toutes les pages.
   ============================================================ */

/* ============================================================
   1. THÈME DARK / LIGHT
   Même logique que script.js :
   - On lit le thème stocké dans le localStorage (partagé entre
     index.html et services.html → cohérence entre les pages)
   - On l'applique à l'attribut data-theme de <html>
   - Au clic sur le bouton, on bascule et on sauvegarde le choix
   ============================================================ */

// document.documentElement = la balise <html>
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = themeToggle.querySelector('.toggle-icon');

// Restaurer le thème mémorisé (défaut : dark si pas encore de préférence)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

// Bascule au clic : dark ↔ light
themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next); // persistance inter-pages
    updateIcon(next);
});

// Met à jour l'icône ☀ (mode light) ou ☾ (mode dark)
function updateIcon(theme) {
    toggleIcon.textContent = theme === 'dark' ? '☀' : '☾';
}

/* ============================================================
   2. MENU MOBILE — HAMBURGER
   Trois comportements :
   a) Clic sur le bouton hamburger → toggle du menu
   b) Clic sur un lien dans le menu → fermeture automatique
   c) Clic en dehors de la nav → fermeture automatique
   ============================================================ */

const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

// a) Ouvrir / fermer au clic sur le hamburger
menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    // aria-expanded informe les lecteurs d'écran de l'état du menu
    menuToggle.setAttribute('aria-expanded', isOpen);
});

// b) Fermer dès qu'on clique sur un lien (navigation vers une autre page/section)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
    });
});

// c) Fermer si on clique n'importe où en dehors de la navbar
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
    }
});

/* ============================================================
   3. SCROLL REVEAL — APPARITION AU DÉFILEMENT
   Les éléments avec la classe .reveal démarrent invisibles
   (opacity: 0 + translateY: 22px — défini dans style.css).

   IntersectionObserver surveille chaque élément .reveal.
   Quand il entre dans le viewport, on ajoute la classe .visible
   qui déclenche la transition CSS → l'élément s'anime.

   On "unobserve" après l'animation : l'observer est arrêté
   pour cet élément, ce qui économise des ressources.
   ============================================================ */

// Sélectionne tous les éléments marqués .reveal sur la page
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Si l'élément n'est pas encore visible dans le viewport : on passe
        if (!entry.isIntersecting) return;

        // L'élément est visible → on déclenche son animation
        entry.target.classList.add('visible');

        // On arrête l'observation (l'animation ne se joue qu'une fois)
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold:  0.15,              // se déclenche quand 15% de l'élément est visible
    rootMargin: '0px 0px -40px 0px' // décalage : un peu de marge en bas du viewport
});

// On démarre l'observation pour chaque élément .reveal
revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   4. ANNÉE DYNAMIQUE DANS LE FOOTER
   Injecte l'année courante dans <span id="year"></span>.
   Cela évite d'avoir à mettre l'année à la main dans le HTML
   (et de l'oublier de mettre à jour chaque 1er janvier).
   ============================================================ */

document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   5. OMBRE DE LA NAVBAR AU DÉFILEMENT
   Quand l'utilisateur scrolle > 40px, on renforce visuellement
   la navbar avec une ombre portée.
   { passive: true } = le navigateur sait qu'on ne bloquera pas
   le scroll → meilleure performance sur mobile.
   ============================================================ */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 1px 24px rgba(0,0,0,0.25)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });
