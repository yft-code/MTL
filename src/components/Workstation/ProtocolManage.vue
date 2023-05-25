<template>
    <div class="workstation-content">
    
        <div class="list-title">
            协议表管理页面
        </div>
        <div class="list-container">
            <div>
                <el-select v-model="selectedProject" placeholder="请选择项目组">
                    <el-option v-for="item,index in fakeProject" :key="index" :label="item" :value="item"></el-option>
                </el-select>
                <el-select v-model="selectedActivity" placeholder="请选择活动名称" v-if="selectedProject" style="margin-left: 10px;">
                    <el-option v-for="item,index in fakeActivity[selectedProject]" :key="index" :label="item" :value="item"></el-option>
                </el-select>

                <!-- 搜索框 -->
                <el-input placeholder="请输入协议名称" style="float: right; width: 200px; margin-right: 10px;"></el-input>
            </div>
            <!-- 协议表 -->
            <div style="margin-top: 10px;">
                <el-table :data="protocolData" :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }">
                    <el-table-column v-for="item,index in tableItemList" :label="item.title_name" align="center" :key="index">
                        <template v-slot="scope">
                            <div v-if="item.propName === 'operate'">
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button type="danger" size="mini">删除</el-button>
                            </div>
                            <div v-if="item.propName === 'protocol_param'">
                                <div v-for="param,i in scope.row[item.propName]" :key="i">
                                        {{param.param_name}}({{param.param_value}}): {{param.param_dis}}
                                </div>
                            </div>
                            <span v-else>{{scope.row[item.propName]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
    </div>
</template>

<script>
import {getQaList} from '@/api/workStation/common'
    export default {
        components: {
        },
        data() {
            return {
                fakeProject: [
                    'L10协议',
                    'D90协议',
                ],
                fakeActivity: {
                    'L10协议': [
                        'L10活动1',
                        'L10活动2',
                    ],
                    'D90协议': [
                        'D90活动1',
                        'D90活动2',
                    ],
                },
                selectedProject: '',
                selectedActivity: '',
                tableItemList: [
                    {
                        propName: "protocol_name",
                        title_name: "协议名称",
                    },
                    {
                        propName: "activity",
                        title_name: "活动名称",
                    },
                    {
                        propName: "dis",
                        title_name: "协议描述",
                    },
                    {
                        propName: "protocol_param",
                        title_name: "协议参数",
                    },
                    {
                        propName: "project",
                        title_name: "项目组",
                    },
                    {
                        propName: "operate",
                        title_name: "操作",
                    }
                ],
                protocolData: [
                    {
                        protocol_name: '协议1',
                        dis: '协议1描述',
                        protocol_param: [
                            {
                                param_name: '参数1',
                                param_type: 'string',
                                param_dis: '参数1描述',
                                param_value: '参数1值',
                            },
                            {
                                param_name: '参数2',
                                param_type: 'string',
                                param_dis: '参数2描述',
                                param_value: '参数2值',
                            },
                        ],
                        project: 'L10',
                        activity: 'L10活动1',
                    },
                    {
                        protocol_name: '协议2',
                        dis: '协议2描述',
                        protocol_param: [
                            {
                                param_name: '参数1',
                                param_type: 'string',
                                param_dis: '参数1描述',
                                param_value: '参数1值',
                            },
                            {
                                param_name: '参数2',
                                param_type: 'string',
                                param_dis: '参数2描述',
                                param_value: '参数2值',
                            },
                        ],
                        project: 'L10',
                        activity: 'L10活动1',
                    },
                    {
                        protocol_name: '协议3',
                        dis: '协议3描述',
                        protocol_param: [
                            {
                                param_name: '参数1',
                                param_type: 'string',
                                param_dis: '参数1描述',
                                param_value: '参数1值',
                            },
                            {
                                param_name: '参数2',
                                param_type: 'string',
                                param_dis: '参数2描述',
                                param_value: '参数2值',
                            },
                        ],
                        project: 'L10',
                        activity: 'L10活动1',
                    },
                    {
                        protocol_name: '协议4',
                        dis: '协议4描述',
                        protocol_param: [
                            {
                                param_name: '参数1',
                                param_type: 'string',
                                param_dis: '参数1描述',
                                param_value: '参数1值',
                            },
                            {
                                param_name: '参数2',
                                param_type: 'string',
                                param_dis: '参数2描述',
                                param_value: '参数2值',
                            },
                        ],
                        project: 'L10',
                        activity: 'L10活动1',
                    },
                    {
                        protocol_name: '协议5',
                        dis: '协议5描述',
                        protocol_param: [
                            {
                                param_name: '参数1',
                                param_type: 'string',
                                param_dis: '参数1描述',
                                param_value: '参数1值',
                            },
                            {
                                param_name: '参数2',
                                param_type: 'string',
                                param_dis: '参数2描述',
                                param_value: '参数2值',
                            },
                        ],
                        project: 'L10',
                        activity: 'L10活动1',
                    },
                ],
            }
        },
        props:{
            
        },
        created(){
            
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

          async  getProtocolList(){
                // this.$store.dispatch('getProtocolList')
             let res=await getQaList({},{})
                    if (res.code == 200) {
                        console.log(res.data)
                    }
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
        /*
        font-size: 16px;
        font-weight: 700;
        */
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