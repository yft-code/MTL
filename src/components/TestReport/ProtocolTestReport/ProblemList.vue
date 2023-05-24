<template>
    <div>   
        <self-fold-card :cardName="'P0、P1问题'" :isPreview="isPreview" class="folder-card" :criticalQuestion="criticalQuestion"></self-fold-card>
        <self-fold-card :cardName="'问题汇总'" :isPreview="isPreview" class="folder-card" :questionData="questionData"></self-fold-card>
        <question-level></question-level>
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
        questionData: {},
        criticalQuestion: {},
        isPreview: {},
    },
    computed: {

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
