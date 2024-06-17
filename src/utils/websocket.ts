import {ref} from 'vue';
import throttle from 'lodash/throttle';
import {ElMessage} from "element-plus";

interface Data {
    to: number;
    content: string;
    type: number;
}
export let GlobalWs :WebSocket;
export const connectWS = () => {
    let ws: WebSocket;
    const url = getWebSocketUrl();
    try {
        ws = new WebSocket(url);
        console.log("连接ok");
    } catch (error) {
        console.error('WebSocket连接发生错误:', error);
    }
    // @ts-ignore
    GlobalWs = ws
}
const getWebSocketUrl = (): string => {
    const token = localStorage.getItem('flamingo_user_token');
    return `ws://127.0.0.1:8888/ws?token=${token}`;
};

export const sendMessage = (ws: WebSocket, data: Data) => {
    try {
        if (ws && ws.readyState === WebSocket.OPEN) {
            let jsonData = JSON.stringify(data);
            ws.send(jsonData);
        } else {
            console.error('WebSocket连接未打开。');
        }
    } catch (error) {
        console.error('发送消息时发生错误:', error);
    }
}