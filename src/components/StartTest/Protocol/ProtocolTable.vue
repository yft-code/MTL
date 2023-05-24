<template>
    <div class="self-table">   
        <div>
            <div style="margin-bottom: 5px;">
                <el-button v-if="isEdit" type="primary" size="mini" @click="handleAddProtocol" :disabled="showOperation">新增协议</el-button>
            </div>
            <el-table
                :data="protocolList"
                style="width: 100%"
                max-height="calc(100vh - 400px)"
                stripe
                @selection-change="handleSelectionChange"
                :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
                >
                <el-table-column v-if="isEdit" type="selection" width="50" align="center"></el-table-column>
                <el-table-column v-else type="index" width="50" align="center"></el-table-column>
                <el-table-column 
                    v-for="(item,index) in tableItemList"
                    :key="index"
                    :label="item.titleName"
                    :align="item.align"
                    >
                    <template slot-scope="scope">
                        <div v-if="scope.row.addLine && isEdit">
                            <el-input v-if="item.propName == 'protocol_name'" ref="protocolNameInputRef" v-model="protocolForm[item.propName]"></el-input>
                            <el-input v-else v-model="protocolForm[item.propName]" type="textarea" :autosize="{ minRows: 1}"></el-input>
                        </div>
                        <span v-else class="comment">{{scope.row[item.propName]}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作" align="center" v-if="isEdit">
                    <template slot-scope="scope">
                        <div v-if="scope.row.addLine">
                            <i class="el-icon-circle-check" style="color:green; cursor:pointer;" @click="createProtocol"></i>
                            <i class="el-icon-circle-close" style="color:red; margin-left:10px;cursor:pointer;" @click="close"></i>
                        </div>
                        <div v-else>
                            <el-button type="danger" size="mini" @click="deleteProtocol(scope.row)" :disabled="showOperation">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

export default {
    components: {
        
    },
    props: {
        protocolList: {},
        showOperation: {},
        tableItemList: {},
        protocolForm: {},
        isEdit: {},
    },
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    created() {
       
    },
    mounted() {
        
    },
    destroyed() {
    },
    methods: {
        handleSelectionChange(val){
            this.$emit("handleProtocolChange", val)
        },
        deleteProtocol(row){
            this.$emit("deleteProtocol", row)
        },
        createProtocol(){
            this.$emit("createProtocol")
        },
        close(){
            this.$emit("close")
        },
        handleAddProtocol(){
            this.$emit("handleAddProtocol")
        },
        protocolNameInputFocus(){
            this.$refs.protocolNameInputRef[0].focus()
        },
    },

}
</script>

<style scoped>

</style>