<script setup>
import { useCentralDataStore } from '@/stores/machine/centralDataStore'
import { useAlarmStore } from '@/stores/machine/alarmStore'
import ProgressSpinner from 'primevue/progressspinner';
import alarmBoxDetailed from "./subcomponents/alarmBoxDetailed.vue"

const store = useCentralDataStore()
const alarmStore = useAlarmStore()

function getAlarmsByDate(offset) {
    alarmStore.setOffset(offset)
    store.updateAlarms()
}


</script>

<template>
    <section class="alarm-bar">
        <h2>Alarms</h2>
        <div v-if="!store.getLoadingState" class="spinner-machine">
            <ProgressSpinner></ProgressSpinner>
        </div>
        <div class="alarm-bar-loaded" v-else>

            <div class="refresh-bar">
                <p @click="getAlarmsByDate(24)"><i class="bi bi-arrow-clockwise"></i>24h</p>
                <p @click="getAlarmsByDate(48)"><i class="bi bi-arrow-clockwise"></i>48h</p>
                <p @click="getAlarmsByDate(168)"><i class="bi bi-arrow-clockwise"></i>7d</p>
            </div>
            <alarmBoxDetailed v-for="alarm in alarmStore.getAlarms" :key="alarm.duration" :start=alarm.start :end=alarm.end
                :value=alarm.value :duration=alarm.duration :text="alarm.text"></alarmBoxDetailed>
        </div>
    </section>
</template>

<style scoped>
.alarm-bar {
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: var(--font-color-1);
    border-radius: 4px;
    margin: 0 0px 0 5px;
}

.alarm-bar-loaded {
    display: flex;
    flex-direction: column;

}

.refresh-bar {
    display: flex;
    margin: 0.1vh;
    align-items: center;
}

.refresh-bar>p {
    margin: 0 10px;
    border: 1px solid var(--border-color-1);
    border-radius: 3px;
    padding: 4px;
    width: 60px;
    cursor: pointer;
}

.refresh-bar>p:hover {
    background: var(--theme-color-2);
    color: var(--font-color-1)
}

.refresh-bar>p>i {
    margin-right: 10%;
}
</style>