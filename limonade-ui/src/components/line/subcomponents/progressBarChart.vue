<script setup>


let data = [1,2,4]

const config = {
  type: 'bar',
  options: {
    indexAxis: 'y',
  }
};


</script>



<template>
    <div>
        <pv-chart type="bar" :data="data" :options="config"></pv-chart>
    </div>
</template>

<style scoped>
</style>