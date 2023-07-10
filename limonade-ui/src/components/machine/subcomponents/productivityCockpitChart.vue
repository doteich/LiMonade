<script setup>
import { computed } from 'vue'
import { useMachineDataStore } from '@/stores/machine/machineData'
const store = useMachineDataStore()


let chartData = computed(() => {
    return {
        labels: ['Productive', 'Other'],
        datasets: [
            {
                data: [store.getProductiveTime.prodTime, (store.getProductiveTime.passedTime - store.getProductiveTime.prodTime)],
                backgroundColor: ["rgba(22,150, 103, 0.7)", "grey"],
            }
        ]
    }
})


const config = {
    rotation: -90,
    circumference: 180,
    cutout: "80%",
    maintainAspectRatio: false,
}

</script>

<template>
    <div class="productivity-indicator">
        <h4>Productive Time</h4>
        
            
            <pv-chart type="doughnut" :data="chartData" :options="config"></pv-chart>
            <p>{{ ((store.getProductiveTime.prodTime / (store.getProductiveTime.passedTime - store.getProductiveTime.prodTime))*100).toFixed(2)}} %</p>
    
    </div> 
</template>

<style scoped>
.productivity-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    margin: 1%;
    height: 15vh;
    justify-content: center;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.productivity-indicator h4 {
    color: var(--theme-color-2);
    width: 90%;
    border-bottom: 1px solid var(--border-color-1);
    padding: 1px;
    margin: 10px;
}

.productivity-indicator >div {
    height: 8vh;
}

p {
   font-weight: bold;
}
</style>