<template>
  <div class="Search-page">
    <header class="search-header">
      <div class="back-icon" @click="onCancel">
        <van-icon name="arrow-left" />
      </div>
      <div class="search-bar">
        <van-search
          v-model="searchQuery"
          placeholder="What would you like to eat?"
          background="transparent"
          @search="onSearch"
          @update:model-value="onInput"
        />
      </div>
    </header>

    <div class="search-content">
      <div class="history-section" v-if="!searchQuery && history.length > 0">
        <div class="section-hd">
          <span>Recent Searches</span>
          <van-icon name="delete-o" @click="clearHistory" />
        </div>
        <div class="history-tags">
          <span v-for="(item, index) in history" :key="index" @click="clickHistory(item)">
            {{ item }}
          </span>
        </div>
      </div>

      <div class="result-section" v-if="searchQuery">
        <div v-if="filteredDishList.length > 0" class="food-list">
          <div class="food-card" v-for="(item, index) in filteredDishList" :key="index">
            <div class="food-img" @click="showDishPreview(item)">
              <img :src="item.coverimage" alt="" />
            </div>
            <div class="food-info">
              <h4>{{ item.cpname }}</h4>
              <p class="desc">{{ item.describe }}</p>
              <div class="bottom-row">
                <span class="price">$ {{ item.price }}</span>
                <div class="stepper-box">
                  <transition name="van-fade">
                    <van-icon v-if="item.number > 0" name="minus" class="op-btn minus" @click="DelFood(item)" />
                  </transition>
                  <span v-if="item.number > 0" class="count">{{ item.number }}</span>
                  <van-icon name="plus" class="op-btn plus" @click="AddFood(item)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <van-empty v-else image="search" description="We couldn't find that dish" />
      </div>
    </div>

    <van-popup 
      v-model:show="showDish" 
      position="bottom" 
      round 
      class="elegant-popup"
      :style="{ height: '85%' }"
    >
      <div class="popup-inner" v-if="NowSelectFood.cpname">
        <div class="hero-image">
          <img :src="NowSelectFood.coverimage">
          <div class="overlay"></div>
          <div class="hero-info">
            <h2>{{ NowSelectFood.cpname }}</h2>
            <p>$ {{ NowSelectFood.price }}</p>
          </div>
          <div class="close-btn" @click="showDish = false">
            <van-icon name="cross" />
          </div>
        </div>

        <div class="scroll-body">
          <div class="config-section" v-for="(item, index) in NowSelectFood.classifyList" :key="index">
            <h3 class="config-title">{{ item.val }}</h3>
            <div class="option-grid">
              <div 
                class="option-tag" 
                v-for="(son, i1) in item.sons" 
                :key="i1"
                :class="{ 'active': item.value == i1 }"
                @click="ChangeActiveIndex(index, i1)"
              >
                {{ son.value }}
              </div>
            </div>
          </div>

          <div class="config-section" v-if="NowSelectFood.ingredientList?.length > 0">
            <h3 class="config-title">Extra Toppings</h3>
            <div class="addon-list">
              <div 
                class="addon-item" 
                v-for="(it, idx) in NowSelectFood.ingredientList" 
                :key="idx"
                :class="{ 'selected': it.boole }"
                @click="ChangeIngreDient(it)"
              >
                <div class="addon-left">
                  <img :src="it.thumbnail">
                  <div class="name-box">
                    <span class="aname">{{ it.cpname }}</span>
                    <span class="aprice">+$ {{ it.price }}</span>
                  </div>
                </div>
                <div class="addon-right">
                  <div class="mini-stepper" v-if="it.boole" @click.stop>
                    <van-icon name="minus" @click="Reduce(it)" />
                    <span>{{ it.number }}</span>
                    <van-icon name="plus" @click="Add(it)" />
                  </div>
                  <van-icon v-else name="plus" />
                </div>
              </div>
            </div>
          </div>

          <div class="config-section">
            <h3 class="config-title">Special Instructions</h3>
            <div class="remark-tags">
              <span 
                v-for="t in NowSelectFood.labelList" 
                :key="t.id" 
                :class="{ 'active': t.boole }"
                @click="ChangeNowRemark(t)"
              >{{ t.name }}</span>
            </div>
            <textarea 
              v-model="NowSelectFood.remarks" 
              class="elegant-input" 
              placeholder="E.g. No onions, extra spicy..."
            ></textarea>
          </div>
        </div>

        <div class="popup-footer">
          <div class="total-preview">
            <span class="label">Total Price</span>
            <span class="val">$ {{ currentDishTotal }}</span>
          </div>
          <button class="add-btn" @click="confirmAddToCart">
            Add to Cart
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/index.js'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { foodList } = storeToRefs(cartStore)
const { addToCart, removeFromCart } = cartStore
const router = useRouter()

