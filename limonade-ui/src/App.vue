<script setup>
import navBar  from "./components/navBar.vue"

</script>


<template>
  <header>
    <navBar></navBar>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>



<style>

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

.spinner{
    margin-top: auto;
    margin-bottom: 6vh
}

.spinner-machine{
  display: flex;
  height: 100%;
  align-content: center;
  justify-content: center;
  align-items: center;
}
</style>
