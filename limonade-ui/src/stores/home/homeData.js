import { defineStore } from "pinia"
import axios from "axios"

const restURL = "http://localhost:3000"

export const useHomeDataStore = defineStore("homeDataStore", {
    state: () => ({
        homeData: []
    }),
    getters: {
        getHomeData(state) {
            return state.homeData
        }

    },
    actions: {
        async fetchHomeData() {
            try {
                let params = new URLSearchParams()
                params.append("configType", "main")
                let res = await axios.get(`${restURL}/config`, { params })
                this.homeData = res.data.lines
                this.fetchAll()
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
            })
        },
        async fetchMetaData(db, node, lineIndex, tagIndex) {
            let params = new URLSearchParams()
            params.append("nodeName", node)
            params.append("collection", db)
            let res = await axios.get(`${restURL}/last`, { params })
            this.homeData[lineIndex].data[tagIndex].value = res.data[0].Value
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



