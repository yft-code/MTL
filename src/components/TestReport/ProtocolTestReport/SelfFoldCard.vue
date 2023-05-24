<template>  
    <div class="report-card">
        <div class="card-title" @click="show = !show" >
            <div class="title">{{ cardName }}</div>
            <div class="other-span"></div>
            <div class="expand-div" v-if="!isPreview">
                <div class="expand-icon">
                    <i :class="[show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                </div>
                <div class="expand">{{ show ? '收起':'展开' }}</div>
            </div>
            
        </div>
        <div v-if="show" class="card-body">
            <el-card style="margin-top: 10px;">
                <pass-rate ref="passRateRef" v-if="cardName == '测试通过率'" :passRate="passRate"></pass-rate>
                <question-static v-if="cardName == '测试问题统计'" :questionStatic="questionStatic"></question-static>
                <test-record v-if="cardName == '测试情况'" :recordData="recordData"></test-record>
                <question-table style="width:98%; margin:auto;" :isReport="true" v-if="cardName == '问题汇总'" :isChackData="true" :tableData="questionData"></question-table>
            </el-card>
        </div>
    </div>
</template>

<script> 
import PassRate from '@/components/TestReport/ProtocolTestReport/PassRate'
import QuestionStatic from '@/components/TestReport/ProtocolTestReport/QuestionStatic'
import TestRecord from '@/components/TestReport/ProtocolTestReport/TestRecord'
import QuestionTable from '@/components/StartTest/Protocol/QuestionTable'
export default {
    components: {
        PassRate,
        QuestionStatic,
        TestRecord,
        QuestionTable
    },
    data() {
        return {
            show: true,
        }
    },
    props: {
        isPreview: {},
        cardName: {},
        passRate: {},
        questionStatic: {},
        recordData: {},
        questionData: {},
    },
    mounted(){

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
.report-card {
    width: 100%;
    margin-bottom: 20px;
    border-radius: 3px;
    overflow: hidden;
}

.report-card .card-title {
    cursor: pointer;
    height: 48px;
    background: #36495e;
    border: 5px 5px 0 0;
    display: flex;
    flex-direction: row;
}

.report-card .title {
    color: #ffffff;
    font-size: 16px;
    line-height: 48px;
    margin-left: 10px;
}

.report-card .other-span {
    color: #ffffff;
    font-size: 14px;
    line-height: 48px;
    margin-left: 20px;
    flex: 1;
}

.report-card .expand-div {
    display: flex;
    flex-direction: row;
    line-height: 48px;
    margin-right: 20px;
}

.report-card .expand-div .expand {
    color: #ffffff;
}

.report-card .expand-div .expand-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-top: 14px;
    background: #5D6C7D;
    border-radius: 20px;
    text-align: center;
    line-height: 20px;
}

.report-card .card-body {
    background: #FFFFFF; 
    padding: 10px;
}
</style>
