const { registerCommand } = require("../registry")

const { calc, calch } = require("./calc")

registerCommand("calc", calc, {
	module: "maths",
	description:
		"Calcule une expression mathématique (chiffres et opérations simples).",
	usage: "calc <expression>\nExemple : calc 2 + 3 * (4 - 1)",
})

registerCommand("calch", calch, {
	module: "maths",
	description: "Calcule une expression de durée (h / min).",
	usage: "calch <expression>\nExemple : calch 1h45+15min+7h",
})
