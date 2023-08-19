<script setup>

defineProps({
    value: String,
    name: String,
    timestamp: Date,
    showTS: Boolean,
    height: String
})

</script>
<template>
    <div class="order-box" :style="{height: height+ 'px'}" >
            <div class="order-box-basic">
                <h5>{{name}}</h5>
                <p>{{value}}</p>
            </div>
            <p  v-if=showTS class="order-box-ts">Since: {{timestamp.toLocaleString()}}</p>
        </div>
</template>

<style scoped>
.order-box {
    display: flex;
    width: 31%;
    padding: 2px; 
    min-width: 100px;
    flex-direction: column;
    height: 48%;
    margin: 3px;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);

}

.order-box h5 {
    margin: 5px 15px;
    word-wrap: break-word;
    font-size: 1em;
    padding: 1px;
    width: 90%;
    border-bottom: 1px solid var(--border-color-1);
}

.order-box-basic {
    display: flex;
    flex-direction: column;
    height: 70%;
}

.order-box-basic>p {
    font-size: larger;
    font-size: 1.3em;
    color: var(--theme-color-2);
    width: 100%;
    padding: 0px 5px;
    margin: 0 0 0 10px;
}

.order-box-ts {
    margin: 5px 15px;
    color: var(--theme-color-2);
    padding: 2px;
    font-weight: bold;
    width: 90%;
    border-top: 1px solid var(--border-color-1);
}

</style>