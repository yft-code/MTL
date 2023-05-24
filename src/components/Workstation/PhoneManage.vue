<template>
    <div class="workstation-content">
        <edit-device ref="editDeviceRef" :packageType="packageType" :deviceItemList="deviceItemList" :basicColumnData="basicColumnData"></edit-device>
        <div class="list-title">手机设备管理</div>
        <div class="list-container">
            <!-- <div style="margin-bottom: 10px;"> -->
            <div>
                <!-- <el-button v-if="isAdmin || isTester" type="primary" size="small" @click="addTestDevice">新增设备</el-button> -->
                <el-input
                    style="width: 20%; margin-left: 78%"
                    placeholder="请输入关键词检索"
                    prefix-icon="el-icon-search"
                    v-model="keyValue"
                    clearable
                    ></el-input>
            </div>
            <div>
                <!-- 分Android和iOS -->
                <el-tabs v-model="packageType" type="card" @tab-click="keyValue=''">
                    <el-tab-pane label="Android" name="0">
                        <mission-table :style="androidDataShow.length > 15 ? {'height': '650px','overflow':'auto'} : {}" :basicColumnData="basicColumnData" :tableData="androidDataShow" @deleteDevice="deleteDevice" @editDevice="editDevice"></mission-table>
                    </el-tab-pane>
                    <el-tab-pane label="iOS" name="1">
                        <mission-table :style="iosDataShow.length > 15 ? {'height': '650px','overflow':'auto'} : {}" :basicColumnData="basicColumnData" :tableData="iosDataShow" @deleteDevice="deleteDevice"  @editDevice="editDevice"></mission-table>
                    </el-tab-pane>
                </el-tabs>

                <!-- 所有设备 -->
                <!-- <el-card>
                    <mission-table :style="tableDataShow.length > 15 ? {'height': '650px','overflow':'auto'} : {}" :basicColumnData="basicColumnData" :tableData="tableDataShow" @deleteDevice="deleteDevice"  @editDevice="editDevice"></mission-table>
                </el-card> -->
            </div> 
        </div>
    </div>
</template>

<script>
import MissionTable from '@/components/StartTest/Common/MissionTable'
import EditDevice from '@/components/Workstation/EditDevice'
export default {
    components: {
        MissionTable,
        EditDevice
    },
    data() {
        return {
            deviceInfo: {},
            deviceItemList: [],
            packageType: '0',   // 0-Android; 1-ios
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
                // {
                //     propName: 'operation',
                //     titleName: '操作',
                //     minWidth: '180',
                // },
            ],
            androidData: [],
            androidDataShow: [],
            iosData: [],
            iosDataShow: [],
            tableData: [],
            tableDataShow: [],
            keyValue: "",   // 搜索的关键字
        }
    },
    props:{
        
    },
    created(){
        this.getDeviceItem()
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
        keyValue(val){
            // 所有的数据
            // if(val){
            //     let tableData = []
            //     this.tableData.forEach(item => {
            //         if(item.device.indexOf(val) !== -1 || item.class.indexOf(val) !== -1){
            //             tableData.push(item)
            //         }
            //     })
            //     this.tableDataShow = tableData
            // }else{
            //     this.getDeviceItem()
            // }

            if(val){
                let tableData = []
                if(this.packageType == 0){
                    this.androidData.forEach(item => {
                        if(item.device.indexOf(val) !== -1 || item.class.indexOf(val) !== -1){
                            tableData.push(item)
                        }
                    })
                    this.androidDataShow = tableData
                }else{

                    this.iosData.forEach(item => {
                        if(item.device.indexOf(val) !== -1 || item.class.indexOf(val) !== -1){
                            tableData.push(item)
                        }
                    })
                    this.iosDataShow = tableData
                }
            }else{
                this.getDeviceItem()
            }
        }
    },
    methods:{
        // 获取设备选项字段
        getDeviceItem(){
            this.$codePost("/expertCompatibility/get_preset_device/").then(res => {
                if(res.code == 200){
                    // console.log(res.data)
                    this.deviceInfo = res.data
                    this.deviceItemList = []
                    this.tableData = []
                    this.tableDataShow = []
                    for(let k in res.data){
                        this.deviceItemList.push(k)
                        this.tableData = this.tableData.concat(res.data[k])
                        this.tableDataShow = this.tableData.concat(res.data[k])
                    }
                    this.androidData = this.deviceInfo.android
                    this.androidDataShow = this.deviceInfo.android
                    this.iosData = this.deviceInfo.ios
                    this.iosDataShow = this.deviceInfo.ios
                }
            })
        },

        addTestDevice(){
            this.$refs.editDeviceRef.openDialog()
        },

        deleteDevice(row){
            console.log(row)
        },

        editDevice(row){
            this.$refs.editDeviceRef.openDialog(row)
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
</style>