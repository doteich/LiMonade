import { defineStore } from 'pinia'
import { useGlobalVars } from "./globalVars"

var socket

export const useDynamicDataStore = defineStore("dynamicData", {
    state: () => ({

        data: [
        ],


    }),
    getters: {
        getCounters: (state) => {
            let counters = state.data.filter((el) => el.type == "counter")
            return counters
        },
        getState: (state) => {
            let status = state.data.filter((el) => el.type == "state")
            return status
        },
        getAlarm: (state) => {
            let alarm = state.data.filter((el) => el.type == "alarm")
            return alarm
        },
        getChartData: (state) => { return state.chartData }

    },


})