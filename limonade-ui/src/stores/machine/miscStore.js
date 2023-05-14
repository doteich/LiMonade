import { defineStore } from 'pinia'
import { useGlobalVars } from "./globalVars"

import axios from "axios"

//const resturl = "http://localhost:3000"

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
        orderData: [{
                displayName: "Current Order",
                nodeName: "Order",
                value: "",
                timestamp: "",
                showTS: true,
            },
            {
                displayName: "Material Number",
                nodeName: "Material",
                value: "",
                timestamp: "",
                showTS: true,
            },
            {
                displayName: "Batch",
                nodeName: "Batch",
                value: "",
                timestamp: "",
                showTS: false,
            },
            {
                displayName: "SLED",
                nodeName: "SLED",
                value: "",
                timestamp: "",
                showTS: false,
            },
            {
                displayName: "Recipe",
                nodeName: "Recipe",
                value: "",
                timestamp: "",
                showTS: false,
            },
            {
                displayName: "Target Quantity",
                nodeName: "Target Quantity",
                value: "",
                timestamp: "",
                showTS: true,
            },
            {
                displayName: "Trays",
                nodeName: "Trays",
                value: "",
                timestamp: "",
                showTS: false,
            },
        ],
        calculatedTemplate: {
            displayName: "",
            value: "",
            unit: "",
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
        },
        getOrderData(state) {

            return state.orderData
        },

        calcCompletionTime(state) {
            let date = new Date()
            date.setMinutes(date.getMinutes() + (state.orderData.filter(el => el.nodeName == 'Target Quantity')[0].value / (state.orderData.filter(el => el.nodeName == 'Trays')[0].value / ((new Date() - state.orderData.filter(el => el.nodeName == 'Order')[0].timestamp) / 60000))))
            return date.toLocaleString()
        },

        getCalculatedData(state) {

            let calculatedData = [{

                    displayName: "PCs Per Hour",
                    value: (state.orderData.filter(el => el.nodeName == 'Trays')[0].value / ((new Date() - state.orderData.filter(el => el.nodeName == 'Order')[0].timestamp) / 3600000)).toFixed(0),
                    unit: "PCs/h",

                },
                {

                    displayName: "PCs Per Minute",
                    value: (state.orderData.filter(el => el.nodeName == 'Trays')[0].value / ((new Date() - state.orderData.filter(el => el.nodeName == 'Order')[0].timestamp) / 60000)).toFixed(0),
                    unit: "PCs/min",

                },
                {

                    displayName: "Estimated Finish in Hours",
                    value: (state.orderData.filter(el => el.nodeName == 'Target Quantity')[0].value / (state.orderData.filter(el => el.nodeName == 'Trays')[0].value / ((new Date() - state.orderData.filter(el => el.nodeName == 'Order')[0].timestamp) / 3600000))).toFixed(2),
                    unit: "h",

                },
                {

                    displayName: "Estimated Finish Time",
                    value: this.calcCompletionTime,
                    unit: "",

                },


            ]
            return calculatedData
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

                const globalVarStore = useGlobalVars()

                if (!start) {
                    start = new Date()
                    start.setHours(start.getHours() - 1)
                    start = start.toISOString()
                }

                if (!end) {
                    end = new Date().toISOString()
                }



                const params = new URLSearchParams();
                params.append("collection", globalVarStore.getGlobalVars.mongodbCollection)
                params.append("nodeName", nodeName)
                params.append("start", start)
                params.append("end", end)
                params.append("chartData", "true")

                let res = await axios.get(`${globalVarStore.getGlobalVars.restURL}/timeseries`, { params })

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
        },
        initOrderData() {
            for (let obj of this.orderData) {
                this.fetchNodeData(obj.nodeName)
            }
        },

        async fetchNodeData(node) {
            try {
                const globalVarStore = useGlobalVars()

                let params = new URLSearchParams()
                params.append("collection", globalVarStore.getGlobalVars.mongodbCollection)
                params.append("nodeName", node)
                let res = await axios.get(`${globalVarStore.getGlobalVars.restURL}/last`, { params })
                let el = this.orderData.filter((obj) => obj.nodeName == node)
                el[0].value = res.data[0].Value
                el[0].timestamp = new Date(res.data[0].ts)

            } catch (err) {
                console.log(err)
            }
        }
    }
})