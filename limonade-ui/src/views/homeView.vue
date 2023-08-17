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
        <h1>Line Monitor</h1>
        <div class="home-content">
            
            <lineContainer v-for="line in store.getHomeData" :line="line" :key="line.id"></lineContainer>
        </div>
    </section>
</template>

<style scoped>


h1{
    background: var(--theme-color-2);
    color: var(--font-color-1);
    width: 100%;
    padding: 5px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}


.home-content{
    height: 70vh;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    
   
}
</style>