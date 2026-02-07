<template>
    <nav class="tabbar">
        <div
            v-for="(item, index) in tabs"
            :key="index"
            :class="['tabbar-item', { active: current === index }]"
            @click="selectTab(index)"
        >
            <div class="icon-wrapper">
                <span class="icon">
                    <img :src="current === index ? item.icon : item.NorIcon" alt="">
                </span>
                <div v-if="index === 1 && cartCount > 0" class="badge">
                    {{ cartCount > 99 ? '99+' : cartCount }}
                </div>
            </div>
            <span class="label">{{ item.label }}</span>
        </div>
    </nav>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';

// 定义属性：接收从 home.vue 传进来的购物车总数
const props = defineProps({
    cartCount: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['change', 'custom-click']);
const current = ref(0);

const getImageUrl = (path) => {
    return new URL(`../assets/icons/tabbar/${path}`, import.meta.url).href
}

const tabs = ref([
    { label: 'Home', icon: getImageUrl('Home_sel.png'), NorIcon: getImageUrl('Home_nor.png') },
    { label: 'Cart', icon: getImageUrl('Cart_sel.png'), NorIcon: getImageUrl('Cart_nor.png') },
    { label: 'Mine', icon: getImageUrl('Mine_sel.png'), NorIcon: getImageUrl('Mine_nor.png') }
]);

const selectTab = (index) => {
    if (index === 1) {
        // 点击购物车不切换高亮，仅触发弹出层逻辑
        emit('custom-click');
        return
    }
    current.value = index;
    emit('change', index);
};
</script>

<style lang="scss" scoped>
.tabbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    padding-bottom: constant(safe-area-inset-bottom); // 适配 iOS 底部安全区
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: -1px -11px 20px #5a5a5a47;
}

.tabbar-item {
    flex: 1;
    text-align: center;
    color: #888;
    padding: 6px 0;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.active {
        .label {
            color: #444DFA; // 保持你要求的蓝色
            font-weight: 600;
        }
    }
}

.icon-wrapper {
    position: relative; // 为角标提供定位基准
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
}

.icon {
    display: block;
    img {
        width: 24px;
        height: 24px;
        margin: auto;
        object-fit: contain;
    }
}

/* 购物车角标样式 */
.badge {
    position: absolute;
    top: -5px;
    right: -10px;
    min-width: 16px;
    height: 16px;
    background-color: #EB362A; // 国际通用的警示红色
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 1.5px solid #fff; // 增加白色描边，让角标更清晰
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.label {
    font-weight: 400;
    font-size: 11px;
    color: #666;
    transition: color 0.2s;
}
</style>