import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/

export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/userManagement/index',
    name: '用户管理',
    hidden: true,
    children: [{ path: 'userManagement/index', component: _import('userManagement/index'), name: '用户管理' }]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: 'auth',
    name: '管理员权限',
    icon: 'lock',
    children: [
      { path: 'index', component: _import('auth/index'), name: '角色管理', hidden: true },
      { path: 'accountList', component: _import('auth/accountList'), name: '账号列表' }

    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: 'content',
    name: '内容管理',
    icon: 'excel',
    children: [
      { path: 'investigation', component: _import('content/investigation'), name: '研究介绍' },
      { path: 'informedConsent', component: _import('content/informedConsent'), name: '知情同意书' },
      { path: 'operationProcess', component: _import('content/operationProcess'), name: '操作流程' }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/index',
    name: '用户管理',
    icon: 'people',
    noDropdown: true,
    children: [
      { path: 'index', component: _import('userManagement/index'), name: '用户管理' },
      { path: 'userFormDetails', component: _import('userManagement/userFormDetails'), name: '用户表单详情', hidden: true }
    ]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    icon: '404',
    children: [
      { path: '401', component: _import('errorPage/401'), name: '401' },
      { path: '404', component: _import('errorPage/404'), name: '404' }
    ],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

