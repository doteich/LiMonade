<script setup>
import { reactive, ref } from 'vue'
import { Chart } from 'chart.js';

import axios from "axios"
import annotationPlugin from 'chartjs-plugin-annotation';

// const ist = ref(80)
// const soll = ref(100)
// const count = ref(1)
// const shift = ref("")

const show = ref(true)


Chart.register(annotationPlugin);

let plugins = [annotationPlugin]



const data = {
  labels: ['Qty'],
  datasets: [
    {
      label: 'Ist',
      data: [
        { x: [0, 0], y: "Qty" },
      ],
      backgroundColor: "hsl(209, 47%, 20%)",
    },
    {
      label: 'Soll',
      data: [
        { x: [0, 0], y: "Qty" },
      ],
      backgroundColor: "crimson",
    },
    {
      label: 'Über',
      data: [
        { x: [0, 100], y: "Qty" },
      ],
      backgroundColor: "lime",
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

async function addData() {

  let chartdata = data

  let params = new URLSearchParams()
  params.append("collection", "goglio_line4_general")
  params.append("tsIdentifier", "WS_Cur_Order_ID")
  params.append("nodeName", "CT_Counter_Filled_Bags")
  let res = await axios.get(`http://localhost:3000/timeseries/shifts`, { params })

  console.log(res.data)

  show.value = false

  res.data.forEach((el, idx) => {
    //let last = chartdata.datasets[1].data[data.datasets[1].data.length - 1].x[1]
    let last = chartdata.datasets[1].data[data.datasets[1].data.length - 1].x[1]
    let n = last + el.actual
    let s = last + el.target
    console.log(last)

    let iEntry = { x: [last, n], y: "Qty" }
    let sEntry = { x: [n, s], y: "Qty" }
    data.datasets[0].data.push(iEntry)
    data.datasets[1].data.push(sEntry)

    let lObj = {
      type: 'line',
      label: {
        content: el.name,
        display: true
      },
      xMin: last,
      xMax: last,
      borderColor: 'grey',
      borderWidth: 2,
    }
    
    let oName = "line" + idx.toString()


    config.plugins.annotation.annotations[oName] = lObj

    
  })

  config.data = data
  setTimeout(() => {
    show.value = true
  }, 1000);

}

</script>

<template>
  <div>

    <pv-chart v-if="show" :plugins="plugins" type="bar" :data="data" :options="config"></pv-chart>

    <button @click="addData()">ADD</button>

  </div>
</template>

<style scoped></style>