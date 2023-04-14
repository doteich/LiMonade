<script setup>
import miscChart from "./subcomponents/miscChart.vue"
import { useMiscStore } from '@/stores/miscStore'

const store = useMiscStore()

const setActive = (name) => {
    store.setActiveComponent(name)
}

</script>
<template>
    <section class="misc-box">
        <nav class="misc-nav">
            <h2>Misc</h2>
            <ul>
                <li @click="setActive('order')" :class="{ 'li-active': store.getActiveComponent.order }">Order Data</li>
                <li @click="setActive('calculated')" :class="{ 'li-active': store.getActiveComponent.calculated }">
                    Calculated</li>
                <li @click="setActive('chart')" :class="{ 'li-active': store.getActiveComponent.chart }">Historic Numeric
                </li>
            </ul>
        </nav>
        <miscChart v-if="store.getActiveComponent.chart"></miscChart>
    </section>
</template>
<style scoped>
.misc-box {
    margin: 5px;
    padding: 1%;
    width: 100%;
    height: 100%;
    background: white !important;
    border-radius: 4px;
}

h2 {
    width: 10%;
    z-index: 1;
}

.misc-nav {
    display: flex;
    margin: 0;
    padding: 0;
    box-shadow: 1px 1px 3px 0px var(--theme-color-2);
    border-radius: 4px;
    margin: 4px;
    background: var(--theme-color-2);
    color: var(--font-color-1);
}

.misc-nav ul {
    display: flex;
    padding: 0;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
    margin: 0 1px;
    width: 90%;
}

.misc-nav ul li {
    text-decoration: none;
    list-style: none;
    margin: 0px 10px;
    border: 0.5px solid var(--theme-color-1);
    padding: 2px 20px;
    text-align: center;
    border-radius: 2px;
    width: 12%;
    min-width: 140px;
    cursor: pointer;
    color: var(--font-color-1);
    box-shadow: 0px 0px 4px 0px var(--theme-color-1);

}

.li-active {
    background: var(--theme-color-1) !important;
    transform: scale(1.05);
}
</style>