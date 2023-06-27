import { defineStore } from 'pinia'
import axios from "axios"


const sockets = []

export const useLineDataStore = defineStore("lineData", {
    state: () => (
        {
        restURL: "http://localhost:3000",
        lineDefinition:[],
        backup: [{
            name: "Packaging",
            socket: "ws://localhost:8080/ws",
            database: "lms_packaging",
            isLoaded: false,
            machines: [{
                name: "Machine 1",
                stateNode: "State",
                state: 0,
                alarmNode: "Alarm",
                alarm: 0,
            },
            {
                name: "Machine 2",
                stateNode: "State_Machine2",
                state: 0,
                alarmNode: "Alarm_Machine2",
                alarm: 0,
            },
            ],
            dynamicData: [{
                nodeId: "ns=2;s=Machines.Packaging.State.Alarm",
                name: "Alarm",
                unit: "",
                type: "alarm",
                value: 0,
                show: false
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.State.Alarm_Machine2",
                name: "Alarm_Machine2",
                unit: "",
                type: "alarm",
                value: 0,
                show: false,
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.State.State_Machine2",
                name: "State_Machine2",
                unit: "",
                type: "state",
                value: 0,
                show: false,
            }, {
                nodeId: "ns=2;s=Machines.Packaging.State.State",
                name: "State",
                unit: "",
                type: "state",
                value: 0,
                show: false
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Bags",
                name: "Bags",
                unit: "",
                type: "counter",
                value: 0,
                show: true
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Trays",
                name: "Trays",
                unit: "",
                type: "counter",
                value: 0,
                show: true
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Labels",
                name: "Labels",
                unit: "",
                type: "counter",
                value: 0,
                show: true
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorAmps",
                name: "Motor Amps",
                unit: "A",
                type: "counter",
                value: 0,
                show: true
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorVoltage",
                name: "Motor Voltage",
                unit: "V",
                type: "counter",
                value: 0,
                show: true
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.MachineData.MotorTemperature",
                name: "Motor Temperature",
                unit: "°C",
                type: "counter",
                value: 0,
                show: true
            },


            ],
            staticData: [{

                displayName: "Current Order",
                nodeName: "Order",
                value: "",
                timestamp: "",
                showTS: true,

            },
            {

                displayName: "Target Quantity",
                nodeName: "Target Quantity",
                value: "",
                timestamp: "",
                showTS: true,

            },
            {

                displayName: "Bags",
                nodeName: "Bags",
                value: "",
                timestamp: "",
                showTS: true,

            },
            ],
            progressConfig: {
                tsIdKey: "Order",
                counterIdKey: "Bags",
                targetIdKey: "Target Quantity"
            }
        },
        {
            name: "Palettizing",
            socket: "ws://localhost:8081/ws",
            database: "lms_palettierung",
            isLoaded: false,
            machines: [{
                name: "Machine 1",
                stateNode: "State",
                state: 0,
                alarmNode: "Alarm",
                alarm: 0,
            },],
            dynamicData: [{
                nodeId: "ns=2;s=Machines.Palettierung.State.Alarm",
                name: "Alarm",
                unit: "",
                type: "alarm",
                value: 0,
                show: false,
            },
            {
                nodeId: "ns=2;s=Machines.Palettierung.State.State",
                name: "State",
                unit: "pcs",
                type: "state",
                value: 0,
                show: false
            },
            {
                nodeId: "ns=2;s=Machines.Palettierung.Counters.HU",
                name: "HUs",
                unit: "pcs",
                type: "counter",
                value: 0,
                show: true
            },
            {
                nodeId: "ns=2;s=Machines.Palettierung.Counters.Packages",
                name: "Packages",
                unit: "pcs",
                type: "counter",
                value: 0,
                show: true
            },
            ],
            staticData: [{

                displayName: "Current Order",
                nodeName: "Order",
                value: "",
                timestamp: "",
                showTS: true,

            },
            {

                displayName: "Packages",
                nodeName: "Packages",
                value: "",
                timestamp: "",
                showTS: true,

            },
            {

                displayName: "Target Quantity",
                nodeName: "Target Quantity",
                value: "",
                timestamp: "",
                showTS: true,

            },
            ],
            progressConfig: {
                tsIdKey: "Order",
                counterIdKey: "Packages",
                targetIdKey: "Target Quantity"
            }

        },


        ]
    }),
    getters: {
        getMachines(state) {
            let machines = []
            for (let group of state.lineDefinition) {
                for (let machine of group.machines) {
                 
                    machine.state = group.dynamicData.filter(el => el.name == machine.stateNode)[0].value
                    machine.alarm = group.dynamicData.filter(el => el.name == machine.alarmNode)[0].value
                    machines.push(machine)
                }
            }
            return machines
        },
        getMachineAreas(state) {
            let arr = []
            for (let group of state.lineDefinition) {
                arr.push(group.machines.length)
            }
            let sum = arr.reduce((accum, curVal) => accum + curVal, 0)
            let ratArr = []
            arr.forEach((num, index) => {

                ratArr.push({
                    name: state.lineDefinition[index].name,
                    ratio: num / sum
                })

            })
            return ratArr
        },
        getDynamicData(state) {
            return (group) => state.lineDefinition.find((g) => group === g.name).dynamicData.filter(el => el.show)
        },
        getStaticData(state) {
            return (group) => {
                return state.lineDefinition.find(g => group == g.name).staticData.filter(obj => obj.show)

                }
        },
        getProgressData(state) {
            return (group) => {
                let config = state.lineDefinition.find(g => group == g.name).progressConfig
                let data = state.lineDefinition.find(g => group == g.name).staticData


                let ts = data.find(obj => obj.nodeName == config.tsIdKey).timestamp
                let count = data.find(obj => obj.nodeName == config.counterIdKey)
                let target = data.find(obj => obj.nodeName == config.targetIdKey).value

                let timeDiff = (count.timestamp - ts) / (1000 * 60)
                let pace = (count.value / timeDiff)
                let finish = ((target / pace))
                let finishTS = new Date()
                finishTS.setMinutes(finishTS.getMinutes() + finish)

 

                let obj = {
                    pace: pace.toFixed(2),
                    finish: finish.toFixed(2),
                    finishTS: finishTS.toLocaleString(),
                    target, 
                    count: count.value,
                    progress: ((Number(count.value)/Number(target))*100).toFixed(1)
                }

                return obj
            }
        },
        getLoadingState(state) {
            return (group) => state.lineDefinition.find(g => group == g.name).isLoaded
        }


    },
    actions: {



        async fetchConfig(lineName){
            try{
                let params = new URLSearchParams()
                params.append("configType", "line")
                params.append("name", lineName)
                let res = await axios.get(`${this.restURL}/config`,{params})
                this.lineDefinition = res.data
                this.startSockets()
                this.fetchStaticData()

            }catch(err){
                console.log(err)
            }
        }, 
        

        startSockets() {

            this.lineDefinition.forEach((group, idx) => {
                let socket
                socket = new WebSocket(group.socket)
                socket.addEventListener('open', () => {
                    console.log("Socket opened for machine group: " + idx)
                    let payload = {
                        "operation": "bulk_read"
                    }
                    socket.send(JSON.stringify(payload))

                })
                socket.addEventListener("message", (event) => {
                    let json = JSON.parse(event.data)


                    let tag = this.lineDefinition[idx].dynamicData.find((el) =>
                        el.nodeId == json.nodeid
                    )
                    if (tag) {
                    
                        tag.value = json.value

                        if (tag.type == "alarm" && json.value > 0){
                            this.setAlarmFromWS(idx,tag.name)
                        }


                    }


                })
                sockets.push(socket)
            })
        },

        async setAlarmFromWS(idx, name){
            let aDesc = await this.fetchAlarmDescription("line1", "m1", 1000)
            let tag = this.lineDefinition[idx]
            console.log(tag)
        },

        fetchStaticData() {

            this.lineDefinition.forEach((line) => {
                line.staticData.forEach(async (node, index, source) => {

                    if (index === source.length - 1) {
                        let finish = await this.fetchNodeData(line.name, line.database, node.nodeName, true)
                        line.isLoaded = finish
                    } else {
                        this.fetchNodeData(line.name, line.database, node.nodeName, false)

                    }
                })
            })


        },

        async fetchNodeData(group, db, node, isLast) {
            try {
                let params = new URLSearchParams()
                params.append("nodeName", node)
                params.append("collection", db)
                let res = await axios.get(`${this.restURL}/last`, { params })
                let el = this.lineDefinition.find(line => line.name == group).staticData.find(obj => obj.nodeName === node)
                el.value = res.data[0].Value
                el.timestamp = new Date(res.data[0].ts)
                if (isLast) {
                    return true
                } else {
                    return false
                }
            } catch (err) {
                console.log(err)
            }
        },
        async fetchAlarmDescription(line, mId, aId){
            try{

            
            let params = new URLSearchParams()
            params.append("line", line)
            params.append("machineId", mId)
            params.append("alarmId", aId)

            let res = await axios.get(`${this.restURL}/config/alarm`, { params })
            
            console.log(res.data)
            return res.data

            
            }
            catch(err){
                console.log(err)
            }
        }
    }
})