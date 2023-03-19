<script setup>
defineProps({
    name: String,
    value: Number
})

</script>

<template>
    <div class="counter">
        <h5>{{name }}</h5>
        <p>{{ value }}</p>
        <i class="bi bi-bar-chart-line-fill"></i>

    </div>
</template>

<style scoped>
.counter {
    display: flex;
    flex-direction: row;
    height: 4vh;
    margin: 5px;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    justify-items: center;
    align-items: center;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);;
}

.counter h5 {
    margin: 10px;
   word-wrap: break-word;
    font-size: 15px;
    padding: 3px;
    width: 40%;
    border-bottom:1px solid var(--border-color-1);
}

.counter p {
    font-size: larger;
    align-self: center;
    font-size: 20px;
    margin: 0;
    color: var(--theme-color-2);
}

.counter i{
    color: var(--theme-color-2);
    cursor: pointer;
    margin-left: auto;
    margin-right: 10%;
    border: 1px solid var(--border-color-1);
    padding: 4px;
    border-radius: 2px;
}

.counter i:hover{
    background-color: var(--theme-color-2);
    color: white;
}
</style>