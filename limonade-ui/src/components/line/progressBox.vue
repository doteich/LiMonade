<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import progressBarChart from "./subcomponents/progressBarChart.vue"

const store = useLineDataStore()

</script>
<template>
        <section>
            <div class="line-progress" v-for="group in store.getMachineAreas" :key="group"
                :style="{ width: group.ratio * 100 + '%' }">
                <h2>Progress - {{ group.name }}</h2>
                <div>
                    <progressBarChart></progressBarChart>
                </div>
            </div>

    </section>
</template>
<style scoped>
.line-progress {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
    margin: 5px 5px 10px 0;
    height: 100%;
    background: var(--font-color-1);
}
</style>

