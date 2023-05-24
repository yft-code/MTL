<template>
    <div v-loading="isLoading" style="margin-top: 20px;">   
        <!--本次测试结果-->
        <div v-for="item,index in currentStaticData" :key="item.scene_id" :id="item.scene_id">
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
                        <report-table :table-data="sceneTableData(item)" :isPreview="isPreview" :basicColumnData="handleFieldData(item, 'table')"></report-table>
                        <report-draw :table-data="sceneTableData(item)" :index="index" :basicColumnData="handleFieldData(item, 'draw')"></report-draw>
                    </el-card>
                </div>
            </div>
        </div>
        <div v-if="!currentStaticData || currentStaticData.length === 0" class="remind-div">暂无测试数据，请先在开始页面添加测试记录，完成测试流程！</div>
    </div>
</template>

<script> 
import ReportTable from '@/components/TestReport/PerformanceTestReportPC/ReportTable'
import ReportDraw from '@/components/TestReport/PerformanceTestReportPC/ReportDraw'
export default {
    components: {
        ReportTable,
        ReportDraw,
    },
    data() {
        return {
            isLoading: false,
        }
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        currentStaticData: {
            required: true,
        },
        isPreview: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },
        basicColumnData() {
            return this.$store.getters.getBasicColumnData;
        }
    },
    created() {
    },
    methods: {
        changeExpand(item, index){
            this.$set(this.currentStaticData[index], 'show', !item.show);
        },


        sceneTableData(item){
            let staticData =  this.currentStaticData.filter(i=>{
                return i.scene_id === item.scene_id
            })
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
                        width: '95px',
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

</style>
<style scoped>

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
