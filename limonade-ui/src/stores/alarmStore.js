import { defineStore } from 'pinia'
import axios from "axios"

const resturl = "http://localhost:3000"

export const useAlarmStore = defineStore("alarmStore", {
    state: () => ({
        alarms: [],
    }),
    getters: {
        getAlarms: (state) => {
            return state.alarms
        }
    },
    actions: {
        async fetchAlarms(nodeName, start, end) {
            try {

                if (!start) {
                    start = new Date()
                    start.setHours(start.getHours() - 24)
                    start = start.toISOString()
                }

                if (!end) {
                    end = new Date().toISOString()
                }

                const params = new URLSearchParams();
                params.append("nodeName", nodeName)
                params.append("start", start)
                params.append("end", end)
                params.append("orderBy", "desc")

                let res = await axios.get(`${resturl}/duration`, { params })

                let filteredData = res.data.filter((entry) => {
                    return entry.value > 0
                })

                filteredData = filteredData.slice(0, 5)

                this.alarms = []

                filteredData.forEach(el => {
                    el.text = "ALARMTEXT_TEST"
                    el.duration = el.duration / 60
                    el.start = new Date(el.start).toLocaleString()
                    el.end = new Date(el.end).toLocaleString()
                    this.alarms.push(el)
                });




            } catch (err) {
                console.log(err)
            }
        },
    }
})