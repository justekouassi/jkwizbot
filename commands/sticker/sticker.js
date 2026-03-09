const { Client, Message } = require("whatsapp-web.js")
const { BOT_NAME } = require("../../constants/params")

/**
 * supprime pout tout le monde tous les stickers
 * reçus dans une discussion
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
function deleteSticker(message) {
	if (message.type === "sticker") {
		message.delete(true)
	}
}

/**
 * retourne un sticker à partir d'une image reçue
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
async function imageToSticker(client, message) {
	const quotedMessage = await message.getQuotedMessage()
	const chat = await message.getChat()

	let media = null
	if (message.type === "image" || message.type === "video") {
		media = await message.downloadMedia()
	}
	if (
		message.hasQuotedMsg &&
		(quotedMessage.type === "image" || quotedMessage.type === "video")
	) {
		media = await quotedMessage.downloadMedia()
	}
	if (media) {
		await message.reply(media, chat.id._serialized, {
			sendMediaAsSticker: true,
			stickerAuthor: BOT_NAME,
			stickerName: "⚖️",
		})
	} else {
		await message.reply(
			"❌ Veuillez citer ou accompagner d'une image, d'une vidéo ou d'un GIF.",
		)
	}
}

/** retourne un sticker à partir d'une image reçue
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
async function stickerToMedia(client, message) {
	const quotedMessage = await message.getQuotedMessage()
	const chat = await message.getChat()

	if (message.hasQuotedMsg && quotedMessage.type === "sticker") {
		const media = await quotedMessage.downloadMedia()
		message.reply(media, chat.id._serialized, {
			sendMediaAsSticker: false,
		})
	}
}

/**
 * transforme une vidéo en GIF
 * // TODO ne fonctionne pas
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 */
async function gif(client, message) {
	const quotedMessage = await message.getQuotedMessage()
	const chat = await message.getChat()

	let media = null
	if (message.type === "video") {
		media = await message.downloadMedia()
	}
	if (message.hasQuotedMsg && quotedMessage.type === "VIDEO") {
		media = await quotedMessage.downloadMedia()
	}
	message.reply(media, chat.id._serialized, {
		sendVideoAsGif: true,
	})
}

module.exports = {
	deleteSticker,
	imageToSticker,
	stickerToMedia,
	gif,
}
