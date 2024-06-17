<template>
  <div>
    <!--      全部菜单tree-->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div style="height: 700px">
            <div style="margin-bottom: 20px">
              <el-button type="primary" @click="showDialog">添加菜单</el-button>
              <el-button style="margin-left: 20px" @click="getCheckedKeys" type="primary">删除</el-button>
            </div>
            <h4 style="margin-bottom: 15px">全部菜单列表:</h4>
            <el-tree
                ref="treeRef"
                :data="all_menu_tree"
                node-key="id"
                :props="defaultProps"
                show-checkbox
                :expand-on-click-node="false"
                @node-click="updateMenuClick"
                style="width: 60%"
            />
          </div>
        </el-card>
      </el-col>


      <!--      用户菜单tree-->
      <el-col :span="12">
        <el-card>
          <div style="height: 700px">
            <div style="margin-bottom: 20px">
              <!--            <el-select v-model="value" class="m-2" placeholder="请选择角色">-->
              <!--              <el-option-->
              <!--                  v-for="item in options"-->
              <!--                  :key="item.value"-->
              <!--                  :label="item.label"-->
              <!--                  :value="item.value"-->
              <!--              />-->
              <!--            </el-select>-->
              <el-button style="margin-left: 20px" @click="getCheckedKeys" type="primary">从全部菜单中添加</el-button>
              <el-button style="margin-left: 20px" @click="getCheckedKeys" type="primary">删除</el-button>
            </div>
            <h4 style="margin-bottom: 15px">角色菜单列表:</h4>
            <el-tree
                ref="treeRef"
                :data="user_menu_tree"
                node-key="id"
                :props="defaultProps"
                show-checkbox
                :expand-on-click-node="false"
                @node-click=""
                style="width: 60%"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--添加弹出层-->
    <el-dialog title="添加菜单" v-model="dialogVisible" width="90%">
      <template #footer>
        <el-form :model="form" label-width="120px">
          <el-form-item label="父级菜单">
            <el-tree-select
                v-model="form.pid"
                :data="create_menu_tree"
                node-key="id"
                :props="defaultProps"
                check-strictly
                :render-after-expand="false"
                show-checkbox
            />
          </el-form-item>

          <el-form-item label="类型">
            <el-select v-model="form.type">
              <el-option :value="1" label="菜单"/>
              <el-option :value="2" label="菜单夹"/>
            </el-select>
          </el-form-item>

          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="路径" v-if="form.type != 2">
            <el-input v-model="form.path" style="width: 400px;"/>
          </el-form-item>

          <el-popover placement="bottom-start" :width="600" trigger="click">
            <template #reference>
              <el-form-item label="图标" v-if="showIconSelect">
                <el-button style="margin-right: 16px">请选择</el-button>
                <span>
                 <div class="icon-li-content">
                     <i :class="`el-icon-lx-${form.icon}`"></i>
                 </div>
                </span>
              </el-form-item>
            </template>
            <div style="height: 300px; overflow: auto;">
              <ul>
                <li class="icon-li" v-for="(item, index) in iconList" :key="index">
                  <div class="icon-li-content">
                    <i :class="`el-icon-lx-${item}`" @click="selectIcon(item)"></i>
                  </div>
                </li>
              </ul>
            </div>
          </el-popover>

          <el-form-item label="需要调用的接口" v-if="form.type != 2">
            <el-checkbox-group v-model="form.route_ids" class="checkbox-group" style="width: 100%;">
              <ul style="text-align: left">
                <li class="checkbox-li" v-for="item in multi_select" :key="item.id">
                  <el-checkbox :label="item.id" :name="item.id.toString()">
                    <el-tag :type="getTagType(item.method)" class="ml-2">{{ item.method }}</el-tag>
                    {{ item.path }}
                  </el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="addMenu">添加</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <!--编辑抽屉-->
    <el-drawer size="70%" v-model="drawer" title="修改菜单" direction="rtl">
      <template #default>
        <div>
          <el-form :model="updateMenuFormData">
            <el-form-item label="类型">
              <el-select v-model="updateMenuFormData.type" disabled>
                <el-option :value="1" label="菜单"/>
                <el-option :value="2" label="菜单夹"/>
              </el-select>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="updateMenuFormData.title" style="width: 400px;"/>
            </el-form-item>
            <el-form-item label="路径" v-if="isMenu">
              <el-input v-model="updateMenuFormData.path" style="width: 400px;"/>
            </el-form-item>

            <el-popover placement="bottom-start" :width="600" trigger="click" v-if="isRoot">
              <template #reference>
                <el-form-item label="图标" v-if="showIconSelect">
                  <el-button style="margin-right: 16px">请选择</el-button>
                  <span>
                 <div class="icon-li-content">
                     <i :class="`el-icon-lx-${updateMenuFormData.icon}`"></i>
                 </div>
                </span>
                </el-form-item>
              </template>
              <div style="height: 300px; overflow: auto;">
                <ul>
                  <li class="icon-li" v-for="(item, index) in iconList" :key="index">
                    <div class="icon-li-content">
                      <i :class="`el-icon-lx-${item}`" @click="updateIcon(item)"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </el-popover>

            <el-form-item label="需要调用的接口" v-if="isMenu">
              <el-checkbox-group v-model="updateMenuFormData.route_ids" class="checkbox-group" style="width: 100%;">
                <ul style="text-align: left">
                  <li class="checkbox-drawer-li" v-for="item in multi_select" :key="item.id">
                    <el-checkbox :label="item.id" :name="item.id.toString()">
                      <el-tag :type="getTagType(item.method)" class="ml-2">{{ item.method }}</el-tag>
                      {{ item.path }}
                    </el-checkbox>
                  </li>
                </ul>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="text-align: left">
          <el-button type="primary" @click="updateMenuCommit">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {ElMessage, ElTree} from 'element-plus'
