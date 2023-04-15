import { defineStore } from 'pinia'
import axios from "axios"

const resturl = "http://localhost:3000"

export const useMiscStore = defineStore("miscData", {
    state: () => ({
        activeComp: {
            chart: false,
            order: true,
            calculated: false,
        },
        chartData: {
            input: {
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                nodeName: ""
            },
            dataset: {
                label: "",
                labels: [],
                data: []
            }

        }
    }),
    getters: {
        getActiveComponent(state) {
            return state.activeComp
        },
        getChartData(state) {
            return state.chartData.dataset
        },
        getChartInputs(state) {
            return state.chartData.input
        }
    },
    actions: {
        setActiveComponent(name) {
            for (let key in this.activeComp) {
                this.activeComp[key] ? this.activeComp[key] = false : ""
            }

            this.activeComp[name] = true
        },
        async fetchChartData(nodeName, start, end) {
            try {

                if (!start) {
                    start = new Date()
                    start.setHours(start.getHours() - 1)
                    start = start.toISOString()
                }

                if (!end) {
                    end = new Date().toISOString()
                }



                const params = new URLSearchParams();
                params.append("nodeName", nodeName)
                params.append("start", start)
                params.append("end", end)
                params.append("chartData", "true")

                let res = await axios.get(`${resturl}/generic`, { params })

                this.chartData.dataset.labels = res.data.labels
                this.chartData.dataset.data = res.data.data
                this.chartData.dataset.label = nodeName

                this.chartData.input.nodeName = nodeName
                this.chartData.input.start = start
                this.chartData.input.end = end

                this.setActiveComponent("chart")


            } catch (err) {
                console.log(err)
            }
        }
    }
})