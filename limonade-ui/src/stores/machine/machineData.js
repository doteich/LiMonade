import { defineStore } from 'pinia'

import axios from "axios"

//const resturl = "http://localhost:3000"



export const useMachineDataStore = defineStore("machineData", {
    state: () => ({

        datasets: [],
        backup: [{
            label: "Error",
            id: 1,
            data: [

            ],
            backgroundColor: "rgba(238, 31, 83, 0.7)"
        },

        {
            label: "Prod",
            id: 3,
            data: [

            ],
            backgroundColor: "rgba(22,150, 103, 0.7)"
        },

        {
            label: "Alarm",
            id: 2,
            data: [

            ],
            backgroundColor: "rgba(252, 164, 0, 0.8)"
        },
        {
            label: "Idle",
            id: 0,
            data: [],
            backgroundColor: "rgba(23, 194, 247, 0.692)"
        },
        ]
    }),
    getters: {
        getDatasets: (state) => {
          
           return state.datasets

        },
        getProductiveTime(state) {
            let curDate = new Date()
            let passedTime = curDate.getHours() * 24 + curDate.getMinutes()
            //let test = ((state.datasets.filter(obj => obj.schema == "good")[0].data.map(el => el.duration)).reduce((acc, cur) => acc + cur, 0)) / 60
            let fData = state.datasets.filter(obj => obj.schema == "good")

            if (fData.length > 0) {
                return {
                    passedTime,
                    prodTime: ((fData[0].data.map(el => el.duration).reduce((acc, cur) => acc + cur, 0)) / 60)
                }
            } else {
                return {
                    passedTime,
                    prodTime: 50
                }

            }


        }
    },
    actions: {
        async initDataSet(url, line, mid) {
            try {
                let params = new URLSearchParams()
                params.append("line", line)
                params.append("machineId", mid)
                let res = await axios.get(`${url}/config/state`, { params })
                res.data.forEach(el => {
                    let stateObject = {}

                    stateObject.data = []
                    stateObject.id = el.id
                    stateObject.label = el.name
                    stateObject.schema = el.schema
                    switch (el.schema) {
                        case "critical": stateObject.backgroundColor = 'rgba(220, 20, 60, 0.7)'
                            break
                        case "bad": stateObject.backgroundColor = "rgba(255, 101, 0,0.7)"
                            break
                        case "good": stateObject.backgroundColor = 'rgba(21, 231, 14,0.7)'
                            break
                        default: stateObject.backgroundColor = "rgba(128, 128, 128, 0.7)"
                    }


                    this.datasets.push(stateObject)

                })

            }
            catch (err) {
                console.log(err)
            }
        },
        async fetchMachineData(url, database, nodeName, start, end) {
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
                params.append("collection", database)
                params.append("nodeName", nodeName)
                params.append("start", start)
                params.append("end", end)

                let res = await axios.get(`${url}/duration`, { params })

           
                let filteredData
                let entry
              

                if (res.data) {
                    res.data.forEach((el) => {
                       
                        filteredData = this.datasets.filter(entry => entry.id == el.value)
                        entry = { x: [new Date(el.start), new Date(el.end)], y: "Status", duration: el.duration }
                        filteredData[0].data.push(entry)
                        
                    })
                }

            } catch (err) {

                console.error(err)
            }
        },
    }
})