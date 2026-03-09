const commandFunctions = {}

/**
 * @param {string} name Nom de la commande
 * @param {Function} handler
 * @param {Object} meta Métadonnées
 * @param {string} meta.module
 * @param {string} meta.description
 * @param {string} [meta.usage]
 */
function registerCommand(name, handler, meta = {}) {
	if (commandFunctions[name]) return
	commandFunctions[name] = {
		handler,
		meta: {
			module: meta.module || "divers",
			description: meta.description || "",
			usage: meta.usage || "",
		},
	}
}

function getCommands() {
	return commandFunctions
}

module.exports = {
	registerCommand,
	getCommands,
}
