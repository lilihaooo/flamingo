import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登陆',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/user/login.vue'),
    },
    {
        path: '/',
        name: 'web',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/web.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/home/dashboard.vue'),
            },
            {
                path: '/market',
                name: 'market',
                meta: {
                    title: '市场管理',
                },
                children: [
                    {
                        path: 'component_in',
                        name: 'component_in',
                        meta: {
                            title: '任务下发',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/market/create_task.vue'),
                    },
                    {
                        path: 'component_out',
                        name: 'component_out',
                        meta: {
                            title: '附件出厂',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/market/component_out.vue'),
                    },

                    {
                        path: 'data_export',
                        name: 'data_export',
                        meta: {
                            title: '数据导出',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/market/data_export.vue'),
                    },
                ]
            },
            {
                path: '/accessory',
                name: 'accessory',
                meta: {
                    title: '附件维修',
                },
                children: [
                    {
                        path: 'check_apply',
                        name: 'check_apply',
                        meta: {
                            title: '故检申请',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/accessory/check_apply.vue'),
                    },
                    {
                        path: 'task_list/edit_task/:id',
                        // props:true, // 将路由参数作为props传递给组件
                        name: 'edit_task',
                        meta: {
                            title: '编辑清单',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/accessory/task_list/main_content.vue'),
                    },
                    {
                        path: 'tasking',
                        name: 'tasking',
                        meta: {
                            title: '我的任务'
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/accessory/my_tasking.vue'),
                    },
                    {
                        path: 'all_task',
                        name: 'all_task',
                        meta: {
                            title: '全部任务',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/accessory/all_task.vue'),
                    },
                    {
                        path: 'outsource_accept',
                        name: 'outsource_accept',
                        meta: {
                            title: '外委接受',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/accessory/outsource_accept.vue'),
                    },
                ]
            },
            {
                path: '/support',
                name: 'support',
                meta: {
                    title: '生产支援',
                },
                children: [
                    {
                        path: 'part_in',
                        name: 'part_in',
                        meta: {
                            title: '航材入库',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/support/part_in.vue'),
                    },
                    {
                        path: 'part_out',
                        name: 'part_out',
                        meta: {
                            title: '航材出库',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/support/part_out.vue'),
                    },
                    {
                        path: 'search_part',
                        name: 'search_part',
                        meta: {
                            title: '库存查询',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/support/search_part.vue'),
                    },
                ]
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '用户管理',
                },
                children: [
                    {
                        path: 'list',
                        name: 'list',
                        meta: {
                            title: '用户管理',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/user/user_manage.vue'),
                    },
                    {
                        path: 'info',
                        name: 'info',
                        meta: {
                            title: '个人中心',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/user/user_info.vue'),
                    },
                    {
                        path: 'authorize',
                        name: 'authorize',
                        meta: {
                            title: '人员授权',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/user/user_authorize.vue'),
                    },
                    {
                        path: 'role',
                        name: 'role',
                        meta: {
                            title: '角色管理',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/user/role_manage.vue'),
                    },
                ]
            },
            {
                path: '/menu',
                name: 'menu',
                meta: {
                    title: '菜单管理',
                },
                children: [
                    {
                        path: 'manage',
                        name: '菜单管理',
                        meta: {
                            title: '菜单管理',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/menu/menu_manage.vue'),
                    },
                ]
            },
            {
                path: '/route',
                name: 'route',
                meta: {
                    title: '路由管理',
                },
                children: [
                    {
                        path: 'manage',
                        name: 'manage',
                        meta: {
                            title: '路由管理',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/route/route_manage.vue'),
                    },
                ]
            },
            {
                path: '/base_data',
                name: 'base_data',
                meta: {
                    title: '基础数据',
                },
                children: [
                    {
                        path: 'component_manage',
                        name: 'component_manage',
                        meta: {
                            title: '附件管理',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/base_data/component/component_manage.vue'),
                    },
                    {
                        path: 'component/info',
                        name: 'component_info',
                        meta: {
                            title: '附件详情',
                        },
                        component: () => import(/* webpackChunkName: "dashboard" */ '../views/base_data/component/component_info.vue'),
                        props: true
                    },
                    {
                        path: 'manual_manage',
                        name: 'manual_manage',
                        meta: {
                            title: '手册管理',
                        },
                        component: () => import(/* webpackChunkName: "dashboard" */ '../views/base_data/manual/manual_manage.vue'),
                        props: true
                    },
                ]
            },
            {
                path: '/group',
                name: 'group',
                meta: {
                    title: '小组管理',
                },
                children: [
                    {
                        path: 'share',
                        name: 'share',
                        meta: {
                            title: '任务分配',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/group/task_share.vue'),
                    },
                    {
                        path: 'approve',
                        name: 'approve',
                        meta: {
                            title: '清单审批',
                        },
                        component: () => import(/* webpackChunkName: "table" */ '../views/group/list_approve.vue'),
                    },
                ]
            },
        ]

    }]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    // 建立链接


    document.title = `${to.meta.title} | WildGoose`;
    const token = localStorage.getItem('flamingo_user_token');
    if ( to.path !== '/login' && token == null) {
        // 未登录 跳转到登陆页面
        next('/login');
    } else {
        next();
    }
});

export default router;
