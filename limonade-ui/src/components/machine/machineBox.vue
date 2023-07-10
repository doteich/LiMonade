<script setup>
import { useCentralDataStore } from '@/stores/machine/centralDataStore'
import ProgressSpinner from 'primevue/progressspinner';
import stateChart from "./subcomponents/stateChart.vue"
import alarmBox from "./subcomponents/alarmBox.vue"
import stateBox from "./subcomponents/stateBox.vue"
import productivityCockpitChart from "../machine/subcomponents/productivityCockpitChart.vue"

import { computed } from "vue"

const store = useCentralDataStore()

const machineState = computed(() => {

    let mappingObj = {
        state: store.getState[0].value,
        color: "green",
        text: "PROD"

    }
    return mappingObj
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
                <alarmBox :code="store.getAlarm[0].value" text="ALARMTEXT"></alarmBox>
            </div>
            <stateChart></stateChart>
            <div class="indicators">
                <productivityCockpitChart></productivityCockpitChart>
            </div>
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

.indicators {
    padding: 1%;
}
</style>