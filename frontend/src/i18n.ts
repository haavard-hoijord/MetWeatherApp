import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
const debug = import.meta.env.MODE === "development";

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		backend: {
			loadPath: "/MetWeatherApp/locales/{{lng}}/translation.json",
		},
		debug: debug,
		fallbackLng: "en",
		supportedLngs: ["en", "no"],
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	});

export default i18n;
