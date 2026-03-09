const { choisir } = require("../../helper/message")
const QRCode = require("qrcode")
const path = require("path")
const fs = require("fs-extra")
const gTTS = require("google-tts-api")
const { MessageMedia } = require("whatsapp-web.js")

async function lowerCase(client, message, expression) {
	let text = await choisir(message, expression)
	await message.reply(text.toLowerCase())
}

async function upperCase(client, message, expression) {
	let text = await choisir(message, expression)
	await message.reply(text.toUpperCase())
}

/** transforme un texte en camelCase */
async function camelCase(client, message, expression) {
	let text = await choisir(message, expression)
	text = text
		.toLowerCase()
		.replace(/(?:^|\s|_|-)(\w)/g, (match, p1, offset) =>
			offset === 0 ? p1 : p1.toUpperCase()
		)
		.replace(/[\s|_|-]/g, "")
	await message.reply(text)
}

/** transforme un texte en PascalCase */
async function pascalCase(client, message, expression) {
	let text = await choisir(message, expression)
	// Convertir tout le texte en minuscules
	// Remplacer chaque premier caractère après un espace,
	// tiret ou underscore par une majuscule et supprimer les espaces
	let pascalCaseText = text
		.toLowerCase()
		.replace(/(?:^|\s|_|-)(\w)/g, (match, p1) => p1.toUpperCase())
		.replace(/[\s|_|-]/g, "")
	await message.reply(pascalCaseText)
}

/** transforme un texte en PascalCase avec les espaces */
async function titleCase(client, message, expression) {
	let text = await choisir(message, expression)
	// Convertir tout le texte en minuscules
	// Remplacer chaque premier caractère après un espace,
	// tiret ou underscore par une majuscule
	let pascalCaseText = text
		.toLowerCase()
		.replace(/(?:^|\s|_|-)(\w)/g, (match, p1) => p1.toUpperCase())
		.replace(/[\s|_|-]/g, "")
	await message.reply(pascalCaseText)
}

/** transforme un texte en snake_case et l'envoi comme réponse */
async function snakeCase(client, message, expression) {
	let text = await choisir(message, expression)
	// Convertir tout le texte en minuscules
	// Remplacer les espaces, underscores et tirets par un underscore
	let snakeCaseText = text.toLowerCase().replace(/[\s|_|-]+/g, "_")
	await message.reply(snakeCaseText)
}

/** transforme un texte en CAPITAL_SNAKE_CASE */
async function csnakeCase(client, message, expression) {
	let text = await choisir(message, expression)
	// Convertir tout le texte en minuscules
	// Remplacer les espaces, underscores et tirets par un underscore
	let result = text.toUpperCase().replace(/[\s|_|-]+/g, "_")
	await message.reply(result)
}

/** transforme un texte en leet code */
async function leetCode(client, message, expression) {
	let text = await choisir(message, expression)
	const leetMap = { a: "4", e: "3", i: "1", l: "1", o: "0", s: "5", t: "7" }
	let result = text.replace(
		/[aeilost]/gi,
		(match) => leetMap[match.toLowerCase()] || match
	)
	await message.reply(result)
}

/** transforme un texte en gras */
async function gras(client, message, expression) {
	let text = await choisir(message, expression)
	await message.reply(`*${text}*`)
}

/** transforme un texte en italique */
async function italique(client, message, expression) {
	let text = await choisir(message, expression)
	await message.reply(`_${text}_`)
}

/** transforme un texte en barré */
async function barre(client, message, expression) {
	let text = await choisir(message, expression)
	await message.reply(`~${text}~`)
}

/** qrcode : génère un code QR et l’envoie */
async function qrcode(client, message, expression) {
	try {
		// Choisir le texte : soit l'expression, soit le message cité
		let text = await choisir(message, expression)
		if (!text || text.trim() === "") {
			return await message.reply("❌ Texte manquant pour le QR Code")
		}

		// Créer le dossier tmp s'il n'existe pas
		const tmpDir = path.join(__dirname, "../../data/tmp")
		if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

		// Générer le chemin du fichier temporaire
		const qrPath = path.join(tmpDir, "qrcode.png")

		// Générer le QR Code dans le fichier
		await QRCode.toFile(qrPath, text, { type: "png" })

		// Créer le MessageMedia à partir du fichier
		const media = MessageMedia.fromFilePath(qrPath)

		// Envoyer le QR Code sur WhatsApp
		await message.reply(media)

		// Supprimer le fichier temporaire
		fs.unlinkSync(qrPath)
	} catch (err) {
		console.error("Erreur QR Code:", err)
		await message.reply("❌ Impossible de générer le QR Code")
	}
}

/** tts : text-to-speech (génère un fichier audio) */
async function tts(client, message, expression) {
	try {
		// Choisir le texte : soit l'expression, soit le message cité
		let text = await choisir(message, expression)
		if (!text || text.trim() === "") {
			return await message.reply("❌ Texte manquant pour le QR Code")
		}

		// Générer l'URL du MP3
		const url = gTTS.getAudioUrl(text, {
			lang: "fr",
			slow: false,
			host: "https://translate.google.com",
		})

		// Télécharger le MP3 en buffer
		const res = await fetch(url)
		const buffer = Buffer.from(await res.arrayBuffer())

		// Créer le dossier tmp s'il n'existe pas
		const tmpDir = path.join(__dirname, "../../tmp")
		if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

		const filePath = path.join(tmpDir, "tts.mp3")
		fs.writeFileSync(filePath, buffer)

		// Créer le MessageMedia
		const media = MessageMedia.fromFilePath(filePath)

		// Envoyer le MP3
		await message.reply(media)

		// Supprimer le fichier temporaire
		fs.unlinkSync(filePath)
	} catch (err) {
		console.error("Erreur TTS:", err)
		await message.reply("❌ Impossible de générer le TTS")
	}
}

module.exports = {
	lowerCase,
	upperCase,
	camelCase,
	pascalCase,
	snakeCase,
	csnakeCase,
	titleCase,
	leetCode,
	gras,
	italique,
	barre,
	qrcode,
	tts,
}
