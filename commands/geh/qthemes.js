const { getAllThemes } = require("./quiz_service")

function formatThemesMessage(themes, limit = 20) {
	const top = themes.slice(0, limit)

	const lines = top.map(
		(t, i) => `🎯 *${t.name}* _(${t.questions_count ?? 0})_`,
	)

	let additional = ""
	if (themes.length > limit) {
		additional = `\n\n_...et ${themes.length - limit} autres_`
	}

	return `
📚 *THÈMES*

━━━━━━━━━━━━━━━━━━━━

${lines.join("\n")}${additional}

━━━━━━━━━━━━━━━━━━━━
📊 ${themes.length} thèmes | ${themes.reduce(
		(a, t) => a + (t.questions_count ?? 0),
		0,
	)} questions

_Rechercher:_ .qthemes [mot]
_Jouer:_ .quiz [n] [thèmes]
`.trim()
}

module.exports = async function qthemes(client, message, expression) {
	let themes = await getAllThemes()

	if (expression) {
		themes = themes.filter((t) => t.name.toLowerCase().includes(expression))
	}

	themes.sort((a, b) => (b.questions_count ?? 0) - (a.questions_count ?? 0))

	await message.reply(formatThemesMessage(themes))
}
