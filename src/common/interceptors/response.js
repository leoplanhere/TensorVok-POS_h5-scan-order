import { closeToast } from 'vant'

export default {
  onResponse(response) {
    try {
      closeToast()
    } catch (e) {
      // ignore
    }
    return response.data
  },

  onResponseError(error) {
    try {
      closeToast()
    } catch (e) {
      // ignore
    }
    
    console.error('API Error:', error.message, error.config?.url)
    return Promise.reject(error)
  }
}