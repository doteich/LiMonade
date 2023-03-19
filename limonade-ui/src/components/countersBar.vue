<script setup>
import { useCounterStore } from '@/stores/counter'
import singleCounter from "./subcomponents/singleCounter.vue"
const store = useCounterStore()


</script>

<template>
    <div class="counters-bar">
        <h2>Counters</h2>
        <single-counter v-for="counter in store.getCounters" :key="counter.name" :name=counter.name
            :value=counter.value></single-counter>
    </div>
</template>

<style scoped>
.counters-bar{
    padding: 1%;
    width: 100%;
    background: white;
    border-radius: 4px;
}
</style>