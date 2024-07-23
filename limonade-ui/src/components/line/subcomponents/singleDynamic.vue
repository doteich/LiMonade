<script setup>

defineProps({
    name: String,
    value: Number,
    unit: String,
})


</script>

<template>
    <div class="counter">
        <h5>{{ name }}</h5>
        <p>{{ parseFloat(value.toFixed(3)) }}</p>
        <p class="unit">{{ unit }}</p>

    </div>
</template>

<style scoped>
.counter {
    display: flex;
    flex-direction: row;
    height: 3vmin;
    min-width: 180px;
    min-height: 35px;
    margin: 2px;
    width: 32%;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    justify-items: center;
    align-items: center;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);

}

.counter h5 {
    margin: 10px;
    word-wrap: break-word;
    font-size: 15px;
    padding: 3px;
    width: 40%;
    border-bottom: 1px solid var(--border-color-1);
}

.counter p {
    font-size: larger;
    align-self: center;
    font-size: 20px;
    color: var(--theme-color-2);
    width: 50%;
}

.unit {
    margin-left: auto;
    margin-right: 5%;
    width: 10% !important;
    font-size: 15px !important;
}

.counter i {
    color: var(--theme-color-2);
    cursor: pointer;
    margin-left: auto;
    margin-right: 1%;
    border: 1px solid var(--border-color-1);
    padding: 4px;
    border-radius: 2px;
    width: 30px;

}

.counter i:hover {
    background-color: var(--theme-color-2);
    color: var(--font-color-1);
}

@media (max-height: 1200px) {
    .counter {
        display: flex;
        flex-direction: row;
        height: 3vmin;
        min-width: 180px;
        min-height: 35px;
        margin: 2px;
        width: 24.6%;
        border: 1px solid var(--border-color-1);
        border-radius: 1px;
        justify-items: center;
        align-items: center;
        box-shadow: 1px 1px 4px 0px var(--border-color-1);

    }

    .counter h5 {
        margin: 10px;
        word-wrap: break-word;
        font-size: 12px;
        padding: 3px;
        width: 40%;
        border-bottom: 1px solid var(--border-color-1);
    }
}
</style>