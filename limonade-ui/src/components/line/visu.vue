<script setup>
import { onMounted } from "vue"
import { useRouter } from 'vue-router'
import Timeline from 'primevue/timeline';
import { useLineDataStore } from "@/stores/line/lineData"

const store = useLineDataStore()
const router = useRouter();

function switchRoute(name) {
    router.push(router.currentRoute.value.fullPath + "/" +name)
    
}

</script>

<template>
    <section class="line-visu">
        <h2>Linien Visualisierung</h2>
        <div class="timeline-container">
            <Timeline :value="store.getMachines" layout="horizontal">
                <template #marker="slotProps">
                    <div class="machine-container" @click="switchRoute(slotProps.item.name)">
                        <p class="machine-state"><span class="status-num">{{ slotProps.item.state }}</span><span
                                class="status-string">Productive</span></p>
                        <img src="../../assets/packing-machine-svgrepo-com.svg">
                        <p class="machine-name">{{ slotProps.item.name }}</p>
                    </div>
                </template>
                <template #content="slotProps">
                    <div class="alarm" v-if="slotProps.item.alarm > 0">
                        <div class="alarm-num">
                            <i class="bi bi-exclamation-diamond"></i>
                            <p>{{ slotProps.item.alarm }}</p>
                        </div>
                        <p>NO ALARM</p>
                    </div>
                </template>
            </Timeline>
        </div>
    </section>
</template>

<style>
.line-visu {
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: var(--font-color-1);
    border-radius: 4px;
    margin: 0 0px 0 5px;
}

.timeline-container {
    padding: 0px 10px;
}

.p-timeline-event-connector {
    height: 5px !important;
}

.p-timeline-event-opposite {
    flex: 0 !important;
    padding: 10px !important;
}

.machine-container {
    cursor: pointer;
    min-width: 16vmin;
    border-radius: 2px;
    padding: 0;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.machine-name {
    padding: 5px;
    border-top: 1px solid var(--border-color-1);
    border-bottom: 1px solid var(--border-color-1);
    margin: 0;
    color: var(--theme-color-2);
    font-weight: bolder;
    text-align: center;

}


.machine-state {
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    margin: 0;
    display: flex;

}

.machine-state>span {
    padding: 10px;
}

.status-num {
    font-weight: bold;
    background: limegreen;
    text-align: center;
    color: var(--font-color-1);
}

.alarm {
    display: flex;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    width: 16vmin;
}

.alarm >p{
    padding: 2px
}

.alarm-num{
    background: crimson;
    color:white;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
}

.alarm-num >p{
    margin: 0;
}
.alarm-num >i {
    font-size: 20px;
}

</style>