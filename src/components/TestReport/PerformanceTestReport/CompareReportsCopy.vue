<template>
    <div v-loading="isLoading" style="margin-top: 20px;">   
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                <el-tab-pane label="Android" name="Android">
                    <div v-for="item,index in compareData.android" :key="item.scene_id" :id="item.scene_id">
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
                            <div v-if="item.show" class="card-body">
                                <!-- <el-card>
                                    <report-table :table-data="sceneTableData(item)" :isPreview="isPreview" :basicColumnData="handleFieldData(item,'table')"></report-table>
                                    <compare-draw :table-data="sceneTableData(item)" :index="index" :basicColumnData="handleFieldData(item, 'draw')"></compare-draw>
                                </el-card> -->
                                <el-card v-for="v,k,i in item.next_name" :key="index+'_'+i">
                                    <report-table :table-data="sceneTableData(item)" :isPreview="isPreview" :basicColumnData="handleFieldData(item,'table')"></report-table>
                                    <compare-draw :table-data="sceneTableData(item)" :index="index" :basicColumnData="handleFieldData(item, 'draw')"></compare-draw>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="IOS" name="IOS">
                    <div v-for="item,index in compareData.ios" :key="item.scene_id" :id="item.scene_id">
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
                            <div v-if="item.show" class="card-body">
                                <el-card>
                                    <report-table :table-data="sceneTableData(item)" :isPreview="isPreview" :basicColumnData="handleFieldData(item,'table')"></report-table>
                                    <compare-draw :table-data="sceneTableData(item)" :index="index" :basicColumnData="handleFieldData(item, 'draw')"></compare-draw>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script> 
import ReportTable from '@/components/TestReport/PerformanceTestReport/ReportTable'
import CompareDraw from '@/components/TestReport/PerformanceTestReport/CompareDraw'
import CompareMessage from '@/components/TestReport/PerformanceTestReport/CompareMessage'
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
            activeName: 'Android',
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
        compareSet: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },
        performanceFiledList(){
            return this.$store.getters.getPerformanceFiledList;
        },
    },
    methods: {
        handleClick(val){
            let num = 3
            // this.$refs[val._props.label+'_0'][0].initDrawChart()
            // this.$refs[val._props.label+'_1'][0].initDrawChart()
            // this.$refs[val._props.label+'_2'][0].initDrawChart()
        },
        changeExpand(item, index, msg){
            this.$set(this.compareData[msg][index], 'show', !item.show);
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
            // console.log(item)
            // console.log(this.compareSet)
            let order = this.compareSet.split('-')
            // console.log(order)
            let tableData = []
            if(order[0] == 'scene' && order[1] == 'device'){
                for(let k in item.next_name){
                    item.next_name[k].forEach(i=>{
                        let obj = i
                        obj['device'] = k
                        tableData.push(obj)
                    })
                }
            }else if(order[0] == 'device' && order[1] == 'scene'){
                for(let k in item.next_name){
                    item.next_name[k].forEach(i=>{
                        let obj = i
                        obj['scene_name'] = k
                        tableData.push(obj)
                    })
                }
            }else if(order[0] == 'scene' && order[1] == 'class'){
                for(let k in item.next_name){
                    item.next_name[k].forEach(i=>{
                        let obj = i
                        obj['class_name'] = k
                        tableData.push(obj)
                    })
                }
            }
            // console.log(tableData)
            return tableData
        },

        handleFieldData(item, msg){
            // console.log(item)
            // console.log(this.performanceFiledList)
            let list = []
            if(msg == 'table'){
                list = list.concat(this.orderFiled())
            }
            // list = list.concat(this.orderFiled())
            if(item.field_name && item.field_name!=='null'){
                let field = item.field_name.split(',')
                this.performanceFiledList.forEach(i=>{
                    if(field.includes(i.propName)){
                        list.push(i)
                    }
                })

            }else{
                list = list.concat(this.performanceFiledList)
            }
            // console.log(list)
            // if(msg == 'table'){
            //     list.push({
            //         propName: 'pease_link',
            //         titleName: 'Pease链接',
            //     })
            // }
            
            return list
        },
        orderFiled(){
            let order = this.compareSet.split('-')
            let list = []
            if(order[0] == 'scene' && order[1] == 'device'){
                list.push({
                    propName: 'device',
                    titleName: '设备名称',
                    type: 'normal'
                })
                list.push({
                    propName: 'class_name',
                    titleName: '类别名',
                    type: 'normal'
                })
            }else if(order[0] == 'device' && order[1] == 'scene'){
                list.push({
                    propName: 'scene_name',
                    titleName: '场景名称',
                    type: 'normal'
                })
                list.push({
                    propName: 'class_name',
                    titleName: '类别名',
                    type: 'normal'
                })
            }else if(order[0] == 'scene' && order[1] == 'class'){
                list.push({
                    propName: 'class_name',
                    titleName: '类别名',
                    type: 'normal'
                })
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
    padding: 15px;
}
.remind-div{
    text-align: center;
    margin-top: 2rem;
}
</style>
