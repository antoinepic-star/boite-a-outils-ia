---
type: tip
titre: Prompter en consommant moins de tokens
resume: Quelques réflexes pour obtenir de meilleures réponses, plus vite, sans épuiser ton quota d'utilisation.
cible: Toute l'équipe UX
objectif: Garder des conversations courtes et ciblées pour rester sous les limites d'utilisation.
domaine: Toutes les conversations avec Claude, en particulier les longues sessions de travail.
atout: Moins de tokens consommés, c'est aussi des réponses plus rapides et plus précises.
maj: 2026-11-02
ordre: 35
---

## Pourquoi c'est important

> À chaque nouveau message, Claude relit **toute** la conversation : tes messages, ses réponses, les fichiers et les captures. Plus une conversation est longue, plus chaque échange coûte cher, et plus la limite d'utilisation arrive vite.

## Les bons réflexes

1. **Une conversation par sujet.** Quand tu passes à autre chose, ouvre une nouvelle conversation plutôt que de continuer l'ancienne. Dans Claude Code, la commande `/clear` remet le compteur à zéro.
2. **Donne le contexte une fois, au bon endroit.** Les consignes qui reviennent (ton rôle, le projet, le ton attendu) vont dans les instructions du **projet** Claude ou dans sa mémoire, pas recopiées dans chaque message.
3. **Sois précis dès le départ.** *« Réécris ce paragraphe en 3 phrases, ton direct, pour un client »* évite deux ou trois allers-retours de corrections.
4. **N'envoie que ce qui sert.** Recadre tes captures sur la zone utile, colle l'extrait concerné plutôt que le document entier, et ne renvoie pas un fichier déjà partagé dans la conversation.
5. **Demande des réponses courtes** quand tu n'as pas besoin de détails : *« réponds en 5 lignes maximum »*, *« juste le code, sans explication »*.
6. **Regroupe tes demandes** liées dans un seul message plutôt que de les envoyer une par une.
7. **Choisis le bon modèle.** Pour une reformulation, une traduction ou un tri simple, un modèle plus léger (Haiku, Sonnet) suffit largement et consomme bien moins.

## Si la conversation devient trop longue

Demande à Claude un **résumé de ce qui a été décidé**, puis colle ce résumé dans une nouvelle conversation pour repartir sur une base légère. Dans Claude Code, la commande `/compact` fait ce travail automatiquement.
