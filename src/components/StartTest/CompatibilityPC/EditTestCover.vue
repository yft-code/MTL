<template>
    <div>
        <self-dialog 
            ref="editCoverRef" 
            class="cover-div"
            :dialog-data="{ title: '编辑兼容性覆盖情况', width: '70rem', closeName: '关闭' }">
            <el-card style="margin-bottom: 1rem">
                <div 
                    class="type-item" 
                    v-for="(coverType, typeIndex) in coverData" 
                    :key="typeIndex"
                >
                    <div class="type-title">
                        <el-checkbox 
                            class="type-title" 
                            v-model="selectList[coverType.name].select" 
                            @change="selectFieldChage(coverType.name,selectList[coverType.name].select)"
                        >{{ coverType.diaplay_name }}覆盖</el-checkbox>
                        <!-- <el-checkbox 
                            class="type-title" 
                            v-model="coverType.coverage.select == 1" 
                            @change="selectFieldChage(coverType.name, coverType.coverage.select)"
                        >{{ coverType.diaplay_name }}覆盖</el-checkbox> -->
                    </div>
                    <div class="type-content" v-if="selectList[coverType.name].select">
                        <el-button 
                            size="mini" 
                            style="margin-right: 10px;" 
                            @click="handleSelectAll(typeIndex, coverType.name, selectList[coverType.name], selectAllList[coverType.name])"
                        >{{ selectAllList[coverType.name] ? '取消全选' : '全选' }}</el-button>
                        <el-checkbox-group 
                            v-model="selectList[coverType.name].item" 
                            @change="handleItemChange(coverType.name, selectList[coverType.name].select,selectList[coverType.name].item)"
                        >
                            <el-checkbox 
                                v-for="(coverageItem, coverageIndex) in coverType.coverage.items" 
                                :key="typeIndex + '_' + coverageIndex" 
                                :label="Object.keys(coverageItem)[0]"
                            >{{ Object.keys(coverageItem)[0] }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-card>
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
        tableName: String,
    },
    data() {
        return {
            selectList: [],
            selectItemList: [],
            selectAllList: {},
            allItemList: {},
            tabLoading: false,
            coverData: {},
            coverDataCopy: {},
            addItemName: "",
            addCoverType: "",
            coverForm: {
                addItemVale: "",
            },
            needDeviceModel: false,
            coverRules: {
                addItemVale: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            testType:"必测",
            options: [
                {
                    value: '必测',
                    label: '必测'
                }, 
                {
                    value: '非必测',
                    label: '非必测'
                }
            ],
            updateData: {}

        }
    },
    computed: {
    },
    created() {
    },
    mounted() {

    },
    methods: {
        //打开编辑兼容性覆盖项模态框
        async editCover() {
            let res = await this.getCoverData();
            if (res.code == 200) {
                this.$refs.editCoverRef.openDialog();
            }
        },


        handleSelectAll(index, name, selectList, isAll){
            // console.log(this.selectAllList)
            if(isAll){
                this.selectAllList[name] = false
                this.selectList[name].item = []
                let item = {}
                item[name] = {}
                item[name].items = []
                this.coverDataCopy.forEach(cover => {
                    if(cover.name == name){
                        cover.coverage.items.forEach(coverDict => {
                            let key = Object.keys(coverDict)[0]
                            let d = {}
                            d[key] = 0
                            item[name].items.push(d)
                        })
                    }
                })
                
                item[name].select = this.coverData[index].coverage.select
                let list = {
                    table_name: this.tableName,
                    edit_data: JSON.stringify(item)
                }
                this.editCoverData(list)
                
            }else{
                this.selectAllList[name] = true
                this.selectList[name].item = this.allItemList[name]
                let item = {}
                item[name] = {}
                item[name].items = []
                this.coverDataCopy.forEach(cover => {
                    if(cover.name == name){
                        cover.coverage.items.forEach(coverDict => {
                            let key = Object.keys(coverDict)[0]
                            let d = {}
                            d[key] = 1
                            item[name].items.push(d)
                        })
                    }
                })
                item[name].select = 1
                let list = {
                    table_name: this.tableName,
                    edit_data: JSON.stringify(item)
                }
                this.editCoverData(list)
            }
        },

        selectFieldChage(name, val){
            let item = {}
            item[name] = {}
            item[name].items = []
            this.coverDataCopy.forEach(cover => {
                if(cover.name == name){
                    item[name].select = val == true ? 1 : 0
                    item[name].items = item[name].items.concat(cover.coverage.items)
                }
            })
            let list = {
                table_name: this.tableName,
                edit_data: JSON.stringify(item)
            }
            this.editCoverData(list)
        },

        handleItemChange(name, select, val){
            // console.log(name)
            // console.log(select)
            // console.log(val)
            let item = {}
            item[name] = {}
            item[name].items = []
            this.coverDataCopy.forEach(cover => {
                if(cover.name == name){
                    cover.coverage.items.forEach(coverDict => {
                        let key = Object.keys(coverDict)[0]
                        let d = {}
                        if(val.indexOf(key) !== -1){
                            d[key] = 1
                        }else{
                            d[key] = 0
                        }
                        item[name].items.push(d)
                    })
                }
            })
            item[name].select = select == true ? 1 : 0
            // console.log(item)
            let list = {
                table_name: this.tableName,
                edit_data: JSON.stringify(item)
            }
            // console.log(list)
            this.editCoverData(list)
        },

        editCoverData(list){
            this.$codePost("/expertCompatibilityPC/update_record_coverage/", list, { operation: "编辑", failed: true }).then(res => {
                if (res.code == 200) {
                    // this.getCoverData();
                    this.$forceUpdate()
                }
                else{
                    this.getCoverData();
                }
            })
        },

        //获得覆盖数据
        getCoverData() {
            return new Promise(resolve => {
                let list = { table_name: this.tableName };
                this.$codePost("/expertCompatibilityPC/get_record_coverage/", list, { operation: "获取兼容性覆盖情况", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.coverData = res.data;
                        // console.log(this.coverData)
                        this.coverDataCopy = res.data;
                        let edit_data = {}
                        let selectList = {}
                        let selectAllList = {}
                        let allItemList= {}
                        this.coverData.forEach(item => {
                            edit_data[item.name] = item.coverage
                            selectList[item.name] = {}
                            selectAllList[item.name] = false
                            allItemList[item.name] = []
                            selectList[item.name]['select'] = item.coverage.select == 1
                            selectList[item.name]['item'] = []
                            item.coverage.items.forEach(cover => {
                                allItemList[item.name].push(Object.keys(cover)[0])
                                if(Object.values(cover)[0] == 1){
                                    selectList[item.name]['item'].push(Object.keys(cover)[0])
                                }
                            })
                            if(selectList[item.name]['item'].length == item.coverage.items.length){
                                selectAllList[item.name] = true
                            }
                        })
                        this.selectList = selectList
                        this.selectAllList = selectAllList
                        this.allItemList = allItemList
                        this.updateData = edit_data
                        // console.log(this.selectList)
                        // console.log(this.selectAllList)
                        // console.log(this.allItemList)
                        // console.log(this.updateData)
                    }
                    resolve(res);
                })
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
    .import {
        width: 15px;
        height: 15px;
        background: #4876F2;
        border-radius: 8px;
        margin-right: 5px;
        margin-top: 2px;
    }
    .ignore {
        width: 15px;
        height: 15px;
        background: #909399;
        border-radius: 8px;
        margin-right: 5px;
        margin-top: 2px;
        margin-left: 15px
    }
}

.el-checkbox__input.is-checked+.el-checkbox__label {
    color: #156EEF;
}


</style>
