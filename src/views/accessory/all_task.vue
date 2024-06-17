

<template>
<div>
  <h1>全部任务</h1>
  <el-button type="primary" @click="commit()">Primary</el-button>
  <el-select v-model="value" class="m-2" placeholder="Select">
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('3')

function commit(){
  console.log(value.value)
}

const options = [
  {
    value: '1',
    label: 'Option1',
  },
  {
    value: '2',
    label: 'Option2',
  },
  {
    value: '3',
    label: 'Option3',
  }
]
</script>

<style scoped>

</style>