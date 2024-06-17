<template>
  <div>
    <!--    条件-->
    <div>
      <el-form :model="condition" :inline="true">
        <el-form-item label="小组:">
          <el-input disabled :value="userStore.getGroupTitle" style="width: 80px"></el-input>
        </el-form-item>
        <el-form-item label="节点:">
          <el-select v-model="condition.node" style="width: 100px">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="2" label="已分配"></el-option>
            <el-option :value="1" label="未分配" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员:">
          <el-select v-model="condition.user_id" style="width: 100px">
            <el-option :value="0" label="全部"></el-option>
            <el-option v-for="user in all_users" :value="user.id" :label="user.user_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--    表格-->
    <div >
      <el-table :data="tableData" border style="width: 100%" max-height="80%">
        <el-table-column prop="task_num" label="任务号" width="120"/>
        <el-table-column prop="component_name" label="件名" width="180"/>
        <el-table-column prop="custom_name" label="公司" width="150"/>
        <el-table-column prop="pn" label="件号" width="160"/>
        <el-table-column prop="demand" label="需求" width="70"/>
        <el-table-column prop="certificates" label="证书" width="140"/>
        <el-table-column prop="created_at" label="入厂时间" width="100"/>
        <el-table-column label="节点" width="70">
          <template #default="scope">
            <span :style="{ color: scope.row.node === '未分配' ? 'red' : 'black' }">{{ scope.row.node }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="人员" width="100"/>
        <el-table-column fixed="right" label="分配">
          <template #default="scope">
            <el-select v-model="scope.row.user_id"
                       @click="getOptionalUserList(scope.row.id, userStore.getGroupID)"
                       @change="setTaskUserID(scope.row.id,Number(scope.row.user_id))"
                       style="width: 100px">
              <el-option
                  v-for="item in optionalUserList"
                  :label="item.user_name"
                  :value="item.id"
              />
              <el-option value="null" label="未分配"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 15px">
        <el-button type="success" @click="commitShare()">保存</el-button>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {get_all_task_list, task_add, task_share} from "../../api/task_api";
import {errorMsg, successMsg} from "../../utils/constant";
import {getOptionalUserListData, getUserAllSelectList} from "../../api/user_api";
import {useUserStore} from "../../store/user";

const userStore = useUserStore()


interface User {
  id: string
  user_name: string
}

// 获取全部users
const all_users = ref<User[]>([])
getAllUsers()
function getAllUsers() {
  getUserAllSelectList().then(
      res => {
        if (res.data.code == 2000) {
          all_users.value = res.data.data
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}


interface OptionalUser {
  id: number,
  user_name: string
}
const optionalUserList = ref<OptionalUser[]>([])
// 获取授权的users
function getOptionalUserList(id: number, group_id: number) {
  getOptionalUserListData(id, group_id).then(
      res => {
        if (res.data.code == 2000) {
          optionalUserList.value = res.data.data
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}


interface ShareData {
  id: number
  user_id: number
}
const shareData = ref<ShareData[]>([] as ShareData[])
function setTaskUserID(task_id: number, user_id: number) {
  // 查找具有给定 task_id 的对象的索引
  const index = shareData.value.findIndex(data => data.id === task_id);
  if (index !== -1) {
    // 如果对象存在，更新其 user_id
    shareData.value[index].user_id = user_id;
  } else {
    // 如果对象不存在，创建一个新对象
    shareData.value.push({ id: task_id, user_id:user_id });
  }
  console.log(shareData.value)
}

function commitShare(){
  task_share(shareData.value).then(
      res => {
        shareData.value = []
        if (res.data.code == 2000) {
          successMsg("添加成功")
          getAllTaskData( conditionObj.value);
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}



interface Condition {
  node: string,
  user_id: number
}

const condition = reactive<Condition>({
  node: "未分配",
  user_id: 0
})

interface ConditionObj {
  key: string,
  value: string
}

const conditionObj = ref<ConditionObj[]>([{
  key: "group_id",
  value: userStore.group_id.toString() || ""
}, {
  key: "node",
  value: "1"
}])


watch(() => condition.node, () => {
  const end_condition = updateConditionObjs("node", condition.node.toString())
  getAllTaskData(end_condition);
});

watch(() => condition.user_id, () => {
  if (condition.user_id == 0) {
    const end_condition = deleteConditionObj("user_id")
    getAllTaskData( end_condition);
  } else {
    const end_condition = updateConditionObjs("user_id", condition.user_id.toString())
    getAllTaskData( end_condition);
  }
});

// 创建或者修改对象
function updateConditionObjs(key: string, value: string): ConditionObj[] {
  const existObj = conditionObj.value.find(one => one.key === key);
  if (existObj) {
    existObj.value = value;
  } else {
    const newStudent: ConditionObj = {key, value};
    conditionObj.value.push(newStudent);
  }
  return conditionObj.value;
}

function deleteConditionObj(key: string): ConditionObj[] {
  const existObjIndex = conditionObj.value.findIndex(one => one.key === key);
  if (existObjIndex !== -1) {
    // 如果找到存在的对象，使用 splice 方法移除该对象
    conditionObj.value.splice(existObjIndex, 1);
  }
  return conditionObj.value;
}

interface TableData {
  id: number,
  task_num: string,
  custom_name: string,
  component_name: string,
  pn: string,

  demand: string,
  certificates: string,
  node: string,
  plan_release_date: string,
  created_at: string,
  user_id: number
  user_name : string
}
const tableData = ref<TableData[]>([])



function getAllTaskData(condition: any = null) {
  get_all_task_list(condition).then(
      res => {
        if (res.data.code == 2000) {
          tableData.value = res.data.data;
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}
getAllTaskData(conditionObj.value);
</script>

<style scoped>

</style>