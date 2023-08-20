<script setup>
import { onMounted, shallowRef } from "vue"
import { storeToRefs } from 'pinia'
import { useMachineDataStore } from '@/stores/machine/machineData'

const machineStore = useMachineDataStore()
const { getDatasets } = storeToRefs(machineStore)

let config = {
    barPercentage: 1,
    categoryPercentage: 1,
    maintainAspectRatio: false,
    aspectRatio: 1,
    indexAxis: 'y',
    plugins: {
        legend: {
            labels: {
                color: "black"
            },
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';

                    if (context.parsed.x !== null) {
                        label = new Date(context.parsed._custom.start).toLocaleString() + " - " + new Date(context.parsed._custom.end).toLocaleString()
                    }
                    return label;
                },
                title: function (context) {
                    return context[0].dataset.label
                }
            }
        },
        datalabels: null
    },
    scales: {
        x: {
            ticks: {
                major: {
                    enabled: true
                }
            },
            type: "time",
            time: {
                unit: "minute",
            },
            min: new Date(2023, 4, 8)
        },
        y: {
            beginAtZero: true,
            stacked: true,
        }
    }
}

const data = {
    labels: ['Status'],
    datasets: getDatasets.value
}



onMounted(() => {
    let start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    config.scales.x.min = start

    let end = new Date();
    end.setUTCHours(23, 59, 59, 999);



})


</script>
<template>
    <section>
        <pv-chart type="bar" :data="data" :options="config"></pv-chart>
    </section>
</template>