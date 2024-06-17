<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="userStore.getUserAvatarImg"/>
              <span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
            </div>
            <div class="info-name">{{ nick_name }}</div>
            <div class="info-desc">{{ profile }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="用户名："> {{ userStore.getUserName }}</el-form-item>
            <el-form-item label="昵称：" >
              <el-input v-model="form.nick_name" :disabled="userStore.getUserName == 'admin'"></el-input>
            </el-form-item>
            <el-form-item label="旧密码：">
              <el-input type="password" v-model="form.old"></el-input>
            </el-form-item>
            <el-form-item label="新密码：">
              <el-input type="password" v-model="form.new"></el-input>
            </el-form-item>
            <el-form-item label="个人简介：">
              <el-input v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper
          ref="cropper"
          :src="imgSrc"
          :ready="cropImage"
          :zoom="cropImage"
          :cropmove="cropImage"
          style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary"
          >选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
					</el-button>
					<el-button type="primary" @click="saveAvatar">上传并保存</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="user">
import {reactive, ref} from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {get_user_info, set_avatar} from "../../api/user_api";
import {ElMessage} from "element-plus";
import {useUserStore} from "../../store/user";
const userStore = useUserStore()


const onSubmit = () => {
};

const profile = ref('');
const nick_name = ref('');
const email = ref('');
const tel = ref('');

function init_user_info() {
  get_user_info().then(
      res => {
        if (res.data.code == 2000) {
          if (res.data.data.avatar != "") {
            userStore.setAvatarImg(res.data.data.avatar)
          }
          nick_name.value = res.data.data.nick_name
          profile.value = res.data.data.profile
          email.value = res.data.data.email
          tel.value = res.data.data.tel
          nick_name.value= res.data.data.nick_name
        }
      })
}
init_user_info()
const form = reactive({
  old: '',
  new: '',
  desc: profile,
  email: email,
  tel: tel,
  nick_name: nick_name
});


const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
  dialogVisible.value = true;
  imgSrc.value = userStore.getUserAvatarImg;
};

const setImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes('image/')) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event: any) => {
    dialogVisible.value = true;
    imgSrc.value = event.target.result;
    cropper.value && cropper.value.replace(event.target.result);
  };
  reader.readAsDataURL(file);
};

const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
  // 提取文件名和后缀名
  const suffix = 'jpg'; // 替换为实际的文件名
  const formData = new FormData();
  formData.append('image', dataURItoBlob(cropImg.value), `${userStore.getUserName}_avatar.${suffix}`); // 转换为 Blob 对象
  // 头像上传
  set_avatar(formData).then(
      res => {
        if (res.data.code == 2000){
          successMsg(res.data.msg)
          return
        }else {
          errorMsg(res.data.msg)
          return
        }
      })
  userStore.setAvatarImg( cropImg.value);
  dialogVisible.value = false;
};
const successMsg = (msg: string) => {
  ElMessage.success(msg)
}
const errorMsg = (msg: string) => {
  ElMessage.error(msg)

}
// 将 Data URI 转换为 Blob 对象
function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
}


</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}

.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-edit i {
  color: #eee;
  font-size: 25px;
}

.info-image:hover .info-edit {
  opacity: 1;
}

.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.crop-demo-btn {
  position: relative;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
