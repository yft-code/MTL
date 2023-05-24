<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="decorate-div"></div>
                <div class="decorate-title">
                    备注
                    <i v-if="!remarkFlag && !isPreview && isTester" 
                        class='el-icon-edit-outline edit-icon' 
                        style="margin-top:0;" 
                        @click="editRemark"
                    ></i>
                </div>
            </div>
            <div class="card-content-div">
                <div class="task-content-div">
                    <div v-if="!remarkFlag" style="margin-left: 10px">
                        <span class="comment" v-if="type=='android'">{{taskDetail['android_remarks'] ? taskDetail['android_remarks'] : '无'}}</span>
                        <span class="comment" v-if="type=='ios'">{{taskDetail['ios_remarks'] ? taskDetail['ios_remarks'] : '无'}}</span>
                    </div>
                    <div v-else  style="margin-left: 10px">
                        <el-input v-if="type=='android'" v-model="taskDetail['android_remarks']" type="textarea" :autosize="{ minRows: 2}" style="width: 90%" placeholder="请填入备注"></el-input>
                        <el-input v-if="type=='ios'" v-model="taskDetail['ios_remarks']" type="textarea" :autosize="{ minRows: 2}" style="width: 90%" placeholder="请填入备注"></el-input>
                        <el-button type="primary" size="mini" style="margin-left: 10px;" @click="updateRemark">确定</el-button>
                        <el-button size="mini" @click="cancelEditRemark">取消</el-button>
                    </div>
                </div> 
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            remarkFlag: 0,
            projectCode: ""
        }
    },
    props: {
        taskDetail: {},
        updateUrl: {},
        isPreview: {},
        type: {}
    },
    created() {
        this.projectCode = this.$route.query.project;
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester
        }
    },
    methods: {
        editRemark(){
            this.remarkFlag = 1
        },

        updateRemark(){
            let list = {
                id: this.$route.query.applicationId,
                // report_remarks: this.type == '' ? this.taskDetail['report_remarks'],
                table_name: this.$route.query.testRecordName,
                project: this.$route.query.project,
            }
            if(this.type == 'android'){
                list['android_remarks'] = this.taskDetail['android_remarks']
            }else if(this.type == 'ios'){
                list['ios_remarks'] = this.taskDetail['ios_remarks']
            }
            // this.$codePost('/protocolTest/edit_report_remarks/', list, { operation: "编辑备注", success: true, failed: true }).then(res => {
            this.$codePost(this.updateUrl, list, { operation: "编辑备注", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    // this.getPageData()
                    this.$emit('updateRemark')
                    this.remarkFlag = 0
                }
            })
        },

        cancelEditRemark(){
            this.remarkFlag = !this.remarkFlag
            // this.taskDetail['report_remarks'] = this.oldRemark
            this.$emit('cancelEditRemark', this.type)
        },
    }
}
</script>
<style scoped>
.box-card {
    box-sizing: border-box;
    margin-bottom: 10px;
}
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
    font-size: 18px;
}
.edit-icon {
    color: #4876F2;   
    font-weight: bold;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    margin-left: -3px;
    margin-top: -3px;
}
.comment{
    white-space:pre-wrap;
    font-size: 14px;
}
.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}
</style>