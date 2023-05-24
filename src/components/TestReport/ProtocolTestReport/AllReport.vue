<template>
    <div>   
        
        <!-- 测试通过率 -->
        <self-fold-card v-if="allTestData.number_data" :isPreview="isPreview" :cardName="'测试通过率'" class="folder-card" :passRate="allTestData.number_data"></self-fold-card>
        <!-- 测试问题统计 -->
        <!-- <self-fold-card v-if="allTestData.question_static" :isPreview="isPreview" :cardName="'测试问题统计'" class="folder-card" :questionStatic="allTestData.question_static"></self-fold-card> -->
        <self-fold-card :cardName="'测试协议'" :isPreview="isPreview" class="folder-card" :recordData="allTestData.record_data"></self-fold-card>
        <self-fold-card v-if="criticalQuestion" :cardName="'P0、P1问题'" :isPreview="isPreview" class="folder-card" :criticalQuestion="criticalQuestion"></self-fold-card>
        <!-- 测试情况 -->
        <!-- <self-fold-card v-if="allTestData.record_data" :isPreview="isPreview" :cardName="'测试情况'" class="folder-card" :recordData="allTestData.record_data"></self-fold-card> -->
        <!-- <self-fold-card :cardName="'问题汇总'" :isPreview="isPreview" class="folder-card" :questionData="questionData"></self-fold-card> -->
        <self-fold-card :cardName="'问题详情'" :isPreview="isPreview" class="folder-card" :recordData="allTestData.record_data"></self-fold-card>

        <question-level></question-level>
        <div style="height: 20px;"></div>
        
    </div>
</template>

<script> 
import SelfFoldCard from '@/components/Common/SelfFoldCard'
import QuestionLevel from '@/components/TestReport/ProtocolTestReport/QuestionLevel'
export default {
    components: {
        SelfFoldCard,
        QuestionLevel
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
        // getCardName(){
        //     if(this.criticalQuestion['P0'].length == 0 && this.criticalQuestion['P1'].length == 0){
        //         return 'P0、P1问题(无)'
        //     }else{
        //         return 'P0、P1问题'
        //     }
        // }
    },
    created() {
    },
    methods: {
        // getCardName(){
        //     // if(this.criticalQuestion['P0'].length == 0 && this.criticalQuestion['P1'].length == 0){
        //     //     return 'P0、P1问题(无)'
        //     // }else{
        //     //     return 'P0、P1问题'
        //     // }
        //     return 'P0、P1问题'
        // }
    },

}
</script>

<style scoped>
.folder-card{
    margin-top: 15px;
}
</style>
