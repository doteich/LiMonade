import { defineStore } from 'pinia'
import axios from "axios"


const sockets = []

export const useLineDataStore = defineStore("lineData", {
    state: () => ({
        restURL: "http://localhost:3000",
        lineDefinition: [{
                name: "Packaging",
                socket: "ws://localhost:8080/ws",
                database: "lms_packaging",
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

                        displayName: "Current Order",
                        nodeName: "Trays",
                        value: "",
                        timestamp: "",
                        showTS: true,

                    },
                    {

                        displayName: "Current Order",
                        nodeName: "Labels",
                        value: "",
                        timestamp: "",
                        showTS: true,

                    }
                ]
            },
            {
                name: "Palettizing",
                socket: "ws://localhost:8081/ws",
                database: "lms_palettierung",
                machines: [{
                    name: "Machine 1",
                    stateNode: "State",
                    state: 0,
                    alarmNode: "Alarm",
                    alarm: 0,
                }, ],
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

                        displayName: "Current Order",
                        nodeName: "Material",
                        value: "",
                        timestamp: "",
                        showTS: true,

                    },
                    {

                        displayName: "Current Order",
                        nodeName: "Recipe",
                        value: "",
                        timestamp: "",
                        showTS: true,

                    },
                ]
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
            return (group) => state.lineDefinition.find(g => group == g.name).staticData
        }

    },
    actions: {
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
                    }


                })
                sockets.push(socket)
            })
        },
        fetchStaticData() {

            this.lineDefinition.forEach((line) => {
                line.staticData.forEach(node => this.fetchNodeData(line.name, line.database, node.nodeName))
            })
        },


        async fetchNodeData(group, db, node) {
            try {
                let params = new URLSearchParams()
                params.append("nodeName", node)
                params.append("collection", db)
                let res = await axios.get(`${this.restURL}/last`, { params })
                let el = this.lineDefinition.find(line => line.name == group).staticData.find(obj => obj.nodeName === node)
                el.value = res.data[0].Value
                el.timestamp = new Date(res.data[0].ts)
            } catch (err) {
                console.log(err)
            }
        }
    }
})