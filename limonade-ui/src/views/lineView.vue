<script setup>
import { onMounted } from "vue"
import { useLineDataStore } from "@/stores/line/lineData"
import lineVisu from "../components/line/visu.vue"
import progressBox from "../components/line/progressBox.vue"
import staticData from "../components/line/staticData.vue"

import dynamicData from "../components/line/dynamicData.vue"

const store = useLineDataStore()

onMounted(() => {
    store.startSockets()
    store.fetchStaticData()
})

</script>

<template >
    <div class="line-view">
        <lineVisu class="line-visu"></lineVisu>
        <progressBox class="line-section test3"></progressBox>

        <dynamicData class="line-section test2"></dynamicData>
        <staticData class="line-section test"></staticData>

    </div>
</template>

<style>
.line-view {
    display: grid;
    height: 94.5vh;
    min-width: 100%;
    grid-template-areas:
        "line"
        "progress"
        "dynamic"
        "static";
    grid-template-rows: 38% 17% 20% 25%;
}


.line-visu {
    grid-area: line;
}

.test{
    grid-area: static;
}
.test2{
    grid-area: dynamic
}
.test3{
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