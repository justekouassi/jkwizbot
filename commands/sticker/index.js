const { registerCommand } = require("../registry")

const { stickerToMedia, imageToSticker, gif } = require("./sticker")

registerCommand("unsticker", stickerToMedia, {
	module: "sticker",
	description:
		"Convertir un sticker en image/média à partir d'une réponse à un sticker.",
	usage: "unsticker (en réponse à un sticker)",
})
registerCommand("sticker", imageToSticker, {
	module: "sticker",
	description: "Créer un sticker à partir d'une image.",
	usage: "sticker (en réponse à une image ou sur une image)",
})
registerCommand("gif", gif, {
	module: "sticker",
	description: "Convertir une vidéo en GIF (clip muet, format WhatsApp).",
	usage: "gif (en réponse à une vidéo ou sur une vidéo)",
})
