<script setup>
</script>


<template>
  <header>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>



<style>
main{
  height: 90vh;
}

h2{
    align-content: stretch;
    box-shadow: 1px 1px 3px 0px var(--theme-color-2);
    padding: 5px;
    border-radius: 4px;
    margin: 4px;
    background: var(--theme-color-2);
    color: var(--font-color-1);
}

</style>
