<template>
    <div>
        <self-dialog 
            ref="addTestContentRef" 
            :dialog-data="{ title: dialogName +'测试记录', width: '50%', confirmName: '确认', closeName: '取消' }" 
            style="text-align: left;"
            @confirm="confirmAddContent"
            @close="closeContentDialog"
            >
            <div class="split-card form-card">
                <el-form 
                    ref="addContentFormRef" 
                    :model="addContentForm" 
                    :rules="testContentFormRules" 
                    :show-message="false" 
                    v-loading="peaseBtnDisable"
                    label-width="10rem"
                    >
                    <el-form-item label="Pease链接" class="public-dialog-form-item" style="width: 95%;">
                        <el-input v-model="addContentForm.pease_link" style="display: inline-block; width: 90%;"></el-input>
                        <el-button type="primary" size="mini" style="display: inline-block; margin-left: 5px;" @click="handlePeaseUrl" :disabled="peaseBtnDisable">确定</el-button>
                    </el-form-item>
                    <!-- <el-tooltip content="解析pease链接" placement="top">
                        <i class="el-icon-upload" style="cursor: pointer; margin-left: 5px;" @click="handlePeaseUrl" :disabled="peaseBtnDisable"></i>
                        <i class="el-icon-download" style="cursor: pointer; margin-left: 5px;" @click="handlePeaseUrl"></i>
                    </el-tooltip> -->
                    
                    <el-form-item label="数据组别" class="public-dialog-form-item" style="width: 48%;">
                        <el-select v-model="addContentForm.class_name" filterable allow-create placeholder="请选择数据的组别，可新增" style="width:100%;">
                            <el-option v-for="item,index in classNameList" :key="index" :value="item" :label="item">{{item}}</el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="recordNum == 1" style="background: #f3f4f6; padding-top: 10px;">
                        <div v-if="dialogName == '新增'" style="width: 94%; margin: 10px auto; text-align: center;">
                            <div v-for="item,index in fixItemList" style="width: 50%; display:inline-block; margin-bottom: 5px;" :key="index" v-if="addContentForm[item.propName]">
                                {{item.titleName}}：{{addContentForm[item.propName]}}
                            </div>
                        </div>
                        <el-form-item v-for="item,i in testContentFormList" :key="i" :label="item.titleName" :prop="item.propName" class="public-dialog-form-item">
                            <el-input v-model="addContentForm[item.propName]"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" class="public-dialog-form-item" style="width: 95%;">
                            <el-input type="textarea" v-model="addContentForm.remarks"></el-input>
                        </el-form-item>
                    </div>
                    <div v-else style="margin: auto; width: 90%;">
                        <div v-for="record,index in recordDataList" :key="index" style="background: #f3f4f6; margin-top:10px; padding-top: 10px;">
                            <test-content 
                                :ref="'testContentRef'+index"
                                :testContentFormList="testContentFormList" 
                                @valueChange="valueChange"
                                @remarkChange="remarkChange"
                                :index="index" :recordData="record"></test-content>
                        </div>
                    </div>
                    
                    
                </el-form>
            </div>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import TestContent from '@/components/StartTest/Performance/TestContent'
