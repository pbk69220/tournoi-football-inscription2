# Configuration et Démarrage

## Prérequis

- Node.js (v14 ou supérieur)
- npm

## Installation

Les dépendances ont déjà été installées. Si besoin, exécutez:

```bash
npm install
```

## Démarrage de l'Application

### Option 1: Démarrer serveur et interface ensemble

```bash
npm run dev:all
```

Cela lancera:
- Le serveur backend sur `http://localhost:5000`
- L'interface React sur `http://localhost:5173`

### Option 2: Démarrer séparément

**Terminal 1 - Serveur Backend:**
```bash
npm run server
```

**Terminal 2 - Interface React:**
```bash
npm run dev
```

## Base de Données

- **Emplacement:** `registrations.db` (à la racine du projet)
- **Type:** SQLite3
- Se crée automatiquement au premier démarrage du serveur

## Accès Admin

**URL:** `http://localhost:5173`

**Bouton Admin:** Cliquez sur le bouton "Admin" en haut à droite

**Mot de passe:** `bfb69#*`

## Fonctionnalités

### Onglet Public - Récapitulatif
- Affiche la liste des inscrits
- Affiche uniquement: Nom, Joueur, Catégorie, Services
- **Pas d'accès à:**
  - Email/Téléphone
  - Boutons de suppression
  - Export CSV

### Onglet Admin
- Accès avec mot de passe
- Affiche toutes les informations: Email, Téléphone
- **Fonctionnalités:**
  - Supprimer une inscription
  - Exporter en CSV (avec email et téléphone)
  - Voir toutes les données de base

## Structure des Données

Chaque inscription contient:
- Nom et prénom de la personne
- Email et téléphone
- Prénom du joueur licencié
- Catégorie du joueur (U13, etc.)
- Services sélectionnés (hébergement, bénévolat)
- Date d'inscription

## Troubleshooting

**Erreur: "Erreur de connexion au serveur"**
- Assurez-vous que le serveur est démarré avec `npm run server`
- Vérifiez que le port 5000 est disponible

**La base de données semble vide**
- C'est normal si c'est la première utilisation
- Les données s'ajoutent quand les gens s'inscrivent
- Rechargez la page pour voir les nouvelles inscriptions

**Problème de CORS**
- Le serveur est configuré pour accepter les requêtes de `localhost:5173`
- En production, ajustez les paramètres CORS dans `server/server.cjs`
