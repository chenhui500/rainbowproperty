import config from '@/config'
import axios from 'axios';

let base = config[process.env.NODE_ENV].host; //接口地址
console.log('url => %s', base);


//登录接口
export const requestLogin = params => {
  return axios.post(`${base}/admin/login/`, params).then(res => res.data);
};

//修改用户等级
export const updateUserGrade = (params) => {
    return axios.post(`${base}/user/updateUser`, params)
}

//获取预约表单信息
export const getOrderList = (page, prepage, filter) => {
    return axios.get(
        `${base}/api/order/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
    );
}
//修改预约表单服务类型
export const updateOrder = (params) => {
    return axios.post(`${base}/order/updateOrder`, params)
}

//获取推荐奖励说明列表
export const getRewardList = (page, prepage, filter) => {
    return axios.get(
        `${base}/api/reward/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
    );
}
//修改推荐奖励说明
export const updateReward = (params) => {
    return axios.post(`${base}/reward/updateReward`, params)
}

//新增推荐奖励说明
export const addReward = (params) => {
    return axios.post(`${base}/reward/addReward`, params)
}

//删除推荐奖励说明
export const delReward = (params) => {
    return axios.post(`${base}/reward/delReward`, params)
}


//获取活动列表
export const getPromotionList = (page, prepage, filter) => {
    return axios.get(
        `${base}/api/promotion/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
    );
}
//修改活动
export const updatePromotion = (params) => {
    return axios.post(`${base}/promotion/updatePromotion`, params)
}

//新增活动
export const addPromotion = (params) => {
    return axios.post(`${base}/promotion/addPromotion`, params)
}

//删除活动
export const delPromotion = (params) => {
    return axios.post(`${base}/promotion/delPromotion`, params)
}

//获取活动列表
export const getUserList = (page, prepage, filter) => {
    return axios.get(
        `${base}/api/user/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
    );
}

//获取管理员列表
export const getAdminList = (page, prepage, filter) => {
    return axios.get(
        `${base}/api/admin/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
    );
}
//新增管理员
export const addAdminUser = (params) => {
    return axios.post(`${base}/admin/addAdminUser`, params)
}

//更新密码
export const updateAdminUser = (params) => {
    return axios.post(`${base}/admin/updateAdminUser`, params)
}

//删除管理员
export const delAdminUser = (params) => {
    return axios.post(`${base}/admin/delAdminUser`, params)
}




//获取简介说明列表
export const getSynopsisList = (page, prepage, filter) => {
    return axios.get(
        `${base}/api/synopsis/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
    );
}
//修改简介说明
export const updateSynopsis = (params) => {
    return axios.post(`${base}/synopsis/updateSynopsis`, params)
}

//新增简介说明
export const addSynopsis = (params) => {
    return axios.post(`${base}/synopsis/addSynopsis`, params)
}

//删除简介说明
export const delSynopsis = (params) => {
    return axios.post(`${base}/synopsis/delSynopsis`, params)
}





