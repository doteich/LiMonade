<script setup>
import { useDynamicDataStore } from '@/stores/machine/dynamicStore'
import stateChart from "./subcomponents/stateChart.vue"
import alarmBox from "./subcomponents/alarmBox.vue"
import stateBox from "./subcomponents/stateBox.vue"
import { computed } from "vue"

const dynamicStore = useDynamicDataStore()

const machineState = computed(() => {

    let mappingObj = {
        state: dynamicStore.getState[0].value,
        color: "green",
        text: "PROD"
    }

    switch (dynamicStore.getState[0].value) {
        case 0:
            mappingObj.color = "rgba(23, 194, 247, 0.692)";
            mappingObj.text = "Idle"
            break;
        case 1:
            mappingObj.color = "rgba(238, 31, 83, 0.7)";
            mappingObj.text = "Error"
            break;
        case 2:
            mappingObj.color = "rgba(252, 164, 0, 0.8)";
            mappingObj.text = "Alarm"
            break;
        case 3:
            mappingObj.color = "rgba(22,150, 103, 0.7)";
            mappingObj.text = "Productive"
            break;
        default:
            break;
    }

    return mappingObj
})


</script>
<template>
    <section class="machine-box">
        <h2>Status & Availibility </h2>
        <div class="state-box">
            <stateBox :state="machineState.state" :color="machineState.color" :text="machineState.text"></stateBox>
            <alarmBox :code="dynamicStore.getAlarm[0].value" text="ALARMTEXT"></alarmBox>
        </div>
        <stateChart></stateChart>
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
    height: 10%;
}

.machine-layout {
    height: 50%;
    display: flex;
    justify-content: center;
}

.machine-layout > img{
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
</style>