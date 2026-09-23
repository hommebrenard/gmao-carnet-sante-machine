# Carnet de Santé Équipement & GMAO Usine

Application web moderne de GMAO (Gestion de Maintenance Assistée par Ordinateur) et Carnet de Santé Machine pour équipements industriels.

## 🚀 Fonctionnalités

- **Fiche d'identité technique & Passeport Machine** : Caractéristiques complètes, constructeur, localisation usine, conformité réglementaire (DESP Directive 2014/68/UE).
- **Export & Impression A4 / PDF** : Génération de passeport technique officiel A4 prêt pour les audits (DREAL, APAVE) avec calcul automatique d'échelle et signature électronique/émargement.
- **Suivi des interventions & Ordres de Travail (OT)** : Traçabilité complète des maintenances curatives et préventives.
- **Maintenance préventive & Contrôles** : Échéancier réglementaire et constructeur.
- **Magasin de pièces détachées** : Suivi des stocks de sécurité et consommables critiques.
- **Indicateurs & Tableaux de bord** : Suivi des compteurs horaires, taux d'engagement et statuts opérationnels.

## 🛠️ Stack Technique

- **React 19** & **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** (icônes)
- **jsPDF** & **html-to-image** (moteur de rendu A4 haute fidélité)

---

## 💻 Installation locale

### 1. Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [Git](https://git-scm.com/)

### 2. Cloner le projet
```bash
git clone https://github.com/VOTRE-NOM-UTILISATEUR/VOTRE-DEPOT.git
cd VOTRE-DEPOT
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

### 5. Compiler pour la production
```bash
npm run build
```
Les fichiers statiques optimisés seront générés dans le dossier `dist/`.
