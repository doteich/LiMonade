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
    <section>
        <lineContainer v-for="line in store.getHomeData" :line="line" :key="line.id"></lineContainer>
    </section>
</template>

<style scoped>

section{
    margin-top: 5%;
    margin-left: 5%;
}

</style>