const { registerCommand } = require("../registry")

const coran = require("./coran")
const bible = require("./bible")

registerCommand("coran", coran, {
	module: "citation",
	description:
		"Affiche des versets du Coran de manière aléatoire ou selon la référence fournie.",
	usage:
		"coran <sourate> <numéro>:<verset>[-<verset>]\nExemples:\ncoran (verset aléatoire)\ncoran 2:155\ncoran 3:5-10",
})
registerCommand("bible", bible, {
	module: "citation",
	description:
		"Affiche un ou plusieurs versets de la Bible (LS1910) : aléatoire, ou par référence précise.",
	usage:
		"bible [<livre> [<chapitre>[:<verset>(-<verset>)]]]\nExemples:\nbible (verset aléatoire)\nbible genese (verset aléatoire du livre)\nbible genese 1 (verset aléatoire du chapitre)\nbible jean 3:16\nbible ge 1:1-3\nTip : Ecrire le nom du livre en entier indépendamment de la casse et des accents ou son abréviation francophone conventionnelle.",
})
