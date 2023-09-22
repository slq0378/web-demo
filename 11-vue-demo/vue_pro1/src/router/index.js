import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login.vue"),
  },
  {
    path: "/home",
    name: "home",
    redirect: "/welcome",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () => import("../views/welcome.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("../views/user/users.vue"),
      },
      {
        path: "/rights",
        name: "rights",
        component: () => import("../views/power/rights.vue"),
      },
      {
        path: "/roles",
        name: "roles",
        component: () => import("../views/power/roles.vue"),
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("../views/goods/categories.vue"),
      },
      {
        path: "/goods",
        name: "goods",
        component: () => import("../views/goods/goods.vue"),
      },
      {
        path: "/params",
        name: "params",
        component: () => import("../views/goods/params.vue"),
      },
      {
        path: "/goods/add",
        name: "add",
        component: () => import("../views/goods/add.vue"),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})
/**
 * to 从哪里跳转过来的
 * from  将要跳转哪里
 * next  是个函数，表示允许跳转from
 */
router.beforeEach((to, from, next) => {
  // 从login跳转过来的，放行
  if (to.path == "/login") {
    return next()
  }
  // token为空的，跳转到login
  const token = sessionStorage.getItem("token")
  if (!token) {
    return next("/login")
  }
  // 否则就放行
  next()
})
export default router
