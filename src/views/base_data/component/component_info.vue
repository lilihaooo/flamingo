<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基本信息</span>
            </div>
          </template>
          <el-form label-width="90px" :inline="true">
            <el-form-item label="件名："> {{ component_info.name }}</el-form-item>
            <el-form-item label="件号："> {{ component_info.pn }}</el-form-item>
            <el-form-item label="手册号："> {{ component_info.manual_num }}</el-form-item>
            <el-form-item label="小组："> {{ component_info.group }}</el-form-item>
            <el-form-item label="改装数："> {{ component_info.modifies_count }}</el-form-item>
            <el-form-item label="证书信息："> {{ component_info.certificate_info }}</el-form-item>
            <el-form-item label="添加时间："> {{ component_info.created_at }}</el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" style="height: 430px">
          <template #header>
            <div class="clearfix">
              <span>详细信息</span>
            </div>
          </template>
          <el-form-item label="历史入厂数："> {{ component_info.income_total }} 件</el-form-item>
          <el-form-item label="索赔数："> {{ component_info.claim_total }} 件</el-form-item>
        </el-card>
      </el-col>


      <el-col :span="12">
        <el-card shadow="hover" style="height: 430px">
          <template #header>
            <div class="clearfix">
              <span>改装信息</span>
              <el-button type="primary" @click="showDialog" style="float: right;">添加</el-button>
            </div>
          </template>
          <el-table :data="modify_data" border style="width: 100%;">
            <el-table-column prop="title" label="标题" width="160"/>
            <el-table-column prop="modify_num" label="改装号" width="180"/>
            <el-table-column prop="version" label="版次号" width="80"/>
            <el-table-column fixed="right" label="操作">
              <template #default="{ row }">
                <el-button type="default" size="small" @click="delModify(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!--    添加改装的弹出层-->
    <el-dialog title="添加用户" v-model="dialogVisible" width="600px">
      <template #footer>
        <el-form :model="modify_form" :inline="false" label-width="120px">
          <el-form-item label="标题">
            <el-input v-model="modify_form.title" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="改装号">
            <el-input v-model="modify_form.num" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="版本">
            <el-input v-model="modify_form.version" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts" name="user">
import {ref} from 'vue';
import 'cropperjs/dist/cropper.css';
import {get_component_info, get_component_modify_info} from "../../../api/component_api";
import {ElMessage} from "element-plus";

import {useComponentStore} from "../../../store/component";
import {component_info_key} from "../../../utils/constant";
import {create_component_modify, del_modify_by_id} from "../../../api/modify_api";

const componentStore = useComponentStore()
const dialogVisible = ref(false);
const componentID = componentStore.id != 0 ? componentStore.id : localStorage.getItem(component_info_key)

function delModify(id: number) {
  del_modify_by_id(id).then(res => {
    if (res.data.code === 2000) {
      successMsg("删除成功")
      init_component_modify_info()
      init_component_info()
      componentStore.update()
      return
    } else {
      errorMsg("删除失败")
    }
  })
}


function onSubmit() {
  modify_form.value.component_id = Number(componentID)
  create_component_modify(modify_form.value).then(res => {
    if (res.data.code == 2000) {
      successMsg(res.data.msg)
      modify_form.value = {} as ModifyForm
      dialogVisible.value = false
      init_component_modify_info()
      init_component_info()
      componentStore.update()
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}

interface ModifyForm {
  title: string,
  num: string,
  version: string,
  component_id: number
}

let modify_form = ref({} as ModifyForm)

function init_component_modify_info() {
  get_component_modify_info(componentID as number).then(
      res => {
        if (res.data.code == 2000) {
          modify_data.value = res.data.data
        } else {
          errorMsg("请求数据失败")
        }
      })
}

init_component_modify_info()

const showDialog = () => {
  dialogVisible.value = true;
};


// 获取附件信息
interface ComponentInfo {
  name: string
  pn: string
  manual_num: string
  group: string
  modifies_count: number
  created_at: string
  state: boolean
  income_total: number
  claim_total: number
  certificate_info: string
}


const component_info = ref({} as ComponentInfo);

function init_component_info() {
  get_component_info(componentID as number).then(
      res => {
        if (res.data.code == 2000) {
          component_info.value = res.data.data
        } else {
          errorMsg("请求数据失败")
        }
      })
}

init_component_info()


const modify_data = ref([]);


const successMsg = (msg: string) => {
  ElMessage.success(msg)
}
const errorMsg = (msg: string) => {
  ElMessage.error(msg)

}
</script>

<style scoped>


.info-edit i {
  color: #eee;
  font-size: 25px;
}


</style>
