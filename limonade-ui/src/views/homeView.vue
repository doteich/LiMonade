<script setup>
import { onMounted } from "vue"
import { useHomeDataStore } from "@/stores/home/homeData"
import lineContainer from "../components/home/lineContainer.vue"


const store = useHomeDataStore()

onMounted(() => {
    store.fetchHomeData()
})


</script>

<template>
    <h1>WELCOME</h1>
    <lineContainer v-for="line in store.getHomeData" :line="line" :key="line.id"></lineContainer>
</template>

<style scoped></style>