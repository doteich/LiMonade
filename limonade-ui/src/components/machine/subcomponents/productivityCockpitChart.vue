<script setup>
import { computed } from 'vue'
import { useMachineDataStore } from '@/stores/machine/machineData'
const store = useMachineDataStore()


let chartData = computed(() => {
    return {
        labels: ['Productive', 'Other'],
        datasets: [
            {
                data: [store.getProductiveTime.prodTime, (store.getProductiveTime.passedTime - store.getProductiveTime.prodTime)],
                backgroundColor: ["rgba(22,150, 103, 0.7)", "grey"],
            }
        ]
    }
})


const config = {
    rotation: -105,
    circumference: 210,
    cutout: "90%"
}

</script>

<template>
    <div class="cockpit-chart">
        <pv-chart type="doughnut" :data="chartData" :options="config"></pv-chart>
        <h4>Productiv Time</h4>
    </div>
</template>

<style scoped>
.cockpit-chart {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 5%;
    height: 100%;
    align-items: center;
    align-content: center;
    justify-content: center;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.cockpit-chart h4 {
    color: var(--theme-color-2)
}
</style>