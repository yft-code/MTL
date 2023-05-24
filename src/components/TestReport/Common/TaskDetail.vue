<template>
    <div>   
        <edit-report-task ref="editReportTaskRef" 
            :editUrl="editUrl"
            :taskFormList="taskFormList"
            :taskFormItemList="taskFormItemList"
            :axios-list="axiosList" @afterEdit="afterEditMethod"
            @changeAppIcon="changeAppIcon" />
        <!--详细机型测试结果-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="decorate-div"></div>
                <div class="decorate-title">
                    测试任务详情
                    <i 
                        v-if="isTester && !isPreview" 
                        class='el-icon-edit-outline edit-icon' 
                        style="margin-top:0;" 
                        @click="editReportTask"
                    ></i>
                </div>
                <el-button 
                    v-if="!isPreview && exportUrl"
                    :disabled="isExporting"
                    size="mini"
                    type="primary" 
                    class="export-button" 
                    @click="exportExcel"
                >{{ isExporting ? "正在导出 ..." : "导出报告" }}</el-button>
            </div>
            <div class="card-content-div">
                <div class="icon-div">
                    <el-image 
                        v-if="!$checkStrIsNull(taskDetail.icon)" 
                        class="icon-show" 
                        :src="taskDetail.icon"
                    ></el-image>
                </div>
                <div class="task-content-div">
                    <div style="width:100%">
                        <div 
                            v-if="taskDetail[item.value] != '' && taskDetail[item.value] != null && (staticData || taskDetail[item.value] != null)"
                            v-for="(item,index) in taskDetailList.commonItemArr" 
                            :key="index" 
                            :style="{ width: item.width, display: 'inline-block', 'margin-bottom': '0.5rem', 'margin-left':'1rem'}">
                            <span class="testInfoTitle" style="width: 4.3rem; display: inline-block; vertical-align:top;">{{item.label}}</span>
                            <span style="color:#666666; fontSize: 14px; vertical-align:top; width: calc(100%-5.3rem);display: inline-block;">
                                <span v-if="item.value === 'device'">
                                    <div v-if="$route.path == '/mtl_test_platform/page/performanceTestReport' || $route.path == '/mtl_test_platform/page/performanceReport'" style="display: inline-block;">
                                        <div v-if="taskDetail.androidIndexList && taskDetail.androidIndexList.length > 0" style="margin-right: 15px; width: 60rem;">
                                            <el-row>
                                                <el-col :span="2">Android：</el-col>
                                                <el-col :span="22">
                                                    <div v-for="i,j in taskDetail.androidIndexList" :key="index+'_'+i+'_'+j" style="margin-right: 5px; width: 120px; display: inline-block;">
                                                        {{taskDetail.device[i].device}}
                                                        <el-tooltip placement="top" style="display: inline-block;">
                                                            <div slot="content">
                                                                <div v-for="deviceItem, k in fieldList" :key="index+'_'+i+'_'+j+'_'+k">{{deviceItem.label}}: {{taskDetail.device[i][deviceItem.propName]}}</div>
                                                            </div>
                                                            <i class="el-icon-info"></i>
                                                        </el-tooltip>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </div>
                                        <div v-if="taskDetail.iosIndexList && taskDetail.iosIndexList.length > 0" style="margin-right: 15px; width: 60rem;">
                                            <el-row>
                                                <el-col :span="2">IOS：</el-col>
                                                <el-col :span="22">
                                                    <div v-for="i,j in taskDetail.iosIndexList" :key="index+'_'+i+'_'+j" style="margin-right: 5px;width: 120px; display: inline-block;">
                                                        {{taskDetail.device[i].device}}
                                                        <el-tooltip placement="top" style="display: inline-block;">
                                                            <div slot="content">
                                                                <div v-for="deviceItem, k in fieldList" :key="index+'_'+i+'_'+j+'_'+k">{{deviceItem.label}}: {{taskDetail.device[i][deviceItem.propName]}}</div>
                                                            </div>
                                                            <i class="el-icon-info"></i>
                                                        </el-tooltip>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                    <div v-else v-for="device, i in taskDetail[item.value]" :style="{display: 'inline-block', 'margin-left': i === 0 ? '0' : '4.6rem'}">
                                        <span v-for="deviceItem, k in fieldList" v-if="device[deviceItem.propName]" :key="index+'_'+i+'_'+k">{{deviceItem.label}}: {{device[deviceItem.propName]}}；</span>
                                    </div>
                                </span>
                                <span v-else-if="item.value == 'platform'">
                                    {{staticData.testSystem.join("，")}}
                                </span>
                                <span v-else>
                                    {{taskDetail[item.value]}}
                                </span>
                            </span>
                        </div>
                    </div>
                </div> 
                <!-- <div v-if="($route.path == '/mtl_test_platform/page/performanceTestReport' || $route.path == '/mtl_test_platform/page/performanceReport') && taskDetail.test_conclusion && taskDetail.test_conclusion !== null && taskDetail.test_conclusion !== 'null'" style="margin-top:5px; margin-bottom: -5px;">
                    <div class="testInfoTitle" style="width: 4.5rem; display: inline-block; vertical-align:top;">测试结论</div>
                    <div style="color:#666666; fontSize: 14px; vertical-align:top; display: inline-block; width: calc(100% - 4.5rem);">
                        {{taskDetail.test_conclusion}}
                    </div>
                </div> -->
            </div>
            
        </el-card>
    </div>
