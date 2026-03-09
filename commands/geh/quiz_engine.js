const { Client, Message } = require("whatsapp-web.js")
const { validateAnswer } = require("./correction")
const { dateInFrench } = require("../../helper/format_date")
const { getQuestions } = require("./quiz_service")
const { setParameter, getParameter } = require("../../config/params_service")

const NB_NORMAL_Q = 25
const NB_MAX_Q = 50

/**
 * Classe principale pour gérer le fonctionnement d'un quiz
 */
module.exports = class QuizEngine {
	constructor(mode = "QUIZ") {
		/** Mode de jeu : QUIZ (2 marqueurs), TRAINING (1 marqueur) */
		this.mode = mode
		/** Indique si une partie est en cours */
		this.gameInProgress = false
		/** Indique si la partie est en pause */
		this.gamePaused = false

		/** Contient l'état complet du jeu courant */
		this.state = this.resetState()

		/** Temps pour répondre à une question (en ms) */
		this.tryTime = 15_000
		/** Temps laissé entre la réponse correcte et la question suivante (en ms) */
		this.nextTime = 4_700

		this.client = null
		this.chatId = null

		/** Résolveur de la promesse de pause */
		this._pauseResolve = null
		/** Résolveur de la promesse de question */
		this._questionResolve = null
		/** Verrou booléen pour éviter le double appel de endQuestion. */
		this._endingQuestion = false
	}

	/**
	 * Met en pause l'exécution pendant un certain temps.
	 * @param {number} ms - Durée de la pause en millisecondes.
	 * @returns {Promise<void>} Promesse résolue après la durée spécifiée.
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	/**
	 * Réinitialise l'état du jeu pour une nouvelle partie
	 * @returns {Object} Nouvel état vide du quiz
	 */
	resetState() {
		return {
			currentQuestion: null,
			participantIds: new Set(),
			participants: [],
			scores: {},
			questionCount: 0,
			maxQuestions: 0,
			goodAnswers: 0,
			listQuestions: [],
			playQuestions: [],
			date: "",
			horaire: "",
			acceptingAnswers: false,
			themes: "",
		}
	}

	/**
	 * Initialise une partie de quiz
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String} expression
	 * @param {Object} config
	 */
	async init(client, message, expression, config) {
		if (this.gameInProgress || getParameter("gameInProgress")) {
			message.reply("Un quiz est déjà en cours !")
			return
		}

		setParameter("gameInProgress", true)
		this.gameInProgress = true

		this.state = this.resetState()
		this.config = config
		this.client = client

		let nbReq = NB_NORMAL_Q
		let themes = ""
		let params = expression.trim().split(" ").filter(Boolean)

		if (params.length === 0) {
			// Commande vide : .quiz
			nbReq = NB_NORMAL_Q
			themes = ""
		} else if (params.length === 1) {
			// Soit .quiz <nombre> soit .quiz <theme(s)>
			const firstParamNumber = parseInt(params[0])
			if (!isNaN(firstParamNumber)) {
				nbReq = firstParamNumber
				themes = ""
			} else {
				nbReq = NB_NORMAL_Q
				themes = params[0]
			}
		} else {
			// Plusieurs paramètres : <nombre> <thème(s)> OU <thème(s)> <nombre>
			const firstParamNumber = parseInt(params[0])
			const lastParamNumber = parseInt(params[params.length - 1])
			if (!isNaN(firstParamNumber)) {
				nbReq = firstParamNumber
				themes = params.slice(1).join(",")
			} else if (!isNaN(lastParamNumber)) {
				nbReq = lastParamNumber
				themes = params.slice(0, -1).join(",")
			} else {
				// Aucun nombre détecté, tout est thème
				nbReq = NB_NORMAL_Q
				themes = params.join(",")
			}
		}

		themes = themes.replace(/[,]+/g, ",").replace(/^,|,$/g, "").trim()

		this.state.listQuestions = await getQuestions(
			Math.min(nbReq, NB_MAX_Q),
			themes,
		)

		this.state.maxQuestions = this.state.listQuestions.length
		this.state.themes = themes

		const chat = await message.getChat()
		this.chatId = chat.id._serialized

		let startAt = new Date()
		let gmtString = startAt.toLocaleString("fr-FR", {
			timeZone: "GMT",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})
		let [hours, minutes] = gmtString.split(":")
		this.state.date = dateInFrench(startAt)
		this.state.horaire = `${hours}h${minutes} à `

		if (!this.state.listQuestions || this.state.listQuestions.length === 0) {
			message.reply(
				"Aucune question trouvée. Recherchez les thèmes existants avec la commande\n*.qthemes*",
			)
			this.stop(client, message)
			return
		}

		// Lancement du décompte initial avant la première question
		await this.countdown(message)

		this.startLoop(this.client, this.chatId)
	}

	/**
	 * Gère le décompte avant le début effectif du quiz
	 * @param {Message} message - message de réponse au lancement
	 * @returns {Promise}
	 */
	async countdown(message) {
		let counter = 5 // nombre de secondes du décompte
		let msgStr = this.config.generateWelcomeMessage(this.state, counter)
		await message.reply(msgStr)

		return new Promise((resolve) => {
			let interval = setInterval(async () => {
				counter -= 1
				if (counter <= 0) {
					clearInterval(interval)
					resolve()
				}
			}, 1000) // chaque seconde
		})
	}

	/**
	 * Boucle principale : pose les questions séquentiellement.
	 * @param {Client} client
	 * @param {String} chatId
	 */
	async startLoop(client, chatId) {
		while (
			this.gameInProgress &&
			this.state.questionCount < this.state.maxQuestions
		) {
			if (this.gamePaused) {
				await new Promise((resolve) => {
					this._pauseResolve = resolve
				})
			}

			await this.askQuestion(client, chatId)

			if (this.gameInProgress && !this.gamePaused) {
				await this.sleep(this.nextTime)
			}
		}

		if (this.gameInProgress) {
			await this.endGame(client, chatId)
		}
	}

	async waitForDelivery(client, sentMessage, timeoutMs = 1_000) {
		// Si le message est déjà ACK serveur ou plus, on part immédiatement
		if (sentMessage.ack >= 1) return

		return new Promise((resolve) => {
			// Sécurité : si pas d'ACK après 1s, on continue quand même
			const timer = setTimeout(() => {
				client.off("message_ack", onAck)
				resolve()
			}, timeoutMs)

			const onAck = (msg, ack) => {
				if (msg.id._serialized === sentMessage.id._serialized && ack >= 1) {
					client.off("message_ack", onAck)
					clearTimeout(timer)
					resolve()
				}
			}

			client.on("message_ack", onAck)
		})
	}

	/**
	 * Pose une question et attend la fin du timer de façon réactive (sans busy-wait).
	 * @param {Client} client
	 * @param {String} chatId
	 */
	async askQuestion(client, chatId) {
		if (this.state.questionCount >= this.state.maxQuestions) return

		const q = this.state.listQuestions[this.state.questionCount]
		this.state.currentQuestion = q
		this.state.participantIds.clear()
		this.state.participants = []
		this._endingQuestion = false

		let content = `*${this.state.questionCount + 1}. ${q.title.trim()}*`

		let sentMessage = await client.sendMessage(chatId, content)

		// ⏳ On attend que WhatsApp confirme la réception serveur
		// Le timer ne démarre qu'à partir de ce moment
		await this.waitForDelivery(client, sentMessage)

		this.state.acceptingAnswers = true
		this.state.questionCount++

		// Remplacement du busy-wait par une promesse réactive
		await new Promise((resolve) => {
			this._questionResolve = resolve
			this._questionTimer = setTimeout(resolve, this.tryTime)
		})
		this._questionResolve = null

		// Si personne n'a encore clôturé la question (cas timeout normal)
		if (
			this.state.acceptingAnswers &&
			this.gameInProgress &&
			!this.gamePaused
		) {
			await this.endQuestion(client, chatId)
		}
	}

	/**
	 * Réception d'un message pendant la partie.
	 * @param {Client} client
	 * @param {String} chatId
	 * @param {Message} message
	 */
	async handleIncomingMessage(client, chatId, message) {
		if (!this.gameInProgress || this.gamePaused || !this.state.acceptingAnswers)
			return

		const isCorrectChat = message.from === chatId || message.to === chatId

		if (
			!this.gameInProgress ||
			this.gamePaused ||
			!isCorrectChat ||
			!this.state.acceptingAnswers
		) {
			return
		}

		const author = message.author || message.from
		if (!author) return

		// Vérification + ajout synchrones sur le Set<string>
		if (this.mode !== "TRAINING") {
			if (this.state.participantIds.has(author)) return
			this.state.participantIds.add(author)
		}

		const isCorrect = validateAnswer(
			message.body,
			this.state.currentQuestion.answers,
		)
		const player = {
			id: author,
			answer: message.body,
			message: message,
			isCorrect,
		}
		this.state.participants.push(player)

		if (this.mode === "TRAINING" && isCorrect) {
			// On débloque le timer en appelant le résolveur
			await this.endQuestion(client, chatId)
			if (this._questionTimer) {
				clearTimeout(this._questionTimer)
				this._questionTimer = null
			}
			if (this._questionResolve) {
				this._questionResolve()
				this._questionResolve = null
			}
		}
	}

	/**
	 * Clôture la question courante, distribue les points, envoie la correction.
	 * @param {Client} client
	 * @param {String} chatId
	 */
	async endQuestion(client, chatId) {
		// Verrou atomique contre le double appel
		if (this._endingQuestion) return
		this._endingQuestion = true

		this.state.acceptingAnswers = false

		const q = this.state.currentQuestion
		let responseMsg = `*🛑 : ${q.answers}*`
		if (this.mode === "TRAINING" && q.explanation) {
			responseMsg += `\n\n_${q.explanation}_`
		}

		// Attente ACK sur le message de correction aussi
		// const sentCorrection = await client.sendMessage(chatId, responseMsg)
		// await this.waitForDelivery(client, sentCorrection)

		await client.sendMessage(chatId, responseMsg)

		let result = this.config.processPoints(this.state)

		this.state.playQuestions.push({
			question: q.id,
			platform: "WHATSAPP",
			is_good: result.isGood,
		})
	}

	/**
	 * Fin complète de la partie.
	 * @param {Client} client
	 * @param {String} chatId
	 */
	async endGame(client, chatId) {
		this.gameInProgress = false
		this.gamePaused = false
		setParameter("gameInProgress", false)
		setParameter("gamePaused", false)

		// Nettoyage du timer de question si endGame est appelé en cours de question
		if (this._questionTimer) {
			clearTimeout(this._questionTimer)
			this._questionTimer = null
		}
		if (this._questionResolve) {
			this._questionResolve()
			this._questionResolve = null
		}

		await this.displayScores(client, chatId)
	}

	/**
	 * Affiche le classement final.
	 * @param {Client} client
	 * @param {String} chatId
	 */
	async displayScores(client, chatId) {
		let now = new Date()
		let gmtString = now.toLocaleString("fr-FR", {
			timeZone: "GMT",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})
		let [hours, minutes] = gmtString.split(":")
		this.state.horaire += `${hours}h${minutes}`

		const { text, mentions } = this.config.formatScoreMessage(this.state)
		await client.sendMessage(chatId, text, { mentions })
	}

	/**
	 * Met le quiz en pause.
	 * @param {Message} message
	 */
	pause(message) {
		if (!this.gameInProgress || this.gamePaused) return

		this.gamePaused = true
		setParameter("gamePaused", true)

		this.state.acceptingAnswers = false
		if (this._questionTimer) {
			clearTimeout(this._questionTimer)
			this._questionTimer = null
		}
		if (this._questionResolve) {
			this._questionResolve()
			this._questionResolve = null
		}

		message.reply("⏸ *Pause pipi..* ⏸")
	}

	/**
	 * Reprend le quiz après une pause.
	 * @param {Message} message
	 */
	async resume(message) {
		if (!this.gameInProgress || !this.gamePaused) return

		this.gamePaused = false
		setParameter("gamePaused", false)

		message.reply("▶️ *Allez, on reprend !* ▶️")

		// Déverrouillage de la promesse de pause dans startLoop.
		if (this._pauseResolve) {
			this._pauseResolve()
			this._pauseResolve = null
		}
	}

	/**
	 * Arrête complètement le quiz.
	 * @param {Client} client
	 * @param {Message} message
	 */
	async stop(client, message) {
		if (!getParameter("gameInProgress")) {
			message.reply("Aucun quiz en cours !")
			return
		}

		const incomingChatId =
			message.to === client.info.wid._serialized ? message.from : message.to

		if (incomingChatId === this.chatId) {
			message.reply("🛑 *Le quiz a été arrêté.*")
			await this.endGame(client, this.chatId)
		}
	}
}
