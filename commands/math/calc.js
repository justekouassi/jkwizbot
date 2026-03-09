const { evaluate } = require("mathjs")

/**
 * calcule une expression mathématique donnée
 *
 * @param {Client} client le bot (client) connecté
 * @param {Message} message le message créé
 * @param {String} expression les paramètres de la commande
 */
function calc(client, message, expression) {
	if (/^[0-9+\-*/().\s]+$/.test(expression)) {
		try {
			const result = evaluate(expression)
			message.reply(`Le résultat est : ${result}`)
		} catch (error) {
			message.reply("L'expression mathématique est invalide.")
		}
	}
}

/**
 * Calcule une expression de durée (h / min)
 *
 * Exemples :
 *  - 1h45+15min+7h
 *  - 2*45min
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String} expression
 */
function calch(client, message, expression) {
	try {
		let expr = expression.toLowerCase().replace(/\s+/g, "")

		// 1h45 → 1h+45min
		expr = expr.replace(/(\d+(\.\d+)?)h(\d+(\.\d+)?)/g, "$1h+$3min")

		// h → minutes
		expr = expr.replace(/(\d+(\.\d+)?)h/g, "($1*60)")

		// min → minutes
		expr = expr.replace(/(\d+(\.\d+)?)min/g, "($1)")

		// Sécurité
		if (!/^[0-9+\-*/().]+$/.test(expr)) {
			return message.reply("Expression de durée invalide.")
		}

		const totalMinutes = Math.round(evaluate(expr))

		const hours = Math.floor(totalMinutes / 60)
		const minutes = totalMinutes % 60

		let result = ""
		if (hours > 0) result += `${hours} h `
		if (minutes > 0) result += `${minutes} min`

		message.reply(`⏱️ ${result.trim() || "0 min"}`)
	} catch {
		message.reply("Impossible de calculer cette durée.")
	}
}

module.exports = { calc, calch }