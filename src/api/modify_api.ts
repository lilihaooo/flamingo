import request from "../utils/request";




export const create_component_modify = (data: any) => {
    return request({
        url: '/api/v1/modify/create',
        method: 'post',
        data: data
    });
};


export const del_modify_by_id = (id: number) => {
    console.log(id)
    return request({
        url: '/api/v1/modify/del',
        method: 'delete',
        params: {'id': id}
    });
};