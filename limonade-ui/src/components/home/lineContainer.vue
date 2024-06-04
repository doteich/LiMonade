<script setup>

import { ref } from "vue"
import { useRouter } from 'vue-router';
import lineViewSimple from "./lineViewSimple.vue";
import lineViewComplex from "./lineViewComplex.vue";


import ProgressBar from 'primevue/progressbar';

const router = useRouter()


const props = defineProps({
    line: Object,
    cozy: Boolean
})

function changeRoute(id) {
    router.push(id)
}

</script>


<template>
    
    <div class="line-container" :class="{'line-container-cozy': cozy}" @click="changeRoute(line.id)">
        <h2> {{ line.name }} - {{ line.subtitle }}</h2>
        <div class="line-container-infos">
            
            <div class="line-data">
                <p v-for="el in line.data" :key="el.name" class="line-data-set">
                    <i class="bi bi-clipboard-check"></i>
                    <span class="line-data-set-key">{{ el.displayName }}</span>
                    <span>{{ el.value }}</span>
                </p>
            </div>
        
            <lineViewComplex :machines="line.machines" v-if="line.branchingLayout"></lineViewComplex>
               <lineViewSimple :machines="line.machines" v-else></lineViewSimple>
            <div v-if="line.progress" class="line-progress">
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
    background-color: var(--font-color-1);
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    border-radius: 5px;
    margin: 30px;
    cursor: pointer;
}

.line-container-cozy{
    height: 35vh;
}

.line-container>h2 {
    width: 100%;
    margin: 0;
}


.line-container-infos{
    height: 100%;
    padding: 2px 5px;
}

h3{
    padding: 2px;
}
.line-data {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 30%;
}

.line-data>p {
    width: 100%;
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

.line-progress{
    height: 20%;
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
