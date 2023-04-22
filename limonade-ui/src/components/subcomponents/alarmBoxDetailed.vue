<script setup>

const props = defineProps({
    value: Number,
    start: String,
    end: String,
    duration: Number,
    text: String,

})

</script>

<template>
    <div class="alarm-card">
        <div class="alarm-icon">
            <i class="bi bi-exclamation-diamond"></i>
            <p>{{ value }}</p>
        </div>
        <div class="alarm-details">
            <div>
                <i class="bi bi-clock-history"></i>
                <p>{{ start }} - {{ end }}</p>
            </div>
            <div>
                <i class="bi bi-stopwatch"></i>
                <p>{{ duration.toFixed(2) }} min</p>
            </div>
            <div>
                <i class="bi bi-chat-square-text"></i>
                <p>{{ text }}</p>
            </div>
        </div>

    </div>
</template>

<style scoped>
.alarm-card {
    display: flex;
    flex-direction: row;
    height: 9vh;
    min-height: 110px;
    margin: 5px 1px;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    justify-items: center;
    align-items: center;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.alarm-icon {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2px;
    color: var(--font-color-1);
    height: 100%;
    width: 15%;
    background: crimson;
}

.alarm-icon>i {
    font-size: 30px;
}

.alarm-details {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 85%;
    justify-content: center;
}

.alarm-details>div {
    display: flex;
    border: 1px solid var(--border-color-1);
    margin: 1px;
    min-height: 30%;
    align-items: center;
}

.alarm-details>div>p {
    margin: 0 0 0 10px;
    font-size: 14px;
    font-weight: bold;
    color: var(--theme-color-2)
}

.alarm-details>div>i {
    font-size: 17px;
    margin: 5px;
}
</style>