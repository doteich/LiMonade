<script setup>

defineProps({
    state: Number,
    color: String,
    text: String,
}

)


</script>
<template>
    <div class="state-display">
        <div :style="{ background: color }" class="state-code">
            <p>{{ state }}</p>
        </div>
        <div class="state-text">
            <p>{{ text }}</p>
        </div>
    </div>
</template>
<style scoped>
.state-display {
    display: flex;
    align-items: center;
}

.state-display p {
    margin: 0;
}

.state-display>.state-code {
    height: 100%;
    width: 20%;
    color: var(--font-color-1);
    font-size: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.state-display>.state-text {
    font-size: 18px;
    margin-left: 10px;
}
</style>