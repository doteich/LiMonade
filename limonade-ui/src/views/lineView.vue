<script setup>
import { onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router';
import { useLineDataStore } from "@/stores/line/lineData"
import lineVisu from "../components/line/visu.vue"
import progressBox from "../components/line/progressBox.vue"
import staticData from "../components/line/staticData.vue"

import dynamicData from "../components/line/dynamicData.vue"

const store = useLineDataStore()

onMounted(() => {
    let route = useRoute().fullPath.replace("/","")
    store.fetchConfig(route)
    // store.startSockets()
    // store.fetchStaticData()
})

onUnmounted(()=>{
    store.resetSockets()
    store.$reset()
})

</script>

<template >
    <div class="line-view">
        <lineVisu class="line-visu"></lineVisu>
        <progressBox class="line-section progress-sec"></progressBox>

        <dynamicData class="line-section dynamic-sec"></dynamicData>
        <staticData class="line-section static-sec"></staticData>

    </div>
</template>

<style>
.line-view {
    display: grid;
    height: 99.5vh;
    min-width: 100%;
    grid-template-areas:
        "line"
        "progress"
        "dynamic"
        "static";
    grid-template-rows: 30% 22% 18% 24%;
}


.line-visu {
    grid-area: line;
}

.static-sec{
    grid-area: static;
}
.dynamic-sec{
    grid-area: dynamic
}
.progress-sec{
    grid-area: progress
}

.line-section {
    display: flex;
    flex-direction: row;
    height: 100%;
    align-items: flex-start;
    border-radius: 3px;
    margin: 0 0 0 5px ; 
}


</style>