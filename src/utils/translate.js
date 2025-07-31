const axios = require("axios");
const log = require("./logger");

async function translateMessage(text, targetLang = "en") {
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${targetLang}&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url);

    const translatedData = response.data;
    const translatedText = (translatedData[0]?.[0] ?? null)?.replace(/\`\`\`/g, "");
    const originalLanguage = translatedData[0]?.[1] ?? "unknown";

    if (!translatedText) {
      log.warn("Translation failed: No translated text returned.");
      return { translatedText: text, originalLanguage };  // Return the original message if translation fails
    }

    return { translatedText, originalLanguage };
  } catch (error) {
    log.error(`Translation API error: ${error.message}`);
    return { translatedText: text, originalLanguage: "unknown" };  // Return original message in case of error
  }
}



module.exports = { translateMessage };
