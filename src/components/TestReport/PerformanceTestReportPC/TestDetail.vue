<template>
    <div>   
        <edit-report-task ref="editReportTaskRef" :axios-list="axiosList" @afterEdit="afterEditMethod"/>
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
                <!-- <el-button 
                    v-if="!isPreview"
                    :disabled="isExporting"
                    size="mini"
                    type="primary" 
                    class="export-button" 
                    @click="exportExcel"
                >{{ isExporting ? "正在导出 ..." : "导出报告" }}</el-button> -->
            </div>
            <div class="card-content-div">
                <div class="icon-div">
                    <el-image 
                        v-if="!$checkStrIsNull(taskDetail['icon'])" 
                        class="icon-show" 
                        :src="taskDetail['icon']"
                    ></el-image>
                </div>
                <div class="task-content-div">
                    <div style="width:100%">
                        <div 
                            v-if="taskDetail[item.value] != '' && taskDetail[item.value] != null"
                            v-for="(item,index) in taskDetailList.commonItemArr" 
                            :key="index" 
                            :style="{ width: item.width, display: 'inline-block', 'margin-top': '0.6rem' }">

                            <span class="testInfoTitle" style="width: 4.5rem；">{{item.label}}</span>
                            <span style="margin-left:0.1rem;color:#666666;">
                                <span v-if="item.value === 'device'">
                                    <div v-for="device, i in taskDetail[item.value]" :style="{display: 'inline-block', 'margin-left': i === 0 ? '0' : '4.6rem'}">
                                        <span v-for="deviceItem, k in deviceFieldList" v-if="device[deviceItem.propName]" :key="index+'_'+i+'_'+k">{{deviceItem.label}}: {{device[deviceItem.propName]}}；</span>
                                    </div>
                                </span>
                                <span v-else>
                                    {{taskDetail[item.value]}}
                                </span>
                            </span>
                        </div>
                    </div>
                </div> 
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
            // taskDetail: {
            //     "app_name": "雷火MTL",
            //     "test_version": "45660",
            //     "test_report_title": "test",
            //     "report_remarks": "",
            //     "end_date": "2022-12-27",
            //     "icon": null,
            //     "start_date": "2022-12-16",
            //     "test_content": "【L22】质量评估测试",
            // },
            taskDetailList: {
                logo: "app_icon",
                commonItemArr: [
                    {
                        value: "test_report_title",
                        label: "报告名称",
                        width: "25%",
                    },
                    {
                        value: "app_name",
                        label: "项目名称",
                        width: "25%",
                    },
                    {
                        value: "test_version",
                        label: "测试版本",
                        width: "25%",
                    },
                    {
                        value: "start_date",
                        label: "测试日期",
                        width: "25%",
                    },
                    {
                        value: "device",
                        label: "测试设备",
                        width: "100%",
                    },
                ]
            },
            deviceFieldList: [
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
            ]
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
        }
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        }
    },
    created() {
    },
    mounted(){
        // console.log(this.taskDetail)
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
            // this.$codePost("/pcPerfTest/export_report/", this.axiosList, { operation: "导出报告", failed: true }).then(res => {
            //     if (res.code == 200) {
            //         let url = res.data;
            //         window.location.href = url;
            //         this.exportExcelVisible = false;
            //     }
            //     this.isExporting = false;
            // })

            setTimeout(() => {
                this.isExporting = false;
            }, 1000);
        },
    },

}
</script>
<style lang="less" scoped>
.icon-div {
    display: inline-block;
    vertical-align: top;
    width: 105px;
    margin: 0 35px 0 8px;
    .icon-show {
        width: 100%;
        height: 105px;
    }
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
    padding: 10px 20px;
}

.export-button {
    float: right;
    margin-top: 0.3rem;
    margin-right: 1rem;
}
</style>
