<template>
    <div class="layout">
    	<Tabber title="Address" />
    	<div class="address">
    		<ul>
    			<li v-for="(item, index) in addressList" :key="index">
    				<input class="r1" type="radio" name="name" id="t3" />
    				<label for="t3"></label>
					<div class="flax" @click="goToEdiAddress">
						<a href="#">
							<h3>China Overseas Huizhi Building 706</h3>
							<img class="icon" src="../../assets/pic/qw1.png" alt="" />
						</a>
					</div>
    			</li>
				<van-empty v-if="addressList.length === 0" description="No Address Found" />
    		</ul>
    	</div>
    	<div class="ftbtns">
    		<a class="btn" @click="goToEdiAddress">Add Address</a>
    	</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../common/index.js'
import { useUserStore } from '../../stores/index.js'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
let addressList = ref([])
api.getAddressList({
  user_id: userInfo.value.id
}).then(res => {
  console.log(res)
  if(res.code==1){
	addressList.value = res.data?res.data:[]
  }else{
	addressList.value = []

  }
})
const router = useRouter()
// 跳转到editaddress页面
const goToEdiAddress = () => {
  router.push({ name: 'editaddress' })
}
</script>

<style>
	.address {
		background:#F3F5F9;
		padding-bottom:2rem;
		min-height: calc(100vh - 48px);
		overflow-y: scroll;
	}
.address ul {
	margin:0 0.2rem;
	padding:0.24rem 0;
}
.address li {
	margin-bottom:0.2rem;
	background:#FFFFFF;
	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
	padding:0.5rem 0.4rem;
	display: flex;
	align-items: center;
}
.address li .r1 {
	display:none;
}
.address li h3 {
	font-weight:400;
	font-size:0.3rem;
	color:#111111;
	line-height:1.6;
	max-width:90%;
}
.address li .icon {
	width:0.13rem;
	display:block;
}
.address li label {
	display:block;
	background:url(../../assets/pic/qw12-1.png) no-repeat left top 0.06rem/0.39rem auto;
	padding-left:0.6rem;
	height: 0.6rem;
}
.address li .flax{
	flex: 1;
}
.address li .flax a {
	display:flex;
	justify-content:space-between;
	align-items:center;
}
.address li input:checked + label {
	background:url(../../assets/pic/qw12.png) no-repeat left top 0.06rem/0.39rem auto;
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
</style>