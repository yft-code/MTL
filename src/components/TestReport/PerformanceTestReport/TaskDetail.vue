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
                        v-if="!$checkStrIsNull(taskDetail[taskDetailList.logo])" 
                        class="icon-show" 
                        :src="taskDetail[taskDetailList.logo]"
                    ></el-image>
                </div>
                <div class="task-content-div">
                    <div style="width:100%">
                        <div 
                            v-if="taskDetail[item.value] != '' && taskDetail[item.value] != null"
                            v-for="(item,index) in taskDetailList.commonItemArr" 
                            :key="index" 
                            :style="{ width: item.width, display: 'inline-block', 'margin-top': '0.6rem' }"
                        >
                            <span class="testInfoTitle" style="width: 4.5rem；">{{item.label}}</span>
                            <span style="margin-left:10px;color:#666666;">
                                <span>
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
            taskDetailList: {
                logo: "app_icon",
                commonItemArr: [
                    {
                        value: "app_name",
                        label: "App名称",
                        width: "50%",
                    },
                    {
                        value: "test_report_title",
                        label: "报告名称",
                        width: "50%",
                    },
                    {
                        value: "test_version",
                        label: "测试版本",
                        width: "50%",
                    },
                    {
                        value: "start_date",
                        label: "测试日期",
                        width: "50%",
                    },
                ]
            },
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
            // this.$codePost("/PerformancePCTest/export_report/", this.axiosList, { operation: "导出报告", failed: true }).then(res => {
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
    width: 120px;
    margin: 20px 20px 0 10px;
    .icon-show {
        width: 100%;
        height: 120px;
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
    padding: 15px 20px;
}

.export-button {
    float: right;
    margin-top: 0.3rem;
    margin-right: 1rem;
}
</style>
