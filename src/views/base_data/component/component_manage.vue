<template>
  <div>
    <!--    搜索框-->
    <div style="margin-bottom: 5px">
      <el-input
          v-model="searchVal"
          placeholder="件名   /   件号"
          style="width: 200px; margin-right: 5px"
      />
      <el-button
          :icon='Search'
          circle
          :style="{ backgroundColor: isSearch ? '#a6deff' : '' }"
          @click="clickSearch"
      />

      <span style="margin-left: 60px">
        <el-button type="primary" @click="showDialog">添加</el-button>
        <el-button type="danger" @click="deleteComponents">删除</el-button>
      </span>
    </div>
    <!--    列表-->
    <el-table
        :data="tableData"
        border
        style="width: 100%;"
        @select="handleSelectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="件名" width="200"/>
      <el-table-column prop="pn" label="件号" width="180"/>
      <el-table-column prop="manual_num" label="手册号" width="120"/>
      <el-table-column prop="group" label="小组" width="80"/>
      <el-table-column prop="modify_count" label="改装数" width="60"/>
      <el-table-column prop="certificates" label="取证信息" width="160"/>
      <el-table-column prop="created_at" sortable label="添加时间"/>
      <el-table-column prop="state" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
              v-model="row.state"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              @change="changeState(row)"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="DetailComponentInfo(scope.row.id)">详情</el-button>
          <el-button type="primary" size="small" @click="CertificateUpdate(scope.row.id, scope.row.certificate_ids)">
            证书
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


    <!--  添加弹层-->
    <el-dialog title="添加附件" v-model="dialogVisible">
      <template #footer>
        <el-form :model="formData" :inline="false" label-width="120px">
          <el-form-item label="件名" prop="name">
            <el-input v-model="formData.name" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="件号">
            <el-input v-model="formData.pn" style="width: 200px"/>
          </el-form-item>
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
          <el-form-item label="分类">
            <el-radio-group v-model="formData.group_id">
              <el-radio :label="1">燃油</el-radio>
              <el-radio :label="2">液压</el-radio>
              <el-radio :label="3">电源</el-radio>
              <el-radio :label="4">电气</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证书">
            <el-checkbox-group v-model="formData.certificate_ids">
              <el-checkbox :label="1">CAAC</el-checkbox>
              <el-checkbox :label="2">FAA</el-checkbox>
              <el-checkbox :label="3">EASA</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onAddItem">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <!--  修改证书弹出层-->
    <el-dialog title="编辑证书" v-model="updateDialogVisible">
      <template #footer>
        <el-form :inline="false" label-width="120px">
          <el-form-item label="证书">
            <el-checkbox-group v-model="certificateIDs">
              <el-checkbox :label="1">CAAC</el-checkbox>
              <el-checkbox :label="2">FAA</el-checkbox>
              <el-checkbox :label="3">EASA</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="certificateUpdate">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {useRouter, useRoute} from "vue-router";
import {provide, reactive, ref, Ref, watch} from "vue";
import {
  changeComponentState,
  createOneComponent,
  del_component_by_ids,
  getAllComponentData, update_component
} from '../../../api/component_api';
import {ElMessage} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {useUserStore} from "../../../store/user";
import {useComponentStore} from "../../../store/component";
import {get_manual_list} from "../../../api/manual_api";


const searchVal = ref('')
const isSearch = ref(false)
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const componentStore = useComponentStore();


const certificateIDs = ref([] as number[])
const componentID = ref(0)


const form = ref<FormType>({} as FormType)

interface FormType {
  id: number
  certificate_ids: number[]
}

const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
  getManualList()

};

const updateDialogVisible = ref(false);

function CertificateUpdate(id: number, certificate_ids: number[]) {
  updateDialogVisible.value = true;
  certificateIDs.value = certificate_ids
  componentID.value = id
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
  formData.value.manual_id = item.manual_id
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


interface SortType {
  field: string
  order: string
}

const sortData = ref<SortType | null>(null);
const sortChange = ({prop, order}: { prop: string; order: string }) => {
  let orderStr = ''
  if (order == 'descending') {
    orderStr = 'desc'
  }
  if (order == 'ascending') {
    orderStr = 'asc'
  }
  sortData.value = {field: prop, order: orderStr};
  getComponentData(pageSize.value, currentPage.value, searchVal.value, sortData.value);
};

function DetailComponentInfo(id: number) {
  router.push({
    name: 'component_info'
  })
  componentStore.setID(id)
}


function clickSearch() {
  if (searchVal.value.trim() != '') {
    isSearch.value = true
  }
  getComponentData(pageSize.value, currentPage.value, searchVal.value, sortData.value);
}


watch(searchVal, (newVal) => {
  const trimmedValue = newVal.trim();
  if (trimmedValue == "" || searchVal.value != trimmedValue) {
    isSearch.value = false
  }
});

function changeState(row: any) {
  // 改变附件状态
  changeComponentState(row.id).then(res => {
    if (res.data.code == 2000) {
      successMsg("修改状态成功")
    } else {
      errorMsg("修改状态失败")
      row.state = !row.state
    }
  })

}


let selectedIds = ref<number[]>([]);

function handleSelectionChange(selection: TableData[]) {
  selectedIds.value = selection.map((item) => item.id);
}

function deleteComponents() {
  del_component_by_ids(selectedIds.value).then(res => {
    if (res.data.code == 2000) {
      successMsg(res.data.msg)
      selectedIds.value = []
      getComponentData(pageSize.value, currentPage.value, searchVal.value);
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}


interface FormData {
  name: string,
  pn: string,
  manual_id: number,
  group_id: number,
  certificate_ids: number[]
}

let formData = ref({} as FormData)


function onAddItem() {
  createOneComponent(formData.value)
      .then(res => {
        if (res.data.code == 2000) {
          successMsg(res.data.msg)
          getComponentData(pageSize.value, currentPage.value, searchVal.value)
          formData.value = {} as FormData
          rubbish.value = ''
        } else {
          errorMsg(res.data.msg)
        }
      })
}

function certificateUpdate() {
  update_component(componentID.value, certificateIDs.value)
      .then(res => {
        if (res.data.code == 2000) {
          successMsg(res.data.msg)
          updateDialogVisible.value = false;
          getComponentData(pageSize.value, currentPage.value, searchVal.value)
        } else {
          errorMsg(res.data.msg)
        }
      })
}

const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}
const successMsg = (msg: string) => {
  ElMessage.success(msg)
}


const currentPageKey = `${userStore.getUserName}_${route.path}_currentPage`;
const pageSizeKey = `${userStore.getUserName}_${route.path}_PageSize`;
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const handleSizeChange = (val: number) => {
  localStorage.setItem(pageSizeKey, val.toString())
  getComponentData(val, currentPage.value, searchVal.value, sortData.value);
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  getComponentData(pageSize.value, val, searchVal.value, sortData.value);
}


interface TableData {
  id: number
  name: string
  pn: string
  manual_num: string
  group_id: number
  state: boolean
  modify_count: number
  certificates: string
  certificate_ids: number[]
  created_at: string
}

const tableData = ref<TableData[]>([]);

function getComponentData(pageSize: number, currentPage: number, keyword: string, sort: any = null) {
  if (isSearch.value == false) {
    keyword = ""
  }
  getAllComponentData(pageSize, currentPage, keyword, sort).then(
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
getComponentData(pageSize.value, currentPage.value, searchVal.value);

watch(() => componentStore.is_update, () => {
  getComponentData(pageSize.value, currentPage.value, searchVal.value);
});

</script>
<style scoped>
</style>