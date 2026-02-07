<template>
    <div class="Home-page">
        <header class="">
            <div class="flexBox">
                <div class="left flex">
                    <div class="lang-list"> EN <img src="../../assets/images/bottom_jiantou.png" alt=""> </div>
                    
                    <div class="Type-list">
                        <div class="Type-item" :class="{ 'active': themeMode === 'light' }" @click="changeTheme('light')">
                            <img :src="themeMode === 'light' ? getIcon('sun_sel') : getIcon('sun_nor')" alt="Light">
                        </div>
                        <div class="Type-item" :class="{ 'active': themeMode === 'dark' }" @click="changeTheme('dark')">
                            <img :src="themeMode === 'dark' ? getIcon('moon_sel') : getIcon('moon_nor')" alt="Dark">
                        </div>
                        <div class="Type-item" :class="{ 'active': themeMode === 'eye' }" @click="changeTheme('eye')">
                            <img :src="themeMode === 'eye' ? getIcon('summon_sel') : getIcon('summon_nor')" alt="Eye">
                        </div>
                    </div>


                </div>
                <div class="right flex">
                    <div class=" User flex">
                        <div class="avatar"> <img src="../../assets/images/UserAvater.png" alt=""> </div>
                        <p>{{ userInfo?.name || userInfo?.nickname || userInfo?.username || '' }}</p>
                    </div>
                     <div class="Table-Name">{{ tableOpenInfo.tccode || '识别中' }}{{ tableOpenInfo.number || '' }}</div>
                </div>
            </div>
            <nav class="flex nav">
                <div class="home" @click="showDialog1"><van-icon name="info" /></div>
                <div class="Search" @click="goPage"><van-icon name="search" /></div>
                <van-notice-bar 
                    v-if="adData.notice"
                    left-icon="volume-o" 
                    color="#111111" 
                    :text="adData.notice" 
                />
            </nav>
        </header>

        <div class="banner">
            <van-swipe v-if="adData.banners.length > 0" class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(imgUrl, index) in adData.banners" :key="index">
                    <img :src="imgUrl" alt="banner" style="width: 100%; height: 130px; object-fit: cover; display: block;"/>
                </van-swipe-item>
            </van-swipe>
            <img v-else src="../../assets/images/header_logo.jpeg" alt=""/>
        </div>

        <div class="dietary-filter-wrapper" v-if="viewMode !== 2">
            <div class="dietary-scroll">
                <div v-for="opt in dietaryOptions" :key="opt.id" 
                    class="diet-tag" 
                    :class="{ 'active': activeDietary === opt.id }"
                    @click="toggleDietary(opt.id)">
                    <span class="dot"></span> {{ opt.label }}
                    <van-icon name="cross" class="close" v-if="activeDietary === opt.id" />
                </div>
            </div>
        </div>

        <div class="caipin" v-if="viewMode === 2">
            <div class="caipin-classify">
                <div class="">
                    <div class="item" :class="NowIndex == -1 ? 'active' : ''" @click="changeTab(-1, 'All')">All</div>
                    <div class="item" :class="index==NowIndex?'active':''" v-for="item,index in classifyList" :key="index" @click="changeTab(index, item.name)">{{ item.name }}</div>
                </div>
            </div>
            <div class="caipin-food">
                <div class="food-header">
                    <ul class="veg-list flex">
                        <li v-for="opt in dietaryOptions.slice(0, 3)" :key="opt.id" 
                            class="veg" 
                            :class="{ 'active': activeDietary === opt.id }"
                            @click="toggleDietary(opt.id)">
                            <img :src="opt.icon" alt="">
                            <div class="close-icon" v-if="activeDietary === opt.id"><van-icon name="close" style="line-height: 20px;" /></div>
                        </li>
                        <li class="veg more" v-if="dietaryOptions.length > 3" @click="showMoreDietary = true">
                            <van-icon name="apps-o" style="font-size:18px;"/>
                        </li>
                    </ul>
                    <ul class="flex sort">
                        <li @click="viewMode = 1"><img :src="viewMode === 1 ? getIcon('one_sel') : getIcon('one_nor')" style="width: 20px; height: 20px;"></li>
                        <li @click="viewMode = 2"><img :src="viewMode === 2 ? getIcon('two_sel') : getIcon('two_nor')" style="width: 20px; height: 20px;"></li>
                        <li @click="viewMode = 3"><img :src="viewMode === 3 ? getIcon('three_sel') : getIcon('three_nor')" style="width: 20px; height: 20px;"></li>
                    </ul>
                </div>
                <ul class="caipin-list">
                    <li class="flex" v-for="item,index in displayFoodList" :key="index">
                        <div class="food_image" @click="showDishDialog(item)"><img :src="item.coverimage" alt=""></div>
                        <div class="food-information">
                            <h5 class="ellipsis2">{{item.cpname}}</h5>
                            <p class="ellipsis2">{{item.describe}}</p>
                            <div class="food-price flexBox">
                                <div class="price"><span class="price-num">${{item.price}}</span></div>
                                <div class="add-cart flexBox" v-if="item.number > 0">
                                    <div class="reduce" @click="DelFood(item)"><van-icon name="minus" /></div>
                                    <div class="num">{{item.number}}</div>
                                    <div class="plus" @click="AddFood(item)"><van-icon name="plus" /></div>
                                </div>
                            </div>
                        </div>
                        <div class="addCart" @click="addCart(item)" v-if="item.number==0 "><van-icon name="plus" /></div>
                    </li>
                </ul>
            </div>
        </div>



        <div v-else>
            <div class="food-classify">
                <div class="food-lists">
                    <div class="food-item" :class="NowIndex == -1 ? 'active' : ''" @click="changeTab(-1, 'All')">
                        <img src="../../assets/images/foodItem.png"><div class="food-name">All</div>
                    </div>
                    <div class="food-item" :class="index==NowIndex?'active':''" v-for="item,index in classifyList" :key="index" @click="changeTab(index, item.name)">
                        <img :src="item.image || getPlaceholder('foodItem')"><div class="food-name">{{ item.name }}</div>
                    </div>
                </div>
            </div>

            <div class="caipin caipin1" :class="{ 'GridMode': viewMode === 3 }" style="padding: 0 10px;">
                <div class="caipin-header flexBox" style="justify-content: space-between; align-items: center; padding: 10px 5px;">
                    <h3>{{ selectedCategoryName }} <span v-if="activeDietary !== 'all'" style="font-size:12px; ">({{activeDietaryLabel}})</span></h3>
                    <ul class="flex sort" style="gap: 10px;">
                        <li @click="viewMode = 1"><img :src="viewMode === 1 ? getIcon('one_sel') : getIcon('one_nor')"></li>
                        <li @click="viewMode = 2"><img :src="viewMode === 2 ? getIcon('two_sel') : getIcon('two_nor')"></li>
                        <li @click="viewMode = 3"><img :src="viewMode === 3 ? getIcon('three_sel') : getIcon('three_nor')"></li>
                    </ul>
                </div>
                <ul class="caipin-list">
                    <li :class="[viewMode === 3 ? 'caipin-item' : 'flex', item.number > 0 ? 'active' : '']" v-for="item,index in displayFoodList" :key="index">
                        <div :class="viewMode === 3 ? 'caipin-img' : 'food_image'" @click="showDishDialog(item)"><img :src="item.coverimage"></div>
                        <div class="food-information">
                            <h5 class="ellipsis2">{{item.cpname}}</h5>
                            <div class="food-price flexBox">
                                <div class="price"><span class="price-num">${{item.price}}</span></div>
                                <div class="add-cart flexBox" v-if="item.number > 0">
                                    <div class="reduce" @click="DelFood(item)"><van-icon name="minus" /></div>
                                    <div class="num">{{item.number}}</div>
                                    <div class="plus" @click="AddFood(item)"><van-icon name="plus" /></div>
                                </div>
                            </div>
                        </div>
                        <div class="addCart" @click="addCart(item)" v-if="item.number==0 "><van-icon name="plus" /></div>
                    </li>
                </ul>
            </div>
        </div>

        <van-popup v-model:show="show" title="" :round="true" :close-on-click-overlay="false">
            <div class="dialog-content">
                <img :src="shopDetail.logo || getPlaceholder('logo')" alt="shop logo">
                
                <div class="shop-info">
                    <div class="shop-name">
                        <span class="icon"><van-icon name="location" /></span> 
                        {{ shopDetail.address || 'Address loading...' }}
                    </div>
                    <div class="shop-name">
                        <span class="icon"><van-icon name="phone" /></span>
                        {{ shopDetail.phone || 'Phone loading...' }}
                    </div>
                    <div class="shop-name">
                        <span class="icon"><van-icon name="clock" /></span>
                        {{ shopDetail.business_hours || '12:00 AM - 11:59 PM' }}
                    </div>
                </div>
                
                <ul>
                    <li>Official Partner</li>
                    <li>Quality Ingredients</li>
                </ul>
                <p>
                    Welcome to our store! We are committed to providing you with the freshest food 
                    and the best dining experience. Our kitchen follows strict health guidelines 
                    to ensure every meal is perfect.
                </p>
                <div class="close" @click="show = false"><van-icon name="close" /></div>
            </div>
        </van-popup>


        <van-action-sheet v-model:show="showMoreDietary" title="Dietary Preferences">
            <div class="dietary-sheet-content">
                <div v-for="opt in dietaryOptions" :key="opt.id" 
                    class="sheet-item" 
                    :class="{ 'active': activeDietary === opt.id }"
                    @click="toggleDietary(opt.id); showMoreDietary = false">
                    <img :src="opt.icon" v-if="opt.icon" width="40">
                    <span>{{ opt.label }} ({{ opt.prefix }})</span>
                    <van-icon name="success" v-if="activeDietary === opt.id" />
                </div>
            </div>
        </van-action-sheet>




        <van-popup v-model:show="Dishshow" :round="true">
            <div class="DishBox">
                <div class="dish-info"><h4>{{ NowSelectFood.cpname }}</h4></div>
                <img :src="NowSelectFood.coverimage" style="width:100%">
                <p style="color: #999; padding: 10px;">{{ NowSelectFood.describe }}</p>
                <ul class="yingyang">
                    <li class="Calories"><p class="number">{{ Math.floor(animatedStats.calorie) }}</p><p class="name">Calories</p></li>
                    <li class="Calories"><p class="number">{{ Math.floor(animatedStats.vitamin) }}%</p><p class="name">Vitamin</p></li>
                    <li class="progress">
                        <div class="Carbs">
                            <div class="flexBox"><div class="Carbs_title">calorie</div><div class="carbs_info"><span class="number">{{ (animatedStats.calorie).toFixed(1) }} kcal</span></div></div>
                            <van-progress color="#EB362A" :percentage="percentCalorie" :show-pivot="false" />
                        </div>
                        <div class="Carbs">
                            <div class="flexBox"><div class="Carbs_title">protein</div><div class="carbs_info"><span class="number">{{ (animatedStats.protein).toFixed(1) }} g</span> <span class="percent">{{ Math.floor(percentProtein) }}%</span></div></div>
                            <van-progress color="#2AEB47" :percentage="percentProtein" :show-pivot="false" />
                        </div>
                        <div class="Carbs">
                            <div class="flexBox"><div class="Carbs_title">fat</div><div class="carbs_info"><span class="number">{{ (animatedStats.fat).toFixed(1) }} g</span> <span class="percent">{{ Math.floor(percentFat) }}%</span></div></div>
                            <van-progress color="#444DFA" :percentage="percentFat" :show-pivot="false" />
                        </div>
                    </li>
                </ul>
                <div class="close" @click="Dishshow = false"><van-icon name="close" /></div>
            </div>
        </van-popup>

        <van-popup class="AddFoodBox" v-model:show="showDish" position="bottom" :round="true">
            <div v-if="NowSelectFood.cpname">
                <div class="product-header">
                    <img :src="NowSelectFood.coverimage">
                    <div class="product-info-overlay"><h2 class="title">{{ NowSelectFood.cpname }}</h2><div class="price-row"><span class="current-price">$ {{ NowSelectFood.price }}</span></div></div>
                    <div class="header-stepper"><button @click="ChangeFoodNumber('minus')">-</button><span>{{ NowSelectFood.number }}</span><button @click="ChangeFoodNumber('add')">+</button></div>
                </div>
                <div class="modal-body">
                    <div class="section" v-for="item,index in NowSelectFood.classifyList" :key="index">
                        <div class="option-group">
                            <button class="option-btn" @click="ChangeActiveIndex(index,i1)" v-for="son,i1 in item.sons" :class="item.value==i1?'active':''" :key="i1">{{ son.value }}</button>
                        </div>
                    </div>
                    <div class="section" v-if="NowSelectFood.ingredientList?.length > 0">
                        <h3 class="section-title">Addons</h3>
                        <div class="addons-list">
                            <div class="addon-card" :class="it.boole?'active':''" v-for="it,idx in NowSelectFood.ingredientList" :key="idx" @click="ChangeIngreDient(it)">
                                <img :src="it.thumbnail">
                                <div class="addon-info">
                                    <p class="addon-name"><span>!</span> {{ it.cpname }}</p>
                                    <div class="addon-bottom">
                                        <span class="addon-price">$ {{ it.price }}</span>
                                        <div class="mini-stepper">
                                            <img src="../../assets/480.png" @click.stop="Reduce(it)">
                                            <span>{{ it.number }}</span>
                                            <img src="../../assets/479.png" @click.stop="Add(it)">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3 class="section-title">Special instructions</h3>
                        <div class="tag-group">
                            <span class="tag" :class="t.boole?'active':''" v-for="t in NowSelectFood.labelList" :key="t.id" @click="ChangeNowRemark(t)">{{ t.name }}</span>
                        </div>
                        <textarea v-model="NowSelectFood.remarks" class="note-input" placeholder="Add notes..."></textarea>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn-back" @click="showDish = false">Back</button><button class="btn-submit" @click="AddCart">Add To Cart</button></div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useCartStore, useTableStore } from '../../stores/index.js'
