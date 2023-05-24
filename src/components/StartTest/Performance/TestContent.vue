<template>
    <div class="split-card form-card">
        <el-form 
            ref="testContentFormRef" 
            :model="testContentForm" 
            :show-message="false" 
            label-width="10rem"
            >
                <div style="width: 94%; margin: 10px auto; text-align: center;">
                    <div v-for="item,index in fixItemList" style="width: 50%; display:inline-block; margin-bottom: 5px;" :key="index" v-if="testContentForm[item.propName]">
                        {{item.titleName}}：{{testContentForm[item.propName]}}
                    </div>
                </div>
                <el-form-item v-for="item,i in testContentFormList" :key="i" :label="item.titleName" :prop="item.propName" class="public-dialog-form-item">
                    <el-input v-model="testContentForm[item.propName]" @focus="inputFocus(item.propName)" @blur="valueChange(item.propName)"></el-input>
                </el-form-item>
                <!-- <el-form-item label="备注" class="public-dialog-form-item" style="width: 95%;">
                    <el-input type="textarea" v-model="remarks" @focus="remarkFocus()" @blur="remarkChange()"></el-input>
                </el-form-item> -->
        </el-form>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
export default {
    components:{

    },
    data(){
        return {
            testContentForm: {},
            remarks: "",
            fixItemList: [
                {
                    propName: "date",
                    titleName: "测试时间",
                },
                {
                    propName: "device",
                    titleName: "设备名称",
                },
                {
                    propName: "app_name",
                    titleName: "APP名称",
                },
                {
                    propName: "pease_data_name",
                    titleName: "Pease数据名称",
                }
                
            ]
        }
    },
    props:{
        testContentFormList: {},
        recordData: {},
        index: {},
    },
    computed: {
        performanceFiledList() {
            return this.$store.getters.getPerformanceFiledList;
        }
    },
    created(){
        this.initData()
        
    },
    methods: {
        initData(){
            this.testContentForm = this.recordData;
            this.remarks = this.recordData['remarks'] || "";
            // this.testContentForm['remarks'] = this.recordData['remarks'] || "";
        },
        inputFocus(propName){
            this.oldValue = this.testContentForm[propName];
        },
        valueChange(propName){
            if(this.oldValue != this.testContentForm[propName]){
                this.$emit("valueChange", this.testContentForm, this.index);
            }
        },

        remarkFocus(){
            this.oldRemark = this.testContentForm['remarks'] || "";
        },

        remarkChange(){
            if(this.oldRemark != this.testContentForm['remarks']){
                this.$emit("remarkChange", this.remarks, this.index);
            }
        },
    }
}
</script>
<style scoped>
.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 98%;
    margin-right: 2%;
}
.public-dialog-form-item{
    width: 30%;
    margin-left: 2%;
    display:inline-block;
}
.pease-btn{
    display:inline-block;
    margin-left: 19%;
    margin-top: -15px;
    margin-bottom: 10px;
}
.device-div{
    display:inline-block;
    margin-left: 5%;
    width: 45%;
    color: red;
}
.pease-url{
    margin-left: 2%;
}
</style>