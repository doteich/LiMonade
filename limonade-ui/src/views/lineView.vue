<script setup>
import { onMounted } from "vue"
import Timeline from 'primevue/timeline';
import { useLineDataStore } from "@/stores/line/lineData"
import lineVisu from "../components/line/visu.vue"

const store = useLineDataStore()

onMounted(() => {
    store.startSockets()
})

</script>

<template >
    <div class="line-view">
        <lineVisu class=".line-visu"></lineVisu>
        <section class="line-dynamic">
            <div class="data-container" v-for="group in store.getMachineAreas" :key="group.ratio"
                :style="{ width: group.ratio * 100 + '%' }">
                <h2>Dynamic - {{ group.name }}</h2>
            </div>
        </section>

        <section class="line-static">
            <div class="data-container" v-for="group in store.getMachineAreas" :key="group"
                :style="{ width: group.ratio * 100 + '%' }">
                <h2>Static - {{ group.name }}</h2>
            </div>
        </section>

    </div>
</template>

<style scoped>
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


.line-view>.line-visu {
    grid-area: line;
}

.line-view>.line-dynamic {
    grid-area: dynamic;
    display: flex;
    align-content: center;
    justify-content: center;
}

.data-container {
    margin: 5px 0 0 5px;
    background: var(--font-color-1);
    border-radius: 3px;
    height: 100%
}

.line-view>.line-static {
    grid-area: static;
    display: flex;
    align-content: center;
    justify-content: center;
}



</style>