<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import ProgressSpinner from 'primevue/progressspinner';

import singleStatic from "./subcomponents/singleStatic.vue"
const store = useLineDataStore()


</script>
<template>
    <section>
        
        <div class="line-static" v-for="group in store.getMachineAreas" :key="group"
            :style="{ width: group.ratio * 100 + '%' }">
            <h2>Static - {{ group.name }}</h2>
            <ProgressSpinner v-if="!store.getLoadingState(group.name)" class="spinner"></ProgressSpinner>
            <div class="static-data" v-if="store.getLoadingState(group.name)">
                <singleStatic v-for="el in store.getStaticData(group.name)" :key="el.nodeName" :name="el.displayName"
                    :value="el.value" :timestamp="el.timestamp" :showTS="el.showTS"></singleStatic>
            </div>
        </div>
    </section>
</template>
<style scoped>


.line-static {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
    margin: 15px 5px 10px 0;
    height: 100%;
    background: var(--font-color-1);
    
}

.spinner{
    
    margin-top: auto;
    margin-bottom: 6vh
    
    
}

.static-data{
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    padding: 2px;
}
</style>