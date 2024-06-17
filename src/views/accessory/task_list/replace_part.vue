<template>
  <div>
    <!--    描述列表-->
    <el-descriptions :column="5">
      <el-descriptions-item label="手册号" width="20%">{{ taskInfo.manual_num }}</el-descriptions-item>
      <el-descriptions-item label="件名" width="20%">{{ taskInfo.component_name }}</el-descriptions-item>
      <el-descriptions-item label="客户" width="20%">{{ taskInfo.custom_name }}</el-descriptions-item>
      <el-descriptions-item label="需求" width="20%">{{ taskInfo.demand }}</el-descriptions-item>
      <el-descriptions-item label="改装数" width="20%">
        {{ taskInfo.modify_nums ? taskInfo.modify_nums.length : 'N/A' }}
      </el-descriptions-item>
    </el-descriptions>
    <hr style="margin-bottom: 15px">
    <!--    添加表单-->
    <el-form :inline="true" :model="addMForm" class="demo-form-inline">
      <el-form-item label="图像号">
        <el-autocomplete
            v-model="rubbish"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable
            placeholder="请选择"
            value-key="image_num"
            style="width: 80px"
        />
      </el-form-item>
      <el-form-item label="件号">
        <span style="width: 120px;">{{ PN }}</span>
      </el-form-item>
      <el-form-item label="库存">
        <span :style="{ color: Count == 0 ? 'red' : '' }">{{ Count }}</span>
      </el-form-item>
      <el-form-item label="名称">
        <span style="width: 140px;">{{ MaterialName }}</span>
      </el-form-item>

      <el-form-item label="数量">
        <el-input-number v-model="addMForm.count" :min="1" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="类别">
        <el-select
            v-model="addMForm.type"
            clearable
            style="width: 80px"
        >
          <el-option label="必换" :value="1"/>
          <el-option label="损坏" :value="2"/>
          <el-option label="缺失" :value="3"/>
          <el-option label="改装" :value="4" v-if="taskInfo.modify_nums"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAddItem">添加</el-button>
        <el-button type="primary" @click="onSubmit">一键添加必换件</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%" max-height="350">
      <el-table-column type="index" label="序号" width="60"/>
      <el-table-column prop="image_num" label="图像号" width="80"/>
      <el-table-column prop="pn" label="件号" width="160"/>
      <el-table-column prop="need_count" label="数量" width="80"/>
      <el-table-column prop="name" label="名称" width="160"/>
      <el-table-column prop="type" label="类别" width="80"/>
      <el-table-column prop="is_must_replace" label="是否必换" width="90"/>
      <el-table-column prop="get_count" label="已领数" width="80"/>
      <el-table-column prop="b_num" label="批次号" width="120"/>
      <el-table-column prop="state" label="状态" width="120"/>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteRow(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="width: 100%;background-color: #abe0ff" @click="enroll" v-if="tableData.length > 0">完成登记
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import {reactive, watch} from 'vue'
import {ref} from 'vue'
import {useRoute} from "vue-router";
import {changeComponentState} from "../../../api/component_api";
import {add_task_replace, enroll_task_replace, get_task_info, get_task_replace_list} from "../../../api/task_api";
import {errorMsg, successMsg} from "../../../utils/constant";
import {get_manual_list, get_manual_material_option_list} from "../../../api/manual_api";
import {ta} from "element-plus/es/locale";

const route = useRoute();

let rubbish = ref('')

interface RestaurantItem {
  manual_material_id: number
  image_num: string
  pn: string
  material_name: string
  count: number
}

// 获取手册的图像号联想下拉列表
function getManualMaterialList(manual_id: number) {
  // 生成任务号
  get_manual_material_option_list(manual_id).then(res => {
    if (res.data.code == 2000) {
      restaurants.value = res.data.data ?? []
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}

function enroll() {
  // 完成登记
  enroll_task_replace(taskInfo.value.id).then(res => {
    if (res.data.code == 2000) {
      GetTaskReplaceList(taskInfo.value.id)
      successMsg("登记成功")
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}

const restaurants = ref<RestaurantItem[]>([])
const querySearch = (queryString: string, cb: any) => {

  const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
  // call callback function to return suggestions
  cb(results)
}

const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
        restaurant.image_num.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const handleSelect = (item: RestaurantItem) => {
  addMForm.value.manual_material_id = item.manual_material_id
  PN.value = item.pn
  MaterialName.value = item.material_name
  Count.value = item.count
}

const PN = ref("")
const MaterialName = ref("")
const Count = ref(0)


const deleteRow = (index: number) => {
  console.log("删除")
}
const onAddItem = () => {
// 添加记录
  if (addMForm.value.manual_material_id == null) {
    rubbish.value = ""
    errorMsg("图像号不存在")
    return
  }
  addMForm.value.task_id = taskInfo.value.id
  // 发起请求
  add_task_replace(addMForm.value).then(res => {
    if (res.data.code == 2000) {
      GetTaskReplaceList(taskInfo.value.id)
    } else {
      errorMsg(res.data.msg)
    }
  })


  // 数据复位
  addMForm.value = {
    type: 1,
    count: 1
  } as AddMForm
  PN.value = ""
  MaterialName.value = ""
  rubbish.value = ""
  Count.value = 0

}
// 一键添加必换件
const onSubmit = () => {
  console.log('submit!')
}

interface TableData {
  image_num: string
  pn: string
  need_count: number
  name: string
  type: string
  is_must_replace: string
  version: number
  get_count: number
  state: string
}

const tableData = ref<TableData[]>([])


interface AddMForm {
  task_id: number
  manual_material_id: number
  image_num: string
  pn: string
  count: number
  type: number
}

const addMForm = ref<AddMForm>({
  count: 1,
  type: 1
} as AddMForm)


interface TaskInfo {
  id: number// 任务id 不显示
  manual_num: string// 手册号
  manual_id: number// 手册id
  component_name: string// 件名
  custom_name: string// 客户
  demand: string// 需求
  modify_nums: string[]// 改装名数组
}

const taskInfo = ref<TaskInfo>({} as TaskInfo)

// 获取taskInfo
function GetTaskInfo(id: number) {
  get_task_info(id).then(res => {
    if (res.data.code == 2000) {
      taskInfo.value = res.data.data
      // 任务信息更改后 换件列表和图像号选择框中的数据都要从新查询
      getManualMaterialList(taskInfo.value.manual_id)
      GetTaskReplaceList(taskInfo.value.id)
    } else {
      errorMsg("获取任务信息失败")
      return
    }
  })

}

watch(route, (newValue, oldValue) => {
  let path = oldValue.path.replace(/\/[^\/]+$/, '')
  if (path == '/accessory/task_list/edit_task') {
    GetTaskInfo(Number(newValue.params.id))
  }
})

// watch(taskInfo, (newValue, oldValue) => {
//   if (newValue.manual_id != undefined ) {
//     // getManualMaterialList(newValue.manual_id)
//   }
// })


GetTaskInfo(Number(route.params.id))

function GetTaskReplaceList(id: number) {
  get_task_replace_list(id).then(res => {
    if (res.data.code == 2000) {
      tableData.value = res.data.data
    } else {
      errorMsg(res.data.msg)
    }
  })
}


</script>

<style>
</style>
