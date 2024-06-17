<template>
  <div class="table-container">
    <el-table :data="tableData" border style="width: 75%">
      <el-table-column fixed="left" type="index" label="#" width="40"/>
      <el-table-column prop="task_num" label="任务号" width="120"/>
      <el-table-column prop="user_name" label="责任人" width="120"/>
      <el-table-column prop="component_name" label="件名" width="160"/>
      <el-table-column prop="component_name" label="要求" width="100"/>
      <el-table-column prop="custom_name" label="公司" width="180"/>
      <el-table-column prop="type" label="类型" width="80"/>
      <el-table-column fixed="right" label="操作" >
        <template #default="scope">
          <el-button type="primary" size="small" @click="taskListToEdit(scope.row.id)">详细</el-button>
          <el-button type="danger" size="small" @click="taskListToEdit(scope.row.id)">拒绝</el-button>
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
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {useUserStore} from "../../store/user";
import {get_list_approve} from "../../api/task_api";
import {ElMessage} from "element-plus";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

function taskListToEdit(id: string) {
  router.push({name: 'edit_task', params: {id}});
}


interface TableData {
  index: number
  task_num : string
  custom_name : string
  component_name : string
  pn : string
  sn : string
  user_name : string
  type : string
}


// 分页
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
  getListApproveData(val, currentPage.value, "", sortData.value);
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getListApproveData(pageSize.value, val, "", sortData.value);
}


function getListApproveData(pageSize: number, currentPage: number, keyword: string, sort:any = null) {
  get_list_approve(pageSize, currentPage, keyword, sort).then(
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
getListApproveData(pageSize.value, currentPage.value, "");

const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}

const successMsg = (msg: string) => {
  ElMessage.success(msg)
}


</script>
