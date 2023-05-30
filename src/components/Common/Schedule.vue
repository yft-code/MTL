<template>
    <el-popover
        placement="bottom"
        trigger="click"
    >
        <div class="schedule-div">
            <div class="legend-div">
                <span class="work-word">工作量：</span>
                <div
                    v-for="(legendItem, index) in legendData"
                    :key="index"
                    class="legend-item"
                >
                    <div class="legend-tag" :style="{background: legendItem.color}"></div>
                    <span class="legend-label">{{legendItem.label}}</span>
                </div>
            </div>
            <el-button class="reach-mtl-btn" @click="sendPopo">联系MTL</el-button>
            <div class="schedule-container">
                <div class="week-div">
                    <div
                        v-for="week in weekData"
                        :key="week"
                        class="week-item"
                    >
                        {{week}}
                    </div>
                </div>
                <div class="schedule-content">
                    <div
                        v-for="(scheduleItem, scheduleIndex) in scheduleData"
                        :key="scheduleIndex"
                        class="schedule-item"
                        :class="getScheduleClass(scheduleItem.state)"
                    >
                        <div v-if="scheduleItem.type === 'empty'"></div>
                        <el-popover
                            v-else
                            :open-delay="200"
                            placement="bottom"
                            trigger="hover"
                        >
                            <div style="font-size: 14px; font-weight: 700; color: #666666;">
                                <span>{{scheduleItem.date.split('-')[1]}}.</span>
                                <span>{{scheduleItem.date.split('-')[2]}}</span>
                            </div>
                            <div 
                                v-for="(work, workIndex) in scheduleItem.workList" 
                                :key="workIndex"
                                style="margin-top: 10px; color: #999999;"
                            >
                                {{work}}
                            </div>
                            <div slot="reference">
                                <div class="schedule-date">
                                    <span>{{scheduleItem.date.split('-')[1]}}月</span>
                                    <span>{{scheduleItem.date.split('-')[2]}}</span>
                                </div>
                                <div v-if="scheduleItem.type === 'rest'" class="rest-div">休息</div>
                                <div v-else class="work-list">
                                    <div 
                                        v-for="(work, workIndex) in scheduleItem.workList" 
                                        :key="workIndex"
                                        slot="reference"
                                    >
                                        <span v-if="workIndex < 2">{{work}}</span>
                                        <span v-if="workIndex == 2" style="color: #666666">···</span>
                                    </div>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>
        <el-button class="show-schedule-btn" slot="reference">查看MTL工作排期</el-button>
    </el-popover>
</template>

