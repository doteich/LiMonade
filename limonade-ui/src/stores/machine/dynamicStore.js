import { defineStore } from 'pinia'
import { useGlobalVars } from "./globalVars"

var socket

export const useDynamicDataStore = defineStore("dynamicData", {
    state: () => ({

        data: [{
                nodeId: "ns=2;s=Machines.Packaging.Counters.Bags",
                name: "Bags",
                unit: "pcs",
                type: "counter",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Labels",
                name: "Labels",
                unit: "pcs",
                type: "counter",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Trays",
                name: "Trays",
                unit: "pcs",
                type: "counter",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorAmps",
                name: "Motor Amps",
                unit: "A",
                type: "counter",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorVoltage",
                name: "Motor Voltage",
                unit: "V",
                type: "counter",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorTemperature",
                name: "Motor Temperature",
                unit: "°C",
                type: "counter",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.State.State",
                name: "State",
                unit: "",
                type: "state",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.State.Alarm",
                name: "Alarm",
                unit: "",
                type: "alarm",
                value: 0
            }

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
    actions: {
        startWS() {

            const globalVarStore = useGlobalVars()


            socket = new WebSocket(`${globalVarStore.getGlobalVars.websocket}ws`)

            socket.addEventListener('open', () => {
                let payload = JSON.stringify({
                    "operation": "bulk_read"
                })

                socket.send(payload)
                console.log("Connection established to ws")
            })



            socket.addEventListener('message', (event) => {

                let json = JSON.parse(event.data)
                let counter = this.data.find((el) =>
                    el.nodeId == json.nodeid
                )

                if (counter) {
                    counter.value = json.value
                }

            })

            socket.addEventListener("error", (event) => {
                console.log(event)
            })

        },

    },


})