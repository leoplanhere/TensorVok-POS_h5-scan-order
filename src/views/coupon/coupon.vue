<template>
    <div class="layout">
    	
    	<Tabber title="Coupon" />
    	<div class="coupon">
    		<ul>
    			<li>
    				<h3>Stackable coupon</h3>
    				<dl>
    					<dd>
    						<div class="bgs">
    							<div class="ls">
    								<input class="r1" type="checkbox" name="name1" id="r3" />
    								<label for="r3"></label>
    							</div>
    							<div class="flax">
    								<h2>￥<span>10</span></h2>
    								<div class="txt">
    									<h6>Exp: 25.04.05-25.04.06</h6>
    									<p>Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.</p>
    								</div>									
    							</div>
    						</div>
    						<h4>Use Now</h4>
    					</dd>
    					<dd>
    						<div class="bgs">
    							<div class="ls">
    								<input class="r1" type="checkbox" name="name1" id="r4" />
    								<label for="r4"></label>
    							</div>
    							<div class="flax">
    								<h2>￥<span>10</span></h2>
    								<div class="txt">
    									<h6>Exp: 25.04.05-25.04.06</h6>
    									<p>Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.</p>
    								</div>									
    							</div>
    						</div>
    						<h4>Use Now</h4>
    					</dd>
    				</dl>
    			</li>
    			<li>
    				<h3>Non-stackable coupon</h3>
    				<dl>
    					<dd>
    						<div class="bgs">
    							<div class="flax">
    								<h2>￥<span>10</span></h2>
    								<div class="txt">
    									<h6>Exp: 25.04.05-25.04.06</h6>
    									<p>Enjoy exclusive premium privileges, a symbol of distinguished status, and comprehensive quality services.</p>
    								</div>									
    							</div>
    						</div>
    						<h4>Use Now</h4>
    					</dd>
    				</dl>
    			</li>
    		</ul>
    	</div>
    	
    	<div class="ftbtns">
    		<a href="#" class="btn">Submit</a>
    	</div>
    	
    	
    
    
    </div>
</template>

<script setup>

</script>

<style>
	
.coupon {
	padding-bottom:2rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	background:#F3F5F9;
	height:calc(100vh - 48px);
	min-height: calc(100vh - 48px);
	overflow-y: scroll !important;
}
.coupon ul {
	padding:0.3rem 0.2rem;
}
.coupon li {
	margin-bottom:0.55rem;
}
.coupon li .ls {
	margin-right:0.28rem;
}
.coupon li h3 {
	font-weight:bold;
	font-size:0.3rem;
	color:#111111;
	line-height:1.6;
	margin-bottom:0.16rem;
}
.coupon li dd {
	margin-bottom:0.22rem;
	background:#F95E06;
	border-radius:0.4rem 0.3rem 0.3rem 0.4rem;
	display:flex;
}
.coupon li h4 {
	font-weight:400;
	font-size:0.22rem;
	color:#FFFFFF;
	line-height:1;
	width:0.7rem;
	text-align:center;
	padding-left:0.2rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
	transform:rotate(-2deg);
	writing-mode:vertical-lr;
	white-space:nowrap;
}
.coupon li .r1 {
	display:none;
}
.coupon li label {
	display:block;
	background:url(../../assets/pic/qw13.png) no-repeat center/0.35rem auto;
	width:0.35rem;
	height:0.35rem;
}
.coupon li input:checked + label {
	background:url(../../assets/pic/qw13-1.png) no-repeat center/0.35rem auto;
}
.coupon li .bgs {
	background:#fff;
	border-radius:0.3rem;
	display:flex;
	padding:0.14rem 0.3rem 0.14rem 0.2rem;
	align-items:center;
	justify-content:space-between;
	flex:1;
}
.coupon li .flax {
	display:flex;
	flex:1;
	justify-content:space-between;
}
.coupon li h2 {
	width:1.6rem;
	line-height:1.44rem;
	background:#FFF1EE;
	border-radius:0.2rem 0.2rem 0.2rem 0.2rem;
	font-weight:400;
	font-size:0.3rem;
	color:#F95E06;
	text-align:center;
	display: flex;
	align-items: center;
	justify-content: center;
}
.coupon li h2 span {
	font-weight:bold;
	font-size:0.45rem;
}
.coupon li .txt {
	width:calc(100% - 2rem);
}
.coupon li h6 {
	font-weight:400;
	font-size:0.18rem;
	color:#999999;
	text-align:right;
	line-height:1.6;
}
.coupon li p {
	font-weight:400;
	font-size:0.18rem;
	color:#999999;
	line-height:1.6;
	margin-top:0.2rem;
	 display: -webkit-box;
	  -webkit-line-clamp: 3;
	  -webkit-box-orient: vertical;
	  overflow: hidden;
	  text-overflow: ellipsis;
}
.personal {
	min-height:100vh;
	background:#F3F5F9;
	padding-bottom:2rem;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	-o-box-sizing:border-box;
	box-sizing:border-box;
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