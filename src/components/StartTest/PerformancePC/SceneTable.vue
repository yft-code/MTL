<template>
    <div class="self-table">   
        <el-table 
            :data="tableData"
            style="width: 100%"
            stripe
            border
            :key="tableKey"
            @cell-click="cellClick"
            :cell-class-name="tableCellClassName"
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            >
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                :key="index"
                :label="item.titleName.split('(').join('||(').split('A').join('||A').split('GPU内存').join('||GPU内存')"
                :render-header="renderHeader"
                align="center"
                :width="item.width"
                >
                <template slot-scope="scope">
                    <div v-if="!isPublish && scope.row.index === rowIndex && scope.column.index === columnIndex">
                        <el-input ref="editInput" 
                            v-model="scope.row[item.propName]" 
                            @keyup.enter.native="editTestData(scope.row, item.propName)" 
                            @blur="inputBlur(scope)" 
                            style="width: 100%"/>
                    </div>
                    <div v-else-if="item.type == 'normal'">
                        <span v-if="scope.row[item.propName] == 'null'" :style="isPublish ? '' : {'color': 'blue', 'cursor': 'pointer'}">--</span>
                        <span v-else :style="isPublish ? '' : {'color': 'blue', 'cursor': 'pointer'}">{{ scope.row[item.propName] }}</span>
                    </div>
                    <div v-else-if="item.propName == 'test_qa'">
                        <span>{{scope.row.test_qa_name}}</span>
                        <self-popo v-if="!$checkStrIsNull(scope.row.test_qa_name)" :email="scope.row.test_qa"/>
                    </div>
                    <div v-else-if="item.propName == 'date'">
                        <span :style="isPublish ? '' : {'color': 'blue', 'cursor': 'pointer'}">{{scope.row[item.propName].split(' ')[0]}}</span>
                    </div>
                    <div v-else>
                        <a :href="scope.row[item.propName]" target="_blank" style="color:blue">查看</a>
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column 
                v-else
                :key="index"
                fixed="left"
                :label="item.titleName"
                align="center"
                :width="item.width"
                >
                <template slot-scope="scope">
                    <span>{{scope.row[item.propName].split(' ')[0]}}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center"  fixed="right" v-if="!isPublish">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteTestRecord(scope.row)">删除</el-button>
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
        isPublish:{},
        tableKey: {},
    },
    data() {
        return {
            rowIndex: -1, //行索引
            columnIndex: -1, //列索引
        }
    },
    computed: {

    },
    created() {
        
    },
    mounted() {
        

    },
    methods: {
        deleteTestRecord(row){
            // console.log(row)
            this.$selfConfirm("是否确定删除该条测试记录", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    id: row.id
                }
                this.$codePost("/pcPerfTest/delete_test_record/", list, { operation: "删除测试记录", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },
        editTestData(row, propName){
            if(!row[propName]){
                return this.$message.error("请输入正确的值")
            }
            if(propName !== 'date'){
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
            if(row[propName] === 'null'){
                return this.$message.warning('请填入要修改的数据')
            }
            let field = this.basicColumnData.filter(field => {
                return field.propName == propName
            })[0]
            let confirmText = "确定修改【"+ field.titleName +"】为：【<b>" + row[propName] + "</b>】吗？"
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                this.$codePost("/pcPerfTest/edit_test_record/", list, { operation: "修改测试数据", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },
        cellClick(row, column, cell, event) {
            if(!this.isPublish && column.label !== '操作' && column.label !== 'PEase链接' && column.label !== '测试人员'){
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
        renderHeader(h, { column, $index }) {
            let columnArr = column.label.split("||");//此处换行标志
            if (columnArr.length >= 2) {
                let divArr = [];
                columnArr.map((item) => {
                    divArr.push(h("div", { style: "text-align: center " }, item));
                });
                return h("div", {}, divArr);
            }
            return h("div", {}, column.label);
        },
    }

}
</script>

<style scoped>

</style>