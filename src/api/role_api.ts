import request from "../utils/request";

export const all_role_list_api = () => {
    return request({
        url: '/api/v1/role/all/list',
        method: 'get',
    });
};


