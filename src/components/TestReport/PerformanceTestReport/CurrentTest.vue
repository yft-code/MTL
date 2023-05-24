<template>
    <div v-loading="isLoading" style="margin-top: 10px;margin-bottom: 40px;">
        <div v-if="!isPreview">
            <el-radio-group v-model="platformType" style="margin-bottom: 10px;">
                <el-radio-button :label="0">Android</el-radio-button>
                <el-radio-button :label="1">IOS</el-radio-button>
            </el-radio-group>
            <div v-if="platformType==0">
                <!-- Android备注 -->
                <remark :isPreview="isPreview" :type="'android'" :taskDetail="taskDetail" :updateUrl="'/mobilePerfTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark"></remark>
                <div v-for="item,index in currentStaticData.android" :key="item.scene_id" :id="item.scene_id">
                    <div class="report-card">
                        <div class="card-title" @click="changeExpand(item,index,'android')" >
                            <div class="title">{{ item.first_name }}</div>
                            <div class="other-span"></div>
                            <div class="expand-div" v-if="!isPreview">
                                <div class="expand-icon">
                                    <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                                </div>
                                <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                            </div>
                        </div>
                        <div v-if="item.show" class="card-body" style="background: #ffffff;">
                            <el-card v-for="v,k,i in item.next_name" :key="index+'_'+i+'_'+k" :style="i !== 0 ? {'margin-top': '10px'} : {}">
                                <!-- {{k}} -->
                                <report-table :table-data="sceneTableData(item, k)" :isPreview="isPreview" :basicColumnData="getFieldData(item,k,'table')"></report-table>
                                <report-draw :table-data="sceneTableData(item, k)" :index="index+'_'+i+'_'+k" :basicColumnData="getFieldData(item, k,'draw')"></report-draw>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="platformType==1">
                <!-- IOS备注 -->
                <remark :isPreview="isPreview" :type="'ios'" :taskDetail="taskDetail" :updateUrl="'/mobilePerfTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark"></remark>
                <div v-for="item,index in currentStaticData.ios" :key="item.scene_id" :id="item.scene_id">
                    <div class="report-card">
                        <div class="card-title" @click="changeExpand(item,index, 'ios')" >
                            <div class="title">{{ item.first_name }}</div>
                            <div class="other-span"></div>
                            <div class="expand-div" v-if="!isPreview">
                                <div class="expand-icon">
                                    <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                                </div>
                                <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                            </div>
                        </div>
                        <div v-if="item.show" class="card-body" style="background: #ffffff;">
                            <el-card v-for="v,k,i in item.next_name" :key="index+'_'+i+'_'+k" :style="i != 0 ? {'margin-top': '10px'} : {}">
                                <report-table :table-data="sceneTableData(item, k)" :isPreview="isPreview" :basicColumnData="getFieldData(item,k,'table')"></report-table>
                                <report-draw :table-data="sceneTableData(item, k)" :index="index+'_'+i+'_'+k" :basicColumnData="getFieldData(item,k, 'draw')"></report-draw>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="type-div">Android性能</div>
            <!-- Android备注 -->
            <remark :isPreview="isPreview" :type="'android'" :taskDetail="taskDetail" :updateUrl="'/mobilePerfTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark"></remark>
            <div v-for="item,index in currentStaticData.android" v-if="currentStaticData.android" :key="item.scene_id" :id="item.scene_id">
                <div class="report-card">
                    <div class="card-title" @click="changeExpand(item,index,'android')" :style="isPreview ? {background: '#e7e9ee'}:{}">
                        <div class="title" :style="isPreview ? {color:'#414350'}:{}">{{ item.first_name }}</div>
                        <div class="other-span"></div>
                        <div class="expand-div" v-if="!isPreview">
                            <div class="expand-icon">
                                <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                            </div>
                            <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                        </div>
                        
                    </div>
                    <div v-if="item.show" class="card-body" style="background: #ffffff;">
                        <el-card v-for="v,k,i in item.next_name" :key="index+'_'+i+'_'+k" :style="i !== 0 ? {'margin-top': '10px'} : {}">
                            <report-table :table-data="sceneTableData(item, k)" :isPreview="isPreview" :basicColumnData="getFieldData(item,k,'table')"></report-table>
                            <report-draw :table-data="sceneTableData(item, k)" :index="index+'_'+i+'_'+k" :basicColumnData="getFieldData(item,k, 'draw')"></report-draw>
                        </el-card>
                    </div>
                </div>
            </div>
            <div class="type-div">IOS性能</div>
            <!-- IOS备注 -->
            <remark :isPreview="isPreview" :type="'ios'" :taskDetail="taskDetail" :updateUrl="'/mobilePerfTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark"></remark>
            <div v-for="item,index in currentStaticData.ios" v-if="currentStaticData.ios" :key="item.scene_id" :id="item.scene_id">
                <div class="report-card">
                    <div class="card-title" @click="changeExpand(item,index,'ios')" :style="isPreview ? {background: '#e7e9ee'}:{}">
                        <div class="title" :style="isPreview ? {color:'#414350'}:{}">{{ item.first_name }}</div>
                        <div class="other-span"></div>
                        <div class="expand-div" v-if="!isPreview">
                            <div class="expand-icon">
                                <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                            </div>
                            <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                        </div>
                        
                    </div>
                    <div v-if="item.show" class="card-body" style="background: #ffffff;">
                        <el-card v-for="v,k,i in item.next_name" :key="index+'_'+i+'_'+k" :style="i !== 0 ? {'margin-top': '10px'} : {}">
                            <report-table :table-data="sceneTableData(item, k)" :isPreview="isPreview" :basicColumnData="getFieldData(item, k,'table')"></report-table>
                            <report-draw :table-data="sceneTableData(item, k)" :index="index+'_'+i+'_'+k" :basicColumnData="getFieldData(item,k, 'draw')"></report-draw>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script> 
