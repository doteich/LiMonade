import { defineStore } from 'pinia'
import axios from "axios"

const resturl = "http://localhost:3000"

export const useMachineDataStore = defineStore("machineData", {
    state: () => ({
        datasets: [{
                label: "Error",
                code: 1,
                data: [

                ],
                backgroundColor: "rgba(238, 31, 83, 0.7)"
            },

            {
                label: "Prod",
                code: 3,
                data: [

                ],
                backgroundColor: "rgba(22,150, 103, 0.7)"
            },

            {
                label: "Alarm",
                code: 2,
                data: [

                ],
                backgroundColor: "yellow"
            },
            {
                label: "Idle",
                code: 0,
                data: [{ x: [new Date(2023, 3, 8, 1, 0), new Date(2023, 3, 8, 14, 45)], y: "Status" }],
                backgroundColor: "rgba(23, 194, 247, 0.692)"
            },
        ]
    }),
    getters: {
        getDatasets: (state) => state.datasets,
    },
    actions: {
        async fetchMachineData(nodeName, start, end) {
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

                let res = await axios.get(`${resturl}/duration`, { params })
                let stateData
                let entry

                res.data.forEach((el) => {
                    stateData = this.datasets.filter(entry => entry.code == el.value)
                    entry = { x: [new Date(el.start), new Date(el.end)], y: "Status" }
                    stateData[0].data.push(entry)
                })

            } catch (err) {
                console.log(err)
            }
        },
    }
})