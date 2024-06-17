import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import { get_user_info } from "./api/user_api";
import { useUserStore } from "./store/user";


const app = createApp(App);


app.use(createPinia());
app.use(router);

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 在挂载应用程序之前获取用户信息
init_user_info(() => {
    app.mount('#app');
});


// 获取数据成功后再挂载
function init_user_info(callback: any) {
    const userStore = useUserStore();
    get_user_info().then(
        res => {
            if (res.data.code === 2000) {
                if (res.data.data.avatar !== "") {
                    userStore.setAvatarImg(res.data.data.avatar);
                }
                userStore.setUserName(res.data.data.user_name);
                userStore.setUserID(res.data.data.user_id);
                userStore.setNickName(res.data.data.nick_name);
                userStore.setGroupID(res.data.data.group_id);
                userStore.setGroupTitle(res.data.data.group_title);
                userStore.setRoleIDs(res.data.data.role_ids);
                userStore.setRoleTitle(res.data.data.role_title);
                // 执行回调函数
                callback();
            }else if (res.data.code === 4200){  // 登陆失败也可以挂载， 跳转到登陆界面
                // 执行回调函数
                callback();
            }
        });
}
