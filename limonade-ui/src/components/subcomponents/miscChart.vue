<script setup>
import { reactive } from 'vue'
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()

const state = reactive({
    startDate: new Date(),
    endDate: new Date(),
    nodeName: "",
})

let config =
{
    maintainAspectRatio: false,
    aspectRatio: 1,

    plugins: {
        legend: {
            labels: {
                color: "black"
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: "black",
                autoSkipPadding: 20
            },

            grid: {
                color: "#eff3f8"
            }
        },
        y: {
            ticks: {
                color: "black"
            },

            grid: {
                color: "#eff3f8"
            }
        }
    }
}

function refreshDate() {
    let start = new Date(state.startDate).toISOString()
    let end = new Date(state.endDate).toISOString()
    store.fetchChartData(state.nodeName, start, end)
}


</script>
<template>
    <div class="time-picker">
        <input type="datetime-local" v-model="state.startDate">
        <input type="datetime-local" v-model="state.endDate">

        <select v-model="state.nodeName">
            <option v-for="counter in store.getCounters" :key="counter.name">{{ counter.name }}</option>
        </select>
        <button @click="refreshDate()"><i class="bi bi-arrow-clockwise"></i></button>
    </div>
    <pv-chart type="line" v-if="store.getChartData.enabled" :data="store.getChartData.data" :options="config"></pv-chart>
</template>

<style scoped>
.p-chart {
    height: 85%;
}

.time-picker {
    padding: 4px
}

.time-picker>input {
    margin-left: 4px;
    margin-right: 4px;
}

.time-picker>button {
    color: var(--theme-color-2);
    cursor: pointer;
    border: 1px solid var(--border-color-1);
    border-radius: 2px;
    background: white;
}

i {
    font-size: 16px;
}
</style>