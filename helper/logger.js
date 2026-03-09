const winston = require("winston")
const fs = require("fs")
const path = require("path")
var colors = require("@colors/colors") // A NE PAS SUPPRIMER

// Configuration du logger
const logDirectory = path.join(__dirname, "../logs")
// Création du dossier 'logs' s'il n'existe pas
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory)
}

/**
 * supprime les caractères ASCII de coloration de texte dans le fichier log
 */
function deleteAscii(input) {
	return input.replace(/\x1b\[[^m]*m/g, "")
}

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.printf(
			(info) =>
				`${info.timestamp} [${info.level.toUpperCase()}]: ${deleteAscii(
					info.message
				)}`
		)
	),
	transports: [
		// Transport pour écrire dans un fichier
		new winston.transports.File({
			filename: path.join(logDirectory, "app.log"),
			maxsize: 5 * 1024 * 1024, // 5MB
			maxFiles: 5,
		}),
		// Transport pour afficher dans la console
		new winston.transports.Console({
			format: winston.format.printf((info) => `${info.message}`),
		}),
	],
})

module.exports = { logger }
