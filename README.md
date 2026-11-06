<div align="center">
  <h1>FreelanceHub</h1>
  <p><strong>Clients, projets et factures pour les freelances d'Afrique francophone</strong></p>
  <p>Factures en FCFA ou en euros, envoyées par WhatsApp, payées par Orange Money, MTN MoMo ou Wave.</p>

  <p>
    <img src="https://img.shields.io/badge/Angular-22.2-DD0031?logo=angular&logoColor=white" alt="Angular">
    <img src="https://img.shields.io/badge/NestJS-11.0-EA2845?logo=nestjs&logoColor=white" alt="NestJS">
    <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-316192?logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Angular%20Signals-NgRx-764ABC?logo=ngrx&logoColor=white" alt="NgRx Signals">
  </p>
</div>

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Installation et démarrage](#-installation-et-démarrage)
- [Variables d'environnement](#-variables-denvironnement)
- [Scripts disponibles](#-scripts-disponibles)
- [API](#-api)
- [Licence](#-licence)

---

## 📖 Présentation

**Pour qui :** développeurs, designers, consultants et petites agences d'Abidjan, Dakar, Douala…
qui facturent à la fois des clients locaux en FCFA et des clients européens en euros.

Les outils de facturation européens ignorent le franc CFA, le Mobile Money et WhatsApp, qui sont
pourtant le quotidien des freelances d'Afrique de l'Ouest. FreelanceHub part de cette réalité :

- **FCFA et euros** — chaque projet a sa devise ; les totaux sont convertis au taux fixe 1 € = 655,957 FCFA
- **Facture prête à envoyer** — imprimable en PDF, envoyée par WhatsApp ou e-mail en un clic
- **Mobile Money** — Orange Money, MTN MoMo, Wave, Moov Money et virement affichés sur la facture
- **Relances sans gêne** — les retards remontent en premier, avec un message de relance déjà rédigé
- **Tableau de bord** — encaissé, reste à encaisser et graphique des 6 derniers mois

Le backend repose sur **NestJS** avec **Prisma**, le frontend sur **Angular 22** (signals,
NgRx Signals) et **Tailwind CSS 4**.

---

## 🎯 Essayer la démo

**Application :** _lien à ajouter après déploiement_

Sur la page d'accueil, cliquez sur **« Essayer la démo »** : vous arrivez dans un espace déjà
rempli (3 clients, 5 projets en FCFA et en euros, 7 factures dont une en retard, 3 notes).
Ouvrez une facture pour tester l'impression en PDF, l'envoi par WhatsApp et la relance.

| E-mail | Mot de passe |
| --- | --- |
| `demo@freelancehub.app` | `Demo2026!` |

> L'API est hébergée sur un plan gratuit : le premier chargement peut prendre environ 30 secondes.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées (JWT)
- Protection des routes par guards Angular
- Jeton d'accès de 15 min renouvelé automatiquement (refresh token de 7 jours)
- Limitation des tentatives de connexion et d'inscription (anti force brute)

### 👥 Gestion des clients
- CRUD complet des clients
- Informations de contact (email, téléphone, entreprise)
- Association aux projets

### 📁 Gestion des projets
- CRUD complet des projets
- Statuts : `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- Suivi du budget et des dates
- Lié à un client spécifique

### 📄 Gestion des factures
- CRUD complet des factures
- Numérotation automatique (ex : `INV-2026-001`)
- Statuts : `DRAFT`, `SENT`, `PAID`, `OVERDUE`
- Lien vers un projet

### 📝 Notes rapides
- CRUD complet des notes personnelles
- Titre et contenu libre

### 🖥️ Interface moderne
- Design responsive avec **Tailwind CSS 4**
- Navigation avec sidebar et header
- Architecture modulaire et réutilisable

---

## 🛠️ Stack technique

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| [Angular](https://angular.dev) | 22.2 | Framework frontend |
| [NgRx Signals](https://ngrx.io/guide/signals) | 22.0 | Gestion d'état réactive |
| [Tailwind CSS](https://tailwindcss.com) | 4.1 | Design system utilitaires |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Langage |
| [Vitest](https://vitest.dev) | 4.0 | Tests unitaires |

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| [NestJS](https://nestjs.com) | 11.0 | Framework backend (Node.js) |
| [Prisma](https://www.prisma.io) | 7.8 | ORM / Modélisation base de données |
| [PostgreSQL (Neon)](https://neon.tech) | — | Base de données |
| [Passport JWT](http://www.passportjs.org) | 4.0 | Authentification |
| [Zod](https://zod.dev) | 4.4 | Validation des données |
| [Swagger](https://swagger.io) | 11.4 | Documentation API |
| [Jest](https://jestjs.io) | 30 | Tests unitaires & e2e |

---

## 🏗️ Architecture du projet

```
freelancehub/
├── backend/                     # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma        # Modèle de données
│   │   └── migrations/          # Migrations Prisma
│   ├── src/
│   │   ├── auth/                # Module authentification
│   │   ├── clients/             # Module clients
│   │   ├── projects/            # Module projets
│   │   ├── invoices/            # Module factures
│   │   ├── notes/               # Module notes rapides
│   │   ├── users/               # Module utilisateurs
│   │   ├── common/              # Filtres, pipes partagés
│   │   ├── config/              # Validation d'environnement
│   │   ├── database/            # Service Prisma
│   │   ├── app.module.ts        # Module racine
│   │   └── main.ts              # Point d'entrée
│   ├── test/                    # Tests e2e
│   ├── docker-compose.yml       # Base de données locale (Neon)
│   └── package.json
│
├── frontend/                    # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Services, guards, intercepteurs
│   │   │   ├── features/        # Pages (dashboard, clients, etc.)
│   │   │   ├── layout/          # Header, Sidebar, Layout
│   │   │   └── shared/          # Modèles partagés
│   │   ├── index.html
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

### Modèle de données

```mermaid
erDiagram
    User ||--o{ Client : "possède"
    User ||--o{ Note : "écrit"
    Client ||--o{ Project : "a"
    Project ||--o{ Invoice : "génère"

    User {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        datetime createdAt
        datetime updatedAt
    }

    Client {
        string id PK
        string name
        string email
        string phone "nullable"
        string company "nullable"
        string userId FK
    }

    Project {
        string id PK
        string title
        string description "nullable"
        enum status "PENDING | IN_PROGRESS | COMPLETED | CANCELLED"
        datetime startDate
        datetime endDate "nullable"
        float budget
        string clientId FK
    }

    Invoice {
        string id PK
        string number UK "INV-2026-001"
        float amount
        datetime dueDate
        enum status "DRAFT | SENT | PAID | OVERDUE"
        string pdfUrl "nullable"
        string projectId FK
    }

    Note {
        string id PK
        string title
        string content
        string userId FK
    }
```

---

## ✅ Prérequis

- **Node.js** >= 22
- **npm** >= 10
- **PostgreSQL** (ou un compte [Neon](https://neon.tech) pour la base de données cloud)
- **Docker** (optionnel, pour la base de données locale)

---

## 🚀 Installation et démarrage

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd freelancehub
```

### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# ⚠️ Éditez le fichier .env avec vos propres valeurs

# Lancer la base de données locale (optionnel)
docker compose up -d

# Appliquer les migrations Prisma
npx prisma migrate dev

# Créer le compte de démo et ses données (optionnel)
npm run seed

# Démarrer le serveur en mode développement
npm run start:dev
```

Le serveur backend démarre sur **http://localhost:3000** (ou le port configuré).

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application frontend est accessible sur **http://localhost:4200**.

---

## 🔐 Variables d'environnement

### Backend (`.env`)

```env
# Port d'écoute du serveur
PORT=3000

# URL de la base de données PostgreSQL (Neon ou locale)
DATABASE_URL="postgresql://user:password@host:5432/freelancehub"

# URL du frontend (CORS)
FRONTEND_URL="http://localhost:4200"

# Clé secrète pour les tokens JWT (au moins 32 caractères)
JWT_SECRET="votre_clé_secrète_très_longue"
```

Un modèle complet est fourni dans [`backend/.env.example`](backend/.env.example).

---

## ☁️ Déploiement

- **API (Render)** : [`render.yaml`](render.yaml) décrit le service. Renseigner `DATABASE_URL`
  et `FRONTEND_URL` dans le tableau de bord Render ; `JWT_SECRET` est généré automatiquement.
  Lancer ensuite `npm run seed` une fois pour créer le compte de démo.
- **Frontend (Vercel)** : dossier racine `frontend`. [`frontend/vercel.json`](frontend/vercel.json)
  redirige `/api/*` vers l'API Render, le site et l'API partagent donc le même domaine.

---

## 📜 Scripts disponibles

### Backend

| Commande | Description |
|---|---|
| `npm run start:dev` | Démarre le serveur en mode développement (watch) |
| `npm run build` | Compile le projet NestJS |
| `npm run start:prod` | Démarre en production (`node dist/main`) |
| `npm test` | Lance les tests unitaires |
| `npm run test:e2e` | Lance les tests end-to-end |
| `npm run lint` | Vérifie et corrige le code avec ESLint |

### Frontend

| Commande | Description |
|---|---|
| `npm start` | Démarre le serveur de développement Angular |
| `npm run build` | Compile l'application pour la production |
| `npm test` | Lance les tests unitaires (Vitest) |

---

## 📡 API

Une fois le backend démarré, la documentation Swagger est disponible à l'adresse :

```
http://localhost:3000/api/docs
```

L'API est préfixée par `/api`. Exemples d'endpoints :

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/refresh` | Renouvellement du jeton d'accès |
| `GET` | `/api/clients` | Liste des clients |
| `POST` | `/api/clients` | Créer un client |
| `GET` | `/api/projects` | Liste des projets |
| `POST` | `/api/projects` | Créer un projet |
| `GET` | `/api/invoices` | Liste des factures |
| `POST` | `/api/invoices` | Créer une facture |
| `GET` | `/api/notes` | Liste des notes |
| `POST` | `/api/notes` | Créer une note |

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---

<div align="center">
  <p>💡 <strong>FreelanceHub</strong> — Construit avec ❤️ par un freelance pour les freelances.</p>
</div>
