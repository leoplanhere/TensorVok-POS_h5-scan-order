<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<router-view></router-view>
</template>

<style>
.van-popup{
    height: auto !important;
   
}


/* 1. 默认变量 (亮色模式) */
:root {
  --bg-color: #f7f8fa;
  --card-bg: #ffffff;
  --text-main: #111111;
  --text-sub: #999999;
  --nav-bg: #ffffff;
  --border-color: #eeeeee;
}

/* 2. 暗色模式 */
[data-theme='dark'] {
  --bg-color: #121212;
  --card-bg: #1e1e1e;
  --text-main: #e0e0e0;
  --text-sub: #888888;
  --nav-bg: #1e1e1e;
  --border-color: #333333;
}

/* 3. 护眼模式 (柔和的豆沙绿/偏黄调) */
[data-theme='eye'] {
  --bg-color: #f0f5e5;
  --card-bg: #fafdf3;
  --text-main: #0c0d0e;
  --text-sub: #7f8c8d;
  --nav-bg: #e8efd1;
  --border-color: #d6e0b5;
}

/* --- 应用变量到全局组件 --- */
body {
  background-color: var(--bg-color);
  color: var(--text-main);
  transition: background-color 0.3s, color 0.3s; /* 平滑过渡 */
}

.Home-page {
  background-color: var(--bg-color);
}

header, .nav {
  background-color: var(--nav-bg) !important;
}

.caipin-list li, .food-item, .addon-card, .DishBox,.tabbar, .caipin-classify, .Cart, .header-stepper, .AddFoodBox, .dialog-content, .van-toast,.caipin-food,.dietary-filter-wrapper{
  background-color: var(--card-bg) !important;
  color: var(--text-main);
}



/* 针对 Vant 组件的强制覆盖 */
[data-theme='dark'] .van-popup,
[data-theme='dark'] .van-action-sheet {
  background-color: var(--card-bg);
}







</style>
