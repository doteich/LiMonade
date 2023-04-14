<script setup>
import { reactive } from 'vue'
import { useDynamicDataStore } from '@/stores/dynamicStore'
const store = useDynamicDataStore()

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
        <label>Start:</label><input type="datetime-local" v-model="state.startDate">
        <label>End:</label><input type="datetime-local" v-model="state.endDate">
        <label>Node:</label>
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
    padding: 4px;
    display: flex;
}

.time-picker>input {
    margin-left: 4px;
    margin-right: 10px;
}

.time-picker>button {
    color: var(--theme-color-2);
    cursor: pointer;
    border: 1px solid var(--border-color-1);
    border-radius: 2px;
    background: white;
    margin-left: 1%;
    width: 40px;
}

.time-picker>button:hover{
    background: var(--theme-color-2);
    color: var(--font-color-1)
}


i {
    font-size:16px;
}

</style>