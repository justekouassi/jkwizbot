const { readFileSync } = require("fs-extra")
const { join } = require("path")
const { Client, Message } = require("whatsapp-web.js")
const { logger } = require("../../helper/logger")
const { choisir } = require("../../helper/message")

// Chemin vers le fichier styles.json
const stylesPath = join(__dirname, "../../data/json/fonts.json")
const fontStyles = JSON.parse(readFileSync(stylesPath, "utf8"))

/** retourne la liste des polices disponibles */
const getAllFonts = Object.keys(fontStyles)

/** convertit du texte utf-8 en une police stylisée */
function fontStyle(text, font = "black-square") {
	if (!fontStyles.hasOwnProperty(font)) {
		logger.error(`Invalid font type: ${font}`)
	}
	const fontMapping = Object.fromEntries(
		[...fontStyles[font]].map((char, index) => [
			String.fromCharCode(65 + index),
			char,
		])
	)
	return [
		...text
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toUpperCase(),
	]
		.map((char) => fontMapping[char] || char)
		.join("")
}

/** convertit du texte stylisé en utf-8 */
function reverseFontStyle(text, font = "black-square") {
	if (!fontStyles.hasOwnProperty(font)) {
		logger.error(`Invalid font type: ${font}`)
	}
	const fontMapping = Object.fromEntries(
		[...fontStyles[font]].map((char, index) => [
			char,
			String.fromCharCode(65 + index),
		])
	)
	return [...text].map((char) => fontMapping[char] || char).join("")
}

/** retire tous les accents d'un texte */
function removeAccents(text) {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

/** convertit du texte stylisé en utf-8 */
function reverseFontStyle2(text) {
	// on supprime les éventuels car notre dictionnaire n'en contient pas
	text = removeAccents(text.replace(/ǫ/g, "").replace('"', "'"))
	// si le texte est déjà en utf-8, le retourner tel quel
	if ([...text].every((char) => char.charCodeAt(0) < 128)) {
		return text
	}
	// on boucle sur toutes les polices pour rechercher la plus adéquate
	for (const font of getAllFonts) {
		const fontMapping = Object.fromEntries(
			[...fontStyles[font]].map((char, index) => [
				char,
				String.fromCharCode(65 + index),
			])
		)
		const convertedText = [...text]
			.map((char) => fontMapping[char] || char)
			.join("")
		// Vérifier si le texte converti correspond à l'original
		if (fontStyle(convertedText, font) === text) {
			return convertedText
		}
	}
	// Si aucune correspondance n'est trouvée, retourner le texte original
	return text
}

/**
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
async function unicode(client, message, expression) {
	let text = await choisir(message, expression)
	if (!text || text.trim() === "") {
		return await message.reply("❌ Texte manquant pour la conversion Unicode")
	}
	return await message.reply(reverseFontStyle2(text))
}

module.exports = {
	getAllFonts,
	fontStyles,
	fontStyle,
	reverseFontStyle,
	reverseFontStyle2,
	unicode,
}
