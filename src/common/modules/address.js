import http from '../request'

export default {
  // 地址列表
  getAddressList(data) {
    return http.post('/order/listAddress', data, {
      hideLoading: false
    })
  },

  // 添加地址
  addAddress(data) {
    return http.post('/order/addAddress', data, {
      hideLoading: false
    })
  },

  // 修改地址
  editAddress(data) {
    return http.post('/order/updateAddress', data, {
      hideLoading: false
    })
  },

  // 地址详情
  getAddressDetail(data) {
    return http.post('/order/detailsAddress', data, {
      hideLoading: false
    })
  },

  // 删除地址
  deleteAddress(data) {
    return http.post('/order/deleteAddress', data, {
      hideLoading: false
    })
  }
}