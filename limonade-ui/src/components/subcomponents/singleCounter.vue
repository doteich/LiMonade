<script setup>
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()


defineProps({
    name: String,
    value: Number,
    unit: String,
})

function fetchCounterData(name) {
    store.fetchChartData(name)
}

</script>

<template>
    <div class="counter">
        <h5>{{name }}</h5>
        <p>{{ parseFloat(value.toFixed(3)) }}</p>
        <p class="unit">{{ unit }}</p>
        <i class="bi bi-bar-chart-line-fill" @click="fetchCounterData(name)"></i>

    </div>
</template>

<style scoped>
.counter {
    display: flex;
    flex-direction: row;
    height: 4vmin;
    min-height: 40px;
    margin: 5px;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    justify-items: center;
    align-items: center;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);;
}

.counter h5 {
    margin: 10px;
   word-wrap: break-word;
    font-size: 15px;
    padding: 3px;
    width: 40%;
    border-bottom:1px solid var(--border-color-1);
}

.counter p {
    font-size: larger;
    align-self: center;
    font-size: 20px;
    color: var(--theme-color-2);
    width: 50%;
}

.unit{
    margin-left: auto;
    margin-right: 5% ;
    width: 10% !important;
    font-size: 15px !important;
}

.counter i{
    color: var(--theme-color-2);
    cursor: pointer;
    margin-left: auto;
    margin-right: 1%;
    border: 1px solid var(--border-color-1);
    padding: 4px;
    border-radius: 2px;
    width: 30px;

}

.counter i:hover{
    background-color: var(--theme-color-2);
    color: var(--font-color-1);
}
</style>