import { storeToRefs } from 'pinia'
import api from '../../common/index.js'
import paymentApi from '../../common/modules/payment.js'
import shopApi from '../../common/modules/shop.js'
import { showToast } from 'vant'



// --- 主题模式定义 ---
const themeMode = ref('light') // 默认亮色模式: 'light', 'dark', 'eye'

// 切换主题
function changeTheme(mode) {
  themeMode.value = mode
  // 将模式设置到 HTML 根节点，方便全局 CSS 控制
  document.documentElement.setAttribute('data-theme', mode)
  // 可选：持久化存储，下次打开还是这个模式
  localStorage.setItem('user-theme', mode)
}

// 初始化加载存储的模式
onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme') || 'light'
  changeTheme(savedTheme)
})




// --- 1. Store 初始化 ---
const userStore = useUserStore()
const cartStore = useCartStore()
const tableStore = useTableStore()

const { userInfo, shopuid } = storeToRefs(userStore)
const { tableOpenInfo } = storeToRefs(tableStore)
const { bindTableInfo } = tableStore

const { foodList, classifyList, selectedFoodList } = storeToRefs(cartStore)
const { clearCart, setFoodList, setIngredientList, setClassifyList, addToCart, removeFromCart } = cartStore
const { setShopUid, getShopInfo } = userStore

