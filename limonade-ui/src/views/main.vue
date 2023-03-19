<script setup>
import { onMounted } from "vue"

import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
import countersBar from "../components/countersBar.vue"

onMounted(() => {
    store.startWS()
})

</script>

<template>
    <article class="main-view">
        <h1 style="grid-area:alarms">Alarms</h1>
        <h1 style="grid-area:machine">Machine Model</h1>
        <h1 style="grid-area:custom">MISC</h1>
        <countersBar class="counters"></countersBar>
    </article>
</template>

<style scoped>
.main-view {
    display: grid;
    min-height: 100%;
    grid-template-areas:
        "alarms machine counters"
        "custom custom custom";
    grid-template-rows: 80% 20%;
    grid-template-columns: 25% 50% 25%;
}

main-view>counters {
    grid-area: counters;
}
</style>