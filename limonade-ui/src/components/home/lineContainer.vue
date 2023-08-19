<script setup>

import { ref } from "vue"
import { useRouter } from 'vue-router';
import Timeline from 'primevue/timeline';

const router = useRouter()


const props = defineProps({
    line: Object
})

function changeRoute(id){
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
    max-height: 35%;
    background-color: var(--font-color-1);
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    border-radius: 5px;
    margin: 2%;
    cursor: pointer;
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


.line-data {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: 70%;
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
</style>
