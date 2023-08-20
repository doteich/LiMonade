<script setup>
import ProgressBar from 'primevue/progressbar';
import singleStatic from "./singleStatic.vue"

defineProps({
  pObject: Object
})




</script>



<template>
  <div class="progress-bar-chart">
    <div class="p-bar">
      <h4>Auftragsfortschritt</h4>
      <ProgressBar style="height:2vh" :value="pObject.progress">{{ pObject.count }}/{{ pObject.target }}</ProgressBar>
    </div>
  </div>
</template>

<style scoped>

.progress-bar-chart{
  display: flex;
  margin-top: 1vh;
}
.p-bar {
  width: 99.5%;
  box-shadow: 1px 1px 4px 0px var(--border-color-1);
  margin-bottom: 5px;
  padding: 7px;
  border: 1px solid var(--border-color-1)
}

.p-bar h4 {
  border-bottom: 1px solid var(--border-color-1);
  width: 30%;
  margin: 0.5vh 0;
}

span {
  font-size: 18px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
</style>

<style>
.p-progressbar {
  border-radius: 1px !important;
  box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.p-progressbar-value {
  background: var(--theme-color-1) !important;
  overflow: visible !important;
}
</style>