<script setup>
import { onMounted } from "vue"
import { useMiscStore } from "@/stores/miscStore"
const miscStore = useMiscStore()

function setOrderData() {
    miscStore.initOrderData()
}

onMounted(() => {
    setOrderData()
})

</script>
<template>
    <section class="misc-order-data">
        <div class="order-box" v-for="el in miscStore.getOrderData" :key="el.nodeName">
            <div class="order-box-basic">
                <h5>{{el.displayName}}</h5>
                <p>{{el.value}}</p>
            </div>
            <p  v-if=el.showTS class="order-box-ts">Since: {{el.timestamp.toLocaleString()}}</p>
        </div>

    </section>
</template>
<style scoped>
.misc-order-data {
    display: flex;
    flex-wrap: wrap;
}


p {
    margin: 0;
}

.order-box {
    display: flex;
    min-width: calc(15% - 5px);
    flex-direction: column;
    min-height: 20%;
    min-height: 40px;
    margin: 5px;
    border: 1px solid var(--border-color-1);
    border-radius: 1px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);

}

.order-box h5 {
    margin: 5px 15px;
    word-wrap: break-word;
    font-size: 15px;
    padding: 1px;
    width: 90%;
    border-bottom: 1px solid var(--border-color-1);
}

.order-box-basic {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.order-box-basic>p {
    font-size: larger;
    font-size: 20px;
    color: var(--theme-color-2);
    width: 50%;
    padding: 5px;
    margin-left: 10px;
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