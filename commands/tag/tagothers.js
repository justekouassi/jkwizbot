const { Client, Message } = require("whatsapp-web.js")

/**
 * tague tous membres d'un groupe sans les administrateurs
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
module.exports = async function (client, message) {
	const chat = await message.getChat()

	let tags = ""
	let mentions = []

	for (let participant of chat.participants) {
		if (!participant.isAdmin) {
			mentions.push(`${participant.id.user}@c.us`)
			tags += `@${participant.id.user} `
		}
	}

	await message.reply(tags, chat.id._serialized, { mentions })
}
