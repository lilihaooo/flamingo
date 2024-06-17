import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import router from "../router";

const service: AxiosInstance = axios.create({
    timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('flamingo_user_token');
        if (token != "") {
            // @ts-ignore
            config.headers.token = `${token}`; // 将token添加到请求头中
        } else {
            // todo 跳转到登陆界面
            router.push({
                path: '/login'
            })
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 检查 response.data 是否为 undefined，并检查 code 属性
        if (response.data?.code === 4200) {
            // todo 跳转到登陆界面
            router.push({
                path: '/login'
            })
            // 注意：这里应该返回一个 Promise.resolve，表示成功处理了拦截器
            return Promise.resolve(response);
        }


        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
