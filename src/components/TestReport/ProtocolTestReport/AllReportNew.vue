<template>
    <div>   
        
        <!-- 测试通过率 -->
        <self-card v-if="allTestData.number_data" :isPreview="isPreview" :cardName="'测试通过率'" class="folder-card" :questionData="questionData" :passRate="allTestData.number_data"></self-card>
        <!-- 测试问题统计 -->
        <self-card :cardName="'测试协议'" :isPreview="isPreview" class="folder-card" :recordData="allTestData.record_data"></self-card>
        <!-- P0、P1问题 -->
        <self-card v-if="criticalQuestion" :cardName="'P0、P1问题'" :isPreview="isPreview" class="folder-card" :criticalQuestion="criticalQuestion"></self-card>
        <!-- 测试情况 -->
        <self-card :cardName="'问题详情'" :isPreview="isPreview" class="folder-card" :recordData="allTestData.record_data"></self-card>

        <question-level style="margin-top: 15px;"></question-level>
        <div style="height: 20px;"></div>
        
    </div>
</template>

<script> 
import QuestionLevel from '@/components/TestReport/ProtocolTestReport/QuestionLevel'
import SelfCard from '@/components/Common/SelfCard'
export default {
    components: {
        QuestionLevel,
        SelfCard,
    },
    data() {
        return {
            
        }
    },
    props: {
        allTestData: {},
        questionData: {},
        criticalQuestion: {},
        isPreview: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },

    },
    created() {
    },
    methods: {

    },

}
</script>

<style scoped>
.folder-card{
    margin-top: 15px;
}
</style>
