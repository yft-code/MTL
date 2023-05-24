<template>
    <div>
        <self-dialog 
            ref="editDialogRef" 
            :dialog-data="{ title: '新增测试任务', width: '45%', top: '3rem', confirmName: '确定', closeName: '取消' }" 
            @confirm="saveTestContent"
            >
            <div>
                <el-form 
                    ref="testContentFormPCRef" 
                    :model="testContentFormList" 
                    :show-message="false" 
                    label-width="120px"
                    >
                    <!-- TODO index问题、三个属性以上 -->
                    <el-form-item 
                        v-for="item,index in basicColumnData" 
                        :key="index" :label="item.titleName" 
                        class="form-item">
                        <el-select 
                            v-model="testContentFormList[item.propName]" 
                            filterable 
                            clearable
                            :placeholder="'请选择'+item.titleName"
                            style="width: 90%"
                            allow-create
                            >
                            <el-option 
                                v-for="(option,k) in optionDict[item.propName]" 
                                :key="index+'_'+k" :label="option" 
                                :value="option">
                                <span>{{option}}
                                    <span v-if="testedData && testedData[nameDict[item.propName]] && testedData[nameDict[item.propName]].indexOf(option) !== -1" class="check-icon">√</span>
                                </span>
                            </el-option>
                        </el-select>
                        <span v-if="testedData && testedData[nameDict[item.propName]] && testedData[nameDict[item.propName]].indexOf(testContentFormList[item.propName]) !== -1" class="check-icon">√</span>
                    </el-form-item>
                </el-form>
            </div>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
export default {
    components: {
        SelfDialog
    },
    props: {
        customCols: Array,
        tableName: String,
        allRecord: {},
        NameReflect: {},
        optionDict: {},
        testedData: {},
        nameDict: {},
        basicColumnData: {},
    },
    data() {
        return {
            testContentFormList: {
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
            conflictEmail: "",
        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch: {

    },
    created() {
        
    },
    mounted() {

    },
    methods: {
        //获得设备下问题对应图片数组
        getPicUrl(picDict){
            let picArr = picDict.map((v,index)=>{
                return v.pic_url;
            })
            return picArr;
        },

        addTestContent() {
            this.$refs.editDialogRef.openDialog();
        },
        
        //初始化填写数据
        initData(){
            let list = {
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
            };
            this.testContentFormList = list;
        },


        //确认新增测试任务
        saveTestContent() {
            // let msg = this.checkData()
            // if(msg.displayName.length > 0){
            //     //重复机型提示
            //     this.$selfConfirm("当前测试表中已存在该【"+ msg.displayName.join('、') +"】，确定仍要添加吗?", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
            //         this.createMission()
            //     }).catch(() => {
            //         //取消
            //         msg.propName.forEach(item => {
            //             this.$set(this.testContentFormList, item, "");
            //         })
            //     });
            // } else{
            //     this.createMission()
            // }
            
            this.conflictEmail = ""
            // 任务完全一致判定
            let flag = this.iSAlreadyCreate()
            if(flag){
                this.$selfConfirm("当前测试表中已存在测试项完全相同的测试任务【"+ this.conflictEmail +"名下】，确定仍要添加吗?", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                    this.createMission()
                }).catch(() => {
                    //取消
                    this.initData()
                });
            } else{
                this.createMission()
            }
            // this.createMission()
        },


        createMission(){
            this.$store.commit("setPageIsLoading", true);
            let formData = new FormData();
            //表单填写数据
            for (let k in this.testContentFormList) {
                if(this.testContentFormList[k]){
                    formData.append(k, this.testContentFormList[k]);
                }else{
                    formData.append(k, "");
                }
            }
            //不用用户填写，但要传给后台的固定数据
            formData.append("project", this.projectCode);
            formData.append("table_name", this.tableName);
            
            let postApp = "insert_expert_test_record";
            
            
            // for (var [key, valuefor] of formData) {
            //     console.log(key,":", valuefor);
            // }

            this.$formPost("/expertCompatibilityPC/" + postApp + "/", formData, { operation: "新增测试任务", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.initData();
                    // this.resetTestContentForm();
                    this.$refs.editDialogRef.closeDialog();
                    this.$emit("afterEdit", "addTestContent");
                }
                this.$store.commit("setPageIsLoading", false);
            })
        },

        checkData(){
            let msg = {
                displayName: [],
                propName: [],
            }
            for(let k in this.testContentFormList){
                let key = this.NameReflect.filter(item => {
                    return item.pc_report_col_name == k
                })[0].diaplay_name
                if(this.testedData[key].indexOf(this.testContentFormList[k]) !== -1){
                    msg['displayName'].push(key)
                    msg['propName'].push(k)
                }
            }
            return msg
        },

        // 任务完全一致判定
        iSAlreadyCreate(){
            // console.log(this.allRecord)
            let flag = false
            for(let i in this.allRecord){
                let result = this.isObjectValueEqual(this.testContentFormList, this.allRecord[i])
                if(result){
                    this.conflictEmail = this.allRecord[i].test_qa
                    flag = true
                    break;
                }
            }
            return flag
        },

        // 判断两个对象完全一致
        isObjectValueEqual(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            // console.log(aProps)
            for(let k in a){
                if(a[k] == ''){
                    continue;
                }
        
                if (a[k] !== b[k]) {
                    return false;
                }
            }
            return true;
        },


        //初始化测试内容模态框
        resetTestContentForm() {
            this.$refs["testContentFormPCRef"].resetFields();
        },

        //新增问题
        addCaseQuestion() {
            this.$refs.editQuestionRef.addCaseQuestion();
        },
    },

}
</script>
<style scoped>
.form-item{
    display: inline-block;
    width: 49%;
}

.check-icon{
    color: green;
    margin-left: 5px;
}
</style>
