<template>
    <div>
        <router-view></router-view>
        <tabbar @change="handleTabChange" @custom-click="handleCustomClick"></tabbar>
        
        <van-popup v-model:show="show" title="" show-cancel-button round position="bottom">
            <div class="Cart">
                <div class="flexBox">
                    <p>Cart</p>
                    <p>
                        Table
                        <span class="Table-num"> {{ tableOpenInfo.tccode }}{{ tableOpenInfo.number }}</span>
                    </p>
                </div>

                <ul class="Cart-lists" v-if="selectedFoodList.length > 0">
                    <li v-for="(item,index) in selectedFoodList" :key="index">
                        <div class="Food-image">
                            <img :src="item.coverimage" alt="">
                            <div class="cancel" @click="DelFood(item,index)">cancel</div>
                        </div>

                        <div class="foodInfo">
                            <p class="name"><van-icon name="info" /> {{item.cpname}}</p>
                            
                            <div class="cart-addons-text" v-if="hasAddons(item)">
                                + {{ formatAddons(item) }}
                            </div>

                            <p class="price">
                                <span>$</span>
                                <span class="price-num">{{ getItemTotalPrice(item) }}</span>
                                <span>x{{item.number}}</span>
                            </p>
                        </div>

                        <div class="Edit" @click="addCart(item,index)">
                            <img src="../assets/Union.png" alt="">
                        </div>
                    </li>
                </ul>

                <div class="Empty-Cart-Box" v-else>
                    <van-icon name="shopping-cart-o" size="80" color="#eee" />
                    <p>Your cart is empty</p>
                </div>

                <div class="footerIcon flexBox">
                    <div class="cancel" @click="show=false">Back</div>
                    <div 
                        class="Checkout" 
                        :class="{ 'btn-disabled': selectedFoodList.length === 0 }" 
                        @click="checkout"
                    >
                        Prococeed to checkout
                    </div>
                </div>
            </div>
        </van-popup>
        
        <van-popup class="AddFoodBox" v-model:show="showCartDish" title="" :round="true" position="bottom" :close-on-click-overlay="false"> 
            <div>
                <div class="product-header">
                    <img :src="NowSelectFood.coverimage">
                    <div class="product-info-overlay">
                        <h2 class="title">{{ NowSelectFood.cpname }}</h2>
                        <div class="price-row">
                            <span class="current-price">¥ {{ NowSelectFood.price }}</span>
                        </div>
                    </div>
                    <div class="header-stepper">
                        <button @click="ChangeFoodNumber('minus')">-</button>
                        <span>{{ NowSelectFood.number }}</span>
                        <button @click="ChangeFoodNumber('add')">+</button>
                    </div>
                </div>
      
                <div class="modal-body">
                    <div class="section">
                        <div class="option-group" v-for="(item,index) in NowSelectFood.classifyList" :key="index">
                            <button class="option-btn" @click="ChangeActiveIndex(index,index1)" v-for="(classifycontent,index1) in item.sons" :class="item.value==index1?'active':''" :key="index1">{{ classifycontent.value }}</button>
                        </div>
                    </div>
      
                    <div class="section" v-if="NowSelectFood.ingredientList && NowSelectFood.ingredientList.length > 0">
                        <h3 class="section-title">Addons</h3>
                        <div class="addons-list">
                            <div class="addon-card" :class="item.boole?'active':''" v-for="(item,index) in NowSelectFood.ingredientList" :key="index" @click="ChangeIngreDient(item)">
                                <img :src="item.thumbnail">
                                <div class="addon-info">
                                    <p class="addon-name"><span>!</span> {{ item.cpname }}</p>
                                    <div class="addon-bottom">
                                        <span class="addon-price">$ {{ item.price }}</span>
                                        <div class="mini-stepper">
                                            <img src="../assets/480.png" @click.stop="Reduce(item)">
                                            <span>{{ item.number }}</span>
                                            <img src="../assets/479.png" @click.stop="Add(item)">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
      
                    <div class="section">
                        <h3 class="section-title">Special instructions</h3>
                        <div class="tag-group">
                            <span class="tag" :class="item.boole?'active':''" v-for="item in NowSelectFood.labelList" :key="item.id" @click="ChangeNowRemark(item)">{{ item.name }}</span>
                        </div>
                        <textarea v-model="NowSelectFood.remarks" class="note-input" placeholder="Add Notes..."></textarea>
                    </div>
                </div>
      
                <div class="modal-footer">
                    <button class="btn-back" @click="CloseDialog">Back</button>
                    <button class="btn-submit" @click="Submit">Submit</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import tabbar from '../components/tabbar.vue'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'; // 引入 computed 用于实时计算件数
