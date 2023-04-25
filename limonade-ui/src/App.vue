<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();

import { computed } from "vue"

const route = computed(() => {

  let arr = router.currentRoute.value.fullPath.split("/")
  arr.shift()
  return arr

})

</script>


<template>
  <header>
    <nav>
      <p><i class="bi bi-house"></i></p>
      <div  v-if="route.length > 1" v-for="el in route" :key="el.index">
        <i class="bi bi-arrow-right"></i>
        <p>{{ el.toUpperCase() }}</p>
      </div>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer>

    <img src="./assets/limonade.svg">
    <a href="https://github.com/doteich/LiMonade">
      <p>LiMoNade</p>
    </a>
  </footer>
</template>



<style>
nav {
  display: flex;
  align-items: center;
  margin: 2px;
}

nav p {
  margin: 0;
  color: var(--theme-color-2);
  font-weight: bold;
  border: 1px solid var(--border-color-1);
  border-radius: 2px;
  padding: 4px 10px;
  border-radius: 20px;
  margin: 0 10px;
}

nav > div{
  display: flex;
  align-items: center;
}

main {
  height: 95vh;
}

h2 {
  align-content: stretch;
  box-shadow: 1px 1px 3px 0px var(--theme-color-2);
  padding: 5px;
  border-radius: 4px;
  margin: 4px;
  background: var(--theme-color-2);
  color: var(--font-color-1);

}

footer {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

footer>img {
  height: 17px;
}

footer>a {
  text-decoration: none;
}

footer>a>p {
  margin: 0;
  color: rgb(141, 130, 93);
  border-bottom: 1px solid #ffd4a2
}
</style>
