<script setup>
import { useCentralDataStore } from '@/stores/machine/centralDataStore'
import { useMachineDataStore } from '@/stores/machine/machineData'
import { ref, watch } from "vue"
import { storeToRefs } from 'pinia'
import ProgressSpinner from 'primevue/progressspinner';
import stateChart from "./subcomponents/stateChart.vue"
import alarmBox from "./subcomponents/alarmBox.vue"
import stateBox from "./subcomponents/stateBox.vue"
import paceOverview from './subcomponents/paceOverview.vue';




const store = useCentralDataStore()
const machineStore = useMachineDataStore()

const machineState = ref({
    state: 0,
    color: "var(--schema-neutral)",
    text: ""
})

const alarm = ref({
    id: 0,
    text: ""
})


const { getAlarm, getState } = storeToRefs(store)

watch(getState, async (newVal) => {
    try {

        let res = await store.fetchStateDescription(Number(newVal))
        let color = ""

        switch (res.schema) {
            case "good":
                color = "var(--schema-good)"
                break;
            case "bad":
                color = "var(--schema-bad)"
                break;
            case "critical":
                color = "var(--schema-critical)"
                break;
            default:
                color = "var(--schema-neutral)"
                break;
        }
        machineState.value = {
            state: Number(res.id),
            color,
            text: res.name
        }

        
    }
    catch (err) {
        console.error(err);
    }
})


watch(getAlarm, async (newVal) => {
    if (newVal > 0) {
        alarm.value = {
            id: newVal,
            text: "Unknown"
        }

        try {
            let res = await store.fetchAlarmDescription(newVal)
            if (res) {
                alarm.value = {
                    id: res.id,
                    text: res.name
                }
            }
        } catch (err) {
            console.error(err)

        }
    }

})



</script>
<template>
    <section class="machine-box">
        <h2>Status & Availibility </h2>
        <div v-if="!store.getLoadingState" class="spinner-machine">

            <ProgressSpinner></ProgressSpinner>
        </div>
        <div v-else>
            <div class="state-box">
                <stateBox :state="machineState.state" :color="machineState.color" :text="machineState.text"></stateBox>
                <alarmBox :code="alarm.id" :text="alarm.text"></alarmBox>
            </div>
            <div class="indicators">
                <paceOverview v-if="store.machineDefinition.hasPace" :unit="store.getPaceConfig.unit"
                    :pace="store.getPaceConfig.pace" :delta="store.getPaceConfig.delta"></paceOverview>
            </div>
            <stateChart v-if="machineStore.getFetchState"></stateChart>


        </div>
    </section>
</template>
<style scoped>
.machine-box {

    display: flex;
    flex-direction: column;
    padding: 5px;
    background: var(--font-color-1);
    border-radius: 4px;
    margin: 0 5px;
}

.state-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5vh;
    margin-bottom: 1vh;
}

.machine-layout {
    height: 50%;
    display: flex;
    justify-content: center;
}

.machine-layout>img {
    height: 100%;

}

.state-box>div {
    width: 50%;
    height: 100%;
    min-height: 40px;
    margin: 5px;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.indicators {}
</style>