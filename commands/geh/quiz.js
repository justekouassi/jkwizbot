const QuizEngine = require("./quiz_engine")
const { getRank } = require("./quiz_service")

/** Instancie le moteur du quiz avec le mode "QUIZ" */
const engine = new QuizEngine("QUIZ")

/** Configuration du quiz : contient les callbacks pour la logique du jeu */
const config = {
	/** Génère le message de bienvenue au démarrage du quiz */
	generateWelcomeMessage: (state, counter) => {
		return `🖊 *${state.maxQuestions} questions (2 marqueurs)*
⏱ ${engine.tryTime / 1000}s par question
🧾 Thèmes : ${state.themes || "Culture générale"}
🏁 Départ dans ${counter}s !`
	},

	/** Gère l'attribution des points selon les bonnes réponses à la fin d'une question */
	processPoints: (state) => {
		// Filtre les participants ayant trouvé la bonne réponse
		let correctOnes = [...state.participants].filter((p) => p.isCorrect)
		let isGood = correctOnes.length > 0

		if (isGood) {
			// Incrémente le compteur de bonnes réponses globales
			state.goodAnswers++
			// Si une seule bonne réponse, bonus de 30 points
			if (correctOnes.length === 1) {
				// Utilisation de config. au lieu de this.
				config.updateScore(state, correctOnes[0].id, 30, true)
				correctOnes[0].message.reply("*✅ +30*")
			} else {
				// Sinon, le plus rapide prend 20 points, le second 10
				if (correctOnes[0]) {
					config.updateScore(state, correctOnes[0].id, 20, true)
					correctOnes[0].message.reply("*✅ +20*")
				}
				if (correctOnes[1]) {
					config.updateScore(state, correctOnes[1].id, 10, true)
					correctOnes[1].message.reply("*✅ +10*")
				}
				// Pour les autres (3ème, etc.), on compte la bonne réponse sans points
				correctOnes
					.slice(2)
					.forEach((p) => config.updateScore(state, p.id, 0, true))
			}
		}
		// Renvoie si au moins une bonne réponse a été donnée
		return { isGood }
	},

	/** Met à jour le score et le nombre de bonnes réponses pour un participant donné */
	updateScore: (state, id, pts, correct) => {
		// Initialise la structure de score si besoin
		if (!state.scores[id]) state.scores[id] = { points: 0, correctAnswers: 0 }
		state.scores[id].points += pts
		if (correct) state.scores[id].correctAnswers++
	},

	/** Génère le message de classement général avec les points de chaque participant */
	formatScoreMessage: (state) => {
		let msg = "```🚩 CLASSEMENT NEXT 🚩```\n\n"
		msg += `📆 Date : ${state.date}\n`
		msg += `🕑 Timing : ${state.horaire}\n`
		msg += `🧾 Thèmes : ${state.themes || "Culture générale"}\n\n`

		const sorted = Object.entries(state.scores).sort(
			(a, b) => b[1].points - a[1].points,
		)

		if (sorted.length === 0) {
			msg += "_Aucun point marqué._\n"
		} else {
			let currentRank = 1
			let prevPoints = sorted[0][1].points

			sorted.forEach(([id, data], i) => {
				if (data.points < prevPoints) currentRank = i + 1

				const unit = data.correctAnswers > 1 ? "reps" : "rep"
				msg += `${getRank(currentRank)}. *${id}* - *${data.points}* pts (${
					data.correctAnswers
				} ${unit})\n`
				prevPoints = data.points
			})
		}

		msg += `\nGlobal : ${state.goodAnswers}/${state.questionCount}`
		return msg
	},
}

module.exports = {
	startQuizGame: (c, m, e) => engine.init(c, m, e, config),
	stopQuizGame: (c, m) => engine.stop(c, m),
	pauseQuizGame: (c, m) => engine.pause(m),
	resumeQuizGame: (c, m) => engine.resume(m),
	quizEngine: engine,
}
