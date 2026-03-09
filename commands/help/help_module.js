const { getCommands } = require("../registry")

async function helpModule(client, message, expression) {
	if (!expression) {
		return message.reply("❌ Module manquant\nExemple : `.help ai`")
	}

	const moduleName = expression.toLowerCase()
	const commands = getCommands()

	const filtered = Object.entries(commands).filter(
		([_, cmd]) => cmd.meta.module === moduleName,
	)

	if (filtered.length === 0) {
		return message.reply(`❌ Module inconnu : *${moduleName}*`)
	}

	let text = `*📖 Aide – Module ${moduleName.toUpperCase()}*\n`

	for (const [name, meta] of filtered) {
		text += `
*${name}*
• ${meta.meta.description || "—"}
• Usage : ${meta.meta.usage || "—"}
`
	}

	await message.reply(text.trim())
}

module.exports = { helpModule }
