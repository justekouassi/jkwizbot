const convert = require("convert-units")

const units = convert().possibilities()

const bases = Array.from({ length: 35 }, (_, i) => (i + 2).toString()).concat(
	"rom"
)

/**
 * réalise des conversions d'unités
 *
 * @param {String} fromUnit unité source
 * @param {String} toUnit unité cible
 * @param {float} value valeur
 */
function convertUnits(fromUnit, toUnit, value) {
	return convert(value).from(fromUnit).to(toUnit)
}

function romanToDecimal(roman) {
	const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
	let num = 0,
		prev = 0
	for (let i = roman.length - 1; i >= 0; i--) {
		let curr = map[roman[i]]
		num += curr < prev ? -curr : curr
		prev = curr
	}
	return num
}

function decimalToRoman(num) {
	const map = [
		[1000, "M"],
		[900, "CM"],
		[500, "D"],
		[400, "CD"],
		[100, "C"],
		[90, "XC"],
		[50, "L"],
		[40, "XL"],
		[10, "X"],
		[9, "IX"],
		[5, "V"],
		[4, "IV"],
		[1, "I"],
	]
	let result = ""
	for (let [value, symbol] of map) {
		while (num >= value) {
			result += symbol
			num -= value
		}
	}
	return result
}

function convertBase(fromBase, toBase, number) {
	if (fromBase === "rom" || toBase === "rom") {
		const decimalNumber =
			fromBase === "rom"
				? romanToDecimal(number)
				: parseInt(number, parseInt(fromBase, 10))
		return toBase === "rom"
			? decimalToRoman(decimalNumber)
			: decimalNumber.toString(parseInt(toBase, 10))
	}
	const from = parseInt(fromBase, 10)
	const to = parseInt(toBase, 10)
	if (isNaN(from) || isNaN(to) || from < 2 || to < 2 || from > 36 || to > 36) {
		return "Base non supportée"
	}
	return parseInt(number, from).toString(to)
}

module.exports = {
	units,
	convertUnits,
	bases,
	convertBase,
}
