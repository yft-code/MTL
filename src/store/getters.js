const getters={
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
    //获取用户邮箱-
    getUserEmail: state => {
        return state.currentUserEmail;
    },
    //获取当前用户权限
    getUserAuth: state => {
        return state.currentUserAuth;
    },
    // -
    getIsTester: state => {
        return state.isTester
    },
    // -
    getIsAdmin: state => {
        return state.isAdmin
    },
    getProblemFilter: state => {
        return state.problemFilter
    },
    // --
    getIsContact: state => {
        return state.isContact
    }
}
export default getters;
