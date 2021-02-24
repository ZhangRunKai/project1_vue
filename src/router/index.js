import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login'),
    meta:{
      title:'登陆'
    }
  },
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login'),
    meta:{
      title:'登陆'
    }
  },
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
      },{
        path: '/customerByOrder',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/CustomerByOrder')
      },
      {
        path: '/business1',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/Business1')
      },
      {
        path: '/business2',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/Business2')
      },
      {
        path: '/business3',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/Business3')
      },
      {
        path: '/business6',
        meta: {
          requireAuth: true
        },
        component:()=>import('../views/OrderForEnd6')
      }
    ]
  }
]

const router = new VueRouter({
  mode:'hash',
  base:process.env.BASE_URL,
  routes
})

export default router


