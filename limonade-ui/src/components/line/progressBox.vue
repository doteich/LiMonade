<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import progressBarChart from "./subcomponents/progressBarChart.vue"
import shiftChart from "./subcomponents/shiftChart.vue"
import ProgressSpinner from 'primevue/progressspinner';
import ProgressData from "./subcomponents/progressData.vue"


const store = useLineDataStore()

</script>
<template>
    <section>
        <div class="line-progress" v-for="group in store.getMachineAreas" :key="group"
            :style="{ width: group.ratio * 100 + '%' }">
            <h2>Fortschritt - {{ group.name }}</h2>
            <ProgressSpinner v-if="!store.getLoadingState(group.name)" class="spinner"></ProgressSpinner>
            <div v-if="store.getLoadingState(group.name)">
                <div class="progress-data">
                    <ProgressData :value="store.getProgressData(group.name).pace" unit="Stk/Min" icon="speedometer2">
                    </ProgressData>
                    <ProgressData :value="store.getProgressData(group.name).finish" unit="Minuten" icon="hourglass-split">
                    </ProgressData>
                    <ProgressData :value="store.getProgressData(group.name).finishTS" icon="calendar-week"></ProgressData>
                </div>

                <shiftChart v-if="store.getProgressData(group.name).type == 'shift'" :pObject="store.getProgressData(group.name)"></shiftChart>

                <progressBarChart :pObject="store.getProgressData(group.name)" v-else>
                </progressBarChart>
            </div>
        </div>

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
}
</style>

