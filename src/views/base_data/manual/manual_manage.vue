<template>
  <div>
    <el-row :gutter="20">
      <!--    左边-->
      <el-col :span="9">
        <el-card shadow="hover" style="height: 580px">
          <template #header>
            <div class="clearfix">
              <span>手册列表</span>
            </div>
          </template>
          <!--    搜索框-->
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
        </el-card>
      </el-col>

      <!--    右边-->
      <el-col :span="15">
        <el-card shadow="hover" style="height: 580px">
          <template #header>
            <div class="clearfix">
              <span>手册图像号管理 :{{ manual.manual_num }}</span>
              <el-button type="primary" v-if="manual.manual_num != null" @click="ClickAdd()" style="float: right;">
                添加
              </el-button>
            </div>
          </template>
          <div v-if="manual.manual_num != null" >
            <el-table :data="tableData" border style="width: 100%;" max-height="420px" >
              <el-table-column prop="id" label="ID" width="50"/>
              <el-table-column prop="image_num"   label="图像号" width="100"/>
              <el-table-column prop="pn" label="件号" width="160"/>
              <el-table-column prop="material_name" label="名称" width="160"/>
              <el-table-column prop="is_must_replace" label="是否为必换" width="120"/>
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                  <el-button type="primary" size="small">
                    <!--                    @click="del(scope.row.id)"-->
                    删除
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
          </div>
          <div v-else>
            <el-empty description="请选择手册"/>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--    弹出层-->
    <el-dialog title="添加权限" v-model="dialogVisible" width="600px">
      <template #footer>
        <el-form v-model="mmCreateFrom" label-width="120px">
          <el-popover placement="bottom" :width="300" :visible="isShow">
            <template #reference>
              <el-form-item label="件号">
                <el-input
                    v-model="inputV"
                    @focusout="focusOutInput()"
                    @focus="focusInput()"
                    clearable
                    @input="changInput()"
                    style="width: 200px"
                    ref="inputRef"
                />
              </el-form-item>
            </template>
            <div style="max-height: 200px; overflow-y: auto;">
              <div style="font-size: 20px" @click.stop="handleClick(item)" class="item" v-for="item  in options"
                   :key="item.id">{{ item.pn }}
              </div>
            </div>
          </el-popover>

          <el-form-item label="图像号">
            <el-input v-model="mmCreateFrom.image_num" placeholder="正则验证 1[a]-1[a]" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="是否为必换">
            <el-radio-group v-model="mmCreateFrom.is_must_replace" class="ml-4">
              <el-radio  :label=false >否</el-radio>
              <el-radio  :label=true >是</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="AddCommit()">添加</el-button>
          </el-form-item>
        </el-form>


      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {reactive, ref} from "vue";
import {ElMessage, ElInput} from 'element-plus'
import {useUserStore} from "../../../store/user";
import {createManualMaterial, get_manual_list, getManualMaterialList} from "../../../api/manual_api";
import {getMaterialSearchList} from "../../../api/material_api";
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

// 分页
const handleSizeChange = (val: number) => {
  localStorage.setItem(pageSizeKey, val.toString())
  GetManualMaterialList(manual.value.manual_id, val, currentPage.value, "");
}
const handleCurrentChange = (val: number) => {
  localStorage.setItem(currentPageKey, val.toString())
  GetManualMaterialList(manual.value.manual_id, pageSize.value, val, "");
}

function GetManualMaterialList(manual_id: number, pageSize: number, currentPage: number, keyword: string) {
  getManualMaterialList(manual_id, pageSize, currentPage, keyword).then(
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

// 添加手册航材
function ClickAdd() {
  dialogVisible.value = true
  mmCreateFrom.value.manual_id = manual.value.manual_id
}

function AddCommit() {
  createManualMaterial(mmCreateFrom.value).then(res => {
    if (res.data.code == 2000) {
      successMsg(res.data.msg)
      mmCreateFrom.value = {} as MMCreateForm
      GetManualMaterialList(manual.value.manual_id, pageSize.value, currentPage.value, "");
      dialogVisible.value = false
      return;
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}


// 搜索
// 获取 el-input 的引用
const inputRef = ref(ElInput);
const inputV = ref("")
const isShow = ref(false)


function getSearchData() {
  if (inputV.value == "") {
    options.value = []
    isShow.value = false
    return
  }

  getMaterialSearchList(10, 1, inputV.value, null).then(
      res => {
        if (res.data.code == 2000) {
          if (res.data.data.list == null ){
            isShow.value = false
          }else {
            isShow.value = true
          }
          options.value = res.data.data.list;
        } else {
          errorMsg(res.data.msg)
          return
        }

      }
  );
}

async function changInput() {
  mmCreateFrom.value.material_id = 0
  getSearchData()
}

function focusInput() {
  if (options.value.length != 0) {
    isShow.value=true
  }
}

function focusOutInput() {
  isShow.value = false
}

// 点击下拉选项目
function handleClick(option: Option) {
  inputV.value = option.pn
  mmCreateFrom.value.material_id = option.id
  // 调用 blur 方法
  isShow.value = false
  inputRef.value.blur()
  return
}


const dialogVisible = ref(false);

interface MMCreateForm {
  manual_id: number,
  material_id: number,
  image_num: string
  is_must_replace: boolean
}

const mmCreateFrom = ref<MMCreateForm>({} as MMCreateForm)

interface Option {
  id: number
  pn: string
}

// 数据改变时向后端发送罪行的查询条件
const options = ref<Option[]>([] as Option[])


// 获取手册联想下拉列表
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

getManualList()

let rubbish = ref('')


interface RestaurantItem {
  manual_id: number
  manual_num: string
}

const manual = ref<RestaurantItem>({} as RestaurantItem)

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
  manual.value.manual_id = item.manual_id
  manual.value.manual_num = item.manual_num

  mmCreateFrom.value.manual_id = item.manual_id


  GetManualMaterialList(manual.value.manual_id, pageSize.value, currentPage.value, "");
}


const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}

const successMsg = (msg: string) => {
  ElMessage.success(msg)
}


interface ManualImage {
  id: number
  image_num: string
  is_must_replace: string
  material_name: string
}

const tableData = ref<ManualImage[]>([] as ManualImage[])

</script>

<style scoped>
.item:hover {
  background-color: #F4F7F8F2;
  cursor: pointer; /* 设置鼠标悬停时的样式为箭头 */
}
</style>


