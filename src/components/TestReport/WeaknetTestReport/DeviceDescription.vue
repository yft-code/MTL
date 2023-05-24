<template>
    <div v-if="deviceData.length !== 0">
        测试设备：
        <div v-for="record,i in deviceData" :key="i" style="margin-left: 15px;">
            <el-row>
                <el-col :span="2.5" style="margin-top: 5px; text-align:center;" v-if="record.device_msg">{{record.date.split(' ')[0]}}版本：</el-col>
                <el-col :span="21">
                    <span v-for="item,k in deviceFieldList" :key="i+'_'+k" class="device-detail-span" v-if="record.device_msg[item.label]">
                        <span>{{item.propName}}: {{ record.device_msg[item.label] }}；</span>
                    </span>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script> 
export default {
    components: {

    },
    data() {
        return {
            deviceFieldList: [
                {
                    label: "name",
                    propName: "设备名称",
                },
                {
                    label: "deviceBrand",
                    propName: "设备品牌",
                },
                {
                    label: "device",
                    propName: "设备机型",
                },
                {
                    label: "os",
                    propName: "系统版本",
                },
                {
                    label: "ram",
                    propName: "内存",
                },
                {
                    label: "resolution",
                    propName: "分辨率",
                },
                {
                    label: "gpuModel",
                    propName: "gpu名称",
                },
                {
                    label: "cpuModel",
                    propName: "cpu名称",
                },
                // {
                //     label: "isRoot",
                //     propName: "是否开启root",
                // },
                {
                    label: "screenType",
                    propName: "屏幕类型",
                },
                {
                    label: "performanceLevel",
                    propName: "性能级别",
                },
            ]
        }
    },
    props: {
        deviceData: {},
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        }
    },
    created() {
        
    },
    mounted(){
    },
    methods: {
        
    },

}
</script>

<style scoped>
.device-detail-span{
    margin-top: 5px;
    display: inline-block;
    margin-left: 2px;
}
.device-item-div{
    margin-left: 18px;;
}
</style>
