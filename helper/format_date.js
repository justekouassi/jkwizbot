// Tableau des jours de la semaine en français
const joursSemaine = [
	"dimanche",
	"lundi",
	"mardi",
	"mercredi",
	"jeudi",
	"vendredi",
	"samedi",
]

// Tableau des mois de l'année en français
const moisAnnee = [
	"janvier",
	"février",
	"mars",
	"avril",
	"mai",
	"juin",
	"juillet",
	"août",
	"septembre",
	"octobre",
	"novembre",
	"décembre",
]

/**
 * retourne la date en format francophone
 *
 * @param {Date} date
 */
function dateInFrench(date) {
	const jourSemaine = joursSemaine[date.getDay()]
	const jourMois = date.getDate()
	const mois = moisAnnee[date.getMonth()]
	const annee = date.getFullYear()
	return `${jourSemaine} ${jourMois} ${mois} ${annee}`
}

module.exports = {
	dateInFrench,
}
