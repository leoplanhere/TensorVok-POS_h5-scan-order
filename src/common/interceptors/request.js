import { showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '../../stores/user'

// 请求拦截器
export default {
  // 请求成功处理
  onRequest(config) {
    // 从pinia store获取token
    let token = ''
    try {
      const userStore = useUserStore?.()
      token = userStore.userInfo?.token || localStorage.getItem('token') || sessionStorage.getItem('token')
    } catch (error) {
      console.log('获取token失败:', error)
    }
    
    // 添加token到请求头
    if (token) {
      config.headers.token = ` ${token}`
    }

    // 移动端常用headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['App-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0'

    // 添加时间戳，防止缓存
    if (config.method === 'get' || config.method === 'GET') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 记录请求开始时间和配置
    config.metadata = {
      startTime: Date.now(),
      showLoading: config.showLoading,
      showError: config.showError,
      silent: config.silent
    }

    // 显示Vant加载提示
    if (config.showLoading && !config.silent) {
      config.loadingToast = showLoadingToast({
        message: 'Loading...',
        overlay:true,
        forbidClick: true,
        duration: 0 // 持续显示
      })
    }

    return config
  },

  // 请求错误处理
  onRequestError(error) {
    console.error('请求错误:', error)
    
    // 关闭可能的loading
    closeToast()
    
    return Promise.reject(error)
  }
}