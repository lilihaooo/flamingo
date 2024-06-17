<template>
  <div class="header">
    <!-- 展开缩回 -->
    <div class="collapse-btn" @click="collapseChage">
      <el-icon style="color: black" v-if="sidebar.collapse">
        <Expand/>
      </el-icon>
      <el-icon style="color: black" v-else>
        <Fold/>
      </el-icon>
    </div>
    <!-- logo -->
    <div class="title" style="color: black">后台管理系统</div>

    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <el-badge :value="notice.count" class="item"  v-if="notice.count > 0">
          <el-popover placement="bottom" :width="300" trigger="hover">
            <template #reference>
              <el-icon style="color: black">
                <Bell/>
              </el-icon>
            </template>
            <div style="max-height: 600px; overflow-y: auto;">
              <span><b style="font-size: 16px">消息通知</b></span>
              <el-button type="primary" link style="float: right;margin-right: 15px">一键已读</el-button>
              <el-button type="primary" link style="float: right;">全部消息</el-button>
              <ul>
                <li style="margin-top: 15px"  v-for="one in notice.list">
                  <div style="display: flex; align-items: center">
                    <div class="red-dot"></div>
                    <div style="margin-left: 10px;;width: 200px">
                      <h3>{{ one.title }}</h3>
                      <div style="font-size: 14px; color: #9E9EA4FF">{{one.created_at}}</div>
                      <div>{{one.content}}</div>
                    </div>
                    <el-button class="msg-but">
                      <el-icon style="margin-left: -9px" :size="20">
                        <DArrowRight />
                      </el-icon>
                    </el-button>
                  </div>

                </li>
              </ul>
            </div>
          </el-popover>
        </el-badge>

        <el-icon v-else style="color: black">
          <Bell/>
        </el-icon>


        <!-- 用户头像 -->
        <el-avatar class="user-avator" :size="30" :src="userStore.getUserAvatarImg"/>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ userStore.getUserName }}
						<el-icon class="el-icon--right">
							<arrow-down/>
						</el-icon>
					</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="user">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useSidebarStore} from '../store/sidebar';
import {useRouter} from 'vue-router';
import {useDark} from '@vueuse/core'
import {useUserStore} from "../store/user";
import {connectWS, GlobalWs} from "../utils/websocket";
import {ElNotification} from "element-plus";
import {get_user_notice_list} from "../api/massage_api";

interface Notice {
  "count": number
  "list": NoticeList[]
}

interface NoticeList {
  "title": string
  "created_at": string
  "content": string
  "to_id": number
  "type": string
}


const notice = ref<Notice>({} as Notice)


interface WsMsg {
  "view_type": ViewType
  "title": string
  "content": string
}

type ViewType = "success" | "warning" | "info" | "error"
// 连接ws
connectWS()


function getUserNoticeList() {
  // 生成任务号
  get_user_notice_list().then(res => {
    if (res.data.code == 2000) {
      notice.value = res.data.data
      return
    } else {
      console.log(res.data.msg)
      return
    }
  })
}
getUserNoticeList()

// 添加消息监听器
GlobalWs.addEventListener('message', (event) => {
  console.log("收到新消息")
  // 更新消息接口(未读消息列表, 未读消息数量)
  getUserNoticeList()
  const wsMsgObject = JSON.parse(event.data) as WsMsg;
  ElNotification({
    // title: wsMsgObject.title,
    message: wsMsgObject.content,
    type: wsMsgObject.view_type,
  })
});

const userStore = useUserStore()
const isDark = useDark({
  storageKey: 'vitepress-theme-appearance',
})

const sidebar = useSidebarStore();

// 侧边栏折叠
const collapseChage = () => {
  sidebar.handleCollapse();
};

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage();
  }

});

// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
  if (command == 'loginout') {
    localStorage.removeItem('flamingo_user_token');
    userStore.recoverAvatarImg()
    const tags_key = `${userStore.getUserName}_tags`
    localStorage.clear()
    router.push('/login');
  } else if (command == 'user') {
    router.push('/user/info');
  }
};
</script>
<style scoped>
.red-dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  display:inline-block;
  margin-bottom: 41px;
}

.msg-but {
  width: 5px;
  height: 60px;
  background-color: #beeac8;
  display:inline-block;
  margin-left: 15px;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: var(--bg-color);
}

.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  float: left;
  padding: 0 21px;
  cursor: pointer;
  color: var(--color);
}

.collapse-btn:hover {
  background-color: #cbc2c2;
}

.header .title {
  float: left;
  width: 250px;
  line-height: 70px;
  color: var(--color);
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;

}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.el-dropdown-link {
  color: var(--color);
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
