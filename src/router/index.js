import Vue from 'vue'
import Router from 'vue-router'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import zh from '@/locale/zh'
import en from '@/locale/en'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)
Vue.use(VueI18n)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
const setLang = (str) => {
  const str0 = str.split('.')[0]
  const str1 = str.split('.')[1]
  const $lang = Cookies.get('lang') || 'zh'
  if ($lang === 'zh') {
    return zh[str0][str1]
  } else {
    return en[str0][str1]
  }
}

export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/auth/index',
    name: setLang('auth.auth'),
    hidden: true,
    children: [{ path: 'accountList', component: _import('auth/index'), name: setLang('auth.personalCenter') }]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: 'auth',
    name: setLang('auth.auth'),
    icon: 'lock',
    children: [
      { path: 'index', component: _import('auth/index'), name: setLang('auth.personalCenter') },
      { path: 'accountList', component: _import('auth/accountList'), name: setLang('auth.accountList') }

    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: 'content',
    name: setLang('content.content'),
    icon: 'excel',
    children: [
      { path: 'investigation', component: _import('content/investigation'), name: setLang('content.investigation') },
      { path: 'informedConsent', component: _import('content/informedConsent'), name: setLang('content.informedconsent') },
      { path: 'operationProcess', component: _import('content/operationProcess'), name: setLang('content.operationprocess') }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/index',
    name: setLang('userManagement.userManagement'),
    icon: 'people',
    noDropdown: true,
    children: [
      { path: 'index', component: _import('userManagement/index'), name: setLang('userManagement.userManagement') },
      { path: 'userFormDetails', component: _import('userManagement/userFormDetails'), name: setLang('userManagement.userFormDetails'), hidden: true }
    ]
  }
  // {
  //   path: '/userFormDetails',
  //   component: Layout,
  //   redirect: '/userManagement/userFormDetails',
  //   name: setLang('userManagement.userFormDetails'),
  //   noDropdown: true,
  //   children: [{ path: '/userFormDetails', component: _import('userManagement/userFormDetails') }],
  //   hidden: true
  // },
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限测试',
    icon: 'lock',
    meta: { role: ['admin'] },
    noDropdown: true,
    children: [{ path: 'index', component: _import('permission/index'), name: '权限测试页', meta: { role: ['admin'] }}],
    hidden: true
  },
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

