<template>
    <div class="layout">
    	<Tabber title="Personal Info" />
    	<div class="personal">
    		<ul>
    			<li>
    				<h3>Username</h3>
    				<div class="rs" @click="OpenDialog">
						<view class="t1">
							{{store.userInfo.nickname}}
						</view>
    					<img class="icon" src="../../assets/pic/qw1.png" alt="" />
    				</div>
    			</li>
    			<li @click="goToAddress">
    				<h3>Address</h3>
    				<div class="rs">
    					
						<view class="t1">
							{{ defaultAddress.value ? defaultAddress.value.address : 'Please set your default address' }}
						</view>
    					<img class="icon" src="../../assets/pic/qw1.png" alt="" />
    				</div>
    			</li>
    			<li>
    				<h3>Telephone</h3>
    				<div class="rs">
						<view class="t1">
							{{store.userInfo.mobile}}
						</view>
    					<img class="icon" src="../../assets/pic/qw1.png" alt="" />
    				</div>
    			</li>
    		</ul>
    	</div>
    	
    	<div class="ftbtns on">
    		<a href="#" class="btn" @click="Logout">Log out</a>
    	</div>
    </div>
	<van-popup v-model:show="show" round  overlay :style="{ padding: '64px' }" 
  close-icon="close">
		<div class="van-popup__wrapper">
			<div class="title">
				{{ $t('message.EditUserName') }}
			</div>
			<div class="van-popup__content">
				<van-field v-model="EditUserName" :label="$t('message.Username')" label-width="80" />
			</div>
			<div class="button">
				<button class="btn">{{ $t('message.confirm') }}</button>
			</div>
		</div>
	</van-popup>
</template>
<script setup>
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'
	import { useUserStore } from "../../stores/index";
	import api from '../../common/index.js'
const router = useRouter()
const store = useUserStore()
const defaultAddress = ref({})
api.getAddressList({user_id:store.userInfo.id}).then((res)=>{
	console.log(res);
	if(res.code==1){
		defaultAddress.value = res.data.find(item=>item.status==1)
	}
})
let show = ref(false)
let EditUserName = ref('')
EditUserName.value = store.userInfo.nickname

function OpenDialog() {
  show.value = true
}	
// 跳转到address页面
const goToAddress = () => {
  router.push({ name: 'address' })
}
// 退出登录
const Logout = () => {
	store.logout()
	router.push({ name: 'login' })
}
</script>
<style>
	.personal {
		height: calc(100vh - 48px);
		    min-height: calc(100vh - 48px);
		    -webkit-box-sizing: border-box;
		    -moz-box-sizing: border-box;
		    -o-box-sizing: border-box;
		    box-sizing: border-box;
		background:#F3F5F9;
	}
.personal ul {
	padding:0.3rem 0.18rem;
}
.personal li {
	background:#FFFFFF;
	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
	padding:0.5rem 0.4rem;
	margin-bottom:0.22rem;
	display:flex;
	justify-content:space-between;
	align-items:center;
}
.personal li h3 {
	font-weight:400;
	font-size:0.3rem;
	color:#060606;
	line-height:1.6;
}
.personal li .rs {
	display:flex;
	justify-content:space-between;
	align-items:center;
	flex:1;
	margin-left:0.5rem;
}
.personal li .t1 {
	width:calc(100% - 0.55rem);
	height:0.36rem;
	font-weight:400;
	font-size:0.3rem;
	color:#111111;
	border:none;
	background:none;
	text-align:right;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.personal li .icon {
	width:0.13rem;
}
.ftbtns.ons {
	display:flex;
	justify-content:space-between;
	align-items:center;
}
.ftbtns.ons .b1 {
	width:1.86rem;
	line-height:0.9rem;
	background:#FFFFFF;
	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
	border:1px solid #E84048;
	font-weight:400;
	font-size:0.36rem;
	color:#FF2A0E;
	text-align:center;
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
 	flex: 1;
 }
 .ftbtns.on .btn {
 	background:#FF2A0E;
 }
 .btn{
	/* height: 0.89rem; */
    background: #444DFA;
    width: 100%;
    border-radius: 0.3rem 0.3rem 0.3rem 0.3rem;
    margin: 0 auto;
    font-weight: 400;
    font-size: 0.36rem;
    color: #FFFFFF;
    /* line-height: 0.9rem; */
    display: block;
    text-align: center;
 }
.van-popup {
 	padding: 15px !important;
	width: 80%;
 }
 .title{
	font-size: 0.4rem;
	font-weight: bold;
	text-align: center;
 }
 .van-popup__content{
	margin: 20px 0;
 }
 .van-field__body{
	border-bottom: 1px solid #eee;
 }
</style>
