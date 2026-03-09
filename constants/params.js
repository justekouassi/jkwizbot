require("dotenv").config()

const SERVER =
	process.env.DEVELOPPEMENT === "true"
		? process.env.DEV_SERVER
		: process.env.PROD_SERVER

// bot
const BOT_NAME = "JkwizBot"
const BOT_VERSION = "26.03.09"
// owner
const OWNER_GITHUB = "https://github.com/justekouassi"
const OWNER_NAME = "Juste Kouassi"

module.exports = {
	SERVER,
	BOT_NAME,
	BOT_VERSION,
	OWNER_GITHUB,
	OWNER_NAME,
}
