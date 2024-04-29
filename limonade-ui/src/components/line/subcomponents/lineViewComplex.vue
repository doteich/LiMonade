<script setup>
import { useLineDataStore } from "@/stores/line/lineData"
import { computed, watch, reactive } from 'vue';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Timeline from 'primevue/timeline';

const store = useLineDataStore()
const router = useRouter()

let state = reactive({
  alarms: [],
  states: []
})

function switchRoute(name) {
    router.push(router.currentRoute.value.fullPath + "/" + name)
}


const { getAlarms, getStates } = storeToRefs(store)

const line = router.currentRoute.value.fullPath.replace("/", "")

const visu = computed(() => {
  let machines = store.getMachines

  let maxLevel = Math.max(...machines.map(e => e.lvl))


  let struct = []

  for (let i = 0; i <= maxLevel; i++) {
    struct.push([])
  }
  machines.forEach(m => {
    struct[m.lvl].push(m)
  })
  return struct

})


function getAlarmName(id, mid) {
  if (state.alarms.length > 0) {
    return state.alarms.filter(a => a.id == id && a.mid == mid).length > 0 ? state.alarms.filter(a => a.id == id && a.mid == mid)[0].name : ""

  } else {
    return "🔜"
  }
}

function getStateName(id, mid) {
  if (state.states.length > 0) {
    return state.states.filter(a => a.id == id && a.mid == mid).length > 0 ? state.states.filter(a => a.id == id && a.mid == mid)[0].name : ""

  } else {
    return "🔜"
  }
}


watch(getAlarms, (nState) => {
  nState.forEach(async (el, idx) => {
    if (el.aid > 0) {

      let aRes = await store.fetchAlarmDescription(line, el.mid, el.aid)

      if (!aRes) {

        let unknown = { id: el.aid, name: "Unknown", mid: el.mid }
        state.alarms[idx] = unknown
      } else {
        aRes.mid = el.mid
        state.alarms[idx] = aRes
      }
    }
  })
})

watch(getStates, (nState, oState) => {


  nState.forEach(async (el, idx) => {
    if (oState.some(e => e.sid == el.sid && e.mid == el.mid)) {
      return
    }
    let sRes = await store.fetchStateDescription(line, el.mid, Number(el.sid))

    if (!sRes || sRes == undefined) {
      let unknown = { id: el.sid, name: "Unknown", mid: el.mid }
      state.states[idx] = unknown
    } else {
      sRes.mid = el.mid
      state.states[idx] = sRes
    }

  })
})

function getStateColor(id, mid) {
  
  let s = state.states.filter(a => a.id === Number(id) && a.mid === mid)


  if (s.length < 1) {
      return 'var(--schema-neutral)'
  }

  switch (s[0].schema) {
      case 'critical':
          return 'var(--schema-critical)'
      case 'bad':
          return 'var(--schema-bad)'
      case 'good':
          return 'var(--schema-good)'
      default:
          return 'var(--schema-neutral)'
  }
}



</script>

<template>
  <section class="line-view-complex">


    <div v-for="(lvl, index) in visu" class="level">

      <div v-for="machine in lvl" class="machine-block" >
        <div class="machine" @click="switchRoute(machine.id)">
          <p class="state"><span :style="{ 'backgroundColor': getStateColor(machine.state, machine.id) }">{{ machine?.state }}</span> {{ getStateName(machine.state, machine.id) }} </p>
          <div class="visu-content">
            <img src="../../../assets/packing-machine-svgrepo-com.svg" v-if="machine.alarm == 0">
            <div class="alarm" v-else>
              <div class="alarm-num">
                <i class="bi bi-exclamation-diamond"></i>
                <p>{{ machine?.alarm.toString().slice(0, 3) }}</p>
              </div>
              <p> {{ getAlarmName(machine.alarm, machine.id) }}</p>
            </div>
          </div>
          <p class="name">{{ machine?.name }} </p>
        </div>
        <div class="connector" v-if="index != visu.length - 1">

        </div>
      </div>
    </div>
  </section>
</template>

<style>
.line-view-complex {
  display: flex;
  width: 100%;
  height: 25.5vh;
  justify-content: space-evenly;
  color: var(--theme-color-2);

}


.level {
  margin: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 13%;
  max-width: 13%;
  height: 90%;
}


/* .line-view-complex:before {
  content: "";
  position: absolute;
  top: 24%;
  z-index: 1;
  margin-left: -10px;
  width: 100%;
  height: 3px;
  background: #ccc;
} */

.machine-block {
  margin: 5px;
  display: flex;
  height: 50%;
  width: 100%;
}

.machine {
  width: 100%;
  margin: 5px 0;
  height: 100%;
  box-shadow: 1px 1px 4px 0px grey;
  cursor: pointer;
}

img {
  width: 4em;
}

.state {
  display: flex;
  height: 30%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color-1);
}

p {
  margin: 0;
}



.state>span {
  display: inline-block;
  height: 100%;
  padding-top: 3.5%;
  font-weight: bold;
  text-align: center;
  overflow: hidden;
  color: white;
  vertical-align: middle;
  width: 20%;
  margin-right: 5px;
}

.visu-content {
  height: 40%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color-1);
  padding: 2px;
  font-weight: bold;
}

.alarm {
  display: flex;

  width: 100%;
  animation-name: example;
  animation-duration: 2s;
  max-height: 7vh;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0px 0px 2px 0px crimson;
  align-items: flex-start;
  height: 100%;

}

.alarm>p {
  padding: 2px;
  margin: 0;

  width: 100%;
  vertical-align: middle;
}

.alarm-num {
  background: crimson;
  color: white;
  padding: 5px 10px;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  justify-content: stretch;
  width: 21%;
  text-wrap: wrap;
}

.connector {
  height: 55%;
  width: 20%;
  margin-left: 6%;
  border-bottom: 3px solid var(--border-color-1);
}

.alarm-num>p {
  margin: 0;

}

.alarm-num>i {
  font-size: 20px;
}
</style>