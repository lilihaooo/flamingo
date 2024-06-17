<template>
  <div class="sidebar" >
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebar.collapse"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.id.toString()" :key="item.id" >
            <template #title>
                <i :class="`el-icon-lx-${item.icon}`"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
                <el-sub-menu
                  v-if="subItem.subs"
                  :index="subItem.id"
                  :key="subItem.id"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.path">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.path" >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path" :key="item.id">
            <i :class="`el-icon-lx-${item.icon}`"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useSidebarStore} from '../store/sidebar';
import {useRoute} from 'vue-router';
import {get_all_menu_tree} from "../api/menu_api";


interface MenuItem {
  id: number;
  icon?: string;
  index?: string;
  title: string;
  path?: string;
  parent_id?: number;
  subs?: MenuItem[] | null;
}

const items = ref<MenuItem[]>([]);

function getAllMenuTree() {
  // 生成任务号
  get_all_menu_tree().then(res => {
    if (res.data.code == 2000) {
      items.value = res.data.data
      return
    } else {
      console.log(res.data.msg)
      return
    }
  })
}
getAllMenuTree()


const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar-el-menu {
  background-color: var(--bg-color);
}


ul.el-menu--inline :hover {
  background-color: green;
}

.sidebar > ul {
  height: 100%;
}
</style>
