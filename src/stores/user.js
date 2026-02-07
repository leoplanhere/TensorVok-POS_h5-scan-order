import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../common/index.js'

export const useUserStore = defineStore('user', () => {
  // ==================== State ====================
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const defaultAddress = ref(JSON.parse(localStorage.getItem('defaultAddress') || 'null'))
  const shopuid = ref(localStorage.getItem('SHOPUID') || '')
  const shopInfo = ref(JSON.parse(localStorage.getItem('shopInfo') || 'null'))
  // ==================== Computed ====================
  const isLogin = computed(() => !!userInfo.value)
  const userId = computed(() => userInfo.value?.id || userInfo.value?.user_id || '')
  const userName = computed(() => userInfo.value?.name || userInfo.value?.nickname || userInfo.value?.username || '')
  const userPhone = computed(() => userInfo.value?.phone || userInfo.value?.mobile || '')

  // ==================== Actions ====================
  
  // 设置用户信息
  const setUserInfo = (value) => {
    userInfo.value = value
    if (value) {
      localStorage.setItem('userInfo', JSON.stringify(value))
    } else {
      localStorage.removeItem('userInfo')
    }
  }

  // 设置默认地址
  const setDefaultAddress = (value) => {
    defaultAddress.value = value
    if (value) {
      localStorage.setItem('defaultAddress', JSON.stringify(value))
    } else {
      localStorage.removeItem('defaultAddress')
    }
  }

  // 设置店铺UID
  const setShopUid = (value) => {
    shopuid.value = value
    if (value) {
      localStorage.setItem('SHOPUID', value)
    } else {
      localStorage.removeItem('SHOPUID')
    }
  }
  //获取店铺信息
  const getShopInfo = async (shopuid) => { 
    try {
      const res = await api.getShop(shopuid)
      
      if (res.code == 1) {
        return {
          success: true,
          data: res.data
        }
      }
      
      return {
        success: false,
        message: res.message || '获取店铺信息失败'
      }
    } catch (error) {
      console.error('获取店铺信息失败:', error)
      return {
        success: false,
        message: '网络错误，请检查网络'
      }
    }
  }

  // 获取地址列表并设置默认地址
  const getAddressList = async (userId) => {
    try {
      const res = await api.ArrdessList({ user_id: userId })
      
      if (res.code == 1) {
        let defaultAddressList = []
        
        if (res.data && Array.isArray(res.data)) {
          // 筛选默认地址
          defaultAddressList = res.data.filter(item => item.status == 1)
        }
        
        // 设置默认地址
        setDefaultAddress(defaultAddressList)
        
        // 返回完整地址列表
        return {
          success: true,
          data: res.data || [],
          defaultAddress: defaultAddressList
        }
      }
      
      return {
        success: false,
        message: res.message || '获取地址失败'
      }
    } catch (error) {
      console.error('获取地址列表失败:', error)
      return {
        success: false,
        message: '网络错误，请重试'
      }
    }
  }

  // 密码登录
  const loginByPassword = async (phone, password) => {
    try {
      const result = await api.passWord({ phone, password })
      
      if (result.code == 1 && result.data) {
        setUserInfo(result.data)
        return {
          success: true,
          data: result.data
        }
      } else {
        return {
          success: false,
          message: result.message || '登录失败'
        }
      }
    } catch (error) {
      console.error('密码登录失败:', error)
      return {
        success: false,
        message: '网络错误，请检查网络'
      }
    }
  }

  // 小程序登录
  const loginByMiniProgram = async (code) => {
    try {
      const result = await api.AouthLogin({ code })
      
      if (result.code == 1 && result.data) {
        setUserInfo(result.data)
        return {
          success: true,
          data: result.data
        }
      } else {
        return {
          success: false,
          message: result.message || '登录失败'
        }
      }
    } catch (error) {
      console.error('小程序登录失败:', error)
      return {
        success: false,
        message: '网络错误，请检查网络'
      }
    }
  }

  // 手机号登录
  const loginByPhone = async (phone, code) => {
    try {
      const result = await api.loginByPhone(phone)
      if ( result.data.userinfo) {
        setUserInfo(result.data.userinfo)
        return {
          success: true,
          data: result.userinfo
        }
      } else {
        return {
          success: false,
          message: result.message || '登录失败'
        }
      }
    } catch (error) {
      console.error('手机号登录失败:', error)
      return {
        success: false,
        message: '网络错误，请检查网络'
      }
    }
  }

  // 判断是否登录过
  const checkLoginStatus = async (id) => {
    try {
      const result = await api.whetherornotLogin()
      return result
    } catch (error) {
      console.error('检查登录状态失败:', error)
      return { success: false }
    }
  }

  // 获取用户信息表
  const fetchUserInfo = async (id) => {
    try {
      const result = await api.getUserInfo({uid: id})
      if (result.code == 1 && result.data) {
        return {
          success: true,
          data: result.data
        }
      }
      
      return {
        success: false,
        message: result.message || '获取用户信息失败'
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return {
        success: false,
        message: '网络错误'
      }
    }
  }

  // 手机号更改
  const updatePhone = async (data) => {
    try {
      const result = await api.EditPhone(data)
      
      if (result.code == 1) {
        // 更新本地用户信息
        if (userInfo.value) {
          userInfo.value.phone = data.phone
          setUserInfo(userInfo.value)
        }
        
        return {
          success: true,
          message: result.message || '手机号修改成功'
        }
      }
      
      return {
        success: false,
        message: result.message || '修改失败'
      }
    } catch (error) {
      console.error('修改手机号失败:', error)
      return {
        success: false,
        message: '网络错误'
      }
    }
  }

  // 查询我的折扣
  const getMyDiscount = async () => {
    try {
      const result = await api.Mydiscount()
      
      if (result.code == 1) {
        return {
          success: true,
          data: result.data
        }
      }
      
      return {
        success: false,
        message: result.message || '获取折扣失败'
      }
    } catch (error) {
      console.error('获取折扣失败:', error)
      return {
        success: false,
        message: '网络错误'
      }
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      // 调用退出接口（如果有）
      // await api.logout()
      
      // 清除本地数据
      clearUserInfo()
      
      return {
        success: true,
        message: '已退出登录'
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使接口失败，也要清除本地数据
      clearUserInfo()
      return {
        success: true,
        message: '已退出登录'
      }
    }
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    defaultAddress.value = null
    shopuid.value = ''
    
    localStorage.removeItem('userInfo')
    localStorage.removeItem('defaultAddress')
    localStorage.removeItem('SHOPUID')
  }

  // 从本地存储恢复用户状态
  const restoreUserState = () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      const addressStr = localStorage.getItem('defaultAddress')
      const shopUid = localStorage.getItem('SHOPUID')
      
      if (userInfoStr) {
        userInfo.value = JSON.parse(userInfoStr)
      }
      
      if (addressStr) {
        defaultAddress.value = JSON.parse(addressStr)
      }
      
      if (shopUid) {
        shopuid.value = shopUid
      }
    } catch (error) {
      console.error('恢复用户状态失败:', error)
      // 解析失败时清除错误数据
      localStorage.removeItem('userInfo')
      localStorage.removeItem('defaultAddress')
    }
  }

  // 初始化时恢复状态
  restoreUserState()

  return {
    // State
    userInfo,
    defaultAddress,
    shopuid,
    shopInfo,
    
    // Computed
    isLogin,
    userId,
    userName,
    userPhone,
    
    // Actions
    setUserInfo,
    setDefaultAddress,
    setShopUid,
    getAddressList,
    loginByPassword,
    loginByMiniProgram,
    loginByPhone,
    checkLoginStatus,
    fetchUserInfo,
    updatePhone,
    getMyDiscount,
    logout,
    clearUserInfo,
    restoreUserState,
    getShopInfo
  }
})