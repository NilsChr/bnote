import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import App from '@/App'
import './plugins/highlight';
import {router} from '@/router'
import {store} from '@/store'
import auth from '@/auth'
import vuetify from './plugins/vuetify';
import { db } from './db'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,

  beforeCreate () {
    auth.init(this);
    db.loadDocuments();
  },

  template: '<App/>',
  vuetify,
  components: { App }
})