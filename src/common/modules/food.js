import http from '../request'

export default {
  // 菜品分类查找
  getFoodCategory(data) {
    return http.post('/food/index', data, {
      hideLoading: false
    })
  },

  // 菜单查找
  getFoodMenu(data) {
    return http.post('/scancode/smphoneFood', data, {
      hideLoading: false
    })
  },

  // 菜品详情
  getFoodDetail(data) {
    return http.post('/food/getvarietydetails', data, {
      hideLoading: false
    })
  },

  // 备注标签获取
  getRemarkLabels(data) {
    return http.post('/Reserve/listnone', data, {
      hideLoading: false
    })
  }
}