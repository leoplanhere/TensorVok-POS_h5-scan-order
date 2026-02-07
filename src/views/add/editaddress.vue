<template>
  <div class="layout">
    <Tabber title="Address" />
    <div class="upage">
      <form action="" method="post">
        <div class="editadd">
          <div class="item">
            <ul>
              <li>
                <label>Area</label>
                <input
                  type="text"
                  class="txt"
                  v-model="formData.area"
                  placeholder="Click on the location icon to quickly select the address."
                />
                <div class="icon">
                  <img src="../../assets/pic/qw14.png" alt="定位" />
                </div>
              </li>
              <li>
                <label>Address</label>
                <input
                  type="text"
                  class="txt"
                  v-model="formData.address"
                  placeholder="Please enter the address."
                />
              </li>
              <li>
                <label>name</label>
                <input
                  type="text"
                  class="txt"
                  v-model="formData.name"
                  placeholder="Please enter."
                />
              </li>
              <li>
                <label>Phone</label>
                <input
                  type="text"
                  class="txt"
                  v-model="formData.phone"
                  placeholder="Receiver's Number"
                />
              </li>
            </ul>
            <div class="porc">
              <textarea
                class="text"
                v-model="formData.pasteText"
                placeholder="Paste text here to automatically recognize information and fill it in."
              ></textarea>
              <!-- 改为可点击的粘贴按钮 -->
              <button type="button" class="paste-btn" @click="handlePaste">
                Paste
              </button>
              <!-- 识别成功提示 -->
              <div v-if="showTip" class="paste-tip">Recognition successful, automatically filled</div>
            </div>
          </div>
          <div class="flex">
            <h5>Set as default address</h5>
            <label class="switch">
              <input type="checkbox" v-model="formData.isDefault" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="ftbtns ons">
          <a class="b1">Delete</a>
          <a class="btn" @click="handleSave">Preserve</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 初始化路由
const router = useRouter()

// 表单数据双向绑定
const formData = ref({
  area: '',        // 区域（省/市/区）
  address: '',     // 详细地址
  name: '',        // 收货人姓名
  phone: '',       // 手机号
  pasteText: '',   // 粘贴的原始文本
  isDefault: false // 是否设为默认地址
})

// 识别成功提示框状态
const showTip = ref(false)

/**
 * 处理粘贴按钮点击 - 核心修复剪贴板读取逻辑
 */
const handlePaste = async () => {
  try {
    let clipboardText = '';

    // 方案1：现代浏览器安全上下文 - 仅读取文本（修复核心）
    if (navigator.clipboard && window.isSecureContext) {
      clipboardText = await navigator.clipboard.readText();
    } 
    // 方案2：降级处理 - 兼容非安全上下文/旧浏览器
    else {
      const textArea = document.createElement('textarea');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.zIndex = '-9999';
      document.body.appendChild(textArea);
      // 聚焦并触发粘贴
      textArea.focus();
      const isPasteSuccess = document.execCommand('paste');
      if (isPasteSuccess) {
        clipboardText = textArea.value;
      } else {
        throw new Error('手动粘贴指令执行失败');
      }
      document.body.removeChild(textArea);
    }

    // 剪贴板为空校验
    if (!clipboardText || clipboardText.trim() === '') {
      alert('剪贴板为空，请先复制地址文本后再试！');
      return;
    }

    // 填充文本框 + 自动解析
    formData.value.pasteText = clipboardText.trim();
    parseAddressText(formData.value.pasteText);
    
    // 显示成功提示
    showTip.value = true;
    setTimeout(() => showTip.value = false, 2000);

  } catch (err) {
    console.error('粘贴功能异常：', err);
    // 友好提示 + 聚焦文本框引导手动粘贴
    alert('自动读取剪贴板失败（浏览器权限/环境限制），请手动将内容粘贴到文本框中');
    document.querySelector('.text')?.focus();
  }
}

