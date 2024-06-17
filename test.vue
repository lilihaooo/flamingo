<script setup>

</script>

<template>
  <el-table
      :data="userAuthorizeTableData"
      border
      style="width: 100%;margin-top: 5px"
  >
    <el-table-column prop="manual_num" label="手册号" width="200"/>
    <el-table-column prop="certificates" label="证书" width="260"/>
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button type="info" size="small" @click="authorizeManage(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>