const { books, bookNames } = require("../../data/json/bible_books")
const bible = require("../../data/json/ls1910.json")

/** normalise une chaîne de caractères */
function normalize(str) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, "")
}

const BOOK_INDEX = {}

/* indexe les livres de la bible */
for (const code of books) {
	const fullName = bookNames[code]

	BOOK_INDEX[normalize(code)] = fullName
	BOOK_INDEX[normalize(fullName)] = fullName

	// variantes numériques : 1 Jean / 1Jean
	const numMatch = fullName.match(/^(\d)\s+(.*)$/)
	if (numMatch) {
		BOOK_INDEX[normalize(numMatch[1] + numMatch[2])] = fullName
	}
}

/**
 * Résout un nom de livre en un nom complet
 */
function resolveBook(input) {
	return BOOK_INDEX[normalize(input)] || null
}

/**
 * Trouve un livre par nom ou abréviation simple
 */
function findBook(bookName) {
	return bible.books.find(
		(b) => b.name.toLowerCase() === bookName.toLowerCase(),
	)
}

/** retourne un verset aléatoire d'un livre */
function getRandomVerseFromBook(bookName) {
	const book = bible.books.find((b) => b.name === bookName)
	const chapter =
		book.chapters[Math.floor(Math.random() * book.chapters.length)]
	const verse =
		chapter.verses[Math.floor(Math.random() * chapter.verses.length)]

	return formatVerse(book.name, chapter.chapter, verse)
}

/** retourne un verset aléatoire d'un chapitre */
function getRandomVerseFromChapter(bookName, chapterNumber) {
	const book = bible.books.find((b) => b.name === bookName)
	const chapter = book.chapters.find((c) => c.chapter === Number(chapterNumber))
	if (!chapter) throw new Error()

	const verse =
		chapter.verses[Math.floor(Math.random() * chapter.verses.length)]

	return formatVerse(book.name, chapter.chapter, verse)
}

/**
 * Génère une référence biblique aléatoire
 */
function getRandomVerse() {
	const book = bible.books[Math.floor(Math.random() * bible.books.length)]
	const chapter =
		book.chapters[Math.floor(Math.random() * book.chapters.length)]
	const verse =
		chapter.verses[Math.floor(Math.random() * chapter.verses.length)]

	return formatVerse(book.name, chapter.chapter, verse)
}

/**
 * Retourne un ou plusieurs versets selon la référence
 */
function getVerses(bookName, chapterNumber, verseExpr) {
	const book = findBook(bookName)
	if (!book) throw new Error("Livre invalide")

	const chapter = book.chapters.find((c) => c.chapter === Number(chapterNumber))
	if (!chapter) throw new Error("Chapitre invalide")

	// plage ou verset unique
	let verses = []
	if (verseExpr.includes("-")) {
		const [start, end] = verseExpr.split("-").map(Number)
		verses = chapter.verses.filter((v) => v.verse >= start && v.verse <= end)
	} else {
		const verse = chapter.verses.find((v) => v.verse === Number(verseExpr))
		if (verse) verses.push(verse)
	}

	if (!verses.length) throw new Error("Verset introuvable")

	return verses.map((v) => formatVerse(book.name, chapterNumber, v)).join("\n")
}

/**
 * Format WhatsApp
 */
function formatVerse(book, chapter, verse) {
	return `_*${book} ${chapter} v ${verse.verse}*_ : ${verse.text.trim()}`
}

/**
 * Commande bible
 */
module.exports = async function (client, message, expression) {
	try {
		let response

		// bible
		if (!expression) {
			response = getRandomVerse()
		}

		// bible genese / bible ge
		else if (/^[^\d:]+$/.test(expression)) {
			const bookName = resolveBook(expression)
			if (!bookName) throw new Error()

			response = getRandomVerseFromBook(bookName)
		}

		// bible genese 1
		else if (/^[^\d:]+\s+\d+$/.test(expression)) {
			const [rawBook, chapter] = expression.split(/\s+/)
			const bookName = resolveBook(rawBook)
			if (!bookName) throw new Error()

			response = getRandomVerseFromChapter(bookName, chapter)
		}

		// bible genese 1:1-3
		else {
			const match = expression.match(/^(.+?)\s+(\d+):(.+)$/)
			if (!match) throw new Error()

			const [, rawBook, chapter, verses] = match
			const bookName = resolveBook(rawBook)
			if (!bookName) throw new Error()

			response = getVerses(bookName, chapter, verses)
		}

		await message.reply(response)
	} catch {
		await message.reply("❌ Référence biblique invalide")
	}
}
