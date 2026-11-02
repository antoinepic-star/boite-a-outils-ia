# Boîte à outils IA — Bien travailler avec Claude

Bibliothèque de cartes (skills, agents, serveurs MCP, tips, fiches pratiques) partagée avec l'équipe UX, intégrée à la Suite UX Infostrates (connexion unique via UX Dashboard, accès géré dans Administration avec la clé `boite-a-outils`).

Chaque carte est un fichier Markdown du dossier `content/`. La seule donnée en base (Turso) est la liste des signatures de la charte. Ajouter ou modifier une carte = modifier un fichier, puis pousser sur GitHub (Render redéploie tout seul).

## Ajouter une carte

Crée `content/<identifiant>.md` (identifiant en minuscules, chiffres et tirets — il sert d'adresse : `/admin#<identifiant>`) :

```
---
type: skill            # skill | agent | mcp | tip | fiche
titre: Skill : Mon skill
resume: Une ou deux phrases affichées sur la carte.
cible: Toute l'équipe UX
objectif: Bloc « Objectif » de la fiche.
domaine: Bloc « Domaine d'intervention ».
atout: Bloc « Atout principal ».
maj: 2026-11-02
ordre: 10              # tri dans la grille (plus petit = en premier)
action: Télécharger le skill   # libellé du bouton principal (facultatif)
fichier: mon-skill.zip         # fichier de content/files/<identifiant>/ téléchargé par ce bouton
---

## Rôle et valeur ajoutée

> Texte libre en Markdown (titres, listes, citations, code, liens, images).
```

**Carte « À venir »** : un fichier avec seulement l'en-tête (`type`, `titre`, `resume`, `ordre`) et rien en dessous s'affiche grisé, non cliquable, avec un sticker « À venir » (après les cartes rédigées). Dès qu'on écrit du contenu sous l'en-tête, la carte devient consultable.

Les champs `objectif`, `domaine` et `atout` sont facultatifs (le bloc « En un coup d'œil » n'affiche que ceux renseignés).

**Fichiers téléchargeables** : dépose-les dans `content/files/<identifiant>/`. Celui désigné par `fichier:` devient le bouton principal en haut à droite de la fiche ; les autres sont proposés dans le menu « … », avec l'export PDF de la fiche.

## Charte d'utilisation de l'IA

Le texte est dans `content/charte.md`. Tant qu'un utilisateur n'a pas signé la version en cours, une popin bloque l'accès aux cartes (côté serveur aussi). **Changer la ligne `version:` redemande la signature à tout le monde** — à faire quand le contenu de la charte change.

## Démarrage en local

1. `npm install`
2. Copier `.env.example` en `.env` : `ADMINISTRATION_URL` (instance locale d'Administration) et `INTERNAL_API_SECRET` identique à celui d'Administration, plus un `JWT_SECRET`.
3. Sans `TURSO_DATABASE_URL`, les signatures sont stockées dans `data/boite-a-outils.db` (SQLite local).
4. `npm start` puis ouvrir [http://localhost:3070/admin](http://localhost:3070/admin).

## Déployer sur Render

1. "New +" → "Web Service" → connecter le dépôt GitHub. Build : `npm install`, Start : `npm start`.
2. Variables d'environnement : `ADMINISTRATION_URL`, `INTERNAL_API_SECRET` (identique à Administration), `JWT_SECRET` (chaîne aléatoire, bouton « Generate » de Render), `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` (base Turso dédiée — sans elle, les signatures seraient perdues à chaque redéploiement). Ne pas définir `PORT`.
3. Une fois l'URL Render connue, la reporter dans les autres outils de la suite (tuile « Nos outils », iframe de déconnexion de UX Dashboard, `TOOL_URLS` d'Administration).
