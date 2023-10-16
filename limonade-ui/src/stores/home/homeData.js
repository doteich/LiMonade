import { defineStore } from "pinia"
import axios from "axios"

const restURL = "http://localhost:3000"

export const useHomeDataStore = defineStore("homeDataStore", {
    state: () => ({
        homeData: [],
        ival: "",
    }),
    getters: {
        getHomeData(state) {
            return state.homeData
        }

    },
    actions: {
        clearStore() {
            clearInterval(this.ival)
        },
        async fetchHomeData() {
            try {
                let params = new URLSearchParams()
                params.append("configType", "main")
                let res = await axios.get(`${restURL}/config`, { params })
                this.homeData = res.data.lines
                this.fetchAll()
                this.ival = setInterval(() => {
                    this.fetchAll()
                }, 60000)
            }
            catch (err) {
                console.error(err)
            }
        },
        fetchAll() {
            this.homeData.forEach((line, idx) => {
                line.data.forEach((tag, tidx) => {
                    this.fetchMetaData(tag.database, tag.nodeName, idx, tidx)
                })
                line.machines.forEach((m, tidx) => {
                    this.fetchStateData(line.id, m.database, m.id, m.stateNode, idx, tidx)
                })
                if (line.progress.enabled){
                    this.fetchProgressData(line.progress.database, line.progress.target, idx, "target")
                    this.fetchProgressData(line.progress.database, line.progress.actual, idx, "actual")
                }
            })
        },
        async fetchMetaData(db, node, lineIndex, tagIndex) {
            try {
                let params = new URLSearchParams()
                params.append("nodeName", node)
                params.append("collection", db)
                let res = await axios.get(`${restURL}/last`, { params })
                this.homeData[lineIndex].data[tagIndex].value = res.data[0].Value
            } catch (err) {
                console.error(err)
            }
        },
        async fetchProgressData(db, node, lineIndex, key) {
            try {
                let params = new URLSearchParams()
                params.append("collection", db)
                params.append("nodeName", node)
                let res = await axios.get(`${restURL}/last`, { params })
                this.homeData[lineIndex].progress[key + "_value"] = res.data[0].Value
                console.log(this.homeData[lineIndex])

            }
            catch (err) {
                console.error(err)
            }
        },
        async fetchStateData(line, db, mId, node, lineIndex, tagIndex) {
            try {
                let params = new URLSearchParams()
                params.append("nodeName", node)
                params.append("collection", db)
                params.append("distinct", false)
                let state = await axios.get(`${restURL}/last`, { params })

                params = new URLSearchParams()
                params.append("line", line)
                params.append("machineId", mId)
                params.append("stateId", state.data[0].Value)
                let res = await axios.get(`${restURL}/config/state`, { params })

                let color = "var(--schema-neutral)"

                switch (res.data[0].schema) {
                    case 'critical':
                        color = 'var(--schema-critical)'
                        break
                    case 'bad':
                        color = 'var(--schema-bad)'
                        break
                    case 'good':
                        color = 'var(--schema-good)'
                        break
                    default:
                        color = 'var(--schema-neutral)'
                        break
                }



                this.homeData[lineIndex].machines[tagIndex].value = state.data[0].Value
                this.homeData[lineIndex].machines[tagIndex].schema = res.data[0].schema
                this.homeData[lineIndex].machines[tagIndex].color = color


            }
            catch (err) {
                console.error(err)
            }
        }
    }


})


// this.lineDefinition.forEach((line) => {
//     line.staticData.forEach(async (node, index, source) => {

//         if (index === source.length - 1) {
//             let finish = await this.fetchNodeData(line.name, line.database, node.nodeName, true)
//             line.isLoaded = finish
//         } else {
//             this.fetchNodeData(line.name, line.database, node.nodeName, false)

//         }
//     })
// })



