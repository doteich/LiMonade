<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useHomeDataStore } from '@/stores/home/homeData'
import lineContainer from '../components/home/lineContainer.vue'

const store = useHomeDataStore()

const cozyMode = ref(true)
const modeIcon = ref("bi bi-arrows-angle-contract")

function changeDisplayMode(){
  if (!cozyMode.value){
    modeIcon.value = "bi bi-arrows-angle-contract"
  }else{
    modeIcon.value = "bi bi-arrows-angle-expand"
  } 
  cozyMode.value = !cozyMode.value
}

onMounted(() => {
  store.fetchHomeData()
})
onUnmounted(() => {
  store.clearStore()
  store.$reset()
})
</script>

<template>
  <section>
    <header>
      <img src="../assets/logo.svg" />

      <h1>{{ $t('home.header') }}</h1>
      
      <button @click="changeDisplayMode" class="mode-button" title="Switch Layout"><i :class="modeIcon"></i></button>
    </header>
    <div class="home-content">
      <lineContainer v-for="line in store.getHomeData" :line="line" :key="line.id" :cozy="cozyMode"></lineContainer>
    </div>
  </section>
</template>

<style scoped>
.mode-button{
  margin-left: auto;
  margin-right: 1%;
  border: none;
  background: var(--theme-color-1);
  color: var(--font-color-1);
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 10px;
  
}

.home-content {
  height: 70vh;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
}

header {
  background: var(--theme-color-2);
  color: var(--font-color-1);
  width: 100%;
  box-shadow: 1px 1px 4px 0px var(--border-color-1);
  display: flex;
  align-items: center;
  padding: 5px;
}

header > img {
  width: 50px;
  margin: 0 50px;
  border: white 1px solid;
}

h1 {
  padding: 0;
  margin: 0;
}
</style>