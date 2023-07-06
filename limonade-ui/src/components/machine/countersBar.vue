<script setup>
import { useCentralDataStore } from '@/stores/machine/centralDataStore'
import singleCounter from "./subcomponents/singleCounter.vue"
const store = useCentralDataStore()


</script>

<template>
    <section class="counters-bar">
        <h2>Dynamic Data</h2>
        <single-counter v-for="counter in store.getCounters" :key="counter.name" :name=counter.name
            :value=counter.value :unit="counter.unit"></single-counter>
    </section>
</template>

<style scoped>
.counters-bar{
    padding: 1%;
    width: 100%;
    background: var(--font-color-1);
    border-radius: 4px;
}
</style>