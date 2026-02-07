import http from '../request'

export default {
  // NETS 支付
  netsOrderLaunch(data) {
    return http.post('/Nets/checkout', data, {
      hideLoading: false
    })
  },
  // NETS 支付结果
  check_statusResult(data) {
    return http.get('/Nets/check_status', data, {
      silent: true
    })
  },
  // 支付
  orderLaunch(data) {
    return http.post('/index/fwslaunch', data, {
      hideLoading: false
    })
  },
  // 余额支付
  payWithBalance(data) {
    return http.post('/recharge/paybalance', data, {
      hideLoading: false
    })
  },
  // 添加支付记录
  addPayRecord(data) {
    return http.post('/index/addPaymentLog', data, {
      hideLoading: false
    })
  },
  // 获取广告位 - 修正：将 request 改为 http.post
  getAdvertisement(data) {
    return http.post('/applet/detailsNotice', data, {
      hideLoading: true
    })
  },
  // 获取小程序标签栏 - 修正：将 request 改为 http.post
  getTabbarList(data) {
    return http.post('/index/xcx_menu', data, {
      hideLoading: true
    })
  },
  // 发送订阅消息 - 修正：将 request 改为 http.post
  subscribeMessage(data) {
    return http.post('/sms/subscribeTo', data, {
      hideLoading: false
    })
  },
  // 获取小程序菜单 - 修正：将 request 改为 http.post
  getMiniProgramMenu(data) {
    return http.post('/demo/getXcxMenu', data, {
      hideLoading: false
    })
  },
  // 服务税费详情 - 修正：将 request 改为 http.post
  getServiceTaxDetails(data) {
    return http.post('/currency/operateDetails', data, {
      hideLoading: false
    })
  }
}