<script setup>

import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(annotationPlugin);

const config = {
  barPercentage: 1,

  categoryPercentage: 0.7,
  maintainAspectRatio: false,
  aspectRatio: 1,
  type: 'bar',
  borderWidth: 0,
  data: "",
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


</script>

<template>
    <div>
        <h4>Auftragsfortschritt</h4>

    </div>
</template>

<style scoped></style>