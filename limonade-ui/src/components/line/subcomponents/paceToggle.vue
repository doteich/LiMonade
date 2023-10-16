<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLineDataStore } from "@/stores/line/lineData"

const store = useLineDataStore()


const toggleVals = ["10", "60", "120", "AT"]

const cVal = ref(0)
const pace = ref(0)
let interval = null

async function updateValue() {
    cVal.value == 3 ? cVal.value = 0 : cVal.value++
    pace.value = await store.setPace(props.group, toggleVals[cVal.value])

}

const props = defineProps({
    group: String
})

onMounted(async () => {
    pace.value = await store.setPace(props.group, toggleVals[cVal.value])
    interval = setInterval(async () => {
        pace.value = await store.setPace(props.group, toggleVals[cVal.value])
    }, 60000)
})


onUnmounted(() => {
    clearInterval(interval)
})



</script>
<template>
    <div class="progress-data-entry">
        <div class="toggle-elements" @click="updateValue()">
            <i class="bi bi-speedometer2"></i>
            <span>{{ toggleVals[cVal] }}</span>
        </div>
        <div class="progress-values">
            <span style="font-weight:600">{{ pace }}</span>
            <span>Stk/min</span>
           
        </div>
    </div>
</template>

<style scoped>
.progress-data-entry {
    display: flex;
    width: 32.8%;
    min-width: 135px;

    margin: 2px 0.2%;
    align-items: center;
    border: 1px solid var(--border-color-1);
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.toggle-elements>i {
    font-size: 15px;
}

.toggle-elements {
    padding: 0 8px;
    cursor: pointer;
    display: flex;
    min-width: 35px;
    width: 5%;
    align-items: center;
    flex-direction: column;
    background: var(--theme-color-2);
    color: var(--font-color-1);

}

.toggle-icon {
    background: var(--theme-color-2);
    color: var(--font-color-1);
    padding: 10px;
    width: 100%;
    font-size: 15px;
    height: 100%;

}

.progress-values{
    padding: 8px 0;
    width: 100%;
    
}


.progress-values>span {
    padding: 0 3px;
    font-size: 15px;
}



</style>