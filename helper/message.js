const { Message } = require("whatsapp-web.js")
const { BOT_NAME } = require("../constants/params.js")

/**
 * choisit les paramètres de la commande à considérer
 * entre ceux joints à la commande ou ceux provenant du message cité
 *
 * @param {Message} message le message créé
 * @param {String} expression les paramètres de la commande
 */
async function choisir(message, expression) {
	if (message.hasQuotedMsg) {
		const quotedMessage = await message.getQuotedMessage()
		return quotedMessage.body || expression
	} else {
		return expression
	}
}

/** retourne le nom d'un émetteur de message */
async function getUsername(client, message) {
	if (message.fromMe) return BOT_NAME

	const author = message.author || message.from
	if (!author) return "System"

	try {
		const contact = await client.getContactById(author)
		return contact.name || contact.pushname || contact.number || "[Inconnu]"
	} catch {
		return "[Inconnu]"
	}
}

/** retourne le nom coloré, pour le logging, d'un émetteur de message */
async function getUsernameC(client, message) {
	const username = await getUsername(client, message)
	return username.brightBlue
}

/** Fonction pour obtenir un contact par son tag */
async function getContactByTag(client, tag) {
	const contacts = await client.getContacts()
	return contacts.find((contact) => {
		const contactNumber = contact.number || contact.id._serialized
		return contactNumber?.includes(tag)
	})
}

/** Fonction pour transformer les tags dans un message */
async function transformTags(client, messageBody) {
	const tagPattern = /@\w+/g
	const tags = messageBody.match(tagPattern)

	if (!tags) return messageBody

	for (const tag of tags) {
		const contactTag = await getContactByTag(client, tag.replace("@", ""))
		const contactName =
			contactTag?.name || contactTag?.pushname || contactTag?.number || tag
		messageBody = messageBody.replace(tag, `@${contactName}`)
	}
	return messageBody
}

/** retourne la source d'un message
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
async function getMessageOrigine(client, message) {
	if (message.isStatus) return "statut"

	if (message.from?.endsWith("@newsletter")) {
		return "chaîne"
	}

	const username = await getUsername(client, message)
	const chat = await message.getChat()

	return username === chat.name ? BOT_NAME : chat.name
}

/** retourne en coloré la source d'un message */
async function getMessageOrigineC(client, message) {
	const messageOrigine = await getMessageOrigine(client, message)
	return messageOrigine.brightGreen
}

module.exports = {
	getUsername,
	getUsernameC,
	getContactByTag,
	transformTags,
	getMessageOrigine,
	getMessageOrigineC,
	choisir,
}
