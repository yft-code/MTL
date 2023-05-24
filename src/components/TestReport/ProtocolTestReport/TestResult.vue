<template>
    <div>   
        
        <!-- 测试通过率 -->
        <self-fold-card v-if="allTestData.number_data" :isPreview="isPreview" :cardName="'测试通过率'" class="folder-card" :passRate="allTestData.number_data"></self-fold-card>
        <!-- 测试问题统计 -->
        <self-fold-card v-if="allTestData.question_static" :isPreview="isPreview" :cardName="'测试问题统计'" class="folder-card" :questionStatic="allTestData.question_static"></self-fold-card>
        <!-- 测试情况 -->
        <self-fold-card v-if="allTestData.record_data" :isPreview="isPreview" :cardName="'测试情况'" class="folder-card" :recordData="allTestData.record_data"></self-fold-card>
        
    </div>
</template>

<script> 
import SelfFoldCard from '@/components/Common/SelfFoldCard'
export default {
    components: {
        SelfFoldCard
    },
    data() {
        return {
            
        }
    },
    props: {
        allTestData: {},
        isPreview: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        }
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
