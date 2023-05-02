<script setup>
import { onMounted } from "vue"
import { useMiscStore } from "@/stores/machine/miscStore"
const miscStore = useMiscStore()

// function setOrderData() {
//     miscStore.initOrderData()
// }

// onMounted(() => {
//     setOrderData()
// })

</script>
<template>
    <section class="misc-order-data">
        <div class="calc-box" v-for="el in miscStore.getCalculatedData" :key="el.nodeName">
            <div class="order-box-basic">
                <h5>{{ el.displayName }}</h5>
                <div class="values">
                    <p >{{ el.value }}</p>
                    <span>{{ el.unit }}</span>
                </div>
            </div>

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

.calc-box {
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

.calc-box h5 {
    margin: 5px 15px;
    word-wrap: break-word;
    font-size: 15px;
    padding: 1px;
    width: 90%;
    border-bottom: 1px solid var(--border-color-1);
}

.calc-box-basic {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.values{
    display: flex;
}

.values > p {
    font-size: larger;
    font-size: 20px;
    color: var(--theme-color-2);
    width: 60%;
    padding: 5px;
    margin-left: 10px;
}

.values > span{
    font-size: larger;
    font-size: 20px;
    color: var(--theme-color-1);
    width: 40%;
    padding: 5px;
    margin-left: 10px;
}

</style>