<script setup>
import { computed } from "vue"
import {useRouter, useRoute} from 'vue-router';
import { useLineDataStore } from "@/stores/line/lineData"

const route = useRoute()
const router = useRouter()
const lineStore = useLineDataStore()

let rRate = 60

const getRoute = computed(() => {
    
    let type = route.meta.type
    if (type == "line") {
        return lineStore.getLineName
    }

    if (type == "machine") {
        return "Machine 1"
    }

    if (type == "home") {
        return "Home"
    }

    return ""

})

function setRefreshRate(){
    lineStore.setRefreshInterval(rRate)

}

function switchRoute(index){
    let rArr = route.path.split("/")
    if (index >= 0){
        router.push("/"+rArr[1])
    }else{
        router.push("/")
    }
}


</script>

<template>
    <nav>
        <div class="nav-logo">
            <p>LM</p>
        </div>
        <div class="nav-routes">
            <div class="nav-icon" @click="switchRoute(-1)">
                <i class="bi bi-house nav-icon" ></i>
            </div>
            <div class="nav-icon-alt" v-if="route.meta.type=='machine'" @click="switchRoute(0)">
                <i class="bi bi-bezier2"></i>
            </div>
            <div class="nav-route-name">
                <p>{{ getRoute }}</p>
            </div>
        </div>
        <div class="nav-refresh">
            <div class="nav-icon">
                <i class="bi bi-arrow-clockwise "></i>
            </div>
            <input type="number" min="10" v-model="rRate" @change="setRefreshRate()">
            <span style="padding:5px">s</span>
        </div>
    </nav>
</template>

<style>
nav {
    height: 2.5vh;
    margin: 0.5vh 0.2vh 0.2vh 0.5vh;
    display: flex;
    border-radius: 3px;
}

.nav-logo {
    border: 1px solid var(--border-color-1);
    height: 2.4vh;
    width: 2.4vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: var(--theme-color-1);
    border-radius: 4px;
    padding: 4px;
    font-weight: bold;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.nav-routes {
    height: 2.3vh;
    margin-left: 20px;
    display: flex;
    align-items: center;


}

.nav-refresh {
    height: 2.3vh;
    background: white;
    margin-left: 20px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    box-shadow: 1px 1px 4px 0px var(--border-color-1);

}

.nav-refresh>input {
    width: 5vw;
    height: 2.3vh;
    border: none;
    background: white;
    border-radius: 4px;
    font-size: 15px;
    padding-left: 2vw;
    font-weight: bolder;

}

.nav-icon {
    font-size: 20px;
    background: var(--theme-color-1);
    padding: 2px;
    height: 2.3vh;
    width: 2.3vh;
    color: var(--font-color-1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    cursor: pointer;
}

.nav-route-name {

    box-shadow: 1px 1px 4px 0px var(--border-color-1);
    height: 2.3vh;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: var(--font-color-1);
    color: var(--theme-color-2);
    font-weight: bolder;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.nav-icon-alt{
    font-size: 20px;
    background: var(--theme-color-2);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 2px;
    height: 2.3vh;
    width: 2.3vh;
    color: var(--font-color-1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>