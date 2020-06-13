import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Charts from '@/components/Charts.vue'
import Super from '@/components/Super.vue'
import Dispatch from '@/components/Dispatch.vue'
import auto from '@/components/dispatcher/auto.vue'
import globalauto from '@/components/dispatcher/globalauto.vue'






Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path:'/Charts',
    name:'Charts',
    component:Charts
  },
  {
    path:'/Super',
    name:'Super',
    component:Super
  },
  {
    path:'/Dispatch',
    component:Dispatch,
    children:[
      {path:'/auto',component:auto},
      {path:'/globalauto',component:globalauto},
    ],
  }
  
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