</template>

<script> 
import EditReportTask from './EditReportTask'
export default {
    components: {
        EditReportTask,
    },
    data() {
        return {
            isExporting: false,
            devicePCFieldList: [
                {
                    label: "测试设备名",
                    propName: "name",
                },
                {
                    label: "硬盘类型",
                    propName: "disk_type",
                }, 
                {
                    label: "系统版本",
                    propName: "system_version",
                }, 
                {
                    label: "CPU型号",
                    propName: "cpu_name",
                }, 
                {
                    label: "内存大小",
                    propName: "mem_size",
                }, 
                {
                    label: "显卡",
                    propName: "gpu_name",
                }, 
                {
                    label: "配置",
                    propName: "config",
                }, 
                {
                    label: "分辨率",
                    propName: "resolution",
                }, 
            ],
            deviceFieldList: [
                {
                    label: "设备型号",
                    propName: "device",
                },
                {
                    label: "操作系统",
                    propName: "os",
                }, 
                {
                    label: "RAM(GB)",
                    propName: "ram",
                }, 
                {
                    label: "CPU型号",
                    propName: "cpuModel",
                }, 
                {
                    label: "GPU型号",
                    propName: "gpuModel",
                }, 
            ],
        }
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        isPreview: {},
        taskDetail: {
            required: true,
            type: Object
        },
        staticData: {},

        taskDetailList:{},
        exportUrl: {},
        editUrl: {},
        taskFormItemList: {},
        taskFormList: {},

    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },
        fieldList(){
            if(this.$route.path == '/mtl_test_platform/page/performanceTestReport'){
                return this.deviceFieldList;
            }else{
                return this.devicePCFieldList;
            }
        },
    },
    created() {
    },
    methods: {
        editReportTask(){
            this.$refs.editReportTaskRef.editReportTask(this.taskDetail);
        },

        afterEditMethod(){
            this.$emit("afterEdit");
        },

        //导出报告
        exportExcel() {

            this.isExporting = true;
            // 导出测试报告接口
            this.$codePost(this.exportUrl, this.axiosList, { operation: "导出报告", failed: true }).then(res => {
                if (res.code == 200) {
                    let url = res.data;
                    window.location.href = url;
                    this.exportExcelVisible = false;
                }
                this.isExporting = false;
            })
        },

        changeAppIcon(msg, iconUrl){
            this.$emit("changeAppIcon", msg, iconUrl);
        }
    },

}
</script>
<style lang="less" scoped>
.icon-div {
    display: inline-block;
    vertical-align: top;
    width: 105px;
    margin: 0px 35px 0 8px;
    .icon-show {
        width: 100%;
        height: 105px;
    }
}
.testInfoTitle {
    text-align: right;
    font-weight: 600;
    color: #333333;
    display: inline-block;
    width: 4.5rem;
    text-align: left;
    font-size: 14px;
}

.task-content-div {
    width: calc(100% - 150px);
    display: inline-block;
    vertical-align: top;
    .testInfoTitle {
        text-align: right;
        font-weight: 600;
        color: #333333;
        display: inline-block;
        width: 4.5rem;
        text-align: left;
        font-size: 14px;
    }
    .equipmentAttribute {
        display: inline-block;
        color: #666666;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: bottom;
    }
    .content-span::after {
        content: "，"
    }
    .content-span:last-child::after {
        content: "";
    }
}
</style>
<style scoped>

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
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 15px 20px;
}

.export-button {
    float: right;
    margin-top: 0.3rem;
    margin-right: 1rem;
}
</style>
