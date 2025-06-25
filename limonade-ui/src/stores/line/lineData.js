import { defineStore } from 'pinia'
import axios from "axios"


const sockets = []
const intervals = []
const restURL = config()


export const useLineDataStore = defineStore("lineData", {
    state: () => (
        {
            restURL: restURL,
            refreshInterval: 60,
            name: "",
            id: "",
            complexLayout: false,
            simpleLayout: false,
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
        getSimpleLayout(state){
            return state.simpleLayout
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
                if (group.show) {
                    if (state.complexLayout) {
                        let x = group.machines.map(m => m.lvl).filter((v, i, a) => {
                            return a.indexOf(v) == i
                        })
                        arr.push(x.length)
                    } else {
                        arr.push(group.machines.length)
                    }
                }

            }
            let sum = arr.reduce((accum, curVal) => accum + curVal, 0)
            let ratArr = []
            arr.forEach((num, index) => {

                ratArr.push({
                    name: state.lineDefinition[index].name,
                    db: state.lineDefinition[index].database,
                    paceCounter: state.lineDefinition[index].progressConfig.counterIdKey,
                    unit: state.lineDefinition[index].progressConfig.unitTag,
                    ratio: num / sum
                })

            })
            return ratArr
        },
        getDynamicData(state) {
            return (group) => {

                let data = state.lineDefinition.find((g) => group === g.name).dynamicData

                let toEval = data.filter(n => n.type == "ratio")

                if (toEval || toEval.length > 0) {
                    let dd
                    let dv
                    toEval.forEach(obj => {
                        dd = data.find(n => n.name == obj.ratioConf.dd)
                        dv = data.find(n => n.name == obj.ratioConf.dv)

                        if (dd.value && dv.value && dd.value > 0 && dv.value > 0) {
                            obj.value = (Number(dd.value) / Number(dv.value)) * 100
                        } else {
                            obj.value = 0
                        }

                    })
                }
                return data.filter(el => el.show)
                //return state.lineDefinition.find((g) => group === g.name).dynamicData.filter(el => el.show)
            }

        },
        getStaticData(state) {
            return (group) => {
                let data = state.lineDefinition.find(g => group == g.name).staticData.filter(obj => obj.show)
                data.forEach(el => {
                    if (el.shiftDelta) {
                        el.label = "S"
                    } else {
                        el.label = "L"
                    }
                })
                return data

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

                let pace = (count?.value / timeDiff)
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
                    count: count?.value,
                    progress: ((Number(count.value) / Number(target)) * 100).toFixed(1),
                    type: config.chartType,
                    tsIdKey: config.tsIdKey,
                    counterIdKey: config.counterIdKey,
                    unit: config.unit,
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
                res.data.complexLayout ? this.complexLayout = res.data.complexLayout : ""
                res.data.simpleLayout ? this.simpleLayout = res.data.simpleLayout : false
                this.id = lineName

                this.startSockets()
                this.fetchStaticData()
                this.intervalHandler()

            } catch (err) {
                console.error(err)
            }
        },
        startSockets() {

            this.lineDefinition.forEach((group, idx) => {
                let socket
                socket = new WebSocket(group.socket)

                socket.addEventListener('open', () => {
                    console.info("Socket opened for machine group: " + idx)
                    let payload = {
                        "operation": "bulk_read"
                    }


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

                    if (node.shiftDelta) {
                        this.staticShiftDelta(line.name, line.database, node.nodeName)

                    } else {
                        this.fetchNodeData(line.name, line.database, node.nodeName, node.distinct, false)
                    }

                    if (index === source.length - 1) {
                        line.isLoaded = true
                    }

                })
            })


        },

        async fetchNodeData(group, db, node, distinct, isLast) {
            try {
                let params = new URLSearchParams()
                params.append("nodeName", node)
                params.append("collection", db)
                params.append("distinct", distinct)
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
                console.error(err)
            }
        },
        async fetchAlarmDescription(line, mId, aId) {
            try {
                let params = new URLSearchParams()
                params.append("line", line)
                params.append("machineId", mId)
                params.append("alarmId", aId)

                let res = await axios.get(`${this.restURL}/config/alarm`, { params })

                return res.data
            }
            catch (err) {
                console.error(err)
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
                console.error(err)
            }
        },
        setRefreshInterval(value) {
            this.refreshInterval = value
            this.intervalHandler()
        },

        async setPace(group, tString) {


            let line = this.lineDefinition.find(g => group == g.name)

            if (tString == "h") {
                let end = new Date().toISOString()
                let start = new Date()
                start.setHours(start.getHours() - 1)
                start = start.toISOString()
                let delta = await this.fetchPaceData(start, end, 60, line.database, line.progressConfig.counterIdKey, "hour", "")

                return delta
            } else if (tString == "AT") {
                let data = line.staticData
                let ts = data.find(obj => obj.nodeName == line.progressConfig.tsIdKey).timestamp
                let count = data.find(obj => obj.nodeName == line.progressConfig.counterIdKey)
                let timeDiff = (count.timestamp - ts) / (1000 * 60)
                return (count.value / timeDiff).toFixed(2)
            } else {
                let end = new Date().toISOString()
                let start = new Date()
                start.setMinutes(start.getMinutes() - Number(tString))
                start = start.toISOString()
                let delta = await this.fetchPaceData(start, end, Number(tString), line.database, line.progressConfig.counterIdKey, "minute", "")
                return delta
            }


        },

        async fetchPaceData(start, end, tSpan, db, node, tCode, uCode) {
            try {

                const params = new URLSearchParams();
                params.append("collection", db)
                params.append("nodeName", node)
                params.append("start", start)
                params.append("end", end)
                params.append("unit", uCode)

                let res = await axios.get(`${this.restURL}/timeseries/delta`, { params })
                let delta

                tCode == "hour" ? delta = (res.data.delta / (tSpan / 60)).toFixed(2) : delta = (res.data.delta / tSpan).toFixed(2)
                return delta
            }

            catch (err) {
                throw err

            }

        },

        async staticShiftDelta(group, db, node) {
            try {
                const params = new URLSearchParams();
                params.append("collection", db)
                params.append("nodeName", node)
                params.append("shiftdelta", "true")

                let res = await axios.get(`${this.restURL}/timeseries/delta`, { params })
                let el = this.lineDefinition.find(line => line.name == group).staticData.find(obj => obj.nodeName === node)
                el.value = res.data.delta
            }
            catch (err) {
                console.error(err)
            }
        }



    }
})