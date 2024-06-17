<template>
  <div>
    <div >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed="left" type="index" label="#" width="40"/>
        <el-table-column    label="任务号" width="100">
          <template #default="scope">
            <el-link type="primary" @click="toTaskListEdit(scope.row.id,  scope.row.task_num)" :underline="false">{{scope.row.task_num}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="custom_name" label="公司" width="140"/>
        <el-table-column prop="component_name" label="件名" width="160"/>
        <el-table-column prop="pn" label="件号" width="120"/>
        <el-table-column prop="sn" label="序号" width="120"/>
        <el-table-column prop="demand" label="需求" width="70"/>
        <el-table-column prop="node" label="节点" width="80"/>
        <el-table-column prop="created_at" label="入厂时间" width="100"/>
        <el-table-column prop="plan_release_date" label="计划放行" width="100"/>
        <el-table-column prop="modify_count" label="改装数" width="70"/>
        <el-table-column fixed="right" label="操作" >
          <template #default="scope">
            <el-tooltip v-if="scope.row.node == '已分配'" content="故检申请" placement="bottom" effect="light">
              <el-button  type="success" @click="check(scope.row.id, scope.row.task_num)"
                          size="small" :icon="Promotion"/>
            </el-tooltip>
            <el-tooltip v-else content="已完成" placement="bottom" effect="light">
              <el-button  type="info" disabled size="small" :icon="Promotion"/>
            </el-tooltip>


            <el-tooltip content="清单管理" placement="bottom" effect="light">
              <el-button   @click="toTaskListEdit(scope.row.id, scope.row.task_num)" type="success" size="small" :icon="Tickets"/>
            </el-tooltip>

            <el-tooltip content="任务变更" placement="bottom" effect="light">
              <el-button type="primary" :icon="Edit" size="small" circle />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {
  get_component_certificate_info,
} from "../../api/component_api";
import {ElMessage} from "element-plus";
import { get_my_tasking_paging_list} from "../../api/task_api";
import {useUserStore} from "../../store/user";
import {useRoute, useRouter} from "vue-router";
import {  Promotion, Tickets, Edit } from '@element-plus/icons-vue'
const userStore = useUserStore();
const searchVal = ref('')
const isSearch = ref(false)
const router = useRouter();
const route = useRoute();

//
function check(id: number, task_num: string){
  router.push({name: 'check_apply', params: {id:id, task_num: task_num}});
}

// 跳转到任务清单编辑
function toTaskListEdit(id: number, task_num: string){
  router.push({name: 'edit_task', params: {id:id, task_num: task_num}});
}

interface TableData {
  id: number,
  task_num: string,
  custom_name: string,
  component_name: string,
  pn: string,
  sn: string,

  demand: string,
  certificates: string,
  modify_count: number,
  node: string,
  plan_release_date: string,
  created_at: string,
}

interface SortType {
  field: string
  order: string
}
const sortData = ref<SortType|null>(null);
const tableData = ref<TableData[]>([])
const currentPageKey = `${userStore.getUserName}_${route.path}_currentPage`;
const pageSizeKey = `${userStore.getUserName}_${route.path}_PageSize`;
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const handleSizeChange = (val: number) => {
  localStorage.setItem(pageSizeKey, val.toString())
  getMyTaskData(val, currentPage.value, searchVal.value, sortData.value);
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getMyTaskData(pageSize.value, val, searchVal.value, sortData.value);
}


interface ConditionObj {
  key: string,
  value: string
}
const conditionObj = ref<ConditionObj[]>([{
  key: "user_id",
  value: userStore.getUserID.toString()
}])
function getMyTaskData(pageSize: number, currentPage: number, keyword: string, sort:any = null) {
  if (isSearch.value == false){
    keyword = ""
  }
  get_my_tasking_paging_list(pageSize, currentPage, keyword, sort, conditionObj.value).then(
      res => {
        if (res.data.code == 2000) {
          tableData.value = res.data.data.list;
          total.value = res.data.data.count;
        } else {
          errorMsg(res.data.msg)
          return
        }

      }
  );
}
currentPage.value = parseInt(localStorage.getItem(currentPageKey) || "1");
pageSize.value = parseInt(localStorage.getItem(pageSizeKey) || "10");
getMyTaskData(pageSize.value, currentPage.value, searchVal.value);

const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}

const successMsg = (msg: string) => {
  ElMessage.success(msg)
}

const component_name = ref('')
const component_id = ref(0)

const form = ref<FormType>({} as FormType)

interface FormType {
  pn: string
  sn: string
  custom_id: number
  demand_type: number
  modify_ids: number[]
  certificate_ids: number[]
  group_id: number
  plan_release_date: string
  remark: string
}

interface ComponentCertificate {
  id: number
  title: string
}
const component_certificates = ref<ComponentCertificate[]>([])
// 监听附件名称是否改变
// 改变了同时不为空说明一定获取到了某个附件信息
// 这时候发请求获取该附件的证书清单
watch(component_name, (newValue, oldValue) => {
  if (newValue != null){
    // 获取附件信息
    get_component_certificate_info(component_id.value).then(
        res => {
          if (res.data.code == 2000) {
            component_certificates.value = res.data.data
            console.log(component_certificates.value)
          } else {
            errorMsg(res.data.msg)
            return
          }
        }
    );
    console.log(component_id)
  }
})
</script>


<style scoped>


</style>