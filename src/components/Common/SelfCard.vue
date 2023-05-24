<template>  
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <div class="decorate-div"></div>
            <div class="decorate-title">
                {{ cardName }}
            </div>
        </div>
        <div class="card-content-div">
            <pass-rate ref="passRateRef" v-if="cardName == '测试通过率'" :passRate="passRate" :questionData="questionData"></pass-rate>
            <test-record v-if="cardName == '测试协议'" :recordData="recordData"></test-record>
            <level-table :isReport="true" v-if="cardName == 'P0、P1问题'" :isChackData="true" :tableData="criticalQuestion"></level-table>
            <question-detail v-if="cardName == '问题详情' && recordData" :tableData="recordData"></question-detail>
        </div>
    </el-card>
    <!-- <div class="report-card">
        <el-card class="type-card">
            <div class="item-title">
                {{ cardName }}
            </div>
            <div>
                <pass-rate ref="passRateRef" v-if="cardName == '测试通过率'" :passRate="passRate" :questionData="questionData"></pass-rate>
                <test-record class="static-table-div" v-if="cardName == '测试协议'" :recordData="recordData"></test-record>
                <level-table class="static-table-div" :isReport="true" v-if="cardName == 'P0、P1问题'" :isChackData="true" :tableData="criticalQuestion"></level-table>
                <question-detail class="static-table-div" v-if="cardName == '问题详情' && recordData" :tableData="recordData"></question-detail>
            </div>
        </el-card>
    </div> -->
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
.type-card {
    margin-top: 18px;
}
.item-title {
    font-size: 18px;
    margin-left: 12px;
    /*
    margin-top: 5px;
    */
    .title-content {
        margin-left: 5px;
        color: #666666;
        font: 16px 'Microsoft YaHei';
    }
}
.static-table-div {
    margin-left: 26px;
    margin-top: 15px;
}
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}
.edit-icon {
    color: #4876F2;   
    font-weight: bold;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    margin-left: -3px;
    margin-top: -3px;
}
.decorate-div {
    width: 3px;
    height: 20px;
    background: #4876f2;
    display: inline-block;
    margin-right: 8px;
    vertical-align: sub;
}

.decorate-title {
    display: inline-block;
    color: #333333;
    font-size: 20px;
}
</style>
