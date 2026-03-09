/**
 * donne la version unicode d'un texte
 *
 * @param {String} text
 */
function unidecode(text) {
	return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
}

/**
 * standardise une réponse
 *
 * @param {String} answer réponse
 */
function harmoniseAnswer(answer = "") {
	return unidecode(answer.replace(/^"(.*)"$/, "$1"))
		.toLowerCase()
		.replace(/[’'-]/g, " ")
		.replace(/[.,?]/g, "")
		.replace(/œ/g, "oe")
		.replace(/æ/g, "ae")
		.replace(/&/g, "et")
		.trim()
}

/**
 * supprime les réponses entre paren	thèses
 *
 * @param {String} mot réponse correcte
 */
function withoutParenthesis(mot) {
	// Trouver l'index de la première parenthèse ouvrante
	let indexParentheseOuvrante = mot.indexOf("(")
	// Trouver l'index de la première parenthèse fermante
	let indexParentheseFermante = mot.indexOf(")")

	// Si aucune parenthèse ouvrante n'est trouvée
	if (indexParentheseOuvrante === -1 && indexParentheseFermante === -1) {
		// Le premier mot est simplement le mot complet
		return [mot]
	} else {
		let motEntreParentheses = mot.substring(
			indexParentheseOuvrante,
			indexParentheseFermante + 1,
		)
		let premierMot = mot
			.replace(motEntreParentheses, "")
			.trim()
			.replace("  ", " ")
		let deuxiemeMot = mot.replace("(", "").replace(")", "")
		// Retourner les deux mots extraits
		return [premierMot, deuxiemeMot]
	}
}

/**
 * retourne toutes les permutations d'un tableau
 *
 * @param {String[]} arr tableau
 */
function permute(arr) {
	if (arr.length <= 1) return [arr]
	let permutations = []
	for (let i = 0; i < arr.length; i++) {
		const rest = permute([...arr.slice(0, i), ...arr.slice(i + 1)])
		for (const permutation of rest) {
			permutations.push([arr[i], ...permutation])
		}
	}
	return permutations
}

/**
 * génère toutes les combinaisons possibles d'une réponse liste
 *
 * @param {String} answer réponse correcte
 */
function generateCombinations(answer) {
	const parts = answer.split(" ; ").map((part) => part.trim())
	const permutations = permute(parts)
	const combinations = permutations.map((permutation) => permutation.join(" "))

	if (parts.length === 2) {
		combinations.push(parts.join(" et "))
		combinations.push(parts.slice().reverse().join(" et "))
	}

	return combinations
}

/**
 * valide la réponse du joueur
 *
 * @param {String} attempt réponse du joueur
 * @param {String} goodAnswer réponse correcte
 */
function validateAnswer(attempt, goodAnswer) {
	const answersList = goodAnswer
		.split(" / ")
		.map((answer) => harmoniseAnswer(answer))
	const possibleAnswers = answersList.flatMap((answer) => {
		const withoutParen = withoutParenthesis(answer)
		const combinations = withoutParen.flatMap((item) =>
			generateCombinations(item),
		)
		return combinations.map((item) => harmoniseAnswer(item))
	})
	return possibleAnswers.includes(harmoniseAnswer(attempt))
}

module.exports = {
	unidecode,
	harmoniseAnswer,
	withoutParenthesis,
	validateAnswer,
}
