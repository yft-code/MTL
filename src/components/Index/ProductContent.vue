<template>
    <div class="product-div">
        <div class="product-title">MTL提供高效、稳定、安全的测试产品</div>
        <div class="product-content">
            <div
                v-for="productItem in productInfo"
                :key="productItem.type"
                class="product-type-content"
                :class="productItem.type === curProductType ? 'cur-product-type' : ''"
                @mouseenter="changeCurProductType(productItem.type)"
            >
                <img :src="productItem.img">
                <span>{{productItem.type}}</span>
            </div>
        </div>
        <div class="product-item-container">
            <div
                v-for="listItem in curProductList"
                :key="listItem.name"
                class="product-item-content"
            >
                <div class="product-item-title">{{listItem.name}}</div>
                <div class="product-item-des">{{listItem.detailDes}}</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {
                curProductType: ''
            }
        },
        props:{
            
        },
        created(){
        },
        mounted(){
            
        },
        computed:{
            productInfo() {
                let res = this.$store.state.menuData.product;
                this.curProductType = res.length > 0 ? res[0].type : ''; 
                return res;
            },
            curProductList() {
                let res = this.$store.state.menuData.product.filter(item => item.type === this.curProductType);
                return res.length > 0 ? res[0].list : [];
            }
        },
        watch:{
        },
        methods:{
            changeCurProductType(type) {
                this.curProductType = type;
            }
        },
    }
</script>
    
<style scoped>
    .product-div {
        padding-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(180deg, #F4F8FF 0%, rgba(255, 255, 255, 0) 100%);
    }
    .product-title {
        font-size: 32px;
        font-weight: 700;
        color: #333333;
    }
    .product-content {
        display: flex;
        align-items: center;
        margin-top: 35px;
    }
    .product-type-content {
        width: 144px;
        height: 154px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 168px;
        cursor: pointer;
    }
    .product-type-content:last-child {
        margin-right: 0;
    }
    .product-type-content span {
        margin-top: 15px;
        font-size: 14px;
        color: #666666;
    }
    .cur-product-type {
        border-bottom: 2px solid #156EEF;
    }
    .cur-product-type span{
        color: #333333;
        font-size: 16px;
        font-weight: 700;
    }
    .product-item-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-top: 1px solid rgba(97, 119, 255, 0.05);
        border-bottom: 1px solid rgba(97, 119, 255, 0.05);
        margin-top: 20px;
        width: calc(100% - 720px);
    }
    .product-item-content {
        width: 346px;
        height: 160px;
        background: #fff;
        margin-top: 40px;
        margin-right: 50px;
        border-radius: 4px;
        cursor: pointer;
    }
    .product-item-content:hover {
        box-shadow: 0px 6px 30px rgba(21, 110, 239, 0.15);
    }
    .product-item-title {
        font-size: 14px;
        font-weight: 700;
        color: #666666;
        padding: 30px 30px 0 30px;
    }
    .product-item-des {
        margin-top: 20px;
        font-size: 14px;
        color: #999999;
        padding: 0 30px 30px 30px;
    }
</style>

<style>
</style>