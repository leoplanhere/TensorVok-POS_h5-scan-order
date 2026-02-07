import http from '../request'

export default {
  // 获取充值记录规则
  getRechargeRules(data) {
    return http.get('/recharge/lists', data, {
      hideLoading: false
    })
  },

  // 充值
  recharge(data) {
    return http.post('/recharge/recharge', data, {
      hideLoading: false
    })
  },

  // 充值记录
  getRechargeRecords(data) {
    return http.get('/recharge/myrecharge', data, {
      hideLoading: false
    })
  },

  // 折扣卡列表
  getDiscountList(data) {
    return http.get('/recharge/discountlist', data, {
      hideLoading: false
    })
  },

  // 购买折扣卡
  buyDiscount(data) {
    return http.post('/recharge/buydiscount', data, {
      hideLoading: false
    })
  }
}