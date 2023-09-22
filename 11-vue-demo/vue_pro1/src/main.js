import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./plugins/element.js"
import "./assets/css/global.less"
import "./assets/fonts/iconfont.css"
import axios from "axios"
import ZkTable from "vue-table-with-tree-grid"

Vue.use(ZkTable)
Vue.config.productionTip = false
// axios 根url
axios.defaults.baseURL = "http://127.0.0.1:80/api/private/v1/"
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios

Vue.filter("dateFormat", function (params) {
  const dt = new Date(params)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + "").padStart(2, "0")
  const d = (dt.getDate() + "").padStart(2, "0")

  const hh = (dt.getHours() + "").padStart(2, "0")
  const mm = (dt.getMinutes() + "").padStart(2, "0")
  const ss = (dt.getSeconds() + "").padStart(2, "0")
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app")
