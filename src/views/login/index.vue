<template>
  <div class="login-container">
    <div class="login-bg"></div>
    
    <div class="login-card">
      <div class="logo-section">
        <img class="login-logo" src="../../assets/logo2.png" alt="Logo" />
      </div>
      
      <div class="login-form">
        <div class="form-group">
          <div class="input-group">
            <img class="input-icon" src="../../assets/user.png" alt="用户" />
            <input
              v-model="phone"
              type="tel"
              :placeholder="$t('message.accountnumber') + ' (Optional)'"
              class="form-input"
              @keyup.enter="handleLogin"
            />
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 8px; text-align: center;">
            Tips: No phone number will be walk-in guest.
          </p>
        </div>
        
        <div class="agreement-section" v-if="showAgreement">
          <label class="agreement-label">
            <input
              v-model="agreed"
              type="checkbox"
              class="agreement-checkbox"
            />
            <span class="agreement-text">
              {{ $t('message.agreeTo') }}
              <a href="#" class="agreement-link">{{ $t('message.userAgreement') }}</a>
            </span>
          </label>
        </div>
        
        <button
          class="login-btn"
          :class="{ 'login-btn-loading': loading }"
          :disabled="loading || !canLogin"
          @click="handleLogin"
        >
          <span v-if="!loading">
            {{ phone.trim() ? $t('message.Login') : 'Creat Walkin Account' }}
          </span>
          <div v-else class="loading-spinner"></div>
        </button>
      </div>
    </div>
    
    <div v-if="errorMessage" class="error-toast">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import { useTableStore } from '../../stores/table' // 1. 引入 tableStore
import { storeToRefs } from 'pinia'
import http from '../../common/request.js' 

const props = defineProps({
  showAgreement: { type: Boolean, default: true },
  autoRedirect: { type: Boolean, default: true }
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()
const tableStore = useTableStore() // 2. 初始化 tableStore

const phone = ref('')
const agreed = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const { shopuid } = storeToRefs(userStore)

const canLogin = computed(() => {
  if (props.showAgreement && !agreed.value) return false
  return true
})

const isPhoneValid = () => {
  const val = phone.value.trim()
  if (!val) return true
  return /^1[3-9]\d{9}$/.test(val)
}

async function handleLogin() {
  if (props.showAgreement && !agreed.value) {
    showError(t('message.pleaseAgree') || 'Please check agreement!')
    return
  }

  if (phone.value.trim() && !isPhoneValid()) {
    showError(t('message.phoneInvalid') || 'Wrong Number Format!')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const payload = {
      shop_id: shopuid.value
    }
    if (phone.value.trim()) {
      payload.phone = phone.value.trim()
    }

    const res = await http.post('/user/wechatloginyk', payload)

    if (res.code == 1) {
      userStore.setUserInfo(res.data.userinfo)
      
      if (res.data.userinfo?.token) {
        localStorage.setItem('token', res.data.userinfo.token)
      }
      
      if (phone.value.trim()) {
        localStorage.setItem('lastPhone', phone.value.trim())
      }

      // 3. 核心修改：跳转时带上 shop_id 和 tab_id
      // 这里的 tableId 是之前 ScanCode 存入 store 的那个长 ID
      const s_id = shopuid.value
      const t_id = tableStore.tableOpenInfo.tableId

      setTimeout(() => {
        router.push({
          path: '/home/index',
          query: {
            id: s_id,
            tab_id: t_id
          }
        })
      }, 500)
    } else {
      showError(res.message || '登录失败')
    }
  } catch (error) {
    console.error('登录异常:', error)
    showError('系统繁忙，请稍后再试')
  } finally {
    loading.value = false
  }
}

const showError = (message) => {
  errorMessage.value = message
  setTimeout(() => { errorMessage.value = '' }, 3000)
}

function handleKeyUp(event) {
  if (event.key === 'Enter' && canLogin.value) {
    handleLogin()
  }
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyUp)
})
</script>


<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 1;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  position: relative;
  z-index: 1;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  width: 150px;
  height: auto;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 25px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  padding: 12px 15px;
  transition: border-color 0.3s ease;
}

.input-group:focus-within {
  border-color: #4a90e2;
}

.input-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  opacity: 0.7;
}

.form-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
}

.form-input::placeholder {
  color: #999;
}

.agreement-section {
  margin: 20px 0;
}

.agreement-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.agreement-checkbox {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.agreement-text {
  font-size: 14px;
  color: #666;
}

.agreement-link {
  color: #4a90e2;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, #4a90e2, #5d9cec);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #3a80d2, #4d8cdc);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn-loading {
  background: #e1e5e9 !important;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.other-login-options {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e1e5e9;
}

.divider-text {
  padding: 0 15px;
  color: #999;
  font-size: 14px;
}

.social-login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: #4a90e2;
  background: #f8f9fa;
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.wechat-btn {
  color: #07c160;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #666;
}

.register-link-text {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}

.register-link-text:hover {
  text-decoration: underline;
}

.error-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4757;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 30px 20px;
  }
  
  .login-logo {
    width: 120px;
  }
}

@media (max-width: 320px) {
  .login-card {
    padding: 25px 15px;
  }
  
  .form-input {
    font-size: 14px;
  }
  
  .login-btn {
    font-size: 14px;
    padding: 12px;
  }
}
</style>