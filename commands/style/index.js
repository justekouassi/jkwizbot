const { registerCommand } = require("../registry")
const { choisir } = require("../../helper/message")
const {
	lowerCase,
	upperCase,
	pascalCase,
	camelCase,
	snakeCase,
	csnakeCase,
	titleCase,
	leetCode,
	barre,
	italique,
	gras,
	qrcode,
	tts,
} = require("./text_case")

const { fontStyle, getAllFonts, unicode } = require("./font_style")

/**
 * Commandes de transformation de texte
 */
registerCommand("unicode", unicode, {
	module: "style",
	description: "Transforme le texte en équivalent unicode stylisé.",
	usage: "unicode <texte>",
})
registerCommand("lower", lowerCase, {
	module: "style",
	description: "Transforme tout le texte en minuscules.",
	usage: "lower <texte>",
})
registerCommand("upper", upperCase, {
	module: "style",
	description: "Transforme tout le texte en MAJUSCULES.",
	usage: "upper <texte>",
})
registerCommand("camel", camelCase, {
	module: "style",
	description:
		"Transforme le texte en camelCase (minuscule, pas d'espace, majuscule sur chaque nouveau mot sauf le premier).",
	usage: "camel <texte>",
})
registerCommand("pascal", pascalCase, {
	module: "style",
	description:
		"Transforme le texte en PascalCase (majuscule à chaque mot, sans espace).",
	usage: "pascal <texte>",
})
registerCommand("snake", snakeCase, {
	module: "style",
	description:
		"Transforme le texte en snake_case (minuscule, mots séparés par des underscores).",
	usage: "snake <texte>",
})
registerCommand("csnake", csnakeCase, {
	module: "style",
	description:
		"Transforme le texte en CAPITAL_SNAKE_CASE (majuscules, mots séparés par des underscores).",
	usage: "csnake <texte>",
})
registerCommand("title", titleCase, {
	module: "style",
	description:
		"Transforme le texte en Titre Capitalisé (majuscule à chaque début de mot, espaces conservés).",
	usage: "title <texte>",
})
registerCommand("leet", leetCode, {
	module: "style",
	description: "Convertit le texte en leet code (1337 c0d3).",
	usage: "leet <texte>",
})
registerCommand("barre", barre, {
	module: "style",
	description: "Barre le texte avec des tildes.",
	usage: "barre <texte>",
})
registerCommand("italique", italique, {
	module: "style",
	description: "Met le texte en italique.",
	usage: "italique <texte>",
})
registerCommand("gras", gras, {
	module: "style",
	description: "Met le texte en gras.",
	usage: "gras <texte>",
})
registerCommand("qrcode", qrcode, {
	module: "style",
	description: "Génère un QR code à partir du texte.",
	usage: "qrcode <texte>",
})
registerCommand("tts", tts, {
	module: "style",
	description: "Convertit le texte en message vocal (Text-to-Speech).",
	usage: "tts <texte>",
})

/**
 * Commandes de polices (dynamiques)
 */
getAllFonts.forEach((font) => {
	registerCommand(
		font,
		async (client, message, expression) => {
			let text = await choisir(message, expression)
			message.reply(fontStyle(text, font))
		},
		{
			module: "style",
			description: `Change la police du texte en ${font}.`,
			usage: `${font} <texte>`,
		}
	)
})
