import translate from "translate"

/**
 * traduit un texte un texte à l'aide de
 * la détection automatique de Google Translate
 *
 * @param {String} text le texte à traduire
 * @param {String} targetLang le code ISO de la langue cible
 */
export async function translateAuto(text, targetLang) {
	try {
		return await translate(text, { to: targetLang })
	} catch (error) {
		console.error("Une erreur s'est produite lors de la traduction :", error)
		return "❌ Une erreur est survenue"
	}
}

/**
 * traduit un texte un texte à l'aide de  de Google Translate
 *
 * @param {String} text le texte à traduire
 * @param {String} sourceLang le code ISO de la langue source
 * @param {String} targetLang le code ISO de la langue cible
 */
export async function translateManual(text, sourceLang, targetLang) {
	try {
		return await translate(text, { from: sourceLang, to: targetLang })
	} catch (error) {
		console.error("Une erreur s'est produite lors de la traduction :", error)
		return "❌ Une erreur est survenue"
	}
}
