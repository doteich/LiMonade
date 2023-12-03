import { createI18n } from 'vue-i18n'



const messages ={
    en:{
        home:{
            header: "LiMoNade"
        }
    },
    de:{
        home:{
            header: "Line Monitor"
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