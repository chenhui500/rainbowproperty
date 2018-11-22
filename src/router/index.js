import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    //component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    component: resolve => require(['../components/page/Main.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/orderhanding',
                    //component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    component: resolve => require(['../components/page/OrderHanding.vue'], resolve),
                    meta: { title: '推荐单管理' }
                },
                {
                    path: '/rewardhanding',
                    component: resolve => require(['../components/page/RewardHanding.vue'], resolve),
                    meta: { title: '推荐奖励管理' }
                },
                {
                    path: '/repairinghanding',
                    component: resolve => require(['../components/page/RepairingHanding.vue'], resolve),
                    meta: { title: '打印管理' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
