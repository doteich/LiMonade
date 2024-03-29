import { defineStore } from 'pinia'

import axios from "axios"


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

        },
      
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
        },
        calcCompletionTime(state) {
            let date = new Date()
            date.setMinutes(date.getMinutes() + (state.orderData.filter(el => el.nodeName == 'Target Quantity')[0].value / (state.orderData.filter(el => el.nodeName == 'Trays')[0].value / ((new Date() - state.orderData.filter(el => el.nodeName == 'Order')[0].timestamp) / 60000))))
            return date.toLocaleString()
        },

        getCalculatedData() {

        }
    },
    actions: {
        setActiveComponent(name) {
            for (let key in this.activeComp) {
                this.activeComp[key] ? this.activeComp[key] = false : ""
            }

            this.activeComp[name] = true
        },
        async fetchChartData(url, database, nodeName, start, end) {
            try {


                if (!start) {
                    start = new Date()
                    start.setHours(start.getHours() - 1)
                    let sHour = start.getHours()
                    start = start.toISOString()
                    this.chartData.input.start = `${start.split("T")[0]}T${sHour}:${start.split("T")[1].split(":")[1]}:${start.split("T")[1].split(":")[2]}` 
                }

                if (!end) {
                    end = new Date()
                    let eHour = end.getHours()
                    end = end.toISOString()
                    this.chartData.input.end = `${end.split("T")[0]}T${eHour}:${end.split("T")[1].split(":")[1]}:${end.split("T")[1].split(":")[2]}` 
                }

                const params = new URLSearchParams();
                params.append("collection", database)
                params.append("nodeName", nodeName)
                params.append("start", start)
                params.append("end", end)
                params.append("chartData", "true")

                let res = await axios.get(`${url}/timeseries`, { params })

                this.chartData.dataset.labels = res.data.labels
                this.chartData.dataset.data = res.data.data
                this.chartData.dataset.label = nodeName

                this.chartData.input.nodeName = nodeName
                this.setActiveComponent("chart")


            } catch (err) {
                console.log(err)
            }
        },

    }
})