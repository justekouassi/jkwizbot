const fs = require("fs")
const path = require("path")

const FILE_PATH = path.join(__dirname, "../../data/json/teams.json")

function loadTeams() {
	if (!fs.existsSync(FILE_PATH)) return {}

	try {
		return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"))
	} catch {
		return {}
	}
}

function saveTeams(teams) {
	fs.writeFileSync(FILE_PATH, JSON.stringify(teams, null, 2))
}

const teams = loadTeams()

/** Crée ou met à jour une team *
 * !tag warriors @juste @malick
 */
async function createTeam(client, message, teamName) {
	const mentioned = message.mentionedIds
	const nbMentioned = mentioned.length

	if (!nbMentioned) {
		return message.reply("Veuillez mentionner au moins une personne.")
	}

	// Corrige bug "teams[teamName] is not iterable" si la team n'existe pas
	const current = Array.isArray(teams[teamName]) ? teams[teamName] : []
	teams[teamName] = Array.from(new Set([...current, ...mentioned])) // pas de doublons
	saveTeams(teams)

	message.reply(
		`✅ Team *${teamName}* enregistrée (${teams[teamName].length} membre${
			teams[teamName].length > 1 ? "s" : ""
		})`,
	)
}

/** Tague tous les membres d'une team *
 * !tag warriors
 */
async function tagTeam(client, message, teamName) {
	const chat = await message.getChat()
	const team = teams[teamName]

	if (!team) {
		return message.reply(`❌ La team *${teamName}* n'existe pas.`)
	}

	const tags = `📢 *${teamName}*\n\n${team
		.map((id) => `@${id.split("@")[0]}`)
		.join(" ")}`
	await message.reply(tags, chat.id._serialized, { mentions: team })
}

/** Liste toutes les teams existantes */
async function listTeams(client, message) {
	const keys = Object.keys(teams)
	if (!keys.length) return message.reply("❌ Aucune team enregistrée.")
	message.reply(`📋 Teams existantes : ${keys.join(", ")}`)
}

/** Supprime une team */
async function deleteTeam(client, message, teamName) {
	if (!teams[teamName])
		return message.reply(`❌ La team *${teamName}* n'existe pas.`)
	delete teams[teamName]
	saveTeams(teams)
	message.reply(`🗑️ Team *${teamName}* supprimée.`)
}

/** Ajoute des membres à une team existante */
async function addMembers(client, message, teamName) {
	if (!teams[teamName])
		return message.reply(`❌ La team *${teamName}* n'existe pas.`)
	const mentioned = message.mentionedIds
	if (!mentioned.length)
		return message.reply("Veuillez mentionner au moins une personne.")
	teams[teamName] = Array.from(new Set([...teams[teamName], ...mentioned])) // pas de doublons
	saveTeams(teams)
	message.reply(
		`✅ ${mentioned.length} membre${mentioned.length > 1 ? "s" : ""} ajouté${
			mentioned.length > 1 ? "s" : ""
		} à *${teamName}*`,
	)
}

/** Supprime des membres d'une team */
async function removeMembers(client, message, teamName) {
	if (!teams[teamName])
		return message.reply(`❌ La team *${teamName}* n'existe pas.`)
	const mentioned = message.mentionedIds
	if (!mentioned.length)
		return message.reply("Veuillez mentionner au moins une personne.")
	teams[teamName] = teams[teamName].filter((id) => !mentioned.includes(id))
	saveTeams(teams)
	message.reply(
		`✅ ${mentioned.length} membre${mentioned.length > 1 ? "s" : ""} supprimé${
			mentioned.length > 1 ? "s" : ""
		} de *${teamName}*`,
	)
}

module.exports = {
	createTeam,
	tagTeam,
	listTeams,
	deleteTeam,
	addMembers,
	removeMembers,
}
