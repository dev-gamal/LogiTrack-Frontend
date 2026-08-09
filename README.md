# LogiTrack Frontend

LogiTrack Frontend est une application web construite avec **React** (via Vite) pour interfacer avec l'API LogiTrack. Elle offre une interface utilisateur moderne et réactive pour gérer la logistique, les commandes, les clients et les produits.
L'application gère l'authentification des utilisateurs (JWT), les rôles, et propose un tableau de bord intuitif.

## 🚀 Fonctionnalités Principales

* **Authentification et Autorisation :** Système de connexion et d'inscription avec protection des routes (`ProtectedRoute`) et gestion des accès selon les rôles (`RoleGuard`).
* **Tableau de Bord :** Vue d'ensemble avec des statistiques clés (`DashboardCard`).
* **Gestion des Clients :** Liste des clients (`ClientList`), affichage détaillé (`ClientDetails`), et formulaires d'ajout/édition (`ClientForm`).
* **Gestion des Produits :** Liste des produits (`ProductList`), affichage détaillé (`ProductDetails`), et formulaires d'ajout/édition (`ProductForm`).
* **Gestion des Commandes :** Liste des commandes (`OrderList`), affichage détaillé (`OrderDetails`), et formulaires d'ajout/édition (`OrderForm`).
* **Gestion des Utilisateurs :** Interface d'administration pour gérer les utilisateurs (`Users`).

## 🛠️ Stack Technique

* **Bibliothèque UI :** React
* **Outil de Build :** Vite
* **Routage :** (Probablement `react-router-dom`, bien que non listé explicitement, structure de routes présente)
* **Gestion d'État / Contexte :** React Context API (`AuthContext`, `AuthProvider`)
* **Requêtes HTTP :** Axios ou Fetch (configuré dans `services/api.js`)
* **Styling :** CSS classique (`index.css`)
* **Déploiement :** Docker (présence de `Dockerfile` et `nginx.conf`)

## 📂 Architecture du Projet

Le projet suit une structure de dossiers React standard et organisée :

```text
LogiTrack-Frontend/
├── public/              # Fichiers statiques (favicon, icônes)
├── src/                 # Code source principal
│   ├── components/      # Composants réutilisables (Navbar, Sidebar, Layout, DashboardCard)
│   ├── context/         # Contextes React (AuthContext, AuthProvider)
│   ├── pages/           # Composants de pages complets (Dashboard, Login, Clients, Orders, etc.)
│   ├── routes/          # Composants de gestion du routage (ProtectedRoute, RoleGuard)
│   ├── services/        # Fonctions pour interagir avec l'API backend
│   ├── App.jsx          # Composant racine
│   ├── index.css        # Styles globaux
│   └── main.jsx         # Point d'entrée de l'application React
├── .dockerignore        # Fichiers ignorés par Docker
├── Dockerfile           # Fichier de configuration Docker
├── nginx.conf           # Configuration Nginx (probablement pour servir l'app via Docker)
├── package.json         # Dépendances et scripts npm
└── vite.config.js       # Configuration de Vite
```

## ⚙️ Prérequis

* Node.js (version 16+ recommandée)
* npm (ou yarn / pnpm)

## 🏃‍♂️ Installation et Exécution

1. **Cloner le dépôt :**
   ```bash
   git clone <votre-repo-url>
   cd LogiTrack-Frontend
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible (généralement à l'adresse `http://localhost:5173`).

## 🐳 Déploiement avec Docker

Le projet est configuré pour être conteneurisé.

1. **Construire l'image Docker :**
   ```bash
   docker build -t logitrack-frontend .
   ```

2. **Exécuter le conteneur :**
   ```bash
   docker run -p 80:80 logitrack-frontend
   ```
   (L'application sera accessible sur le port 80 de votre machine, servie par Nginx selon la configuration).
