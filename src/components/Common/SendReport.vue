<template>
    <div>   
        <self-dialog
            ref="sendReportRef"
            id="sendReportDialog"
            :dialog-data="dialogData" 
            @confirm="sendEmail"
            >
            <el-form 
                ref="reportFormRef" 
                :model="emailForm" 
                :rules="emailRules" 
                label-width="8rem" 
                :show-message="false"
                >
                
                <el-form-item prop="title" label="邮件主题">
                    <el-input v-model="emailForm.title" />
                </el-form-item>
                <el-form-item prop="send_type" label="发送给">
                    <el-radio-group v-model="emailForm.send_type">
                        <el-radio label="to_self" size="mini">所有测试人员</el-radio>
                        <el-radio label="to_project" size="mini">手动填写</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item 
                    v-if="emailForm.send_type == 'to_project'" 
                    prop="mailto_user" 
                    label="收件人"
                    >
                    <el-input v-model="emailForm.mailto_user" placeholder="填写收件人邮箱，请用英文逗号隔开" />
                </el-form-item>
                <el-form-item 
                    v-if="emailForm.send_type == 'to_project'" 
                    prop="mailto_cc_user" 
                    label="抄送人"
                    >
                    <el-input v-model="emailForm.mailto_cc_user" placeholder="填写抄送人邮箱，请用英文逗号隔开" />
                </el-form-item>
                <!--<el-form-item label="附件">
                    <el-upload 
                        class="upload-demo" 
                        action="#" 
                        multiple 
                        :file-list="fileList" 
                        :auto-upload="false" 
                        :on-change="changeFile"
                        :before-remove="removeFile"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>-->
                <el-form-item label="报告截图网址">
                    <a :href="screenUrl" target="_blank">点此跳转</a>
                </el-form-item>
                <div>
                    <span style="display:inline-block; width: 8rem;text-align:right;padding: 0 12px 0 0;">预览</span>
                    <el-button v-if="previewHtml != ''" size="mini" type="primary" @click="getPreview">重新获取预览</el-button>
                    <div v-if="previewHtml == ''" v-loading="previewHtml == ''" style="width: 100%;height:20rem;"></div>
                    <span v-else-if="previewHtml == 'error'" style="color:red;">
                        错误！
                    </span>
                    
                    <div v-else id="previewDiv" style="width: 100%;">
                        <div v-html="previewHtml"></div>
                        <!-- <a><img :src="'/static' + emailForm.pic_url.split('static')[1]"/></a> -->
                    </div>
                </div>
            </el-form>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import qs from "qs"
import axios from "axios"
import SelfDialog from './SelfDialog.vue'
export default {
    components: {
        SelfDialog,
    },
    props: {

    },
    data() {
        return {
            appUrl: "",
            pageUrl: "",
            emailForm: {
                project:"",
                applicationId: "",
                testRecordName:"",
                title: "",
                send_type: "to_self",
                mailto_user: "",
                mailto_cc_user: "",
                pic_url:"",
            },
            screenUrl: "",
            // fileList: [],
            // fileListData: [],
            emailRules: {
                title: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                send_type: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                mailto_user: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            previewHtml: "<b>预览内容如下：</b><br>这里是一份虚假的报告",
            isSending: false,
            reportKey: 0,
            dialogData:{ 
                title: '发送报告邮件（发送人是MTL）', 
                width: '90%', 
                top:'2rem', 
                // confirmName: '确认', 
                closeName: '取消'
            }

        }
    },
    computed: {
    },
    created() {

    },
    mounted() {

    },
    methods: {
        sendReport(row, pageUrl, appUrl) {
            this.pageUrl = pageUrl
            this.appUrl = appUrl
            if (this.emailForm.applicationId != row.id) {
                //如果报告id和之前的不一样，初始化数据
                this.emailForm = {
                    project: row.project,
                    applicationId: row.id,
                    testRecordName: row.content_name,
                    title: row.test_report_title,
                    send_type: "to_self",
                    mailto_user: "",
                    mailto_cc_user: "",
                }
                this.previewHtml = "";

                this.screenUrl = "/mtl_test_platform/"+this.pageUrl+"?project=all"
                    + "&applicationId=" + row.id
                    + "&testRecordName=" + row.content_name
                    + "&isPreview=1"; 
                this.getPreview();
                this.dialogData.confirmName = '确认';
            }
            this.$refs.sendReportRef.openDialog();
        },

        //获取预览
        getPreview() {
            this.reportKey ++;
            let reportKey = this.reportKey;
            delete this.dialogData['confirmName'];
            this.previewHtml = "";
            this.emailForm.pic_url = "";
            let list = {
                project: this.emailForm.project,
                applicationId: this.emailForm.applicationId,
                testRecordName: this.emailForm.testRecordName
            }
            this.cancelRequest();
            let _this = this;

            let url = "/" + this.appUrl + "/preview_report/"

            this.axios.post(url, qs.stringify(list),
                {
                    cancelToken: new this.axios.CancelToken(
                        function executor(c) {
                            _this.source = c;
                        }
                    )
                }
            ).then(res => {
                if(reportKey === this.reportKey) {
                    let code = res.data.code;
                    if (code == 200) {
                        this.dialogData.confirmName = '确认';
                        this.previewHtml = res.data.data.mail;
                        this.emailForm.pic_url = res.data.data.pic_url;

                    } else {
                        this.previewHtml = "error";
                        this.$message.error(res.data.msg);
                    }
                }
            }).catch(err => {
                console.log('err', err);
            })
        },
        
        //发送报告 取消上一次请求
        cancelRequest() {
            if (typeof this.source === "function") {
                this.source("终止请求");
            }
        },
        // //文件上传
        // changeFile(file, fileList) {
        //     this.fileListData.push(file);
        // },

        // //文件移除
        // removeFile(file, fileList) {
        //     this.fileListData = fileList;
        //     return true;
        // },

        //发送邮件
        sendEmail() {
            let hasError = this.$publicJS.checkFormData(this, "reportFormRef", "您有必填项未填！");
            if (!hasError) {
                this.$store.commit("setPageIsLoading", true);
                //发送邮件
                let formData = new FormData();
                for (let k in this.emailForm) {
                    formData.append(k, this.emailForm[k]);
                }
                // this.fileListData.map((file) => {
                //     formData.append("file", file.raw);
                // })
                //发送报告，但不关闭模态框，也不初始化数据。因为可能发两次报告，初始化数据会增加填写负担。??
                let url = "/" + this.appUrl + "/send_mail/"
                this.$formPost(url, formData,{operation:"发送邮件",success:true,failed:true}).then(res=>{
                    if(res.code == 200){
                        this.$refs.sendReportRef.closeDialog();
                        this.$store.commit("setPageIsLoading", false);
                    }
                })
            }
        },
    },
}
</script>
<style scoped>
#previewDiv>>>img {
    width: 100%;
}
</style>
