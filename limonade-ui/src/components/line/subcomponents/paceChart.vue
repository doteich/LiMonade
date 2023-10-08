<script setup>
import { ref } from "vue"
import Dialog from 'primevue/dialog';

const visible = ref(false)

let config =
{
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
        x: {
            ticks: {
                color: "black",
                autoSkipPadding: 20
            },

            grid: {
                color: "#eff3f8"
            }
        },
        y: {
            ticks: {
                color: "black"
            },

            grid: {
                color: "#eff3f8"
            }
        }
    }
}


const data = {
  labels: ["A","B","C","D","F"],
  datasets: [
    {
      label: 'Dataset 1',
      data: [1,1,5,5,10],
    },
 
  ]
};

</script>
<template>
    <Dialog v-model:visible="visible" modal header="Performance" :style="{ width: '50vw' }">
        <p>
            <pv-chart type="bar" :data="data" :options="config"></pv-chart>
        </p>
       
    </Dialog>
</template>
<style scoped></style>