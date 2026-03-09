const { Client, Message } = require("whatsapp-web.js")
const {
	createTeam,
	tagTeam,
	listTeams,
	deleteTeam,
	addMembers,
	removeMembers,
} = require("./tag.service")

/**
 * !tag [team] [@mentions...]
 * @param {Client} client Le bot (client) connecté
 * @param {Message} message Le message créé
 */
async function tagteam(client, message, args) {
	if (typeof args === "string") args = args.trim().split(/\s+/)
	const command = args[0]?.toLowerCase()
	const teamName = args[1]

	switch (command) {
		case "list":
			return listTeams(client, message)
		case "delete":
			return deleteTeam(client, message, teamName)
		case "add":
			return addMembers(client, message, teamName)
		case "remove":
			return removeMembers(client, message, teamName)
		default:
			// si le deuxième argument existe → création / ajout
			if (teamName && message.mentionedIds.length > 0) {
				return createTeam(client, message, command) // ici `command` = teamName
			}
			// sinon tag
			return tagTeam(client, message, command)
	}
}

module.exports = {
	tagteam,
}
