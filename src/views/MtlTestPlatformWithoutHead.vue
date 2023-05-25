<template>
    <div style="height:100%">
        <el-container style='height:100%; position:relative' direction='vertical'>
            <leihuoWebFeedback :configs="{
                custom: [{
                    key: '开发',
                    value: [
                        {
                            name: '汤春晨',
                            mail: 'tangchunchen@corp.netease.com'
                        },
                        {
                            name: '徐婷婷',
                            mail: 'xutingting06@corp.netease.com'
                        }
                    ]
                }],
            }"/>
            
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
    

</template>

<script>
    import $ from 'jquery'
    export default {
        data() {
            return {
                
            }
        },
        components: {
        },
        methods:{

        },
        created(){
        },
        mounted(){
            
        },
        computed:{
        },
        watch:{
            $route(to, from) {
                if (to.path != "/mtl_test_platform/page/index") {
                    this.$store.commit("setPageIsLoading", true);
                }
                // if (this.$store.getters.getProjectCode) {
                //     this.$publicJS.judgeAdmin(this);
                //     this.$publicJS.judgeMTLAdmin(this);
                //     this.$publicJS.judgeContact(this);
                // }
            },
        }
    }
</script>

<style scoped>
    .el-main {
        width: 100%;
        padding: 0;
        /*
        background: #ffffff;
        */
        background: #f3f4f6;
    }
</style>
<style>
    ul li{
        list-style: none;
    }
    /****************** 滚动条 ******************/
    ::-webkit-scrollbar{
        background:#fff;
        border-radius: 8px;
        width: 10px;
        height: 10px;
    }
    ::-webkit-scrollbar-track{
        background:#fff;
        border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb,::-webkit-scrollbar-corner{
        background: #fff;
        border-radius: 8px;
        border: 10px solid #c8c8c8;
    }
    .copyright-div {
        width: 100%;
        margin: 40px 0;
        color: #999999;
        font-size: 14px;
        text-align: center;
    }
</style>