<template>  
    <div>
        <!-- {{recordData}} -->
        <record-table :basicColumnData="basicColumnDataFix" :tableData="recordData" :isReport="true"></record-table>
        <!-- <question-detail :basicColumnData="basicColumnDataFix" :tableData="recordData" :isReport="true"></question-detail> -->
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
                    sortFlag: true,
                    minWidth: 110,
                    type: "normal",
                },
                {
                    titleName: '协议描述/功能',
                    propName: 'description',
                    sortFlag: true,
                    minWidth: 150,
                    type: "normal",
                },
                {
                    titleName: '问题',
                    propName: 'questionList',
                    sortFlag: false,
                    minWidth: 150,
                },
                // {
                //     titleName: '测试时间',
                //     propName: 'test_time',
                //     sortFlag: true,
                //     minWidth: 100,
                //     type: "normal",
                // },
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
