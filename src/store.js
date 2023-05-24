import Vue from "vue";
import Vuex from "vuex";
import Utils from "./utils/utils"
import { Message } from 'element-ui';
// vuex持久化存储
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios'
Vue.use(Vuex);
Vue.use(Utils);

export default new Vuex.Store({
    state: {
        service: '',    // 测试类别
        currentUserEmail: '',   // 用户
        curId:'',
        compatibility_editType: '',
        performance_editType: '',
        privacy_editType: '',
        weaknet_editType: '',
        protocol_editType: '',
        preliminary_editType: '',
        pageIsLoading: false,//存储是否 处于加载中 这个数据，实现加载过程中转圈的效果
        currentUserAuth: false,     // 
        projectCode: "",//项目组
        isTester: false,//1：是测试人员，0：非测试人员
        isAdmin: false,
        isContact: false,
        subMenuInfo: {
            product: false,
            service: false,
            currentType: ''
        },
        prePath: {
            pic: '/testplatform/img',
            testCase: '/testplatform/TestCase',  // 测试用例
            testInclusion: '/testplatform/TestInclusion',    // 测试包体
            protocol: '/testplatform/protocol',  // 协议测试
            log: '/testplatform/log',   // 日志
            // file: '/testplatform/file',
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
                label: '隐私合规',
                value: '8'
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
            }
        ],
        weaknetPCConclusionItem: [
            {
                label: "最低能玩的上行带宽测试",
                titleName: "最低能玩的上行带宽测试结论",
                propName: "min_up_bandwidth",
                fixMsg: ["经测试，最低能玩的上行带宽为", "KB/s"],
                children: [
                    {
                        titleName: "处于该上行带宽下的表现",
                        propName: "in_up_bandwidth"
                    }, 
                    {
                        titleName: "低于这个上行带宽下的表现",
                        propName: "low_up_bandwidth"
                    }, 
                    {
                        titleName: "高于这个上行带宽的表现",
                        propName: "high_up_bandwidth"
                    }, 
                ]
            },
            {
                label: "最低能玩的下行带宽测试",
                titleName: "最低能玩的下行带宽测试结论",
                propName: "min_down_bandwidth",
                fixMsg: ["经测试，最低能玩的下行带宽为", "KB/s"],
                children: [
                    {
                        titleName: "处于该下行带宽下的表现",
                        propName: "in_down_bandwidth"
                    },
                    {
                        titleName: "低于这个下行带宽下的表现",
                        propName: "low_down_bandwidth"
                    },
                    {
                        titleName: "高于这个下行带宽的表现",
                        propName: "high_down_bandwidth"
                    },
                ]
            },
        ],
        startTestDict: {
            '10': "compatibilityStartTest",
            '11': "compatibilityStartTestPC",
            '20': "performanceStartTest",
            '21': "performanceStartTestPC",
            '22': "weaknetStartTest",
            '30': "protocolStartTest"
        },
        allItem: [
            '平均内存(MB)',
            '最大内存(MB)',
            '最低内存(MB)',
            '平均AppCPU(%)',
            '最高AppCPU(%)',
            '最低AppCPU(%)',
            '平均GPU(%)',
            '最高GPU(%)',
            '最低GPU(%)',
            '平均帧率',
            '最高帧率',
            '最低帧率',
            '平均GPU内存(MB)',
            '最高GPU内存(MB)',
            '最低GPU内存(MB)',
            '卡顿帧占比(%)',
            '帧率低于50(%)',
            '帧率50-59(%)',
            '帧率高于60(%)',
        ],
        contrastStrategies: [
            {
                label: 'scene-device-class',
                value: '场景-设备-记录类别'
            },
            // {
            //     label: 'device-scene-class',
            //     value: '设备-场景-记录类别'
            // },
            // {
            //     label: 'scene-class-device',
            //     value: '场景-记录类别-设备'
            // }
        ],
        performanceFiledList: [
            {
                propName: "origin_package_size",
                titleName: "安装包大小（10MB）",
                type: "normal"
            },
            {
                propName: "real_package_size",
                titleName: "实际包大小（10MB）",
                type: "normal"
            },
            {
                propName: "memory_usage",
                titleName: "平均内存（MB）",
                type: "normal"
            },
            {
                propName: "memory_usage_max",
                titleName: "最大内存（MB）",
                type: "normal"
            },
            {
                propName: "virtual_memory_avg",
                titleName: "平均虚拟内存（GB）",
                type: "normal"
            },
            {
                propName: "virtual_memory_max",
                titleName: "最大虚拟内存（GB）",
                type: "normal"
            },
            {
                propName: "cpu_usage",
                titleName: "平均CPU（%）",
                type: "normal"
            },
            {
                propName: "gpu_use_rate",
                titleName: "平均GPU（%）",
                type: "normal"
            },
            {
                propName: "fps",
                titleName: "平均帧数（FPS）",
                type: "normal"
            },
            {
                propName: "baterry_temp",
                titleName: "平均电池温度（℃）",
                type: "normal"
            },
            {
                propName: "battery_current",
                titleName: "平均电流（mA）",
                type: "normal"
            },
            {
                propName: "battery_power",
                titleName: "平均功率（mW）",
                type: "normal"
            },
            {
                propName: "flow",
                titleName: "平均流量（K/min）",
                type: "normal"
            },
            // {
            //     propName: "power_consumption",
            //     titleName: "耗电量",
            //     type: "normal"
            // },
            // {
            //     propName: "cold_start_used",
            //     titleName: "冷启动时间",
            //     type: "normal"
            // },
        ],
        basicColumnData:[
            {
                titleName: '平均内存(MB)',
                propName: 'ram_avg',
                type: "normal",
            }, 
            {
                titleName: '最大内存(MB)',
                propName: 'ram_max',
                type: "normal",
            }, 
            {
                titleName: '最低内存(MB)',
                propName: 'ram_min',
                type: "normal",
            }, 
            {
                titleName: '平均AppCPU(%)',
                propName: 'cpu_avg',
                type: "normal",
            }, 
            {
                titleName: '最高AppCPU(%)',
                propName: 'cpu_max',
                type: "normal",
            }, 
            {
                titleName: '最低AppCPU(%)',
                propName: 'cpu_min',
                type: "normal",
            }, 
            {
                titleName: '平均GPU(%)',
                propName: 'gpu_avg',
                type: "normal",
            }, 
            {
                titleName: '最高GPU(%)',
                propName: 'gpu_max',
                type: "normal",
            }, 
            {
                titleName: '最低GPU(%)',
                propName: 'gpu_min',
                type: "normal",
            }, 
            {
                titleName: '平均帧率',
                propName: 'fps_avg',
                type: "normal",
            },
            {
                titleName: '最高帧率',
                propName: 'fps_max',
                type: "normal",
            },
            {
                titleName: '最低帧率',
                propName: 'fps_min',
                type: "normal",
            },
            {
                titleName: '平均GPU内存(MB)',
                propName: 'gpu_memory_avg',
                type: "normal",
            }, 
            {
                titleName: '最高GPU内存(MB)',
                propName: 'gpu_memory_max',
                type: "normal",
            }, 
            {
                titleName: '最低GPU内存(MB)',
                propName: 'gpu_memory_min',
                type: "normal",
            }, 
            {
                titleName: '卡顿帧占比(%)',
                propName: 'stuck_frame_rate',
                type: "normal",
            }, 
            {
                titleName: '帧率低于50(%)',
                propName: 'fps_40_49',
                type: "normal",
            },
            {
                titleName: '帧率50-59(%)',
                propName: 'fps_50_59',
                type: "normal",
            },
            {
                titleName: '帧率高于60(%)',
                propName: 'fps_60_69',
                type: "normal",
            },
        ],
        menuData: {
            product: [
                {
                    type: 'PEase快速性能',
                    img: require('./assets/img/PEase.png'),
                    list: [
                        {
                            name: 'PEase快速性能',
                            des: '轻量级性能测试工具',
                            detailDes: '轻量级性能测试工具轻量级性能测试工具轻量级性能测试工具轻量级性能测试工具',
                            state: 'hot',
                            url: 'http://mtl-pease.leihuo.netease.com:8012/perfMonitor/page/index'
                        },
                    ],
                    isCurrentType: true
                },
                {
                    type: 'NetFree弱网工具',
                    img: require('./assets/img/weaknet.png'),
                    list: [
                        {
                            name: '弱网测试',
                            des: '可以为游戏模拟各种复杂网络状况并测试游戏的表现',
                            detailDes: '游戏测试需要考虑游戏在一些特殊情境下的游玩体验，用户有时会在较差的网络状况下使用移动端设备进行游戏，弱网测试可以为游戏模拟各种复杂网络状况并测试游戏的表现',
                            state: 'new',
                            url: 'http://mtl-netfree.leihuo.netease.com:30066/netcraftServer/page/index?project=mtl'
                        },
                    ]
                },
                {
                    type: '自动化测试',
                    img: require('./assets/img/autotest.png'),
                    list: [
                        {
                            name: '自动化测试',
                            des: '快速发现应用兼容性问题，并生成报告',
                            detailDes: '提供云端自动化兼容服务，覆盖市场主流机型，并行测试。快速发现应用兼容性问题，并生成报告。',
                            state: 'new',
                            url: 'http://mtl.leihuo.netease.com:8000/compatibilityTest/page/index'
                        },
                    ]
                },
                {
                    type: '云真机',
                    img: require('./assets/img/cloudDevice.png'),
                    list: [
                        {
                            name: '云真机',
                            des: '轻量级性能测试工具',
                            detailDes: '轻量级性能测试工具轻量级性能测试工具轻量级性能测试工具轻量级性能测试工具',
                            state: 'new',
                            url : 'http://mtl-rc.leihuo.netease.com:8030/remote_control/page/index'
                        },
                    ]
                }
            ],
            service: [
                {
                    type: '兼容性测试',
                    list: [
                        {
                            name: '专家兼容性',
                            des: '覆盖安卓、iOS主流机型，随时随机进行测试，保证手游端游品质',
                            state: 'hot',
                            url: '/mtl_test_platform/page/expertCompatibility'
                        },
                    ],
                    isCurrentType: true
                },
                {
                    type: '性能测试',
                    list: [
                        {
                            name: '常规性能测试-手游',
                            des: '支持项目组手游常规性能测试和深度性能测试',
                            state: 'new',
                            url: '/mtl_test_platform/page/performance'
                        },
                        // {
                        //     name: '常规性能测试-端游',
                        //     des: '支持项目组端游常规性能测试和深度性能测试',
                        //     state: 'new',
                        //     url: '/mtl_test_platform/page/performancePC'
                        // },
                    ]
                },
                
                // {
                //     type: '隐私合规',
                //     list: [
                //         {
                //             name: '隐私合规',
                //             des: '隐私合规',
                //             state: 'new',
                //             url: '/mtl_test_platform/page/privacy'
                //         },
                //     ]
                // },
                // {
                //     type: '弱网测试',
                //     list: [
                //         {
                //             name: '手游弱网测试',
                //             des: '轻量级性能测试工具',
                //             state: 'new',
                //             url: '/mtl_test_platform/page/weaknet'
                //         },
                //         {
                //             name: '端游弱网测试',
                //             des: '轻量级性能测试工具',
                //             state: 'new',
                //             url: '/mtl_test_platform/page/weaknetPC'
                //         },
                //     ]
                // },
                // {
                //     type: '预审服务',
                //     list: [
                //         {
                //             name: 'AppStore预审',
                //             des: '预检出明显存在和疑似的问题，提高AppStore发布的通过率',
                //             state: 'new',
                //             url: '/mtl_test_platform/page/appstore'
                //         },
                //         {
                //             name: '版署预审',
                //             des: '预检出明显存在和疑似的问题，提高版署审核的通过率',
                //             state: 'new',
                //             url: '/mtl_test_platform/page/preliminary'
                //         },
                //     ]
                // },
                {
                    type: '协议测试',
                    list: [
                        {
                            name: '协议测试',
                            des: '全方位覆盖了协议测试的要点，大大降低了协议测试的门槛',
                            state: 'new',
                            url: '/mtl_test_platform/page/protocol'
                        },
                    ]
                },
            ]
        },
        //问题报告页筛选条件
        problemFilter:[],
        qLevelList: {
            "0": {
                content: "立刻-阻碍游戏进程，会造成破坏性后果,导致多个职能工作无法正常进行如会引起editor崩溃、打包失败等",
                color: "#ff0000",
            },
            "1": {
                content: "紧急-会造成破坏性后果,导致游戏主流程、QA测试无法进行如明确的崩溃、导致QA无法继续测试流程的BUG",
                color: "#ff355f",
            },
            "2": {
                content: "高-存在于该系统主流程用例中，明显的功能性BUG；普通玩家正常体验就会遇到，且主观认定是BUG未提及为后续优化补全内容的复现概率较高的",
                color: "#e6a23c",
            },
            "3": {
                content: "普通-轻微影响用户体验，存在于该系统主流程用例中，明显的功能性BUG；普通玩家正常体验就会遇到，且主观认定是BUG未提及为后续优化补全内容的复现概率较高的",
                color: "#4876f2",
            },
            "4": {
                content: "低-影响较轻微很难注意到的后续有优化计划留bug单备忘的",
                color: "#909399",
            },
        },//报告中常用的事故等级说明及样式
        reportRouteList: {
            "expert": {
                prefix: "/mtl_test_platform/page",
                testReport: "/compatibilityTestReport",
                questionDetail: "/questionDetail",
                deviceDetail: "/problemDeviceDetail",
            },//专家报告各路径
            "deep": {
                prefix: "/compatibilityTest/page",
                testReport: "/deepTestReport",
                questionDetail: "/questionDetail",
                deviceDetail: "/deviceDetail",
            },//深度报告各路径
        },
        testTypeDict:{
            '兼容性测试-手游': '10',
            '兼容性测试-端游': '11',
            '性能测试-手游': '20',
            '性能测试-端游': '21',
            '隐私合规': '8',
            '弱网测试-手游': '22',
            '弱网测试-端游': '23',
            '协议测试': '30',
            '预审服务': '5'
        },
        serviceTypeOption:{
            '兼容性测试-手游': 'compatibility',
            '兼容性测试-端游': 'compatibilityPC',
            '性能测试-手游': 'performance',
            '性能测试-端游': 'performancePC',
            '隐私合规': 'privacy',
            '弱网测试-手游': 'weaknet',
            '弱网测试-端游': 'weaknetPC',
            '协议测试': 'protocol',
            '预审服务': 'preliminary'
        },
    },

    getters:{
        getPerformanceFiledList: state => {
            return state.performanceFiledList
        },
        getConTrastStrategies: state => {
            return state.contrastStrategies
        },
        getPrePath: state => {
            return state.prePath
        },
        getTestTypeOption: state => {
            return state.testTypeOption
        },
        getServiceTypeOption: state => {
            return state.serviceTypeOption
        },
        getAllItem: state => {
            return state.allItem
        },
        getTestTypeDict: state => {
            return state.testTypeDict
        },
        getWeaknetPCConclusionItem: state => {
            return state.weaknetPCConclusionItem
        },
        getBasicColumnData: state => {
            return state.basicColumnData
        },
        getStartTestDict: state => {
            return state.startTestDict
        },
        getReportRouteList: state => {
            return state.reportRouteList
        },
        getQLevelList: state => {
            return state.qLevelList
        },
        getCurId: state => {
            return state.curId
        },
        getCompatibilityEditType: state => {
            return state.compatibility_editType
        },
        getPerformanceEditType: state => {
            return state.performance_editType
        },
        getPrivacyEditType: state => {
            return state.privacy_editType
        },
        getWeaknetEditType: state => {
            return state.weaknet_editType
        },
        getProtocolEditType: state => {
            return state.protocol_editType
        },
        getPreliminaryEditType: state => {
            return state.preliminary_editType
        },
        getService: state => {
            return state.service
        },
        getProjectCode: state => {
            return state.projectCode
        },
        getPageIsLoading: state => {
            return state.pageIsLoading
        },
        //获取用户邮箱
        getUserEmail: state => {
            return state.currentUserEmail;
        },
        //获取当前用户权限
        getUserAuth: state => {
            return state.currentUserAuth;
        },
        getIsTester: state => {
            return state.isTester
        },
        getIsAdmin: state => {
            return state.isAdmin
        },
        getProblemFilter: state => {
            return state.problemFilter
        },
        getIsContact: state => {
            return state.isContact
        }
    },
    mutations: {
        setCurId(state,data){
            state.curId = data
        },
        setCompatibilityEditType(state, data){
            state.compatibility_editType = data
        },
        setPerformanceEditType(state, data){
            state.performance_editType = data
        },
        setPrivacyEditType(state, data){
            state.privacy_editType = data
        },
        setWeaknetEditType(state, data){
            state.weaknet_editType = data
        },
        setProtocolEditType(state, data){
            state.protocol_editType = data
        },
        setPreliminaryEditType(state, data){
            state.preliminary_editType = data
        },
        setProblemFilter(state, data) {
            // console.log('传入data',state,data);
            state.problemFilter = data
        },
        setService(state, data){
            state.service = data
        },
        setBasicDataHasGet(state, data) {
            state.basicDataHasGet = data
        },
        setProjectCode(state, data) {
            state.projectCode = data
        },
        setPageIsLoading(state, value) {
            state.pageIsLoading = value;
        },
        // 修改当前用户信息
        setUserEmail (state, data) {
            state.currentUserEmail = data;
        },
        // 修改当前用户权限
        setUserAuth (state, data) {
            state.currentUserAuth = data;
        },
        // 设置子菜单展示情况
        setSubMenuInfo (state, data) {
            state.subMenuInfo = data;
        },
        // 设置菜单内容
        setMenuData (state, data) {
            state.menuData = data;
        },
        setIsTester(state, data) {
            state.isTester = data
        },
        setIsAdmin(state, data){
            state.isAdmin = data
        },
        setIsContact(state, data){
            state.isContact = data
        }
    },

    actions: {
        //获取用户信息
        async getUserEmail (context) {
            await Vue.axiosGet('/service/get_user_email/').then(res => {
                // console.log(res)
                if(res.code === 200){
                // if(res.status === 200){
                    context.commit('setUserEmail', res.data);
                    // context.commit('setUserEmail', '');
                }else{
                    Message.error(res.msg);
                }
            })
        },
        //获取用户权限
        async getUserAuth (context) {
            await Vue.axiosGet('/service/get_user_auth/').then(res => {
                // console.log(res)
                if(res.code === 200){
                    context.commit('setIsTester', res.data.tester);
                    context.commit('setIsAdmin', res.data.manager);
                }else{
                    context.commit('setIsTester', false);
                    context.commit('setIsAdmin', false);
                    Message.error(res.msg);
                }
            })
        },

        // 获取是否是接口人
        async judgeContact (context) {
            context.commit("setIsContact", true);
            await Vue.axiosGet('/service/get_reminder/').then(res => {
                if (res.code == 200) {
                    // let contactList = []
                    // for(let k in res.data){
                    //     contactList = contactList.concat(res.data[k].popo.split(','))
                    // }
                    // let userEmail = context.getters.getUserEmail
                    // if(contactList.indexOf(userEmail) !== -1){
                    //     context.commit("setIsContact", true);
                    // }else{
                    //     context.commit("setIsContact", false);
                    // }
                    for(let k in res.data){
                        if(res.data[k].popo.indexOf(context.getters.getUserEmail) !== -1){
                            context.commit("setIsContact", true);
                            return
                        }
                    }
                    context.commit("setIsContact", false);
                }
                else {
                    context.commit("setIsContact", false);
                    Message.error(res.msg);
                }
                context.commit("setIsContact", false);
            })
        }

        
    },

    plugins: [
        createPersistedState({
            storage: window.sessionStorage    // 这里用的是localStoreage，如果要用sessionStorage
        })
    ]
      
});
