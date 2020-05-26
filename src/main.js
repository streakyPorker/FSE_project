import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Bmob from 'hydrogen-js-sdk'

Bmob.initialize('9277edbd9362b0c7',
'123456')


Vue.prototype.Bmob=Bmob
Bmob.User.login('lzy','123456').then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})

import axios from 'axios'
Vue.prototype.axios = axios  
Vue.config.productionTip = false


// 挂载在vue实例化对象上
import {store} from './store'





new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
