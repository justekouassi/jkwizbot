# JkwizBot

⚖️ [JkwizBot](https://wa.me/64993911) est un assistant intelligent conçu pour rendre WhatsApp plus puissant et amusant. Que tu sois amateur de quiz, ou simple curieux, ce bot te propose une large palette d'outils pour personnaliser tes messages, gérer tes discussions, apprendre, et automatiser de nombreuses tâches. Grâce à ses commandes avancées, et son interface simple, tu peux booster ton expérience WhatsApp en privé comme en groupe.

## Sommaire

- [JkwizBot](#jkwizbot)
	- [Sommaire](#sommaire)
	- [Commandes disponibles](#commandes-disponibles)
		- [Module aide](#module-aide)
		- [Module citation](#module-citation)
		- [Module conversion](#module-conversion)
		- [Module math](#module-math)
		- [Module quiz](#module-quiz)
		- [Module statut](#module-statut)
		- [Module sticker](#module-sticker)
		- [Module style de texte](#module-style-de-texte)
		- [Module tag](#module-tag)
		- [Module traduction](#module-traduction)
	- [Comment l'installer sur un VPS](#comment-linstaller-sur-un-vps)
	- [Quelques ressources](#quelques-ressources)

## Commandes disponibles

### Module aide

Permet de s’orienter, d’obtenir de l’aide et d’accéder à la documentation du bot et de ses modules.

- [x] `help` : affiche les informations générales du bot
- [x] `menu` : affiche la liste simplifiée des commandes disponibles
- [x] `menul` : affiche la liste détaillée des commandes disponibles par module
- [x] `help [module]` : affiche la documentation complète du module défini

### Module citation

Accède rapidement à des citations bibliques ou coraniques sur demande.

- [x] `bible [référence]` : affiche la référence biblique définie.
- [x] `coran [référence]` : affiche la référence coranique définie.

### Module conversion

Permet la conversion d’unités (monnaies, longueurs, capacités, etc.) ou de bases numériques.

- [x] `convertis [xxx] [yyy] [nombre]` : convertit un nombre de la grandeur de code (unité) xxx vers celle de code yyy. La grandeur peut être une monnaie, une longueur, une capacité, etc. Il faut s'assurer que les deux grandeurs sont du même ordre.
- [x] `base [b1] [b2] [nombre]` : convertit un nombre de la base b1 à la base b2 où les bases b1 et b2 peuvent être la base romaine (rom) ou n'importe quelle base numérique entre 2 et 36.

### Module math

Outils pour effectuer des calculs mathématiques ou des conversions de durées rapidement depuis WhatsApp.

- [x] `calc [expression]` : calcule une expression mathématique
- [x] `calch [nombre]` : calcule une expression de durée (h / min)

### Module quiz

Tout pour créer, lancer, gérer et interrompre des quiz, avec différents modes et types de questions.

- [x] `decale [mot] [nombre]` : trouve le décalé d'un mot avec son décalage défini
- [x] `origines [mot]` : trouve les deux origines possibles (à droite ou à gauche) du mot 
- [x] `next` : génère un quiz de culture générale mode next
- [x] `quiz` : génère un quiz de culture générale mode 1ère réponse
- [x] `qstop` : met fin au quiz en cours
- [x] `qpause` : met une pause au quiz en cours
- [x] `qplay` : reprend le quiz en cours
- [x] `qthemes` : affiche la liste des thèmes disponibles en français pour le mode quiz

### Module statut

Publie des statuts WhatsApp

- [x] `status` : publie un statut. Avantage quand on peu de data

### Module sticker

Transforme images et vidéos en stickers ou GIFs ; réalise la conversion inverse également.

- [x] `sticker` : transforme un média (image, vidéo ou GIF) en sticker (statique ou animé selon le cas)
- [x] `unsticker` : transforme un sticker en image
- [x] `gif` : transforme une vidéo en GIF

### Module style de texte

Permet de styliser n’importe quel texte : gras, italique, majuscules, bases spéciales, police personnalisée, etc.
Chaque commande prend en paramètre un texte et le convertit dans le style défini.  
Schéma : `commande [texte]`

- [x] `gras` : gras
- [x] `camel` : camel case
- [x] `csnake` : snake case majuscules
- [x] `italique` : italique 
- [x] `lower` : minuscules
- [x] `leet` : leet code
- [x] `pascal` : pascal case
- [x] `snake` : snake case minuscules
- [x] `barre` : barré
- [x] `title` : première lettre du texte en majuscule et les autres lettres en minuscules
- [x] `unicode` : UTF-8
- [x] `upper` : majuscules
- [x] `[police]` : police donnée
- [x] `qrcode` : code QR
- [x] `tts` : text-to-speech. Transforme un texte en audio

### Module tag

Outils puissants pour taguer personnes, équipes ou catégories spécifiques dans un groupe, selon différents critères.

- [x] `tagadmins` : tague tous les administrateurs du groupe
- [x] `tagothers` : tague tous les membres du groupe exceptés les administrateurs
- [x] `tags [list]` : affiche toutes les équipes enregistrées
- [x] `tags [team] [@membres...]` : crée ou met à jour une team avec les personnes mentionnées
- [x] `tags [team]` : tague tous les membres d'une team déclarée
- [x] `tags add [team] [@membres...]` : ajoute des membres à une team existante
- [x] `tags remove [team] [@membres...]` : retire des membres d'une team existante
- [x] `tags delete [team]` : supprime une équipe existante

### Module traduction

Permet la traduction instantanée de n’importe quel texte dans la langue de votre choix via codes ISO.

- [x] `traduire auto [lang] [texte]` : traduit un texte dans la langue de code ISO [to]. ⚠️ Peut mal fonctionner en raison de la détection automatique.
- [x] `traduire [from] [to] [texte]` : traduit un texte de la langue de code ISO [from] vers celle de code ISO [to]

## Comment l'installer sur un VPS

1. git clone [https://github.com/justekouassi/jkwizbot.git](https://github.com/justekouassi/jkwizbot.git)
2. cd jkwiz-bot
3. yarn install
4. sudo apt install -y libgbm-dev libasound2t64 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libnss3 lsb-release xdg-utils wget ffmpeg
5. yarn start

## Quelques ressources

- Remote path update URL : [https://github.com/wppconnect-team/wa-version/tree/main/html](https://github.com/wppconnect-team/wa-version/tree/main/html)
- [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/) pour les stickers animés