import ReportDraw from '@/components/TestReport/PerformanceTestReport/ReportDraw'
import ReportTable from '@/components/TestReport/PerformanceTestReport/ReportTable'
import DeviceDescription from '@/components/TestReport/PerformanceTestReport/DeviceDescription'
import Remark from '@/components/TestReport/PerformanceTestReport/Remark'
export default {
    components: {
        ReportTable,
        ReportDraw,
        DeviceDescription,
        Remark
    },
    data() {
        return {
            isLoading: false,
            activeName: 'Android',
            platformType: '0',
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
        compareSet: {},
        taskDetail: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },
        performanceFiledList(){
            return this.$store.getters.getPerformanceFiledList;
        }
    },
    created() {
    },
    methods: {
        changeExpand(item, index, msg){
            this.$set(this.currentStaticData[msg][index], 'show', !item.show);
        },

        cancelEditRemark(type){
            this.$emit('cancelEditRemark', type)
        },

        sceneTableData(item, k){
            // console.log(item)
            // console.log(k)
            let order = this.compareSet.split('-')
            let tableData = []
            if(order[0] == 'scene' && order[1] == 'device'){
                item.next_name[k].forEach(i=>{
                    let obj = i
                    obj['device'] = k
                    tableData.push(obj)
                })
            }else if(order[0] == 'device' && order[1] == 'scene'){
                item.next_name[k].forEach(i=>{
                    let obj = i
                    obj['scene'] = k
                    tableData.push(obj)
                })
            }else if(order[0] == 'scene' && order[1] == 'class'){
                item.next_name[k].forEach(i=>{
                    let obj = i
                    obj['class_name'] = k
                    tableData.push(obj)
                })
            }
            // console.log(tableData)
            return tableData
        },

        getFieldData(item,k, msg){
            // console.log(typeof item.field_name == 'string')
            // console.log(this.performanceFiledList)
            let list = []
            if(msg == 'table'){
                let tableData = this.sceneTableData(item, k)
                const isAllEmpty = tableData.every(obj=>{
                    return obj.class_name == null && obj.class_name == '' && obj.class_name == ' '
                })
                // console.log(isAllEmpty)
                list = list.concat(this.orderFiled(isAllEmpty))
            }
            if(item.field_name && item.field_name!=='null'){
                let field = typeof item.field_name == 'string' ?  item.field_name.split(',') : item.field_name
                this.performanceFiledList.forEach(i=>{
                    if(field.includes(i.propName)){
                        list.push(i)
                    }
                })

            }else{
                list = list.concat(this.performanceFiledList)
            }
            // if(msg == 'table'){
            //     list.push({
            //         propName: 'pease_link',
            //         titleName: 'Pease链接',
            //     })
            // }
            return list
        },

        orderFiled(isAllEmpty){
            let order = this.compareSet.split('-')
            let list = []
            if(order[0] == 'scene' && order[1] == 'device'){
                list.push({
                    propName: 'device',
                    titleName: '设备名称',
                    type: 'normal'
                })
                if(!isAllEmpty){
                    list.push({
                        propName: 'class_name',
                        titleName: '类别名',
                        type: 'normal'
                    })
                }
            }else if(order[0] == 'device' && order[1] == 'scene'){
                list.push({
                    propName: 'scene_name',
                    titleName: '场景名称',
                    type: 'normal'
                })
                if(!isAllEmpty){
                    list.push({
                        propName: 'class_name',
                        titleName: '类别名',
                        type: 'normal'
                    })
                }
            }else if(order[0] == 'scene' && order[1] == 'class'){
                if(!isAllEmpty){
                    list.push({
                        propName: 'class_name',
                        titleName: '类别名',
                        type: 'normal'
                    })
                }
                list.push({
                    propName: 'device',
                    titleName: '设备名称',
                    type: 'normal'
                })
            }
            list.push({
                propName: 'date',
                titleName: '测试时间',
                type: 'normal'
            })
            return list
        },
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
    background: #f5f5f5; 
    padding: 15px;
}

.app-item-div{
    margin-top: 20px;
}
.type-div{
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    background: #36495e;
    padding: 15px 0;
    color: #ffffff;
}

</style>
