<script setup>
import { ref, onMounted } from "vue"
import { useLineDataStore } from "@/stores/line/lineData";
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';

import { useI18n } from "vue-i18n";
import internal from "stream";

const i18n = useI18n();
const translatedMessage = i18n.t("line.performance");
const toggle = i18n.t("line.performance_toggle");


const store = useLineDataStore()

const emit = defineEmits(["close"])

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

    let d = new Date()
    let h = d.getHours()
    let h_start = (h - 8) < 0 ? (24 - 8 + h) : (h - 8)
    h_start = h_start.toString()
    h_start = h_start.length < 2 ? "0" + h_start : h_start
    settings.value.start = `${d.toISOString().split("T")[0]}T${h_start}:00`
    settings.value.end = `${d.toISOString().split("T")[0]}T${h}:00`

    // fetchDeltas()

})

function closeChart() {
    emit("close")
    emit("expand")
}

async function fetchDeltas() {

    let res = []
    let l = []
    let ucode = ""

    if (selection.value != toggle) {
        ucode = props.unitTag
    }

    for (let i = 0; i < 9; i++) {
        let end = new Date()
        end.setMinutes(0, 0, 0);
        let start = new Date("06.17.2025")
        start.setMinutes(0, 0, 0);
        end.setHours(end.getHours() - i);
        start.setHours(start.getHours() - i - 1);
        l.unshift(`${start.getHours()}:00 - ${end.getHours()}:00`)

        console.log(l)

        // let rponse = await store.fetchPaceData(start.toISOString(), end.toISOString(), 60, props.db, props.node, "hour", ucode)
        // rponse < 0 ? res.unshift(0) : res.unshift(rponse.split(".")[0])
    }

    data.value.labels = l
    data.value.datasets[0].data = res

    ucode == "" ? data.value.datasets[0].label = translatedMessage : data.value.datasets[0].label = "Kg/h"

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

const settings = ref({
    start: "",
    end: "",
    interval: 1
})


const options = ref([toggle, "KG"])
const selection = ref(toggle)

</script>
<template>
    <Dialog visible="true" modal header="Performance" :closable="false" :style="{ width: '98vw', height: '100vh' }">

        <template #header="slotProps">
            <div class="chart-header">
                <h3>Performance Detail</h3>
                <div>
                    <button class="close-button" @click="closeChart"><i class="bi bi-x-circle"></i></button>
                </div>
            </div>
        </template>
        <div class="performance-inputs">
            
            <div class="input-group">
                <label>Von</label>
                <input type="datetime-local" v-model="settings.start">
            </div>
            <div class="input-group">
                <label>Bis</label>
                <input type="datetime-local" v-model="settings.end">
            </div>
            <div class="input-group">
                <label>Interval</label>
                <input type="number" v-model="settings.interval">
            </div>
        </div>
        <p>
            <pv-chart type="bar" :data="data" :options="config"></pv-chart>
        </p>
        <div class="actions-bar">
            <SelectButton v-model="selection" :options="options" aria-labelledby="basic" class="split-button" />
            <button @click="fetchDeltas()"><i class="bi bi-arrow-clockwise"></i></button>
        </div>
    </Dialog>
</template>

<style>
.split-button>div {
    height: 10px !important;

}
</style>


<style scoped>
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


.performance-inputs {
    display: flex;

}

.input-group>label {
    color: var(--theme-color-2);
    font-weight: bold;
}

.input-group>input {
    color: var(--theme-color-2);
    font-weight: bold;
    border: 1px solid var(--border-color-1);
    height: 3.5vh;
   font-family: Arial, Helvetica, sans-serif;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
}


.close-button {

    color: crimson;
    cursor: pointer;
    border-radius: 5px;
    font-size: 25px;
    border-radius: 50%;
    font-weight: bolder;

    background: none;
    border: none;
}

.close-button:hover {
    color: var(--theme-color-2);

}

.actions-bar {
    display: flex;
    border-top: 1px solid var(--border-color-1);
    padding: 5px;
}

.actions-bar>button {
    background: var(--theme-color-2);
    color: var(--font-color-1);
    font-size: 17px;
    width: 50px;
    font-weight: bold;
    margin: 0 10px;
    cursor: pointer;
    border-radius: 4px;
}

.actions-bar>button:active {
    transform: scale(0.95);
}
</style>