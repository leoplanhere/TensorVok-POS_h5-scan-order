import http from '../request'

export default {
  // 获取用户信息
  getUserInfo(data) {
    return http.post('/customer/myinfo', data, {
      hideLoading: false
    })
  },

  // 修改手机号
  editPhone(data) {
    return http.post('/customer/information', data, {
      hideLoading: false
    })
  },

  // 查询我的折扣
  getMyDiscount(data) {
    return http.get('/customer/mydiscount', data, {
      hideLoading: false
    })
  }
}