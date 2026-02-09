<template>
    <div class="layout">
        <header class="app-navbar">
            <div class="flex">
                <button class="navbar-back" @click="goBack">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="navbar-title">Checkout</div>
            </div>
            <div class="wttps">
                <h2>Table<i>{{ tableOpenInfo.tccode || '识别中' }}{{ tableOpenInfo.number || '' }}</i></h2>
            </div>
        </header>
        
        <div class="checkout">
            <div class="thpic" 
                @touchstart="handleTouchStart" 
                @touchend="handleTouchEnd"
                :class="{ expanded: isExpanded }">
                <ul>
                    <li v-for="(item, index) in goods" :key="index">
                        <div class="icon">
                            <img :src="item.coverimage">
                        </div>
                        <div class="text">
                            <div class="flex">
                                <h4>{{ item.cpname }}</h4>
                                <i>$ {{ getItemTotalPrice(item) }}</i>
                            </div>
                            <div class="cart-addons-text" v-if="hasAddons(item)">
                                + {{ formatAddons(item) }}
                            </div>
                            <div class="flex">
                                <h5>{{ item.remarks }}</h5>
                                <span>x{{ item.value }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="itemflex">
                <h4>{{ goods.reduce((total, item) => total + item.value, 0) }} Items</h4>
                <h5>Sub Total:$<i>{{ price }}</i></h5>
            </div>
            
            <div class="box box1">
                <h4>Table Instructions</h4>
                <textarea class="text" v-model="ordernone" rows="" cols="" placeholder="Add Notes (Extro Mayo, Cheese, Etc.)"></textarea>
            </div>
            
            <div class="pickitem">
                <ul>
                    <li><input type="radio" name="radio" id="ra2" value="Dinein" v-model="deliveryType" /><label for="ra2">Dine-in</label></li>
                    <li><input type="radio" name="radio" id="ra1" value="pickup" v-model="deliveryType" /><label for="ra1">Pickup</label></li>
                </ul>
            </div>
            
            <div class="box box2">
                <h4>Tip</h4>
                <div class="flexnum">
                    <ul>
                        <li v-for="(tip, index) in tipOptions" :key="index" :class="{ on: selectedTip === index }" @click="selectTip(index)">
                            {{ tip }}
                        </li>
                    </ul>
                    <input type="text" class="txt" v-model="customTip" placeholder="Type yours" @input="onCustomTipInput" />
                </div>
            </div>
            
            <div class="box box3">
                <h4>Scheduled Order</h4>
                <div class="make" @click="openTimeSelector">
                    <img src="../../assets/pic/qw15.png" >
                    <span class="selected-time-text">
                        {{ selectedTime ? `${selectedTime} minute${selectedTime > 1 ? 's' : ''}` : 'Select minutes' }}
                    </span>
                </div>
            </div>
            
            <van-popup v-model:show="timePopupShow" position="bottom" round class="time-select-popup">
                <van-picker
                    :columns="timeColumns"
                    @confirm="onTimeConfirm"
                    @cancel="timePopupShow = false"
                    title="Select minutes"
                />
            </van-popup>
            
            <div class="box ulbox">
                <ul>
                    <li><h5>Course:</h5><em>$ {{ price }}</em></li>
                    <li><h5>Tax ({{ feeConfig.taxRate }}%):</h5><em>$ {{ calculatedTax }}</em></li>
                    <li><h5>Service Fee ({{ feeConfig.serviceRate }}%):</h5><em>$ {{ calculatedServiceFee }}</em></li>
                    <li><h5>Tip:</h5><em>$ {{ calculateTip() }}</em></li>
                    <li><h5>Total: </h5><h6>$ {{ finalTotalPrice }}</h6></li>
                </ul>
            </div>
            
            <div class="itempay">
                 <ul>
                    <li :class="{ on: selectedPayMethod === 'creditCard' }" @click="selectPayMethod('creditCard')">
                        <i></i>
                        <div class="icon"><img src="../../assets/pic/qw17.png" ></div>
                        <h6>NETS</h6>
                    </li>
                    <li :class="{ on: selectedPayMethod === 'yeahPay' }" @click="selectPayMethod('yeahPay')">
                        <i></i>
                        <div class="icon"><img src="../../assets/pic/yeah.png" ></div>
                        <h6>YeahPay</h6>
                    </li>
                </ul>
            </div>
            
            <div class="itemft">
                <h6>Total:<i>$ {{ finalTotalPrice }}</i></h6>
                <div class="btn" @click="goPay">Pay</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTableStore, useUserStore, useCartStore } from '../../stores/index.js'
