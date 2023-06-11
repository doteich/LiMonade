<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import singleCounter from "./subcomponents/singleDynamic.vue"
const store = useLineDataStore()
</script>
<template>
    <section>
        <div class="line-dynamic" v-for="group in store.getMachineAreas" :key="group.ratio"
            :style="{ width: group.ratio * 100 + '%' }">
            <h2>Dynamic - {{ group.name }}</h2>
            <div class="dynamic-data">
                <singleCounter  v-for="tag in store.getDynamicData(group.name)" :key="tag.name" :name="tag.name" :value="tag.value" :unit="tag.unit"></singleCounter>
            </div>
        </div>
    </section>
</template>
<style scoped>


.line-dynamic {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
    margin: 0px 5px 10px 0;
    height: 100%;
    background: var(--font-color-1);
}

.dynamic-data{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    padding: 2px;

}




</style>