<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/index.js';
import { storeToRefs } from 'pinia';
import api from '../../common/index.js'
import { showLoadingToast, closeToast } from 'vant';

const userStore = useUserStore()
const { shopuid } = storeToRefs(userStore)
const router = useRouter()
const route = useRoute()

// 1. 响应式状态
const dishList = ref([])        // 当前下单时间点对应的菜品
const paymentLog = ref({})      // 该次下单匹配到的财务记录
const orderInfo = ref({})       // 基础信息
const loading = ref(true)

// 2. 解析路由参数
// 注意：此处的 data 必须包含 orderdate，它是我们识别子订单的关键
const data = JSON.parse(route.query.order || '{}')

// 3. 辅助函数
const formatMoney = (val) => {
    if (val === undefined || val === null || isNaN(val) || val === '') return "0.00";
    return Number(val).toFixed(2);
};

const formatFeeding = (feeding) => {
    if (!feeding) return '';
    try {
        const list = typeof feeding === 'string' ? JSON.parse(feeding) : feeding;
        if (!Array.isArray(list)) return feeding;
        return list.map(v => `${v.cpname} x${v.number}`).join(', ');
    } catch (e) {
        return feeding;
    }
}

// 小计：仅计算当前过滤后的子订单菜品总和
const subtotalPrice = computed(() => {
    return dishList.value.reduce((sum, item) => {
        return sum + (Number(item.price || 0) * Number(item.quantity || 0));
    }, 0);
});

// 4. 获取详情并进行精确匹配
const fetchDetail = () => {
    showLoadingToast({ message: 'Loading...', forbidClick: true });
    const queryShopId = data.shop_id || shopuid.value || localStorage.getItem('SHOPUID');

    api.getOrderDetail({
        shop_id: queryShopId,
        nubmer: data.number,
        id: data.id,
        paymentOrder: data.paymentOrder
    }).then(res => {
        closeToast();
        if (res.code == 1) {
            const allItems = res.data.data || [];
            
            // 【核心修复 A】：过滤菜品
            // 只显示下单时间 (orderdate) 与用户点击的子订单完全一致的菜品
            const filteredItems = allItems.filter(item => item.orderdate === data.orderdate);
            dishList.value = filteredItems;
            orderInfo.value = filteredItems[0] || {};

            // 【核心修复 B】：财务数据对账
            // 逻辑：在所有子项中寻找 paymentlog。
            // 规则：寻找 createtime (时间戳) 与 orderdate (字符串时间) 最接近的那一笔支付记录。
            const targetTime = new Date(data.orderdate).getTime() / 1000;
            let matchedLog = null;

            allItems.forEach(item => {
                if (item.paymentlog && Array.isArray(item.paymentlog)) {
                    item.paymentlog.forEach(log => {
                        // 如果支付记录的时间与下单时间误差在 120 秒内，视为该单的支付数据
                        if (Math.abs(log.createtime - targetTime) < 120) {
                            matchedLog = log;
                        }
                    });
                }
            });

            if (matchedLog) {
                paymentLog.value = matchedLog;
            } else {
                // 兜底：如果该次下单没产生独立支付记录（可能包含在后续的大单里）
                // 则财务数据设为 0， receivedmoney 暂显为菜品小计
                paymentLog.value = {
                    taxation: "0.00",
                    servicecharge: "0.00",
                    tips: "0.00",
                    receivedmoney: subtotalPrice.value,
                    pay_type: "Included"
                };
            }
            loading.value = false;
        }
    }).catch(err => {
        closeToast();
        console.error('Fetch detail error:', err);
    });
}

const goBack = () => router.go(-1)

/**
 * 5. 漂亮的发票打印逻辑
 */