// --- 2. 状态定义 ---
const router = useRouter()
const route = useRoute()
const viewMode = ref(2) 
const NowIndex = ref(-1)
const selectedCategoryName = ref('All')
const showDish = ref(false)
const show = ref(false) 
const Dishshow = ref(false)
const showMoreDietary = ref(false)
const NowSelectFood = ref({})
let labelList = ref([])

const adData = reactive({
    notice: '',
    banners: []
})

const shopDetail = ref({
    logo: '',
    address: '',
    phone: '',
    business_hours: '',
    describe: ''
})

// --- 3. 饮食偏好配置 ---
const activeDietary = ref('all')
const getDietIcon = (name) => new URL(`../../assets/images/${name}.png`, import.meta.url).href

const dietaryOptions = [
    { id: 'veg', label: 'Vegetarian', icon: getDietIcon('veg'), prefix: '[Veg]' },
    { id: 'vegan', label: 'Vegan', icon: getDietIcon('vegan'), prefix: '[Vegan]' },
    { id: 'gf', label: 'Gluten-Free', icon: getDietIcon('gluten-free'), prefix: '[GF]' },
    { id: 'df', label: 'Dairy-Free', icon: getDietIcon('dairy-free'), prefix: '[DF]' },
    { id: 'nf', label: 'Nut-Free', icon: getDietIcon('nut-free'), prefix: '[NF]' },
    { id: 'halal', label: 'Halal', icon: getDietIcon('halal'), prefix: '[Halal]' },
    { id: 'spicy', label: 'Spicy', icon: getDietIcon('spicy'), prefix: '[Spicy]' }
]

const activeDietaryLabel = computed(() => {
    const opt = dietaryOptions.find(o => o.id === activeDietary.value)
    return opt ? opt.label : ''
})

