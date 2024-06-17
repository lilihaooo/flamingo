import request from "../utils/request";



// 联想input的列表
export const task_add = (data: any) => {
    return request({
        url: '/api/v1/task/add',
        method: 'post',
        data: data
    });
};

export const get_all_task_paging_list = (page_size: number, current_page: number,  keyword: string,sort: any, condition?: any) => {
    return request({
        url: '/api/v1/task/all/paging',
        method: 'post',
        data: {page_size, current_page,  keyword, sort, condition}
    });
};

export const get_my_tasking_paging_list = (page_size: number, current_page: number,  keyword: string,sort: any, condition?: any) => {
    return request({
        url: '/api/v1/task/my_tasking/paging',
        method: 'post',
        data: {page_size, current_page,  keyword, sort, condition}
    });
};

export const get_list_approve = (page_size: number, current_page: number,  keyword: string,sort: any, condition?: any) => {
    return request({
        url: '/api/v1/task/list/approve/',
        method: 'post',
        data: {page_size, current_page,  keyword, sort, condition}
    });
};


export const get_all_task_list = (condition?: any) => {
    return request({
        url: '/api/v1/task/all',
        method: 'post',
        data: {condition}
    });
};


export const task_share = (data: any) => {
    return request({
        url: '/api/v1/task/share',
        method: 'post',
        data: data
    });
};

export const add_task_replace = (data: any) => {
    return request({
        url: '/api/v1/task/add/replace',
        method: 'post',
        data: data
    });
};

export const get_task_info = (id: number) => {
    return request({
        url: '/api/v1/task',
        method: 'get',
        params: {'id': id}
    });
};

// 登记任务的换件
export const enroll_task_replace = (id: number) => {
    return request({
        url: '/api/v1/task/replace/enroll',
        method: 'put',
        params: {'task_id': id}
    });
};

export const get_task_replace_list = (id: number) => {
    return request({
        url: '/api/v1/task/replace/list',
        method: 'get',
        params: {'task_id': id}
    });
};