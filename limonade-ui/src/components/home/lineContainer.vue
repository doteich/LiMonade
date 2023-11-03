<script setup>

import { ref } from "vue"
import { useRouter } from 'vue-router';
import Timeline from 'primevue/timeline';
import ProgressBar from 'primevue/progressbar';

const router = useRouter()


const props = defineProps({
    line: Object
})

function changeRoute(id) {
    router.push(id)
}

</script>


<template>
    <div class="line-container" @click="changeRoute(line.id)">
        <h2> {{ line.name }}</h2>
        <div class="line-container-infos">
            <h3>{{ line.subtitle }}</h3>
            <div class="line-data">
                <p v-for="el in line.data" :key="el.name" class="line-data-set">
                    <i class="bi bi-clipboard-check"></i>
                    <span class="line-data-set-key">{{ el.displayName }}</span>
                    <span>{{ el.value }}</span>
                </p>
            </div>
            <Timeline :value="line.machines" layout="horizontal" class="line-simple" align="top">
                <template #marker="slotProps">
                    <div class="timeline-machine">
                        <div class="timeline-bubble" :style="{ 'background': slotProps.item.color }">
                            <p class="timeline-bubble-value">{{ slotProps.item.value }}</p>
                        </div>
                        <span>{{ slotProps.item.name }}</span>
                    </div>
                </template>

            </Timeline>

            <div v-if="line.progress">
                <ProgressBar :value="((line.progress.actual_value / line.progress.target_value) * 100).toFixed(2)">
                </ProgressBar>
                <div class="progress-count">
                    <div class="start-count"><div><i class="bi bi-geo"></i></div><span>{{ line.progress.actual_value }} </span></div>
                    <div class="end-count"><span>{{ line.progress.target_value }} </span>
                        <div><i class="bi bi-flag"></i></div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<style scoped>
.line-container {
    display: flex;

    flex-direction: column;
    width: 45vw;
    height: 35vh;
    background-color: var(--font-color-1);
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    border-radius: 5px;
    margin: 30px;
    cursor: pointer;
}

.line-container>h2 {
    width: 100%;
    margin: 0;
}

.line-simple {
    padding: 0 1%;

}

.timeline-machine {
    display: flex;
    align-items: center;
    width: 200px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    min-height: 30px;
    width: 100%;

}

.timeline-machine>span {
    padding: 0 10px;

}

.timeline-bubble {
    background: var(--theme-color-2);
    color: var(--theme-color-2);
    min-height: 30px;
    min-width: 30px;
    max-height: 30px;
    max-width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.timeline-bubble-value {
    margin: 0;
    padding: 0;
    font-weight: bold;
    color: white;
}



.line-container-infos {
    padding: 2px 15px;
}

.line-container-infos>h3 {
    margin-top: 5px;
    border-bottom: 1px solid var(--border-color-1);
    width: 100%;
    margin-bottom: 10px;
    font-size: 17px;
    color: var(--theme-color-2);

}


.line-data {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: 50%;
}

.line-data>p {
    width: 45%;
}

.line-data-set {
    display: flex;
    align-items: center;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    border: 1px solid var(--border-color-1);
    border-radius: 4px;
    margin: 5px 15px;
}

.line-data-set>i {
    background: var(--theme-color-2);
    padding: 7px;
    color: var(--font-color-1);
    border-radius: 3px;
}


.line-data-set-key {
    margin: 0 10px;
    font-weight: bold;
    color: var(--theme-color-2);
    border-bottom: 1px solid var(--border-color-1);
    padding: 0 5px;
}



.p-timeline-event-content {
    padding: 0 !important;
}

.progress-count {
    display: flex;
    margin: 0px 0px;
}

.start-count {
    display: flex;
    border-left: 1px solid var(--theme-color-2);
    border-bottom: 1px solid var(--theme-color-2);
    width: 15%;
    align-items: center;
}

.start-count>span{
    margin-left: 10px;
    font-weight: bold;
}


.start-count>div {
    background: var(--theme-color-2);
    color: white;
    padding: 4px;
}

.end-count {
    display: flex;
    border-right: 1px solid var(--theme-color-2);
    border-bottom: 1px solid var(--theme-color-2);
    width: 15%;
    margin-left: auto;
    justify-content: flex-end;
    align-items: center;
}

.end-count>div {
    background: var(--theme-color-2);
    color: white;
    padding: 4px;
}

.end-count>span{
    margin-right: 10px;
    font-weight: bold;
}



</style>
