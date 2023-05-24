<template>
    <div style="margin-top: 10px;">
        <!-- 测试结论 -->
        <el-card style="margin-top:0; background: #fef0ef; margin-bottom: 15px;">
            <span style="fontSize: 18px;">测试结论</span>
            <div style="margin-left: 10px;">
                <span class="comment">{{conclusionData ? conclusionData : '无'}}</span>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
    
        }
    },
    props: {
        conclusionData: {}
    },
    computed: {

    },
    methods: {
        
    },
}
</script>
<style scoped>
.comment{
    white-space:pre-wrap;
    font-size: 14px;
}
</style>