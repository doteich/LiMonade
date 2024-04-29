<script setup>
import Timeline from 'primevue/timeline';


const props = defineProps({
    machines: Array
})

</script>

<template>
    <div class="line-simple">
    <Timeline :value="machines" layout="horizontal"  align="top">
        <template #marker="slotProps">
            <div class="timeline-machine">
                <div class="timeline-bubble" :style="{ 'background': slotProps.item.color }">
                    <p class="timeline-bubble-value">{{ slotProps.item.value }}</p>
                </div>
                <span>{{ slotProps.item.name }}</span>
            </div>
        </template>

    </Timeline>
</div>

</template>

<style scoped>

.line-simple {
    padding: 0 1%;
    height: 50%;
    display: flex;
    align-items: center;
}



.timeline-machine {
    display: flex;
    align-items: center;
    width: 200px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    min-height: 30px;
    width: 100%;

}

.timeline-machine>span {
    padding: 0 10px;

}

.timeline-bubble {
    background: var(--theme-color-2);
    color: var(--theme-color-2);
    min-height: 30px;
    min-width: 30px;
    max-height: 30px;
    max-width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.timeline-bubble-value {
    margin: 0;
    padding: 0;
    font-weight: bold;
    color: white;
}



.line-container-infos {
    
}

.line-container-infos>h3 {
    margin-top: 5px;
    border-bottom: 1px solid var(--border-color-1);
    width: 100%;
    margin-bottom: 10px;
    font-size: 17px;
    color: var(--theme-color-2);

}

</style>