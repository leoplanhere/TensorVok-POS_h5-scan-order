import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ==================== State ====================
  const foodList = ref(JSON.parse(localStorage.getItem('foodList') || 'null'))
  const orderList = ref(JSON.parse(localStorage.getItem('orderList') || '[]'))
  const selectedFoodList = ref(JSON.parse(localStorage.getItem('selectedFoodList') || '[]'))
  const totalPrice = ref(Number(localStorage.getItem('totalPrice') || 0))
  const ingredientList = ref(JSON.parse(localStorage.getItem('ingredientList') || '[]'))
  const classifyList = ref(JSON.parse(localStorage.getItem('classifyList') || '[]'))

  // ==================== Computed ====================
  const cartTotalCount = computed(() => {
    return selectedFoodList.value.reduce((total, item) => {
      return total + (item.quantity || 0)
    }, 0)
  })

  const hasItems = computed(() => selectedFoodList.value.length > 0)

  const selectedIngredients = computed(() => {
    return ingredientList.value.filter(item => item.selected)
  })

  // ==================== Actions ====================
  
  // 设置菜品列表
  const setFoodList = (value) => {
    foodList.value = value
    if (value) {
      localStorage.setItem('foodList', JSON.stringify(value))
    } else {
      localStorage.removeItem('foodList')
    }
  }
  //设置分类列表
  const setClassifyList = (value) => {
    classifyList.value = value
    if (value) {
      localStorage.setItem('classifyList', JSON.stringify(value))
    } else {
      localStorage.removeItem('classifyList')
    }
  }

  // 设置订单列表
  const setOrderList = (value) => {
    orderList.value = value
    localStorage.setItem('orderList', JSON.stringify(value))
  }

  // 设置选中商品列表
  const setSelectedFoodList = (value) => {
    selectedFoodList.value = value
    localStorage.setItem('selectedFoodList', JSON.stringify(value))
    updateTotalPrice()
  }

  // 添加商品到购物车
  const addToCart = (foodItem, quantity = 1) => {
    console.log('addToCart', foodItem, quantity)
    // const existingIndex = selectedFoodList.value.findIndex(
    //   item => item.id === foodItem.id && 
    //          item.selectedOptions?.join(',') === foodItem.selectedOptions?.join(',')
    // )
    
    // if (existingIndex > -1) {
    //   // 如果已存在，增加数量
    //   selectedFoodList.value[existingIndex].quantity += quantity
    // } else {
    //   // 如果不存在，添加新商品
    //   selectedFoodList.value.push({
    //     ...foodItem,
    //     quantity,
    //     selectedOptions: foodItem.selectedOptions || [],
    //     remark: foodItem.remark || '',
    //     addedAt: Date.now()
    //   })
    // }
    console.log('selectedFoodList before', foodItem.number)
    selectedFoodList.value.push({
        ...foodItem,
        quantity,
        selectedOptions: foodItem.selectedOptions || [],
        remark: foodItem.remark || '',
        addedAt: Date.now()
      })
    // 2. 更新原始展示列表中的数量 (foodList)
  // 假设 foodList 是响应式数组（如 ref 或 reactive）
  const foodInList = foodList.value.find(item => item.id === foodItem.id)
  console.log('foodInList', foodInList)
  if (foodInList) {
    // 如果 foodList 里的项没有 number 字段，初始化为 quantity，否则累加
    foodInList.number = foodInList.number+1
  }
    localStorage.setItem('selectedFoodList', JSON.stringify(selectedFoodList.value))
    updateTotalPrice()
  }

  // 从购物车移除商品
  const removeFromCart = (foodItem) => {
    // selectedFoodList.value = selectedFoodList.value.filter(
    //   item => !(item.id === foodItem.id && 
    //            item.selectedOptions?.join(',') === foodItem.selectedOptions?.join(','))
    // )
    // 找到第一个匹配项的索引
    const index = selectedFoodList.value.findIndex(item => item.product_id === foodItem.product_id);
    if (index > -1) {
      selectedFoodList.value.splice(index, 1)
    }
    const foodInList = foodList.value.find(item => item.id === foodItem.id)
    if (foodInList) {
      foodInList.number = foodInList.number-1
    }
    localStorage.setItem('selectedFoodList', JSON.stringify(selectedFoodList.value))
    updateTotalPrice()
  }
  //从购物车删除商品且食品列表数量减1
  const deleteFromCart = (foodItem,index) => {
    selectedFoodList.value.splice(index, 1)
    const foodInList = foodList.value.find(item => item.id === foodItem.id)
    if (foodInList) {
      foodInList.number = foodInList.number-1
    }
  }

  // 更新商品数量
  const updateQuantity = (foodItem, quantity) => {
    const item = selectedFoodList.value.find(
      item => item.id === foodItem.id && 
             item.selectedOptions?.join(',') === foodItem.selectedOptions?.join(',')
    )
    
    if (item) {
      if (quantity <= 0) {
        removeFromCart(foodItem)
      } else {
        item.quantity = quantity
        localStorage.setItem('selectedFoodList', JSON.stringify(selectedFoodList.value))
        updateTotalPrice()
      }
    }
  }

  // 更新商品备注
  const updateRemark = (foodItem, remark) => {
    const item = selectedFoodList.value.find(
      item => item.id === foodItem.id && 
             item.selectedOptions?.join(',') === foodItem.selectedOptions?.join(',')
    )
    
    if (item) {
      item.remark = remark
      localStorage.setItem('selectedFoodList', JSON.stringify(selectedFoodList.value))
    }
  }

  // 更新总价
  const updateTotalPrice = () => {
    totalPrice.value = selectedFoodList.value.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price || 0)
      const itemQuantity = parseInt(item.number || 0)
      return sum + (itemPrice * itemQuantity)
    }, 0)
    
    totalPrice.value = Math.round(totalPrice.value * 100) / 100
    localStorage.setItem('totalPrice', totalPrice.value.toString())
  }

  // 设置小料列表
  const setIngredientList = (value) => {
    ingredientList.value = value
    localStorage.setItem('ingredientList', JSON.stringify(value))
  }

  // 切换小料选择状态
  const toggleIngredient = (ingredientId) => {
    const ingredient = ingredientList.value.find(item => item.id === ingredientId)
    if (ingredient) {
      ingredient.selected = !ingredient.selected
      localStorage.setItem('ingredientList', JSON.stringify(ingredientList.value))
    }
  }

  // 清空购物车
  // 修改后的清空购物车
  const clearCart = () => {
    // 1. 清空选中商品列表
    selectedFoodList.value = []
    totalPrice.value = 0
    ingredientList.value = []
    
    // 2. 重置首页所有菜品的计数器 (重要：否则首页角标还在)
    if (foodList.value && foodList.value.length > 0) {
      foodList.value.forEach(item => {
        item.number = 0
      })
      // 同步更新本地存储的 foodList
      localStorage.setItem('foodList', JSON.stringify(foodList.value))
    }
    
    // 3. 移除相关的本地存储
    localStorage.removeItem('selectedFoodList')
    localStorage.removeItem('totalPrice')
    localStorage.removeItem('ingredientList')
    
    console.log('购物车及计数器已清空')
  }

  // 获取购物车摘要
  const getCartSummary = () => {
    return {
      totalCount: cartTotalCount.value,
      totalPrice: totalPrice.value,
      items: selectedFoodList.value,
      ingredients: selectedIngredients.value
    }
  }

  // 从本地存储恢复购物车状态
  const restoreCartState = () => {
    try {
      const savedFoodList = localStorage.getItem('foodList')
      const savedOrderList = localStorage.getItem('orderList')
      const savedSelectedList = localStorage.getItem('selectedFoodList')
      const savedTotalPrice = localStorage.getItem('totalPrice')
      const savedIngredientList = localStorage.getItem('ingredientList')
      const savedClassifyList = localStorage.getItem('classifyList')
      
      if (savedFoodList) {
        foodList.value = JSON.parse(savedFoodList)
      }
      
      if (savedOrderList) {
        orderList.value = JSON.parse(savedOrderList)
      }
      
      if (savedSelectedList) {
        selectedFoodList.value = JSON.parse(savedSelectedList)
      }
      
      if (savedTotalPrice) {
        totalPrice.value = Number(savedTotalPrice)
      }
      
      if (savedIngredientList) {
        ingredientList.value = JSON.parse(savedIngredientList)
      }
      if (savedClassifyList) {
        classifyList.value = JSON.parse(savedClassifyList)
      }
    } catch (error) {
      console.error('恢复购物车状态失败:', error)
      // 清除可能损坏的数据
      clearCart()
    }
  }

  // 保存购物车状态到本地存储
  const saveCartState = () => {
    try {
      localStorage.setItem('foodList', JSON.stringify(foodList.value))
      localStorage.setItem('orderList', JSON.stringify(orderList.value))
      localStorage.setItem('selectedFoodList', JSON.stringify(selectedFoodList.value))
      localStorage.setItem('totalPrice', totalPrice.value.toString())
      localStorage.setItem('ingredientList', JSON.stringify(ingredientList.value))
      localStorage.setItem('classifyList', JSON.stringify(classifyList.value))
    } catch (error) {
      console.error('保存购物车状态失败:', error)
    }
  }

  // 自动监听变化并保存（可选）
  watch(
    [selectedFoodList, totalPrice, ingredientList],
    () => {
      saveCartState()
    },
    { deep: true }
  )

  // 初始化时恢复状态
  restoreCartState()

  return {
    // State
    foodList,
    orderList,
    selectedFoodList,
    totalPrice,
    ingredientList,
    classifyList,
    
    // Computed
    cartTotalCount,
    hasItems,
    selectedIngredients,
    
    // Actions
    setFoodList,
    setClassifyList,
    setOrderList,
    deleteFromCart,
    setSelectedFoodList,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateRemark,
    setIngredientList,
    toggleIngredient,
    clearCart,
    getCartSummary,
    restoreCartState,
    saveCartState,
    updateTotalPrice
  }
})