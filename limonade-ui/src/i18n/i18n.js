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
            h4: "Static Data",
            pace: "pcs/min",
            performance: "pcs/h",
            performance_toggle: "pcs",
            shift_chart_leg_1: "Actual",
            shift_chart_leg_2: "Target",
            shift_chart_leg_3: "Over",
        },
        machine: {
            b1: "Order Data",
            b2: "Historic Values"
        }
    },
    de: {
        home: {
            header: "Line Monitor"
        },
        line: {
            h1: "Linien Visualisierung",
            h2: "Leistung",
            h3: "Kontrollpunkte",
            h4: "Auftragsdaten",
            pace: "Stk/min",
            performance: "Stk/h",
            performance_toggle: "Stk",
            shift_chart_leg_1: "Ist",
            shift_chart_leg_2: "Soll",
            shift_chart_leg_3: "Über",
        },
        machine: {
            b1: "Auftragsdaten",
            b2: "Historische Werte"
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