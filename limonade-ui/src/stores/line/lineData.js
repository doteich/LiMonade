import { defineStore } from 'pinia'

export const useLineDataStore = defineStore("lineData", {
    state: () => ({
        lineDefinition: [{
                name: "group1",
                machines: [{
                        name: "Machine 1",
                        stateNode: "",
                        state: 0,
                        alarmNode: "",
                        alarm: 1012,
                    },
                    {
                        name: "Machine 2",
                        stateNode: "",
                        state: 0,
                        alarmNode: "",
                        alarm: 0,
                    },
                ]
            },
            {
                name: "group2",
                machines: [{
                    name: "Machine 1",
                    stateNode: "",
                    state: 0,
                    alarmNode: "",
                    alarm: 0,
                }, ]
            }


        ]
    }),
    getters: {
        getMachines(state) {
            let machines = []
            for (let group of state.lineDefinition) {
                for (let machine of group.machines) {
                    machines.push(machine)
                }
            }
            return machines
        }
    }
})