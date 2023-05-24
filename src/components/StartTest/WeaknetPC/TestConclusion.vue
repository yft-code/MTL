<template>
    <div>
        <self-dialog 
            ref="editConclusionRef" 
            :dialog-data="{ title: '提交测试结论', width: '65%'}" 
            @close="saveCurrent">
            <div>
                <template v-for="item,index in itemData">
                    <el-card :style="index==0?{}:{'margin-top':'15px'}">
                        <div slot="header" class="clearfix" style="text-align: center;">
                            <span>{{ item.label }}</span>
                        </div>
                        <div>
                            <div>
                                <div style="margin-bottom: 5px;">
                                    {{item.fixMsg[0]}}
                                    <el-input v-model="bandwidth[index].value" placeholder="" style="width:10%;" @blur="updateConclusion"></el-input>
                                    {{item.fixMsg[1]}}
                                </div>
                                <el-input type="textarea" :autosize="{ minRows: 3}" v-model="editConclusionForm[item.propName]" placeholder="" @blur="updateConclusion"></el-input>
                            </div>
                            <el-row :gutter="20" style="margin-top:10px;">
                                <el-col :span="8" v-for="child, k in item.children" :key="index+'_'+k">
                                    <div style="text-align: center;margin-bottom: 5px;">{{ child.titleName }}</div>
                                    <div>
                                        <el-input type="textarea" :autosize="{ minRows: 3}" v-model="editConclusionForm[child.propName]" placeholder="" @blur="updateConclusion"></el-input>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                    
                </template>
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
                min_up_bandwidth: '',    // 最低能玩的上行带宽测试结论
                in_up_bandwidth: '',      // 处于最低上行带宽的表现
                low_up_bandwidth: '',   // 低于最低上行带宽的表现
                high_up_bandwidth: '',  // 高于最低上行带宽的表现
                min_down_bandwidth: '',    // 最低能玩的下行带宽测试结论
                in_down_bandwidth:'',     // 处于最低下行带宽的表现
                low_down_bandwidth: '',  // 低于最低下行带宽的表现
                high_down_bandwidth: '',    // 高于最低下行带宽的表现
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
                if(k == 'min_up_bandwidth' && this.bandwidth[0].value){
                    formData.append(k, this.itemData[0].fixMsg.join(this.bandwidth[0].value)+ "\r\n" +this.editConclusionForm[k]);
                }else if(k == "min_down_bandwidth" && this.bandwidth[1].value){
                    formData.append(k, this.itemData[1].fixMsg.join(this.bandwidth[1].value)+ "\r\n" +this.editConclusionForm[k]);
                }else{
                    formData.append(k, this.editConclusionForm[k]);
                }
                
            }
            formData.append('id', this.axiosList.id)
            this.$formPost("/" + this.appUrl + "/submit_conclusion/", formData, { operation: msg, success: true, failed: true })
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
            this.$codePost("/" + this.appUrl + "/get_conclusion/", list, { operation:  "获取测试结论", failed: true }).then(res => {
                if (res.code == 200) {
                    for(let k in this.editConclusionForm){
                        if(k=="min_up_bandwidth"){
                            let min_up_arr = JSON.parse(JSON.stringify(res.data))[0][k].split('\r\n')
                            let min_up = min_up_arr[0]
                            if(min_up && min_up.indexOf('经测试，最低能玩的上行带宽为') !== -1){
                                // 这里提取最低上行带宽
                                let arr = min_up.match(/\d+(.\d+)?/g)
                                this.bandwidth[0].value = arr[0]
                                // console.log(min_up_arr.slice(1).join('\r\n'))
                                this.editConclusionForm[k] = min_up_arr.slice(1).join('\r\n')
                            }else{
                                this.editConclusionForm[k] = JSON.parse(JSON.stringify(res.data))[0][k]
                            }
                        }
                        else if(k=="min_down_bandwidth"){
                            let min_down_arr = JSON.parse(JSON.stringify(res.data))[0][k].split('\r\n')
                            let min_down = min_down_arr[0]
                            if(min_down && min_down.indexOf('经测试，最低能玩的下行带宽为') !== -1){
                                // 这里提取最低下行带宽
                                let arr = min_down.match(/\d+(.\d+)?/g)
                                this.bandwidth[1].value = arr[0]
                                this.editConclusionForm[k] = min_down_arr.slice(1).join('\r\n')
                            }else{
                                this.editConclusionForm[k] = JSON.parse(JSON.stringify(res.data))[0][k]
                            }
                        }else{
                            this.editConclusionForm[k] = JSON.parse(JSON.stringify(res.data))[0][k]
                        }
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