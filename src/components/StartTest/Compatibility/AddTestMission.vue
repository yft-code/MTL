<template>
    <div>
        <self-dialog 
            ref="addTestMissionRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '45%', top: '3rem'}" 
            @close="close"
            >
            <el-card>
                <el-form :model="fixDeviceForm" ref="fixDeviceRef" label-width="150px" :rules="fixDeviceFormRules">
                    <!-- <el-form-item label="设备选择">
                        <el-button 
                            v-for="item,index in deviceItemList" 
                            size="mini"
                            :key="index"
                            :type="showIndex !== -1 && showIndex == index ? 'success':'info'" 
                            @click="selectDeviceTag(item,index)">{{item}}</el-button>
                        <el-button :type="isFixDevice ? 'success':'info'" size="mini" @click="selectFixDevice">指定设备</el-button>
                    </el-form-item> 
                    <el-form-item label="Android设备需求数" v-if="!isFixDevice" style="display:inline-block">
                        <el-input v-model="androidNum" placeholder="" style="width: 100px;" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="iOS设备需求数" v-if="!isFixDevice" style="display:inline-block">
                        <el-input v-model="iosNum" placeholder="" style="width: 100px;" disabled></el-input>
                    </el-form-item> -->

                    <el-form-item label="Android设备需求数" style="display:inline-block">
                        <el-input v-model="androidNum" placeholder="" style="width: 100px;" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="iOS设备需求数" style="display:inline-block">
                        <el-input v-model="iosNum" placeholder="" style="width: 100px;" disabled></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="" style="display:inline-block">
                    
                        <el-button :type="isFixDevice ? 'success':'info'" size="small" @click="selectFixDevice">指定设备</el-button>
                    </el-form-item> -->


                    <el-form-item label="指定执行人" prop="selectedQaList">
                        <el-select 
                            v-model="fixDeviceForm.selectedQaList" 
                            placeholder="请选择测试人员"
                            filterable 
                            multiple
                            style="width: 60%"
                            >
                            <el-option
                                v-for="item in testerOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value+''"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    
                    <!-- 选中标签的设备信息 -->
                    <el-card v-if="showIndex !== -1 && deviceInfo[deviceItemList[showIndex]].length > 0" style="margin-top: 15px;">
                        <mission-table v-if="deviceItemList[showIndex] == 'ios'" :style="deviceInfo[deviceItemList[showIndex]].length > 10 ? {'height': '500px','overflow':'auto'} : {}" :basicColumnData="basicColumnData" :tableData="deviceInfo[deviceItemList[showIndex]].slice(0,iosNum)"></mission-table>
                        <mission-table v-else :style="deviceInfo[deviceItemList[showIndex]].length > 10 ? {'height': '500px','overflow':'auto'} : {}" :basicColumnData="basicColumnData" :tableData="deviceInfo[deviceItemList[showIndex]].slice(0,androidNum)"></mission-table>
                    </el-card>

                    <!-- 指定设备 -->
                    <el-form-item label="机型" prop="device" v-if="isFixDevice">
                        <el-input v-model="fixDeviceForm.device" placeholder="请输入指定设备机型" style="width: 50%"></el-input>
                    </el-form-item>

                    <mission-table v-else :style="presetDeviceList.length > 10 ? {'height': '500px','overflow':'auto'} : {}" :basicColumnData="basicColumnData" :tableData="presetDeviceList"></mission-table>
                    
                </el-form>
            </el-card>
            <div style="text-align:center; margin-bottom: -30px;margin-top:10px">
                <el-button type="primary" @click="createMission" size="small">{{ currentQa == '' ? '分配' : '重新分配' }}</el-button></el-button>
            </div>
            
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import MissionTable from '@/components/StartTest/Common/MissionTable'
export default {
    components: {
        SelfDialog,
        MissionTable
    },
    props: {
        currentQa: {},
        androidNum: {},
        iosNum: {},
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            testerOption: [],   // 测试人员
            deviceItemList: [],     // 设备选项字段
            showIndex: -1,      // 选中的设备项下标
            selectedQaList: [],
            deviceInfo: [],
            isFixDevice: false,     // 是否选择指定设备
            basicColumnData: [
                {
                    propName: 'device',
                    titleName: '机型',
                },
                {
                    propName: 'class',
                    titleName: '所属类别/等级',
                },
                {
                    propName: 'ranking',
                    titleName: '排名',
                },
            ],
            fixDeviceForm: {
                device: "",
                selectedQaList: [],
            },
            fixDeviceFormRules: {
                device: [{ required: true, trigger: 'change' }],
                selectedQaList: [{ required: true, trigger: 'change', message: "请选择测试执行人" }],
            },
            testNumber: "",
            deviceSelectList: [],
            presetDeviceList: []
        }
    },
    computed: {
        // html中直接用this.testContentFormList.device_type做判断值，会出现渲染问题，因此这里要特别处理
        testContentDeviceType() {
            return this.testContentFormList.device_type;
        },
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch: {

    },
    created() {
        this.getQaList()    // 获取测试人员信息
        this.getDeviceItem()      // 获取设备选项字段
        this.getPresetDeviceList()
    },
    mounted() {

    },
    methods: {
        getPresetDeviceList(){
            let list = {
                table_name: this.$route.query.testRecordName
            }
            this.$codePost("/expertCompatibility/get_preset_device_list/", list).then(res => {
                if(res.code == 200){
                    this.presetDeviceList = res.data
                }
            })
        },
        handleSelectionChange(val){
            this.deviceSelectList = val
            // console.log(val)
        },
        addTestMission() {
            // console.log(this.currentQa)
            if(this.currentQa){
                this.fixDeviceForm.selectedQaList = this.currentQa.split(',')
                this.testContentDialogTitle = "重新分配测试任务";
            }else{
                this.fixDeviceForm.selectedQaList = []
                this.testContentDialogTitle = "分配测试任务";
            }
            this.$refs.addTestMissionRef.openDialog();
        },

        // 获取测试人员信息
        getQaList() {
            this.$codePost("/service/get_qa_list/").then(res => {
                // console.log(res)
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
            })
        },

        close(){
            this.isFixDevice = false
            this.fixDeviceForm = {
                device: "",
                selectedQaList: [],
            }
            this.$emit("afterAllocate")
        },

        // 获取设备选项字段
        getDeviceItem(){
            this.$codePost("/expertCompatibility/get_preset_device/").then(res => {
                if(res.code == 200){
                    // console.log(res.data)
                    this.deviceInfo = res.data
                    this.deviceItemList = []
                    for(let k in res.data){
                        this.deviceItemList.push(k)
                    }
                }
            })
        },


        // 选中某一个devicetag事件
        selectDeviceTag(item,index){
            if(this.showIndex == index){
                this.showIndex = -1
                this.deviceInfo = []
            }else{
                this.showIndex = index
                this.isFixDevice = false
            }
            console.log(this.deviceItemList[this.showIndex])
        },

        // 点击指定设备按钮
        selectFixDevice(){
            this.showIndex = -1
            this.isFixDevice = !this.isFixDevice
            if(this.fixDeviceForm.isFixDevice && this.fixDeviceForm.selectedQaList.length > 1){
                this.fixDeviceForm.selectedQaList = [this.fixDeviceForm.selectedQaList[0]]
            }
        },

        // 分配任务
        createMission(){
            let hasError = this.$publicJS.checkFormData(this, "fixDeviceRef", "您有必填项未填！");
            if(!hasError){
                if(this.isFixDevice){
                    // let deviceList = []
                    // if(this.deviceSelectList.length < 1){
                    //     return this.$message.error("请先选择设备项再进行任务分配")
                    // }
                    // this.deviceSelectList.forEach(item => {
                    //     deviceList.push(item.device)
                    // })
                    let list = {
                        qa_list: JSON.stringify(this.fixDeviceForm.selectedQaList),
                        device_list: JSON.stringify([this.fixDeviceForm.device]),
                        // device_list: JSON.stringify(deviceList),
                        table_name: this.$route.query.testRecordName
                    }
                    this.allocateDevice(list)
                }else{
                    let list = {
                        qa_list: JSON.stringify(this.fixDeviceForm.selectedQaList),
                        table_name: this.$route.query.testRecordName
                    }
                    this.allocateDevice(list)
                }
                // // 固定机型
                // if(this.showIndex !== -1){
                //     let tagName = this.deviceItemList[this.showIndex]
                //     // console.log(tagName)
                //     // console.log(this.deviceInfo[tagName])
                //     // console.log(this.fixDeviceForm.selectedQaList)
                //     if (this.deviceInfo[tagName].length < 1){
                //         return this.$message.warning("该设备选项下没有设备，请换个设备选项")
                //     }
                    
                //     let device_list = []
                //     this.deviceInfo[tagName].forEach(item => {
                //         device_list.push(item.device)
                //     })
                //     let list = {
                //         qa_list: JSON.stringify(this.fixDeviceForm.selectedQaList),
                //         device_list: JSON.stringify(device_list),
                //         table_name: this.$route.query.testRecordName
                //     }
                //     if(this.testNumber && this.testNumber !== ''){
                //         list.num = this.testNumber
                //     }
                //     this.allocateDevice(list)
    
                // }
                // // 指定机型
                // else if(this.isFixDevice){
                //     // let deviceList = []
                //     // if(this.deviceSelectList.length < 1){
                //     //     return this.$message.error("请先选择设备项再进行任务分配")
                //     // }
                //     // this.deviceSelectList.forEach(item => {
                //     //     deviceList.push(item.device)
                //     // })
                //     let list = {
                //         qa_list: JSON.stringify(this.fixDeviceForm.selectedQaList),
                //         device_list: JSON.stringify([this.fixDeviceForm.device]),
                //         // device_list: JSON.stringify(deviceList),
                //         table_name: this.$route.query.testRecordName
                //     }
                //     this.allocateDevice(list)
                // }
                // // 没选
                // else{
                //     return this.$message.error("请先选择设备项再进行任务分配")
                // }
            }

        },

        allocateDevice(list){
            this.$codePost("/expertCompatibility/preset_device_allocate/", list, {operation: "分配任务", failed: true }).then(res => {
                if(res.code == "200"){
                    this.$emit('afterEdit')
                    if(res.msg){
                        this.$message.warning(res.msg)
                    }else{
                        this.$refs.addTestMissionRef.closeDialog();
                    }
                }
            })
        },


    },

}
</script>
<style scoped>
.choice-tag{
    cursor: pointer;
}
.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 34%;
    margin-right: 1%;
}

.question-table-card {
    width: 64%;
}

.el-icon-refresh {
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid #DCDFE6;
    padding: 0.5rem 0.4rem;
    margin-left: 0.1rem;
    border-radius: 5px;
}

.form-card>>>.el-radio {
    margin-right: 0.7rem;
}

.form-card>>>.el-radio .el-radio__label {
    padding-left: 0.3rem;
}

.form-card>>>.el-input.is-disabled .el-input__inner,
.form-card>>>.el-radio__input.is-disabled+span.el-radio__label {
    color: #959595;
}

.question-item {
    font-size: 14px;
    border: 1px solid #DCDFE6;
    width: 33%;
    margin-right: 2px;
    margin-bottom: 2px;
    display: inline-block;
    vertical-align: top;
    padding: 0.3rem;
    border-radius: 3px;
    cursor: pointer;
}

.question-item .question-desc {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.question-check {
    border-bottom: 1px solid #DCDFE6;
}

.question-check>>>.el-checkbox .el-checkbox__label {
    padding-left: 0;
    transition: none !important;
}
</style>
