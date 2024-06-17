<template>
  <div>
    <!--    搜索框-->
    <div style="margin-bottom: 5px">
      <el-input
          v-model="searchVal"
          placeholder="件号  /  批次号"
          style="width: 200px; margin-right: 5px; margin-top: 10px"
      />
      <el-button
          :icon='Search'
          circle
          :style="{ backgroundColor: isSearch ? '#a6deff' : '' }"
          @click="clickSearch"
      />
    </div>
    <div style="width: 100%; overflow-y: auto;">
      <el-table :data="materialList" border style="width: 100%;margin-top: 10px">
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="pn" label="件号" width="180"/>
        <el-table-column prop="name" label="名称" width="180"/>
        <el-table-column prop="bn" label="批次号" width="160"/>
        <el-table-column prop="count" label="数量" width="60"/>
        <el-table-column prop="price" label="单价" width="80"/>
        <el-table-column prop="storage_num" label="仓位号" width="60"/>
        <el-table-column prop="unit" label="单位" width="40"/>
        <el-table-column prop="manufacturer" label="制造商" width="100"/>
        <el-table-column prop="min_count" label="最少数量" width="60"/>
        <el-table-column prop="created_at" label="添加时间" width="100"/>
        <el-table-column prop="expiry_at" label="过期时间" width="100"/>
        <el-table-column prop="remark" label="备注" width="120"/>
        <el-table-column fixed="right"  width="100" label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="EditUserInfo(scope.row)">编辑</el-button>
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

      <!--    编辑用户弹出层-->
      <el-dialog title="编辑用户" v-model="EditDialogVisible" width="800px">
        <template #footer>
          <el-form :model="form" :inline="false" label-width="120px">
            <el-form-item label="角色">
              <el-checkbox-group v-model="form.role_ids">
                <el-checkbox v-for="role in allRoleList" :label="role.id">{{ role.title }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="小组">
              <el-radio-group v-model="form.group_id">
                <el-radio :label="1">燃油</el-radio>
                <el-radio :label="2">液压</el-radio>
                <el-radio :label="3">电源</el-radio>
                <el-radio :label="4">电气</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="form.user_name" style="width: 200px" disabled/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdate">修改</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {reactive, ref} from "vue";
import {Search} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {useUserStore} from "../../store/user";
import {getUserList, user_update} from "../../api/user_api";
import {all_role_list_api} from "../../api/role_api";
import {getMaterialSearchList} from "../../api/material_api";

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

// 查询
const searchVal = ref('')
const isSearch = ref(false)

function clickSearch() {
  if (searchVal.value.trim() != '') {
    isSearch.value = true
  }
  getMaterialData(pageSize.value, currentPage.value, searchVal.value);
}

function getMaterialData(pageSize: number, currentPage: number, keyword: string, sort: any = null) {
  if (isSearch.value == false) {
    keyword = ""
  }
  getMaterialSearchList(pageSize, currentPage, keyword, sort).then(
      res => {
        if (res.data.code == 2000) {
          materialList.value = res.data.data.list;
          total.value = res.data.data.count;
        } else {
          errorMsg(res.data.msg)
          return
        }

      }
  );
}

interface Form {
  user_name: string,
  role_ids: number[],
  group_id: number,
}

const form = reactive<Form>({
  user_name: "",
  role_ids: [],
  group_id: 1
})


function onUpdate() {
  console.log("update")
  // user_update(form).then(res => {
  //   if (res.data.code == 2000) {
  //     successMsg(res.data.msg)
  //     EditDialogVisible.value = false
  //     getUserListData(pageSize.value, currentPage.value);
  //     return
  //   }else {
  //     errorMsg(res.data.msg)
  //     return
  //   }
  // })
}


const dialogVisible = ref(false);
const EditDialogVisible = ref(false);
const showDialog = () => {
  GetAllRoleList()
  dialogVisible.value = true;
};


function EditUserInfo(row: any) {
  const ids = [] as number[]
  const roles = row.roles as Role[]
  roles.forEach(element => {
    ids.push(element.id)
  })

  form.role_ids = ids
  form.group_id = row.group_id
  form.user_name = row.user_name
  EditDialogVisible.value = true
  GetAllRoleList()
}

const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}
const successMsg = (msg: string) => {
  ElMessage.success(msg)
}

interface Material {
  id: number
  name: string
  pn: string
  bn: string
  storage_num: string
  count: string
  unit: string
  manufacturer: string
  price: string
  min_count: string
  created_at: string
  expiry_at: string
  remark: string

}

// 表格数据
const materialList = ref<Material[]>([]);

const handleSizeChange = (val: number) => {
  localStorage.setItem(pageSizeKey, val.toString())
  getMaterialData(val, currentPage.value, searchVal.value);
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getMaterialData(pageSize.value, val, searchVal.value);
}

interface Role {
  id: number,
  title: number,
}

const allRoleList = ref<Role[]>([])

function GetAllRoleList() {
  all_role_list_api().then(
      res => {
        if (res.data.code == 2000) {
          allRoleList.value = res.data.data;
        } else {
          errorMsg(res.data.msg)
          return
        }

      }
  );
}
getMaterialData(pageSize.value, currentPage.value, searchVal.value);

</script>

<style scoped>

</style>