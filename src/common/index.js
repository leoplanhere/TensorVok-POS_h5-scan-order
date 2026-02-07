// 导入所有模块
import auth from './modules/auth'
import user from './modules/user'
import food from './modules/food'
import order from './modules/order'
import address from './modules/address'
import shop from './modules/shop'
import payment from './modules/payment'
import recharge from './modules/recharge'
import coupon from './modules/coupon'

// 默认导出所有模块
export default {
  ...auth,
  ...user,
  ...food,
  ...order,
  ...address,
  ...shop,
  ...payment,
  ...recharge,
  ...coupon,
}