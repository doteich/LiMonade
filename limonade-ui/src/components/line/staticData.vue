<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import singleStatic from "./subcomponents/singleStatic.vue"
const store = useLineDataStore()


</script>
<template>
    <section>
        <div class="line-static" v-for="group in store.getMachineAreas" :key="group"
            :style="{ width: group.ratio * 100 + '%' }">
            <h2>Static - {{ group.name }}</h2>
            <div class="static-data">
                <singleStatic v-for="el in store.getStaticData(group.name)" :key="el.nodeName" :name="el.nodeName"
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
    margin: 5px 5px 10px 0;
    height: 100%;
    background: var(--font-color-1);
    
}


.static-data{
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    padding: 2px;
}
</style>