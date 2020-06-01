import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Bmob from 'hydrogen-js-sdk'

//Echarts组件所需要引入的文件和中国地图
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/world.js'  // 引入世界地图
Vue.prototype.$echarts = echarts  //设置全局属性

Bmob.initialize('fda1e7d2c28f6ef2','123456')
Vue.prototype.Bmob=Bmob

Bmob.User.login('hl','123456').then(res=>{
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