import { useCartStore, useUserStore, useTableStore } from "../stores/index.js";
import { storeToRefs } from "pinia";
import { showToast } from 'vant';

export default {
    components: { tabbar },
    setup() {
        // --- 1. 状态定义 ---
        const show = ref(false); 
        const showCartDish = ref(false); 
        const NowIndex = ref(0);
        const NowSelectFood = ref({});
        const router = useRouter();

        // --- 2. Store 数据解构 ---
        const userStore = useUserStore();
        const cartStore = useCartStore();
        const tableStore = useTableStore(); 
        
        const { userInfo, shopuid } = storeToRefs(userStore);
        const { selectedFoodList, classifyList } = storeToRefs(cartStore);
        const { tableOpenInfo } = storeToRefs(tableStore); 
        const { deleteFromCart } = cartStore;

        // --- 3. 实时计算与格式化辅助函数 ---

        /**
         * 【新增】：计算购物车商品总件数 (用于传递给 tabbar 显示角标)
         */
        const cartTotalCount = computed(() => {
            return selectedFoodList.value.reduce((total, item) => total + (Number(item.number) || 0), 0);
        });

        /**
         * 计算单个商品（含其选中所有小料）的合计单价
         */
        const getItemTotalPrice = (item) => {
            const basePrice = Number(item.price || 0);
            let addonsSum = 0;
            if (item.ingredientList) {
                addonsSum = item.ingredientList
                    .filter(v => v.number > 0)
                    .reduce((sum, v) => sum + (Number(v.price || 0) * Number(v.number || 0)), 0);
            }
            return (basePrice + addonsSum).toFixed(2);
        };

        const hasAddons = (item) => {
            return item.ingredientList && item.ingredientList.some(v => v.number > 0);
        };

        const formatAddons = (item) => {
            if (!item.ingredientList) return '';
            return item.ingredientList
                .filter(v => v.number > 0)
                .map(v => `${v.cpname} x${v.number}`)
                .join(', ');
        };

        // --- 4. 业务逻辑函数 ---

        function DelFood(item, index) {
            deleteFromCart(item, index);
        }

        const handleTabChange = (index) => {
            if (index === 0) {
                router.push({ path: '/home/index' });
            } else if (index === 2) {
                router.push({ path: '/home/mine' });
            }
        };

        const handleCustomClick = () => {
            show.value = true;
        };

        // 在购物车弹窗中保存修改后的规格/小料
        function Submit() {
            selectedFoodList.value[NowIndex.value] = JSON.parse(JSON.stringify(NowSelectFood.value));
            showCartDish.value = false;
        }

        /**
         * --- 核心结账逻辑 ---
         */
        const checkout = () => {
            if (selectedFoodList.value.length === 0) {
                showToast('Please add some dishes.');
                return;
            }

            // 1. 映射后端需要的商品列表格式
            let SelectedFoodList = selectedFoodList.value.map((item) => {
                let List = item.ingredientList ? item.ingredientList.filter(v => v.number > 0) : [];
                let itemAddonsTotal = List.reduce((acc, val) => acc + (Number(val.price || 0) * Number(val.number || 0)), 0);

                return {
                    id: item.product_id,
                    value: item.number,
                    cpname: item.cpname,
                    discount: item.discount,
                    coverimage: item.coverimage,
                    gaugejson: item.classifyList,
                    price: item.price,
                    cddiscount: item.cddiscount,
                    vendibility: item.vendibility,
                    printername1: item.printername1,
                    materialjson: item.materialjson,
                    thumbnail: item.thumbnail,
                    nonejson: item.nonejson,
                    flavorjson: item.flavorjson,
                    remarks: item.remarks || '',
                    delay_user: userInfo.value?.username || 'Guest',
                    hot_state: '1',
                    delay_state: 2,
                    delay_time: '0',
                    table_stool_id: "0",
                    urgent: "1",
                    weighing_price: 0,
                    weighing_weight: 0,
                    feeding: List,
                    feedingPrice: itemAddonsTotal.toFixed(2),
                    flid: item.flid 
                };
            });

            // 2. 统计分类数量
            let ClassifyNum = [];
            for (let i = 0; i < classifyList.value.length; i++) {
                let num = 0;
                for (let j = 0; j < SelectedFoodList.length; j++) {
                    if (classifyList.value[i].id == SelectedFoodList[j].flid) {
                        num++;
                    }
                }
                if (num != 0) {
                    ClassifyNum.push({ name: classifyList.value[i].name, Number: num });
                }
            }

            // 3. 计算最终支付总额 finalPrice
            let finalPrice = selectedFoodList.value.reduce((acc, item) => {
                const singleTotal = Number(getItemTotalPrice(item));
                const itemTotal = singleTotal * Number(item.number);
                return Number((acc + itemTotal).toFixed(2));
            }, 0);

            // 4. 执行跳转
            router.push({
                path: '/checkout',
                query: {
                    goods: JSON.stringify(SelectedFoodList),
                    price: finalPrice, 
                    classifyNum: JSON.stringify(ClassifyNum),
                    shop_id: shopuid.value || localStorage.getItem('SHOPUID'),
                    reserve_list_id: tableOpenInfo.value.reserve_list_id || tableOpenInfo.value.id,
                    table_classify_id: tableOpenInfo.value.table_classify_id,
                    table_manage_id: tableOpenInfo.value.table_manage_id,
                    staff_basics_id: tableOpenInfo.value.staff_basics_id,
                    staff_basics_ids: tableOpenInfo.value.staff_basics_ids
                }
            });
        };

        // --- 5. 弹窗交互逻辑 ---

        function CloseDialog() {
            showCartDish.value = false;
        }

        function ChangeFoodNumber(type) {
            if (type === 'add') {
                NowSelectFood.value.number += 1;
            } else if (type === 'minus' && NowSelectFood.value.number > 1) {
                NowSelectFood.value.number -= 1;
            }
        }

        function ChangeIngreDient(item) {
            item.boole = !item.boole;
            if (item.boole && (!item.number || item.number <= 0)) {
                item.number = 1;
            } else if (!item.boole) {
                item.number = 0;
            }
        }

        function Add(item) {
            item.number = (item.number || 0) + 1;
            if (item.number > 0) item.boole = true;
        }

        function Reduce(item) {
            if (item.number > 0) item.number -= 1;
            if (item.number <= 0) item.boole = false;
        }

        function ChangeNowRemark(item) {
            item.boole = !item.boole;
        }

        function ChangeActiveIndex(index, index1) {
            if (NowSelectFood.value.classifyList[index]) {
                NowSelectFood.value.classifyList[index].value = index1;
            }
        }

        function addCart(item, index) {
            NowIndex.value = index;
            // 深拷贝当前点击的商品数据到编辑弹窗
            NowSelectFood.value = JSON.parse(JSON.stringify(item));
            showCartDish.value = true;
        }

        return {
            show, 
            showCartDish, 
            NowIndex, 
            NowSelectFood, 
            selectedFoodList, 
            tableOpenInfo,
            cartTotalCount, // 暴露给 template 中的 tabbar 使用
            handleTabChange, 
            handleCustomClick, 
            checkout, 
            CloseDialog,
            ChangeFoodNumber, 
            ChangeIngreDient, 
            Add, 
            Reduce, 
            ChangeNowRemark,
            ChangeActiveIndex, 
            addCart, 
            DelFood, 
            Submit,
            hasAddons, 
            formatAddons, 
            getItemTotalPrice 
        };
    }
}
</script>

