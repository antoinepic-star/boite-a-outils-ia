# Boîte à outils IA — Bien travailler avec Claude

Bibliothèque de cartes (skills, agents, serveurs MCP, tips, fiches pratiques) partagée avec l'équipe UX, intégrée à la Suite UX Infostrates (connexion unique via UX Dashboard, accès géré dans Administration avec la clé `boite-a-outils`).

Pas de base de données : chaque carte est un fichier Markdown du dossier `content/`. Ajouter ou modifier une carte = modifier un fichier, puis pousser sur GitHub (Render redéploie tout seul).

## Ajouter une carte

Crée `content/<identifiant>.md` (identifiant en minuscules, chiffres et tirets — il sert d'adresse : `/admin#<identifiant>`) :

```
---
type: skill            # skill | agent | mcp | tip | fiche
titre: Skill : Mon skill
resume: Une ou deux phrases affichées sur la carte.
statut: En production  # pastille libre (En production, Bonne pratique, Guide, En test…)
cible: Toute l'équipe UX
objectif: Bloc « Objectif » de la fiche.
domaine: Bloc « Domaine d'intervention ».
atout: Bloc « Atout principal ».
maj: 2026-11-02
ordre: 10              # tri dans la grille (plus petit = en premier)
---

## Rôle et valeur ajoutée

> Texte libre en Markdown (titres, listes, citations, code, liens, images).
```

Les champs `objectif`, `domaine` et `atout` sont facultatifs (le bloc « En un coup d'œil » n'affiche que ceux renseignés).

**Fichiers téléchargeables** (onglet « Fichiers ») : dépose-les dans `content/files/<identifiant>/`.

## Démarrage en local

1. `npm install`
2. Copier `.env.example` en `.env` : `ADMINISTRATION_URL` (instance locale d'Administration) et `INTERNAL_API_SECRET` identique à celui d'Administration, plus un `JWT_SECRET`.
3. `npm start` puis ouvrir [http://localhost:3070/admin](http://localhost:3070/admin).

## Déployer sur Render

1. "New +" → "Web Service" → connecter le dépôt GitHub. Build : `npm install`, Start : `npm start`.
2. Variables d'environnement : `ADMINISTRATION_URL`, `INTERNAL_API_SECRET` (identique à Administration), `JWT_SECRET` (chaîne aléatoire, ex. `openssl rand -hex 32`). Ne pas définir `PORT`.
3. Une fois l'URL Render connue, la reporter dans les autres outils de la suite (tuile « Nos outils », iframe de déconnexion de UX Dashboard, `TOOL_URLS` d'Administration).
