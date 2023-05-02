<script setup>
import { onMounted } from "vue"

import { useDynamicDataStore } from '@/stores/machine/dynamicStore'

const store = useDynamicDataStore()
import countersBar from "../components/machine/countersBar.vue"
import miscBox from "../components/machine/miscBox.vue"
import machineBox from "../components/machine/machineBox.vue"
import alarmBar from "../components/machine/alarmBar.vue"


onMounted(() => {
    store.startWS()
})

</script>

<template>
    <article class="main-view">
        <alarmBar class="alarms"></alarmBar>
        <machineBox class="machine"></machineBox>
        <miscBox class="misc"></miscBox>
        <countersBar class="counters"></countersBar>
    </article>
</template>

<style scoped>
.main-view {
    display: grid;
    height: 94.5vh;
    min-width: 100%;
    grid-template-areas:
        "alarms machine counters"
        "custom custom custom";
    grid-template-rows: 60% 40%;
    grid-template-columns: 25% 50% 25%;
}

.main-view>.counters {
    grid-area: counters;
}

.main-view>.misc {
    grid-area: custom;
}

.main-view>.machine {
    grid-area: machine;
}

.main-view > .alarms{
    grid-area: alarms;
}
</style>