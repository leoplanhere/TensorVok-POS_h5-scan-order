<template>
    <div class="Order-page">
        <Tabbar title="Order" />
        <van-tabs v-model:active="activeName" @click-tab="onClickTab">
            <van-tab v-for="(title, index) in TypeList" :key="index" :title="title" :name="index">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="No More Data"
                    :immediate-check="false"
                    @load="getMoreData"
                >
                    <OrderItem v-for="(item, idx) in FoodList" :key="idx" :item="item" />
                    <van-empty v-if="FoodList.length === 0" description="No Data" />
                </van-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Tabbar from '../../components/Tabber.vue';
import OrderItem from './components/orderItem.vue';
import api from '../../common/index.js'
import { useUserStore } from '../../stores/index.js';
import { storeToRefs } from 'pinia';

const router = useRouter();
const TypeList = ref(['ALL', 'Dine-in', 'Takeout']);
const FoodList = ref([]);
const finished = ref(false);
const loading = ref(false);
const total = ref(0);
const page = ref({
    page_no: 1,
    page_size: 15,
});
const activeName = ref(0);

const { userName, shopuid } = storeToRefs(useUserStore());

const processGroupedData = (dataArray) => {
    const subOrders = [];

    dataArray.forEach(mainOrder => {
        const timeMap = {};
        
        if (mainOrder.product && Array.isArray(mainOrder.product)) {
            mainOrder.product.forEach(prod => {
                const timeKey = prod.orderdate;
                if (!timeMap[timeKey]) {
                    timeMap[timeKey] = {
                        ...mainOrder, 
                        orderdate: timeKey,
                        subProduct: [],
                        totalPrice: 0,
                        totalNum: 0,
                        // 确保 pack 被继承到子订单中 (1=堂食, 2=外卖)
                        pack: mainOrder.pack 
                    };
                }
                timeMap[timeKey].subProduct.push(prod);
                timeMap[timeKey].totalPrice += (Number(prod.cpprice || 0) * Number(prod.quantity || 0));
                timeMap[timeKey].totalNum += Number(prod.quantity || 0);
            });
        }

        Object.values(timeMap).forEach(item => {
            let is_finish = false;
            let avgValue = 0;
            if (!item.ambien && !item.food && !item.service && !item.entertaining && !item.comfort) {
                is_finish = true;
            } else {
                is_finish = false;
                avgValue = Math.floor(((item.ambien || 0) + (item.food || 0) + (item.service || 0) + (item.entertaining || 0) + (item.comfort || 0)) / 5);
            }
            
            subOrders.push({
                ...item,
                value: avgValue,
                is_finish: is_finish, 
                displayPrice: item.totalPrice.toFixed(2)
            });
        });
    });

    return subOrders;
};

function initData() {
    loading.value = true;
    api.OrderList({
        diners: userName.value,
        shopuid: shopuid.value,
        // 修改点：activeName 为 0 是 ALL, 为 1 是 Dine-in, 为 2 是 Takeout
        pack: activeName.value === 0 ? null : activeName.value,
        page: page.value.page_no,
        strip: page.value.page_size
    }).then(res => {
        loading.value = false;
        if (res.code == 1) {
            total.value = res.data.pagination.total;
            FoodList.value = processGroupedData(res.data.data);
            if (res.data.data.length < page.value.page_size) {
                finished.value = true;
            }
        }
    });
}

initData();

function getMoreData() {
    page.value.page_no++;
    api.OrderList({
        diners: userName.value,
        shopuid: shopuid.value,
        pack: activeName.value === 0 ? null : activeName.value,
        page: page.value.page_no,
        strip: page.value.page_size
    }).then(res => {
        loading.value = false;
        if (res.code == 1) {
            const newSubOrders = processGroupedData(res.data.data);
            FoodList.value = [...FoodList.value, ...newSubOrders];
            if (res.data.data.length < page.value.page_size || FoodList.value.length >= total.value) {
                finished.value = true;
            }
        }
    });
}

function onClickTab({ name }) {
    activeName.value = name;
    finished.value = false;
    page.value.page_no = 1;
    FoodList.value = [];
    initData();
}
</script>

<style lang="scss" scoped>
::v-deep .van-tabs__wrap {
    background: #FBFBFB;
    --van-tabs-nav-background: #FBFBFB;
}
.Order-page {
    display: flex;
    flex-direction: column;
    height: 100vh !important;
    background: #F3F5F9;
}
::v-deep .van-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    .van-tabs__content {
        flex: 1;
        overflow-y: auto;
    }
}
:deep(.van-tabs__line) {
    background-color: #444DFA !important;
    height: 0.07rem !important;
    border-radius: 0.12rem !important;
}
</style>