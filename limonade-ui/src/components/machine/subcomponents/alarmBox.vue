<script setup>

defineProps({
    code: Number,
    text: String
})

</script>
<template>
    <div class="alarm-display">
        <div :style="code == 0 ? 'background:rgb(18, 211, 66)' : 'background:crimson'">
            <i class="bi bi-check2-square" v-if="code == 0"></i>
            <i v-else class="bi bi-exclamation-diamond"></i>
            <p> {{ code }} </p>
        </div>
        <p>{{text}}</p>
    </div>
</template>
<style scoped>
.alarm-display {
    display: flex;
    align-items: center;
}

.alarm-display>div {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2px;
    color: var(--font-color-1);
    height: 100%;
}

.alarm-display>div>p {
    margin: 5px 0 0 0;
    font-size: 15px;


}

.alarm-display>div>i {
    font-size: 1.5em
}

.alarm-display>p {
    margin: 0 0 0 10px;
    font-size: 17px;

}
</style>