const searchQuery = ref('')
const history = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
const showDish = ref(false)
const NowSelectFood = ref({})

// 计算当前单品（含小料）总价
const currentDishTotal = computed(() => {
  if (!NowSelectFood.value.cpname) return '0.00'
  let base = parseFloat(NowSelectFood.value.price || 0)
  let addons = 0
  if (NowSelectFood.value.ingredientList) {
    addons = NowSelectFood.value.ingredientList.reduce((sum, it) => {
      return sum + (it.boole ? (parseFloat(it.price) * (it.number || 1)) : 0)
    }, 0)
  }
  return ((base + addons) * (NowSelectFood.value.number || 1)).toFixed(2)
})

const filteredDishList = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase().trim()
  return foodList.value.filter(item => 
    item.cpname.toLowerCase().includes(query) || 
    (item.describe && item.describe.toLowerCase().includes(query))
  )
})

const onSearch = (val) => {
  if (!val) return
  const newHistory = [val, ...history.value.filter(item => item !== val)].slice(0, 10)
  history.value = newHistory
  localStorage.setItem('searchHistory', JSON.stringify(newHistory))
}

const onInput = (val) => {}
const onCancel = () => router.go(-1)
const clickHistory = (val) => { searchQuery.value = val }
const clearHistory = () => { history.value = []; localStorage.removeItem('searchHistory') }

// 业务逻辑
function AddFood(item) {
  NowSelectFood.value = JSON.parse(JSON.stringify(item))
  if (NowSelectFood.value.number === 0) NowSelectFood.value.number = 1
  showDish.value = true
}

function DelFood(item) { removeFromCart(item) }

function confirmAddToCart() {
  addToCart(NowSelectFood.value, 1)
  showDish.value = false
  onSearch(searchQuery.value)
}

function ChangeFoodNumber(type) {
  if (type === 'add') NowSelectFood.value.number++
  else if (NowSelectFood.value.number > 1) NowSelectFood.value.number--
}

function ChangeIngreDient(item) {
  item.boole = !item.boole
  if (item.boole) item.number = 1
}
function Add(item) { item.number++ }
function Reduce(item) { 
  if (item.number > 1) item.number-- 
  else { item.number = 0; item.boole = false }
}
function ChangeNowRemark(t) { t.boole = !t.boole }
function ChangeActiveIndex(idx, sidx) { if(NowSelectFood.value.classifyList[idx]) NowSelectFood.value.classifyList[idx].value = sidx }

onMounted(() => {
  if (!foodList.value || foodList.value.length === 0) {
    router.push('/home/index')
  }
})
</script>

<style scoped>
.Search-page {
  background: #f8f9fa;
  min-height: 100vh;
}

/* 顶部搜索栏优化 */
.search-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.back-icon {
  font-size: 20px;
  margin-right: 10px;
  color: #333;
}
.search-bar { flex: 1; }
:deep(.van-search__content) {
  border-radius: 12px;
  background: #f1f3f5;
}

