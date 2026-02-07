<template>
    <div class="layout">
			<Tabber title="Profile" />
    	<div class="profile">
    		<div class="tps">
    			<div class="hds">
    				<a @click="goToPersonal">
    					<div class="pic">
    						<img :src="userData.avatar" alt="" />
    					</div>
    					<div class="txt">
    						<div class="ls">
    							<h3>{{userData.nickname}}</h3>
    							<dl>
    								<dd><i>{{userData.vip_name}}</i></dd>
    								<dd><span></span></dd>
    								<dd>Integral <strong>{{userData.score}}</strong></dd>
    								<dd><span></span></dd>
    								<dd>{{userData.vip}}</dd>
    							</dl>
    						</div>
    						<img class="icon" src="../../assets/pic/qw6.png" alt=''/>
    					</div>
    				</a>
    			</div>
    		</div>
    		<ul>
    			<li>
    				<a @click="goToCoupon">
    					<div class="ls">
    						<img src="../../assets/pic/qw2.png" alt="" />
    						<h3>Coupon</h3>
    					</div>
    					<img class="icon" src="../../assets/pic/qw1.png" alt="" />
    				</a>
    			</li>
    			<li>
    				<a @click="goToMyOrder">
    					<div class="ls">
    						<img src="../../assets/pic/qw3.png" alt="" />
    						<h3>My order</h3>
    					</div>
    					<img class="icon" src="../../assets/pic/qw1.png" alt="" />
    				</a>
    			</li>
    		</ul>
    	</div>
    	
    	
    	
    	
    	
    
    
    </div>
</template>

<script setup 	>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore} from '../../stores/index.js'
import { storeToRefs } from 'pinia'
import Tabber from '../../components/Tabber.vue'
const router = useRouter()
const userStore = useUserStore()
    const {
        userInfo,
        shopuid ,
    } = storeToRefs(useUserStore())
let userData=ref({})
async function getUserInfo(){ 
	let result=await userStore.fetchUserInfo(userInfo.value.id)
	if(result.success){
		userData.value=result.data
	}else{
		userData.value={}
	}
	console.log(userData)
}

getUserInfo()


const goToPersonal = () => {
  router.push({
    name: 'personal',
  })
}
// 跳转到coupon页面
const goToCoupon = () => {
  router.push({ name: 'coupon' })
}
// 跳转到order页面
const goToMyOrder = () => {
  router.push({ name: 'Order' })
}
</script>

<style lang="scss" scoped>
	.profile {
		background:#F3F5F9;
		height: calc(100vh - 48px);
		    min-height: calc(100vh - 48px);
		    overflow-y: scroll !important;
		    -webkit-box-sizing: border-box;
		    -moz-box-sizing: border-box;
		    -o-box-sizing: border-box;
		    box-sizing: border-box;
	}
	.profile .tps {
		padding:0.2rem 0.17rem 0.3rem;
		background:#fff;
	}
	.profile .hds {
		background:url(../../assets/pic/qw4.png) no-repeat center/cover;
		padding:0.75rem 0.38rem 0.7rem;
	}
	.profile .hds a {
		display:flex;
		justify-content:space-between;
		align-items:center;
	}
	.profile .hds .pic {
		width:1.24rem;
		height:1.24rem;
		background:#fff;
		border-radius:50%;
		overflow:hidden;
	}
	.profile .hds .pic img {
		width:100%;
		height:100%;
		display:block;
	}
	.profile .hds .txt {
		flex:1;
		margin-left:0.18rem;
		display:flex;
		justify-content:space-between;
		align-items:center;
	}
	.profile .hds h3 {
		font-weight:bold;
		font-size:0.36rem;
		color:#FFFFFF;
		line-height:1.6;
	}
	.profile .hds dl {
		display:flex;
		align-items:center;
		margin-top:0.05rem;
	}
	.profile .hds dd {
		font-weight:400;
		font-size:0.22rem;
		color:#FFFFFF;
		line-height:1.6;
	}
	.profile .hds dd span {
		margin:0 0.18rem;
		background:#ecedfe;
		width:0.01rem;
		height:0.24rem;
		display:block;
	}
	.profile .hds dd i {
		padding:0 0.15rem;
		background:#FCE0BD;
		font-weight:bold;
		font-size:0.2rem;
		color:#3B1F0F;
		line-height:0.36rem;
		border-radius:0.2rem;
	}
	.profile .hds .icon {
		width:0.17rem;
		display:block;
	}
	.profile ul {
		margin:0.3rem 0.16rem;
	}
	.profile li {
		margin-bottom:0.28rem;
		padding:0.46rem 0.4rem 0.46rem 0.5rem;
		background:#fff;
		border-radius:0.3rem;
	}
	.profile li a {
		display:flex;
		justify-content:space-between;
		align-items:center;
	}
	.profile li .ls img {
		width:0.49rem;
		display:block;
	}
	.profile li .ls {
		display:flex;
		align-items:center;
	}
	.profile li h3 {
		margin-left:0.25rem;
		font-weight:400;
		font-size:0.28rem;
		color:#3B1F0F;
		line-height:1.6;
	}
	.profile li .icon {
		width:0.13rem;
	}
</style>