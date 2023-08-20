<script setup>


const props = defineProps({
    icon: String,
    header: String,
    value: String,
    unit: String
})

</script>



<template>
    <div class="progress-data-entry">
        <i :class="'bi bi-' + icon"></i>
        <span style="font-weight:600">{{ value }}</span>
        <span>{{ unit }}</span>
    </div>
</template>

<style scoped>
.progress-data-entry {
    display: flex;
    width: 32.8%;
    margin: 2px 0.2%;
    align-items: center;
    border: 1px solid var(--border-color-1);
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.progress-data-entry>i {
    background: var(--theme-color-1);
    color: var(--font-color-1);
    padding: 6px;
    font-size: 20px;
}

.progress-data-entry>span {
    padding: 0 3px;
    font-size: 15px;
}
</style>