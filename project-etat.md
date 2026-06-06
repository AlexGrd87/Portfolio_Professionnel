# État du projet — Portfolio Alexandre Gaillard

## Dernière session — 06/06/2026

### Ce qui a été fait

**Page Services (`services.html` + `services.js`)**
- Hero avec accroche freelance + carte "spec" blueprint
- 4 cartes prestations (site vitrine, intégration maquette, maintenance, dépannage)
- 4 étapes de processus numérotées
- Grille tarifaire (tableau → cartes empilées sur mobile)
- JS allégé séparé de `script.js` (évite les conflits DOM)

**Intégration dans `index.html`**
- Section `#services` ajoutée entre Formation et Contact (— 05. Services —)
- Contact renumeroté → — 06. Contact —
- Lien nav "Services" pointe vers `#services` (scroll interne)
- Bouton "Voir les tarifs et le détail complet →" vers `services.html`

**Compétences mises à jour**
- CSS3, JavaScript, Git/GitHub → 100%
- SQL → 50%, Figma → 75%
- Ajout : Utilisation de l'IA → 65% (label IA / PRODUCTIVITÉ)

**Déploiement**
- GitHub Pages activé → https://alexgrd87.github.io/Portfolio_Professionnel/

---

## À faire — prochaine session

### Refonte de la section Réalisations

**Objectif** : rendre les projets plus percutants visuellement et informationnellement.

**Pistes à explorer :**
- Revoir la mise en page des cards (layout, hiérarchie visuelle)
- Ajouter des liens "Live" fonctionnels ou les retirer si pas de démo
- Améliorer les descriptions (résultats, technologies, contexte)
- Envisager un filtre par techno (HTML/CSS, JS, etc.)
- Vérifier la cohérence des captures d'écran (taille, qualité)

---

## Structure du projet

```
Portfolio_Professionnel/
├── index.html          # Page principale (one-page portfolio)
├── services.html       # Page services freelance complète
├── style.css           # Styles communs (sections 1–21)
├── script.js           # JS de index.html
├── services.js         # JS allégé pour services.html
├── favicon.svg
├── .gitignore          # Exclut .claude/
└── Images/
    ├── Sophie Bluel.jpg
    ├── Site de biere.png
    ├── PokéBattle.png
    ├── Boutique manga.png
    └── Mespoulet.jpg
```

## URL de production

- Portfolio : https://alexgrd87.github.io/Portfolio_Professionnel/
- Services  : https://alexgrd87.github.io/Portfolio_Professionnel/services.html
- GitHub    : https://github.com/AlexGrd87/Portfolio_Professionnel
