
# 📊 Dashboard Analytics

Un tableau de bord analytique complet avec visualisations de données en temps réel, import de fichiers et rapports détaillés.

![Licence MIT](https://img.shields.io/badge/licence-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D14-green)
![Express](https://img.shields.io/badge/express-4.x-lightgrey)

## 🚀 Fonctionnalités

- 📊 **Graphiques et statistiques avancées** – calcul automatique des métriques sur les données importées.
- 📁 **Import de données** – support CSV et JSON via interface web.
- 🔍 **Filtrage et tri avancé** – recherche textuelle et filtrage par colonne/valeur.
- 📈 **Visualisations en temps réel** – interface réactive avec Chart.js.
- 🔐 **Authentification JWT multi-niveaux** – inscription, connexion, profils utilisateurs.
- 📋 **Génération de rapports** – création et export JSON (base pour PDF).
- 🎯 **Dashboard personnalisable** – widgets configurables.
- 📱 **Interface responsive** – compatible mobile et desktop.

## ⚙️ Prérequis

- **Node.js** version 14 ou supérieure
- **npm** (installé avec Node.js)
- **SQLite** (intégré, aucune installation externe requise)

## 📦 Installation

bash
git clone https://github.com/KervyTheCoderCree/dashboard-analytics.git
cd dashboard-analytics
npm install


🛠️ Configuration

Créez un fichier .env à la racine en vous basant sur .env.example :

env
PORT=5000
NODE_ENV=development
JWT_SECRET=changez_cette_cle_secrete
DB_PATH=./data/analytics.db
UPLOAD_DIR=./uploads
REPORT_DIR=./reports


⚠️ Important : Modifiez la valeur de JWT_SECRET par une chaîne aléatoire et sécurisée en production.

▶️ Démarrage

bash
# Mode développement (avec rechargement automatique via nodemon)
npm run dev

# Mode production
npm start


L'application sera accessible sur http://localhost:5000.

📡 Endpoints API

🔑 Authentification

Méthode Route Description
POST /api/auth/register Inscription
POST /api/auth/login Connexion
POST /api/auth/logout Déconnexion
GET /api/auth/profile Profil utilisateur

📊 Dashboard

Méthode Route Description
GET /api/dashboard Données principales du dashboard
GET /api/dashboard/stats Statistiques globales
GET /api/dashboard/widgets Configuration des widgets

📂 Données

Méthode Route Description
GET /api/data Lister tous les datasets
POST /api/data/import Importer un fichier (CSV/JSON)
GET /api/data/:id Détails d'un dataset
DELETE /api/data/:id Supprimer un dataset
GET /api/data/search?q= Recherche textuelle
GET /api/data/filter?column=&value= Filtrage personnalisé

📋 Rapports

Méthode Route Description
GET /api/reports Lister tous les rapports
POST /api/reports Créer un nouveau rapport
GET /api/reports/:id Détails d'un rapport
DELETE /api/reports/:id Supprimer un rapport
POST /api/reports/:id/export Exporter le rapport (JSON)

🔐 Tous les endpoints, sauf /auth/register et /auth/login, nécessitent un token JWT dans l'en-tête Authorization: Bearer <token>.

🧪 Utilisation rapide

1. Inscrivez-vous via l'interface web ou l'API :
      POST /api/auth/register avec username, email, password.
2. Connectez-vous pour obtenir un token JWT.
3. Importez des données : depuis l'onglet « Données », choisissez un fichier CSV ou JSON, puis cliquez sur Importer.
4. Consultez le dashboard pour voir les statistiques.
5. Créez un rapport (via l'API) et exportez-le.

🏗️ Structure du projet


dashboard-analytics/
├── src/
│   ├── controllers/    # Logique métier
│   ├── routes/         # Définitions des routes
│   ├── middleware/     # Authentification, validation, erreurs
│   ├── models/         # Accès à la base de données SQLite
│   ├── utils/          # Parsing CSV/JSON, calculs statistiques, logger
│   └── app.js          # Configuration Express
├── public/             # Frontend statique (HTML, CSS, JS vanilla)
├── data/               # Base SQLite (créée automatiquement)
├── uploads/            # Fichiers temporaires uploadés
├── reports/            # Rapports exportés
├── .env.example        # Exemple de variables d'environnement
├── package.json
└── server.js           # Point d'entrée
```

🛡️ Technologies utilisées

· Backend : Node.js, Express.js
· Base de données : SQLite (via better-sqlite3)
· Authentification : JSON Web Tokens (JWT)
· Parsing de fichiers : csv-parser, streaming JSON natif
· Frontend : HTML5, CSS3, JavaScript Vanilla, Chart.js
· Gestion des uploads : Multer

✍️ Auteur

KervyTheCoder
GitHub

📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
