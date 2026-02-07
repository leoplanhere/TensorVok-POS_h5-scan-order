<template>
    <div class="order-box">
        <div class="box-header flexBox">
            <p>
                {{item.time}}
            </p>
            <p>
                {{item.status}}
            </p>
        </div>
        <div class="flexBox">
            <p>{{item.shopName}}</p>
            <van-icon name="arrow" />
        </div>
        <div class="flexBox">
            <p>A total of {{item.num}} orders</p>
            <p>Total:{{item.price}}</p>
        </div>
        <div class="rate" v-if="!!item.rate">
            <p v-show="item.rate==1">bad <img src="../../../assets/icons/rate1_sel.png" alt=""></p>
            <p v-show="item.rate==2">poor <img src="../../../assets/icons/rate2_sel.png" alt=""></p>
            <p v-show="item.rate==3">generally <img src="../../../assets/icons/rate3_sel.png" alt=""></p>
            <p v-show="item.rate==4">great <img src="../../../assets/icons/rate4_sel.png" alt=""></p>
            <p v-show="item.rate==5">good <img src="../../../assets/icons/rate5_sel.png" alt=""></p>
        </div>
        <div class="btn" v-else>
            Evaluation
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const OrderInfo=defineProps({
    item:{
        type:Object,
        default:{}
    }
})
</script>

<style lang="scss" scoped>

</style>