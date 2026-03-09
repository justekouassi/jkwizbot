const { registerCommand } = require("../registry")

const tagadmins = require("./tagadmins")
const tagothers = require("./tagothers")
const { tagteam } = require("./tagteam")

registerCommand("tagadmins", tagadmins, {
	module: "tag",
	description: "tague tous les administrateurs du groupe",
	usage: "tagadmins",
})
registerCommand("tagothers", tagothers, {
	module: "tag",
	description: "tague tous les membres du groupe exceptés les administrateurs",
	usage: "tagothers",
})
registerCommand("tags", tagteam, {
	module: "tag",
	description:
		"gère les équipes personnalisées : créées, tague, ajoute, supprime membres ou liste les teams",
	usage:
		"tags [list|add|remove|delete] <team> [@membres...]\nExemples :\n- tags warriors @juste @malick\n- tags warriors\n- tags add warriors @paul\n- tags remove warriors @juste\n- tags delete warriors\n- tags list",
})