<style lang="scss" scoped>

.Empty-Cart-Box {
    padding: 60px 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.Empty-Cart-Box p {
    margin-top: 15px;
    color: #999;
    font-size: 16px;
}

/* 结账按钮禁用样式 */
.btn-disabled {
    background: #ccc !important;
    color: #fff !important;
    pointer-events: none; /* 拦截点击事件 */
    opacity: 0.7;
}

.AddFoodBox{
    background: #FFFFFF !important;
}
.Cart{
    padding: 10px 20px;
    height: 400px;
    display: flex;
    flex-direction: column;
    background: #fff;
    .flexBox{
        margin-bottom: 15px;
        p:first-child{
            font-weight: bold;
            font-size: 14px;
        }
        p{
            font-size: 12px;
            color: #999999;
            span{
                font-weight: bold;
                font-size: 18px;
                margin-left: 5px;
            }
        }
    }
    .Cart-lists{
        flex: 1;
        height: 200px;
        overflow-y: auto;
        li{
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eeeeee31;
            text-align: left;
            .Food-image{
                width: 80px;
                height: 80px;
                margin-right: 10px;
                position: relative;
                img{
                    width: 100%;
                    border-radius: 10px;
                }
                .cancel{
                   position: absolute;
                    bottom: -5px;
                    right: 0;
                    left: 0;
                    width: fit-content;
                    margin: auto;
                    background: #E63700;
                    border-radius: 12px;
                    padding: 2px 6px;
                    font-size: 12px;
                    color: #fff;
                    cursor: pointer;
                    &:hover{
                        background: #f5f5f5;
                    }
                }
            }
            .foodInfo{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-right: 10px;
                width: 60%;
                .name{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .price{
                    color:#E63700;
                    font-size: 12px;
                    .price-num{
                        font-size: 16px;
                        font-weight: bold;
                        margin-right: 10px;
                    }
                    .oldPrice{
                        text-decoration: line-through;
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
            .Edit{
                width: 20px;
            }
        }
        
    }
}
.footerIcon{
    margin-top: 10px;
    margin-bottom: 0 !important;
    .cancel{
        width: 90px;
        padding: 15px 0;
        border-radius: 15px 15px 15px 15px;
        border: 1px solid #333333;
        text-align: center;
        font-size: 16px;
    }
    .Checkout{
        flex: 1;
        margin-left: 10px;
        padding: 15px 0;
        border-radius: 15px 15px 15px 15px;
        background: #444DFA;
        border: 1px solid #6171ce;
        color: #fff;
        text-align: center;
        font-size: 16px;
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
  border-radius: 20px;
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

.product-info-overlay .title { margin: 0; font-size: 22px; }

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

}
.header-stepper span{
    flex: 1;
    text-align: center;
}
.header-stepper button {
  border: none; background: none; font-size: 20px; cursor: pointer; padding: 0 10px;
  height: 20px; line-height: 20px;
}

.info-icon {
  position: absolute; top: 15px; right: 15px;
  background: rgba(0,0,0,0.5); color: white;
  width: 20px; height: 20px; border-radius: 50%;
  text-align: center; font-size: 12px; line-height: 20px;
}

/* 主体内容区 */
.modal-body { padding: 0 20px; }

.section-title { font-size: 16px; color: var(--text-main); margin: 20px 0 12px; }

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
  width: 16px; height: auto; cursor: pointer;
  margin-right: 0px;
}
.addon-card img { width: 40px; height: 40px; border-radius: 8px; margin-right: 10px; }

.addon-info { flex: 1; }
.addon-name { margin: 0; font-size: 14px; display: flex; align-items: center; }
.addon-name span { background: #666; color: white; width: 14px; height: 14px; border-radius: 50%; display: inline-block; font-size: 10px; text-align: center; margin-right: 5px; }

.addon-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
.addon-price { font-weight: bold; font-size: 14px; }

.mini-stepper { display: flex; align-items: center; gap: 8px; border: 1px solid var(--primary-color); border-radius: 12px; padding: 2px 6px; }
.mini-stepper button { border: none; background: none; color: var(--primary-color); font-weight: bold; cursor: pointer; }
.mini-stepper span { font-size: 12px; }

/* 备注 */
.tag-group { display: flex; gap: 8px; margin-bottom: 12px; }
.tag { border: 1px solid #ccc; border-radius: 20px; padding: 4px 12px; font-size: 12px; color: #666; }
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

.cart-addons-text {
    font-size: 10px;      /* 使用极小字号 */
    color: #999;         /* 使用灰色，与主标题区分 */
    line-height: 1.2;
    margin: 2px 0 4px 18px; /* 18px 是为了避开 info 图标的位置，保持对齐 */
    word-break: break-all; /* 防止长文本撑开容器 */
}

/* 购物车里每一行的高度自适应，防止小料多了重叠 */
.Cart-lists li {
    padding: 10px 0;
    height: auto !important; 
    align-items: flex-start; /* 顶部对齐更美观 */
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
</style>