---
type: skill
titre: Skill : Reproduction d'écran en wireframe
resume: Donne l'URL d'une page, reçois un fichier HTML qui la reproduit fidèlement en gris, à tous ses points de rupture, prêt à être optimisé.
cible: Toute l'équipe UX
objectif: Obtenir en quelques minutes un wireframe HTML fidèle d'une page existante, comme point de départ d'une optimisation UX.
domaine: Audit et refonte de pages existantes, propositions d'optimisation, préparation d'ateliers.
atout: Une copie conforme au pixel près (textes, espacements, points de rupture et états), sans redessiner l'écran à la main.
maj: 2026-11-03
ordre: 10
action: Télécharger le skill
fichier: reproduction-ecran-en-wireframe.skill
---

## Rôle et valeur ajoutée

> Avant de proposer des optimisations sur une page existante, il faut souvent la redessiner à l'identique. Ce skill fait ce travail à ta place : tu donnes l'URL, Claude te livre la page reproduite en gris, dans un fichier HTML que tu peux ouvrir et modifier. Tu passes directement aux vraies questions UX.

## Comment l'utiliser

1. **Connecte Claude in Chrome** (l'extension Claude de ton navigateur Chrome). Ce n'est pas obligatoire, mais c'est ce qui rend le skill vraiment autonome.
2. Dans une nouvelle conversation, écris simplement : *« Reproduis cette page en wireframe : [URL] »*.
3. Claude te demande de confirmer en une phrase que la page est celle d'un client, ou qu'elle entre dans le cadre de ta mission.
4. Tu reçois un **fichier `.html` à télécharger**. Ouvre-le dans ton navigateur.

### Avec ou sans Chrome

- **Avec Claude in Chrome**, tu ne fournis rien d'autre que l'URL. Claude ouvre la page dans ton navigateur et relève tout lui-même : textes, styles, points de rupture, images, et les états (menus, onglets, accordéons, survols). Les pages derrière une connexion fonctionnent aussi, puisqu'il utilise ta session.
- **Sans Chrome**, Claude lit la page depuis l'URL, puis te demande en un seul message une capture bureau, une capture mobile et une capture par état important. Il t'explique comment les faire avec ton navigateur. Pour une page derrière une connexion, il te demandera la page enregistrée complète, en `.zip`.

## Ce que tu reçois

- **Un seul fichier HTML**, CSS et JavaScript inclus, au code lisible : les gris sont déclarés en variables en tête de fichier, et les sections sont commentées.
- **Une palette de 6 gris** attribués par rôle : fonds, contours, texte principal, texte secondaire.
- **Les images du site**, chargées directement depuis leur adresse et passées en noir et blanc.
- **Tous les points de rupture du site**, aux mêmes seuils, avec la même largeur maximale de contenu.
- **Les états fonctionnels** (menu ouvert, onglets, accordéons, survols), qui se découvrent en survolant et en cliquant, comme sur le site.
- **Un prototype fermé** : les liens gardent leur apparence et leurs survols, mais un clic ne mène nulle part (autres pages, sites externes, téléchargements, e-mail, téléphone, formulaires). Seules les ancres de la page restent actives.

## Une fidélité stricte

Le skill ne corrige rien, n'améliore rien et ne simplifie rien : c'est ce qui en fait une bonne base de travail.

- Les textes sont copiés **tels quels**, fautes et libellés maladroits compris : ce sont autant de points à optimiser.
- Les dimensions sont **identiques** : tailles de texte, marges, espacements, arrondis. Les titres passent à la ligne au même endroit.
- Les **zones cliquables** sont les mêmes : si toute une carte est un lien sur le site, toute la carte réagit au survol.
- Aucun design system n'est appliqué, même s'il y en a un dans le projet.

## Bon à savoir

- **Les images s'affichent tant que le site est en ligne** et que ton ordinateur est connecté. Si un site interdit l'affichage de ses images ailleurs, elles sont remplacées par des blocs gris aux bonnes dimensions, et Claude te le signale.
- **Les polices** du site ne se chargent généralement pas depuis un fichier local. Claude utilise la même police via Google Fonts si elle y existe, sinon la plus proche, et te prévient.
- **Le résultat est un fichier, pas un artefact** : Claude ne doit pas le publier comme page en ligne ni comme prototype Claude Design, car les images du site ne s'afficheraient plus. Si c'est le cas, demande-lui le fichier `.html`.
- **Réservé aux pages de nos clients**, ou reproduites dans le cadre d'une mission : ce n'est pas un outil de copie de sites concurrents.

## Installer le skill

1. Télécharge le skill avec le bouton en haut de cette fiche.
2. Dans Claude, ouvre **Réglages**, puis, sous **Personnalisation**, l'entrée **Skills**, et importe le fichier.
3. Si le skill est déjà installé, accepte de remplacer l'ancienne version.

Pour le détail, consulte la fiche « Les skills : c'est quoi et comment les installer ? ».

## Versions

- **V1, le 2 novembre 2026** : première version.
- **V2, le 3 novembre 2026** :
  - Le prototype est fermé : les liens vers d'autres pages, d'autres sites, des téléchargements, une adresse e-mail, un numéro de téléphone ou un envoi de formulaire ne mènent plus nulle part.
  - Le menu déroulant qui permettait d'afficher chaque état disparaît : les états se découvrent en survolant et en cliquant, comme sur le site.
