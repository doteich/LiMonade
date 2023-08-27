import { defineStore } from 'pinia'
import axios from "axios"


const sockets = []
const intervals = []

export const useLineDataStore = defineStore("lineData", {
    state: () => (
        {
            restURL: "http://localhost:3000",
            refreshInterval: 60,
            name: "",
            id: "",
            lineDefinition: [],

        }),
    getters: {
        getMachines(state) {
            let machines = []
            for (let group of state.lineDefinition) {
                for (let machine of group.machines) {

                    if (machine.altRouting) {
                        let evalNode = group.staticData.find(el => el.nodeName == machine.routing.node).value

                        switch (machine.routing.expr) {
                            case "isTrue":
                                if (evalNode) {
                                    machine.state = group.dynamicData.filter(el => el.name == machine.stateNode)[0].value
                                    machine.alarm = group.dynamicData.filter(el => el.name == machine.alarmNode)[0].value
                                    machines.push(machine)
                                }
                                break


                            case "isFalse":
                                if (!evalNode) {
                                    machine.state = group.dynamicData.filter(el => el.name == machine.stateNode)[0].value
                                    machine.alarm = group.dynamicData.filter(el => el.name == machine.alarmNode)[0].value
                                    machines.push(machine)
                                }
                                break
                        }
                    } else {
                        machine.state = group.dynamicData.filter(el => el.name == machine.stateNode)[0].value
                        machine.alarm = group.dynamicData.filter(el => el.name == machine.alarmNode)[0].value
                        machines.push(machine)
                    }

                }
            }
            return machines
        },
        getAlarms(state) {
            let alarms = []
            for (let group of state.lineDefinition) {
                for (let machine of group.machines) {
                    let alarm = {
                        mid: machine.id,
                        aid: group.dynamicData.filter(el => el.name == machine.alarmNode)[0].value,
                    }
                    alarms.push(alarm)
                }
            }
            return alarms
        },
        getStates(state) {
            let states = []
            for (let group of state.lineDefinition) {
                for (let machine of group.machines) {
                    let state = {
                        sid: group.dynamicData.filter(el => el.name == machine.stateNode)[0].value,
                        mid: machine.id,
                    }
                    states.push(state)
                }
            }
            return states
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
                let finish = ((target - count.value) / pace)
                let finishTS = new Date()
                finishTS.setMinutes(finishTS.getMinutes() + finish)

                finish = finish.toFixed(2)

                if (finish < 1) {
                    finish = "-"
                    finishTS = "-"
                }

                let obj = {
                    pace: pace.toFixed(2),
                    finish: finish,
                    finishTS: finishTS.toLocaleString(),
                    target,
                    count: count.value,
                    progress: ((Number(count.value) / Number(target)) * 100).toFixed(1),
                    type: config.chartType,
                    tsIdKey: config.tsIdKey,
                    counterIdKey: config.counterIdKey,
                    url: state.restURL,
                    lineid: state.id,
                    db: state.lineDefinition.find(g => group == g.name).database
                }

                return obj
            }
        },
        getLoadingState(state) {
            return (group) => state.lineDefinition.find(g => group == g.name).isLoaded
        },
        getLineName(state) {
            return state.name
        }


    },
    actions: {
        resetSockets() {
            sockets.forEach(socket => socket.close())
            intervals.forEach(iv => clearInterval(iv))

        },
        async fetchConfig(lineName) {
            try {
                let params = new URLSearchParams()
                params.append("configType", "line")
                params.append("lineId", lineName)
                let res = await axios.get(`${this.restURL}/config`, { params })
                this.lineDefinition = res.data.data
                this.name = res.data.displayName
                this.id = lineName
                this.startSockets()
                this.fetchStaticData()
                this.intervalHandler()

            } catch (err) {
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

                    }
                })
                sockets.push(socket)
            })
        },

        intervalHandler() {
            for (let int of intervals) {
                clearInterval(int)
            }

            let i = setInterval(() => {
                this.fetchStaticData()
            }, this.refreshInterval * 1000)
            intervals.push(i)
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
        async fetchAlarmDescription(line, mId, aId) {
            try {

                let params = new URLSearchParams()
                params.append("line", line)
                params.append("machineId", mId)
                params.append("alarmId", aId)

                let res = await axios.get(`${this.restURL}/config/alarm`, { params })

                //console.log(res.data)
                return res.data


            }
            catch (err) {

                console.log(err)

            }
        },
        async fetchStateDescription(line, mId, sId) {
            try {

                let params = new URLSearchParams()
                params.append("line", line)
                params.append("machineId", mId)
                params.append("stateId", sId)

                let res = await axios.get(`${this.restURL}/config/state`, { params })

                return res.data[0]

            }
            catch (err) {
                console.log(err)
            }
        },
        setRefreshInterval(value) {
            this.refreshInterval = value
            this.intervalHandler()
        }



    }
})