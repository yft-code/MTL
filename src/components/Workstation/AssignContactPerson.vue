<template>
    <div class="workstation-content">
    
        <div class="list-title">{{ isAdmin ? '分配服务接口人' : '查看服务接口人' }}</div>
        <div class="list-container">
            <!-- {{qaList}} -->
            <el-form label-width="220px" label-suffix="：">
                <el-form-item v-for="item,i in testTypeOption" :label="item.label" :key="i">
                    <el-select 
                        v-if="isAdmin"
                        v-model="qaObject[item.value].popo" 
                        placeholder="请选择测试人员"
                        multiple
                        size="small"
                        filterable 
                        @change="changeTester(item)"
                        >
                        <el-option
                            v-for="item in qaList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            {{item.label}}
                        </el-option>
                    </el-select>
                    <div v-else>
                        <span v-for="(qaEmail, qaIndex) in qaObject[item.value].popo" :key="qaIndex">
                            {{ qaObject[item.value].name[qaIndex] || qaEmail }}<self-popo :email="qaEmail"/>&nbsp;
                        </span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
import {getReminder} from '@/api/workStation/common'
    export default {
        components: {
        },
        data() {
            return {
                qaList: [],
                qaObject: {
                    '10': {
                        name: [],
                        popo: [],
                    },
                    '11': {
                        name: [],
                        popo: [],
                    },
                    '20': {
                        name: [],
                        popo: [],
                    },
                    '21': {
                        name: [],
                        popo: [],
                    },
                    '22': {
                        name: [],
                        popo: [],
                    },
                    '23': {
                        name: [],
                        popo: [],
                    },
                    '30': {
                        name: [],
                        popo: [],
                    },
                    '5': {
                        name: [],
                        popo: [],
                    },
                    '8': {
                        name: [],
                        popo: [],
                    },
                },
                testTypeOption:[
                    {
                        label: '兼容性测试-手游',
                        value: '10'
                    },
                    {
                        label: '兼容性测试-端游',
                        value: '11'
                    },
                    {
                        label: '性能测试-手游',
                        value: '20'
                    },
                    {
                        label: '性能测试-端游',
                        value: '21'
                    },
                    {
                        label: '弱网测试-手游',
                        value: '22'
                    },
                    {
                        label: '弱网测试-端游',
                        value: '23'
                    },
                    {
                        label: '协议测试',
                        value: '30'
                    },
                    {
                        label: '预审服务',
                        value: '5'
                    },
                    {
                        label: '隐私合规',
                        value: '8'
                    },
                ],
            }
        },
        props:{
            
        },
        created(){
            this.getQaList()
            this.getCurrentContactPerson()
        },
        mounted(){
            
        },
        computed:{
            isAdmin() {
                return this.$store.getters.getIsAdmin
            },
        },
        watch:{
        },
        methods:{
            //获取qa列表
            getQaList() {
                this.$codePost("/service/get_qa_list/").then(res => {
                    if (res.code == 200) {
                        this.qaList = res.data;
                    }
                })
            },

            async getCurrentContactPerson(){
              let res= await getReminder({},{})
                    if (res.code == 200) {
                        for(let k in res.data){
                            this.qaObject[k].popo = res.data[k].popo.split(',')
                            this.qaObject[k].name = res.data[k].name.split(',')
                        }
                    }
            },

            changeTester(item){
                let name = []
                this.qaList.forEach(qa => {
                    if(this.qaObject[item.value].popo.indexOf(qa.value) !== -1){
                        name.push(qa.label)
                    }
                })
                let list = {
                    test_type: item.value,
                    popo: this.qaObject[item.value].popo.join(','),
                    name: name.join(','),
                }
                this.$codePost("/service/edit_reminder/",list,{ operation: "分配服务接口人", success:true, failed: true }).then(res => {
                    this.getCurrentContactPerson()
                })
            },
        },
    }
</script>
    
<style scoped>
    .workstation-content {
        width: 100%;
        flex: 1;
        margin: 20px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
    }
    .list-title {
        padding: 0 20px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        height: 47px;
        width: calc(100% - 40px);
        line-height: 47px;
        background: #fff;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid rgba(97, 119, 255, 0.1);
    }
    .list-container {
        flex: 1;
        overflow: auto;
        padding: 20px;
    }
</style>

<style>
</style>