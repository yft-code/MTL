<template>
    <div class="self-table">   
        <el-table 
            :data="tableData"
            style="width: 100%"
            stripe
            border
            @cell-click="cellClick"
            :cell-class-name="tableCellClassName"
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            :span-method="objectSpanMethod"
            >
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                :key="index"
                :label="item.titleName"
                :align="item.align ? item.align : 'center'"
                :width="item.width"
                v-if="item.type == 'normal'"
                >
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.index === rowIndex && scope.column.index === columnIndex">
                            <el-input ref="editInput" 
                                v-model="scope.row[item.propName]" 
                                @keyup.enter.native="editTestData(scope.row, item.propName, item.titleName)" 
                                @blur="inputBlur(scope)" style="width: 100%"/>
                        </div>
                        <div v-else-if="item.propName == 'date'">
                            <span style="color: blue; cursor: pointer">{{ scope.row[item.propName] }}</span>
                        </div>
                        <div v-else-if="item.propName == 'msg'">
                            <span v-if="!scope.row[item.propName] || scope.row[item.propName] == 'null'" style="color: blue; cursor: pointer">--</span>
                            <pre v-else style="color: blue; cursor: pointer; font-family:Microsoft YaHei">{{ scope.row[item.propName] }}</pre>
                        </div>

                        <div v-else-if="item.propName !== 'pease_link'">
                            <span v-if="!scope.row[item.propName] || scope.row[item.propName] == 'null'" style="color: blue; cursor: pointer">--</span>
                            <span v-else style="color: blue; cursor: pointer;">{{ scope.row[item.propName] }}</span>
                        </div>
                        
                        <div v-else>
                            <span v-if="!scope.row[item.propName]" style="color: blue; cursor: pointer">上传</span>
                            <a v-else :href="scope.row[item.propName]" target="_blank" style="color:blue">查看</a>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-else-if="item.propName == 'opration'" :label="item.titleName" width="180px" align="center">
                <template slot-scope="scope">
                    <div>
                        <el-button type="primary" size="mini" @click="editTestRecord(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteTestRecord(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-else-if="item.propName == 'test_qa'" :label="item.titleName"align="center">
                <template slot-scope="scope">
                    <div>
                        <span>{{ scope.row.test_qa_name }}</span>
                        <self-popo v-if="!$checkStrIsNull(scope.row.test_qa)" :email="scope.row.test_qa"/>
                    </div>
                </template>
            </el-table-column>
            
            <el-table-column v-else :label="item.titleName" width="180px" align="center">
                <template slot-scope="scope">
                    <div>
                        <span v-if="!scope.row[item.propName]" style="color: blue; cursor: pointer">上传</span>
                        <a v-else :href="scope.row[item.propName]" target="_blank" style="color:blue">查看</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script>

export default {
    components: {
        
    },
    props: {
        basicColumnData: {
            required: true,
        },
        tableData: {},
        mergeArr: {},
        mergeObj: {},
        appUrl: {},
    },
    data() {
        return {
            rowIndex: -1, //行索引
            columnIndex: -1, //列索引
            labelDict: {

            }
        }
    },
    computed: {
        
    },
    created() {
    },
    mounted() {

    },
    methods: {
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            // console.log(column)
            // console.log(rowIndex)
            // // 判断列的属性
            // if(this.mergeArr.indexOf(column.property) !== -1) { 
            //     // 判断其值是不是为0 
            //     if(this.mergeObj[column.property][rowIndex]) { 
            //         return [this.mergeObj[column.property][rowIndex], 1]
            //     } else {
            //         // 如果为0则为需要合并的行
            //         return [0, 0]; 
            //     }
            // }
        },

        editTestData(row, propName, titleName){
            // console.log(propName)
            if(!row[propName]){
                return this.$message.error("请输入正确的浮点型数字")
            }
            if(propName !== 'date' && propName !== 'delay' && propName !== 'loss' && propName !== 'msg'){
                let notNumberList = row[propName].match(/[^\d.]/gi)
                if(notNumberList && notNumberList.length > 0){
                    return this.$message.error("请输入正确的浮点型数字")
                }
                notNumberList = row[propName].match(/^(-?\d+)(\.\d+)?$/)
                if(!notNumberList || notNumberList.length === 0){
                    return this.$message.error("请输入正确的浮点型数字")
                }
            }
            let list = {
                id: row.id,
            }
            list[propName] = row[propName]
            let confirmText = "确定修改"+ titleName +"为：【<b>" + row[propName] + "</b>】吗？"
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                this.$codePost("/" + this.appUrl + "/edit_test_record/", list, { operation: "修改测试数据", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },
        editTestRecord(row){
            this.$emit('openEditDialog', row)
            // console.log(row)
        },
        deleteTestRecord(row){
            this.$selfConfirm("是否确认删除该条测试记录", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {id: row.id}
                this.$codePost("/" + this.appUrl + "/delete_test_record/", list, { operation: "删除测试记录", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },
        cellClick(row, column, cell, event) {
            if(column.label !== '操作' && column.label !== 'Pease链接' && column.label !== '测试人员'){
                // console.log(row, '单条数据', column, '列信息', cell, 'td实例', event)
                this.rowIndex = row.index
                this.columnIndex = column.index
                this.$nextTick(() => {
                    this.$refs.editInput[0].focus()
                })
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}){
            row.index=rowIndex;
            column.index=columnIndex;
        },
        inputBlur(scope) {
            this.rowIndex = -1
            this.columnIndex = -1
            this.$emit('afterEdit')
        },
    }

}
</script>

<style scoped>

</style>