import { ref, nextTick, onUnmounted, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { showLoadingToast, closeToast, showSuccessToast, showFailToast, showToast } from 'vant'
import api from '../../common/index.js'

const router = useRouter()
const route = useRoute()
const tableStore = useTableStore()
const userStore = useUserStore() 
const cartStore = useCartStore() 

const { currentTable, tableOpenInfo } = storeToRefs(tableStore)
const { userInfo, userName } = storeToRefs(userStore)
const { bindTableInfo } = tableStore

const loading = ref(false)
const isExpanded = ref(false)
const ordernone = ref('') // 文本域备注
const deliveryType = ref('Dinein')
const selectedPayMethod = ref('creditCard')
const timer = ref(null)
const timePopupShow = ref(false)
const selectedTime = ref('')
const timeColumns = [
    { text: '1 minute', value: '1' }, { text: '5 minutes', value: '5' },
    { text: '15 minutes', value: '15' }, { text: '30 minutes', value: '30' }
]

let goods = ref([])
try {
    goods.value = JSON.parse(route.query.goods || '[]')
} catch (e) {
    console.error('解析购物车商品失败:', e)
}
const price = parseFloat(route.query.price || 0)
const shopIdFromQuery = route.query.shop_id || localStorage.getItem('SHOPUID')

const feeConfig = ref({ taxRate: 0, serviceRate: 0 })
const tipOptions = ref(['$ 5', '$ 10', '$ 15', '$ 20'])
const selectedTip = ref(-1)
const customTip = ref('')

const calculatedTax = computed(() => ((price * feeConfig.value.taxRate) / 100).toFixed(2))
const calculatedServiceFee = computed(() => ((price * feeConfig.value.serviceRate) / 100).toFixed(2))

const calculateTip = () => {
    if (customTip.value && !isNaN(customTip.value)) return parseFloat(customTip.value).toFixed(2)
    if (selectedTip.value === -1) return "0.00"
    return parseFloat(tipOptions.value[selectedTip.value].replace('$ ', '')).toFixed(2)
}

const finalTotalPrice = computed(() => {
    const total = price + parseFloat(calculatedTax.value) + parseFloat(calculatedServiceFee.value) + parseFloat(calculateTip())
    return total.toFixed(2)
})

const getItemTotalPrice = (item) => {
    const basePrice = Number(item.price || 0);
    let addonsSum = 0;
    if (item.feeding && item.feeding.length > 0) {
        addonsSum = item.feeding.reduce((sum, v) => sum + (Number(v.price || 0) * Number(v.number || 0)), 0);
    }
    return (basePrice + addonsSum).toFixed(2);
};

const hasAddons = (item) => item.feeding && item.feeding.length > 0;

const formatAddons = (item) => {
    if (!item.feeding) return '';
    return item.feeding.map(v => `${v.cpname} x${v.number}`).join(', ');
};

const initCheckoutData = async () => {
    const shop_id = shopIdFromQuery
    const tab_id = route.query.table_manage_id || route.query.tab_id || tableOpenInfo.value.tableId
    try {
        const res = await api.scanOpenTable({ shop_id, table_manage_id: tab_id });
        if (res.code === 1) {
            bindTableInfo(res.data); 
        }
    } catch (error) {
        console.error('初始化桌位数据异常:', error);
    }
};

/**
 * --- 核心逻辑优化：支付成功后的处理流程 ---
 */
const handleFinalCheckoutProcess = async (paymentOrder) => {
    const info = currentTable.value;
    
    if (!info || !info.table_classify_id) {
        showFailToast('Table session error');
        return;
    }

    try {
        showLoadingToast({ message: 'Ordering...', forbidClick: true, duration: 0 });

        // 1. 处理 pack 参数 (1: Dinein, 2: Pickup)
        const packParam = deliveryType.value === 'Dinein' ? 1 : 2;

        // 2. 处理等叫状态与备注组合
        // 逻辑：如果选择了预约时间，状态为0(等叫)，且备注追加"等叫X分钟"
        const dengjiaoParam = selectedTime.value ? 0 : 1;
        let finalOrderNone = ordernone.value;
        if (selectedTime.value) {
            const timeNote = ` [等叫${selectedTime.value}分钟]`;
            finalOrderNone = finalOrderNone ? finalOrderNone + timeNote : `等叫${selectedTime.value}分钟`;
        }

        const orderList = goods.value.map(item => ({
            id: item.id || item.product_id,
            delay_user: userName.value || "Guest",
            value: item.value, 
            name: item.cpname,
            img: item.coverimage,
            price: item.price.toString(),
            gaugejson: item.gaugejson,
            BgColor: "#00FF26",
            dining_out: 1,
            hot_state: "0",
            delay_state: 2,
            delay_time: "0",
            remarks: item.remarks || "",
            nonejson: "",
            table_stool_id: "0",
            urgent: "1",
            online_type: 1,
            weighing_price: 0,
            weighing_weight: 0
        }));

        // 3. 构造下单接口参数 (注入新增的三个字段)
        const orderParams = {
            dpid: shopIdFromQuery,
            table_classify_id: info.table_classify_id,
            table_manage_id: info.table_manage_id,
            staff_basics_id: info.staff_basics_id,
            staff_basics_ids: info.staff_basics_ids,
            orderjson: JSON.stringify(orderList),
            price: price.toString(),
            reserve_list_id: info.reserve_list_id || info.id,
            // --- 新增参数 ---
            pack: packParam,
            dengjiaostatus: dengjiaoParam,
            ordernone: finalOrderNone
        };

        const orderRes = await api.newOrderAdd(orderParams);

        if (orderRes.code === 1) {
            const payTypeName = selectedPayMethod.value === 'yeahPay' ? 'YeahPay' : 'NETSONLINE';
            const checkoutParams = {
                "pay_type": payTypeName,
                "paymentOrder": paymentOrder,
                "placeanorder": "H5Scan",
                "order_status": 2,
                "tips": calculateTip(),
                "servicecharge": calculatedServiceFee.value,
                "taxation": calculatedTax.value,
                "receivedmoney": finalTotalPrice.value,
                "assemble": finalTotalPrice.value,
                "shop_id": orderParams.dpid,
                "reserve_list_id": orderParams.reserve_list_id,
                "type": 1
            };
            
            const checkoutRes = await api.reserveCheckout(checkoutParams);
            
            if (checkoutRes.code === 1) {
                cartStore.clearCart(); 
                closeToast();
                showSuccessToast('Order Successful');
                setTimeout(() => router.push('/order_success'), 1000);
            } else {
                showFailToast('Record Error: ' + checkoutRes.msg);
            }
        } else {
            showFailToast('Order Error: ' + orderRes.msg);
        }
    } catch (e) {
        console.error('流程中断:', e);
        showFailToast('Process Failed');
    }
}

const submitNetsPaymentForm = (data) => {
    // 创建临时表单并立即提交（在同步上下文中，避免Safari阻止）
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = data.action;
    form.target = '_blank';
    form.style.display = 'none';

    const fields = {
        apiKey: data.apiKey,
        payload: data.payload,
        hmac: data.hmac
    };

    for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};

const goPay = async () => {
    if (selectedPayMethod.value === 'yeahPay') {
        // 此处你可以接入 YeahPay 的逻辑，目前先模拟成功
        // 或者调用对应的 api.yeahPayOrderLaunch(...)
        showToast('YeahPay Processing...');
        // 模拟支付成功并执行下单
        await handleFinalCheckoutProcess("YEAH_" + Date.now());
        return;
    }

    // 关键：在click事件的同步处理器中立即打开一个新窗口
    // Safari只认可这样在用户交互直接上下文中打开的窗口
    const paymentWindow = window.open('about:blank', '_blank');
    
    if (!paymentWindow) {
        showFailToast('Please enable pop-ups for this site');
        return;
    }

    try {
        loading.value = true;
        const response = await api.netsOrderLaunch({
            amount: finalTotalPrice.value,
            payment_mode: 'WEB',
            scene: 'h5',
        });
        
        if (response.code === 1) {
            // 在已打开的窗口中动态生成表单并自动提交
            const apiKey = response.data.apiKey.replace(/"/g, '&quot;');
            const payload = response.data.payload.replace(/"/g, '&quot;');
            const hmac = response.data.hmac.replace(/"/g, '&quot;');
            const action = response.data.action;
            
            // 构建HTML字符串（转义关闭标签避免Vue解析器问题）
            let html = '<!DOCTYPE html><html><head><title>Processing Payment...</title><' + '/head><body>' +
                '<form id="paymentForm" action="' + action + '" method="POST">' +
                '<input type="hidden" name="apiKey" value="' + apiKey + '" />' +
                '<input type="hidden" name="payload" value="' + payload + '" />' +
                '<input type="hidden" name="hmac" value="' + hmac + '" />' +
                '<' + '/form>' +
                '<p style="text-align:center; color:#666; font-family:sans-serif; margin-top:50px;">Redirecting to payment gateway...</p>' +
                '<' + 'script>document.getElementById("paymentForm").submit();<' + '/script>' +
                '<' + '/body><' + '/html>';
            
            paymentWindow.document.write(html);
            paymentWindow.document.close();

            showLoadingToast({ message: 'Waiting for payment...', duration: 0 });

            timer.value = setInterval(async () => {
                try {
                    const res = await api.check_statusResult({ order_sn: response.data.merchantTxnRef });
                    if (res.code === 1 && res.data.status === 'SUCCESS') {
                        clearInterval(timer.value);
                        closeToast();
                        await handleFinalCheckoutProcess(response.data.merchantTxnRef);
                        if (paymentWindow) {
                            try { paymentWindow.close(); } catch (e) { }
                        }
                    }
                } catch (e) {
                    console.error('轮询异常', e);
                }
            }, 5000);
        }
    } catch (e) {
        console.error('支付调起失败', e);
        showFailToast('Payment failed, please try again');
        if (paymentWindow) {
            try { paymentWindow.close(); } catch (e) { }
        }
    } finally {
        loading.value = false;
    }
}

const goBack = () => window.history.back();
const selectTip = (index) => { selectedTip.value = (selectedTip.value === index ? -1 : index); customTip.value = ''; }
const onCustomTipInput = () => { if (customTip.value !== '') selectedTip.value = -1 }
const selectPayMethod = (method) => { selectedPayMethod.value = method }
const openTimeSelector = () => { timePopupShow.value = true }
const onTimeConfirm = ({ selectedOptions }) => {
    if (selectedOptions?.[0]) selectedTime.value = selectedOptions[0].value;
    timePopupShow.value = false;
};

const touchStartY = ref(0);
const handleTouchStart = (e) => { touchStartY.value = e.touches[0].clientY };
const handleTouchEnd = (e) => {
    const diffY = e.changedTouches[0].clientY - touchStartY.value;
    if (diffY > 30) isExpanded.value = true;
    else if (diffY < -30) isExpanded.value = false;
};

onMounted(() => {
    if (goods.value.length === 0) {
        showToast('Cart is empty');
        router.replace('/home/index');
        return;
    }
    initCheckoutData();
    api.getOperateDetails(shopIdFromQuery).then(res => {
        if (res?.code === 1 && res.data?.[0]) {
            feeConfig.value = {
                taxRate: parseFloat(res.data[0].taxation || 0),
                serviceRate: parseFloat(res.data[0].servicecharge || 0)
            };
        }
    });
});

onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
});
</script>



<style scoped>


.flexnum ul li.on {
    background: #EB362A; /* 替换为你主题色 */
    color: #fff;
}

.cart-addons-text {
    font-size: 10px;
    color: #999;
    line-height: 1.2;
    word-break: break-all;
}

/* 确保列表项高度自适应 */
.thpic ul li {
    height: auto !important;
    padding: 10px;
    align-items: center;
}

.thpic .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}


.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  position: absolute;
  top:0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.loading-status {
  color: #666;
}
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

.checkout {
	height: calc(100vh - 48px);
	    min-height: calc(100vh - 48px);
	    overflow-y: scroll !important;
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    box-sizing: border-box;
	background:#F3F5F9;
	overflow:hidden;
	padding:0.2rem;
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
}
.thpic li:nth-child(1) {
	z-index:100;
}
.thpic li:nth-child(2) {
	z-index:99;
}
.thpic li:nth-child(3) {
	z-index:98;
}
.thpic li:nth-child(n+2) {
	margin-top:-1.12rem;
}
.thpic li:nth-child(n+4) {
	display:none;
}
.thpic .icon {
	width:1.2rem;
	height:1.2rem;
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
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
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
	font-size:0.3rem;
	color:#999999;
}
.checkout .itemflex {
	display:flex;
	justify-content:space-between;
	align-items:center;
	border-bottom:0.01rem solid rgba(221,221,221,0.9);
	height:1rem;
	padding:0 0.3rem;
	padding-top:0.1rem;
}
.checkout .itemflex h4 {
	font-weight:400;
	font-size:0.24rem;
	color:#111111;
}
.checkout .itemflex h5 {
	font-weight:400;
	font-size:0.24rem;
	color:#111111;
}
.checkout .itemflex h5 i {
	font-weight:bold;
	font-size:0.36rem;
	color:#111111;
	margin:0 0.15rem 0 0.06rem;
}
.checkout .itemflex h5 span {
	font-weight:400;
	font-size:0.24rem;
	color:#EB362A;
}
.checkout .box {
	margin-top:0.2rem;
	background:#FFFFFF;
	border-radius:0.3rem;
	border:1px solid #FFFFFF;
	padding:0.2rem;
}
.checkout .box h4 {
	font-weight:bold;
	font-size:0.22rem;
	color:#111111;
	line-height:1.6;
	margin-bottom:0.15rem;
}
.checkout .box1 h6 i {
	display:inline-block;
	margin:0 0.1rem 0.1rem 0;
	padding:0 0.25rem;
	border:1px solid #333;
	border-radius:0.4rem;
	line-height:0.43rem;
	font-weight:400;
	font-size:0.2rem;
	color:#111111;
	cursor: pointer;
}
.checkout .box1 h6 i.on{
	border-color: #0E57E2;
	    background: #DCEAFF;
	    color: #0E57E2;
}
.checkout .box1 .text {
	height:0.96rem;
	background:#F3F5F9;
	border-radius:0.2rem;
	border:1px solid #DDDDDD;
	width:100%;
	padding:0.2rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	font-weight:400;
	font-size:0.26rem;
	color:#BDBDBD;
	margin-top:0.1rem;
	resize:none;
}
.checkout .box2 .flexnum {
	display:flex;
	justify-content:space-between;
	flex-wrap:wrap;
}
.checkout .box2 .flexnum ul {
	display:flex;
	flex:1;
	flex-wrap:wrap;
}
.checkout .box2 .flexnum li {
	padding:0 0.2rem;
	margin-right:0.1rem;
	margin-bottom:0.1rem;
	font-weight:400;
	font-size:0.22rem;
	color:#111111;
	line-height:0.6rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	background:#F3F5F9;
	border-radius:0.12rem;
	border:1px solid #F3F5F9;
	cursor: pointer;
}
.checkout .box2 .flexnum li.on {
	border-color:#0E57E2;
	background:#DCEAFF;
	color:#0E57E2;
}
.checkout .box2 .txt {
	background:#F3F5F9;
	border-radius:0.2rem;
	border:1px solid #DDDDDD;
	height:0.6rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	font-weight:400;
	font-size:0.26rem;
	color:#BDBDBD;
	padding:0 0.2rem;
	width:2.3rem;
}
.checkout .box3 .make {
	display:flex;
	align-items:center;
	background:url(../../assets/pic/qw1.png) no-repeat right center/0.12rem auto;
	font-weight:400;
	font-size:0.3rem;
	color:#111111;
	line-height:1.7;
	padding-left:0.12rem;
	padding-right:0.34rem;
	word-break:keep-all;
	white-space:nowrap;
	overflow:hidden;
	text-overflow:ellipsis;
	cursor: pointer;
	margin-bottom: 0.2rem;
}
.checkout .box3 .make img {
	display:block;
	width:0.37rem;
	margin-right:0.1rem;
}
.checkout .box3.wpad {
	padding-top:0.4rem;
	padding-bottom:0.4rem;
}

/* 选中时间文本样式 */
.selected-time-text {
    flex: 1;
    font-weight: 400;
    font-size: 0.3rem;
    color: #111111;
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
.ulbox li span {
	font-weight:400;
	font-size:0.26rem;
	color:#444DFA;
	margin-left:0.08rem;
}
.ulbox li em {
	font-weight:400;
	font-size:0.22rem;
	color:#111111;
}
.ulbox li h6 {
	font-weight:bold;
	font-size:0.29rem;
	color:#111111;
}
.ulbox .uar li {
	background:url(../../assets/pic/qw1.png) no-repeat right center/0.12rem auto;
	padding-right:0.34rem;
	height:0.8rem;
}

.itempay ul {
	overflow-x:auto;
	white-space:nowrap;
	margin:0.45rem 0 0.5rem;
}
.itempay li {
	background:#FFFFFF;
	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
	border:1px solid #FFFFFF;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	margin-right:0.16rem;
	display:inline-block;
	position:relative;
	width:2.3rem;
}
.itempay li i {
	display:block;
	position:absolute;
	left:0.1rem;
	top:0.1rem;
	width:0.39rem;
	height:0.39rem;
	background:url(../../assets/pic/qw12-1.png) no-repeat center/contain;
}
.itempay li.on i {
	background:url(../../assets/pic/qw12.png) no-repeat center/contain;
}
.itempay li .icon {
	height:1rem;
}
.itempay li .icon img {
	height:100%;
	object-fit:contain;
	display:block;
	margin:0 auto;
}
.itempay li h6 {
	font-weight:400;
	font-size:0.26rem;
	color:#111111;
	text-align:center;
	text-transform:capitalize;
}
.itemft {
	position:fixed;
	left:0.35rem;
	right:0.35rem;
	bottom:0.4rem;
	z-index:99;
	background:#525252;
	box-shadow:0rem 0.26rem 0.17rem 0rem #CED1D5;
	border-radius:0.6rem;
	display:flex;
	justify-content:space-between;
	align-items:center;
	height:0.9rem;
}
.itemft h6 {
	flex:1;
	margin-right:0.15rem;
	font-weight:400;
	font-size:0.24rem;
	color:#FFFFFF;
	padding-left:0.4rem;
}
.itemft h6 i {
	font-weight:bold;
	font-size:0.36rem;
	color:#FFFFFF;
	margin-left:0.05rem;
}
.itemft h6 span {
	font-weight:400;
	font-size:0.24rem;
	color:#E63700;
	margin-left:0.2rem;
}
.itemft .btn {
	width:2.67rem;
	line-height:0.9rem;
	background:#444DFA;
	border-radius:0.6rem;
	font-weight:400;
	font-size:0.36rem;
	color:#FFFFFF;
	text-align:center;
	cursor: pointer;
}
.checkout {
	padding-bottom:1.3rem;
}

.wttps {
	text-align:right;
	padding-right:0.3rem;
}
.wttps h2 {
	font-weight:400;
	font-size:0.2rem;
	color:#999999;
	line-height:1.6;
}
.wttps h2 span {
	font-weight:bold;
	font-size:0.36rem;
	color:#EB362A;
	display:inline-block;
	margin-left:0.2rem;
}
.wttps h2 i{
	font-weight: bold;
	font-size: 0.36rem;
	color: #111111;
	display:inline-block;
	margin-left:0.2rem;
}

.pickitem ul {
	display:flex;
	margin-top:0.3rem;
	flex-wrap:wrap;
	justify-content:space-between;
}
.pickitem li {
	width:calc((100% - 0.22rem)/2);
	background:#FFFFFF;
	border-radius:0.3rem;
	height:0.9rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	padding:0 0.3rem;
}
.pickitem li label {
	padding-left:1.05rem;
	background:url(../../assets/pic/qw12-1.png) no-repeat left center/0.39rem auto;
	line-height:0.9rem;
	display:block;
	font-weight:400;
	font-size:0.3rem;
	color:#111111;
}
.pickitem li input:checked + label {
	background:url(../../assets/pic/qw12.png) no-repeat left center/0.39rem auto;
}
.pickitem li input {
	display:none;
}


.thpic {
    position: relative;
    transition: all 0.3s ease;
}

/* 展开状态样式 */
.thpic.expanded li:nth-child(n+2) {
    margin-top: 0.2rem; /* 展开后取消重叠 */
}
.thpic.expanded li:nth-child(n+4) {
    display: flex; /* 展开后显示第四个商品 */
}

/* 收起状态保持原有样式 */
.thpic li:nth-child(n+2) {
    transition: margin-top 0.3s ease;
}

/* 展开/收起箭头样式 */
.expand-arrow {
    position: absolute;
    bottom: 0.1rem;
    right: 0.2rem;
    background: #fff;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0.1rem rgba(0,0,0,0.1);
    cursor: pointer;
    z-index: 101;
}

.expand-arrow svg {
    transition: transform 0.3s ease;
}

.expand-arrow svg.rotated {
    transform: rotate(180deg);
}

/* 优化移动端触摸体验 */
.thpic {
    touch-action: pan-y;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}
.checkout .box3.wpad {
	padding-top:0.4rem;
	padding-bottom:0.4rem;
}
.checkout .box3.wpad .make{
	margin-bottom: 0;
}

.box3.wpad {
    transition: all 0.3s ease;
    overflow: hidden;
}

/* 如果需要渐入渐出效果，可以用v-show + 过渡 */
.v-enter-from,
.v-leave-to {
    opacity: 0;
    height: 0;
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.v-enter-active,
.v-leave-active {
    transition: all 0.3s ease;
}

.v-enter-to,
.v-leave-from {
    opacity: 1;
}

/* Vant弹窗样式适配 */
.time-select-popup {
    --van-popup-background: #fff;
    --van-popup-radius: 0.3rem 0.3rem 0 0;
}

:deep(.van-picker) {
    --van-picker-background: #fff;
    --van-picker-title-font-size: 0.3rem;
    --van-picker-option-font-size: 0.28rem;
    --van-picker-confirm-button-color: #444DFA;
    --van-picker-cancel-button-color: #999;
}

:deep(.van-picker__toolbar) {
    padding: 0.2rem;
    border-bottom: 1px solid #f5f5f5;
}

:deep(.van-picker__cancel),
:deep(.van-picker__confirm) {
    font-size: 0.28rem;
}

:deep(.van-picker__columns) {
    height: 4rem;
}
</style>