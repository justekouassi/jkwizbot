const { Client, Message } = require("whatsapp-web.js")
const { choisir } = require("../../helper/message")

/**
 * décale un mot selon un certain entier de décalage
 *
 * @param {String} mot le mot à décaler
 * @param {float} decalage le nombre de décalage
 */
function mddecales(mot, decalage) {
	let mot_decale = ""

	for (let lettre of mot) {
		if (lettre.match(/[a-zA-Z]/)) {
			// Gérer les majuscules
			if (lettre === lettre.toUpperCase()) {
				lettre_decalee = String.fromCharCode(
					((lettre.charCodeAt(0) - "A".charCodeAt(0) + decalage + 26) % 26) +
						"A".charCodeAt(0),
				)
			} else {
				// Gérer les minuscules
				lettre_decalee = String.fromCharCode(
					((lettre.charCodeAt(0) - "a".charCodeAt(0) + decalage + 26) % 26) +
						"a".charCodeAt(0),
				)
			}
		} else {
			// Si ce n'est pas une lettre, la laisser inchangée
			lettre_decalee = lettre
		}

		mot_decale += lettre_decalee
	}

	return mot_decale
}

/**
 * retrouve les mots originaux potentiels d'un mot décalé à l'ordre 1
 *
 * @param {String} mot le mot décalé
 */
function mdorigines(mot) {
	return [mddecales(mot, -1), mddecales(mot, 1)]
}

/**
 * commande de décalage
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 * @param {String} expression les paramètres de la commande
 */
function decale(client, message, expression) {
	let mot = expression.split(" ")[0]
	let decalage = expression.split(" ")[1] || 1
	message.reply(mddecales(mot, parseFloat(decalage)))
}

/**
 * commande d'origines
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 * @param {String} expression les paramètres de la commande
 */
async function origines(client, message, expression) {
	let text = await choisir(message, expression)
	await message.reply(mdorigines(text).join(" - "))
}

module.exports = {
	decale,
	origines,
}
