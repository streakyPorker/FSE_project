import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Charts from '../components/Charts.vue'
import Super from '../components/super.vue'




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
  
  
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
