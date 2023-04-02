import { defineStore } from 'pinia'
import axios from "axios"


const websocket = "ws://localhost:8080/"
const resturl = "http://localhost:3000"
var socket

export const useCounterStore = defineStore('counter', {
    state: () => ({

        counters: [{
                nodeId: "ns=2;s=Machines.Packaging.Counters.Bags",
                name: "Bags",
                unit: "pcs",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Labels",
                name: "Labels",
                unit: "pcs",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Trays",
                name: "Trays",
                unit: "pcs",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorAmps",
                name: "Motor Amps",
                unit: "A",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorVoltage",
                name: "Motor Voltage",
                unit: "V",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorTemperature",
                name: "Motor Temperature",
                unit: "°C",
                value: 0
            }

        ],
        chartData: {
            enabled: false,
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    fill: false,
                    borderColor: "hsl(209, 47%, 20%)",
                    tension: 0.4
                }, ]
            }

        }

    }),
    getters: {
        getCounters: (state) => state.counters,
        getChartData: (state) => { return state.chartData }

    },
    actions: {
        startWS() {

            socket = new WebSocket(`${websocket}ws`)

            socket.addEventListener('open', () => {
                let payload = JSON.stringify({
                    "operation": "bulk_read"
                })

                socket.send(payload)
                console.log("Connection established to ws")
            })



            socket.addEventListener('message', (event) => {

                let json = JSON.parse(event.data)
                let counter = this.counters.find((el) =>
                    el.nodeId == json.nodeid
                )
                if (counter) {
                    counter.value = json.value
                }

            })


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


                this.chartData.data.labels = res.data.labels
                this.chartData.data.datasets[0].data = res.data.data
                this.chartData.data.datasets[0].label = nodeName
                this.chartData.enabled = true

            } catch (err) {
                console.log(err)
            }
        }
    },


})