/* 搜索历史样式 */
.history-section { padding: 20px 15px; }
.section-hd {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #868e96;
  margin-bottom: 15px;
  font-weight: 600;
}
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.history-tags span {
  padding: 8px 16px;
  background: #fff;
  border-radius: 20px;
  font-size: 13px;
  color: #495057;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

/* 搜索结果卡片优化 */
.food-list { padding: 10px 15px; }
.food-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  padding: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.food-img {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}
.food-img img { width: 100%; height: 100%; object-fit: cover; }
.food-info {
  flex: 1;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.food-info h4 { font-size: 16px; margin: 0; color: #212529; }
.food-info .desc { font-size: 12px; color: #adb5bd; line-height: 1.4; margin: 5px 0; }
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price { color: #f03e3e; font-weight: 700; font-size: 16px; }

/* 数量按钮样式 */
.stepper-box {
  display: flex;
  align-items: center;
}
.op-btn {
  font-size: 18px;
  padding: 6px;
  border-radius: 10px;
}
.op-btn.plus { background: #339af0; color: #fff; }
.op-btn.minus { border: 1px solid #dee2e6; color: #adb5bd; }
.count { margin: 0 12px; font-weight: 600; font-size: 15px; }

/* ==================== 国际化优雅弹窗样式 ==================== */
.elegant-popup { overflow: hidden; }
.popup-inner { height: 100%; display: flex; flex-direction: column; position: relative; }

.hero-image {
  height: 200px;
  position: relative;
  flex-shrink: 0;
}
.hero-image img { width: 100%; height: 100%; object-fit: cover; }
.hero-image .overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}
.hero-info {
  position: absolute; bottom: 20px; left: 20px; color: #fff;
}
.hero-info h2 { margin: 0; font-size: 22px; }
.hero-info p { margin: 5px 0 0; opacity: 0.9; font-size: 16px; }
.close-btn {
  position: absolute; top: 15px; right: 15px;
  background: rgba(255,255,255,0.8);
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.scroll-body {
  flex: 1; overflow-y: auto; padding: 20px; background: #fff;
}
.config-section { margin-bottom: 25px; }
.config-title { font-size: 15px; color: #212529; font-weight: 700; margin-bottom: 12px; }

/* 选项按钮 */
.option-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.option-tag {
  padding: 10px 20px; border-radius: 12px; background: #f8f9fa;
  font-size: 13px; color: #495057; border: 1px solid transparent;
  transition: all 0.2s;
}
.option-tag.active {
  background: #e7f5ff; border-color: #339af0; color: #339af0; font-weight: 600;
}

/* 小料列表：优雅列表样式 */
.addon-list { display: flex; flex-direction: column; gap: 12px; }
.addon-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px; border: 1px solid #f1f3f5; border-radius: 14px;
}
.addon-item.selected { border-color: #339af0; background: #fdfdfe; }
.addon-left { display: flex; align-items: center; }
.addon-left img { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; }
.name-box { margin-left: 12px; display: flex; flex-direction: column; }
.aname { font-size: 14px; color: #343a40; font-weight: 500; }
.aprice { font-size: 12px; color: #f03e3e; margin-top: 2px; }
.mini-stepper { display: flex; align-items: center; gap: 10px; color: #339af0; font-weight: 700; }

/* 备注输入 */
.remark-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.remark-tags span {
  padding: 6px 12px; border-radius: 8px; background: #f1f3f5; font-size: 12px;
}
.remark-tags span.active { background: #333; color: #fff; }
.elegant-input {
  width: 100%; height: 80px; border-radius: 12px; border: none;
  background: #f1f3f5; padding: 12px; font-size: 13px; box-sizing: border-box;
}

/* 底部结算 */
.popup-footer {
  padding: 20px; background: #fff; border-top: 1px solid #f1f3f5;
  display: flex; align-items: center; justify-content: space-between;
}
.total-preview .label { font-size: 12px; color: #adb5bd; display: block; }
.total-preview .val { font-size: 20px; color: #212529; font-weight: 800; }
.add-btn {
  background: #339af0; color: #fff; border: none; padding: 12px 30px;
  border-radius: 14px; font-weight: 700; font-size: 16px;
  box-shadow: 0 4px 12px rgba(51, 154, 240, 0.3);
}
</style>