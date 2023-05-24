<template>
    <div class="self-table">   
        <el-table 
            :data="tableData"
            style="width: 100%"
            :border="isFirst ? false : true"
            :stripe="isFirst ? true : false"
            @cell-click="cellClick"
            :cell-class-name="tableCellClassName"
            :row-class-name="getRowClass" 
            :header-cell-style="isFirst ? { backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' } : {}"
            >
            <el-table-column type="expand" width="15px;" v-if="isFirst">
                <template slot-scope="scope">
                    <div style="padding:0 20px; margin:0;">
                        <scene-table :basicColumnData="basicColumnData" :tableData="scope.row.records ? scope.row.records : []"
                            @openEditDialog="openEditDialog" @afterEdit="afterEdit"></scene-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                :key="index"
                :label="item.titleName"
                :prop="item.propName"
                align="center"
                :width="item.width"
                v-if="item.type == 'normal'">
                <template slot-scope="scope">
                    <div v-if="isFirst">
                        {{ scope.row[item.propName] }}
                    </div>
                    <div v-else>
                        <div v-if="item.propName == 'class_name'">
                            {{ scope.row[item.propName] }}
                        </div>
                        <div v-else-if="scope.row.index === rowIndex && scope.column.index === columnIndex">
                            <el-input ref="editInput" 
                                v-model="scope.row[item.propName]" 
                                @keyup.enter.native="editTestData(scope.row, item.propName, item.titleName)" 
                                @blur="inputBlur(scope.row, item.propName, item.titleName)" style="width: 100%"/>
                        </div>
                        <div v-else-if="item.propName !== 'pease_link' && item.propName !== 'date'">
                            <span v-if="!scope.row[item.propName] || scope.row[item.propName] == 'null'" style="color: blue; cursor: pointer">--</span>
                            <span v-else style="color: blue; cursor: pointer">{{ scope.row[item.propName] }}</span>
                        </div>

                        <div v-else-if="item.propName == 'date'">
                            <span v-if="!scope.row[item.propName] || scope.row[item.propName] == 'null'" style="color: blue; cursor: pointer">--</span>
                            <span v-else style="color: blue; cursor: pointer">{{ scope.row[item.propName].split(' ')[0] }}</span>
                        </div>
                        
                        <div v-else>
                            <span v-if="!scope.row[item.propName]">--</span>
                            <a v-else :href="scope.row[item.propName]" target="_blank" style="color:blue">查看</a>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-else :label="item.titleName" :width="item.width" align="center">
                <template slot-scope="scope">
                    <div>
                        <!-- <el-button type="primary" size="mini" @click="editTestRecord(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteTestRecord(scope.row)">删除</el-button> -->
                        <i class="el-icon-edit" v-if="!isFirst" @click="editTestRecord(scope.row, basicColumnData)" style="cursor: pointer;"></i>
                        <i class="el-icon-delete" @click="deleteTestRecord(scope.row)" :style="isFirst ? {'cursor': 'pointer'}:{'cursor': 'pointer', 'margin-left': '20px'}"></i>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script>

export default {
    name: 'SceneTable',
    components: {
        
    },
    props: {
        basicColumnData: {
            required: true,
        },
        tableData: {},
        isFirst: {
            default: false,
        },
    },
    data() {
        return {
            rowIndex: -1, //行索引
            columnIndex: -1, //列索引
            oldValue: '', //旧值
        }
    },
    computed: {
        
    },
    created() {
    },
    mounted() {
        

    },
    methods: {
        // 展开行样式
        getRowClass(row, rowIndex){
            if(!row.row || !row.row.records || row.row.records.length == 0){
                return 'row-expand-cover'
            }
        },
        editTestData(row, propName, titleName){
            // console.log(propName)
            if(!row[propName]){
                return this.$message.error("请输入正确的值")
            }
            if(propName !== 'date' && propName !== 'device_name' && propName !== 'app_name'){
                let notNumberList = row[propName].match(/[^\d.]/gi)
                if(notNumberList && notNumberList.length > 0){
                    return this.$message.error("请输入正确的值")
                }
                notNumberList = row[propName].match(/^(-?\d+)(\.\d+)?$/)
                if(!notNumberList || notNumberList.length === 0){
                    return this.$message.error("请输入正确的值")
                }
            }
            let list = {
                id: row.id,
            }
            list[propName] = row[propName]
            let newValue = row[propName]
            let confirmText = "确定修改"+ titleName +"为：【<b>" + row[propName] + "</b>】吗？"
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                this.$codePost("/mobilePerfTest/edit_test_record/", list, { operation: "修改测试数据", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        // console.log(row[propName])
                        row[propName] = newValue
                        // this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },
        editTestRecord(row, basicColumnData){
            this.$emit('openEditDialog', row, basicColumnData)
            // console.log(row)
        },
        openEditDialog(row, basicColumnData){
            this.$emit('openEditDialog', row, basicColumnData)
        },
        deleteTestRecord(row){
            if(this.isFirst){
                this.$selfConfirm("是否确认删除该组别以及该组别下的所有测试记录", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                    // console.log(row)
                    row.records.forEach(item => {
                        let list = {id: item.id}
                        this.$codePost("/mobilePerfTest/delete_test_record/", list, { operation: "删除测试记录", success: true, failed: true })
                    })
                    this.$emit('afterEdit')
                    // let list = {id: row.id}
                    // this.$codePost("/mobilePerfTest/delete_test_record/", list, { operation: "删除测试记录", success: true, failed: true }).then(res => {
                    //     if (res.code == 200) {
                    //         this.$emit('afterEdit')
                    //     }
                    // })
                }).catch(() => { });
            }else{
                this.$selfConfirm("是否确认删除该条测试记录", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                    let list = {id: row.id}
                    this.$codePost("/mobilePerfTest/delete_test_record/", list, { operation: "删除测试记录", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$emit('afterEdit')
                            
                        }
                    })
                }).catch(() => { });
            }
        },
        afterEdit(){
            this.$emit('afterEdit')
        },
        cellClick(row, column, cell, event) {
            if(!this.isFirst && column.label !== '操作' && column.label !== 'Pease链接' && column.label !== '测试人员' && column.label !== '组别名'){
                // console.log(row, '单条数据', column, '列信息', cell, 'td实例', event)
                this.rowIndex = row.index
                this.columnIndex = column.index
                this.oldValue = row[column.property]
                // console.log(row[column.property])
                this.$nextTick(() => {
                    this.$refs.editInput[0].focus()
                })
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}){
            row.index=rowIndex;
            column.index=columnIndex;
        },
        inputBlur(row, propName, titleName) {
            this.rowIndex = -1
            this.columnIndex = -1
            row[propName] = this.oldValue
        },
    }

}
</script>

<style scoped>
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon{
    display: none;
}
</style>