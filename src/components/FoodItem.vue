<template>
    <div class="Box">
        <div class="food_image">
            <img src="../assets/images/20.png" alt="">
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
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.Box{
    background: var(--Color-Background);
    margin-bottom: 10px;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #EFF0F6;
    position: relative;
    display: flex;
}
.food_image{
        width: 100px;
        height: 100px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
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
</style>