<template>
  <div>

    <el-form :model="form" :inline="true" label-width="120px" style="margin-top: 40px">
      <el-form-item label="名称">
        <el-input v-model="form.name" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="件号">
        <el-input v-model="form.pn" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="form.bn" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="仓位号">
        <el-input v-model="form.storage_num" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="数量">
        <el-input-number v-model="form.count"  style="width: 220px"/>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="form.unit" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="制造商">
        <el-input v-model="form.manufacturer" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="form.price" style="width: 220px"/>
      </el-form-item>
      <el-form-item label="最少数量">
        <el-input-number v-model="form.min_count" :min="1"/>
      </el-form-item>

      <el-form-item label="过期时间">
        <el-date-picker
            v-model="form.expiry_at"
            type="date"
            placeholder="Pick a date"
            style="width: 220px"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" style="width: 400px"/>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px; margin-left: 80px">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button>重置</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'


const form = reactive({
  name : "",
  pn : "",
  bn : "",
  storage_num : "",
  count : "",
  unit : "",
  manufacturer : "",
  price : "",
  min_count : "",
  created_at : "",
  expiry_at : "",
  remark : "",
})

const onSubmit = () => {
  console.log('submit!')
}
</script>