<script>
    import popo from '@/utils/popo.js'

    export default {
        components: {
        },
        data() {
            return {
                weekData: ['一', '二', '三', '四', '五', '六', '七'],
                legendData: [
                    {
                        label: '较少',
                        color: 'rgba(102, 211, 168, 0.1)'
                    },
                    {
                        label: '适中',
                        color: 'rgba(116, 160, 250, 0.1)'
                    },
                    {
                        label: '较多',
                        color: 'rgba(235, 127, 101, 0.1)'
                    },
                    {
                        label: '节假日',
                        color: 'rgba(224, 228, 236, 0.1)'
                    },
                ],
                scheduleData: [
                    {
                        week: '3',
                        type: 'work',
                        date: '2021-4-28',
                        state: 'busy',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '4',
                        type: 'work',
                        date: '2021-4-29',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '5',
                        type: 'work',
                        date: '2021-4-30',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '6',
                        type: 'rest',
                        date: '2021-5-01',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '7', 
                        type: 'rest',
                        date: '2021-5-02',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '1',
                        type: 'work',
                        date: '2021-5-03',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '2',
                        type: 'work',
                        date: '2021-5-04',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '3',
                        type: 'work',
                        date: '2021-5-05',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '4',
                        type: 'work',
                        date: '2021-5-06',
                        state: 'busy',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '5',
                        type: 'work',
                        date: '2021-5-07',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '6',
                        type: 'rest',
                        date: '2021-5-08',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '7',
                        type: 'rest',
                        date: '2021-5-09',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '1',
                        type: 'work',
                        date: '2021-5-10',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '2',
                        type: 'work',
                        date: '2021-5-11',
                        state: 'normal',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '3',
                        type: 'work',
                        date: '2021-5-12',
                        state: 'normal',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '4',
                        type: 'work',
                        date: '2021-5-13',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '5',
                        type: 'work',
                        date: '2021-5-14',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '6',
                        type: 'rest',
                        date: '2021-5-15',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '7',
                        type: 'rest',
                        date: '2021-5-16',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '1',
                        type: 'work',
                        date: '2021-5-17',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '2',
                        type: 'work',
                        date: '2021-5-18',
                        state: 'normal',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '3',
                        type: 'work',
                        date: '2021-5-19',
                        state: 'normal',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '4',
                        type: 'work',
                        date: '2021-5-20',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '5',
                        type: 'work',
                        date: '2021-5-21',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '6',
                        type: 'rest',
                        date: '2021-5-22',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '7',
                        type: 'rest',
                        date: '2021-5-23',
                        state: 'rest',
                        workList: []
                    },
                    {
                        week: '1',
                        type: 'work',
                        date: '2021-5-24',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '2',
                        type: 'work',
                        date: '2021-5-25',
                        state: 'normal',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '3',
                        type: 'work',
                        date: '2021-5-26',
                        state: 'normal',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                    {
                        week: '4',
                        type: 'work',
                        date: '2021-5-27',
                        state: 'free',
                        workList: [
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                            'lh2-兼容性测试（测试中）',
                        ]
                    },
                ]
            } 
        },
        props:{
        },
        created(){
        },
        mounted(){
            this.initScheduleData();
        },
        computed:{
            
        },
        watch:{
        },
        methods:{
            initScheduleData() {
                let firstDayWeek = parseInt(this.scheduleData[0].week);
                let addValue = firstDayWeek - 1;
                for (let i = 0; i < addValue; i ++) {
                    this.scheduleData.unshift({
                        week: String(i),
                        type: 'empty',
                        date: '',
                        state: '',
                        workList: []
                    })
                }
            },

            getScheduleClass(state) {
                if (state === 'free') {
                    return 'free-tag';
                } else if (state === 'normal') {
                    return 'normal-tag';
                } else if (state === 'busy') {
                    return 'busy-tag';
                } else if (state === 'rest') {
                    return 'rest-tag';
                } else {
                    return '';
                }
            },

            sendPopo() {
                popo.singalPopo('dong.xd@corp.netease.com');
            }
        },
    }
</script>
    
<style scoped>
    .schedule-div {
        width: 1595px;
        background: #fff;
        border-radius: 4px;
        padding: 20px;
        position: relative;
    }
    .legend-div {
        display: flex;
        align-items: center;
    }
    .legend-item {
        display: flex;
        align-items: center;
    }
    .legend-tag {
        width: 24px;
        height: 14px;
        border-radius: 2px;
    }
    .legend-label {
        margin: 0 18px 0 8px;
        color: #333333;
    }
    .work-word{
         font-weight: 700; 
         color: #333333
    }
    .reach-mtl-btn {
        height: 32px;
        padding: 5px 12px;
        border-radius: 3px;
        border: 1px solid #156EEF;
        color: #666666;
        font-size: 14px;
        position: absolute;
        right: 32px;
        top: 20px;
    }
    .show-schedule-btn  {
        color: red;
        border-color: #FFF0F5;
        background-color: pink;
        height: 32px;
        padding: 0 16px;
        margin-right: 5px;
    }
    .show-schedule-btn:hover {
        color: #156EEF;
        background: rgba(21, 110, 239, 0.1);
    }
    .schedule-container {
        margin-top: 27px;
        padding: 20px 12px;
        border: 1px solid #E0E4EC;
    }
    .week-div {
        display: flex;
        align-items: center;
    }
    .week-item {
        margin-left: 10px;
        width: 212px;
        line-height: 22px;
        color: #666666;
        text-align: right;
    }
    .schedule-content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 12px;
    }
    .schedule-item {
        margin-left: 10px;
        margin-bottom: 10px;
        width: 212px;
        height: 88px;
        position: relative;
    }
    .free-tag {
        background: rgba(102, 211, 168, 0.1);
    }
    .free-tag:hover {
        background: rgba(102, 211, 168, 0.2);
    }
    .normal-tag {
        background: rgba(116, 160, 250, 0.1);
    }
    .normal-tag:hover {
        background: rgba(116, 160, 250, 0.2);
    }
    .busy-tag {
        background: rgba(235, 127, 101, 0.1);
    }
    .busy-tag:hover {
        background: rgba(235, 127, 101, 0.2);
    }
    .rest-tag {
        background: rgba(224, 228, 236, 0.1);
    }
    .schedule-date {
        padding: 5px 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .schedule-date span:first-child {
        color: #999999;
        font-size: 12px;
    }
    .schedule-date span:last-child {
        color: #666666;
        font-size: 14px;
        font-weight: 700;
    }
    .rest-div {
        color: #999999;
        font-size: 12px;
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 5px 10px;
    }
    .work-list {
        font-size: 12px;
        line-height: 18px;
        color: #999999;
        padding: 5px 10px;
    }
</style>