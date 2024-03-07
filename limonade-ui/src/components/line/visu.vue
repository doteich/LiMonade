<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import lineViewSimple from './subcomponents/lineViewSimple.vue';
import lineViewComplex from "./subcomponents/lineViewComplex.vue"


const store = useLineDataStore()

</script>

<template>
    <section class="line-visu">
        <h2>{{ $t('line.h1') }}</h2>
        <lineViewComplex v-if="store.$state.complexLayout"></lineViewComplex>
        <lineViewSimple v-else></lineViewSimple>


    </section>
</template>

<style>
.line-visu {
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: var(--font-color-1);
    border-radius: 4px;
    margin: 0 0px 0 5px;
}


</style>