<script setup>

import { ref } from "vue"
import Timeline from 'primevue/timeline';

const props = defineProps({
    line: Object
})


</script>


<template>
    <div class="line-container">
        <h2> {{ line.name }}</h2>
        <div class="line-container-infos">
            <h3>{{ line.subtitle }}</h3>
            <div class="line-data">
                <p v-for="el in line.data" :key="el.name">
                    <i class="bi bi-clipboard-check"></i>
                    <span>{{ el.value }}</span>
                </p>
            </div>
            <Timeline :value="line.numberOfMachines" layout="horizontal" class="test">
                <template #marker>
                    <span class="timeline-bubble">I</span>
                </template>
            </Timeline>

        </div>
    </div>
</template>

<style scoped>
.line-container {
    display: flex;
    flex-direction: column;
    width: 40vw;
    background-color: var(--font-color-1);
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    border-radius: 5px;
}

.line-container>h2 {
    width: 100%;
    margin: 0;
}

.timeline-bubble {
    background: var(--theme-color-2);
    color: var(--theme-color-2);
    ;
    min-height: 20px;
    min-width: 20px;
    max-height: 20px;
    max-width: 20px;

    transform: rotate(45deg)
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


.line-data{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.line-data > p{
    width: 45%;
}

.p-timeline-event-content {
    padding: 0 !important;
}
</style>
