import http from '../request'

export default {
  // 获取单个店铺（登录）
  getShop(data) {
    return http.post('/shop/getshop', data, {
      hideLoading: false
    })
  },

getOperateDetails(id) {
    return http.post('/currency/operateDetails', {
        shop_id: id 
    }, {
        hideLoading: true
    })
},

  // 获取单个店铺（无登录）
  getShopWithoutLogin(data) {
    return http.post('/shop/getshop1', data, {
      hideLoading: false
    })
  }
}