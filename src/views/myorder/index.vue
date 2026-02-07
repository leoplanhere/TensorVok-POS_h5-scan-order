<template>
    <div class="layout">
    	<Tabber title="My order" />
    	<div class="myorder">
    		<div class="navs">
    			<ul>
    				<li class="on"><a href="#">ALL</a></li>
    				<li><a href="#">Dine-in</a></li>
    				<li><a href="#">Takeout</a></li>
    			</ul>
    		</div>
    		
    		<!-- 动态渲染订单列表 -->
    		<div class="bds">
    			<ul>
    				<!-- 遍历订单列表 -->
    				<li 
    					v-for="(order, index) in orderList" 
    					:key="index"
    					@click="goToOrderdel(order)"
    				>
    					<div class="tps">
    						<h6>{{ order.time }}</h6>
    						<h3 :class="getStatusClass(order.status)">{{ order.status }}</h3>
    					</div>
    					<h2><i>{{ order.shopName }}</i></h2>
    					<div class="flax">
    						<h4>A total of {{ order.num }} orders</h4>
    						<h5>Total:<span>{{ order.price }}</span></h5>
    					</div>
    					
    					<!-- 已评价 - 显示评分 -->
    					<div class="pinj" v-if="order.rate">
    						{{ getRateText(order.rate) }}
    						<img class="icon" :src="getRateIcon(order.rate)" alt="" />
    					</div>
    					
    					<!-- 未评价 - 显示评价按钮 -->
    					<div class="bns" v-else>
    						<a @click.stop="goToRating(order)" class="btn">Evaluation</a>
    					</div>
    				</li>
    			</ul>
    		</div>
    	</div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 定义Props接收订单列表数据
const props = defineProps({
    orderList: {
        type: Array,
        default: () => [
            // 默认示例数据
            {
                time: '2023-12-12 14:51:15',
                status: 'Completed',
                shopName: 'The translation appears to be  ...',
                num: 4,
                price: '¥230',
                rate: 3 // 3=Generally
            },
            {
                time: '2023-12-12 14:51:15',
                status: 'Dining',
                shopName: 'The translation appears to be incomplete ',
                num: 4,
                price: '¥230',
                rate: 0 // 0=未评价
            }
        ]
    }
})

// 根据订单状态获取样式类
const getStatusClass = (status) => {
    switch (status) {
        case 'Completed':
            return 'i1'
        case 'Dining':
            return 'i2'
        default:
            return ''
    }
}

// 根据评分值获取评分文本
const getRateText = (rate) => {
    const rateMap = {
        1: 'Bad',
        2: 'Poor',
        3: 'Generally',
        4: 'Great',
        5: 'Good'
    }
    return rateMap[rate] || 'Generally'
}

// 根据评分值获取评分图标路径
const getRateIcon = (rate) => {
    const iconMap = {
        1: '../assets/pic/qw7-1.png',
        2: '../assets/pic/qw8-1.png',
        3: '../assets/pic/qw9-1.png',
        4: '../assets/pic/qw10-1.png',
        5: '../assets/pic/qw11-1.png'
    }
    return iconMap[rate] || '../assets/pic/qw9-1.png'
}

// 跳转到评价页面（携带订单信息）
const goToRating = (order) => {
    router.push({ 
        name: 'rating',
        query: { orderId: JSON.stringify(order) } // 传递订单信息
    })
}

// 跳转到订单详情页面（携带订单信息）
const goToOrderdel = (order) => {
    router.push({ 
        name: 'orderdel',
        query: { orderId: JSON.stringify(order) } // 传递订单信息
    })
}
</script>

