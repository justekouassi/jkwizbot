const { getParameter } = require("../../config/params_service")
const { registerCommand } = require("../registry")
const { decale, origines } = require("./mot_decale")
const qthemes = require("./qthemes")
const { quizEngine, startQuizGame } = require("./quiz")
const { trainingEngine, startTrainingGame } = require("./training")

// mot décalé
registerCommand("decale", decale, {
	module: "geh",
	description:
		"Décale chaque lettre d'un mot d'un certain nombre de positions dans l'alphabet (Chiffre de César).",
	usage:
		"decale <mot> <décalage>\nExemples:\ndecale bonjour 1 => cpokkpvs\ndecale Salut -2 => Qyjsr",
})
registerCommand("origines", origines, {
	module: "geh",
	description:
		"Donne les deux mots possibles si le mot a été décalé d'une position vers la droite ou la gauche.",
	usage: "origines <mot>\nExemples:\norigines cpokkpvs => bonjour - dpollqwt",
})
// mode quiz training
registerCommand("quiz", startTrainingGame, {
	module: "geh",
	description:
		"Lance un quiz à un marqueur selon le nombre de questions et les thèmes choisis. Vous recevez des questions à la suite sans interruption et le bot valide la première bonne réponse dans le temps imparti à la question.",
	usage:
		"quiz [nb_questions] [thèmes...]\nExemples :\nquiz\nquiz 15\nquiz 20 histoire\nquiz 25 géographie,littérature",
})
// mode quiz next multiple
registerCommand("next", startQuizGame, {
	module: "geh",
	description:
		"Lance un quiz à deux marqueurs selon le nombre de questions et les thèmes choisis. Le bot valide les deux premières bonnes réponses après le temps imparti à la question.",
	usage:
		"next [nb_questions] [thèmes...]\nExemples :\nnext\nnext 15\nnext 20 histoire\nnext 25 géographie,littérature",
})

/** Fonction universelle pour arrêter n'importe quel jeu actif */
const stopAnyGame = (client, message) => {
	if (quizEngine.gameInProgress) quizEngine.stop(client, message)
	if (getParameter("gameInProgress")) trainingEngine.stop(client, message)
}

/** Fonction universelle pour mettre en pause */
const pauseAnyGame = (client, message) => {
	if (quizEngine.gameInProgress) quizEngine.pause(message)
	if (trainingEngine.gameInProgress) trainingEngine.pause(message)
}

/** Fonction universelle pour reprendre */
const resumeAnyGame = (client, message) => {
	if (quizEngine.gameInProgress && quizEngine.gamePaused)
		quizEngine.resume(message)
	if (trainingEngine.gameInProgress && trainingEngine.gamePaused)
		trainingEngine.resume(message)
}

// geh
registerCommand("qthemes", qthemes, {
	module: "geh",
	description: "affiche la liste des thèmes disponibles pour le quiz",
	usage: "qthemes",
})
registerCommand("qstop", stopAnyGame, {
	module: "geh",
	description: "Arrête le quiz ou l'entraînement en cours.",
	usage: "qstop",
})
registerCommand("qpause", pauseAnyGame, {
	module: "geh",
	description: "Met le jeu actuel en pause.",
	usage: "qpause",
})
registerCommand("qplay", resumeAnyGame, {
	module: "geh",
	description: "Reprend le jeu actuel.",
	usage: "qplay",
})
