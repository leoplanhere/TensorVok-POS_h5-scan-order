<template>
    <div class="food-classify">
        <div class="food-lists">
            <div class="food-item active">
                <img src="../../assets/images/foodItem.png" alt="">
                <div class="food-name">Chinese Food</div>
            </div>
            <div class="food-item">
                <img src="../../assets/images/foodItem.png" alt="">
                <div class="food-name">Chinese Food</div>
            </div>
            <div class="food-item">
                <img src="../../assets/images/foodItem.png" alt="">
                <div class="food-name">Chinese Food</div>
            </div>
            <div class="food-item">
                <img src="../../assets/images/foodItem.png" alt="">
                <div class="food-name">Chinese Food</div>
            </div>
            <div class="food-item">
                <img src="../../assets/images/foodItem.png" alt="">
                <div class="food-name">Chinese Food</div>
            </div>
            <div class="food-item">
                <img src="../../assets/images/foodItem.png" alt="">
                <div class="food-name">Chinese Food</div>
            </div>
        </div>
    </div>
    <div class="food-type">
        <div class="veg active">
            <img src="../../assets/images/Noveg.png" alt="">
            No-Veg
            <div class="close-icon"><van-icon name="close" /></div>
        </div>
        <div class="veg">
            <img src="../../assets/images/veg.png" alt="">
            veg
            <div class="close-icon"><van-icon name="close" /></div>
        </div>
    </div>
    <div class="caipin">
        <div class="caipin-header flexBox">
            <h3>All Items</h3>
            <ul class="flex">
                <li>
                    <img src="../../assets/icons/one_nor.png" alt="">
                </li>
                <li>
                    <img src="../../assets/icons/two_sel.png" alt="">
                </li>
                <li>
                    <img src="../../assets/icons/three_nor.png" alt="">
                </li>
            </ul>
        </div>
        <ul class="caipin-list">
            <li class="caipin-item active">
                <div class="caipin-img">
                    <img src="../../assets/images/food.png" alt="">
                </div>
                <div class="food-information">
                <h5 class="ellipsis2">Spicy pot corn, super fried rice, corn, braised chicken...</h5>
                <!-- <p>introduction  of  this course...</p> -->
                <div class="food-price flexBox">
                        <div class="price"><span class="price-num">$58</span><span class="OldPrice">$88</span></div>
                        <div class="add-cart flexBox">
                            <div class="reduce"><van-icon name="minus" /></div>
                            <div class="num">1</div>
                            <div class="plus"><van-icon name="plus" /></div>
                        </div>

                    </div>
                </div>
                <div class="addCart">
                    <van-icon name="plus" />
                </div>
            </li>
            <li class="caipin-item">
                <div class="caipin-img">
                    <img src="../../assets/images/food.png" alt="">
                </div>
                <div class="food-information">
                <h5 class="ellipsis2">Spicy pot corn, super fried rice, corn, braised chicken...</h5>
                <!-- <p>introduction  of  this course...</p> -->
                <div class="food-price flexBox">
                        <div class="price"><span class="price-num">$58</span><span class="OldPrice">$88</span></div>
                        <div class="add-cart flexBox">
                            <div class="reduce"><van-icon name="minus" /></div>
                            <div class="num">1</div>
                            <div class="plus"><van-icon name="plus" /></div>
                        </div>

                    </div>
                </div>
                <div class="addCart">
                    <van-icon name="plus" />
                </div>
            </li>
            <li class="caipin-item">
                <div class="caipin-img">
                    <img src="../../assets/images/food.png" alt="">
                </div>
                <div class="food-information">
                <h5 class="ellipsis2">Spicy pot corn, super fried rice, corn, braised chicken...</h5>
                <!-- <p>introduction  of  this course...</p> -->
                <div class="food-price flexBox">
                        <div class="price"><span class="price-num">$58</span><span class="OldPrice">$88</span></div>
                        <div class="add-cart flexBox">
                            <div class="reduce"><van-icon name="minus" /></div>
                            <div class="num">1</div>
                            <div class="plus"><van-icon name="plus" /></div>
                        </div>

                    </div>
                </div>
                <div class="addCart">
                    <van-icon name="plus" />
                </div>
            </li>
            <li class="caipin-item">
                <div class="caipin-img">
                    <img src="../../assets/images/food.png" alt="">
                </div>
                <div class="food-information">
                <h5 class="ellipsis2">Spicy pot corn, super fried rice, corn, braised chicken...</h5>
                <!-- <p>introduction  of  this course...</p> -->
                <div class="food-price flexBox">
                        <div class="price"><span class="price-num">$58</span><span class="OldPrice">$88</span></div>
                        <div class="add-cart flexBox">
                            <div class="reduce"><van-icon name="minus" /></div>
                            <div class="num">1</div>
                            <div class="plus"><van-icon name="plus" /></div>
                        </div>

                    </div>
                </div>
                <div class="addCart">
                    <van-icon name="plus" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

