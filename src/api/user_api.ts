import request from '../utils/request';

export const login_req = (data: any) => {
    return request({
        url: '/api/login',
        method: 'post',
        data: data
    });
};

export const get_user_info = () => {
    return request({
        url: '/api/v1/user/info',
        method: 'get',
    });
};

export const del_user_by_id = (id: number) => {
    return request({
        url: '/api/v1/user/del',
        method: 'delete',
        params: {'id': id}
    });
};

// 删除用户手册证书
export const del_umc_by_id = (id: number) => {
    return request({
        url: '/api/v1/user/umc',
        method: 'delete',
        params: {'id': id}
    });
};



export const set_avatar = (data: any) => {
    return request({
        url: '/api/v1/user/set_avatar',
        method: 'post',
        data: data
    });
};

export const user_create = (data: any) => {
    return request({
        url: '/api/v1/user/create',
        method: 'post',
        data: data
    });
};

export const user_update = (data: any) => {
    return request({
        url: '/api/v1/user/update',
        method: 'post',
        data: data
    });
};



export const getUserList = (page_size: number, current_page: number, keyword: string = "") => {
    return request({
        url: '/api/v1/user/list',
        method: 'post',
        data: {page_size, current_page, keyword}
    });
};

export const getUserTableList = (page_size: number, current_page: number, keyword: string) => {
    return request({
        url: '/api/v1/user/authorize/list',
        method: 'post',
        data: {page_size, current_page, keyword}
    });
};


// 全部用户选择列表
export const getUserAllSelectList = () => {
    return request({
        url: '/api/v1/user/all/select/list',
        method: 'get',
    });
};

export const getOptionalUserListData = (id: number, group_id: number) => {
    return request({
        url: '/api/v1/user/task/optional/list',
        method: 'get',
        params: {'id': id, 'group_id': group_id}
    });
};

export const getUserRoleList = (id: number) => {
    return request({
        url: '/api/v1/user/role/list',
        method: 'get',
        params: {'id': id}
    });
};


export const set_user_roles = (id: number, roleIDs: number[]) => {
    return request({
        url: '/api/v1/user/role',
        method: 'post',
        data: {'user_id': id, 'role_ids': roleIDs}
    });
};

export const getUserAuthorizeList = (id: number) => {
    return request({
        url: '/api/v1/user/authorize/list',
        method: 'get',
        params: {'id': id}
    });
};


export const createUserAuthorize = (data: any) => {
    return request({
        url: '/api/v1/user/authorize',
        method: 'post',
        data: data
    });
};


export const changeUserManualCertificateState = (id: number) => {
    return request({
        url: '/api/v1/user/user_manual_certificate/state/change',
        method: 'post',
        params: {'id': id}
    });
};