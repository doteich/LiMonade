<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();

import { computed } from "vue"

const route = computed(() => {

  let arr = router.currentRoute.value.fullPath.split("/")
  arr.shift()
  arr[0] == "" ? arr.shift() : ""
  return arr

})

function changeRoute(index, name) {
  switch (index) {
    case 0:
      router.push("/" + name)
      break;
    case -1:
      router.push("/")
      break;
  }
}

</script>


<template>
  <header>
    <nav>
      <p @click="changeRoute(-1, 'home')"><i class="bi bi-house"></i></p>
      <div v-if="route.length > 0" v-for="(el, index) in route" :key="index" >
        <i class="bi bi-arrow-right"></i>
        <p :class="index == (route.length - 1) ? 'active-route' : ''" @click="changeRoute(index, el)">{{ el.toUpperCase() }}</p>
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
  cursor: pointer;
}

nav>div {
  display: flex;
  align-items: center;
}

.active-route {
  background: var(--theme-color-2);
  color: white;
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
