<template>
    <div class="report-task">
        <self-dialog 
            ref="editTaskDialogRef" 
            :dialog-data="{ title: '编辑报告项', width: '30rem', confirmName: '确认', closeName: '取消' }" 
            @confirm="confirmEditReportBasic"
        >
            <template>
                <el-form ref="taskFormRef" :model="taskFormList" :rules="taskFormRefRule" label-width="7rem">
                    <self-form-item 
                        v-for="(item,index) in taskFormItemList"
                        v-if="item.name != 'end_date'"
                        :key="index"
                        :formItem="item" 
                        :formValue.sync="taskFormList[item.name]" 
                    />
                    <div v-else>
                        <el-form-item label="结束日期" class="public-dialog-form-item">
                            <el-date-picker
                                v-model="taskFormList.end_date"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                style="width: 100%;"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="App图片">
                        <self-picture-show 
                            v-if="taskFormList.icon != ''" 
                            :img-path="[taskFormList.icon]" 
                            img-type="thumbnail"
                        />
                        <el-upload 
                            action="#" 
                            accept=".jpg,.jpeg,.gif,.png,.bmp,.JPG,.JPEG,.GIF,.PNG,.BMP"
                            :file-list="fileList" 
                            :on-change="changeAppIcon" 
                            :auto-upload="false" 
                            :multiple="false" 
                            :limit="1" 
                            :show-file-list="false"
                        >
                            <span class="blue-span">上传</span>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </template>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
export default {
    components: {
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
    },
    data() {
        return {
            taskFormList: {
                test_report_title: "",
                app_name: "",
                test_version: "",
                // report_remarks: "",
                icon: "",
                end_date: "",
            },
            taskFormItemList: [
                {
                    label: '测试报告标题',
                    name: 'test_report_title',
                    type: 'input',
                    // class: 'public-dialog-form-item'
                }, {
                    label: 'App名称',
                    name: 'app_name',
                    type: 'input',
                    // class: 'public-dialog-form-item'
                }, {
                    label: '测试版本',
                    name: 'test_version',
                    type: 'input',
                    // class: 'public-dialog-form-item'
                }, 
                {
                    label: '结束日期',
                    name: 'end_date',
                    type: 'input',
                    class: 'public-dialog-form-item'
                },
                // {
                //     label: '备注',
                //     name: 'report_remarks',
                //     type: 'input',
                //     class: 'public-dialog-form-item'
                // }
            ],
            fileList: [],
            basicUploadAppIconFile: "",
            taskFormRefRule: {
                test_report_title: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
            },
        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    created() {
    },
    mounted() {

    },
    methods: {
        //编辑报告详细信息
        editReportTask(taskList) {
            let list = {};
            for (let k in this.taskFormList) {
                list[k] = taskList[k] || "";
            }
            this.taskFormList = list;
            this.basicUploadAppIconFile = "";
            this.$refs.editTaskDialogRef.openDialog();
        },

        //上传icon
        changeAppIcon(file, fileList) {
            this.basicUploadAppIconFile = file.raw;
            let picUrl = URL.createObjectURL(this.basicUploadAppIconFile);
            this.$set(this.taskFormList, "icon", picUrl);
        },
        
        //确认修改报告项
        confirmEditReportBasic() {
            let hasError = this.$publicJS.checkFormData(this, "taskFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for (let k in this.taskFormList) {
                    if (k != 'icon') {
                        if(k === 'end_date'){
                            formData.append('finish_date', this.taskFormList[k]);
                        }else{
                            formData.append(k, this.taskFormList[k]);
                        }
                    }
                }
                if (this.basicUploadAppIconFile != "") {
                    formData.append("icon", this.basicUploadAppIconFile);
                }
                for (let k in this.axiosList) {
                    formData.append(k, this.axiosList[k]);
                }
                formData.append("id", this.$route.query.applicationId);
                this.$formPost("/pcPerfTest/edit_report_msg/", formData, { operation: "编辑报告项", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        //成功后关闭模态框
                        this.$refs.editTaskDialogRef.closeDialog();
                        this.$emit("afterEdit");
                    }
                })
            }

        },
    },
    watch: {

    }
}
</script>
<style lang="less" scoped>
.report-task {
    .pic-src {
        width: 7rem;
        height: 7rem;
        cursor: pointer;
    }
}
</style>
