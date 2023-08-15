import { defineStore } from 'pinia'
import axios from "axios"

//const resturl = "http://localhost:3000"



export const useAlarmStore = defineStore("alarmStore", {
    state: () => ({
        offset: 24,
        alarms: [],
    }),
    getters: {
        getAlarms: (state) => {
            return state.alarms
        }
    },
    actions: {
        setOffset(offset) {
            this.offset = offset
        },
        async fetchAlarms(obj) {
            try {
                let start = new Date()
                let end = new Date()
                start.setHours(start.getHours() - this.offset)

                const params = new URLSearchParams();
                params.append("collection", obj.database)
                params.append("nodeName", obj.alarmTag)
                params.append("start", start.toISOString())
                params.append("end", end.toISOString())
                params.append("orderBy", "desc")

                let res = await axios.get(`${obj.url}/duration`, { params })
                this.alarms = []
                if (!res.data) {
                    return
                }

                let filteredData = res.data.filter((entry) => {
                    return entry.value > 0
                })

                filteredData = filteredData.slice(0, 5)

                for (let el of filteredData) {
                    let aDesc = await this.fetchAlarmDescription(obj.url, obj.line, obj.machine, el.value)
                    if (aDesc){
                        el.text = aDesc.name
                    }else{
                        el.text ="Unbekannt"
                    }
                   
                    el.duration = el.duration / 60
                    el.start = new Date(el.start).toLocaleString()
                    el.end = new Date(el.end).toLocaleString()
                    this.alarms.push(el)
                }

            } catch (err) {
                console.log(err)
            }
        },
        async fetchAlarmDescription(url, line, mId, aId) {
            try {

                let params = new URLSearchParams()
                params.append("line", line)
                params.append("machineId", mId)
                params.append("alarmId", aId)

                let res = await axios.get(`${url}/config/alarm`, { params })

                return res.data
            }
            catch (err) {

                console.log(err)

            }
        },
    }
})