// --- 4. 营养动画状态 ---
const animatedStats = reactive({ calorie: 0, protein: 0, fat: 0, vitamin: 0 })
const percentCalorie = computed(() => Math.min((animatedStats.calorie / 2000) * 100, 100))
const percentProtein = computed(() => Math.min((animatedStats.protein / 50) * 100, 100))
const percentFat = computed(() => Math.min((animatedStats.fat / 70) * 100, 100))

// --- 5. 工具函数 ---
const getIcon = (name) => new URL(`../../assets/icons/${name}.png`, import.meta.url).href
const getPlaceholder = (name) => new URL(`../../assets/images/${name}.png`, import.meta.url).href

// --- 6. 核心逻辑：跨视图筛选 ---
const displayFoodList = computed(() => {
    let list = foodList.value || []
    if (selectedCategoryName.value !== 'All') {
        list = list.filter(item => item.flname === selectedCategoryName.value)
    }
    if (activeDietary.value !== 'all') {
        const option = dietaryOptions.find(o => o.id === activeDietary.value)
        if (option) {
            list = list.filter(item => {
                const desc = (item.describe || '').trim()
                return desc.startsWith(option.prefix)
            })
        }
    }
    return list
})

// --- 7. 业务逻辑函数 ---

function loadAdvertisement() {
    paymentApi.getAdvertisement({ shop_id: shopuid.value }).then(res => {
        if(res.code == 1 && res.data && res.data.length > 0) {
            const rawData = res.data[0];
            adData.notice = rawData.noticecontent || '';
            if (rawData.images) {
                adData.banners = rawData.images.split(',').map(url => url.trim()).filter(url => url !== '');
            } else {
                adData.banners = [];
            }
        }
    }).catch(err => {
        console.error('Advertisement Load Fail:', err);
    });
}

function loadShopDetail() {
    shopApi.getShop({ id: shopuid.value }).then(res => {
        if (res.code == 1 && res.data && res.data.length > 0) {
            const info = res.data[0];
            
            // 修正后的图片拼接地址
            const logoPath = info.logo_img 
                ? (info.logo_img.startsWith('http') ? info.logo_img : 'https://pos.uhimao.com' + info.logo_img) 
                : '';
            
            shopDetail.value = {
                logo: logoPath,
                address: info.address || '',
                phone: info.phone || '',
                business_hours: `${info.openingstart || '00:00'} - ${info.openingend || '23:59'}`,
                describe: info.describe || 'Welcome to our store! We are committed to providing you with the freshest food and the best dining experience.'
            };
        }
    }).catch(err => {
        console.error('Shop Detail Load Fail:', err);
    });
}

function toggleDietary(id) {
    activeDietary.value = (activeDietary.value === id) ? 'all' : id
}

function changeTab(index, name) { 
    NowIndex.value = index; 
    selectedCategoryName.value = name; 
}

const runStatsAnimation = (targetStats) => {
    const duration = 800
    const startTime = performance.now()
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        animatedStats.calorie = (parseFloat(targetStats.calorie) || 0) * ease
        animatedStats.protein = (parseFloat(targetStats.protein) || 0) * ease
        animatedStats.fat = (parseFloat(targetStats.fat) || 0) * ease
        animatedStats.vitamin = (parseFloat(targetStats.vitamin) || 0) * ease
        if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
}

function ChangeFoodNumber(type) {
    if (type === 'add') NowSelectFood.value.number++
    else if (NowSelectFood.value.number > 0) NowSelectFood.value.number--
}

function ChangeIngreDient(item) { item.boole = !item.boole }
function Add(item) { item.number += 1 }
function Reduce(item) { if (item.number > 0) item.number -= 1 }

function AddCart() { 
    addToCart(NowSelectFood.value, 1)
    showDish.value = false 
}

function ChangeNowRemark(t) { t.boole = !t.boole }
function ChangeActiveIndex(idx, sidx) { if(NowSelectFood.value.classifyList[idx]) NowSelectFood.value.classifyList[idx].value = sidx }

function showDialog1() { 
    show.value = true 
}

function showDishDialog(item) { 
    NowSelectFood.value = item
    animatedStats.calorie = 0; animatedStats.protein = 0; animatedStats.fat = 0; animatedStats.vitamin = 0
    Dishshow.value = true 
    setTimeout(() => { runStatsAnimation(item) }, 100)
}

function addCart(item) {
    showDish.value = true
    item.labelList = JSON.parse(JSON.stringify(labelList.value))
    NowSelectFood.value = JSON.parse(JSON.stringify(item))
    NowSelectFood.value.number = 1
}

function DelFood(item) { removeFromCart(item) }

function AddFood(item) {
    showDish.value = true
    item.labelList = JSON.parse(JSON.stringify(labelList.value))
    NowSelectFood.value = JSON.parse(JSON.stringify(item))
}

function goPage() { router.push('/search') }