export default {
    components:{
        TestContent
    },
    data(){
        return {
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
            ],
            testContentFormList: [
                // {
                //     label: "平台",
                //     propName: "platform",
                // },
                // {
                //     label: "软件名称",
                //     propName: "app_name",
                // },
                // {
                //     label: "原始包大小",
                //     propName: "origin_package_size",
                // },
                // {
                //     label: "实体包大小",
                //     propName: "real_package_size",
                // },
                // {
                //     label: "平均内存占用",
                //     propName: "memory_usage",
                // },
                // {
                //     label: "最大内存占用",
                //     propName: "memory_usage_max",
                // },
                // {
                //     label: "CPU占用",
                //     propName: "cpu_usage",
                // },
                // {
                //     label: "GPU使用率",
                //     propName: "gpu_use_rate",
                // },
                // {
                //     label: "帧率",
                //     propName: "fps",
                // },
                // {
                //     label: "流量",
                //     propName: "flow",
                // },
                // {
                //     label: "耗电量",
                //     propName: "power_consumption",
                // },
                // {
                //     label: "冷启动时间",
                //     propName: "cold_start_used",
                // },
                // {
                //     label: "工时",
                //     propName: "work_time",
                // },
            ],
            recordNum: 1,
            recordDataList: [],
            addContentForm: {
                date: "", // 测试时间
                scene_id: "",   // 场景id
                application_id: "",   // 表名
                device_name: "",  // 设备
                pease_link: "", // Pease链接

                cpu_usage: "",  // CPU占用
                gpu_use_rate: "", // GPU使用率
                real_package_size: "", // 实际包大小
                // cold_start_used: "", // 冷启动时间
                memory_usage: "", // 平均内存占用
                memory_usage_max: "", // 最大内存占用
                fps: "", // 帧率
                flow: "", // 流量
                // power_consumption: "", // 耗电量
                origin_package_size: "", // 原始包大小
                virtual_memory_avg: "",
                virtual_memory_max: "",
                baterry_temp: "",
                battery_current: "",
                battery_power: "",

                // work_time: "",  // 工时
                platform: "",  // 平台
                test_qa: "", // 测试人员
                app_name: "", // 软件名称
                class_name: "",
                remarks: "", // 备注
            },
            testContentFormRules: {
                app_name: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                // device_name: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                scene_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                application_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                work_time: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            },
            selectedDeviceInScene: {},
            scene_data:{},
            dialogName: "新增",
            editObject: {},
            peaseBtnDisable: false,
            normalField: [
                'origin_package_size',     // 安装包大小（10MB）
                'real_package_size',    // 实际包大小（10MB）
                'memory_usage',     // 平均APP内存(MB)
                'memory_usage_max',    // 最大内存（MB）
                'virtual_memory_avg',     // 平均虚拟内存（GB）
                'virtual_memory_max',     // 最大虚拟内存（GB）
                'cpu_usage',  // 平均CPU（%）
                'gpu_use_rate',     // 平均GPU（%）
                'fps',    // 平均帧数（FPS）
                'baterry_temp',    // 平均电池温度（℃）
                'battery_current',   // 平均电流（mA）
                'battery_power',  // 平均功率（mW）
                'flow',     // 平均流量（K/min）
                'date',
                'device',
                'app_name',
                'pease_data_name',
            ],
        }
    },
    props:{
        deviceData: {},
        axiosList: {},
        classNameList: {},
    },
    computed: {
        performanceFiledList() {
            return this.$store.getters.getPerformanceFiledList;
        }
    },
    created(){
    },
    methods: {
        handleChange(val){
            this.addContentForm.class_name = val
        },
        openDialog(item,basicColumnData, type){
            let list = []
            basicColumnData.forEach((item,index) => {
                if(item.propName !== 'pease_link' && item.propName !== 'opration' && item.propName !== 'class_name'){
                    list.push(item)
                }
            })
            this.testContentFormList = list
            
            this.editObject = item
            this.dialogName = "编辑"
            for(let k in this.addContentForm){
                this.addContentForm[k] = item[k] ? item[k] : ""
            }
            // console.log(this.addContentForm)
            // console.log(this.classNameList)
            this.$refs.addTestContentRef.openDialog()
        },

        valueChange(record,index){
            this.recordDataList[index] = record
            this.$refs['testContentRef'+index][0].initData()
        },

        remarkChange(remarks, index){
            this.recordDataList[index].remarks = remarks
            this.$refs['testContentRef'+index][0].initData()
        },

        addTestContent(row){
            let list = []
            this.performanceFiledList.forEach((item,index) => {
                if(row.field_name && row.field_name != null && row.field_name != 'null'){
                    if(row.field_name.indexOf(item.propName) !== -1){
                        list.push(item)
                    }
                }else{
                    list.push(item)
                }
            })
            this.testContentFormList = list
            this.addContentForm.scene_id = row.id
            this.addContentForm.application_id = this.axiosList.id
            this.$refs.addTestContentRef.openDialog();
        },

        confirmAddContent(){
            let hasError = this.$publicJS.checkFormData(this, "addContentFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                if(this.recordNum == 1){
                    let formData = new FormData();
                    for(let k in this.addContentForm){
                        formData.append(k, this.addContentForm[k]?this.addContentForm[k]:"");
                    }
                    // for (var key of formData.keys()) {
                    //     console.log(key, formData.get(key));
                    // }
                    if(this.dialogName === "新增"){
                        if(this.addContentForm.pease_link == ''){
                            // this.$message.error('请选择测试类型')
                            this.$confirm('是否确定不从pease链接导入数据，如点击确认则直接新增测试记录', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                // this.$refs.addTestContentRef.closeDialog();
                                this.$formPost("/mobilePerfTest/create_test_record/", formData, { operation: "新增测试记录", success:true, failed: true }).then(res => {
                                    if (res.code == 200) {
                                        this.$refs.addTestContentRef.closeDialog();
                                        this.$emit('afterEdit')
                                    }
                                })
                            }).catch(() => {
                                this.$refs.addTestContentRef.closeDialog();
                            });
                        }else{
                            this.$formPost("/mobilePerfTest/create_test_record/", formData, { operation: "新增测试记录", success:true, failed: true }).then(res => {
                                if (res.code == 200) {
                                    this.$refs.addTestContentRef.closeDialog();
                                    this.$emit('afterEdit')
                                }
                            })
                        }
                    }else{
                        formData.append('id', this.editObject.id)
                        this.$formPost("/mobilePerfTest/edit_test_record/", formData, { operation: "编辑测试记录", success:true, failed: true }).then(res => {
                            if (res.code == 200) {
                                this.$refs.addTestContentRef.closeDialog();
                                this.closeContentDialog()
                                
                                this.$emit('afterEdit')
                            }
                        })
                    }
                }else if(this.recordNum > 1){
                    this.recordDataList.forEach((item,index) => {
                        let formData = new FormData();
                        for(let k in item){
                            formData.append(k, item[k]?item[k]:"");
                        }
                        formData.append('scene_id', this.addContentForm.scene_id)
                        formData.append('application_id', this.addContentForm.application_id)
                        formData.append('device_name', this.addContentForm.device_name)
                        formData.append('class_name', this.addContentForm.class_name)
                        formData.append('pease_link', this.addContentForm.pease_link)
                        this.$formPost("/mobilePerfTest/create_test_record/", formData, { operation: "新增测试记录"})
                        
                        // this.$formPost("/mobilePerfTest/create_test_record/", formData, { operation: "新增测试记录", success:true, failed: true }).then(res => {
                        //     if (res.code == 200) {
                        //         this.$refs.addTestContentRef.closeDialog();
                        //         this.$emit('afterEdit')
                        //     }
                        // })
                    })
                    this.$refs.addTestContentRef.closeDialog();
                    this.$emit('afterEdit')
                }
                
            }
        },

        handlePeaseUrl(){
            if(this.addContentForm.pease_link){
                this.peaseBtnDisable = true
                let list = {
                    pease_link: this.addContentForm.pease_link,
                }
                this.$codePost("/mobilePerfTest/get_pease_data/", list,  { operation: "解析Pease数据", success:true, failed: true }).then(res => {
                    if (res.code == 200) {
                        if(res.data.length == 1){
                            for(let i in this.normalField){
                                this.addContentForm[this.normalField[i]] = res.data[0][this.normalField[i]] ? res.data[0][this.normalField[i]] : ""
                            }
                        }else if(res.data.length > 1){
                            this.recordNum = res.data.length
                            this.recordDataList = res.data
                        }
                    }
                    this.peaseBtnDisable = false
                })
            }else{
                this.$message.error("请先填入Pease链接！")
            }
        },

        closeContentDialog(){
            this.editObject = {}
            this.selectedDeviceInScene = {}
            this.scene_data = {}
            this.dialogName = "新增"
            this.addContentForm = {
                date: "", // 测试时间
                scene_id: "",   // 场景id
                application_id: "",   // 表名
                device_name: "",  // 设备
                pease_link: "", // Pease链接

                cpu_usage: "",  // CPU占用
                gpu_use_rate: "", // GPU使用率
                real_package_size: "", // 实际包大小
                // cold_start_used: "", // 冷启动时间
                memory_usage: "", // 平均内存占用
                memory_usage_max: "", // 最大内存占用
                fps: "", // 帧率
                flow: "", // 流量
                // power_consumption: "", // 耗电量
                origin_package_size: "", // 原始包大小
                virtual_memory_avg: "",
                virtual_memory_max: "",
                baterry_temp: "",
                battery_current: "",
                battery_power: "",

                // work_time: "",  // 工时
                platform: "",  // 平台
                test_qa: "", // 测试人员
                app_name: "", // 软件名称
                class_name: "",
                remarks: "", // 备注
            }
            this.recordNum = 1
            this.recordDataList = []
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