<template>
    <div>
        <self-dialog 
            ref="editDeviceRef" 
            :dialog-data="{ title: deviceDialogTitle, width: '40%', confirmName: '确认', closeName: '取消'}" 
            >
            <el-form :model="deviceForm" label-width="120px" :rules="deviceFormRule">
                <el-form-item label="操作系统" class="form-item">
                    <el-input v-model="deviceForm.os" placeholder="" disabled></el-input>
                </el-form-item>
                <el-form-item v-for="item,index in basicColumnData" v-if="item.propName !== 'operation'" :prop="item.propName" :key="index" :label="item.titleName" class="form-item">
                    <el-select 
                        v-if="item.propName=='class'"
                        v-model="deviceForm[item.propName]" 
                        filterable 
                        clearable
                        allow-create
                        >
                        <el-option v-for="(item,index) in deviceItemList" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                    <el-input-number style="width:100%" v-else-if="item.propName=='ranking'" v-model="deviceForm[item.propName]"></el-input-number>
                    <el-input v-else v-model="deviceForm[item.propName]" placeholder=""></el-input>
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
    props: {
        basicColumnData: {},
        deviceItemList: {},
        packageType: {},
    },
    data() {
        return {
            deviceDialogTitle: "",
            deviceForm: {
                id: "",
                device: "",
                class: "",
                ranking: "",
                os: "",
            },
            deviceFormRule: {
                os: [{ required: true, trigger: 'change', message:"机型" }],
                device: [{ required: true, trigger: 'change', message:"机型" }],
                class: [{ required: true, trigger: 'change', message:"所属类别/等级不能为空" }],
                ranking: [{ required: true, trigger: 'change', message:"排名不能为空" }],
            }

        }
    },
    computed: {
        
    },
    watch: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        openDialog(item){
            if(item){
                this.deviceDialogTitle = "编辑测试设备"
                this.deviceForm = item
            }else{
                this.deviceDialogTitle = "新增测试设备"
                this.deviceForm = {
                    id: "",
                    device: "",
                    class: "",
                    ranking: "",
                }
            }
            this.deviceForm.os = this.packageType == 0 ? 'Android':'iOS',
            this.$refs.editDeviceRef.openDialog()
        }
    },

}
</script>
<style scoped>
.form-item{
    display: inline-block;
    width: 45%;
}
</style>
