<template>
<div>
  <el-tabs type="border-card">
    <el-tab-pane label="换件">
      <replace_part></replace_part>
    </el-tab-pane>
    <el-tab-pane label="外委">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="Date" width="180"/>
        <el-table-column prop="name" label="Name" width="180"/>
        <el-table-column prop="address" label="Address"/>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="自修">
      Role
    </el-tab-pane>
    <el-tab-pane label="探伤">
      Task
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import replace_part from "./replace_part.vue";
interface Task {
  name: string
  pn: string
  sn: string
}

const task: Task = {
  name: '喷嘴',
  pn: '3830416-1',
  sn: 'AFF10031'
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style scoped></style>

