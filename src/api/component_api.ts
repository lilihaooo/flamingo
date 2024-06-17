import request from '../utils/request';

export const getAllComponentData = (page_size: number, current_page: number,  keyword: string,sort: any,) => {
    return request({
        url: '/api/v1/component/all',
        method: 'post',
        data: {page_size, current_page,  keyword, sort}
    });
};


export const createOneComponent = (data: any) => {
    return request({
        url: '/api/v1/component',
        method: 'post',
        data: data
    });
};


export const get_component_search_data = (group_id: number) => {
    return request({
        url: '/api/v1/component/search/list',
        method: 'get',
        params: {'group_id': group_id}
    });
};


export const del_component_by_ids = (ids: number[]) => {
    return request({
        url: '/api/v1/component/del',
        method: 'post',
        data: {"ids": ids}
    });
};

export const update_component = (componentID: number, certificateIDs: number[]) => {
    return request({
        url: '/api/v1/component',
        method: 'put',
        data: {"id": componentID, "certificate_ids": certificateIDs}
    });
};


export const changeComponentState = (id: number) => {
    return request({
        url: '/api/v1/component/change/state',
        method: 'get',
        params: {'id': id}
    });
};


export const get_component_info = (id: number) => {
    return request({
        url: '/api/v1/component/info',
        method: 'get',
        params: {'id': id}
    });
};




export const get_component_modify_info = (id: number) => {
    return request({
        url: '/api/v1/component/modify/list',
        method: 'get',
        params: {'id': id}
    });
};


export const get_component_certificate_info = (id: number) => {
    return request({
        url: '/api/v1/component/certificate/list',
        method: 'get',
        params: {'id': id}
    });
};

