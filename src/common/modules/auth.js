import http from '../request'

export default {
  // 密码登录
  loginByPassword(data) {
    return http.post('/phone/mobilelogin', data, {
      hideLoading: false
    })
  },

  // 小程序登录
  loginByMiniProgram(data) {
    return http.post('/demo/getopenidAction', data, {
      hideLoading: false
    })
  },

  // 手机号登录
  loginByPhone(data) {
    return http.post('/user/wechatlogin', data, {
      hideLoading: false
    })
  },

  // Openid登录
  loginByOpenid(data) {
    return http.post('/user/wechatNameLogin', data, {
      hideLoading: false
    })
  },

  // 获取用户手机号
  getUserPhone(data) {
    return http.post('/demo/getuserphonenumber', data, {
      hideLoading: false
    })
  },

  // 获取登录状态
  getLoginStatus(data) {
    return http.post('/demo/getUserstatus', data, {
      hideLoading: false
    })
  },

  // 判断是否登录过
  checkLoginStatus(data) {
    return http.post('/user/whetherornotLogin', data, {
      hideLoading: false
    })
  }
}