// --- 8. 生命周期加载 ---
onMounted(() => {
    const q = route.query
    if(q.id && q.tab_id){
        setShopUid(q.id)
        if(shopuid.value !== q.id || tableOpenInfo.value.tableId !== q.tab_id) clearCart()
        api.scanOpenTable({ shop_id: q.id, table_manage_id: q.tab_id }).then(res => {
            if(res.code == 1) {
                bindTableInfo(res.data) 
                if (res.data.id && !res.data.reserve_list_id) tableOpenInfo.value.reserve_list_id = res.data.id
            }
        })
        getShopInfo({ id: q.id })
    }

    loadAdvertisement()
    loadShopDetail()

    api.getRemarkLabels({ shop_id: shopuid.value }).then(res => {
        if(res.code == 1) labelList.value = res.data.map(v => ({ ...v, boole: false }))
    })

    api.getFoodCategory({ dpid: shopuid.value, strip: 99 }).then(res => {
        if(res.code == 1 && res.data && res.data.data) {
            setClassifyList(res.data.data.filter(i => i.name !== '临时类' && i.name !== '小料').map(i => ({ 
                ...i, 
                number: 0,
                image: i.image || '' 
            })))
        }
    })

    api.getFoodMenu({ dpid: shopuid.value }).then(res => {
        if(res.data) {
            const addons = res.data.filter(f => f.flname == '小料').map(f => ({ ...f, boole: false, number: 0 }))
            setIngredientList(addons)
            setFoodList(res.data.filter(i => i.flname !== '临时类' && i.flname !== '小料').map(item => {
                let specs = item.gaugejson ? JSON.parse(item.gaugejson) : [{ val: "specifications", sons: [{ value: "default" }], "value": 0 }]
                const count = (selectedFoodList.value || []).filter(c => c.product_id === item.product_id).length
                return { 
                    ...item, 
                    classifyList: specs, 
                    number: count, 
                    ingredientList: JSON.parse(JSON.stringify(addons)),
                    labelList: [],
                    calorie: item.calorie || 0, fat: item.fat || 0, protein: item.protein || 0, vitamin: item.vitamin || 0
                }
            }))
        }
    })
})
</script>



<style lang="scss" scoped>


.Type-list {
  display: flex;
  background: var(--border-color);
  border-radius: 20px;
  padding: 2px;
  gap: 5px;
}

