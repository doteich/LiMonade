import { defineStore } from 'pinia'
import axios from "axios"

export const useMiscStore = defineStore("miscData", {
    state: () => ({
        activeComp: {
            chart: false,
            order: true,
            calculated: false,
        }
    }),
    getters: {
        getActiveComponent(state) {
            return state.activeComp
        }
    },
    actions: {
        setActiveComponent(name) {
            for (let key in this.activeComp) {
                this.activeComp[key] ? this.activeComp[key] = false : ""
            }

            this.activeComp[name] = true
        },
    }
})