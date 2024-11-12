import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
const debug = import.meta.env.MODE === "development";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.use(Backend)
	.init({
		debug: debug,
		fallbackLng: "en",
		supportedLngs: ["en", "no"],
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	});

export default i18n;
