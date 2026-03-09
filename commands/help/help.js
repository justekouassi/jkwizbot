const { getParameter } = require("../../config/params_service.js")
const { commandFunctions } = require("../index.js")
const {
	BOT_NAME,
	BOT_VERSION,
	OWNER_NAME,
	OWNER_GITHUB,
} = require("../../constants/params.js")

const prefix = getParameter("prefix")

let help = `⚖️ *${BOT_NAME}* est un assistant intelligent conçu pour booster ton expérience WhatsApp. Que tu sois administrateur de groupe, amateur de quiz ou simple utilisateur, ce bot te propose plusieurs outils pour personnaliser tes messages, gérer tes discussions, apprendre, et automatiser de nombreuses tâches.

*Développé par* : ${OWNER_NAME} - ${OWNER_GITHUB}
*Version* : ${BOT_VERSION}

*Préfixe* : [ ${prefix} ]
*Nb Commandes* : ${Object.keys(commandFunctions).length.toLocaleString("fr-FR")}

Pour utiliser une commande, précède-la toujours du préfixe. Voici quelques exemples utiles.
\`\`\`${prefix}help ou ${prefix}menu\`\`\` : affiche ce message d'aide
\`\`\`${prefix}help [module]\`\`\` : affiche la documentation d’un module
\`\`\`${prefix}menul\`\`\` : affiche la liste détaillée des commandes disponibles par module`

module.exports = {
	help,
}
