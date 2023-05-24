<template>
    <div style="margin-top: 80px;">
        <div class="container">
            <!-- 面包屑 -->
            <div style="margin-bottom: 1rem; margin-top: 80px;">
                <span @click="jumpPage()" style="cursor:pointer">工作站</span>
                &nbsp;
                <i class="el-icon-arrow-right"></i> 
                &nbsp;
                <span class="blue-span">八周性能监控</span>
            </div>
            
            <!-- 各个项目组具体周包月包信息 -->

        </div>
        
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {

        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    created() {},
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        //跳转到工作站
        jumpPage() {
            this.$router.push({
                path: '/mtl_test_platform/page/workstation/myMission',
                query: { project: this.projectCode }
            })
        },
    }
}
</script>

<style scoped>

</style>