<style lang="scss" scoped>
 .myorder .navs{
	 position: sticky;
	 left: 0;right: 0;top: 0;
 }
 
 
 .myorder .navs {
 	background:#FBFBFB;
 	padding-top:0.3rem;
 }
 .myorder .navs ul {
 	display:flex;
 	justify-content:space-between;
 	align-items:center;
 	margin:0 0.5rem;
 }
 .myorder .navs li a {
 	font-weight:400;
 	display:block;
 	font-size:0.3rem;
 	color:#111111;
 	text-align:center;
 	line-height:0.88rem;
 	padding:0 0.36rem;
 }
 .myorder .navs li.on a {
 	font-weight:bold;
 	color:#444DFA;
 }
 .myorder .navs li.on:before {
 	width:100%;
 }
 .myorder .navs li {
 	position:relative;
 }
 .myorder .navs li:before {
 	content:"";
 	position:absolute;
 	left:0;
 	right:0;
 	bottom:0;
 	z-index:1;
 	height:0.07rem;
 	width:0;
 	background:#444DFA;
 	border-radius:0.12rem 0.12rem 0.12rem 0.12rem;
 }
 .myorder .bds {
 	margin:0.22rem 0.2rem;
	height: calc(100% - 1.48rem);
	overflow-y: scroll;
 }
 .myorder {
 	height: calc(100vh - 48px);
 	    min-height: calc(100vh - 48px);
 	    -webkit-box-sizing: border-box;
 	    -moz-box-sizing: border-box;
 	    -o-box-sizing: border-box;
 	    box-sizing: border-box;
 	background:#F3F5F9;
 }
 .myorder .bds li {
 	background:#FFFFFF;
 	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
 	padding:0.36rem 0.45rem 0.5rem;
 	margin-bottom:0.22rem;
 }
 .myorder .bds li .tps {
 	display:flex;
 	justify-content:space-between;
 	align-items:center;
 }
 .myorder .bds li h6 {
 	font-weight:400;
 	font-size:0.24rem;
 	color:#999999;
 	line-height:1.6;
 }
 .myorder .bds li h3 {
 	font-weight:bold;
 	font-size:0.24rem;
 	line-height:1.6;
 }
 .myorder .bds li h3.i1 {
 	color:#00A737;
 }
 .myorder .bds li h3.i2 {
 	color:#47ACFF;
 }
 .myorder .bds li h2 {
 	background:url(../pic/qw1.png) no-repeat right center/0.13rem auto;
 	margin:0.2rem 0 0.14rem;
 }
 .myorder .bds li h2 i {
 	font-weight:400;
 	font-size:0.3rem;
 	color:#111111;
 	line-height:1.6;
 	max-width:94%;
 	word-break:keep-all;
 	white-space:nowrap;
 	overflow:hidden;
 	text-overflow:ellipsis;
 	display:inline-block;
 }
 .myorder .bds li .flax {
 	display:flex;
 	justify-content:space-between;
 	align-items:center;
 	margin-bottom:0.1rem;
 }
 .myorder .bds li h4 {
 	font-weight:400;
 	font-size:0.24rem;
 	color:#999999;
 	line-height:1.6;
 }
 .myorder .bds li h5 {
 	font-weight:400;
 	font-size:0.24rem;
 	color:#111111;
 	line-height:1.6;
 }
 .myorder .bds li h5 span {
 	font-weight:bold;
 	font-size:0.36rem;
 	margin-left:0.16rem;
 	display:inline-block;
 }
 .myorder .bds li .btn {
 	width:2.68rem;
 	line-height:0.83rem;
 	background:#444DFA;
 	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
 	font-weight:400;
 	font-size:0.3rem;
 	color:#FFFFFF;
 	display:block;
 	text-align:center;
 	text-transform:uppercase;
 }
 .myorder .bds li .bns {
 	display:flex;
 	justify-content:flex-end;
 	margin-top:0.3rem;
 }
 .myorder .bds li .pinj {
 	text-align:right;
 	font-weight:400;
 	font-size:0.2rem;
 	color:#999999;
 }
 .myorder .bds li .pinj .icon {
 	width:0.3rem;
 	display:inline-block;
 	align-items:center;
 	position:relative;
 	top:0.06rem;
 }
 
 .ftbtns {
 	position:fixed;
 	left:0;
 	right:0;
 	bottom:0;
 	z-index:12;padding: 0 0.2rem;
 	height:1.35rem;
 	padding-top:0.18rem;
 	-webkit-box-sizing:border-box;
 	-moz-box-sizing:border-box;
 	-o-box-sizing:border-box;
 	box-sizing:border-box;
 	background:#FFFFFF;
 	width:7.5rem;
 	margin:0 auto;
 }
 .ftbtns.on {
 	background:none;
 }
 .ftbtns .btn {
 	height:0.89rem;
 	background:#444DFA;
 	width:7.02rem;
 	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
 	margin:0 auto;
 	font-weight:400;
 	font-size:0.36rem;
 	color:#FFFFFF;
 	line-height:0.9rem;
 	display:block;
 	text-align:center;
 	flex: 1;margin-left: 0.2rem;
 }
 .ftbtns.on .btn {
 	background:#FF2A0E;
 }
</style>