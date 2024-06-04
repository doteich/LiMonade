<script setup>

import { computed } from 'vue';

const props = defineProps({
    machines: Array
})


const layout = computed(() => {



    let maxLevel = Math.max(...props.machines.map(e => e.lvl))


    let struct = []

    for (let i = 0; i <= maxLevel; i++) {
        struct.push([])
    }
    props.machines.forEach(m => {
        m.angle = 0
        struct[m.lvl].push(m)
    })

    struct.forEach((a, i) => {
        if (i > 0 && a.length < struct[i - 1].length) {
            struct[i - 1][0].angle = 10
            struct[i - 1][1].angle = -10
        }
    })

    return struct



})


</script>

<template>
    <div class="line-view-complex">
      
        <div v-for="lvl, index in  layout " class="m-container" style="margin-left: 5%">

            <div v-for=" machine  in  lvl " class="machine-status" :style="{ borderColor: machine.color }">
                <span class="m-value" :style="{ background: machine.color }">
                    <i class="bi bi-check-circle-fill" v-if=" machine.schema=='good'"></i>
                    <i class="bi bi-exclamation-triangle-fill" v-else ></i>
                </span>

                <span class="m-name">

                    {{ machine.name }}
                </span>
                <div class="connector" v-if="index != layout.length - 1"
                    :style="{ transform: 'rotate(' + machine.angle + 'deg)' }"></div>
            </div>

        </div>

    </div>
</template>

<style scoped>
.line-view-complex {
    display: flex;
    height: 50%;
    align-items: center;
    justify-content: center;
}




.connector {
    position: relative;
    bottom: 40%;
    width: 100%;
    left: calc(50% + 1.2vw);
    margin-left: 5%;
    content: none;
    border-bottom: 1px solid var(--border-color-1);
}

.machine-status {
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    border-radius: 2px;
    min-height: 50px;
    min-width: 50px;
    max-height: 50px;
    max-width: 50px;
    text-align: center;
    border: 1px solid grey;
    width: 3vw;
    height: 3vw;
    margin: 5px;


}

.m-value {
    display: inline-block;
    padding: 5px 1px;
    color: var(--font-color-1);
    font-weight: bolder;
    border-bottom: 1px solid var(--border-color-1);
}

.m-name {
    font-weight: bold;
}
</style>