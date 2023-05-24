<template>
    <div>
        <self-dialog 
            ref="compareRef" 
            :dialog-data="{ title: '选择对比测试记录', width: '31%', closeName: '关闭' }" 
            style="text-align: left;"
            @close="compareDialogClose">
                <el-row>
                    <el-col :span="5"><span style="float: right">选择对比记录：</span></el-col>
                    <el-col :span="16">
                        <el-select v-model="selectCompareList" placeholder="选择对比记录" filterable multiple class="corpselect" :popper-append-to-body="false">
                            <el-option v-for="item,index in oldRecordList" :label="item.table" :value="item.table" :key="index"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2"><el-button type="primary" size="mini" style="float:left;" @click="addCompareRecord">确认</el-button></el-col>
                </el-row><br> 
                <el-row>
                    <el-col :span="5"><span style="float: right">已选择：</span></el-col>
                    <el-col :span="19">
                        <span v-for="item,k in comparerecordList" :key="k" style="float: left; margin-left: 5px; margin-bottom: 5px;">
                            <el-tag closable @close="deleteCompareRecord(item)">{{item.content_name}}</el-tag>
                        </span>
                    </el-col>
                </el-row>
            </el-form>
        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    data() {
        return {
            selectCompareList:[],
        }
    },
    props: {
        oldRecordList: {},
        axiosList: {},
        comparerecordList:{},
    },
    methods: {
        compareDialogClose(){
            this.selectCompareList = []
        },

        addCompareRecord(){
            if(this.selectCompareList.length == 0){
                return
            }
            this.editCompareRecord()
        },

        editCompareRecord(){
            let name_list = []
            this.comparerecordList.forEach(item => {
                name_list.push(item.content_name)
            })
            name_list = name_list.concat(this.selectCompareList)
            // console.log(name_list)
            let list = {
                table_name: this.axiosList.table_name,
                name_list: name_list.join(',')
            }
            this.$codePost("/pcPerfTest/edit_compare_data/", list, { operation: "修改对比记录", failed: true }).then(res => {
                if (res.code == 200) {
                    this.$emit('afterEdit')
                    this.selectCompareList = []
                }
            })
        },

        openDialog(){
            this.$refs.compareRef.openDialog();
        },

        deleteCompareRecord(item){
            let confirmText = "确定删除【<b>" + item.content_name + "</b>】吗？"
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let name_list = []
                this.comparerecordList.forEach(record => {
                    if(item.content_name !== record.content_name){
                        name_list.push(record.content_name)
                    }
                })
                let list = {
                    table_name: this.axiosList.table_name,
                    name_list: name_list.join(',')
                }
                this.$codePost("/pcPerfTest/edit_compare_data/", list, { operation: "修改对比记录", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit('afterEdit')
                        this.selectCompareList = []
                    }
                })
            }).catch(() => { });
        },
    },
}
</script>

<style scoped>
.corpselect {
    width: 95%;
}
/deep/ .el-select__tags-text {
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/deep/ .el-select .el-tag__close.el-icon-close {
    top: -7px;
}
</style>