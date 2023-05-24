<template>
    <div class="index">
        <div class="banner-div">
            <!-- <el-carousel height="642px" arrow="never">
                <el-carousel-item v-for="(item, index) in carouselData" :key="index">
                    <el-image class="banner" @click="jumpPage(item.url)" :src="item.imgUrl"></el-image>
                </el-carousel-item>
            </el-carousel> -->
            <img :src="carouselData[0].imgUrl" @click="jumpPage(carouselData[0].url)" style="width: 100%;">
        </div>
        <service-advantages />
        <div class="copyright-div">
            <div style="font-weight: 700">雷火测试中心</div>
            <div style="margin-top: 18px;">网易公司版权所有 ©雷火测试中心 Copyright Leihuo. All Rights Reserved</div>
        </div>
    </div>
</template>

<script>
    import serviceAdvantages from '@/components/ProductServices/ExpertCompatibility/ServiceAdvantages.vue'
    export default {
        components: {
            serviceAdvantages
        },
        data() {
            return {
                carouselData: [
                    {
                        url: 'http://10.240.172.31:8788/mtl_test_platform/page/expertServices/compatibility',
                        imgUrl: require('@/assets/img/banner_expertCompatibility.png')
                    }
                ]
            }
        },
        props:{
            
        },
        created(){
        },
        mounted(){
            
        },
        computed:{
            
        },
        watch:{
        },
        methods:{
            jumpPage(url) {
                window.location.href = url;
            }
        },
    }
</script>
    
<style scoped>
    .banner-div {
        width: 100%;
        height: 642px;
    }
    .copyright-div {
        width: 100%;
        margin: 40px 0;
        color: #999999;
        font-size: 14px;
        text-align: center;
    }
</style>

<style>
</style>