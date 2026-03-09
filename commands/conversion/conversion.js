const { units, convertUnits, bases, convertBase } = require("./convert")
const { choisir } = require("../../helper/message")
const { logger } = require("../../helper/logger")
const { translateAuto, translateManual } = require("./translate.mjs")
const { names } = require("../../data/json/names.mjs")
const isoCodes = Object.values(names)

/** Commande générique pour unités */
async function convertir(client, message, expression) {
	if (!expression)
		return message.reply("❌ Syntaxe : convert <from> <to> <valeur>")

	const [from, to, ...rest] = expression.split(/\s+/)
	const valueArg = rest.join(" ")

	const valueText = await choisir(message, valueArg)
	const value = Number(valueText)

	if (!from || !to || Number.isNaN(value)) {
		return message.reply("❌ Syntaxe invalide ou nombre non valide")
	}

	if (!units.includes(from) || !units.includes(to)) {
		return message.reply(`❌ Unités valides : ${units.join(", ")}`)
	}

	const res = convertUnits(from, to, value)
	message.reply(`${value} ${from} = ${res} ${to}`)
}

/** Commande générique pour bases */
async function base(client, message, expression) {
	if (!expression)
		return message.reply("❌ Syntaxe : base <from> <to> <valeur>")

	const [from, to, ...rest] = expression.split(/\s+/)
	const valueArg = rest.join("")
	const value = await choisir(message, valueArg)

	if (!from || !to || !value) {
		return message.reply("❌ Syntaxe invalide")
	}

	if (!bases.includes(from) || !bases.includes(to)) {
		return message.reply(`❌ Bases valides : ${bases.join(", ")}`)
	}

	const res = convertBase(from, to, value)
	message.reply(`${value} (~${from}) = ${res} (~${to})`)
}

/** Traduction automatique ou manuelle avec 1 seule commande */
async function traduire(client, message, expression) {
	if (!expression)
		return message.reply("❌ Syntaxe : traduire <from|auto> <to> <texte>")

	const [from, to, ...rest] = expression.split(/\s+/)
	const textArg = rest.join(" ")
	const text = await choisir(message, textArg)

	if (!text || !to || (!isoCodes.includes(to) && to !== "auto")) {
		return message.reply(
			`❌ Codes ISO valides : ${isoCodes.join(
				", ",
			)}, ou 'auto' pour détection automatique`,
		)
	}

	try {
		let res
		if (from === "auto") {
			res = await translateAuto(text, to)
		} else {
			if (!isoCodes.includes(from)) {
				return message.reply(`❌ Code source invalide : ${from}`)
			}
			res = await translateManual(text, from, to)
		}
		message.reply(res)
	} catch (e) {
		logger.error(`[TRADUIRE] ${e.stack || e}`)
		message.reply("❌ Une erreur est survenue lors de la traduction")
	}
}

module.exports = { convertir, base, traduire }
