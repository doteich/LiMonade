<script setup>
defineProps({
  value: String,
  name: String,
  timestamp: Date,
  showTS: Boolean,
  height: String,
  label: String
})
</script>
<template>
  <div class="order-box">
    <div class="order-box-meta">
      <h5>{{ name }}</h5>
      <p>{{label}}</p>
    </div>
    <div class="order-box-data">
      <p>{{ value }}</p>
      <span v-if="showTS">{{timestamp.toLocaleString()}}</span>
    </div>
  </div>
</template>

<style scoped>
.order-box {
  display: flex;
  flex-direction: column;
  width: 32%;
  ;
  min-width: 200px;
  height: 30%;
  margin: 3px;
  border: 1px solid var(--border-color-1);
  border-radius: 1px;
  box-shadow: 1px 1px 4px 0px var(--border-color-1);
}

.order-box-meta > h5 {
  word-wrap: break-word;
  font-size: 1em;
  margin: 0;
  width: 100%;
  padding: 2px;
}

.order-box-meta {
  border-bottom: 1px solid var(--border-color-1);
  display: flex;
  align-items: flex-start;
  height: 40%;
  flex-direction: row;
  width: 100%;
  padding: 0px 0 0 2px;
}

.order-box-meta > p {
  padding: 0;
  margin: 0;
  height: 18px;
  width: 18px;
  font-size: 13px;
  font-weight: bolder;
  color: var(--font-color-1);
  text-align: center;
  margin-left: auto;
  background: var(--theme-color-2);
  border-bottom-left-radius: 5px;
}

.order-box-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 60%;
  

}

.order-box-data > p {
  font-size: 20px;
  padding: 0px 3px;
  margin: 0;
 
}


.order-box-data >span{
    margin-left: auto;
    align-self: flex-end;
    margin-top: auto;
    font-size: 11px;
    padding: 1px 2px;
    background: var(--theme-color-2);
    color: var(--font-color-1);
    word-wrap: none;
}
</style>