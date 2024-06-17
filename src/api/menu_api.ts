import request from "../utils/request";

export const get_role_menu_tree = () => {
    return request({
        url: '/api/v1/menu/role/tree',
        method: 'get',
    });
};
export const get_all_menu_tree = () => {
    return request({
        url: '/api/v1/menu/all/tree',
        method: 'get',
    });
};


export const update_menu = (data: any) => {
    return request({
        url: '/api/v1/menu',
        method: 'put',
        data: data
    });
};