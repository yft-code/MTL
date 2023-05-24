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
            console.log('this.$store.state,',this.$store)
            // // 在页面加载时读取sessionStorage里的状态信息
            // if (sessionStorage.getItem('store')) {
            //     this.$store.replaceState(
            //         Object.assign(
            //             {},
            //             this.$store.state,
            //             JSON.parse(sessionStorage.getItem('store'))
            //         )
            //     )
            //     // 加载完毕
            //     // sessionStorage.removeItem("store")
            // }
        
            // // 在页面刷新时将vuex里的信息保存到sessionStorage里
            // // beforeunload事件在页面刷新时先触发
            // window.addEventListener('beforeunload', () => {
            //     sessionStorage.setItem('store', JSON.stringify(this.$store.state))
            // })

            // this.$publicJS.judgeContact(this);
            // this.$publicJS.judgeAdmin(this);
            // this.$publicJS.judgeMTLAdmin(this);

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
