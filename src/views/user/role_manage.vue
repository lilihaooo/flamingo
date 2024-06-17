<template>
  <div>
    <el-row :gutter="20">
      <!--    左边-->
      <el-col :span="9">
        <el-card shadow="hover" style="height: 580px">
          <template #header>
            <div class="clearfix">
              <span>人员列表</span>
            </div>
          </template>
          <!--    搜索框-->
          <div style="margin-bottom: 5px">
            <el-input
                v-model="searchVal"
                placeholder="用户名  /  小组"
                style="width: 200px; margin-right: 5px"
            />
            <el-button
                :icon='Search'
                circle
                :style="{ backgroundColor: isSearch ? '#a6deff' : '' }"
                @click="clickSearch"
            />
          </div>
          <el-table :data="tableData" border  style="width: 100%;">
            <el-table-column prop="id" label="ID" width="50"/>
            <el-table-column prop="user_name" label="用户名" width="120"/>
            <el-table-column prop="group" label="小组" width="80"/>
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button type="primary" size="small"
                           @click="role_manage(scope.row.id, scope.row.user_name)"
                           :class="{ 'selected-row': scope.row.id === card_id }"
                >
                  角色管理
                </el-button>
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
        </el-card>
      </el-col>

      <!--    右边-->
      <el-col :span="15">
        <el-card shadow="hover" style="height: 580px">
          <template #header>
            <div class="clearfix">
              <span>角色管理 :{{ card_name }}</span>
            </div>
          </template>
          <div v-if="roleInfoVisible">
            <!--            穿梭框-->
            <el-transfer :titles="title" :props="props" v-model="optioned_data" :data="all_option_data"/>
            <el-button type="success" @click="user_role_save()" style="margin-top: 15px">保存</el-button>
          </div>
          <div v-else>
            <el-empty description="请选择人员"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {reactive, Ref, ref} from "vue";
import {ElMessage} from 'element-plus'
import {useUserStore} from "../../store/user";
import {
  changeUserManualCertificateState,
  createUserAuthorize,
  getUserAuthorizeList, getUserRoleList,
  getUserTableList, set_user_roles
} from "../../api/user_api";
import {Search} from "@element-plus/icons-vue"
import {all_role_list_api} from "../../api/role_api";

const searchVal = ref('')
const isSearch = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const route = useRoute();
const userStore = useUserStore();
const currentPageKey = `${userStore.getUserName}_${route.path}_currentPage`;
const pageSizeKey = `${userStore.getUserName}_${route.path}_PageSize`;
currentPage.value = parseInt(localStorage.getItem(currentPageKey) || "1");
pageSize.value = parseInt(localStorage.getItem(pageSizeKey) || "10");
const router = useRouter();

const card_name = ref("")
const card_id = ref(0)

const roleInfoVisible = ref(false)
// ------穿梭框-----begin
const all_option_data = ref<Option[]>([])
const optioned_data = ref<number[]>([])
const title = ['全部角色', '已选角色']
const props = {key:'id', label: 'title'}

interface Option {
  key: number
  label: string
}
function GetAllRoleList() {
  all_role_list_api().then(
      res => {
        if (res.data.code == 2000) {
          all_option_data.value = res.data.data;
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}
GetAllRoleList()
function user_role_save(){
  set_user_roles(card_id.value,optioned_data.value).then(
      res => {
        if (res.data.code == 2000) {
          successMsg(res.data.msg)
          return
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}

function role_manage(user_id: number, user_name: string) {
  card_name.value = user_name
  card_id.value = user_id
  roleInfoVisible.value = true
  // 获取人员的角色信息
  getUserRoleData(user_id)
}

function getUserRoleData(id: number) {
  getUserRoleList(id).then(
      res => {
        if (res.data.code == 2000) {
          optioned_data.value = res.data.data;
        } else {
          errorMsg(res.data.msg)
        }
      }
  );
}







function clickSearch() {
  if (searchVal.value.trim() != '') {
    isSearch.value = true
  }
  getUserListData(pageSize.value, currentPage.value, searchVal.value);
}



const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}

const successMsg = (msg: string) => {
  ElMessage.success(msg)
}


const tableData = ref([]);


const handleSizeChange = (val: number) => {
  localStorage.setItem(pageSizeKey, val.toString())
  getUserListData(val, currentPage.value, "");
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getUserListData(pageSize.value, val, "");
}


function getUserListData(pageSize: number, currentPage: number, keyword: string) {
  getUserTableList(pageSize, currentPage, keyword).then(
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

getUserListData(pageSize.value, currentPage.value, "");
</script>

<style scoped>
.selected-row {
  background-color: #0745CBFF; /* 设置您喜欢的背景颜色 */
}
</style>