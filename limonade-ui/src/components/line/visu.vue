<script setup>
import { ref, watch, onMounted, reactive } from "vue"
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useLineDataStore } from "@/stores/line/lineData"


import Timeline from 'primevue/timeline';
import ProgressSpinner from 'primevue/progressspinner';

const store = useLineDataStore()
const router = useRouter();

const { getAlarms, getStates } = storeToRefs(store)
const line = router.currentRoute.value.fullPath.replace("/", "")

let state = reactive({
    alarms: [],
    states: []
})


function switchRoute(name) {
    router.push(router.currentRoute.value.fullPath + "/" + name)
}

function getAlarmName(id, mid) {
    if (state.alarms.length > 0) {
        return state.alarms.filter(a => a.id == id && a.mid == mid).length > 0 ? state.alarms.filter(a => a.id == id && a.mid == mid)[0].name : ""

    } else {
        return "🔜"
    }
}

function getStateName(id, mid) {
    if (state.states.length > 0) {
        return state.states.filter(a => a.id == id && a.mid == mid).length > 0 ? state.states.filter(a => a.id == id && a.mid == mid)[0].name : ""

    } else {
        return "🔜"
    }
}

function getStateColor(id, mid) {

    let s = state.states.filter(a => a.id === id && a.mid === mid)

    if (s.length < 1) {
        return 'var(--schema-neutral)'
    }

    switch (s[0].schema) {
        case 'critical':
            return 'var(--schema-critical)'
        case 'bad':
            return 'var(--schema-bad)'
        case 'good':
            return 'var(--schema-good)'
        default:
            return 'var(--schema-neutral)'
    }

}


watch(getAlarms, (nState) => {
    nState.forEach(async (el, idx) => {
        if (el.aid > 0) {

            let aRes = await store.fetchAlarmDescription(line, el.mid, el.aid)
            if (!aRes) {

                let unknown = { id: el.aid, name: "Unknown", mid: el.mid }
                state.alarms[idx] = unknown
            } else {
                aRes.mid = el.mid
                state.alarms[idx] = aRes
            }
        }
    })
})

watch(getStates, (nState, oState) => {
    nState.forEach(async (el, idx) => {
        if (oState.some(e => e.sid == el.sid && e.mid == el.mid)) {
            return
        }
        let sRes = await store.fetchStateDescription(line, el.mid, el.sid)
        if (!sRes) {

            let unknown = { id: el.aid, name: "Unknown", mid: el.mid }
            state.states[idx] = unknown
        } else {
            sRes.mid = el.mid
            state.states[idx] = sRes
        }

    })
})




</script>

<template>
    <section class="line-visu">
        <h2>Linien Visualisierung</h2>
        <div class="timeline-container">
            <Timeline :value="store.getMachines" layout="horizontal">
                <template #marker="slotProps">
                    <div class="machine-container" @click="switchRoute(slotProps.item.id)">
                        <p class="machine-state"><span class="status-num"
                                :style="{ 'backgroundColor': getStateColor(slotProps.item.state, slotProps.item.id) }">{{
                                    slotProps.item.state }}</span><span class="status-string">{{
                                        getStateName(slotProps.item.state, slotProps.item.id) }}</span></p>
                        <div class="image-container">
                            <img src="../../assets/packing-machine-svgrepo-com.svg">
                            <!-- <img :src="slotProps.item.img"> -->
                        </div>
                        <p class="machine-name">{{ slotProps.item.name }}</p>
                    </div>
                </template>
                <template #content="slotProps">
                    <div class="alarm" v-if="slotProps.item.alarm > 0">
                        <div class="alarm-num">
                            <i class="bi bi-exclamation-diamond"></i>
                            <p>{{ slotProps.item.alarm }}</p>
                        </div>
                        <p>{{ getAlarmName(slotProps.item.alarm, slotProps.item.id) }}</p>
                    </div>
                </template>
            </Timeline>
        </div>
    </section>
</template>

<style>
.line-visu {
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: var(--font-color-1);
    border-radius: 4px;
    margin: 0 0px 0 5px;
}

.timeline-container {
    padding: 0px 10px;
}

.p-timeline-event-connector {
    height: 5px !important;
}

.p-timeline-event-opposite {
    flex: 0 !important;
    padding: 2px !important;
}

.p-timeline-event-content {
    padding-top: 10px !important;
}

.image-container {
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-container img {
    width: 95%;
    height: 95%;
}

.machine-container {
    cursor: pointer;
    min-width: 13vw;
    border-radius: 2px;
    height: 15vh;
    padding: 0;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.machine-name {
    padding: 5px;
    border-top: 1px solid var(--border-color-1);
    margin-top: auto;
    height: 15%;
    color: var(--theme-color-2);
    font-weight: bolder;
    text-align: center;

}


.machine-state {
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    margin: 0;
    display: flex;
    height: 27%;

}

.machine-state>span {
    padding: 3%;
}

.status-num {
    font-weight: bold;
    text-align: center;
    color: var(--font-color-1);
}

.alarm {
    display: flex;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    width: 13vw;
    animation-name: example;
    animation-duration: 2s;
    max-height: 7vh;
    overflow-x: hidden;
    overflow-y: auto;

}

@keyframes example {
    from {
        box-shadow: 1px 1px 5px 3px crimson;
    }

    to {
        box-shadow: 1px 1px 3px 1px rgb(255, 179, 211);
    }
}

.alarm>p {
    padding: 2px;
    margin: 0
}

.alarm-num {
    background: crimson;
    color: white;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    justify-content: stretch;
}

.alarm-num>p {
    margin: 0;
}

.alarm-num>i {
    font-size: 20px;
}
</style>