function formatForWhatsapp(text = "") {
	return (
		text
			// code blocks ``` ```
			.replace(/```[\s\S]*?```/g, "")
			// inline code
			.replace(/`([^`]+)`/g, "$1")
			// bold **text**
			.replace(/\*\*(.*?)\*\*/g, "*$1*")
			// italic *text* ou _text_
			.replace(/\*(.*?)\*/g, "_$1_")
			.replace(/_(.*?)_/g, "_$1_")
			// headings ### Title
			.replace(/^#{1,6}\s*/gm, "")
			// lists
			.replace(/^\s*[-*+]\s+/gm, "• ")
			// extra empty lines
			.replace(/\n{3,}/g, "\n\n")
			.trim()
	)
}

module.exports = { formatForWhatsapp }
