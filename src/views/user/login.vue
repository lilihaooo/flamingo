<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">WildGoose管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.user_name" placeholder="username">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="password"
						v-model="param.password"
						@keyup.enter="submitForm(login)"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../../store/tags';
// import { usepermissionStore } from '../store/permission';
import { useRouter } from 'vue-router';
// import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import {get_user_info, login_req} from '../../api/user_api';
import {createOneComponent} from "../../api/component_api";
import {ElMessage} from "element-plus";
import {useUserStore} from "../../store/user";
interface LoginInfo {
	user_name: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	user_name: 'lihao',
	password: '111111'
});

const rules: FormRules = {
	user_name: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
      // 登陆请求
      login_req(param)
          .then(res => {
            if (res.data.code == 2000) {
              successMsg(res.data.msg)
              // 登陆成功将token存入本地存储库
              const tokenStr = res.data.data.token;
              localStorage.setItem('flamingo_user_token', tokenStr);
              init_user_info()
              // 跳转
              router.push('/dashboard');
            } else {
              errorMsg(res.data.msg)
              return
            }
          })
		}
	});
};

// 更新userStore中的数据
function init_user_info() {
  const userStore = useUserStore()
  get_user_info().then(
      res => {
        if (res.data.code == 2000) {
          if (res.data.data.avatar != "") {
            userStore.setAvatarImg(res.data.data.avatar)
          }
          userStore.setUserName(res.data.data.user_name)
          userStore.setNickName(res.data.data.nick_name)
          userStore.setUserID(res.data.data.user_id)
          userStore.setGroupID(res.data.data.group_id)
          userStore.setGroupTitle(res.data.data.group_title)
          userStore.setRoleIDs(res.data.data.role_ids)
          userStore.setRoleTitle(res.data.data.role_title)
        }
      })
}


const errorMsg = (msg: string) => {
  ElMessage.error(msg)
}

const successMsg = (msg: string) => {
  ElMessage.success(msg)

}

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../../assets/img/login-bg.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