import {get_all_menu_tree, get_role_menu_tree, update_menu} from "../../api/menu_api";
import {get_all_route_list} from "../../api/route_api";
import {createOneComponent} from "../../api/component_api";
interface UpdateMenuFormData {
  title: string,
  path: string,
  icon: string,
  route_ids: number[],
  type: number
  parent_id: number
}
// 使用 Partial 将所有字段设置为可选
const updateMenuFormData = ref<Partial<UpdateMenuFormData>>({
  type: 1, // 设置默认值为 1
});
const isMenu = ref(true) // 是目录, 不是Menu
const isRoot = ref(true) // 是目录, 不是Menu
function updateMenuClick(a: any) {
  drawer.value = true
  updateMenuFormData.value = a
  if (a.type == "2") {
    isMenu.value = false
  }
  if (a.type == "1") {
    isMenu.value = true
  }
  if (a.parent_id == 0) {
    isRoot.value = true
  }if (a.parent_id != 0)  {
    isRoot.value = false
  }
}

// 发起后端请求
function updateMenuCommit(){
  update_menu(updateMenuFormData.value).then(res=>{
    if (res.data.code == 2000) {
      successMsg(res.data.msg)
      drawer.value = false
      updateMenuFormData.value = {} as UpdateMenuFormData
      get_all_menu_tree()
    } else {
      errorMsg(res.data.msg)
    }
  })
}
const successMsg = (msg: string) => {
  ElMessage.success(msg)
}
function addMenu() {
  console.log(form.route_ids)
}

const form = reactive({
  title: '',
  pid: null,
  path: '',
  icon: '',
  route_ids: [],
  type: 1,
})

const drawer = ref(false)
getAllMenuTree()

