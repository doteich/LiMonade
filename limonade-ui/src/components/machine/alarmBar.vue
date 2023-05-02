<script setup>
import { onMounted } from "vue"
import { useAlarmStore } from '@/stores/machine/alarmStore'
import alarmBoxDetailed from "./subcomponents/alarmBoxDetailed.vue"


const alarmStore = useAlarmStore()

function getAlarmsByDate(offset) {
    let start = new Date()
    let end = new Date()
    start.setHours(start.getHours() - offset)

    alarmStore.fetchAlarms("Alarm", start.toISOString(), end.toISOString())
}


onMounted(() => {
   
    getAlarmsByDate(24)
})

</script>

<template>
    <section class="alarm-bar">
        <h2>Alarms</h2>
        <div class="refresh-bar">
            <p @click="getAlarmsByDate(24)"><i class="bi bi-arrow-clockwise"></i>24h</p>
            <p @click="getAlarmsByDate(48)"><i class="bi bi-arrow-clockwise"></i>48h</p>
            <p @click="getAlarmsByDate(168)"><i class="bi bi-arrow-clockwise"></i>7d</p>
        </div>
        <alarmBoxDetailed v-for="alarm in alarmStore.getAlarms" :key="alarm.duration" :start=alarm.start :end=alarm.end
            :value=alarm.value :duration=alarm.duration :text="alarm.text"></alarmBoxDetailed>

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

.refresh-bar{
    display: flex;
    margin: 0;
    height: 4%;
    align-items: center;
}

.refresh-bar > p{
    margin: 0 10px;
    border: 1px solid var(--border-color-1);
    border-radius: 3px;
    padding: 4px;
    width: 60px;
    cursor: pointer;
}

.refresh-bar> p:hover{
    background: var(--theme-color-2);
    color: var(--font-color-1) 
}

.refresh-bar> p>i{
    margin-right: 10%;
}
</style>