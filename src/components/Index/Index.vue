<template>
    <div class="index">
        <div class="banner-div">
            <el-carousel height="642px" arrow="never">
                <el-carousel-item v-for="(item, index) in carouselData" :key="index">
                    <el-image class="banner" @click="jumpPage(item.url)" :src="item.imgUrl"></el-image>
                </el-carousel-item>
            </el-carousel>
        </div>
        <product-content />
        <solution-content />
        <project-list />
        <div class="copyright-div">
            <div style="font-weight: 700">雷火测试中心</div>
            <div style="margin-top: 18px;">网易公司版权所有 ©雷火测试中心 Copyright Leihuo. All Rights Reserved</div>
        </div>
    </div>
</template>

<script>
    import productContent from '@/components/Index/ProductContent.vue'
    import solutionContent from '@/components/Index/SolutionContent.vue'
    import projectList from '@/components/Index/ProjectList.vue'
    export default {
        components: {
            productContent,
            solutionContent,
            projectList
        },
        data() {
            return {
                carouselData: [
                    {
                        url: 'http://mtl-index.leihuo.netease.com:30050/mtl_index/page/index',
                        imgUrl: require('@/assets/img/mtl_banner.jpg')
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
            jumpPage(url){
                // alert(1)
                window.location.href = url
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