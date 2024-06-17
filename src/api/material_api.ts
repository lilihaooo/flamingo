import request from "../utils/request";

export const getMaterialSearchList = (page_size: number, current_page: number,  keyword: string,sort: any,) => {
    return request({
        url: '/api/v1/material/search/list',
        method: 'post',
        data: {page_size, current_page,  keyword, sort}
    });
};


