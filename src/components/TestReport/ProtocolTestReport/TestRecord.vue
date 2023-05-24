<template>  
    <div>
        <el-table :data="recordData" :header-cell-style="{ color: '#414350', textAlign: 'center', background: '#e7e9ee' }" border stripe >
            <el-table-column v-for="item,index in basicColumnDataFix" :key="index" :label="item.titleName" :align="item.align" :min-width="item.minWidth">
                <template v-slot="scope">
                    {{ scope.row[item.propName] }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script> 
import RecordTable from '@/components/StartTest/Protocol/RecordTable'
import QuestionDetail from '@/components/TestReport/ProtocolTestReport/QuestionDetail'
export default {
    components: {
        RecordTable,
        QuestionDetail
    },
    data() {
        return {
            basicColumnDataFix:[
                {
                    titleName: '协议名称',
                    propName: 'protocol_name',
                    minWidth: "30%",
                    align: "center",
                },
                {
                    titleName: '协议描述/功能',
                    propName: 'description',
                    minWidth: "70%",
                    align: "left",
                },
            ],
        }
    },
    props: {
        recordData: {},
    },
    computed: {
        
    },
    created() {
        
    },
    mounted(){
        
    },
    methods: {
        
    },

}
</script>

<style lang="less" scoped>

</style>
