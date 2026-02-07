import axios from 'axios'
import { showToast, showDialog } from 'vant'
import requestInterceptor from './interceptors/request'
import responseInterceptor from './interceptors/response'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
request.interceptors.request.use(
  requestInterceptor.onRequest,
  requestInterceptor.onRequestError
)

// 添加响应拦截器
request.interceptors.response.use(
  responseInterceptor.onResponse,
  responseInterceptor.onResponseError
)

// 请求配置默认值
const defaultConfig = {
  showLoading: true,     // 是否显示加载提示
  showError: true,       // 是否显示错误提示
  silent: false,         // 是否静默请求（不显示任何提示）
  retry: 0,              // 重试次数
  retryDelay: 1000,      // 重试延迟
}

// 通用请求方法
const http = {
  // GET请求
  get(url, params = {}, config = {}) {
    return request({
      url,
      method: 'GET',
      params,
      ...defaultConfig,
      ...config
    })
  },

  // POST请求
  post(url, data = {}, config = {}) {
    return request({
      url,
      method: 'POST',
      data,
      ...defaultConfig,
      ...config
    })
  },

  // PUT请求
  put(url, data = {}, config = {}) {
    return request({
      url,
      method: 'PUT',
      data,
      ...defaultConfig,
      ...config
    })
  },

  // DELETE请求
  delete(url, params = {}, config = {}) {
    return request({
      url,
      method: 'DELETE',
      params,
      ...defaultConfig,
      ...config
    })
  },

  // PATCH请求
  patch(url, data = {}, config = {}) {
    return request({
      url,
      method: 'PATCH',
      data,
      ...defaultConfig,
      ...config
    })
  },

  // 上传文件（支持进度）
  upload(url, formData, config = {}) {
    return request({
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: config.onProgress,
      ...defaultConfig,
      ...config
    })
  },

  // 下载文件
  download(url, params = {}, config = {}) {
    return request({
      url,
      method: 'GET',
      params,
      responseType: 'blob',
      ...defaultConfig,
      ...config
    })
  },

  // 并发请求
  all(requests) {
    return axios.all(requests)
  },

  // 取消请求的token
  cancelToken: axios.CancelToken,

  // 创建自定义实例（用于不同baseURL）
  create(config) {
    return axios.create(config)
  }
}

export default http