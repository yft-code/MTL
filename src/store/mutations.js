const mutations={
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
}
export default mutations;
