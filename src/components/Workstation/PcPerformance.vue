<template>
    <div class="workstation-content">
    
        <div class="list-title">电脑设备组合管理</div>
        <div class="list-container">
            <div>
                <el-button type="primary" style="display:inline-block;margin-bottom: 10px;" size="mini" @click="addDevice">新增</el-button>
                <!-- 搜索框 -->
                <el-input v-model="searchValue" placeholder="请输入设备名称" style="margin-bottom: 10px;display:inline-block;float: right; width: 300px; margin-right: 10px;"></el-input>
            </div>
            
            <el-table :data="deviceData" :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }">
                <el-table-column v-for="item,index in deviceTableItemList" :label="item.titleName" align="center" :key="index" :min-width="item.minWidth? item.minWidth:''">
                    <template v-slot="scope">
                        <div v-if="item.propName === 'operate'">
                            <el-button type="primary" size="mini" @click="editDevice(scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini">删除</el-button>
                        </div>
                        <span v-else>{{scope.row[item.propName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>

        <self-dialog 
            ref="editTestDeviceRef" 
            :dialog-data="{ title: editTestName+'测试设备', width: '45%', confirmName: editTestName, closeName: '取消' }" 
            @confirm="confirmEditDevice">
            <el-form ref="editDeviceFormRef" :model="editDeviceForm" label-suffix=":" :rules="editDeviceFormRules" label-width="100px">
                <el-form-item label="组合名" prop="name" class="item-short">
                    <el-input v-model="editDeviceForm['name']" placeholder="请输入组合名" style="width: 90%"></el-input>
                </el-form-item>
                <el-form-item v-for="item,index in deviceTableItemList" v-if="item.propName !== 'operate' && item.propName !== 'name'" :label="item.titleName" :key="index" :prop="item.propName" class="item-short">
                    <el-select 
                        v-model="editDeviceForm[item.propName]" 
                        filterable 
                        clearable
                        :placeholder="'请选择'+item.titleName"
                        style="width: 90%"
                        allow-create
                        >
                        <el-option v-for="(option,k) in optionDict[item.select]" :key="index+'_'+k" :label="option" :value="option">
                            <span>{{option}}</span>
                        </el-option>
                    </el-select>
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
            searchValue: "",
            editTestName: "新增",
            deviceTableItemList: [
                {
                    titleName: "组合名",
                    propName: "name",
                },
                {
                    titleName: "操作系统",
                    propName: "os",
                    select: "osOptions"
                },
                {
                    titleName: "显卡",
                    propName: "gpu",
                    select: "gpuOptions"
                },
                {
                    titleName: "输入法",
                    propName: "input",
                    select: "inputOptions"
                },
                {
                    titleName: "杀毒软件",
                    propName: "antivirus_software",
                    select: "antivirusSoftwareOptions"
                },
                {
                    titleName: "游戏内分辨率",
                    propName: "game_resolution",
                    select: "gamaResolutionOptions"
                },
                {
                    titleName: "显示器分辨率",
                    propName: "pc_resolution",
                    select: "pcResolutionOptions"
                },
                {
                    titleName: "游戏画质",
                    propName: "display_quality",
                    select: "displayQualityOptions"
                },
                {
                    titleName: "画面模式",
                    propName: "picture_mode",
                    select: "pictureModeOptions"
                },
                {
                    titleName: "游戏存储位置",
                    propName: "game_location",
                    select: "gameLocationOptions"
                },
                {
                    titleName: "游戏内语言",
                    propName: "game_language",
                    select: "gameLanguageOptions"
                },
                {
                    titleName: "系统语言",
                    propName: "os_language",
                    select: "osLanguageOptions"
                },
                {
                    titleName: "游戏平台",
                    propName: "game_platform",
                    select: "gamePlatformOptions"
                },
                {
                    titleName: "其他",
                    propName: "other_set",
                    select: "othersetOptions"
                },
                {
                    propName: 'operate',
                    titleName: '操作',
                    minWidth: '110px',
                }
            ],
            deviceData: [
                {
                    name: "兼容1",
                    os: "win10",
                    gpu: "gtx1060",
                    input: "搜狗",
                    antivirus_software: "360",
                    game_resolution: "1920*1080",
                    pc_resolution: "1920*1080",
                    display_quality: "高",
                    picture_mode: "游戏",
                    game_location: "固态",
                    game_language: "中文",
                    os_language: "中文",
                    game_platform: "steam",
                    other_set: "无",
                },
                {
                    name: "兼容2",
                    os: "win10",
                    gpu: "gtx1060",
                    input: "搜狗",
                    antivirus_software: "360",
                    game_resolution: "1920*1080",
                    pc_resolution: "1920*1080",
                    display_quality: "高",
                    picture_mode: "游戏",
                    game_location: "固态",
                    game_language: "中文",
                    os_language: "中文",
                    game_platform: "steam",
                    other_set: "无",
                },
                {
                    name: "兼容3",
                    os: "win10",
                    gpu: "gtx1060",
                    input: "搜狗",
                    antivirus_software: "360",
                    game_resolution: "1920*1080",
                    pc_resolution: "1920*1080",
                    display_quality: "高",
                    picture_mode: "游戏",
                    game_location: "固态",
                    game_language: "中文",
                    os_language: "中文",
                    game_platform: "steam",
                    other_set: "无",
                },
            ],
            editDeviceForm: {
                name: "",
                os: "",// 系统版本
                gpu: "", // 显卡
                input: "", // 输入法
                antivirus_software: "", // 杀毒软件
                game_resolution: "", // 游戏内分辨率
                pc_resolution: "", // 显示器分辨率
                display_quality: "", // 游戏画质
                picture_mode: "", // 画面模式
                game_location: "", // 游戏存储位置
                game_language: "", // 游戏内语言
                os_language: "", // 系统语言
                game_platform: "", // 游戏平台
                other_set: "",
            },
            editDeviceFormRules: {
                name: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
            },
            NameReflect: "",
            optionDict: {
                osOptions: [],
                gpuOptions: [],
                inputOptions: [],
                antivirusSoftwareOptions:[],
                gamaResolutionOptions:[],
                pcResolutionOptions: [],
                displayQualityOptions: [],
                pictureModeOptions: [],
                gameLocationOptions: [],
                gameLanguageOptions: [],
                osLanguageOptions: [],
                gamePlatformOptions: [],
                othersetOptions: [],
            },
            nameDict: {}
        }
    },
    props:{
        
    },
    created(){
        this.getOptions()
        this.getDeviceData()
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
        confirmEditDevice(){
            let hasError = this.$publicJS.checkFormData(this, "editDeviceFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editDeviceForm){
                    formData.append(k, this.editDeviceForm[k]);
                }
                // 这里需要重写
                // let appUrl = "create_test_device"
                // if(this.editTestName === "编辑"){
                //     formData.append('old_name', this.selectedDevice.name);
                //     appUrl = "edit_test_device"
                // }
                // this.$formPost("/mobilePerfTest/"+ appUrl +"/", formData, { operation: this.editDeviceName+"测试设备", success:true, failed: true }).then(res => {
                //     if (res.code == 200) {
                //         // this.$refs.editTestDeviceRef.closeDialog()
                //         this.$refs.editDeviceFormRef.resetFields()
                //         this.selectedDevice = {}
                //         this.device_name = ""
                //         this.$emit('afterEdit')
                //     }
                // })
            } 
        },
        editDevice(row){
            // console.log(row)
            this.editDeviceForm = row
            this.editTestName = "编辑"
            this.$refs.editTestDeviceRef.openDialog()
        },
        addDevice(){
            this.editDeviceForm = {
                name:"",
                disk_type:"",
                system_version:"",
                cpu_name:"",
                mem_size:"",
                gpu_name:"" ,
                config:"",
                resolution: "",
            }
            this.editTestName = "新增"
            this.$refs.editTestDeviceRef.openDialog()
        },

        // 获取选项数据
        getOptions() {
            this.$axiosGet("/expertCompatibilityPC/get_select_options/", {}, { operation: "获取测试选项", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res)
                    this.NameReflect = res.data.NameReflect
                    this.optionDict.osOptions = res.data.os
                    this.optionDict.gpuOptions = res.data.gpu
                    this.optionDict.inputOptions = res.data.input
                    this.optionDict.antivirusSoftwareOptions = res.data.antivirus_software
                    this.optionDict.gamaResolutionOptions = res.data.game_resolution
                    this.optionDict.pcResolutionOptions = res.data.pc_resolution
                    this.optionDict.displayQualityOptions = res.data.display_quality
                    this.optionDict.pictureModeOptions = res.data.picture_mode
                    this.optionDict.gameLocationOptions = res.data.game_location
                    this.optionDict.gameLanguageOptions = res.data.game_language
                    this.optionDict.osLanguageOptions = res.data.os_language
                    this.optionDict.gamePlatformOptions = res.data.game_platform
                    this.optionDict.othersetOptions = res.data.other_set
                }
            })
        },

        getDeviceData(){
            // this.$axiosGet("/mobilePerfTest/get_test_device/", {}, { operation: "获取测试设备", failed: true }).then(res => {
            //     if (res.code == 200) {
            //         this.deviceData = res.data
            //         this.deviceData.forEach(item => {
            //             item.name = this.NameReflect[item.name]
            //         })
            //     }
            // })
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
.item-short{
    display: inline-block;
    width: 45%;
    margin-left: 2%;
}
</style>