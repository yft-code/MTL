<template>
    <div class="workstation-content">
        <div class="list-title">最近使用</div>
        <div class="list-container">
            
        </div>
        <div class="list-title">专项测试报告</div>
        <div class="list-container">
            
        </div>
        <div class="list-title">产品测试报告</div>
        <div class="list-container">
            
        </div>
        <div class="list-title">资源使用情况</div>
        <div class="list-container">
            
        </div>
    </div>
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {
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
        },
    }
</script>
    
<style scoped>
    .workstation-content {
        width: 100%;
        flex: 1;
        margin: 20px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
    }
    .list-title {
        padding: 0 20px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        height: 47px;
        width: calc(100% - 40px);
        line-height: 47px;
        background: #fff;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid rgba(97, 119, 255, 0.1);
    }
    .list-container {
        flex: 1;
        overflow: auto;
        margin-top: 47px;
        padding: 20px;
    }
</style>

<style>
</style>