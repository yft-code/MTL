<template>
    <div>
        <self-dialog 
            ref="coverRef" 
            :dialog-data="{ title: '兼容性覆盖情况', width: '70rem', closeName: '关闭' }" 
        >
            <div v-loading="coverData == ''" class="cover-div">
                <div class="status-div">  
                    <div class="span-state" style="color: green;">√</div>已测试 
                    <div class="span-state" style="color: red;">×</div>未测试 
                    <div class="state" style="background: #909399;"></div>非必测
                    <div style="margin-left:15px;margin-right:5px">/</div>不用测
                </div>
                <el-card v-for="(item,k) in coverData" :key="k" style="margin-bottom: 1rem">
                    <div slot="header" class="clearfix plat-title">
                        {{ k }}
                    </div>
                    <div class="type-item" v-for="(coverType, typeIndex) in item" :key="k + '_' + typeIndex">
                        <div class="type-title">{{ coverType.label }}</div>
                        <div class="type-content">
                            <div v-if="coverType.label == '厂商覆盖'">
                                <el-table
                                    :data="coverType.format_coverage"
                                    style="width: 100%"
                                    :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
                                    border
                                    :row-style="rowStyle"
                                >
                                    <el-table-column
                                        prop="os"
                                        label=""
                                        fixed="left"
                                        minWidth="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        v-for="(brandItem, brandIndex) in coverType.brand"
                                        :key="k + '_' + typeIndex + '_' + brandIndex"
                                        :prop="brandItem"
                                        :label="brandItem"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <span class="coverage-state">
                                                <div v-if="scope.row.os.indexOf('Android') == -1">
                                                    <span v-if="scope.row[brandItem] == 0" style="color: red">× </span>
                                                    <span v-if="scope.row[brandItem] == 1" style="color: green">√ </span>
                                                    <span v-else-if="scope.row[brandItem] == 2">
                                                        /
                                                    </span>
                                                    <span v-else-if="scope.row[brandItem] == 3">
                                                        <div class="cover-state" style="background-color:#909399" />
                                                    </span>
                                                </div>
                                                <div v-else-if="parseInt(scope.row.os.split(' ')[1]) >= android_os_level">  
                                                    <span v-if="scope.row[brandItem] == 0" style="color: red">× </span>
                                                    <span v-if="scope.row[brandItem] == 1" style="color: green">√ </span>
                                                    <span v-else-if="scope.row[brandItem] == 2">
                                                        /
                                                    </span>
                                                    <span v-else-if="scope.row[brandItem] == 3">
                                                        <div class="cover-state" style="background-color:#909399" />
                                                    </span>
                                                </div>
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div 
                                v-else
                                v-for="(coverageItem, coverageIndex) in coverType.coverage" 
                                :key="k + '_' + typeIndex + '_' + coverageIndex" 
                                class="every-coverage" 
                            >
                            <!--{{coverType.coverage}}-->
                                <div>
                                    <span :style="spanStyle(coverType, coverageItem)">{{ coverageItem.type }}</span>
                                    <span class="coverage-state">
                                        <span v-if="(coverType.label == '内存覆盖' && parseInt(coverageItem.type.split('G')[0]) < android_ram_level) || (coverType.label == 'iOS系统覆盖(大版本覆盖)' && parseInt(coverageItem.type.split(' ')[1]) < ios_os_level)"></span>
                                        <span v-else>
                                            <span v-if="coverageItem.state == 0" style="color: red">×</span>
                                            <span v-else-if="coverageItem.state == 1" style="color: green">√</span>
                                            <span v-else-if="coverageItem.state == 2">
                                            /
                                            </span>
                                            <span v-else-if="coverageItem.state == 3">
                                                <div class="cover-state" style="background-color:#909399" />
                                            </span>
                                        </span>
                                    </span>
                                </div> 
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import "@/css/cover.css"
export default {
    components: {
        SelfDialog,
    },
    props: {
        tableName: {},
        testDetail: {}
    },
    data() {
        return {
            coverData: "",
        }
    },
    computed: {
        android_os_level(){
            if(this.testDetail.android_platform){
                let arr = this.testDetail.android_os.match(/\d+(.\d+)?/g)
                if(arr.length > 0){
                    return parseInt(arr[0].trim())
                }else{
                    return 5
                }
            }else{
                return 5
            }
        },
        android_ram_level(){
            if(this.testDetail.android_platform){
                let arr = this.testDetail.android_ram.match(/\d+(.\d+)?/g)
                if(arr.length > 0){
                    return parseInt(arr[0].trim())
                }else{
                    return 3
                }
            }else{
                return 3
            }
        },
        ios_os_level(){
            if(this.testDetail.ios_platform){
                let arr = this.testDetail.ios_os.match(/\d+(.\d+)?/g)
                if(arr.length > 0){
                    return parseInt(arr[0].trim())
                }else{
                    return 8
                }
            }else{
                return 8
            }
        }
    },
    created() {
        
    },
    mounted() {

    },
    methods: {
        rowStyle({row, rowIndex}){
            if(row.os.indexOf("Android") !== -1){
                let level = row.os.split('Android')[1]
                let os_number = parseInt(level.trim())
                if(os_number < this.android_os_level){
                    return {
                        color: '#D3D3D3'
                    }
                }
            }else{
                return {}
            }
        },

        spanStyle(coverType, coverageItem){
            if(coverType.label == '内存覆盖'){
                let coverageItemNumber = parseInt(coverageItem.type.split('G')[0])
                if(coverageItemNumber < this.android_ram_level){
                    return {
                        color: '#D3D3D3'
                    }
                }
            }else if(coverType.label == 'iOS系统覆盖(大版本覆盖)'){
                let coverageItemNumber = parseInt(coverageItem.type.split(' ')[1])
                if(coverageItemNumber < this.ios_os_level){
                    return {
                        color: '#D3D3D3'
                    }
                }
            }
        },

        //获得兼容性覆盖情况
        async getCover() {
            this.$refs.coverRef.openDialog();
            let list = { table_name: this.tableName };
            // console.log(list)
            this.$codePost("/protocolTest/model_coverage/", list, { operation: "获取兼容性覆盖情况", failed: true }).then(res => {
                if (res.code == 200) {
                    this.coverData = res.data;
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>

.status-div {
    display: flex;
    direction: row;
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    justify-content: flex-end;
    margin-right: 10px;
}

.span-state {
    margin: 0 5px 0 15px;
    font-size: 18px;
    font-weight: bold;
}

.state {
    width: 15px;
    height: 15px;
    border-radius: 8px;
    margin-right: 5px;
    margin-top: 2px;
    margin-left: 15px;
    display: inline-block;
}

.cover-state {
    vertical-align: middle;
    width: 11px;
    height: 11px;
    border-radius: 7px;
    display: inline-block;
}

</style>
