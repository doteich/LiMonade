import { defineStore } from 'pinia'

const sockets = []

export const useLineDataStore = defineStore("lineData", {
    state: () => ({
        lineDefinition: [{
                name: "group1",
                socket: "ws://localhost:8080/ws",
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
                        value: 0
                    },
                    {
                        nodeId: "ns=2;s=Machines.Packaging.State.Alarm_Machine2",
                        name: "Alarm_Machine2",
                        unit: "",
                        type: "alarm",
                        value: 0
                    },
                    {
                        nodeId: "ns=2;s=Machines.Packaging.State.State_Machine2",
                        name: "State_Machine2",
                        unit: "",
                        type: "state",
                        value: 0
                    }, {
                        nodeId: "ns=2;s=Machines.Packaging.State.State",
                        name: "State",
                        unit: "",
                        type: "state",
                        value: 0
                    }


                ]
            },
            {
                name: "group2",
                socket: "ws://localhost:8081/ws",
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
                        value: 0
                    },
                    {
                        nodeId: "ns=2;s=Machines.Palletierung.State.State",
                        name: "State",
                        unit: "",
                        type: "state",
                        value: 0
                    }
                ]
            }


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
        }
    },
    actions: {
        startSockets() {
            let socket
            this.lineDefinition.forEach((group, idx) => {
                socket = new WebSocket(group.socket)
                socket.addEventListener('open', () => {
                    console.log("Websocket opened for group: " + group.name)

                })
                socket.addEventListener("message", (event) => {
                    let json = JSON.parse(event.data)


                    let tag = this.lineDefinition[idx].dynamicData.find((el) =>
                        el.nodeId == json.nodeid
                    )
                    console.log(tag)
                    if (tag) {
                        tag.value = json.value
                    }


                })
                sockets.push(socket)
            })
        }
    }
})