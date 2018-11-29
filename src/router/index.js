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
                    path: '/promotionhanding',
                    component: resolve => require(['../components/page/PromotionHanding.vue'], resolve),
                    meta: { title: '推广活动管理' }
                },
                {
                    path: '/synopsishanding',
                    //component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    component: resolve => require(['../components/page/SynopsisHanding.vue'], resolve),
                    meta: { title: '产品介绍管理' }
                },
                {
                    path: '/memberhanding',
                    component: resolve => require(['../components/page/MemberHanding.vue'], resolve),
                    meta: { title: '会员管理' }
                },
                {
                    path: '/settinghanding',
                    component: resolve => require(['../components/page/SettingHanding.vue'], resolve),
                    meta: { title: '设置' }
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
