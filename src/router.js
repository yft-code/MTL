import Vue from "vue";
import store from "./store";
import Router from "vue-router";
import mtlIndex from "@/views/MtlTestPlatform.vue";
import mtlIndexWithoutHead from "@/views/MtlTestPlatformWithoutHead.vue"
import index from "@/components/HomePageItem/index.vue";
import expertServices from '@/components/ExpertServices/Index.vue'
import expertCompatibility from '@/components/ExpertServices/Compatibility/index.vue'
import performance from '@/components/ExpertServices/Performance/index.vue'
import performancePC from '@/components/ExpertServices/PerformancePC/index.vue'
import privacy from '@/components/ExpertServices/Privacy/index.vue'
import protocol from '@/components/ExpertServices/Protocol/index.vue'
import weaknet from '@/components/ExpertServices/Weaknet/index.vue'
import weaknetPC from '@/components/ExpertServices/weaknetPC/index.vue'
import preliminary from '@/components/ExpertServices/Preliminary/index.vue'
import appstore from '@/components/ExpertServices/Appstore/index.vue'
import workstation from '@/components/WorkStationItem/index.vue'
import documentCenter from '@/components/DocumentCenter/Index.vue'
import workTimeCounter from '@/components/WorkTimeCounter/Index.vue'
import CPULadder from '@/components/Common/CpuLadder.vue'
import CompatibilityTestReport from '@/components/TestReport/CompatibilityTestReport/CompatibilityTestReport.vue'
import compatibilityTestReportPC from '@/components/TestReport/CompatibilityTestReportPC/CompatibilityTestReportPC.vue'
import performanceTestReportPC from '@/components/TestReport/PerformanceTestReportPC/PerformanceTestReportPC.vue'
import performanceTestReport from '@/components/TestReport/PerformanceTestReport/PerformanceTestReport.vue'
import StartTestCompatibility from '@/components/StartTest/Compatibility/StartTest.vue'
import StartTestCompatibilityPC from '@/components/StartTest/CompatibilityPC/StartTest.vue'
import StartTestPerformancePC from '@/components/StartTest/PerformancePC/StartTest.vue'
import StartTestPerformance from '@/components/StartTest/Performance/StartTest.vue'
import CompatibilityApplication from '@/components/ExpertServices/Compatibility/CompatibilityApplication.vue'
import performanceApplication from '@/components/ExpertServices/Performance/PerformanceApplication.vue'
import performancePCApplication from '@/components/ExpertServices/PerformancePC/PerformancePCApplication.vue'
import privacyApplication from '@/components/ExpertServices/Privacy/PrivacyApplication.vue'
import weaknetApplication from '@/components/ExpertServices/Weaknet/WeaknetApplication.vue'
import weaknetPCApplication from '@/components/ExpertServices/weaknetPC/WeaknetPCApplication.vue'
import protocolApplication from '@/components/ExpertServices/Protocol/ProtocolApplication.vue'
import preliminaryApplication from '@/components/ExpertServices/Preliminary/PreliminaryApplication.vue'
import appstoreApplication from '@/components/ExpertServices/Appstore/AppstoreApplication.vue'
import serviceOrdersList from '@/components/Common/ServiceOrdersList.vue'
import ManagerList from '@/components/Common/ManagerList.vue'
import QuestionTable from '@/components/Common/QuestionTable.vue'
import ProtocolQuestionTable from '@/components/StartTest/Protocol/QuestionTable.vue'
import QuestionDetail from '@/components/TestReport/CompatibilityTestReport/QuestionDetail.vue'
import ProblemDeviceDetail from '@/components/TestReport/CompatibilityTestReport/ProblemDeviceDetail.vue'
import WeekPerformance from '@/components/TestReport/WeekPerformance/WeekPerformance'
import PerformanceWeekPackage from '@/components/StartTest/PerformanceWeekPackage/StartTest.vue'
import PerformanceMonthPackage from '@/components/StartTest/PerformanceMonthPackage/StartTest.vue'
import MonthPerformance from '@/components/TestReport/MonthPerformance/MonthPerformance'
import EightWeekPerformance from '@/components/TestReport/EightWeekPerformance/EightWeekPerformance'
import StartTestWeaknet from '@/components/StartTest/Weaknet/StartTest'
import StartTestWeaknetPC from '@/components/StartTest/WeaknetPC/StartTest'
import WeaknetTestReport from '@/components/TestReport/WeaknetTestReport/WeaknetTestReport'
import WeaknetPCTestReport from '@/components/TestReport/WeaknetPCTestReport/WeaknetPCTestReport'
import ProtocolTestReport from '@/components/TestReport/ProtocolTestReport/ProtocolTestReport'
import MyTask from '@/components/WorkStationItem/MyTask.vue'
import AssignContactPerson from '@/components/WorkStationItem/AssignContactPerson.vue'
import PcManage from '@/components/WorkStationItem/PcManage.vue'
import PhoneManage from '@/components/WorkStationItem/PhoneManage.vue'
import StartTestProtocol from '@/components/StartTest/Protocol/StartTest.vue'
import ProtocolManage from '@/components/WorkStationItem/ProtocolManage'
import PcPerformance from '@/components/WorkStationItem/PcPerformance'
Vue.use(Router);
let isFirst = true;
let router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/mtl_test_platform/page",
            component: mtlIndexWithoutHead,
            children: [
                { path: 'compatibilityReport', component: CompatibilityTestReport },    // 兼容性测试报告-手游-预览
                { path: 'compatibilityPCReport', component: compatibilityTestReportPC },    // 兼容性测试报告-端游-预览
                { path: 'performancePCReport', component: performanceTestReportPC },    // 性能测试报告-端游-预览
                { path: 'performanceReport', component: performanceTestReport },    // 性能测试报告-手游-预览
                { path: 'weaknetReport', component: WeaknetTestReport },    // 弱网测试报告-手游-预览
                { path: 'weaknetPCReport', component: WeaknetPCTestReport },    // 弱网测试报告-端游-预览
                { path: 'protocolReport', component: ProtocolTestReport },    // 西医测试报告-预览
            ]
        },
        {
            path: "/mtl_test_platform/page",
            component: mtlIndex,
            children: [
                {path: 'index', component: index},      // 首页
                {
                    path: 'expertServices', 
                    component: expertServices,
                    children: [
                        { path:'compatibility', component: CompatibilityApplication },  // 专家兼容性测试申请【手游+端游】
                        { path:'performance', component: performanceApplication },  // 专家性能测试申请-手游
                        { path:'performancePC', component: performancePCApplication },  // 专家性能测试申请-端游
                        { path:'privacy', component: privacyApplication },      // 隐私合规测试申请
                        { path:'weaknet', component: weaknetApplication },      // 弱网测试申请-手游
                        { path:'weaknetPC', component: weaknetPCApplication },      // 弱网测试申请-端游
                        { path:'protocol', component: protocolApplication },    // 协议测试申请
                        { path:'preliminary', component: preliminaryApplication },  // 版署预审申请
                        { path:'appstore', component: appstoreApplication},     // AppStore测试申请
                        { path:'serviceOrdersList', component: serviceOrdersList },     // 测试申请记录页
                        { path:'managerList', component: ManagerList },     // 临时管理员编辑页面
                        { path:'compatibilityTestDetail', component: CompatibilityApplication },    // 专家兼容性测试申请详情-手游
                        { path:'protocolTestDetail', component: protocolApplication },    // 协议测试申请详情
                        { path:'performanceTestDetail', component: performanceApplication },    // 专家性能测试申请详情-手游
                        { path:'performancePCTestDetail', component: performancePCApplication },   // 专家性能测试申请详情-端游
                        { path:'weaknetTestDetail', component: weaknetApplication },    // 弱网申请详情-手游
                        { path:'weaknetPCTestDetail', component: weaknetPCApplication },    // 弱网申请详情-端游
                        { path:'compatibilityPCTestDetail', component: CompatibilityApplication },  // 专家兼容性测试申请详情-端游
                        { path:'reTestCompatibilityApplication', component: CompatibilityApplication },      // 专家兼容性手游复测页面
                        { path:'reTestCompatibilitypcApplication', component: CompatibilityApplication },      // 专家兼容性端游复测页面
                        { path:'reTestWeaknetApplication', component: weaknetApplication },  // 手游弱网复测页面
                        { path:'reTestWeaknetPCApplication', component: weaknetPCApplication },  // 端游弱网复测页面
                        { path:'reTestPerformanceApplication', component: performanceApplication },      // 手游性能复测页面
                        { path:'reTestPerformancePCApplication', component: performancePCApplication },      // 端游性能复测页面
                        { path:'reTestProtocolApplication', component: protocolApplication },      // 协议复测页面
                    ]
                },
                { path:'performanceTestDetail', component: performanceApplication },    // 专家性能测试申请详情-手游
                { path:'performancePCTestDetail', component: performancePCApplication },   // 专家性能测试申请详情-端游
                { path:'compatibilityPCTestDetail', component: CompatibilityApplication },  // 专家兼容性测试申请详情-端游
                { path:'compatibilityTestDetail', component: CompatibilityApplication },    // 专家兼容性测试申请详情-手游
                { path:'protocolTestDetail', component: protocolApplication },    // 协议测试申请详情
                { path: 'questionTable', component: QuestionTable }, // 问题界面-手游兼容性
                { path: 'questionTablePC', component: QuestionTable }, // 问题界面-端游兼容性
                { path: 'protocolQuestionTable', component: ProtocolQuestionTable }, // 问题界面-端游兼容性
                { path: 'compatibilityStartTest', component: StartTestCompatibility }, //手游兼容性开始测试界面
                { path: 'compatibilityStartTestPC', component: StartTestCompatibilityPC }, //端游兼容性开始测试界面
                { path: 'performanceStartTestPC', component: StartTestPerformancePC }, //端游性能开始测试界面
                { path: 'performanceStartTest', component: StartTestPerformance }, //手游性能开始测试界面
                { path: 'weaknetStartTest', component: StartTestWeaknet }, //手游弱网开始测试界面
                { path: 'weaknetPCStartTest', component: StartTestWeaknetPC }, //端游弱网开始测试界面
                { path: 'protocolStartTest', component: StartTestProtocol }, //协议开始测试界面
                { path: 'cpuLadder', component: CPULadder },    // cpu天梯
                { path: 'expertCompatibility', component: expertCompatibility },    // 兼容性测试首页
                { path: 'performance', component: performance },    // 性能测试首页-手游
                { path: 'performancePC', component: performancePC },    // 性能测试首页-端游
                { path: 'privacy', component: privacy },    // 隐私合规测试首页
                { path: 'protocol', component: protocol },  // 协议测试首页
                { path: 'weaknet', component: weaknet },    // 弱网测试首页-手游
                { path: 'weaknetPC', component: weaknetPC },    // 弱网测试首页-端游
                { path: 'preliminary', component: preliminary },    // 版署预审测试首页
                { path: 'appstore', component: appstore },  // AppStore预审测试首页
                { 
                    path: 'workstation', 
                    component: workstation, 
                    children: [
                        { path:'myMission', component: MyTask},  // 我的任务
                        { path:'assignContactPerson', component: AssignContactPerson },  // 分配接口人
                        { path:'phoneManage', component: PhoneManage },  // 手机设备管理
                        { path:'pcManage', component: PcManage },  // 电脑设备管理
                        { path:'protocolManage', component: ProtocolManage },  // 协议表管理
                        { path:'pcPerformance', component: PcPerformance },  // 电脑设备组合管理
                    ]
                },// 工作站
                { path: 'documentCenter', component: documentCenter },  // 文档中心
                { path: 'workTimeCounter', component: workTimeCounter },
                { path: 'weekPerformance', component: WeekPerformance },    // 周包性能监控
                { path: 'monthPerformance', component: MonthPerformance },    // 月包性能监控
                { path: 'weekPackageEdit', component: PerformanceWeekPackage }, // 周包性能登记
                { path: 'monthPackageEdit', component: PerformanceMonthPackage },   // 周包性能登记
                { path: 'eightWeekPerformance', component: EightWeekPerformance },   // 周包性能登记
            ]
        },
        
        {
            path: "/mtl_test_platform/page",
            component: mtlIndex,
            children: [
                { path: 'compatibilityTestReport', component: CompatibilityTestReport },    // 兼容性测试报告-手游
                { path: 'compatibilityPCTestReport', component: compatibilityTestReportPC },    // 兼容性测试报告-端游
                { path: 'performancePCTestReport', component: performanceTestReportPC },    // 性能测试报告-端游
                { path: 'performanceTestReport', component: performanceTestReport },    // 性能测试报告-手游
                { path: 'weaknetTestReport', component: WeaknetTestReport },    // 弱网测试报告-手游
                { path: 'weaknetPCTestReport', component: WeaknetPCTestReport },    // 弱网测试报告-端游
                { path: 'protocolTestReport', component: ProtocolTestReport },    // 协议测试报告
                { path: 'questionDetail', component: QuestionDetail }, 
                { path: 'questionDetailPC', component: QuestionDetail }, 
                { path: 'problemDeviceDetail', component: ProblemDeviceDetail }, 
            ]
        },
        {path: '/', redirect: '/mtl_test_platform/page/index'},     // 开发时需要，日后上线需要删除
    ]
});
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

// 路由守卫-权限相关
router.beforeEach(async (to, from, next) => {
    if(isFirst) {
        await store.dispatch('getUserEmail');
        await store.dispatch('judgeContact');
        await store.dispatch('getUserAuth');
        isFirst = false
    }
    next()
  })
export default router