function getAllMenuTree() {
  // 生成任务号
  get_all_menu_tree().then(res => {
    if (res.data.code == 2000) {
      all_menu_tree.value = res.data.data
      create_menu_tree.value = [root, ...res.data.data];
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}

getRoleMenuTree()

function getRoleMenuTree() {
  get_role_menu_tree().then(res => {
    if (res.data.code == 2000) {
      user_menu_tree.value = res.data.data
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}


function getTagType(method: string) {
  if (method == 'GET') {
    return 'success'
  }
  if (method == 'POST') {
    return 'warning'
  }
  if (method == 'PUT') {
    return ''
  }
  if (method == 'DELETE') {
    return 'danger'
  }
}

const iconList: Array<string> = [
  'attentionforbid',
  'attentionforbidfill',
  'attention',
  'attentionfill',
  'tag',
  'tagfill',
  'people',
  'peoplefill',
  'notice',
  'noticefill',
  'mobile',
  'mobilefill',
  'voice',
  'voicefill',
  'unlock',
  'lock',
  'home',
  'homefill',
  'delete',
  'deletefill',
  'notification',
  'notificationfill',
  'notificationforbidfill',
  'like',
  'likefill',
  'comment',
  'commentfill',
  'camera',
  'camerafill',
  'warn',
  'warnfill',
  'time',
  'timefill',
  'location',
  'locationfill',
  'favor',
  'favorfill',
  'skin',
  'skinfill',
  'news',
  'newsfill',
  'record',
  'recordfill',
  'emoji',
  'emojifill',
  'message',
  'messagefill',
  'goods',
  'goodsfill',
  'crown',
  'crownfill',
  'move',
  'add',
  'hot',
  'hotfill',
  'service',
  'servicefill',
  'present',
  'presentfill',
  'pic',
  'picfill',
  'rank',
  'rankfill',
  'male',
  'female',
  'down',
  'top',
  'recharge',
  'rechargefill',
  'forward',
  'forwardfill',
  'info',
  'infofill',
  'redpacket',
  'redpacket_fill',
  'roundadd',
  'roundaddfill',
  'friendadd',
  'friendaddfill',
  'cart',
  'cartfill',
  'more',
  'moreandroid',
  'back',
  'right',
  'shop',
  'shopfill',
  'question',
  'questionfill',
  'roundclose',
  'roundclosefill',
  'roundcheck',
  'roundcheckfill',
  'global',
  'mail',
  'punch',
  'exit',
  'upload',
  'read',
  'file',
  'link',
  'full',
  'group',
  'friend',
  'profile',
  'addressbook',
  'calendar',
  'text',
  'copy',
  'share',
  'wifi',
  'vipcard',
  'weibo',
  'remind',
  'refresh',
  'filter',
  'settings',
  'scan',
  'qrcode',
  'cascades',
  'apps',
  'sort',
  'searchlist',
  'search',
  'edit'
];
const showIconSelect = ref(true)

function selectIcon(icon: string) {
  form.icon = icon;
}

function updateIcon(icon: string) {
  updateMenuFormData.value.icon = icon;
}

const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}

watch(form, (newValue, oldValue) => {
  showIconSelect.value = newValue.pid == 0;
})

const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
};


const treeRef = ref<InstanceType<typeof ElTree>>()
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
}

const defaultProps = {
  children: 'subs',
  label: 'title',
}


interface MenuItem {
  id: number;
  icon?: string;
  index?: string;
  title: string;
  permission?: string;
  parent_id?: number;
  subs?: MenuItem[] | null;
}

const all_menu_tree = ref<MenuItem[]>([]);
const user_menu_tree = ref<MenuItem[]>([]);
const create_menu_tree = ref<MenuItem[]>([]);
const root: MenuItem = {id: 0, title: 'root'};

// 获取全部菜单列表
interface MultiSelect {
  id: number
  method: string
  path: string
}
const multi_select = ref<MultiSelect[]>([])

function getAllRoute() {
  // 生成任务号
  get_all_route_list().then(res => {
    if (res.data.code == 2000) {
      multi_select.value = res.data.data
      return
    } else {
      errorMsg(res.data.msg)
      return
    }
  })
}
getAllRoute()
</script>


<style scoped>
ul,
li {
  list-style: none;
}

.checkbox-group ul {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-li {
  display: inline-block;
  width: 20%; /* Set the width to 20% to fit 5 items in a row */
  box-sizing: border-box;
  margin-bottom: 10px; /* Optional margin between rows */
}

.checkbox-drawer-li {
  display: inline-block;
  width: 33.3%; /* Set the width to 20% to fit 5 items in a row */
  box-sizing: border-box;
  margin-bottom: 10px; /* Optional margin between rows */
}

.icon-li {
  display: inline-block;
  padding: 10px;
  width: 12px;
  height: 12px;
  margin: 2px;
}

.icon-li-content {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-li-content i {
  font-size: 36px;
  color: #606266;
}

.icon-li-content span {
  margin-top: 10px;
  color: #787878;
}
</style>