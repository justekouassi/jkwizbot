const { Client, LocalAuth } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const { commandFunctions } = require("./commands")
const { getParameter } = require("./config/params_service.js")
const os = require("os")
const {
	getUsernameC,
	getMessageOrigineC,
	transformTags,
} = require("./helper/message.js")
const { logger } = require("./helper/logger.js")
const dotenv = require("dotenv")
const { trainingEngine } = require("./commands/geh/training.js")
dotenv.config()

const isLinux = os.platform() === "linux"

// initialisation du client
const client = new Client({
	authStrategy: new LocalAuth(),
	webVersionCache: {
		type: "local",
		remotePath:
			"https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1034382497-alpha.html",
	},
	...(isLinux && {
		puppeteer: {
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		},
	}),
})

// envoyer une notification de réussite une fois que le client est connecté
client.once("ready", async () => {
	logger.info("Client is ready!".green)
	await client.pupPage.evaluate(() => {
		window.WWebJS.sendSeen = async () => {}
	})
})

// envoyer un code QR à scanner pour connecter le client
client.on("qr", (qr) => {
	logger.info(qr.green)
	qrcode.generate(qr, { small: true }, function (qrcode) {
		logger.info(qrcode)
	})
})

// on écoute le message reçu
client.on("message_create", async (message) => {
	try {
		// Toujours à jour avec le préfixe
		let userPrefix = getParameter("prefix") || "."

		// Si un quiz est en cours, on lui transmet le message
		if (trainingEngine.gameInProgress) {
			await trainingEngine.handleIncomingMessage(
				client,
				trainingEngine.chatId,
				message,
			)
		}

		// Exécute la commande si applicable
		if (message.body.startsWith(userPrefix)) {
			const withoutPrefix = message.body.slice(userPrefix.length).trim()
			const [command, ...args] = withoutPrefix.split(/\s+/)

			const commandEntry = commandFunctions[command]
			const expression = args.join(" ")
			if (commandEntry && typeof commandEntry.handler === "function") {
				await commandEntry.handler(client, message, expression)
			}
		}

		// Prépare le nom de l'utilisateur
		const userName = await getUsernameC(client, message)
		// Prépare le message avec tags transformés
		const messageBody = message.hasMedia
			? `[${message.type}]`
			: await transformTags(client, message.body)
		// Log le message
		const messageOrigine = await getMessageOrigineC(client, message)
		logger.info(`${userName} (${messageOrigine}) : ${messageBody}`)
	} catch (error) {
		logger.error(`Erreur dans la gestion du message : ${error.stack || error}`)
	}
})

// Start your client
client.initialize()
