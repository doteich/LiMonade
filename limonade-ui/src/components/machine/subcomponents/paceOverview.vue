<script setup>
import { ref } from 'vue';
import { useCentralDataStore } from '@/stores/machine/centralDataStore';

const store = useCentralDataStore()

const props = defineProps({
    unit: String,
    pace: String,
    delta: Number,
})

const iState = ref(["10", "60", "120"])
const selection = ref(0)

function updatePace() {
    selection.value == iState.value.length - 1 ? selection.value = 0 : selection.value++
    store.fetchPaceData(iState.value[selection.value])
}

</script>

<template>
    <div class="pace-container">
        <button class="pace-toggle" @click="updatePace()">
            <i class="bi bi-speedometer2"></i>
            <span> {{ iState[selection] }} min</span>

        </button>
        <div class="pace-info">
            <h4>Nennleistung:</h4>
            <span>{{ pace }} {{ unit }}/min</span>
        </div>
        <div class="pace-info">
            <h4>Delta:</h4>
            <span>{{ delta }} {{ unit }}</span>
        </div>


    </div>
</template>

<style scoped>
.pace-container {
    display: flex;
    align-items: center;
    height: 70px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    margin: 5px;
}



.pace-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--theme-color-2);
    color: var(--font-color-1);
    width: 10%;
    height: 70px;
    font-family: Arial, Helvetica, sans-serif;
    cursor: pointer;
    border: none;
}

.pace-toggle:active {
    transform: scale(0.95);
}



.pace-toggle>i {
    font-size: 25px;
}


.pace-info{
    display: flex;
    flex-direction: column;
    width: 40%;
    margin: 0 10px;
  

}

.pace-info > h4{
    border-bottom: 1px solid var(--border-color-1);
    margin: 2% 0;
}

.pace-info >span{
    font-size: 20px;
}
</style>