const printInvoice = () => {
    const info = orderInfo.value;
    const finance = paymentLog.value;
    
    let itemsHtml = '';
    dishList.value.forEach(item => {
        itemsHtml += `
            <tr style="border-bottom: 1px dashed #eee;">
                <td style="padding: 8px 0; font-size: 13px;">
                    ${item.cpname}<br/>
                    <small style="color:#666; font-size: 11px;">${item.feedingjson ? '+ ' + formatFeeding(item.feedingjson) : ''}</small>
                </td>
                <td style="text-align: center; font-size: 13px;">x${item.quantity}</td>
                <td style="text-align: right; font-size: 13px;">$${formatMoney(item.price)}</td>
            </tr>
        `;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Receipt_${data.number}</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; width: 320px; margin: 0 auto; padding: 10px; color: #000; }
                    .center { text-align: center; }
                    .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
                    .info-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th { border-bottom: 1px solid #000; text-align: left; font-size: 13px; }
                    .summary-box { border-top: 2px solid #000; padding-top: 10px; }
                    .summary-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 5px; }
                    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px; }
                    .footer { margin-top: 30px; font-size: 11px; border-top: 1px solid #eee; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header center">
                    <h2 style="margin: 0;">${info.shopname || 'TAX INVOICE'}</h2>
                    <p style="font-size: 12px; margin: 5px 0;">Official Receipt</p>
                </div>
                <div class="info-section">
                    <div class="info-row"><span>Order ID:</span><span>#${data.number}</span></div>
                    <div class="info-row"><span>Date:</span><span>${data.orderdate || ''}</span></div>
                    <div class="info-row"><span>Table:</span><span>${info.qycode || ''}${info.czname || 'Walk-in'}</span></div>
                    <div class="info-row"><span>Payment:</span><span>${finance.pay_type || 'Paid'}</span></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 60%">Item</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                <div class="summary-box">
                    <div class="summary-row"><span>Subtotal</span><span>$${formatMoney(subtotalPrice.value)}</span></div>
                    <div class="summary-row"><span>Tax</span><span>$${formatMoney(finance.taxation)}</span></div>
                    <div class="summary-row"><span>Service Fee</span><span>$${formatMoney(finance.servicecharge)}</span></div>
                    <div class="summary-row"><span>Tips</span><span>$${formatMoney(finance.tips)}</span></div>
                    <div class="total-row"><span>TOTAL PAID</span><span>$${formatMoney(finance.receivedmoney)}</span></div>
                </div>
                <div class="footer center">
                    <p>Thank you for your visit!</p>
                    <p>Please come again.</p>
                </div>
            </body>
        </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

onMounted(fetchDetail);
</script>

<template>
    <div class="layout" v-if="!loading">
        <header class="app-navbar">
            <div class="flex">
                <button class="navbar-back" @click="goBack"><van-icon name="arrow-left" size="20"/></button>
                <div class="navbar-title">Order Status</div>
            </div>
        </header>

        <div class="orderdel">
            <div class="hds">
                <h3>Order ID: #{{ data.number }}</h3>
                <h4>Time: {{ data.orderdate }}</h4>
                <dl>
                    <dd>Order Type: <span> {{ orderInfo.pack == 1 ? 'Dine-in' : 'Takeout' }}</span></dd>
                    <dd>Table Name: <span>Table {{ orderInfo.qycode || '' }}{{ orderInfo.czname || '' }}</span></dd>
                </dl>
            </div>

            <div class="thpic thpic2">
                <h3>Ordered Items:</h3>
                <ul>
                    <li v-for="(item, index) in dishList" :key="index">
                        <div class="icon"><img :src="item.coverimage" ></div>
                        <div class="text">
                            <div class="flex">
                                <h4><img src="../../assets/pic/qw23.png" >{{item.cpname}} </h4>
                                <i>$ {{ formatMoney(item.price) }}</i>
                            </div>
                            <div class="cart-addons-text" v-if="item.feedingjson" style="font-size: 11px; color: #888; margin: 2px 0;">
                                + {{ formatFeeding(item.feedingjson) }}
                            </div>
                            <div class="flex">
                                <h5 style="color:#999">{{ item.remarks }}</h5>
                                <span>x{{ item.quantity }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="box ulbox orderbox">
                <h3>Summary:</h3>
                <ul>
                    <li><h5>Subtotal:</h5><em>$ {{ formatMoney(subtotalPrice) }}</em></li>
                    <li><h5>Tax:</h5><em>$ {{ formatMoney(paymentLog.taxation) }}</em></li>
                    <li><h5>Service Fee:</h5><em>$ {{ formatMoney(paymentLog.servicecharge) }}</em></li>
                    <li><h5>Tip:</h5><em>$ {{ formatMoney(paymentLog.tips) }}</em></li>
                    
                    <li style="height:1rem; border-top: 1px solid #f0f0f0; margin-top: 10px; padding-top: 15px !important;">
                        <h5 style="font-weight: bold; font-size: 15px;">Total Paid:</h5>
                        <div style="text-align: right;">
                            <h6 style="color: #444DFA; font-size: 20px; font-weight: bold;">$ {{ formatMoney(paymentLog.receivedmoney) }}</h6>
                            <span style="font-size: 12px; color: #999;">via {{ paymentLog.pay_type || 'Paid' }}</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="fbtns">
                <a href="javascript:;" class="b1" @click="goBack">Back</a>
                <a href="javascript:;" class="b1 on" @click="printInvoice">Print Invoice</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.orderdel { padding-bottom: 50px; }
.hds { padding: 20px; background: #fff; margin-bottom: 10px; }
.hds h3 { font-size: 18px; font-weight: bold; }
.hds dl { margin-top: 15px; border-top: 1px solid #f5f5f5; padding-top: 15px; }
.hds dd { margin-bottom: 8px; font-size: 14px; color: #666; }
.hds dd span { color: #333; float: right; font-weight: 500; }

.orderbox ul li { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
.orderbox h5 { color: #666; font-weight: normal; }
.orderbox em { font-style: normal; color: #333; }
.total-line { border-top: 1px solid #eee; margin-top: 10px; padding-top: 15px !important; align-items: center; }

.fbtns { position: fixed; bottom: 0; left: 0; right: 0; display: flex; padding: 10px 20px; background: #fff; border-top: 1px solid #eee; gap: 15px; }
.b1 { flex: 1; height: 44px; line-height: 44px; text-align: center; border: 1px solid #eee; border-radius: 22px; color: #666; font-size: 14px; }
.b1.on { background: #444DFA; color: #fff; border-color: #444DFA; font-weight: bold; }
</style>

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

.thpic li {
    background:#FFFFFF;
    box-shadow:0rem 0.05rem 0.08rem 0rem rgba(104,120,186,0.18);
    border-radius:0.3rem;
    border:1px solid #FFFFFF;
    display:flex;
    justify-content:space-between;
    padding:0.12rem;
    position:relative;
    margin-bottom: 0.2rem;
}

.thpic .icon {
    width:0.98rem;
    height:0.98rem;
    border-radius:0.2rem;
    overflow:hidden;
}
.thpic .icon img {
    width:100%;
    height:100%;
    display:block;
    object-fit:cover;
}
.thpic .text {
    flex:1;
    padding-left:0.16rem;
    padding-right:0.2rem;
    box-sizing:border-box;
}
.thpic .text .flex {
    display:flex;
    justify-content:space-between;
    align-items:center;
}
.thpic .text h4 {
    font-weight:400;
    font-size:0.26rem;
    color:#111111;
    width:calc(100% - 1rem);
    word-break:keep-all;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    line-height:2;
}
.thpic .text i {
    font-weight:400;
    font-size:0.28rem;
    color:#111111;
}
.thpic .text h5 {
    font-weight:400;
    font-size:0.2rem;
    color:#999999;
    line-height:1.6;
}
.thpic .text span {
    font-weight:400;
    font-size:0.24rem;
    color:#999999;
}

.ulbox li {
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:0 0.15rem;
    height:0.6rem;
}
.ulbox li h5 {
    font-weight:400;
    font-size:0.26rem;
    color:#060606;
}
.ulbox li i {
    font-weight:400;
    font-size:0.3rem;
    color:#E63700;
}
.ulbox li em {
    font-weight:400;
    font-size:0.22rem;
    color:#111111;
}

.orderdel {
    background:#F3F5F9;
    height: calc(100vh - 48px);
    overflow-y: scroll !important;
    box-sizing: border-box;
    padding-bottom:1.6rem;
}

.orderdel .fbtns {
    display:flex;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    left:0;
    right:0;
    bottom:0.3rem;
    z-index:199;
    width:6.7rem;
    margin:0 auto;
}
.orderdel .fbtns .b1 {
    width:1.73rem;
    line-height:0.89rem;
    background:#FFFFFF;
    border-radius:0.3rem;
    border:1px solid rgba(51,51,51,0.5);
    font-weight:400;
    font-size:0.3rem;
    color:#060606;
    text-align:center;
    display:block;
}
.orderdel .fbtns .b1.on {
    width:4.76rem;
    line-height:0.89rem;
    background:#444DFA;
    border-radius:0.3rem;
    font-weight:400;
    font-size:0.3rem;
    border:none;
    color:#FFFFFF;
    text-align:center;
    display:block;
}

.orderdel .hds {
    background:#FBFBFB;
    
}
.orderdel .hds h3 {
    font-weight:400;
    font-size:0.3rem;
    color:#111111;
    line-height:1.6;
}
.orderdel .hds h4 {
    font-weight:400;
    font-size:0.24rem;
    color:#999999;
    line-height:1.6;
}
.orderdel .hds dd {
    font-weight:400;
    font-size:0.24rem;
    color:#999999;
    line-height:1.6;
}
.orderdel .hds dd span {
    font-size:0.3rem;
    color:#111111;
}
.orderdel .bds {
    padding:0.48rem 0 0.38rem;
    background:#fff;
    margin:0.2rem 0 0.3rem;
}
.orderdel .bds ul {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin:0 0.2rem 0 0.3rem;
}
.orderdel .bds li {
    position:relative;
    flex: 1;
    text-align: center;
}
.orderdel .bds li:before {
    content:"";
    position:absolute;
    left:-50%;
    top:0.13rem;
    z-index:1;
    width:100%;
    border:0.02rem solid #BDBDBD;
}
.orderdel .bds li:first-child::before {
    display:none;
}
.orderdel .bds li.on:before{
    border-color: #444DFA;
}
.orderdel .bds li .icon {
    width:0.34rem;
    margin:0 auto;
    position:relative;
    z-index:2;
}
.orderdel .bds li .ic2 {
    display:none;
}
.orderdel .bds li.on .ic1 {
    display:none;
}
.orderdel .bds li.on .ic2 {
    display:block;
}
.orderdel .bds li p {
    font-weight:400;
    font-size:0.2rem;
    color:#111111;
    line-height:1.2;
    margin-top:0.05rem;
}
.orderdel .dizhi {
    margin:0 0.2rem;
    background:#fff;
    border-radius:0.3rem;
    padding:0.4rem 0.36rem;
}

.wttps {
    text-align:right;
    padding-right:0.3rem;
    background:#fff;
}
.wttps h2 {
    font-weight:400;
    font-size:0.2rem;
    color:#999999;
}
.wttps h2 span {
    font-weight:bold;
    font-size:0.36rem;
    color:#EB362A;
    margin-left:0.2rem;
}

.thpic2 {
    margin:0.27rem 0.2rem 0;
    background:#FFFFFF;
    border-radius:0.3rem;
    padding:0.2rem;
}

.orderbox h3, .thpic2 h3 {
    font-weight:400;
    font-size:0.3rem;
    color:#111111;
    line-height:1.8;
}
.orderbox {
    margin:0.27rem 0.2rem 0;
    background:#FFFFFF;
    border-radius:0.3rem;
    padding:0.2rem;
}
</style>