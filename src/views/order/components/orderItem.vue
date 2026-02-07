<template>
  <div class="bds">
    <ul>
      <li @click="goToOrderdel">
        <div class="tps">
          <h6>{{ item.orderdate }}</h6>
          <div class="status-box">
             <h3 v-if="item.chestatus == 2" class="i1">Completed</h3>
             <h3 v-else :class="getStatusClass(item.pack)">
                {{ item.pack == 2 ? 'Takeout' : 'Dining' }}
             </h3>
          </div>
        </div>
        
        <h2>
            <i>{{ item.shopname }}</i>
            <span v-if="item.ordernone && item.ordernone.includes('等叫')" class="wait-tag">Scheduled</span>
        </h2>
        
        <div class="flax">
          <h4>A total of {{ item.totalNum }} items</h4>
          <h5>Total:<span>$ {{ item.displayPrice }}</span></h5>
        </div>

        <div class="pinj" v-if="!item.is_finish">
          {{ getRateText(item.value) }}
          <img class="icon" :src="getRateIcon(item.value)" alt="" />
        </div>

        <div class="bns" v-else>
          <a @click.stop="goToRating" class="btn">Evaluation</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/index.js';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { shopuid } = storeToRefs(userStore)
const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const getStatusClass = (pack) => {
  // pack 1 代表 Dine-in，返回 i2 (蓝色)；pack 2 代表 Takeout，返回默认或其它颜色
  return pack == 1 ? 'i2' : 'takeout-status' 
}

const getRateText = (rate) => {
  const rateMap = { 1: 'Bad', 2: 'Poor', 3: 'Generally', 4: 'Great', 5: 'Good' }
  return rateMap[rate] || 'Generally'
}

const getRateIcon = (rate) => {
  const iconMap = { 1: 'qw7-1.png', 2: 'qw8-1.png', 3: 'qw9-1.png', 4: 'qw10-1.png', 5: 'qw11-1.png' }
  const fileName = iconMap[rate] || 'qw9-1.png'
  return new URL(`../../../assets/pic/${fileName}`, import.meta.url).href
}

const goToOrderdel = () => {
  router.push({ 
    name: 'orderdel',
    query: { 
      order: JSON.stringify(props.item),
      shop_id: shopuid.value 
    }
  })
}

const goToRating = () => {
  router.push({ 
    name: 'rating',
    query: { id: props.item.reserve_list_id || props.item.id }
  })
}
</script>



<style lang="scss" scoped>


.wait-tag {
    font-size: 0.2rem;
    background: #FF7D00;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 10px;
    font-weight: normal;
    vertical-align: middle;
}

.takeout-status {
    color: #00B42A; // 外卖可以用绿色区分
}
/* 保持原有样式不变 */
.bds {
  margin: 0.22rem 0.2rem;
  li {
    background: #FFFFFF;
    border-radius: 0.3rem;
    padding: 0.36rem 0.45rem 0.5rem;
    margin-bottom: 0.22rem;
    list-style: none;
  }
  .tps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h6 { font-weight: 400; font-size: 0.24rem; color: #999; }
    h3 { font-weight: bold; font-size: 0.24rem; &.i1 { color: #00A737; } &.i2 { color: #47ACFF; } }
  }
  h2 {
    background: url(../../../assets/pic/qw1.png) no-repeat right center/0.13rem auto;
    margin: 0.2rem 0 0.14rem;
    i { font-style: normal; font-size: 0.3rem; color: #111; display: inline-block; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
  .flax {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 { font-weight: 400; font-size: 0.24rem; color: #999; }
    h5 { font-weight: 400; font-size: 0.24rem; color: #111; span { font-size: 0.36rem; margin-left: 0.1rem; } }
  }
  .bns { display: flex; justify-content: flex-end; margin-top: 0.3rem; }
  .btn {
    width: 2.68rem; line-height: 0.83rem; background: #444DFA; border-radius: 0.3rem;
    color: #fff; text-align: center; text-transform: uppercase; font-size: 0.28rem;
  }
  .pinj { text-align: right; font-size: 0.24rem; color: #999; .icon { width: 0.3rem; margin-left: 0.1rem; vertical-align: middle; } }
}
</style>