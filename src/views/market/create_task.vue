<template>
<div>
  <div >
    <el-button type="primary" @click="showDialog">增加任务</el-button>
  </div>
  <div style="margin-top: 20px">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="task_num" fixed="left"  label="任务号" width="100"/>
      <el-table-column prop="custom_name" label="公司" width="140"/>
      <el-table-column prop="component_name" label="件名" width="180"/>
      <el-table-column prop="pn" label="件号" width="140"/>
      <el-table-column prop="sn" label="序号" width="120"/>
      <el-table-column prop="demand" label="需求" width="70"/>
      <el-table-column prop="certificates" label="证书" width="160"/>
      <el-table-column prop="modify_count" label="改装数" width="70"/>
      <el-table-column prop="node" label="节点" width="80"/>
      <el-table-column prop="created_at" label="入厂时间" width="100"/>
      <el-table-column prop="plan_release_date" label="计划放行时间" width="100"/>
      <el-table-column fixed="right" label="操作" width="80">
        <template #default="scope">
          <el-button type="primary" size="small" @click="">编辑</el-button>
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


    <!--添加弹出层-->
    <el-dialog title="添加菜单" v-model="dialogVisible" width="90%">
      <template #footer>
        <el-form :model="form" label-width="120px">
          <el-form-item label="小组">
            <el-radio-group v-model="form.group_id">
              <el-radio :label="1">燃油</el-radio>
              <el-radio :label="2">液压</el-radio>
              <el-radio :label="3">电源</el-radio>
              <el-radio :label="4">电气</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="件号">
            <el-autocomplete
                v-model="form.pn"
                :fetch-suggestions="querySearch"
                :disabled="form.group_id == 0 "
                clearable
                placeholder="请选择"
                @select="handleSelect"
                value-key="pn"
                style="width: 240px"
                @focus="handlePNFocus"
            />
            <span style="margin-left: 40px">名称:  {{ component_name }}</span>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="form.sn" placeholder="必填" style="width: 240px"/>
          </el-form-item>
          <el-form-item label="客户">
            <el-select v-model="form.custom_id"
                       @focus="handleCustomFocus"
                       placeholder="必填" style="width: 240px">
              <el-option
                  v-for="item in custom_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="要求">
            <el-radio-group v-model="form.demand_type">
              <el-radio :label="1">检测</el-radio>
              <el-radio :label="2">修理</el-radio>
              <el-radio :label="3">翻修</el-radio>
              <el-radio :label="4">索赔</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="改装">
            <el-select v-model="form.modify_ids"
                       multiple
                       :disabled="form.pn == '' || form.demand_type ==1 || form.demand_type == 4 || form.demand_type == null"
                       @focus="handleModifyFocus"
                       placeholder="多选" style="width: 240px">
              <el-option
                  v-for="item in component_modify_list"
                  :key="item.id"
                  :label="item.modify_num"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="证书">
            <el-checkbox-group v-model="form.certificate_ids">
              <el-checkbox v-for="item in component_certificates" :label="item.id">{{item.title}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="计划放行日期">
            <el-col>
              <el-date-picker
                  v-model="form.plan_release_date"
                  type="date"
                  placeholder="请选择"
                  style="width: 100%"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="备注" style="width: 50%">
            <el-input v-model="form.remark" type="textarea"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch} from 'vue'
import {
  get_component_certificate_info,
  get_component_modify_info,
  get_component_search_data,
} from "../../api/component_api";
import {ElMessage} from "element-plus";
import {get_custom_input_list} from "../../api/custom_api";
import {get_all_task_paging_list, task_add} from "../../api/task_api";
import {useUserStore} from "../../store/user";
import {useRoute, useRouter} from "vue-router";
const userStore = useUserStore();
const searchVal = ref('')
const isSearch = ref(false)
const router = useRouter();
const route = useRoute();

const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
};


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
  getAllTaskData(val, currentPage.value, searchVal.value, sortData.value);
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getAllTaskData(pageSize.value, val, searchVal.value, sortData.value);
}
function getAllTaskData(pageSize: number, currentPage: number, keyword: string, sort:any = null) {
  if (isSearch.value == false){
    keyword = ""
  }
  get_all_task_paging_list(pageSize, currentPage, keyword, sort).then(
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
getAllTaskData(pageSize.value, currentPage.value, searchVal.value);

// watch(() => componentStore.is_update, () => {
//   getComponentData(pageSize.value, currentPage.value, searchVal.value);
// });



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

function handlePNFocus() {
  getGroupComponentList(form.value.group_id)
}

function handleModifyFocus() {
  getComponentModifyList()
}

function getComponentModifyList() {
  get_component_modify_info(component_id.value).then(res => {
    if (res.data.code == 2000) {
      component_modify_list.value = res.data.data
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}


function getGroupComponentList(group_id: number) {
  get_component_search_data(group_id).then(res => {
    if (res.data.code == 2000) {
      restaurants.value = res.data.data
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })

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

function handleCustomFocus() {
  getCustomList()
}

function getCustomList() {
  get_custom_input_list().then(res => {
    if (res.data.code == 2000) {
      custom_list.value = res.data.data
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}

interface CustomList {
  id: number,
  name: string
}

interface ComponentModifyList {
  id: number,
  modify_num: string
}

const custom_list = ref<CustomList[]>([]);
const component_modify_list = ref<ComponentModifyList[]>([]);


interface RestaurantItem {
  id: number
  pn: string
  name: string
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
        restaurant.pn.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: RestaurantItem) => {
  component_name.value = item.name
  component_id.value = item.id
}


const onSubmit = () => {
  task_add(form.value).then(
      res => {
        if (res.data.code == 2000) {
          form.value = {} as FormType
          dialogVisible.value = false;
          successMsg("添加成功")
          getAllTaskData(pageSize.value, currentPage.value, searchVal.value, sortData.value);
        } else {
          errorMsg(res.data.msg)
          return
        }
      }
  );
}
</script>


<style scoped>

</style>