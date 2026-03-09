const fs = require("fs")
const path = require("path")
const { logger } = require("../helper/logger")
const configFilePath = path.join(__dirname, "config.json")

/**
 * récupère la valeur d'un paramètre
 *
 * @param {String} parameterName nom du paramètre
 */
function getParameter(parameterName) {
	try {
		const data = fs.readFileSync(configFilePath, "utf8")
		const config = JSON.parse(data)
		return config[parameterName]
	} catch (err) {
		console.error(`Error reading or parsing config file: ${err}`)
		return null
	}
}

/**
 * met à jour la valeur d'un paramètre
 *
 * @param {String} parameterName nom du paramètre
 * @param {String} parameterValue valeur du paramètre
 */
function setParameter(parameterName, parameterValue) {
	try {
		const data = fs.readFileSync(configFilePath, "utf8")
		const config = JSON.parse(data)
		config[parameterName] = parameterValue
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8")
		logger.info(`Parameter "${parameterName}" updated to "${parameterValue}"`)
	} catch (err) {
		console.error(`Error updating config file: ${err}`)
	}
}

module.exports = { getParameter, setParameter }
