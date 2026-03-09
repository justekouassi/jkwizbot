const { registerCommand } = require("../registry")
const { convertir, base, traduire } = require("./conversion")

registerCommand("convertir", convertir, {
	module: "conversion",
	description:
		"Convertit une valeur d'une unité vers une autre unité compatible (ex: m -> km, kg -> g...).",
	usage:
		"convertir <unité_source> <unité_cible> <valeur>\nTip : On peut omettre la valeur si la commande est utilisée en réponse à un message\nExemples:\nconvertir m km 1500",
})
registerCommand("base", base, {
	module: "conversion",
	description:
		"Convertit un nombre entre différentes bases (2 à 36 ou rom pour romain).",
	usage:
		"base <base_source> <base_cible> <valeur>\nTip : On peut omettre la valeur si la commande est utilisée en réponse à un message\nExemples:\nbase 10 16 255\nbase 2 10 1111\nbase 10 rom 1984\nbase rom 10 MCMLXXXIV",
})
registerCommand("traduire", traduire, {
	module: "conversion",
	description:
		"Traduit un texte d'une langue à une autre (ou auto-détection de langue source).",
	usage:
		"traduire <langue_source|auto> <langue_cible> <texte>\nTip : On peut omettre la valeur si la commande est utilisée en réponse à un message\nExemples:\ntraduire en fr hello world!\ntraduire auto en Hablo Inglés",
})
