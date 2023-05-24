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
                        <!-- <device-description :deviceData="sceneTableData(item)" style="margin-bottom: 15px;"></device-description> -->
                        <report-table :table-data="sceneTableData(item)"></report-table>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script> 
import ReportTable from '@/components/TestReport/WeaknetPCTestReport/ReportTable'
import DeviceDescription from '@/components/TestReport/WeaknetPCTestReport/DeviceDescription'
export default {
    components: {
        ReportTable,
        DeviceDescription
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
        }
    },
    created() {
    },
    methods: {
        changeExpand(item, index){
            this.$set(this.currentStaticData[index], 'show', !item.show);
        },


        sceneTableData(item){
            let filterData = this.currentStaticData.filter(i=>{
                return i.scene_name == item.scene_name
            })[0].records
            let finalData = []
            for(let k in filterData){
                if(filterData[k].length !== 0){
                    finalData = finalData.concat(filterData[k])
                }
            }
            return finalData
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
    padding: 20px;
}

.app-item-div{
    margin-top: 20px;
}
</style>
