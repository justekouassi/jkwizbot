const { Client, Message } = require("whatsapp-web.js")
const { logger } = require("../../helper/logger")
const { choisir } = require("../../helper/message")

/**
 * Publie un statut WhatsApp (texte, image, vidéo) selon le message ou le paramètre fourni.
 * Fonctionne aussi bien sur une réponse à un message média que sur du texte passé en argument.
 *
 * @param {Client} client - Instance du client WhatsApp.
 * @param {Message} message - Message original reçu.
 * @param {string} [expression] - (Optionnel) Texte ou expression à publier si non utilisé en réponse à un message média.
 * @returns {Promise<void>}
 */
async function postStatus(client, message, expression = "") {
	try {
		let media = null
		let caption = ""

		// Si on répond à un message qui contient un média (image, vidéo)
		if (message.hasQuotedMsg) {
			const quotedMsg = await message.getQuotedMessage()

			if (quotedMsg.hasMedia) {
				media = await quotedMsg.downloadMedia()
				caption = expression || quotedMsg.body || ""
			} else if (quotedMsg.body) {
				// Seulement du texte cité
				const text = expression || quotedMsg.body || ""
				if (!text.trim()) {
					return message.reply("❌ Contenu du statut manquant")
				}
				await client.sendMessage("status@broadcast", text.trim())
				return message.reply("✅ Statut texte publié")
			}
		}
		// Si le message courant a un média (sans être une réponse)
		else if (message.hasMedia) {
			media = await message.downloadMedia()
			caption = expression || message.body || ""
		}

		// Si on a du média (image, vidéo)
		if (media) {
			await client.sendMessage("status@broadcast", media, { caption })
			await message.reply("✅ Statut média publié")
		} else {
			// Cas texte simple (aucun média)
			const text = await choisir(message, expression)
			if (!text || !text.trim()) {
				return message.reply("❌ Contenu du statut manquant")
			}
			await client.sendMessage("status@broadcast", text.trim())
			await message.reply("✅ Statut texte publié")
		}
	} catch (err) {
		logger.error(err)
		await message.reply("❌ Échec de publication du statut")
	}
}

module.exports = { postStatus }
