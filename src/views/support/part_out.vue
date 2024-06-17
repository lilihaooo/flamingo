// YourComponent.vue
<template>
  <div>
    <el-input v-model="data.content"></el-input>
    <el-button type="success" @click="sendMessageToWebSocket">Send Message</el-button>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {GlobalWs, sendMessage} from "../../utils/websocket";
const data = ref({
  to: 29,
  content: "",
  type: 2
})

const sendMessageToWebSocket =  () => {
  sendMessage(GlobalWs, data.value);
}




</script>
