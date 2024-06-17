import request from "../utils/request";

export const get_user_notice_list = () => {
    return request({
        url: '/api/v1/massage/notice/list',
        method: 'get',
    });
};


