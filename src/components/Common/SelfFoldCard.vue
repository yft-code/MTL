<template>  
    <div class="report-card">
        <div class="card-title" @click="show = !show" >
            <div class="title">{{ cardName }}</div>
            <div class="other-span"></div>
            <div v-if="!isPreview" class="expand-div">
                <div class="expand-icon">
                    <i :class="[show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                </div>
                <div class="expand">{{ show ? '收起':'展开' }}</div>
            </div>
        </div>
        <div v-if="show" class="card-body">
            <el-card style="margin: 5px;">
                <pass-rate 
                    v-if="cardName == '测试通过率'" 
                    ref="passRateRef"  
                    :passRate="passRate"
                >
                </pass-rate>
                <question-static v-if="cardName == '测试问题统计'" :questionStatic="questionStatic"></question-static>
                <test-record v-if="cardName == '测试情况'" :recordData="recordData"></test-record>
                <test-record v-if="cardName == '测试协议'" :recordData="recordData"></test-record>
                <question-table
                    v-if="cardName == '问题汇总'"  
                    style="width:98%; margin:auto;" 
                    :isReport="true" 
                    :isChackData="true" 
                    :tableData="questionData"
                >
                </question-table>
                <question-detail v-if="cardName == '问题详情' && recordData" :tableData="recordData"></question-detail>
                <level-table
                    v-if="cardName == 'P0、P1问题'" 
                    :isReport="true"  
                    :isChackData="true" 
                    :tableData="criticalQuestion"
                >
                </level-table>
            </el-card>
        </div>
    </div>
</template>

<script> 
import PassRate from '@/components/TestReport/ProtocolTestReport/PassRate'
import QuestionStatic from '@/components/TestReport/ProtocolTestReport/QuestionStatic'
import TestRecord from '@/components/TestReport/ProtocolTestReport/TestRecord'
import QuestionTable from '@/components/StartTest/Protocol/QuestionTable'
import LevelTable from '@/components/TestReport/ProtocolTestReport/LevelTable'
import QuestionDetail from '@/components/TestReport/ProtocolTestReport/QuestionDetail'
export default {
    components: {
        PassRate,
        QuestionStatic,
        TestRecord,
        QuestionTable,
        LevelTable,
        QuestionDetail
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
        criticalQuestion: {}
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
