<template>
  <div>
    <el-row :gutter="20">
      <!--    左边-->
      <el-col :span="9">
        <el-card shadow="hover" style="height: 580px">
          <template #header>
            <div class="clearfix">
              <span>人员列表</span>
              <span style="float: right">
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
              </span>
            </div>
          </template>
          <!--    搜索框-->



          <el-table :data="tableData" border style="width: 100%;">
            <el-table-column prop="id" label="ID" width="50"/>
            <el-table-column prop="user_name" label="用户名" width="120"/>
            <el-table-column prop="group" label="小组" width="80"/>
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button type="primary" size="small"
                           @click="create_authorize(scope.row.id, scope.row.user_name)"
                           :class="{ 'selected-row': scope.row.id === authorizeCreateForm.user_id }"
                >
                  授权管理
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
              <span>授权管理 :{{ card_name }}</span>
              <span style="float: right" v-if="card_name != '' ">
                <el-button type="primary" @click="showDialog">添加</el-button>
              </span>
            </div>
          </template>
          <div v-if="authorizeInfoVisible">

            <!--    列表-->
            <el-table :data="tableDataZ" :row-key="(row : TableDateZ )=> row.manual_num"  style="width: 100%">
              <el-table-column type="expand">
                <template #default="props">
                    <el-table :data="props.row.certificates" :border="true">
                      <el-table-column label="证书" prop="name"/>
                      <el-table-column label="添加时间" prop="created_at"/>
                      <el-table-column prop="state" label="状态" width="100">
                        <template #default="scope ">
                          <el-switch
                              v-model="scope.row.state"
                              class="ml-2"
                              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                              @change="changeState(scope.row)"/>
                        </template>
                      </el-table-column>
                    </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="manual_num"/>
            </el-table>

          </div>
          <div v-else>
            <el-empty description="请选择人员"/>
          </div>
        </el-card>
      </el-col>


    </el-row>


    <!--    弹出层-->
    <el-dialog title="添加权限" v-model="dialogVisible" width="600px">
      <template #footer>
        <el-form :model="authorizeCreateForm" :inline="false" label-width="120px" style="height: 420px">
          <el-form-item label="手册号">
            <el-autocomplete
                v-model="rubbish"
                :fetch-suggestions="querySearch"
                @select="handleSelect"
                clearable
                placeholder="请选择"
                value-key="manual_num"
                style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="证书">
            <el-checkbox-group v-model="authorizeCreateForm.certificate_ids">
              <el-checkbox :label="1">CAAC</el-checkbox>
              <el-checkbox :label="2">FAA</el-checkbox>
              <el-checkbox :label="3">EASA</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onCreateAuthorizeSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
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
  getUserAuthorizeList,
  getUserTableList
} from "../../api/user_api";
import {Search} from "@element-plus/icons-vue"
import {get_manual_list} from "../../api/manual_api";
import {changeComponentState} from "../../api/component_api";

const searchVal = ref('')
const isSearch = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const route = useRoute();
const userStore = useUserStore();
const currentPageKey = `${userStore.getUserName}_${route.path}_currentPage`;
const pageSizeKey = `${userStore.getUserName}_${route.path}_PageSize`;
currentPage.value = parseInt(localStorage.getItem(currentPageKey) || "1");
pageSize.value = parseInt(localStorage.getItem(pageSizeKey) || "10");
const router = useRouter();

const card_name = ref("")

const authorizeInfoVisible = ref(false)





// ------改变证书状态-----begin
interface Certificate {
  id: number
  name: string
  state: boolean;
  created_at: string
}
interface TableDateZ {
  id: number
  certificates:Certificate[]
  manual_num: string
}
const tableDataZ = ref<TableDateZ[]>([]);
function changeState(row: any) {
  // 改变附件状态
  changeUserManualCertificateState(row.id).then(res => {
    if (res.data.code == 2000) {
      successMsg("修改状态成功")
    } else {
      errorMsg("修改状态失败")
      row.state = !row.state
    }
  })
}


let rubbish = ref('')
interface RestaurantItem {
  manual_id: number
  manual_num: string
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
        restaurant.manual_num.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: RestaurantItem) => {
  authorizeCreateForm.manual_id = item.manual_id
}

function getManualList() {
  // 生成任务号
  get_manual_list().then(res => {
    if (res.data.code == 2000) {
      restaurants.value = res.data.data
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}


function create_authorize(user_id: number, user_name: string) {
  card_name.value = user_name
  authorizeCreateForm.user_id = user_id
  authorizeInfoVisible.value = true
  // 获取人员的授权信息
  getUserAuthorizeData(user_id)
}

function getUserAuthorizeData(id: number) {
  getUserAuthorizeList(id).then(
      res => {
        if (res.data.code == 2000) {
          tableDataZ.value = res.data.data;
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

interface AuthorizeCreateForm {
  manual_id: number,
  certificate_ids: number[],
  user_id: number
}

const authorizeCreateForm = reactive<AuthorizeCreateForm>({
  manual_id: 0,
  certificate_ids: [],
  user_id: 0
})


// 提交表单
function onCreateAuthorizeSubmit() {
  // 发请求添用户授权
  createUserAuthorize(authorizeCreateForm).then(
      res => {
        if (res.data.code == 2000) {
          authorizeCreateForm.certificate_ids = []
          rubbish.value = ""
          dialogVisible.value = false;
          getUserAuthorizeData(authorizeCreateForm.user_id)
          successMsg(res.data.msg)
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  )
}

const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
  getManualList()
};


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