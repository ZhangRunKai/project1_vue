import router from './router'
import store from './store'
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import axios from 'axios'
import './permission.js'
import './axios'
import { Loading } from 'element-ui';
Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
