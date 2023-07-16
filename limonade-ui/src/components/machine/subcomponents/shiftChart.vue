<script setup>
import { reactive, ref } from 'vue'
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

const ist = ref(80)
const soll = ref(100)
const count = ref(1)
const shift = ref("")

const show = ref(true)


Chart.register(annotationPlugin);

let plugins = [annotationPlugin]



const data = {
  labels: ['Qty'],
  datasets: [
    {
      label: 'Ist',
      data: [
        { x: [0, 50], y: "Qty" },
      ],
      backgroundColor: "hsl(209, 47%, 20%)",
    },
    {
      label: 'Soll',
      data: [
        { x: [50, 70], y: "Qty" },
      ],
      backgroundColor: "crimson",
    }
  ]
}


const config = {
  barPercentage: 1,
  
  categoryPercentage: 0.7,
  maintainAspectRatio: false,
  aspectRatio: 1,
  type: 'bar',
  borderWidth: 0,
  data: data,
  indexAxis: 'y',
  plugins: {
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          label: {
            content: "FS",
            display: true
          },
          xMin: 0,
          xMax: 0,
          borderColor: 'grey',
          borderWidth: 2,
        },

      }
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      stacked: true,
    },
    x: {
      stacked: false,
      ticks: {
        major: {
          enabled: true
        }
      },
    }
  }



}

function addData() {
  show.value = false

  let last = data.datasets[1].data[data.datasets[1].data.length - 1].x[1]
  let n = last + ist.value
  let s = last + soll.value


  let iEntry = { x: [last, n], y: "Qty" }
  let sEntry = { x: [n, s], y: "Qty" }
  data.datasets[0].data.push(iEntry)
  data.datasets[1].data.push(sEntry)

  let lObj =   {
          type: 'line',
          label: {
            content: shift.value, 
            display: true
          },
          xMin: s,
          xMax: s,
          borderColor: 'grey',
          borderWidth: 2,
        }
  count.value ++
  let oName = "line"+count.value.toString()
  
    
  config.plugins.annotation.annotations[oName] = lObj

  config.data = data
  setTimeout(() => {
    show.value = true
  }, 300);
  
}

</script>

<template>
  <div>

    <pv-chart v-if="show" :plugins="plugins" type="bar" :data="data" :options="config"></pv-chart>
    <label>IST</label>
    <input type="number" v-model="ist">
    <label>SOLL</label>
    <input type="number" v-model="soll">
    <label>Schicht</label>
    <input v-model="shift">
    <button @click="addData()">ADD</button>
    
  </div>
</template>

<style scoped></style>