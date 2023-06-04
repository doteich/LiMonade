import { defineStore } from 'pinia'
import { useGlobalVars } from "./globalVars"

import axios from "axios"

//const resturl = "http://localhost:3000"



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
                backgroundColor: "rgba(252, 164, 0, 0.8)"
            },
            {
                label: "Idle",
                code: 0,
                data: [],
                backgroundColor: "rgba(23, 194, 247, 0.692)"
            },
        ]
    }),
    getters: {
        getDatasets: (state) => state.datasets,
        getProductiveTime(state) {
            let curDate = new Date()
            let passedTime = curDate.getHours() * 24 + curDate.getMinutes()
            let prodTime = ((state.datasets.filter(obj => obj.label == "Prod")[0].data.map(el => el.duration)).reduce((acc, cur) => acc + cur, 0)) / 60
            return {
                passedTime,
                prodTime
            }

        }
    },
    actions: {
        async fetchMachineData(nodeName, start, end) {
            try {

                const globalVarStore = useGlobalVars()

                if (!start) {
                    start = new Date()
                    start.setHours(start.getHours() - 24)
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

                let res = await axios.get(`${globalVarStore.getGlobalVars.restURL}/duration`, { params })

                let stateData
                let entry


                if (res.data) {
                    res.data.forEach((el) => {
                        stateData = this.datasets.filter(entry => entry.code == el.value)
                        entry = { x: [new Date(el.start), new Date(el.end)], y: "Status", duration: el.duration }
                        stateData[0].data.push(entry)
                    })
                }


            } catch (err) {
                console.log(err)
            }
        },
    }
})