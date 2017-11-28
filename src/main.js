import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import axios from 'axios'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限
import en from '@/locale/en'
import zh from '@/locale/zh'

Vue.use(VueI18n)
Vue.use(ElementUI)
// 设置axios代理
Vue.prototype.$http = axios
Vue.prototype.HOST = '/api'
// 由于后台没有配置api前缀 所以这里用axios.defaults.baseURL
// axios.defaults.baseURL = 'http://192.168.13.13:8888'
axios.defaults.baseURL = 'http://localhost:8888'

const lang = 'zh'
Cookies.set('lang', lang)
const messages = {
  zh: zh,
  en: en
}
const i18n = new VueI18n({
  locale: lang,
  messages
})
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  i18n
})
