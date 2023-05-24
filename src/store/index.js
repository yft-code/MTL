import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
// vuex持久化存储
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    createPersistedState({
        storage: window.sessionStorage    // 这里用的是localStoreage，如果要用sessionStorage
    })
]
});
