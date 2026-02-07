import { showToast, closeToast } from 'vant'
import router from '../../router'

// 响应拦截器
export default {
  // 响应成功处理
  onResponse(response) {
    const { config, data } = response
    const { startTime, showLoading, silent } = config.metadata || {}
    
    // 关闭loading
    if (config.loadingToast) {
      closeToast()
    }

    // 计算请求耗时
    if (startTime) {
      const duration = Date.now() - startTime
      console.log(`请求 ${config.url} 耗时: ${duration}ms`)
    }

    // 处理文件下载
    if (config.responseType === 'blob') {
      return handleFileDownload(response)
    }

    // 根据业务状态码处理
    if (data && typeof data === 'object') {
      const code = data.code || data.status || data.errno
      
      // 成功状态码（根据业务调整）
      const successCodes = [200, 1, 1000, '200', '1', '1000']
      if (successCodes.includes(code)) {
        console.log('响应数据:', data)
        // 显示成功提示（如果配置了且不是静默模式）
        if (config.showSuccess && !silent && data.message) {
          showToast({
            message: data.message,
            type: 'success'
          })
        }
        return data
      } else {
        return handleBusinessError(data, config)
      }
    }

    return data
  },

  // 响应错误处理
  onResponseError(error) {
    // 关闭loading
    closeToast()

    // if (axios.isCancel(error)) {
    //   console.log('请求被取消:', error.message)
    //   return Promise.reject(new Error('请求被取消'))
    // }

    if (!error.response) {
      // 网络错误或超时
      console.error('网络错误:', error)
      showToast({
        message: '网络连接失败，请检查网络设置',
        type: 'fail'
      })
      return Promise.reject(error)
    }

    const { status, data } = error.response
    
    switch (status) {
      case 400:
        showToast({
          message: data.message || '请求参数错误',
          type: 'fail'
        })
        break
      case 401:
        handleUnauthorized()
        break
      case 403:
        showToast({
          message: '没有访问权限',
          type: 'fail'
        })
        break
      case 404:
        showToast({
          message: '请求的资源不存在',
          type: 'fail'
        })
        break
      case 500:
        showToast({
          message: '服务器内部错误',
          type: 'fail'
        })
        break
      case 502:
      case 503:
      case 504:
        showToast({
          message: '服务器暂时不可用',
          type: 'fail'
        })
        break
      default:
        showToast({
          message: data.message || `请求失败: ${status}`,
          type: 'fail'
        })
    }

    return Promise.reject(error)
  }
}

// 处理业务错误
function handleBusinessError(data, config) {
  const { silent } = config.metadata || {}
  const code = data.code || data.errno
  const message = data.message || data.errmsg || '请求失败'
  
  // 不显示错误消息的配置
  if (!silent && config.showError !== false) {
    // 特殊错误码使用对话框显示
    if ([401, 403, 500].includes(code)) {
      showToast({
        title: '提示',
        message,
        theme: 'round-button',
        confirmButtonText: '确定'
      })
    } else {
      showToast({
        message,
        type: 'fail'
      })
    }
  }

  // 特殊错误码处理
  switch (code) {
    case 403:
      // 权限不足处理
      handlePermissionDenied()
      break
    case 2: // 示例：需要登录
      handleLoginRequired()
      break
  }

  return Promise.reject(new Error(message))
}

// 处理未授权
function handleUnauthorized() {
  try {
    const userStore = useUserStore?.()
    
    // 清除用户信息
    userStore?.clearUserInfo?.()
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    
    // 显示提示
    // 跳转到登录页
      router.push({
        path: '/login',
        query: { 
          redirect: router.currentRoute.value.fullPath 
        }
      })
  } catch (error) {
    console.error('处理未授权错误:', error)
    router.push('/login')
  }
}

// 处理权限不足
function handlePermissionDenied() {
  showToast({
    title: '提示',
    message: '您没有权限访问此功能',
    theme: 'round-button',
    confirmButtonText: '确定'
  })
}

// 处理需要登录
function handleLoginRequired() {
  // showDialog({
  //   title: '提示',
  //   message: '请先登录',
  //   theme: 'round-button',
  //   confirmButtonText: '去登录',
  //   cancelButtonText: '取消'
  // }).then(() => {
  //   router.push({
  //     path: '/login',
  //     query: { 
  //       redirect: router.currentRoute.value.fullPath 
  //     }
  //   })
  // })
  router.push({
      path: '/login',
      query: { 
        redirect: router.currentRoute.value.fullPath 
      }
    })
}

// 处理文件下载
function handleFileDownload(response) {
  const contentDisposition = response.headers['content-disposition']
  let filename = 'download'
  
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/i)
    if (match) {
      filename = decodeURIComponent(match[1])
    }
  }
  
  const blob = new Blob([response.data])
  
  // 移动端友好的下载方式
  if (window.navigator.msSaveOrOpenBlob) {
    // IE浏览器
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    // 其他浏览器
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    
    // 兼容移动端
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      // iOS Safari
      window.open(url)
    } else {
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    window.URL.revokeObjectURL(url)
  }
  
  // 显示下载成功提示
  showToast({
    message: `文件 ${filename} 下载成功`,
    type: 'success'
  })
  
  return { success: true, filename }
}