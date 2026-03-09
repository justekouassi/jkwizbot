const axios = require("axios")
const { SERVER } = require("../../constants/params")

/**
 * retourne une liste de questions
 *
 * @param {int} nbQuestions le nombre de questions
 * @param {String} themes la liste des thèmes pour les questions
 */
async function getQuestions(nbQuestions, themes) {
	try {
		const url = `${SERVER}questionss/?language=fr&nb=${nbQuestions}&themes=${themes}`
		const response = await axios.get(url)
		return response.data
	} catch (error) {
		console.error("Erreur lors de la récupération des questions : ", error)
		// Valeurs par défaut ou logique de secours
		return []
	}
}

async function getAllThemes() {
	let results = []
	let url = `${SERVER}themes/?limit=100`

	while (url) {
		const { data } = await axios.get(url)
		results.push(...data.results)
		url = data.next
	}

	return results
}

/**
 * retourne le rang d'un joueur
 *
 * @param {int} nombre le rang du joueur
 */
function getRank(nombre) {
	switch (nombre) {
		case 1:
			return "🥇"
		case 2:
			return "🥈"
		case 3:
			return "🥉"
		default:
			return nombre
	}
}

module.exports = {
	getQuestions,
	getAllThemes,
	getRank,
}
