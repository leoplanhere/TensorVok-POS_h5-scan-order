import http from '../request'

export default {
  // 下单（临时订单）
  placeOrder(data) {
    return http.post('/order/smtemporaryorderadd', data, {
      hideLoading: false
    })
  },

  // 咖啡下单
  coffeeOrder(data) {
    return http.post('/order/smtemporaryorderaddkf', data, {
      hideLoading: false
    })
  },

  // 正式添加订单
  addFormalOrder(data) {
    return http.post('/order/smdcneworderadd', data, {
      hideLoading: false
    })
  },

  /**
     * 支付成功后的存单接口
     * @param {Object} data 包含 pay_type, paymentOrder, reserve_list_id 等
     */
    reserveCheckout(data) {
        return http.post('/reserve/checkout', data, {
            hideLoading: false
        })
    },


   // 添加订单

    newOrderAdd(data) {
        return http.post('/order/neworderadd', data, {
            hideLoading: false
        })
    },



  // 直接下单不支付
  addOrderWithoutPayment(data) {
    return http.post('/order/neworderadd', data, {
      hideLoading: false
    })
  },



  // 订单列表
  getOrderList(data) {
    return http.post('/order/scanCodeOrderList', data, {
      hideLoading: false
    })
  },

  // 订单详情
  getOrderDetail(data) {
    return http.post('/order/orderDetailssm', data, {
      hideLoading: false
    })
  },

  // 评分
  setRate(data) {
    return http.post('/reserve/addScore', data, {
      hideLoading: false
    })
  },

  // 支付成功修改订单状态
  updateOrderStatus(data) {
    return http.post('/Scancode/updatePrint1', data, {
      hideLoading: false
    })
  },

  // 清台关台
  clearTable(data) {
    return http.post('/index/shujuqingli2', data, {
      hideLoading: false
    })
  },

  // 扫码开台
  scanOpenTable(data) {
    return http.post('/Scancode/smdirectBegin', data, {
      hideLoading: false
    })
  },

  // 订单验证
  validateOrder(data) {
    return http.post('/order/getXceOrder', data, {
      hideLoading: false
    })
  },

  // 退款
  refundOrder(data) {
    return http.post('/index/wddrefundOrder', data, {
      hideLoading: false
    })
  },

  // 查询支付订单信息
  getOrderInformation(data) {
    return http.post('/index/getOrderInformation', data, {
      hideLoading: false
    })
  },
   //订单列表
   OrderList:function(data){
	   return http.post('/order/scanCodeOrderList', data, {
      hideLoading: false
    })
   },
   
   //订单列表详情
   OrderDetail:function(data){
    return http.post('/order/orderDetailssm', data, {
      hideLoading: false
    })
   },
   //评分
   setRate:function(data){
    return http.post('/reserve/addScore', data, {
      hideLoading: false
    })
   },
}