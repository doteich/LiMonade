<script setup>
import { ref, onMounted } from "vue"
import { useLineDataStore } from "@/stores/line/lineData";
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';

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
    if (!props.unitTag){
        options.value.pop()
       
    }
    fetchDeltas()
  
})

function closeChart() {
    emit("close")
}

async function fetchDeltas() {

    let res = []
    let l = []
    let ucode = ""

    if(selection.value != "Stk"){
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

     ucode == "" ? data.value.datasets[0].label = "Stk/h" : data.value.datasets[0].label = "Kg/h"

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
            label: 'Stk/h',
            data: [],


        },

    ]
});

const options = ref(["Stk","KG"])
const selection = ref("Stk")

</script>
<template>
    <Dialog visible="true" modal header="Performance" :closable="false" :style="{ width: '50vw' }">
       
        <template #header="slotProps">
            <div class="chart-header">
                <h3>Performance</h3>
                <button class="close-button" @click="closeChart"><i class="bi bi-x-circle"></i></button>
            </div>
        </template>
        <p>
            <pv-chart type="bar" :data="data" :options="config"></pv-chart>
        </p>
        <div class="actions-bar">
            <SelectButton v-model="selection" :options="options" aria-labelledby="basic" class="split-button"/>
            <button @click="fetchDeltas()"><i class="bi bi-arrow-clockwise"></i></button>
        </div>
    </Dialog>
</template>

<style>
.split-button > div{
    height: 10px !important;
    
}
</style>


<style scoped>

.chart-header{
    display: flex;
    align-items: center;
    width: 100%;
}

.chart-header > button{
    margin-left: auto;
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

.close-button:hover{
    color: var(--theme-color-2);
    
}

.actions-bar{
    display: flex;
    border-top: 1px solid var(--border-color-1);
    padding: 5px;
}

.actions-bar > button{
    background: var(--theme-color-2);
    color: var(--font-color-1);
    font-size: 17px;
    width: 50px;
    font-weight: bold;
    margin: 0 10px;
    cursor: pointer;
    border-radius: 4px;
}

.actions-bar > button:active{
    transform: scale(0.95);
}
</style>