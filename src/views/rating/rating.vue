<template>
    <div class="layout">
    	<Tabber title="rating" />
    	<div class="rating">
    		<div class="box">
    			<div class="hds">
    				<h2>Yoha Cat Futian Store</h2>
    				<ul>
    					<li data-category="ambien">
    						<h3>Atmosphere:</h3>
    						<dl>
    							<dd @click="selectRating('ambien', 1)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw7.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw7-1.png" alt="" />
    								</div>
    								<p>Bad</p>
    							</dd>
    							<dd @click="selectRating('ambien', 2)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw8.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw8-1.png" alt="" />
    								</div>
    								<p>Not Good</p>
    							</dd>
    							<dd @click="selectRating('ambien', 3)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw9.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw9-1.png" alt="" />
    								</div>
    								<p>Okay</p>
    							</dd>
    							<dd @click="selectRating('ambien', 4)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw10.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw10-1.png" alt="" />
    								</div>
    								<p>Good</p>
    							</dd>
    							<dd @click="selectRating('ambien', 5)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw11.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw11-1.png" alt="" />
    								</div>
    								<p>Great</p>
    							</dd>
    						</dl>
    					</li>
    					<li data-category="food">
    						<h3>Food:</h3>
    						<dl>
    							<dd @click="selectRating('food', 1)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw7.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw7-1.png" alt="" />
    								</div>
    								<p>Bad</p>
    							</dd>
    							<dd @click="selectRating('food', 2)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw8.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw8-1.png" alt="" />
    								</div>
    								<p>Not Good</p>
    							</dd>
    							<dd @click="selectRating('food', 3)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw9.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw9-1.png" alt="" />
    								</div>
    								<p>Okay</p>
    							</dd>
    							<dd @click="selectRating('food', 4)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw10.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw10-1.png" alt="" />
    								</div>
    								<p>Good</p>
    							</dd>
    							<dd @click="selectRating('food', 5)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw11.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw11-1.png" alt="" />
    								</div>
    								<p>Great</p>
    							</dd>
    						</dl>
    					</li>
    					<li data-category="service">
    						<h3>Service:</h3>
    						<dl>
    							<dd @click="selectRating('service', 1)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw7.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw7-1.png" alt="" />
    								</div>
    								<p>Bad</p>
    							</dd>
    							<dd @click="selectRating('service', 2)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw8.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw8-1.png" alt="" />
    								</div>
    								<p>Not Good</p>
    							</dd>
    							<dd @click="selectRating('service', 3)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw9.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw9-1.png" alt="" />
    								</div>
    								<p>Okay</p>
    							</dd>
    							<dd @click="selectRating('service', 4)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw10.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw10-1.png" alt="" />
    								</div>
    								<p>Good</p>
    							</dd>
    							<dd @click="selectRating('service', 5)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw11.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw11-1.png" alt="" />
    								</div>
    								<p>Great</p>
    							</dd>
    						</dl>
    					</li>
    					<li data-category="entertaining">
    						<h3>Entertainment:</h3>
    						<dl>
    							<dd @click="selectRating('entertaining', 1)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw7.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw7-1.png" alt="" />
    								</div>
    								<p>Bad</p>
    							</dd>
    							<dd @click="selectRating('entertaining', 2)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw8.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw8-1.png" alt="" />
    								</div>
    								<p>Not Good</p>
    							</dd>
    							<dd @click="selectRating('entertaining', 3)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw9.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw9-1.png" alt="" />
    								</div>
    								<p>Okay</p>
    							</dd>
    							<dd @click="selectRating('entertaining', 4)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw10.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw10-1.png" alt="" />
    								</div>
    								<p>Good</p>
    							</dd>
    							<dd @click="selectRating('entertaining', 5)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw11.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw11-1.png" alt="" />
    								</div>
    								<p>Great</p>
    							</dd>
    						</dl>
    					</li>
    					<li data-category="comfort">
    						<h3>Comfortable:</h3>
    						<dl>
    							<dd @click="selectRating('comfort', 1)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw7.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw7-1.png" alt="" />
    								</div>
    								<p>Bad</p>
    							</dd>
    							<dd @click="selectRating('comfort', 2)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw8.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw8-1.png" alt="" />
    								</div>
    								<p>Not Good</p>
    							</dd>
    							<dd @click="selectRating('comfort', 3)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw9.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw9-1.png" alt="" />
    								</div>
    								<p>Okay</p>
    							</dd>
    							<dd @click="selectRating('comfort', 4)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw10.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw10-1.png" alt="" />
    								</div>
    								<p>Good</p>
    							</dd>
    							<dd @click="selectRating('comfort', 5)">
    								<div class="icon">
    									<img class="icn1" src="../../assets/pic/qw11.png" alt="" />
    									<img class="icn2" src="../../assets/pic/qw11-1.png" alt="" />
    								</div>
    								<p>Great</p>
    							</dd>
    						</dl>
    					</li>
    				</ul>
    			</div>
    			<textarea class="txt" name="" v-model="Remark" id="" placeholder="Please describe your dining experience so that we can provide you with better service! (Required)"></textarea>
    		</div>
    		<a @click="submitRate" class="btn">submit</a>			
    	</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../common/index.js'
