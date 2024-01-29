<script setup>
import { ref } from "vue";
import { useLineDataStore } from "@/stores/line/lineData"
import progressBarChart from "./subcomponents/progressBarChart.vue"
import shiftChart from "./subcomponents/shiftChart.vue"
import ProgressSpinner from 'primevue/progressspinner';
import ProgressData from "./subcomponents/progressData.vue"
import paceToggle from "./subcomponents/paceToggle.vue";
import paceChart from "./subcomponents/paceChart.vue";


const store = useLineDataStore()


const paceData = ref({
    show: false,
    node: "",
    db: "",
    unitTag: ""
})

function togglePaceChart(show, db, node, unitTag) {

    if (show) {
        paceData.value.db = db
        paceData.value.node = node
        paceData.value.show = true
        paceData.value.unitTag = unitTag

    } else {
        paceData.value.show = false
    }

}


</script>
<template>
    <section>
   
        <div class="line-progress" v-for="group in store.getMachineAreas" :key="group"
            :style="{ width: group.ratio * 100 + '%' }">
          
            <div class="heading-controls">
                <h3>{{ $t('line.h2') }} - {{ group.name }} </h3>
                <i class="bi bi-bar-chart-line-fill" @click="togglePaceChart(true, group.db, group.paceCounter, group.unit)"></i>
            </div>
            <ProgressSpinner v-if="!store.getLoadingState(group.name)" class="spinner"></ProgressSpinner>
            <div v-if="store.getLoadingState(group.name)">
                <div class="progress-data">
                    <paceToggle :group="group.name"></paceToggle>
                    <ProgressData :value="store.getProgressData(group.name).finish" unit="min" icon="hourglass-split">
                    </ProgressData>
                    <ProgressData :value="store.getProgressData(group.name).finishTS" icon="calendar-week"></ProgressData>
                </div>

                <shiftChart v-if="store.getProgressData(group.name).type == 'shift'"
                    :pObject="store.getProgressData(group.name)"></shiftChart>

                <progressBarChart :pObject="store.getProgressData(group.name)" v-else>
                </progressBarChart>
          

            </div>
        </div>
        <paceChart v-if="paceData.show" :db="paceData.db" :node="paceData.node" :unitTag="paceData.unitTag" @close="togglePaceChart(false)"></paceChart>
    </section>
</template>
<style scoped>
.line-progress {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
    margin: 5px 5px 10px 0;
    height: 100%;
    background: var(--font-color-1);
}

.spinner {
    margin-top: auto;
    margin-bottom: 1vh;
}

.progress-data {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.heading-controls {
    display: flex;
    box-shadow: 1px 1px 3px 0px var(--theme-color-2);
    padding: 5px;
    align-items: center;
    border-radius: 4px;
    margin: 4px;
    background: var(--theme-color-2);
    color: var(--font-color-1);

}

.heading-controls>i {
    margin-left: auto;
    border: 1px solid var(--border-color-1);
    padding: 3px;
    cursor: pointer;
}

.heading-controls>i:hover {
    background: var(--theme-color-1);
}

.heading-controls>i:active {
    transform: scale(0.9);
}

h3 {
    padding: 0;
    margin: 0;
    font-size: 25px;
}
</style>

