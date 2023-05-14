import { defineStore } from 'pinia'


export const useGlobalVars = defineStore("globalVars", {
    state: () => ({
        restURL: "http://localhost:3000",
        mongodbCollection: "lms_packaging",
        websocket: "ws://localhost:8080/"
    }),
    getters: {
        getGlobalVars(state) {
            return state
        }
    }
})