<script setup>
import { onMounted } from "vue"
import Timeline from 'primevue/timeline';
import { useLineDataStore } from "@/stores/line/lineData"
import lineVisu from "../components/line/visu.vue"

const store = useLineDataStore()

onMounted(()=>{
    store.startSockets()
})

</script>

<template >
<div class="line-view">
   <lineVisu class=".line-visu"></lineVisu>
   <section class="line-dynamic">
    <div v-for="area in store.getMachineAreas" :key="area" :style="{ width: area + '%', background:'blue'}">
        <p>{{ area }}</p>
    </div>
   
    </section>
</div>
</template>

<style>
.line-view {
    display: grid;
    height: 94.5vh;
    min-width: 100%;
    grid-template-areas:
        "line"
        "dynamic"
        "static";
    grid-template-rows: 40% 30% 30%;
}


.line-view > .line-visu{
    grid-area: line;
}

.line-view > .line-dynamic{
    grid-area: dynamic;
    display: flex;
    align-content: center;
    justify-content: center;
}

</style>