<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        components:{
        },
        data(){
            return {
                test: 'test'
            }
        },
        methods:{
            
        },
        mounted(){
        },
        created(){
        },
        computed:{
        }
    }
</script>

<style lang="less">
    *{
        margin: 0;
        padding: 0;
        font-size:"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif
    }
    html,body{
        width: 100%;
        height: 100%;
        background: #f8f8f8 !important;
    }
    html,body,#app,.el-container{
        padding: 0px;
        margin: 0px;
        height: 100%;
    }
</style>
