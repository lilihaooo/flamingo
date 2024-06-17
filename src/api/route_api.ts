import request from "../utils/request";

export const get_all_route_list = () => {
    return request({
        url: '/api/v1/route/all/list',
        method: 'get',
    });
};


