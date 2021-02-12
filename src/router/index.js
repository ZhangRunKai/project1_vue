import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/Customer')
      },
      {
        path: 'test',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/Test')
      },
      {
        path: '/business',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/Business')
      },
      {
        path: '/user',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/User')
      },
      {
        path: '/test',
        component:()=>import('../views/Test')
      }
    ]
  },
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router


