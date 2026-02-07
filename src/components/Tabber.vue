<template>
    <header class="app-navbar">
        <button class="navbar-back" @click="goBack">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <div class="navbar-title">{{ title }}</div>
        <div class="navbar-placeholder"></div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
// import { defineProps } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Login'
    }
})

const router = useRouter()
function goBack() {
    router.back()
}
</script>

<style scoped>
.app-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 0 12px;
    position: relative;
}

.navbar-back {
    background: none;
    border: none;
    padding: 0;
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.navbar-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
}

.navbar-placeholder {
    width: 32px;
    height: 24px;
}
</style>
