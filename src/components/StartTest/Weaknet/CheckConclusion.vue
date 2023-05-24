<template>
    <div>
        <self-dialog 
            ref="editConclusionRef" 
            :dialog-data="{ title: '提交测试结论', width: '45%'}" 
            @close="saveCurrent">
            <div>
                <el-card>
                    <div slot="header" class="clearfix" style="text-align: center;">
                        <span>测试结论</span>
                    </div>
                    <div>
                        <el-input type="textarea" :autosize="{ minRows: 8}" v-model="editConclusionForm.conclusion" placeholder="" @blur="updateConclusion"></el-input>
                    </div>
                </el-card>

                <div style="text-align:center;margin-bottom: -40px;margin-top:10px;">
                    <el-button size="mini" @click="updateConclusion">暂存</el-button>
                    <el-button type="primary" size="mini" @click="confirmEditConclusion('提交测试结论')">提交</el-button>
                </div>
            </div>
        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    data() {
        return {
            // 弱网测试结论相关字段
            editConclusionForm: {
                conclusion: "",
            },
            bandwidth: [
                {
                    label: 'min_up_bandwidth',
                    value: "",
                },
                {
                    label: 'min_down_bandwidth',
                    value: "",
                }
            ]
        }
    },
    props: {
        axiosList: {},
        appUrl: {},
    },
    computed: {
        itemData(){
            return this.$store.getters.getWeaknetPCConclusionItem;
        }
    },
    methods: {
        confirmEditConclusion(msg){
            // console.log(this.editConclusionForm)
            let formData = new FormData();
            for(let k in this.editConclusionForm){
                formData.append(k, this.editConclusionForm[k]);              
            }
            formData.append('id', this.axiosList.id)
            this.$formPost("/" + this.appUrl + "/edit_test_conclusion/", formData, { operation: msg, success: true, failed: true })
        },

        updateConclusion(val){
            // console.log(val)
            this.confirmEditConclusion("自动保存")
        },

        saveCurrent(){
            this.confirmEditConclusion("自动保存")
        },

        openDialog(){
            this.$refs.editConclusionRef.openDialog();
            this.getCurrentConclusion()
        },


        // 获取当前测试申请的测试结论数据
        getCurrentConclusion(){
            let list = {
                id: this.axiosList.id
            }
            this.$codePost("/" + this.appUrl + "/get_test_set/", list, { operation:  "获取测试结论", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    for(let k in this.editConclusionForm){
                        this.editConclusionForm[k] = JSON.parse(JSON.stringify(res.data))[0].conclusion
                        
                    }
                }
            })
        }
    },
}
</script>
<style scoped>
.el-card ::v-deep .el-card__header {
    font-size: 16px;
    background-color: #ffc000;
}

</style>