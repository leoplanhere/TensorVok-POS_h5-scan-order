<template>
    <div class="pay_page">
        <Tabber title="Payment Failed" />
        <div class="payment_result">
            <img src="../../assets/fail.png" alt="Failed" class="result-image" />
            <h2>Payment Failed!</h2>
        </div>
        <div class="footerIcon">
            <div class="btn" @click="goHome">
                Return to Home
            </div>
        </div>
    </div>
</template>

<script setup>
import Tabber from "../../components/Tabber.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
    router.back();
}

</script>

<style lang="scss" scoped>
.pay_page{
    background: #F3F5F9;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.footerIcon{
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;
    background: #fff;
    padding: 10px 30px;
    .btn{
        background: #444DFA;
        border-radius: 30px 30px 30px 30px;
        padding: 10px 0;
        width: 100%;
        font-weight: 400;
        font-size: 18px;
        color: #FFFFFF;
        text-align: center;
    }
}
.payment_result{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    img{
        width: 100px;
    }
    h2{
        font-weight: 400;
        font-size: 15px;
        margin-top: 40px;
    }
}
</style>