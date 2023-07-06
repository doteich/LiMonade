import { defineStore } from 'pinia'
import axios from "axios"

export const useCentralDataStore = defineStore("centralDataStore", {
    state: () => ({
        restURL: "http://localhost:3000",
        refreshInterval: 60,
        name: "",
        machineDefinition: {
            database: "",
            socket: "",
            dynamicData: [],
            staticData: []
        }
    }),
    getters: {
        getCounters: (state) => {
            let counters = state.machineDefinition.dynamicData.filter((el) => el.show )
            return counters
        },
        getState: (state) => {
            let status = state.machineDefinition.dynamicData.filter((el) => el.type == "state")
            return status
        },
        getAlarm: (state) => {
            let alarm = state.machineDefinition.dynamicData.filter((el) => el.type == "alarm")
            return alarm
        },
    },
    actions: {
        async fetchMachineConfig(line, machine) {
            try {

                let params = new URLSearchParams()
                params.append("configType", "machine")
                params.append("lineId", line)
                params.append("machineId", machine)
                let res = await axios.get(`${this.restURL}/config`, { params })
                this.machineDefinition = res.data
                this.startSockets()
            }
            catch (err) {
                console.log(err)
            }
        },
        startSockets() {
            const socket = new WebSocket(`${this.machineDefinition.socket}`)
            socket.addEventListener('open', () => {
                let payload = JSON.stringify({
                    "operation": "bulk_read"
                })

                socket.send(payload)
                console.log("Connection established to ws")
            })

            socket.addEventListener('message', (event) => {

                let json = JSON.parse(event.data)
                let tag = this.machineDefinition.dynamicData.find((el) =>
                    el.nodeId == json.nodeid
                )

                if (tag) {
                    tag.value = json.value
                }

            })

            socket.addEventListener("error", (event) => {
                console.log(event)
            })

        }

    }


})
