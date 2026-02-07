import http from '../request'

export default {
  // 我的优惠券列表
  getMyCouponList(data) {
    return http.get('/coupon/lists', data, {
      hideLoading: false
    })
  }
}