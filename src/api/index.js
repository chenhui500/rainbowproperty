import config from '@/config'
import axios from 'axios';

let base = config[process.env.NODE_ENV].host; //接口地址
console.log('url => %s', base);


//登录接口
export const requestLogin = params => {
  return axios.post(`${base}/admin/login/`, params).then(res => res.data);
};

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



//获取维修单
export const getOrder = (page, prepage, filter) => {
  return axios.get(
    `${base}/api/order/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}`
  );
}

//获取全部维修人员分页信息
export const getAllMaintenance = () => {
  return axios.get(`${base}/api/maintenance`)
}

/*//修改维修单
export const updateOrder = (id, params) => {
  return axios.put(`${base}/api/order/${id}`, params);
}*/

//发送派单维修信息 http://api.yx101.cn/hycDevelop/send/dispatch
//{"title":"维修价格","orderId":"154105374726676","content":"门出问题了","openID":"oQBciw2BV7CxY7zAxkx-yzEboppI","order_id":"5bda9d33a8cb963909ccf484"}
export const sendDispatch = (params) => {
  return axios.post(`${base}/send/dispatch`, params)
}

//添加基本信息
export const addBasic = (params) => {
  return axios.post(`${base}/api/basic`, params);
}

//获取基本信息
export const getBasic = () => {
  return axios.get(`${base}/api/basic`)
}

//修改基本信息
export const updateBasicInfo = (id, data) => {
  return axios.put(`${base}/api/basic/${id}`, data);
};
