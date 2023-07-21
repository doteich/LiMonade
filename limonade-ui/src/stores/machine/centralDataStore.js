import { defineStore } from 'pinia'
import axios from "axios"
import { useAlarmStore } from './alarmStore'
import { useMachineDataStore } from "./machineData"
import { useMiscStore } from "./miscStore"

export const useCentralDataStore = defineStore("centralDataStore", {
    state: () => ({
        isLoaded: false,
        line: "",
        machine: "",
        restURL: "http://localhost:3000",
        refreshInterval: 60,
        machineDefinition: {
            name: "",
            database: "",
            socket: "",
            stateNode: "",
            alarmNode: "",
            dynamicData: [],
            staticData: []
        }
    }),
    getters: {
        getLoadingState(state) {
            return state.isLoaded
        },
        getMachineName(state) {
            return state.machineDefinition.name
        },
        getConfigVars(state) {
            return {
                line: state.line,
                machine: state.machine,
                restURL: state.restURL,
                refreshInterval: state.refreshInterval,
                database: state.machineDefinition.database
            }
        },
        getCounters: (state) => {
            let counters = state.machineDefinition.dynamicData.filter((el) => el.show)
            return counters
        },
        getState: (state) => {
            let status = state.machineDefinition.dynamicData.filter((el) => el.name == state.machineDefinition.stateNode)
            if (status.length > 0){
                return status[0].value
            }
            return []
        },
        getAlarm: (state) => {
            let alarm = state.machineDefinition.dynamicData.filter((el) => el.name == state.machineDefinition.alarmNode)
            return alarm
        },
        getStaticData(state) {
            let staticData = state.machineDefinition.staticData.filter(el => el.show)
            return staticData
        },

    },
    actions: {
        async fetchMachineConfig(line, machine) {
            try {
                this.machine = machine
                this.line = line

                let params = new URLSearchParams()
                params.append("configType", "machine")
                params.append("lineId", line)
                params.append("machineId", machine)
                let res = await axios.get(`${this.restURL}/config`, { params })
                this.machineDefinition = res.data
                this.startSockets()
                this.updateStaticData()
                this.updateAlarms()
                this.updateStates()

                this.isLoaded = true
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

        },
        updateStaticData() {
            for (let obj of this.machineDefinition.staticData) {
                this.fetchNodeData(obj.nodeName)
            }
        },

        async fetchNodeData(node) {
            try {


                let params = new URLSearchParams()
                params.append("collection", this.machineDefinition.database)
                params.append("nodeName", node)
                let res = await axios.get(`${this.restURL}/last`, { params })
                let el = this.machineDefinition.staticData.filter((obj) => obj.nodeName == node)
                el[0].value = res.data[0].Value
                el[0].timestamp = new Date(res.data[0].ts)

            } catch (err) {
                console.log(err)
            }
        },
        updateAlarms() {

            const alarmStore = useAlarmStore()
            let params = {
                alarmTag: this.machineDefinition.alarmNode,
                url: this.restURL,
                database: this.machineDefinition.database,
                line: this.line,
                machine: this.machine
            }
            alarmStore.fetchAlarms(params)
        },
        updateStates() {
            const machineStore = useMachineDataStore()
            machineStore.initDataSet(this.restURL, this.line, this.machine)
            machineStore.fetchMachineData(this.restURL, this.machineDefinition.database, this.machineDefinition.stateNode)


        },
        fetchChartData(node, start, end) {
            const miscStore = useMiscStore()
            miscStore.fetchChartData(this.restURL, this.machineDefinition.database, node, start, end)

        },
        resetAttachedStores() {

            useAlarmStore().$reset()
            useMachineDataStore().$reset()
            useMiscStore().$reset()

        },
        async fetchStateDescription(state){
            try {

                let params = new URLSearchParams()
                params.append("line", this.line)
                params.append("machineId", this.machine)
                params.append("stateId", state)

                let res = await axios.get(`${this.restURL}/config/state`, { params })

                return res.data[0]

            }
            catch (err) {
                console.log(err)
            }
        }

    }

})
