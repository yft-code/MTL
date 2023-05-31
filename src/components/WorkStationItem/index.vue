<template>
    <div class="work-station">
        <sidebar />
        <router-view></router-view>
    </div>
</template>
<script>
    import sidebar from '@/components/Common/Sidebar.vue'
    import workstationContent from '@/components/WorkStationItem/WorkstationContent.vue'
    import serviceOrdersList from '@/components/Common/ServiceOrdersList.vue'
    export default {
        components: {
            workstationContent,
            serviceOrdersList,
            sidebar
        },
        data() {
            return {
                serviceData: {
                    compatibility: {
                        label: '兼容性测试列表',
                        value: 'compatibility'
                    },
                    performance: {
                        label: '性能测试列表',
                        value: 'performance'
                    },
                    privacy: {
                        label: '隐私合规测试列表',
                        value: 'privacy'
                    },
                    protocol: {
                        label: '协议测试列表',
                        value: 'protocol'
                    },
                    weaknet: {
                        label: '弱网测试列表',
                        value: 'weaknet'
                    },
                    preliminary: {
                        label: '预审服务测试列表',
                        value: 'preliminary'
                    },
                }
            }
        },
        props:{
            
        },
        created(){
            if(!this.$store.getters.getIsTester && !this.isAdmin){
                this.$store.commit("setPageIsLoading", true);
                this.$router.push({
                    path: '/mtl_test_platform/page/index',
                    query: { project: this.project }
                })
                setTimeout(() => {
                    this.$message.error("您没有权限访问此界面，将为您跳转到首页！");
                }, 1000)
            }
        },
        mounted(){
            
        },
        computed:{
            curType() {
                let query = this.$route.query;
                let type = this.$route.query.type;
                console.log('type',type);
                return type;
            },
            isTester() {
                return this.$store.getters.getIsTester
            },
            isAdmin() {
                return this.$store.getters.getIsAdmin
            },
        },
        watch:{
        },
        methods:{
            
        },
    }
</script>
    
<style scoped>
    .work-station {
        height: calc(100% - 64px);
        width: 100%;
        display: flex;
        background: #E5E5E5;
        margin-top: 64px;
    } 
</style>

<style>
</style> 