const { getCommands } = require("../registry")

async function menu(client, message) {
	const commands = getCommands()

	const list = Object.keys(commands)
		.sort()
		.map((cmd) => `• ${cmd}`)
		.join(" ")

	await message.reply("*⚖️ Commandes disponibles :*\n\n" + list)
}

module.exports = { menu }
