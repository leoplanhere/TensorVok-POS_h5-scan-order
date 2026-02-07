<template>
  <div class="home">
    <Tabber title="H5 Scan Order" />
    <div class="home-content">
      <div class="scanner-wrapper">
        <video 
          ref="video" 
          id="video" 
          playsinline 
          webkit-playsinline 
          muted 
          class="video-stream"
        ></video>
        
        <div class="overlay" v-if="isScanning">
          <div class="scan-box">
            <div class="line"></div>
          </div>
        </div>
      </div>

      <img 
        alt="Logo" 
        class="logo" 
        :class="{ 'dim': isScanning }"
        src="../assets/Scancodelogo.png" 
        @click="toggleScanner"
      >
      <p :class="{ 'scanning-text': isScanning }">{{ statusText }}</p>
      
      <canvas ref="canvas" style="display: none;"></canvas>

      <div class="debug-panel">
        <div class="debug-title">Click to enter the demo directly; no QR code required.</div>
        <div class="debug-item">
          <label>Store ID:</label>
          <input v-model="debugShopId" placeholder="Enter the ID starting with DP" />
        </div>
        <div class="debug-item">
          <label>Table ID:</label>
          <input v-model="debugTableId" placeholder="Enter the ID starting with CZDP" />
        </div>
        <button class="debug-btn" @click="handleManualDebug">Confirm Entry (Simulate Scan)</button>
      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsQR from "jsqr";
import { useUserStore } from '../stores/user';
import { useTableStore } from '../stores/table';
import Tabber from '../components/Tabber.vue';
import { showToast, showLoadingToast, closeToast } from 'vant';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const tableStore = useTableStore();

const video = ref(null);
const canvas = ref(null);
const statusText = ref('Tap Icon and Scan');
const isScanning = ref(false);
let stream = null;
let animationId = null;

// --- 调试数据定义 ---
const debugShopId = ref('DP2024032764363'); // 默认填入你提供的 ID
const debugTableId = ref('CZDP2024032764363658720');

// 手动确认按钮逻辑
const handleManualDebug = () => {
  if (!debugShopId.value || !debugTableId.value) {
    showToast('请填写完整 ID');
    return;
  }
  handleSuccess(debugShopId.value, debugTableId.value);
};
// ------------------

// 解析参数
const parseParams = (text) => {
  const id = text.match(/[?&]id=([^&]+)/)?.[1];
  const tab_id = text.match(/[?&]tab_id=([^&]+)/)?.[1];
  return { id, tab_id };
};

// 核心扫描逻辑
const scanTick = () => {
  if (video.value && video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
    const canvasElement = canvas.value;
    const videoElement = video.value;
    const canvasCtx = canvasElement.getContext("2d", { willReadFrequently: true });

    canvasElement.height = videoElement.videoHeight;
    canvasElement.width = videoElement.videoWidth;
    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      const { id, tab_id } = parseParams(code.data);
      if (id && tab_id) {
        handleSuccess(id, tab_id);
        return; 
      }
    }
  }
  animationId = requestAnimationFrame(scanTick);
};

const handleSuccess = (id, tab_id) => {
  stopScanner();
  userStore.setShopUid(id);
  tableStore.bindTableInfo({ 
    table_manage_id: tab_id,
    tcname: '测试桌台', // 调试时默认名
  });
  
  showLoadingToast({ message: 'Simulate Success', forbidClick: true });
  setTimeout(() => {
    closeToast();
    router.push({ path: '/login', query: { redirect: '/home/index' } });
  }, 500);
};

const startScanner = async () => {
  try {
    isScanning.value = true;
    statusText.value = 'Scanning...';
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    video.value.srcObject = stream;
    video.value.setAttribute("playsinline", "true"); 
    await video.value.play();
    animationId = requestAnimationFrame(scanTick);
  } catch (err) {
    isScanning.value = false;
    statusText.value = 'Can access camera';
    showToast('You can use simulate mode down below.');
  }
};

const stopScanner = () => {
  isScanning.value = false;
  statusText.value = 'Tap icon to scan';
  if (animationId) cancelAnimationFrame(animationId);
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

const toggleScanner = () => {
  isScanning.value ? stopScanner() : startScanner();
};

onMounted(() => {
  const { id, tab_id } = route.query;
  if (id && tab_id) handleSuccess(id, tab_id);
});

onUnmounted(() => stopScanner());
</script>

<style lang="scss" scoped>
.home {
  background-color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .home-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 40px;

    .scanner-wrapper {
      position: relative;
      width: 240px;
      height: 240px;
      margin-bottom: 20px;
      border-radius: 20px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);

      .video-stream { width: 100%; height: 100%; object-fit: cover; }
      .overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        display: flex; justify-content: center; align-items: center;
        background: rgba(0,0,0,0.2);
        .scan-box {
          width: 160px; height: 160px; border: 2px solid rgba(255,255,255,0.5);
          border-radius: 10px; position: relative;
          .line {
            width: 100%; height: 2px; background: #07c160;
            box-shadow: 0 0 8px #07c160; position: absolute;
            top: 0; animation: move 2.5s infinite linear;
          }
        }
      }
    }

    .logo {
      width: 100px; transition: all 0.3s ease;
      &.dim { opacity: 0.5; transform: scale(0.9); }
    }

    .scanning-text { color: #07c160; font-weight: bold; }
    p { margin-top: 10px; font-size: 14px; color: #333; }

    /* 调试面板样式 */
    .debug-panel {
      margin-top: 40px;
      padding: 15px;
      background: #f8f9fa;
      border: 1px dashed #ccc;
      border-radius: 12px;
      width: 85%;

      .debug-title {
        font-size: 12px;
        color: #666;
        text-align: center;
        margin-bottom: 10px;
        font-weight: bold;
      }

      .debug-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        label { font-size: 12px; width: 60px; color: #444; }
        input {
          flex: 1;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 12px;
          outline: none;
          &:focus { border-color: #07c160; }
        }
      }

      .debug-btn {
        width: 100%;
        margin-top: 10px;
        padding: 10px;
        background: #333;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        &:active { opacity: 0.8; }
      }
    }
  }
}

@keyframes move { from { top: 0%; } to { top: 100%; } }
</style>