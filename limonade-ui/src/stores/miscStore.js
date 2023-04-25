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

        },
        orderData: [{
                displayName: "Current Order",
                nodeName: "Order",
                value: "",
                timestamp: ""
            },
            {
                displayName: "Material Number",
                nodeName: "Material",
                value: "",
                timestamp: ""
            },
            {
                displayName: "Batch",
                nodeName: "Batch",
                value: "",
                timestamp: ""
            },
            {
                displayName: "SLED",
                nodeName: "SLED",
                value: "",
                timestamp: ""
            },
            {
                displayName: "Recipe",
                nodeName: "Recipe",
                value: "",
                timestamp: ""
            },
            {
                displayName: "Target Quantity",
                nodeName: "Target Quantity",
                value: "",
                timestamp: ""
            },
            {
                displayName: "Trays",
                nodeName: "Trays",
                value: "",
                timestamp: ""
            },
        ],
        calculatedData: [{

                displayName: "PCs Per Hour",
                formular: "state.orderData.filter(el => el.nodeName == 'Trays')[0].value/((new Date() - new Date('2023-04-25T17:52:07.484Z'))/3600000)",
                value: "",
                unit: "",

            },
            {

                displayName: "PCs Per Second",
                formular: "state.orderData.filter(el => el.nodeName == 'Trays')[0].value/((new Date() - new Date('2023-04-25T17:52:07.484Z'))/1000)",
                value: "",
                unit: "",

            }
        ]
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
        getCalculatedData(state) {
            state.calculatedData.forEach((el) => {
                el.value = eval(el.formular)
            })
            return state.calculatedData
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

                let res = await axios.get(`${resturl}/timeseries`, { params })

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
                let params = new URLSearchParams()
                params.append("nodeName", node)
                let res = await axios.get(`${resturl}/last`, { params })
                let el = this.orderData.filter((obj) => obj.nodeName == node)
                el[0].value = res.data[0].Value
                el[0].timestamp = new Date(res.data[0].ts).toLocaleString()

            } catch (err) {
                console.log(err)
            }
        }
    }
})