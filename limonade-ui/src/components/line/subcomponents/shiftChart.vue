<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { Chart } from 'chart.js';

import axios from "axios"
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const show = ref(true)
let interval = null

const props = defineProps({
  pObject: Object
})

Chart.register(annotationPlugin);
Chart.register(ChartDataLabels);

let plugins = [annotationPlugin, ChartDataLabels]

onMounted(() => {
  addData()
  refreshChart()
})

function refreshChart() {
  interval = setInterval(() => {
    addData()
  }, 120000);
}
onUnmounted(()=>{
  clearInterval(interval)
})


const data = {
  labels: ['kg'],
  datasets: [
    {
      label: 'Ist',
      data: [
        { x: [0, 0], y: "kg" },
      ],
      backgroundColor: "hsl(209, 47%, 20%)",

    },
    {
      label: 'Soll',
      data: [
        { x: [0, 0], y: "kg" },
      ],
      backgroundColor: "crimson",
    },
    {
      label: 'Über',
      data: [
        { x: [0, 0], y: "kg" },
      ],
      backgroundColor: "rgb(39, 207, 115)",
    },

  ]
}

const config = {
  barPercentage: 1,
  categoryPercentage: 0.6,
  height: 100,
  maintainAspectRatio: false,
  aspectRatio: 10,
  type: 'bar',
  borderWidth: 0,
  data: data,
  indexAxis: 'y',
  plugins: {
    annotation: {
      annotations: {
      },
      adjustScaleRange: true
    },
    datalabels: {
      labels: {
        value: {
          color: 'white'
        }
      },

      formatter: function (value, context) {
        let data = context.dataset.data[context.dataIndex].x
        if (context.dataIndex == 0 || data[0] == data[1]) {
          return ""
        } else {
          if (context.dataset.label == "Über") {
            return "+" + (data[1] - data[0])
          } else if (context.dataset.label == "Soll") {
            return "-" + (data[1] - data[0])
          } else {
            return data[1] - data[0]
          }
        }
      }
    },

    tooltip: {
      callbacks: {
        label: function (context) {
          if (context.dataset.label == "Ist") {
            return (context.parsed._custom.end - context.parsed._custom.start);
          } else if (context.dataset.label == "Soll") {
            return "-" + (context.parsed._custom.end - context.parsed._custom.start);
          } else {
            return "+" + (context.parsed._custom.end - context.parsed._custom.start);
          }
        },
        title: function (context) {
          return context[0].dataset.label
        }
      }
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      stacked: true,
    },
    x: {
      display: false,
      stacked: false,
      ticks: {
        major: {
          enabled: false
        }
      },
    }
  }



}

async function addData() {

  data.datasets.forEach(set => {
    set.data = [{ x: [0, 0], y: "kg" }]
  })

  let params = new URLSearchParams()
  params.append("collection", props.pObject.db)
  params.append("limit", 3)
  if(props.pObject.unit){
    params.append("unit", props.pObject.unit)
  }
  params.append("nodeName", props.pObject.counterIdKey)
  params.append("lineId", props.pObject.lineid)
  let res = await axios.get(`${props.pObject.url}/timeseries/shiftpaces`, { params })

  show.value = false

  res.data.slice(-3).forEach((el, idx) => {
    //let last = chartdata.datasets[1].data[data.datasets[1].data.length - 1].x[1]
    let last = data.datasets[2].data[data.datasets[1].data.length - 1].x[1]
    let diff = el.actual - el.target

    let n = last + el.actual
    let s = last + el.target

    let iEntry = {}
    let sEntry = {}
    let uEntry = {}

    if (diff > 0) {
      iEntry = { x: [last, s], y: "kg" }
      sEntry = { x: [s, s], y: "kg" }
      uEntry = { x: [s, s + diff], y: "kg" }
    } else {
      iEntry = { x: [last, n], y: "kg" }
      sEntry = { x: [n, s], y: "kg" }
      uEntry = { x: [s, s], y: "kg" }
    }

    data.datasets[0].data.push(iEntry)
    data.datasets[1].data.push(sEntry)
    data.datasets[2].data.push(uEntry)

    let lObj = {
      type: 'line',
      label: {
        content: el.name,
        display: true,
        position: 'start'
      },
      xMin: last,
      xMax: last,
      borderColor: 'black',
      borderWidth: 1,
    }

    let oName = "line" + idx.toString()
    config.plugins.annotation.annotations[oName] = lObj

  })


  config.data = data
  setTimeout(() => {
    show.value = true
  }, 200);

}

</script>

<template>
  <div class="shift-chart-container">
    <div class="shift-chart">
      <pv-chart v-if="show" :plugins="plugins" type="bar" :data="data" :options="config"></pv-chart>
    </div>
  </div>
</template>

<style scoped>
.p-chart {
  height: 10vh !important;
}

.shift-chart-container {

  width: 99.2%;
  border: 1px solid var(--border-color-1);
  height: fit-content;
  padding: 7px;
  box-shadow: 1px 1px 4px 0px var(--border-color-1);
  margin: 0% 0.2%;
  margin-bottom: 0px;
 
  
}



@media (max-width: 1920px) {}


.shift-chart>h4 {
  border-bottom: 1px solid var(--border-color-1);
  width: 30%;
  margin: 0.1vh 0;
}
</style>