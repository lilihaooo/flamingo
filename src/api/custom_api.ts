import request from "../utils/request";



// 联想input的列表
export const get_custom_input_list = () => {
    return request({
        url: '/api/v1/custom/input/list',
        method: 'get',
    });
};