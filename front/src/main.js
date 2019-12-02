import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from '@/router';
import store from './store';
import axios from 'axios';
import Viewer from 'v-viewer';

import '@/http/interceptors';

import 'reset.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/index.less';
import 'viewerjs/dist/viewer.css';

Vue.use(ElementUI);
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 99999
  }
});

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');
