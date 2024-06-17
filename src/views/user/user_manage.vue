<template>
  <div>
    <el-button type="primary" @click="showDialog" style="margin-bottom: 15px">添加</el-button>
    <hr style="margin-bottom: 15px">
    <el-table :data="tableData" border style="width: 100%;" >
      <el-table-column prop="id" label="ID" width="60"/>
      <el-table-column prop="user_name" label="用户名" width="120"/>
      <el-table-column prop="nick_name" label="昵称" width="140"/>
      <el-table-column prop="email" label="邮箱" width="180"/>
      <el-table-column prop="tel" label="手机" width="160"/>
      <el-table-column  label="角色">
        <template #default="scope">
          <span v-for="i in scope.row.roles" style="margin-right:10px">{{i.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="group" label="小组" width="120"/>
      <el-table-column prop="created_at" label="添加时间" width="120"/>
      <el-table-column fixed="right"  width="140"  label="操作" >
        <template #default="scope">
          <el-button type="primary" size="small" @click="EditUserInfo(scope.row)">编辑</el-button>
          <el-button type="default" size="small" @click="DelUserInfo(scope.row.id)">删除</el-button>
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
<!--    添加用户弹出层-->
    <el-dialog title="添加用户" v-model="dialogVisible" width="800px">
      <template #footer>
        <el-form :model="form" :inline="false" label-width="120px">
          <el-form-item label="角色">
            <el-checkbox-group v-model="form.role_ids">
              <el-checkbox v-for="role in allRoleList" :label="role.id" >{{role.title}}</el-checkbox>
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
            <el-input v-model="form.user_name" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>



<!--    编辑用户弹出层-->
    <el-dialog title="编辑用户" v-model="EditDialogVisible" width="800px">
      <template #footer>
        <el-form :model="form" :inline="false" label-width="120px">
          <el-form-item label="角色">
            <el-checkbox-group v-model="form.role_ids">
              <el-checkbox v-for="role in allRoleList" :label="role.id" >{{role.title}}</el-checkbox>
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
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {reactive, ref} from "vue";
import {ElMessage} from 'element-plus'
import {useUserStore} from "../../store/user";
import {del_user_by_id, getUserList, user_create, user_update} from "../../api/user_api";
import {all_role_list_api} from "../../api/role_api";
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

interface Form {
  user_name: string,
  role_ids: number[],
  group_id: number,
}

const form = reactive<Form>({
  user_name: "",
  role_ids:[],
  group_id: 1
})

function onSubmit() {
  user_create(form).then(res => {
    if (res.data.code == 2000) {
      successMsg(res.data.msg)
      form.user_name = ""
      dialogVisible.value = false
      getUserListData(pageSize.value, currentPage.value);
      return
    }else {
      errorMsg(res.data.msg)
      return
    }
  })
}

function onUpdate() {
  user_update(form).then(res => {
    if (res.data.code == 2000) {
      successMsg(res.data.msg)
      EditDialogVisible.value = false
      getUserListData(pageSize.value, currentPage.value);
      return
    }else {
      errorMsg(res.data.msg)
      return
    }
  })
}

function DelUserInfo(id: number) {
  del_user_by_id(id).then(res=> {
    if (res.data.code == 2000){
      successMsg(res.data.msg)
      getUserListData(pageSize.value, currentPage.value);
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
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
  roles.forEach(element  => {
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
const tableData = ref([]);



const handleSizeChange = (val: number) => {
  localStorage.setItem(pageSizeKey, val.toString())
  getUserListData(val, currentPage.value);
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getUserListData(pageSize.value, val);
}

interface Role {
  id: number,
  title: number,
}

const allRoleList  = ref<Role[]>([])
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
getUserListData(pageSize.value, currentPage.value);


function getUserListData(pageSize: number, currentPage: number) {
  getUserList(pageSize, currentPage).then(
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
};
</script>

<style scoped>

</style>