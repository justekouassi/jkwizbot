const fs = require("fs").promises
const path = require("path")
const { Client, Message } = require("whatsapp-web.js")
const { logger } = require("../../helper/logger")

const coranPath = "../../data/json/coran.json"

/**
 * retourne des versets coraniques en fonction de la référence définie.
 * Si aucune référence n'est précisée, on retourne un verset aléatoire
 *
 * @param {String} reference La référence coranique [chapitre]:[versetDebut]-[versetFin]
 */
async function getKoranVerses(reference) {
	try {
		// Lire le fichier quran.json
		const data = await fs.readFile(path.join(__dirname, coranPath), "utf8")
		const quran = JSON.parse(data)

		// Générer un verset aléatoire si aucune référence n'est donnée
		if (!reference) {
			const randomSourateIndex = Math.floor(
				Math.random() * quran.sourates.length,
			)
			const sourate = quran.sourates[randomSourateIndex]
			const randomVerseIndex = Math.floor(
				Math.random() * sourate.versets.length,
			)
			const verse = sourate.versets[randomVerseIndex]
			const randomReference = `_*Sourate ${sourate.position} v ${verse.position_ds_sourate}*_ : "${verse.text}"`
			return randomReference
		}

		// Extraire le chapitre et les versets de la référence
		const [chapterRef, versesRef] = reference.split(":")
		const chapter = parseInt(chapterRef, 10)

		// Trouver la sourate correspondante
		const sourate = quran.sourates.find((s) => s.position === chapter)
		if (!sourate) {
			logger.error(`Chapitre ${chapter} non trouvé.`)
		}

		let verses
		if (!versesRef) {
			// Si aucune référence de verset n'est donnée, retourner tous les versets du chapitre
			verses = sourate.versets
		} else {
			const verseParts = versesRef.split("-").map((v) => parseInt(v, 10))
			if (verseParts.length === 1) {
				// Si un seul verset est donné, retourner ce verset
				verses = sourate.versets.filter(
					(v) => v.position_ds_sourate === verseParts[0],
				)
			} else if (verseParts.length === 2) {
				// Si une plage de versets est donnée, retourner les versets de la plage
				const [start, end] = verseParts
				verses = sourate.versets.filter(
					(v) => v.position_ds_sourate >= start && v.position_ds_sourate <= end,
				)
			} else {
				logger.error(`Référence de verset invalide : ${versesRef}`)
			}
		}

		// Construire le texte des versets avec leur référence
		const result = verses
			.map(
				(v) =>
					`_*Sourate ${chapter} v ${v.position_ds_sourate}*_ : "${v.text}"`,
			)
			.join("\n")
		return result
	} catch (error) {
		logger.error(
			"Erreur lors de la lecture du fichier ou du traitement des données:",
			error,
		)
	}
}

/**
 * affiche une référence coranique définie
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 * @param {String} expression les paramètres de la commande
 */
module.exports = async function (client, message, expression) {
	try {
		const verses = await getKoranVerses(expression)
		await message.reply(verses)
	} catch (error) {
		await message.reply(`Mauvaise référence`)
	}
}
