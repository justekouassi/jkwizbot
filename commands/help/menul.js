const { getCommands } = require("../registry")

async function menul(client, message) {
	const commands = getCommands()
	const modules = {}

	for (const [name, cmd] of Object.entries(commands)) {
		const mod = cmd.meta.module
		if (!modules[mod]) modules[mod] = []
		modules[mod].push({ name, ...cmd.meta })
	}

	let text = "*⚖️ Commandes détaillées :*\n"

	for (const [moduleName, cmds] of Object.entries(modules)) {
		text += `\n*${moduleName.toUpperCase()}*\n`
		for (const c of cmds.sort((a, b) => a.name.localeCompare(b.name))) {
			text += `• *${c.name}* : ${c.description}\n`
		}
	}

	await message.reply(text)
}

module.exports = { menul }
