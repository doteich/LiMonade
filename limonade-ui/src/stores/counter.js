import { defineStore } from 'pinia'

const url = "ws://localhost:8080/"
var socket

export const useCounterStore = defineStore('counter', {
    state: () => ({

        counters: [{
                nodeId: "ns=2;s=Machines.Packaging.Counters.Bags",
                name: "Bags",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Labels",
                name: "Labels",
                value: 0
            },
            {
                nodeId: "ns=2;s=Machines.Packaging.Counters.Trays",
                name: "Trays",
                value: 0
            }
        ],

    }),
    getters: {
        getCounters: (state) => state.counters

    },
    actions: {
        startWS() {

            socket = new WebSocket(`${url}ws`)

            socket.addEventListener('open', () => {
                let payload = JSON.stringify({
                    "operation": "bulk_read"
                })

                socket.send(payload)
                console.log("Connection established to ws")
            })



            socket.addEventListener('message', (event) => {

                let json = JSON.parse(event.data)

                let counter = this.counters.find((el) =>
                    el.nodeId == json.nodeid
                )
                if (counter) {
                    counter.value = json.value
                }

            })


        },
    },
})