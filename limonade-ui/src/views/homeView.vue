<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useHomeDataStore } from '@/stores/home/homeData'
import lineContainer from '../components/home/lineContainer.vue'

const store = useHomeDataStore()

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
    </header>
    <div class="home-content">
      <lineContainer v-for="line in store.getHomeData" :line="line" :key="line.id"></lineContainer>
    </div>
  </section>
</template>

<style scoped>
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