<template>
    <div v-loading="isLoading" style="margin-top: 20px;">   
        <!--对比测试-->
        <div v-for="item,index in compareData" :key="item.scene_id" :id="item.scene_id">
            <div class="report-card">
                <div class="card-title" @click="changeExpand(item,index)" >
                    <div class="title">{{ item.scene_name }}</div>
                    <div class="other-span"></div>
                    <div class="expand-div" v-if="!isPreview">
                        <div class="expand-icon">
                            <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                        </div>
                        <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                    </div>
                    
                </div>
                <div v-if="item.show" class="card-body">
                    <el-card style="margin-top: 10px;">
                        <compare-message :compareMessageData="compareMessageData(item)"></compare-message>
                    </el-card>
                    <el-card style="margin-top: 10px;">
                        <report-table :table-data="sceneTableData(item)" :isPreview="isPreview" :basicColumnData="handleFieldData(item,'table')"></report-table>
                        <compare-draw :table-data="sceneTableData(item)" :index="index" :basicColumnData="handleFieldData(item, 'draw')"></compare-draw>
                    </el-card>
                </div>
            </div>
        </div>
        <div v-if="!compareData || compareData.length === 0" class="remind-div">没有对比报告，请先在开始页面选择对比测试记录，完成测试流程！</div>
    </div>
</template>

<script> 
import ReportTable from '@/components/TestReport/PerformanceTestReportPC/ReportTable'
import CompareDraw from '@/components/TestReport/PerformanceTestReportPC/CompareDraw'
import CompareMessage from '@/components/TestReport/PerformanceTestReportPC/CompareMessage'
export default {
    components: {
        ReportTable,
        CompareDraw,
        CompareMessage
    },
    data() {
        return {
            isLoading: false,
            currentTestScenes: [],
            currentTestDatas: [],
            expandList: [],
        }
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        compareData: {
            required: true,
        },
        isPreview: {},
        compareMesg: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },
        basicColumnData() {
            return this.$store.getters.getBasicColumnData;
        }
    },
    methods: {

        changeExpand(item, index){
            this.$set(this.compareData[index], 'show', !item.show);
        },

        compareMessageData(item){
            let filedDataList = this.handleFieldData(item, 'table')
            let compareFiledList = []
            filedDataList.forEach(field => {
                if(field.propName !== 'date' && field.propName !== 'pease_link'){
                    compareFiledList.push(field.titleName.split('(')[0])
                }
            })
            // console.log(this.compareMesg[item.scene_name])
            let msg = []
            this.compareMesg[item.scene_name].forEach(m => {
                let msgItem = {}
                msgItem['key'] = m.key
                msgItem['msg'] = []
                m.msg.forEach(mItem => {
                    // console.log(mItem)
                    if(compareFiledList.indexOf(mItem.split('降低')[0]) !== -1 || compareFiledList.indexOf(mItem.split('升高')[0]) !== -1){
                        msgItem['msg'].push(mItem)
                    }
                })
                msg.push(msgItem)
            })
            return msg
            // return this.compareMesg[item.scene_name]
        },


        sceneTableData(item){
            let staticData =  this.compareData.filter(i=>{
                return i.scene_name === item.scene_name
            })[0].records
            let field = this.handleFieldData(item, "table")
            // console.log(staticData, item.scene_name)
            // console.log(field, item.scene_name)
            let data = []
            staticData.forEach(record => {
                let recordData = {}
                field.forEach(fieldItem => {               
                    recordData[fieldItem.propName] = record[fieldItem.propName]
                })
                data.push(recordData)
            })
            return data
        },

        handleFieldData(item, msg){
            let fieldData = []
            if(msg === "table"){
                fieldData.push(
                    {
                        titleName: '测试时间',
                        propName: 'date',
                        width: '100px',
                    }
                )
            }
            if(item.field_name && item.field_name !== 'null'){
                this.basicColumnData.forEach(field => {
                    if(item.field_name.indexOf(field.titleName) !== -1){
                        fieldData.push(field)
                    }
                })
            }else{
                fieldData = fieldData.concat(this.basicColumnData)
            }
            if(msg == "table"){
                fieldData.push({
                    titleName: 'PEase链接',
                    propName: 'pease_link',
                })
            }
            return fieldData
        }
    },

}
</script>
<style lang="less" scoped>
.decorate-title {
    display: inline-block;
    color: #ffffff;
    font-size: 16px;
}
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__header {
    background-color: #36495e;
    padding: 10px 20px;
}

.expand-retract-div{
    float: right;
    color: #ffffff;
    cursor: pointer;
}

.title-expand-icon {
    float: right;
    color: #ffffff;
    font-size: 18px;
}

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
    padding: 20px;
}
.remind-div{
    text-align: center;
    margin-top: 2rem;
}
</style>