.food-lists{
    padding: 0 15px;
    padding-bottom: 10px;
    margin-top:-10px ;
    text-align: left;
    white-space: nowrap;
    overflow-x: auto;
    .food-item{
        display: inline-block;
        width: 120px;
        text-align: center;
        margin-right: 5px;
        border-radius: 15px 15px 15px 15px;
        border: 1px solid ;
        background-color: var(--Color-Background);
        padding: 10px;
        .food-name{
            margin-top: 15px;
            font-size: 12px;
            color: var(--Color-Font);
        }
        img{
            width: 50px;
            height: 50px;
            margin: auto;
        }
    }
    .food-item:last-child{
        margin-right: 0;
    }
    .food-item.active{
        border-color: #444DFA;
        .food-name{
            font-weight: bold;
            color: #444DFA;
        }
    }
}

.food-type{
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    padding: 0 15px;
    margin-bottom: 30px;
    .veg{
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        background: var(--Color-Background);
        border-radius: 32px 32px 32px 32px;
        font-size: 12px;
        color: var(--Color-Font);
        border: 1px solid;
        img{
            width: 16px;
        }
    }
    .veg.active {
        border-color: #0E57E2;
        .close-icon{
           display: block; 
        }
        
    }
    .close-icon{
        margin-left: 10px;
        color: #EB362A;
        display: none;
    }
}

.caipin-header{
    padding: 0 15px;
    margin-bottom: 10px;
    justify-content: space-between;
    h3{
        font-weight: bold;
        font-size: 18px;
        color: var(--Color-Font);
    }
    ul{
        gap: 10px;
        align-items: center;
        li{
            border-radius: 50%;
            background: #F3F5F9;
            text-align: center;
        }
    }
}
.caipin{
    padding: 0 10px;
    color: var(--Color-Font);
}
.caipin-list li{
    background: var(--Color-Background);
    margin-bottom: 0;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #EFF0F6;
    position: relative;
    text-align: center;
    padding: 10px       ;
    height: fit-content;
    .caipin-img{
        text-align: center;
        width: 100%;
        border-radius: 15px 15px 15px 15px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
            max-width: 100%;
            object-fit: cover;
            margin: auto;
        }
    }
    .addCart{
        background: #444DFA;
        border-radius: 15px 0px 15px 0px;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 7px 10px;
        color: white;
    }
    .food-information{
        flex: 1;
        padding: 10px;
        padding-bottom: 0;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .food-price{
            .price{
                font-size: 12px;
                .price-num{
                    color: #E63700;
                    font-weight: bold;
                    font-size: 16px;
                }
                .OldPrice{
                    margin-left: 5px;
                    color: #999999;
                    text-decoration: line-through;
                }
            }
        }
        h5{
            font-weight: 400;
            font-size: 13px;
            color: #111111;

        }
        // p{
        //     color: #999999;
        // }
        .reduce,.plus{
            width: 24px;
            height: 24px;
            border-radius: 6px;
            text-align: center;
            line-height: 24px;
            color: var(--Color-Font);
            border: 1px solid #444DFA;
            
        }
        .add-cart{
            display: none;
        }
        
        .num{
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            color: var(--Color-Font);
        }
        .plus{
            background-color: #444DFA;
            color: white;
        }
        .reduce{
            background-color: white;
            color: #444DFA;
        }
    }
}
.caipin-list li.active .addCart{
    display: none;
}
.caipin-list li.active .food-information .add-cart{
    display: flex;
}

.caipin{
    flex: 1;
    display: flex;
    flex-direction: column;
    .caipin-list{
        flex: 1;
        overflow-y: auto;
        max-height: 34vh;
        display: grid;
        grid-template-columns: repeat(2, calc(50% - 5px));
        gap: 10px;
    }
}
</style>