.Type-item {
  width: 40px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.Type-item.active {
  background: var(--card-bg);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.Type-item img {
  width: 17px;
  height: 17px;
}





/* 强制面板背景为白色，文字为黑色 */
:deep(.van-action-sheet) {
    background-color: #ffffff !important;
    color: #323233 !important; /* Vant 标准深色文字颜色 */

    /* 标题部分 */
    .van-action-sheet__header {
        color: #323233 !important;
        background-color: #ffffff !important;
    }
}




/* 内部列表内容的样式 */
.dietary-sheet-content {
    background-color: #ffffff; /* 确保内容区域也是白色 */
    
    .sheet-item {
        background-color: #ffffff;
        color: #333333; /* 列表文字颜色 */
        border-bottom: 1px solid #f2f3f5;

        span {
            color: #333333;
        }

        /* 选中状态的颜色 */
        &.active {
            background-color: #f7f8fa;
            color: #444DFA; /* 你页面使用的主色调蓝 */
            
            span {
                color: #444DFA;
                font-weight: bold;
            }
        }
    }
}



.my-swipe {
    border-radius: 12px;
    overflow: hidden;
    margin: 5px;
}

.dietary-filter-wrapper { padding: 5px;  }
.dietary-scroll { display: flex; overflow-x: auto; gap: 10px; padding-bottom: 5px; }
.dietary-scroll::-webkit-scrollbar { display: none; }
.diet-tag { 
    flex-shrink: 0; padding: 6px 14px; border-radius: 20px; background: #f5f5f5; 
    font-size: 12px; color: #000000; border: 1px solid #eee; display: flex; align-items: center; gap: 5px;
}
.diet-tag.active { background: #EB362A10; color: #EB362A; border-color: #EB362A; }
.dietary-sheet-content { padding: 10px 0; }
.sheet-item { padding: 15px 20px; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #f9f9f9; }


.food-lists{
    padding: 0 15px;
    padding-bottom: 10px;
    margin-top:-10px ;
    text-align: left;
    white-space: nowrap;
    overflow-x: auto;
    .food-item{
        display: inline-block;
        width: 120px;
        text-align: center;
        margin-right: 5px;
        border-radius: 15px 15px 15px 15px;
        border: 1px solid ;
        background-color: var(--Color-Background);
        padding: 5px;
        .food-name{
            margin-top: 15px;
            font-size: 12px;
        }
        img{
            width: 50px;
            height: 50px;
            margin: auto;
        }
    }
    .food-item:last-child{
        margin-right: 0;
    }
    .food-item.active{
        border-color: #444DFA;
        .food-name{
            font-weight: bold;
            color: #444DFA;
        }
    }
}
.food-type{
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    padding: 0 15px;
    margin-bottom: 30px;
    .veg{
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        background: var(--Color-Background);
        border-radius: 32px 32px 32px 32px;
        font-size: 12px;
        color: var(--Color-Font);
        border: 1px solid;
        img{
            width: 16px;
        }
    }
    .veg.active {
        border-color: #0E57E2;
        .close-icon{
           display: block; 
        }
        
    }
    .close-icon{
        margin-left: 10px;
        color: #EB362A;
        display: none;
    }
}
.caipin-header{
    padding: 0 15px;
    margin-bottom:0px;
    justify-content: space-between;
    h3{
        font-weight: bold;
        font-size: 18px;
    }
    ul{
        gap: 10px;
        align-items: center;
        li{
            border-radius: 50%;
            
            text-align: center;

            img{
                width: 20px;
                height: 20px;
            }
        }
    }
}
.caipin{
    padding: 0 10px;
    color: var(--Color-Font);
}
.caipin-list li.active .addCart{
    display: none;
}
.caipin-list li.active .food-information .add-cart{
    display: flex;
}
.caipin-list li{
    background: var(--Color-Background);
    margin-bottom: 10px;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #EFF0F6;
    position: relative;
    .food_image{
        width: 100px;
        height: 100px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .addCart{
        background: #444DFA;
        border-radius: 15px 0px 15px 0px;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 7px 10px;
        color: white;
    }
    .food-information{
        flex: 1;
        padding: 10px;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .food-price{
            .price{
                font-size: 12px;
                .price-num{
                    color: #E63700;
                    font-weight: bold;
                    font-size: 16px;
                }
                .OldPrice{
                    margin-left: 5px;
                    color: #999999;
                    text-decoration: line-through;
                }
            }
        }
        h5{
            font-weight: 400;
            font-size: 13px;

        }
        // p{
        //     color: #999999;
        // }
        .reduce,.plus{
            width: 24px;
            height: 24px;
            border-radius: 6px;
            text-align: center;
            line-height: 24px;
            color: var(--Color-Font);
            border: 1px solid #444DFA;
            
        }
        .add-cart{
            display: none;
        }
        
        .num{
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            color: var(--Color-Font);
        }
        .plus{
            background-color: #444DFA;
            color: white;
        }
        .reduce{
            background-color: white;
            color: #444DFA;
        }
    }
}



.food-lists{
    padding: 0 15px;
    padding-bottom: 10px;
    margin-top:10px ;
    text-align: left;
    white-space: nowrap;
    overflow-x: auto;
    .food-item{
        display: inline-block;
        width: auto;
        min-width: 80px;
        text-align: center;
        margin-right: 5px;
        border-radius: 15px 15px 15px 15px;
        border: 1px solid #eee;
        background-color: var(--Color-Background);
        padding: 5px;
        .food-name{
            margin-top: 5px;
            font-size: 12px;
        }
        img{
            width: 20px;
            height: 20px;
            margin: auto;
        }
    }
    .food-item:last-child{
        margin-right: 0;
    }
    .food-item.active{
        border-color: #444DFA;
        .food-name{
            font-weight: bold;
            color: #444DFA;
        }
    }
}

.food-type{
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    padding: 0 15px;
    margin-bottom: 0px;
    .veg{
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        background: var(--Color-Background);
        border-radius: 32px 32px 32px 32px;
        font-size: 12px;
        color: var(--Color-Font);
        border: 1px solid #eee;
        img{
            width: 16px;
        }
    }
    .veg.active {
        border-color: #0E57E2;
        .close-icon{
           display: block; 
        }
        
    }
    .close-icon{
        margin-left: 10px;
        color: #EB362A;
        display: none;
    }
}

.caipin-header{
    padding: 0 15px;
    margin-bottom: 0px;
    justify-content: space-between;
    h3{
        font-weight: bold;
        font-size: 18px;
    }
    ul{
        gap: 10px;
        align-items: center;
        li{
            border-radius: 50%;
           
            text-align: center;
        }
    }
}
.caipin{
    padding: 0 10px;
    color: var(--Color-Font);
}
.caipin-list li{
    background: var(--Color-Background);
    margin-bottom: 0;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #eff0f61a;
    position: relative;
    text-align: center;
    padding: 10px       ;
    height: fit-content;
    .caipin-img{
        text-align: center;
        width: 100%;
        border-radius: 15px 15px 15px 15px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
            max-width: 100%;
            object-fit: cover;
            margin: auto;
        }
    }
    .addCart{
        background: #444DFA;
        border-radius: 15px 0px 15px 0px;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 7px 10px;
        color: white;
    }
    .food-information{
        flex: 1;
        padding: 10px;
        padding-bottom: 0;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .food-price{
            .price{
                font-size: 12px;
                .price-num{
                    color: #E63700;
                    font-weight: bold;
                    font-size: 16px;
                }
                .OldPrice{
                    margin-left: 5px;
                    color: #999999;
                    text-decoration: line-through;
                }
            }
        }
        h5{
            font-weight: 400;
            line-height: 14px;
            font-size: 12px;

        }
        p{
            line-height: 14px;
            font-size: 10px;
        }
        .reduce,.plus{
            width: 24px;
            height: 24px;
            border-radius: 6px;
            text-align: center;
            line-height: 24px;
            color: var(--Color-Font);
            border: 1px solid #444DFA;
            
        }
        .add-cart{
            display: none;
        }
        
        .num{
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            color: var(--Color-Font);
        }
        .plus{
            background-color: #444DFA;
            color: white;
        }
        .reduce{
            background-color: white;
            color: #444DFA;
        }
    }
}
.caipin-list li.active .addCart{
    display: none;
}
.caipin-list li.active .food-information .add-cart{
    display: flex;
}

.caipin{
    flex: 1;
    display: flex;
    flex-direction: column;
   
}


.GridMode {
    padding: 0 10px;
    .caipin-list {
        display: grid;
        grid-template-columns: repeat(2, calc(50% - 5px));
        gap: 10px;
        max-height: none; /* 根据需求调整 */
    }
}


.caipin-list{
    height: 100%;
    overflow-y: auto;
}

.Home-page{
    height: 100%;
    padding-bottom: 56px;
    display: flex;
    flex-direction: column;
    header{
        // background-image: url('');
        // background-repeat: no-repeat;
        // background-size: cover;
        // background-position: top center;
        // height: 330px;
        width: 100%;
        padding: 10px;
        background: #444DFA;
    }
    .nav{
        gap: 10px;
        margin-top: 5px;
        align-items: center;
        --van-notice-bar-height:32px;
        .home,.Search{
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #F3F5F9;
            text-align: center;
            line-height: 32px;
        }
        .home{
            font-size: 20px;
                color: #444DFA;
        }
        .Search{
            font-size: 20px;
            color: var(--Color-Font);
        }
        .van-notice-bar{
            flex:1;
            border-radius: 32px 32px 32px 32px;
color: #9e9e9e;
    font-size: 12px;

        }
    }
    .User{
        align-items: center;
        gap: 5px;
        margin-right: 10px;
        img{
            width: 20px;
        }
    }
}
.lang-list{
    padding: 1px 10px;
    gap: 2px;
    background: #F3F5F9;
    border-radius: 14px 14px 14px 14px;
    font-weight: 400;
    font-size: 12px;
    color: var(--Color-Font);
    display: flex;
    align-items: center;
    margin-right: 10px;
    img{
        width: 10px;
    }
}
.Type-list{
    gap: 2px;
    background: #535476;
    border-radius: 14px 14px 14px 14px;
    font-weight: 400;
    font-size: 12px;
    color: var(--Color-Font);
    display: flex;
    align-items: center;
    margin-right: 10px;
    overflow: hidden;
    .Type-item{
        
        padding: 5px 10px;
    }
    .Type-item.active{
        background: var(--Color-Background);
        border-radius: 32px 32px 32px 32px;
    }
}
.Table-Name{
    font-weight: bold;
    font-size: 20px;
}
.caipin{
    display: flex;
    flex: 1;
    height: 59vh;
    .caipin-classify{
        width: 100px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 8px 0px 0px 8px;
        
        color: #111;
        .item{
            padding: 10px 20px;
            &.active{
                
                color: #444DFA;
                font-weight: bold;
            }
        }
    }
    .caipin-food{
        flex: 1;
        background: #F3F5F9;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 0px 8px 8px 0px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        .caipin-list{
            flex: 1;
            overflow-y: auto;
            height: 40vh;
        }
        .food-header{
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            margin-bottom: 10px;
            .veg-list{ 
                gap: 10px;
                margin-right: 20px;
            }
            .sort{ 
                gap: 10px;


            }
            .veg{
                background: #FFFFFF;
                padding: 3px 9px;
                border-radius: 19px 19px 19px 19px;
                border: 1px solid #dfdfdf;
                display: flex;
                gap: 0px;
                img{
                    width: 20px;
                    height: auto;
                    display: inline-block;
                }
            }
            .veg.active {
                border-color: #0E57E2;
                .close-icon{
                   display: flex; 
                }
                
            }
            .close-icon{
                color: #EB362A;
                display: none;
                font-size: 14px;
            }
        }
    }
}
.caipin-list li .food-information .add-cart{
    display: flex;
}
.caipin-list li{
    background: var(--Color-Background);
    margin-bottom: 10px;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #eff0f61a;
    position: relative;
    .food_image{
        width: 100px;
        height: 100px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
                border-radius: 10px;
        }
    }
    .addCart{
        background: #444DFA;
        border-radius: 15px 0px 15px 0px;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 7px 10px;
        color: white;
    }
    .food-information{
        flex: 1;
        padding: 10px;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .food-price{
            .price{
                font-size: 12px;
                .price-num{
                    color: #E63700;
                    font-weight: bold;
                    font-size: 16px;
                }
                .OldPrice{
                    margin-left: 5px;
                    color: #999999;
                    text-decoration: line-through;
                }
            }
        }
        h5{
            font-weight: 400;
            font-size: 13px;

        }
        // p{
        //     color: #999999;
        // }
        .reduce,.plus{
            width: 24px;
            height: 24px;
            border-radius: 6px;
            text-align: center;
            line-height: 24px;
            color: var(--Color-Font);
            border: 1px solid #444DFA;
            
        }
        // .add-cart{
        //     display: none;
        // }
        
        .num{
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            color: var(--Color-Font);
        }
        .plus{
            background-color: #444DFA;
            color: white;
        }
        .reduce{
            background-color: white;
            color: #444DFA;
        }
    }
}
.DishBox{
    border-radius: 15px 15px 15px 15px;
    overflow: hidden;
    padding: 20px;
    position: relative;
    background: #FFFFFF;

    img{border-radius: 10px;}

    h4{font-size: 20px;}


    .close{
        position: absolute;
        right: 10px;
        top: 10px;
        color: #EB362A;
        font-size:30px;
    }
    .dish-info{
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        img{
            width: 20px;
            
        }
    }
    p{
        margin: 15px 0;
        font-size: 12px;
        line-height: 16px;
        text-align: left;
       
    }
    ul{
        display: flex;
        gap: 10px;
        li{
            border-radius: 18px 18px 18px 18px;
            border: 1px solid #333333;
            padding: 0 10px;  
        }
    }
    .yingyang{
        margin-top: 15px;
        display: block;
        .Calories:first-child{
            margin-left: 0;
        }
        .Calories{
            text-align: center;
            display: inline-block;
            width: calc(50% - 5px);
            border: none;
            margin-left: 10px;
            border-radius: 10px 10px 10px 10px;
            padding: 18px 0;
            .number{
                font-size: 26px;
                font-weight: bold;
                text-align: center;
                margin: 0;
            }
            .name{
                font-size: 12px;
                text-align: center;
                margin: 0;
            }
        }
        .progress{
            border: none;
            .Carbs{
                margin-bottom: 10px;
                .flexBox{
                    margin-bottom: 5px;
                }
                .Carbs_title{
                    font-size: 14px;
                }
                .carbs_info{
                    float: right;
                    .number{
                        font-size: 16px;
                        font-weight: bold;
                        margin-right: 20px;
                    }
                    .percent{
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
.dialog-content{
    border-radius: 15px 15px 15px 15px;
    overflow: hidden;
    padding: 20px;
    text-align: left;
    position: relative;
    .close{
        position: absolute;
        right: 10px;
        top: 10px;
        color: #EB362A;
        font-size: 30px;
    }
    img{
        width: 110px;
        margin-bottom: 15px;
    }
    .shop-info{
        margin: 20px 0;
        .shop-name{
            font-size: 11px;
            margin-bottom: 10px;
            .icon{
                margin-right: 10px;
                color: #444DFA;
            }
        }
    }
    ul{
        display: flex;
        gap: 5px;
        margin-bottom: 15px;
        li{
            border-radius: 18px 18px 18px 18px;
            border: 1px solid #333333;
            padding: 1px 15px;
        }
    }
}

/* 产品图片头部 */
.product-header {
  position: relative;
  height: 240px;
  margin: 12px;
}



.product-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.product-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  border-radius: 0 0 20px 20px;
  color: white;
}

.product-info-overlay .title { margin: 0; font-size: 24px; font-weight: bold; line-height: 24px;}

.price-row { margin-top: 4px; }
.current-price { color: #ff6b00; font-weight: bold; font-size: 20px; }
.original-price { text-decoration: line-through; color: #ddd; font-size: 14px; margin-left: 8px; }

.header-stepper {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: white;
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  width: 90px;
  display: flex;
  align-items: center;
  font-size: 20px; 

}
.header-stepper span{
    flex: 1;
    text-align: center;
}
.header-stepper button {
  border: none; background: none; cursor: pointer; padding: 0 10px;
  height: 20px; line-height: 20px;font-size: 20px; 
}

.info-icon {
  position: absolute; top: 15px; right: 15px;
  background: rgba(0,0,0,0.5); color: white;
  width: 20px; height: 20px; border-radius: 50%;
  text-align: center; font-size: 12px; line-height: 20px;
}

/* 主体内容区 */
.modal-body { padding: 0 20px; }

.section-title { font-size: 12px; margin: 20px 0 12px; }

/* 按钮组 */
.option-group { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }

.option-btn {
  padding: 5px 9px;
  border: 1px solid #eee;
  background: var(--bg-gray);
  border-radius: 10px;
  white-space: nowrap;
  color: #666;
  cursor: pointer;
}

.option-btn.active {
  border: 1px solid var(--primary-color);
  background: #eef1ff;
  color: var(--primary-color);
}

/* 加购卡片 */
.addons-list { display: flex; gap: 12px; overflow-x: auto;padding: 0 10px; }

.addon-card {
  display: flex;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 8px;
  min-width: 220px;
  align-items: center;
}
.addon-card.active{
    border: 1px solid var(--primary-color);
    background: #eef1ff;
}
.addon-card .mini-stepper img {
  width: 20px; height: auto; cursor: pointer;
  margin-right: 0px;
}
.addon-card img { width: 40px; height: 40px; border-radius: 8px; margin-right: 10px; }

.addon-info { flex: 1; }
.addon-name { margin: 0; font-size: 14px; display: flex; align-items: center; }
.addon-name span { background: #666; color: white; width: 14px; height: 14px; border-radius: 50%; display: inline-block; font-size: 10px; text-align: center; margin-right: 5px; }

.addon-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
.addon-price { font-weight: bold; font-size: 14px; }

.mini-stepper { display: flex; align-items: center; gap: 8px; border: 1px solid var(--primary-color); border-radius: 12px; padding: 2px; }
.mini-stepper button { border: none; background: none; color: var(--primary-color); font-weight: bold; cursor: pointer; }
.mini-stepper span { font-size: 12px; }

/* 备注 */
.tag-group { display: flex; gap: 8px; margin-bottom: 12px; }
.tag { border: 1px solid #ccc; border-radius: 20px; padding: 6px 10px; font-size: 12px; color: #666; }
.tag.active{
    border: 1px solid var(--primary-color);
    background: #eef1ff;
    color: var(--primary-color);
}
.note-input {
  width: 100%;
  height: 60px;
  background: var(--bg-gray);
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  box-sizing: border-box;
  resize: none;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  padding: 20px;
  gap: 15px;
}

.btn-back {
  flex: 1;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 15px;
  background: white;
  font-size: 16px;
  cursor: pointer;
}

.btn-submit {
  flex: 3;
  padding: 15px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.caipin1{ display: block !important;}

/* 针对 viewMode === 2 时的专用布局控制 */
.caipin {
    display: flex; /* 强制开启水平排列 */
    flex-direction: row !important;
    align-items: flex-start;
    padding: 0; /* 清除可能影响对齐的内边距 */
    height: calc(100vh - 250px); /* 动态计算高度，防止撑破页面，具体数值可按需微调 */
    overflow: hidden;

    /* 左侧分类菜单 */
    .caipin-classify {
        width: 80px !important; /* 固定宽度 */
        height: 100%;
        overflow-y: auto; /* 允许分类过多时滚动 */
        flex-shrink: 0; /* 禁止被挤压 */
        border-right: 1px solid #eff0f61a;

        .item {
            padding: 15px 10px;
            font-weight: 300;
            font-size: 11px;
            color: #666;
            text-align: center;
            line-height: 1.4;
            transition: all 0.3s;

            &.active {
               
                color: #444DFA;
                font-weight: bold;
                position: relative;
                
                /* 增加左侧激活指示条 */
                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 25%;
                    height: 50%;
                    width: 3px;
                    background: #444DFA;
                }
            }
        }
    }

    /* 右侧菜品区域 */
    .caipin-food {
        flex: 1 !important; /* 占据剩余全部宽度 */
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* 由内部 list 负责滚动 */
        padding: 10px !important;

        .food-header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between; /* 筛选和切换图标分居两侧 */
            margin-bottom: 12px;
            flex-shrink: 0;

            .veg-list {
                display: flex;
                gap: 4px;
                margin-right: 0;
            }
            
            .sort {
                display: flex;
                gap: 12px;
                
            }
        }

        .caipin-list {
            flex: 1;
            overflow-y: auto;
            padding-bottom: 20px; /* 留出底部空白 */
            
            /* 列表中的每一行 */
            li {
                display: flex; /* 确保图片和文字水平 */
                width: 100%;
                margin-bottom: 10px;
                border-radius: 12px;
                overflow: hidden;
            }
        }
    }
}

/* 兼容处理：如果是 GridMode (viewMode 3)，保持原来的网格逻辑 */
.GridMode {
    display: block !important; /* 网格模式下取消 flex 侧边栏布局 */
    .caipin-list {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px;
    }
}

</style>