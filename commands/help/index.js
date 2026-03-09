const { registerCommand } = require("../registry")

const { menul } = require("./menul")
const { helpModule } = require("./help_module")

// ajouts des infos et aides
function helpOrMenuHandler(client, message, expression) {
	if (expression) {
		helpModule(client, message, expression)
	} else {
		const { help } = require("./help.js")
		message.reply(help, undefined, { linkPreview: false })
	}
}

registerCommand("help", helpOrMenuHandler, {
	module: "aide",
	description: "Informations générales sur le bot",
	usage: "help",
})

registerCommand("menu", helpOrMenuHandler, {
	module: "aide",
	description: "Informations générales sur le bot",
	usage: "help",
})

registerCommand("menul", menul, {
	module: "aide",
	description: "Liste détaillée des commandes",
	usage: "menul",
})
