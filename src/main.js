import Vue from "vue";
import axios from 'axios'
import api from '../api.config'
import ElementUI from 'element-ui';
import '../theme/index.css'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Utils from './utils/utils.js';
import VueMarquee from 'vue-marquee-component';
import publicJS from './utils/publicJS'
import selfAxios from './utils/selfAxios'
import echarts from 'echarts'
import popo from './utils/popo.js'
import common from './components/Common/index.js'
import leihuoWebFeedback from 'leihuo-web-feedback'

// import '@/assets/icon/iconfont.css'
import './css/other.css'
import './css/model.css'
import './css/report.css'

axios.defaults.baseURL = api.baseURL;
// axios.defaults.baseURL = '/apis';
Vue.config.productionTip = false;
// Vue.use(axios);
Vue.prototype.axios = axios
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
Vue.use(publicJS)
Vue.use(popo)
Vue.use(common)
Vue.use(Utils);
Vue.use(selfAxios);
Vue.use(VueMarquee);
Vue.use(leihuoWebFeedback);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");