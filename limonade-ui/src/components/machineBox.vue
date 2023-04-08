<script setup>

let data = {
    labels: ['Status'],
    datasets: [
        {
            label: "Error",
            data: [
                { x: [new Date(2023, 4, 8, 6, 45), new Date(2023, 4, 8, 6, 55)], y: "Status" },
                { x: [new Date(2023, 4, 8, 9, 55), new Date(2023, 4, 8, 11, 55)], y: "Status" }
            ],
            backgroundColor: "rgba(238, 31, 83, 0.7)"
        },

        {
            label: "Prod",
            data: [
                { x: [new Date(2023, 4, 8, 6, 55), new Date(2023, 4, 8, 9, 55)], y: "Status" },
                { x: [new Date(2023, 4, 8, 11, 55), new Date(2023, 4, 8, 23, 55)], y: "Status" },
            ],
            backgroundColor: "rgba(22,150, 103, 0.7)"
        },

        {
            label: "Idle",
            data: [{ x: [new Date(2023, 4, 8, 0, 0), new Date(2023, 4, 8, 6, 45)], y: "Status" }],
            backgroundColor: "rgba(23, 194, 247, 0.692)"
        },
    ]
}

let config =
{
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
            callbacks:{
                label: function(context) {
                        let label = context.dataset.label || '';

                        if (context.parsed.x !== null) {
                           label = new Date(context.parsed._custom.start).toLocaleString() + " - " + new Date(context.parsed._custom.end).toLocaleString()
                        }
                        return label;
                    },
                title: function(context){
                    return context[0].dataset.label 
                }
            }
        }
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


</script>
<template>
    <section>
        <pv-chart type="bar" :data="data" :options="config"></pv-chart>
    </section>
</template>
<style scoped></style>