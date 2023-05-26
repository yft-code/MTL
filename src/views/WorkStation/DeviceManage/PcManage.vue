<template>
    <div class="workstation-content">
            代打水果蛋糕
        <div class="list-title">电脑设备管理</div>
        <div class="list-container">
            <!-- <el-table :data="[{}]">
                <el-table-column v-for="v,k,index in pcData" :key="index" v-if="k!=='NameReflect'" :label="getDisplayName(k).diaplay_name"  align="center">
                    <div v-for="(coverageItem, coverageIndex) in v" :key="index + '_' + coverageIndex" class="every-coverage">
                        <el-tag v-if="!isTester">
                            {{ coverageItem }}
                        </el-tag> 
                        <el-tag
                            v-else
                            closable
                            @close="handleClose(k, coverageIndex, coverageItem)">
                            {{ coverageItem }}
                        </el-tag> 
                    </div>
                    <el-button
                        v-if="isTester"
                        size="small"
                        @click="addItem(k)">新增</el-button>
                </el-table-column>
            </el-table> -->

            <!-- 标签 -->
            <div class="type-item" v-for="v,k,index in pcData" :key="index" v-if="k!=='NameReflect'">
                <div class="type-title">{{getDisplayName(k).diaplay_name}}</div>
                <div class="type-content">
                    <div v-for="(coverageItem, coverageIndex) in v" :key="index + '_' + coverageIndex" class="every-coverage">
                        <el-tag v-if="!isTester && !isAdmin" style="margin:0 5px 5px 0;">
                            {{ coverageItem }}
                        </el-tag> 
                        <el-tag
                            v-else
                            closable
                            style="margin:0 5px 5px 0;"
                            @close="handleClose(k, coverageIndex, coverageItem)">
                            {{ coverageItem }}
                        </el-tag> 
                    </div>
                    <el-button
                        v-if="isTester || isAdmin"
                        size="small"
                        @click="addItem(k)">新增</el-button>
                </div>
            </div>
        </div>

        <self-dialog
            ref="addRef"
            :dialog-data="{ title: '新增', width: '35rem', confirmName: '确认', closeName: '取消' }" 
            @confirm="confirmAdd"
            @close="close">
            <el-form 
                ref="addFormRef" 
                :model="coverForm" 
                :rules="coverRules" 
                label-width="10.5rem" 
                :show-message="false">
                <el-form-item prop="addItemVale" :label="addItemName">
                    <el-input v-model="coverForm.addItemVale" style="width:16rem;"/>
                </el-form-item>
            </el-form>
        </self-dialog>
        
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    components: {
    },
    data() {
        return {
            pcData: {},
            coverForm: {
                addItemVale: "",
            },
            coverRules: {
                addItemVale: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            addItemName: "",
            deviceItem: "",
        }
    },
    props:{
        
    },
    created(){
        this.getOptions()
    },
    mounted(){
        
    },
    computed:{
        isTester() {
            return this.$store.getters.getIsTester
        },
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
    },
    watch:{
    },
    methods:{
        // 获取选项数据-端游兼容性
        getOptions() {
            this.$axiosGet("/expertCompatibilityPC/get_select_options/", {}, { operation: "获取测试选项", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    this.pcData = res.data
                }
            })
        },
        getDisplayName(k){
            let deviceItem = this.pcData.NameReflect.filter(item => {
                return item.pc_report_col_name == k
            })[0]
            // console.log(deviceItem)
            return deviceItem
        },
        handleClose(k, index, item){
            let deviceItem = this.getDisplayName(k)
            let confirmText = "确定删除【<b>" + item + "</b>】吗？";
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = { 
                    class_id: deviceItem.id,
                    name: item
                }
                this.$codePost("/expertCompatibilityPC/delete_select_options/", list, { operation: "删除"+item, success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.getOptions();
                    }
                })
            }).catch(() => { });
        },
        addItem(k){
            let deviceItem = this.getDisplayName(k)
            this.addItemName = deviceItem.diaplay_name;
            this.deviceItem = deviceItem
            this.$refs.addRef.openDialog();
        },
        confirmAdd(){
            let hasError = this.$publicJS.checkFormData(this, "addFormRef", "您有必填项未填！");

            if (!hasError) {
                if(this.pcData[this.deviceItem.pc_report_col_name].indexOf(this.coverForm.addItemVale) !== -1){
                    let msg = this.coverForm.addItemVale +"已存在，请勿重复提交"
                    return this.$message.warning(msg)
                }
                //填写无误，提交
                let list = { 
                    class_id: this.deviceItem.id,
                    name: this.coverForm.addItemVale
                }
                this.$codePost("/expertCompatibilityPC/add_select_options/", list, { operation: "新增"+this.deviceItem.pc_report_col_name, success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.getOptions();
                        this.$refs.addRef.closeDialog();
                        this.coverForm.addItemVale = ""
                    }
                })
            }
        },
        close(){
            this.coverForm.addItemVale = ""
        },
    },
}
</script>
    
<style scoped>
.workstation-content {
    width: 100%;
    flex: 1;
    margin: 20px;
    border-radius: 4px;
    background: #fff;
    display: flex;
    flex-direction: column;
}
.list-title {
    padding: 0 20px;
    font-size: 16px;
    font-weight: 700;
    color: #333333;
    height: 47px;
    width: calc(100% - 40px);
    line-height: 47px;
    background: #fff;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid rgba(97, 119, 255, 0.1);
}
.list-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
}
.type-item {
    width: 100%;
    font-size: 16px;
    margin-bottom: 1rem;
}
.type-item .type-title {
    width: 10%;
    margin-right: 1rem;
    font-weight: bold;
    vertical-align: top;
    display: inline-block;
    text-align: right;
}
.type-item .type-content {
    width: 88%;
    vertical-align: top;
    display: inline-block;
}
.type-item .type-content .every-coverage {
    display: inline-block;
    vertical-align: top;
}
/*
.type-item .type-content .every-coverage {
    width: 17rem;
    display: inline-block;
    vertical-align: top;
}
*/
</style>