<script setup>
import { ref, onMounted } from "vue"
import { useLineDataStore } from "@/stores/line/lineData";
import { useI18n } from "vue-i18n";
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const i18n = useI18n();
const translatedMessage = i18n.t("line.performance");
const toggle = i18n.t("line.performance_toggle");
var iv

const store = useLineDataStore()
Chart.register(ChartDataLabels);


const props = defineProps(
    {
        db: String,
        node: String,
        unitTag: String,
    }
)

onMounted(() => {
    if (!props.unitTag) {
        options.value.pop()

    }
    fetchDeltas()
    iv = setInterval(() => {
        fetchDeltas()
    }, 1000 * 180)
})


async function fetchDeltas() {
    try {
        let res = []
        let l = []
        let ucode = ""

        if (selection.value != toggle) {
            ucode = props.unitTag

        }

        for (let i = 0; i < 9; i++) {
            let end = new Date()
            end.setMinutes(0, 0, 0);
            let start = new Date()
            start.setMinutes(0, 0, 0);
            end.setHours(end.getHours() - i);
            start.setHours(start.getHours() - i - 1);
            l.unshift(`${start.getHours()}:00 - ${end.getHours()}:00`)
            let rponse = await store.fetchPaceData(start.toISOString(), end.toISOString(), 60, props.db, props.node, "hour", ucode)

            rponse < 0 ? res.unshift(0) : res.unshift(rponse.split(".")[0])
        }

        data.value.labels = l
        data.value.datasets[0].data = res

        ucode == "" ? data.value.datasets[0].label = translatedMessage : data.value.datasets[0].label = "Kg/h"
    }
    catch (err) {
        console.error(`error fetching deltas ${err}`)
    }
}


let config =
{
    maintainAspectRatio: false,
    aspectRatio: 1,
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
    },
    plugins: {
        datalabels: {
            color: 'black',
            font: {
                weight: 'bold'
            }
        }
    }
}



const data = ref({
    labels: [],
    datasets: [
        {
            label: translatedMessage,
            data: [],


        },

    ]
});

const options = ref([toggle, "KG"])
const selection = ref(toggle)

</script>
<template>



    <section class="pace-bar-chart">
        <pv-chart type="bar" :data="data" :options="config"></pv-chart>
    </section>


</template>

<style>
.split-button>div {
    height: 10px !important;

}
</style>


<style scoped>
.pace-bar-chart {
    padding: 0;
}

.pace-bar-chart>* {
    max-height: 89%;


}


.chart-header {
    display: flex;
    align-items: center;
    width: 100%;
}

.chart-header>div {
    margin-left: auto;
    display: flex;
    align-items: center;
}
</style>