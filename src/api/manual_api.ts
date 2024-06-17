import request from "../utils/request";



// 联想input的列表
export const get_manual_list = () => {
    return request({
        url: '/api/v1/manual/list',
        method: 'get',
    });
};


export const get_manual_material_option_list = (manualID :number) => {
    return request({
        url: '/api/v1/manual/material/option/list',
        method: 'get',
        params: {'id': manualID}
    });
};


export const getManualMaterialList = (manual_id :number, page_size: number, current_page: number, keyword: string) => {
    return request({
        url: '/api/v1/manual/material/list',
        method: 'post',
        data: {page_size, current_page, keyword, manual_id}
    });
};


export const createManualMaterial = (data: any) => {
    return request({
        url: '/api/v1/manual/material',
        method: 'post',
        data: data
    });
};