const parseAddressText = (text) => {
  if (!text) return;

  // 1. 提取手机号（兼容国内/国际格式，仅保留数字）
  const phoneRegex = /(?:\+?86\s?)?1[3-9]\d{9}|(?:\+?\d{1,3}[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{0,4}/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length) {
    // 清洗手机号：移除所有非数字字符
    const cleanPhone = phoneMatches[0].replace(/[^\d]/g, '');
    // 仅保留11位国内手机号或合理长度的国际号码
    if (cleanPhone.length === 11 || (cleanPhone.length >= 8 && cleanPhone.length <= 15)) {
      formData.value.phone = cleanPhone;
    }
  }

  // 2. 提取姓名（中英文姓名，排除地址关键词）
  const nameRegex = /([A-Za-z]{2,}\s?[A-Za-z]{1,}|[\u4e00-\u9fa5]{2,4})/g;
  const nameMatches = text.match(nameRegex);
  if (nameMatches && nameMatches.length) {
    const addressKeywords = ['省', '市', '区', '县', '街', '路', '巷', '号', '小区', '花园', '大厦', '村', '镇'];
    // 筛选：排除包含地址关键词的匹配项，取第一个有效姓名
    const validName = nameMatches.find(name => 
      !addressKeywords.some(key => name.includes(key))
    );
    if (validName) {
      formData.value.name = validName.trim();
    }
  }

  // 3. 提取地址（拆分区域+详细地址）
  const addressRegex = /([\u4e00-\u9fa5]{2,}省|[\u4e00-\u9fa5]{2,}市|[\u4e00-\u9fa5]{2,}区|[\u4e00-\u9fa5]{2,}县).+?(?=\d{7,}|$|[\u4e00-\u9fa5]{2,}省)/g;
  const addressMatches = text.match(addressRegex);
  if (addressMatches && addressMatches.length) {
    const fullAddress = addressMatches[0].trim();
    // 拆分区域（省/市/区）和详细地址
    const areaEndMarks = ['区', '县', '市'];
    let areaEndIndex = 0;
    
    // 找到最后一个区域标记的位置（如：深圳市南山区 → 区的位置）
    areaEndMarks.forEach(mark => {
      const index = fullAddress.lastIndexOf(mark);
      if (index > areaEndIndex) areaEndIndex = index + 1;
    });

    if (areaEndIndex > 0) {
      formData.value.area = fullAddress.substring(0, areaEndIndex).trim();
      formData.value.address = fullAddress.substring(areaEndIndex).trim();
    } else {
      formData.value.address = fullAddress;
    }
  }
}

/**
 * 保存地址逻辑
 */
const handleSave = () => {
  // 简单表单校验
  if (!formData.value.name) return alert('请填写收货人姓名！');
  if (!formData.value.phone) return alert('请填写收货人手机号！');
  if (!formData.value.address && !formData.value.area) return alert('请填写收货地址！');

  // 模拟保存（实际项目中替换为接口请求）
  console.log('保存地址数据：', formData.value);
  alert('地址保存成功！');
  router.go(-1);
}
const watchPasteText = (newVal) => {
  if (newVal && newVal.length > 5) {
    parseAddressText(newVal);
  }
}
// 监听文本框变化（Vue3 响应式监听）
formData.value.pasteText && watchPasteText(formData.value.pasteText);
</script>

<style scoped>
.editadd {
  margin-top: 0.3rem;
}
.upage {
  background: #F3F5F9;
  height: calc(100vh - 48px);
  min-height: calc(100vh - 48px);
  overflow-y: scroll !important;
  box-sizing: border-box;
  padding-bottom: 1.5rem;
}
.editadd .item {
  background: #fff;
  padding: 0.35rem 0.35rem 0.27rem;
}
.editadd .item li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.1rem;
}
.editadd .item li label {
  font-weight: 400;
  font-size: 0.3rem;
  color: #111111;
  height: 0.8rem;
  width: 1.4rem;
  margin-right: 0.1rem;
  line-height: 0.8rem;
}
.editadd .item li .txt {
  flex: 1;
  border: none;
  background: none;
  font-weight: 400;
  font-size: 0.28rem;
  color: #111111;
  height: 0.8rem;
}
.editadd .item li .icon {
  width: 0.51rem;
  padding: 0.1rem 0 0.1rem 0.1rem;
}
.editadd .item .text {
  height: 2.46rem;
  background: #F3F5F9;
  border-radius: 0.2rem;
  border: 1px solid #DDDDDD;
  padding: 0.2rem 0.35rem;
  box-sizing: border-box;
  width: 100%;
  font-weight: 400;
  font-size: 0.26rem;
  color: #333;
  resize: none;
}
.editadd .item .porc {
  position: relative;
}
/* 替换原有i标签为按钮样式 */
.editadd .item .porc .paste-btn {
  position: absolute;
  left: 0.3rem;
  bottom: 0.3rem;
  line-height: 0.6rem;
  background: #FFFFFF;
  border-radius: 0.12rem;
  border: 1px solid #DDDDDD;
  font-weight: 400;
  font-size: 0.3rem;
  color: #999999;
  padding: 0 0.2rem;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
}
.editadd .item .porc .paste-btn:active {
  background: #f5f5f5;
  border-color: #ccc;
}
/* 识别成功提示 */
.editadd .item .porc .paste-tip {
  position: absolute;
  right: 0.3rem;
  bottom: 0.3rem;
  background: #444DFA;
  color: white;
  padding: 0 0.2rem;
  border-radius: 0.12rem;
  font-size: 0.26rem;
  line-height: 0.6rem;
  animation: fadeInOut 2s ease;
}
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(10px); }
}
.editadd .flex {
  height: 1.08rem;
  padding: 0 0.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-top: 0.2rem;
}
.editadd .flex h5 {
  font-weight: 400;
  font-size: 0.3rem;
  color: #111111;
}
.checkout {
  min-height: 100vh;
  background: #F3F5F9;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0.2rem;
}
.ftbtns {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  padding: 0 0.2rem;
  height: 1.35rem;
  box-sizing: border-box;
  background: #FFFFFF;
  width: 7.5rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ftbtns .b1 {
  width: 1.86rem;
  height: 0.89rem;
  line-height: 0.89rem;
  background: #FFFFFF;
  border-radius: 0.3rem;
  border: 1px solid #E84048;
  display: block;
  text-align: center;
  margin-right: 0.14rem;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 0.36rem;
  color: #FF2A0E;
}
.ftbtns.on {
  background: none;
}
.ftbtns .btn {
  height: 0.89rem;
  background: #444DFA;
  width: 7.02rem;
  border-radius: 0.3rem;
  margin: 0 auto;
  font-weight: 400;
  font-size: 0.36rem;
  color: #FFFFFF;
  line-height: 0.9rem;
  display: block;
  text-align: center;
  flex: 1;
}
.ftbtns.on .btn {
  background: #FF2A0E;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 30px;
  transition: 0.3s;
}
.slider::before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}
input:checked + .slider {
  background-color: #444DFA;
}
input:checked + .slider::before {
  transform: translateX(30px);
}
.slider:hover {
  background-color: #b3b3b3;
}
input:checked + .slider:hover {
  background-color: #444DFA;
}
</style>