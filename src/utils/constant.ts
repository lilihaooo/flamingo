import {useUserStore} from "../store/user";
import {ElMessage} from "element-plus";


const userStore = useUserStore()



export const component_info_key = `${userStore.getUserName}_component_info`


export const errorMsg = (msg: string) => {
    ElMessage.error(msg)
}
export const successMsg = (msg: string) => {
    ElMessage.success(msg)
}



