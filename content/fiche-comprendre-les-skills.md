---
type: fiche
titre: Les skills : c'est quoi et comment les installer ?
resume: Ce qu'est un skill, à quoi il sert, comment Claude s'en sert et comment l'installer pour toi ou pour toute l'équipe.
cible: Toute l'équipe UX
objectif: Comprendre les skills pour savoir quand en utiliser, en installer ou en créer un.
domaine: Claude (application web et bureau) et Claude Code.
atout: Une méthode écrite une seule fois, appliquée de la même façon par tout le monde, sans avoir à la réexpliquer.
maj: 2026-11-02
ordre: 10
action: Télécharger un modèle de skill
fichier: modele-SKILL.md
---

## C'est quoi, un skill ?

> Un skill est une **fiche méthode** que Claude sait lire. Elle décrit **quand** l'utiliser et **comment** faire une tâche précise : mener une revue heuristique, rédiger un guide d'entretien, reproduire un écran en wireframe…

Concrètement, c'est un dossier qui contient au minimum un fichier `SKILL.md`, en deux parties :

- **Un en-tête** avec le nom du skill et sa description. La description dit à Claude dans quelles situations s'en servir.
- **Des instructions** : les étapes, les règles à respecter et le format du livrable attendu.

Le dossier peut aussi contenir des ressources que Claude utilisera au besoin : un modèle de document, une grille d'analyse, des exemples, voire un petit script.

## À quoi ça sert ?

Sans skill, il faut réexpliquer sa méthode à chaque conversation, et chacun l'explique un peu différemment. Le résultat varie d'une personne à l'autre et d'un jour à l'autre.

Avec un skill, la méthode est écrite **une fois**, et Claude l'applique **à chaque fois** qu'elle est pertinente.

## Quels bénéfices pour l'équipe ?

- **Des livrables homogènes** : même structure, même niveau d'exigence, quel que soit l'auteur.
- **Un gain de temps** : plus de long prompt à rédiger ou à retrouver dans ses notes.
- **Un savoir-faire capitalisé** : la bonne pratique d'une personne devient celle de toute l'équipe, y compris pour les nouveaux arrivants.
- **Moins de tokens consommés** : Claude ne charge le contenu d'un skill que lorsqu'il en a besoin.

## Comment ça marche ?

1. **Claude connaît la liste de tes skills**, mais il n'en lit que le nom et la description. C'est très léger : tu peux en installer beaucoup sans alourdir tes conversations.
2. **Quand ta demande correspond à une description**, il ouvre le skill et suit ses instructions. Tu n'as rien de spécial à faire : écris ta demande normalement, par exemple *« Fais-moi une revue heuristique de cet écran »*.
3. **Si le skill contient des ressources** (modèle, grille…), Claude les consulte seulement à ce moment-là.

Tu peux aussi l'appeler explicitement : *« Utilise le skill revue heuristique sur cette maquette »*.

**Bon à savoir** : c'est la description qui déclenche le skill. Si un skill ne se lance pas quand il devrait, c'est généralement sa description qu'il faut préciser.

## Comment l'installer ?

### Dans Claude (application web ou bureau)

1. Ouvre **Paramètres**, puis **Capacités**.
2. Vérifie que l'**exécution de code et la création de fichiers** est activée : les skills en ont besoin.
3. Dans la section **Skills**, active les skills proposés ou clique sur **Importer un skill** et choisis le fichier `.zip` du dossier du skill.

Les intitulés exacts peuvent varier légèrement selon la version de l'application.

### Pour toute l'équipe

Un administrateur de l'organisation Claude peut publier un skill pour tous les membres : il apparaît alors automatiquement chez chacun, sans installation. C'est la meilleure option pour les skills de l'équipe UX.

### Dans Claude Code

Copie le dossier du skill dans `~/.claude/skills/` pour l'avoir dans tous tes projets, ou dans le dossier `.claude/skills/` d'un projet pour le réserver à ce projet.

## Et pour créer son propre skill ?

Pas besoin d'écrire le fichier à la main : décris ta méthode à Claude, par exemple *« Aide-moi à créer un skill pour nos revues heuristiques, avec notre grille de gravité »*. Il te guidera et te livrera le dossier prêt à installer.

Teste ensuite le skill sur deux ou trois cas réels avant de le partager à l'équipe.

Le modèle de fichier `SKILL.md` se télécharge avec le bouton en haut de cette fiche.
