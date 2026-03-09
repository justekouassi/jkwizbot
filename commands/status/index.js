const { registerCommand } = require("../registry")
const { postStatus } = require("./post_status")

registerCommand("status", postStatus, {
	module: "statut",
	description: "Publie un statut WhatsApp",
	usage: "status [texte]",
})
