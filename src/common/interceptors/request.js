import { showLoadingToast, closeToast } from 'vant'

export default {
  onRequest(config) {
    // 从 localStorage 获取 token（不通过 store 避免潜在递归）
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    
    // 添加 token 到请求头
    if (token) {
      config.headers.token = ` ${token}`
    }

    // 移动端常用 headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    // 添加时间戳，防止缓存
    if (config.method === 'get' || config.method === 'GET') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 显示加载提示
    if (config.showLoading && !config.silent) {
      try {
        showLoadingToast({
          message: 'Loading...',
          overlay: true,
          forbidClick: true,
          duration: 0
        })
      } catch (e) {
        console.error('Failed to show loading toast:', e)
      }
    }

    return config
  },

  onRequestError(error) {
    console.error('Request error:', error)
    try {
      closeToast()
    } catch (e) {
      // ignore
    }
    return Promise.reject(error)
  }
}