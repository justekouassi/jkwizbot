const QuizEngine = require("./quiz_engine")
const { getRank } = require("./quiz_service")

/** Instanciation du moteur de quiz en mode TRAINING */
const engine = new QuizEngine("TRAINING")

/** Configuration spécifique au mode TRAINING */
const config = {
	/** Génère le message d'accueil affiché avant le début du quiz */
	generateWelcomeMessage: (state, counter) => {
		return `🖊 ${state.maxQuestions} questions (1 marqueur)
⏱ ${engine.tryTime / 1000}s par question
🧾 Thèmes : ${state.themes || "Culture générale"}
🏁 Départ dans ${counter}s !`
	},

	/** Traite l'attribution des points après chaque question */
	processPoints: (state) => {
		const winner = [...state.participants].find((p) => p.isCorrect)

		if (winner) {
			state.goodAnswers++
			const authorId = winner.id

			// Mise à jour du score
			if (!state.scores[authorId])
				state.scores[authorId] = { points: 0, correctAnswers: 0 }
			state.scores[authorId].points += 1
			state.scores[authorId].correctAnswers++

			// Création du mini-classement
			const sorted = Object.entries(state.scores).sort(
				(a, b) => b[1].points - a[1].points,
			)

			const mentions = []
			const msgLines = sorted.map(([id, data]) => {
				mentions.push(id)

				// On formate le tag pour le texte
				const tag = `@${id.split("@")[0]}`
				const isCurrentWinner = id === authorId

				return `${isCurrentWinner ? "✅ " : ""}${tag} : ${data.points} pts`
			})

			const msg = msgLines.join("\n")

			// Envoi de la réponse avec les mentions activées
			winner.message.reply(msg, null, {
				mentions: mentions,
			})

			return { isGood: true }
		}

		return { isGood: false }
	},

	/** Formate le message des scores finaux */
	formatScoreMessage: (state) => {
		let scoreMessage = "```🚩 Classement du quiz 🚩```\n\n"
		scoreMessage += `📆 Date : ${state.date}\n`
		scoreMessage += `🕑 Timing : ${state.horaire}\n`
		scoreMessage += `🧾 Thèmes : ${
			state.themes !== ""
				? state.themes.split(",").join(", ")
				: "Culture générale"
		}\n\n`

		const sortedScores = Object.entries(state.scores).sort(
			(a, b) => b[1].points - a[1].points,
		)

		if (sortedScores.length === 0)
			return { text: scoreMessage + "\n_Aucun point marqué._", mentions: [] }

		let currentRank = 1
		let previousPoints = sortedScores[0][1].points
		const mentions = []

		sortedScores.forEach(([authorId, { points }], index) => {
			// Logique de gestion des ex æquo
			if (points < previousPoints) {
				currentRank = index + 1
			}
			// On prépare le tag
			const tag = `@${authorId.split("@")[0]}`
			mentions.push(authorId)

			scoreMessage += `${getRank(currentRank)}. ${tag} - *${points}* pts\n`
			previousPoints = points
		})

		scoreMessage += `\nScore global : ${state.goodAnswers} / ${state.questionCount}`
		return { text: scoreMessage, mentions }
	},
}

module.exports = {
	startTrainingGame: (c, m, e) => engine.init(c, m, e, config),
	stopTrainingGame: (c, m) => engine.stop(c, m),
	pauseTrainingGame: (c, m) => engine.pause(m),
	resumeTrainingGame: (c, m) => engine.resume(m),
	trainingEngine: engine,
}
