import { defineStore } from 'pinia'


export const useGlobalVars = defineStore("globalVars", {
    state: () => ({
        restURL: "https://linemonitoring-iep-rheine.schwarz/api",
        mongodbCollection: "lms_packaging",
        websocket: "ws://localhost:8080/"
    }),
    getters: {
        getGlobalVars(state) {
            return state
        }
    }
})