const { getCommands } = require("./registry")

require("./citation")
require("./conversion")
require("./geh")
require("./help")
require("./math")
require("./status")
require("./sticker")
require("./style")
require("./tag")

module.exports = {
	commandFunctions: getCommands(),
}
