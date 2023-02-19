import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/FrontLayout.vue"),
      children: [
        {
          // 巢狀路由路徑不用加斜線
          path: "/",
          name: "home",
          component: () => import("../views/front/HomeView.vue"),
        },
        {
          // 巢狀路由路徑不用加斜線
          path: "about",
          name: "about",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/front/AboutView.vue"),
        },
        {
          // 巢狀路由路徑不用加斜線
          path: "cart",
          component: () => import("../views/front/CartView.vue"),
        },
        {
          // 巢狀路由路徑不用加斜線
          path: "product/:id",
          component: () => import("../views/front/ProductView.vue"),
        },
        {
          // 巢狀路由路徑不用加斜線
          path: "products",
          component: () => import("../views/front/ProductsView.vue"),
        },
        {
          // 巢狀路由路徑不用加斜線
          path: "login",
          component: () => import("../views/front/LoginView.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: () => import("../views/DashboardView.vue"),
      children: [
        {
          // 巢狀路由路徑不用加斜線
          path: "adminOrders",
          component: () => import("../views/admin/AdminOrders.vue"),
        },
        {
          // 巢狀路由路徑不用加斜線
          path: "adminProducts",
          component: () => import("../views/admin/AdminProducts.vue"),
        },
      ],
    },
  ],
});

export default router;
