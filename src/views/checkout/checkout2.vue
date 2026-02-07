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
		    
		</header>
    	<div class="checkout">
    		<div class="thpic">
    			<ul>
    				<li>
    					<div class="icon">
    						<img src="../../assets/pic/qw4.png" >
    					</div>
    					<div class="text">
    						<div class="flex">
    							<h4>Super large quantity special...</h4>
    							<i>$ 58</i>
    						</div>
    						<div class="flex">
    							<h5>introduction  of  this course...</h5>
    							<span>x2</span>
    						</div>
    					</div>
    				</li>
    				<li>
    					<div class="icon">
    						<img src="../../assets/pic/qw4.png" >
    					</div>
    					<div class="text">
    						<div class="flex">
    							<h4>Super large quantity special...</h4>
    							<i>$ 58</i>
    						</div>
    						<div class="flex">
    							<h5>introduction  of  this course...</h5>
    							<span>x2</span>
    						</div>
    					</div>
    				</li>
    				<li>
    					<div class="icon">
    						<img src="../../assets/pic/qw4.png" >
    					</div>
    					<div class="text">
    						<div class="flex">
    							<h4>Super large quantity special...</h4>
    							<i>$ 58</i>
    						</div>
    						<div class="flex">
    							<h5>introduction  of  this course...</h5>
    							<span>x2</span>
    						</div>
    					</div>
    				</li>
    				<li>
    					<div class="icon">
    						<img src="../../assets/pic/qw4.png" >
    					</div>
    					<div class="text">
    						<div class="flex">
    							<h4>Super large quantity special...</h4>
    							<i>$ 58</i>
    						</div>
    						<div class="flex">
    							<h5>introduction  of  this course...</h5>
    							<span>x2</span>
    						</div>
    					</div>
    				</li>
    			</ul>
    		</div>
    		<div class="itemflex">
    			<h4>3 Items</h4>
    			<h5>Sub Total:$<i>230</i><span>Off :¥30</span></h5>
    		</div>
    		<div class="box box1">
    			<h4>Table Instructions</h4>
    			<h6><i>Notes</i><i>Notes</i></h6>
    			<textarea class="text" rows="" cols="" placeholder="Add Notes (Extro Mayo, Cheese, Etc.)"></textarea>
    		</div>
    		<div class="pickitem">
    			<ul>
    				<li><input type="radio" name="radio" id="ra1" value="" /><label for="ra1">Pickup</label></li>
    				<li><input type="radio" name="radio" id="ra2" value="" /><label for="ra2">Delivery</label></li>
    			</ul>
    		</div>
    		<div class="box box3 wpad">
    			<div class="make">
    				<img src="../../assets/pic/qw19.png" >China Merchants Huitzhi Building,....
    			</div>
    		</div>
    		<div class="box ulbox">
    			<ul class="uar">
    				<li><h5>Please select coupon</h5><i>- $ 15</i></li>
    				<li><h5>Membership Discount</h5><i>- $ 15</i></li>
    				<li><h5>Discount Card</h5><i>- $ 15<span>Top-up</span></i></li>
    			</ul>
    		</div>
    		<div class="box ulbox">
    			<ul>
    				<li><h5>Course:</h5><em>$ 1.5</em></li>
    				<li><h5>Tax:</h5><em>$ 1.5</em></li>
    				<li><h5>Tip:</h5><em>$ 1.5</em></li>
    				<li><h5>Service Fee:</h5><em>$ 1.5</em></li>
    				<li><h5>Total: </h5><h6>$ 200</h6></li>
    			</ul>
    		</div>
    		<div class="itempay">
    			<ul>
    				<li>
    					<i></i>
    					<div class="icon">
    						<img src="../../assets/pic/qw16.png" >
    					</div>
    					<h6>in person</h6>
    				</li>
    				<li class="on">
    					<i></i>
    					<div class="icon">
    						<img src="../../assets/pic/qw17.png" >
    					</div>
    					<h6>Credit card</h6>
    				</li>
    				<li>
    					<i></i>
    					<div class="icon">
    						<img src="../../assets/pic/qw18.png" >
    					</div>
    					<h6>Apple pay</h6>
    				</li>
    			</ul>
    		</div>
    		
    		<div class="itemft">
    			<h6>Total:<i>¥230</i><span>$15 Off</span></h6>
    			<div class="btn">Pay</div>
    		</div>
    	</div>
    	
    	
    </div>
</template>

<script setup>

</script>


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
	font-size:0.24rem;
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
	width:2.78rem;
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
	overflow-x:scroll;
	white-space:nowrap;
	margin:0.45rem 0 0.5rem;
}
.itempay li {
	background:#FFFFFF;
	border-radius:0.3rem 0.3rem 0.3rem 0.3rem;
	border:1px solid #FFFFFF;
	padding:0.38rem 0.15rem 0.14rem;
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
	background:url(../pic/qw12-1.png) no-repeat center/contain;
}
.itempay li.on i {
	background:url(../pic/qw12.png) no-repeat center/contain;
}
.itempay li .icon {
	height:0.35rem;
}
.itempay li .icon img {
	height:100%;
	object-fit:contain;
	display:block;
	margin:0 auto;
}
.itempay li h6 {
	margin-top:0.22rem;
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
}
.checkout {
	padding-bottom:1.3rem;
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
</style>
