import { createI18n } from 'vue-i18n'



const messages = {
    en: {
        home: {
            header: "Line Monitor"
        },
        line: {
            h1: "Line View",
            h2: "Performance",
            h3: "Counters",
            h4: "Static Data"
        },
        machine: {

        }
    },
    de: {
        home: {
            header: "Line Monitor"
        },
        line: {
            h1: "Linien Visualisierung",
            h2: "Leistung",
            h3: "Zähler",
            h4: "Statische Daten"
        },
        machine: {
            
        }
    }
}


export default createI18n({
    locale: navigator.language,
    fallbackLocale: navigator.language,
    legacy: false,
    globalInjection: true,
    messages
})