import { useUserStore} from '../../stores/index.js';
import { storeToRefs } from 'pinia';
import {showFailToast } from 'vant'

const userStore = useUserStore();
const { shopuid } = storeToRefs(userStore);

const router = useRouter()
const id=router.currentRoute.value.query.id

// 存储各维度的评分选中状态
const ratings = ref({
    ambien: 0,
    food: 0,
    service: 0,
    entertaining: 0,
    comfort: 0
})
let Remark= ref('')

// 选择评分的方法 - 修复选择器兼容问题
const selectRating = (category, score) => {
    // 更新当前维度的评分
    ratings.value[category] = score
    
    // 使用data属性获取元素，兼容所有浏览器
    const liElement = document.querySelector(`li[data-category="${category}"]`)
    const dlElement = liElement.querySelector('dl')
    const ddElements = dlElement.querySelectorAll('dd')
    
    // 移除所有dd的on类名
    ddElements.forEach(dd => dd.classList.remove('on'))
    
    // 给选中的dd添加on类名
    // ddElements[score - 1].classList.add('on')
	// 循环添加类名
	for (let i = 0; i < score; i++) {
		if (ddElements[i]) {
			ddElements[i].classList.add('on');
		}
	}
}
function submitRate(){
	if(ratings.value.ambien==0||ratings.value.food==0||ratings.value.service==0||ratings.value.entertaining==0||ratings.value.comfort==0){
		showFailToast({
			message:that.$t('message.NoRate')
		})
		return
	}
	api.setRate({
		reserve_list_id:id,
		...ratings.value,
		evaluate:Remark.value,
	}).then((res)=>{
		console.log(res);
		if(res.code==1){
			router.go(-1)
		}
	})
}

const goBack = () => {
  router.go(-1)
}
</script>

<style>
.rating {
	padding:1.1rem 0;
}
.rating .hds h2 {
	font-weight:400;
	font-size:0.3rem;
	color:#999999;
	line-height:1.6;
	text-align:center;
}
.rating ul {
	margin-top:0.4rem;
}
.rating li {
	display:flex;
	justify-content:space-between;
	align-items:flex-start;
	margin-bottom:0.24rem;
}
.rating li h3 {
	font-weight:400;
	font-size:0.2rem;
	margin-top:0.2rem;
	color:#111111;
	line-height:1.6;
	width:1.6rem;
	text-align:right;
}
.rating li dl {
	width:calc(100% - 1.74rem);
	display:flex;
	align-items:flex-start;
	justify-content:space-between;
	padding-right:0.7rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
}
.rating li dd {
	text-align:center;
	cursor: pointer; /* 添加鼠标指针样式 */
}
.rating li dd:last-child {
	margin-right:0;
}
.rating li p {
	font-weight:400;
	font-size:0.2rem;
	color:#999999;
	line-height:1.6;
	opacity: 0;
}
.rating li .icon {
	width:0.69rem;
	margin:0 auto;
}
.rating li .icon img {
	width:100%;
	display:block;
}
.rating li .icon .icn2 {
	display:none;
}
.rating li dd.on .icon .icn1 {
	display:none;
}
.rating li dd.on .icon .icn2 {
	display:block;
	-webkit-animation:bounce2 1s .2s ease both;
	-moz-animation:bounce2 1s .2s ease both
}
@-webkit-keyframes bounce2{
0%,20%,50%,80%,100%{-webkit-transform:translateY(0)}
40%{-webkit-transform:translateY(-10px)}
60%{-webkit-transform:translateY(-5px)}
}
@-moz-keyframes bounce2{
0%,20%,50%,80%,100%{-moz-transform:translateY(0)}
40%{-moz-transform:translateY(-10px)}
60%{-moz-transform:translateY(-5px)}
}
.rating li dd.on p {
	opacity: 1;
}
.rating .hds {
	margin-bottom:0.8rem;
}
.rating .txt {
	height:1.83rem;
	background:#F3F5F9;
	border-radius:0.2rem 0.2rem 0.2rem 0.2rem;
	border:1px solid #DDDDDD;
	padding:0.2rem 0.5rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	font-weight:400;
	font-size:0.24rem;
	color:#000;
	line-height:1.6;
	width:100%;
	resize:none;
}
.rating .btn {
	height:0.9rem;
	background:#444DFA;
	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
	font-weight:400;
	font-size:0.36rem;
	margin:1rem 0.34rem 0;
	color:#FFFFFF;
	display:block;
	text-align:center;
	line-height:0.9rem;
	text-align:center;
	text-transform:uppercase;
	cursor: pointer;
}
.rating .box {
	padding:0 0.52rem;
}
</style>