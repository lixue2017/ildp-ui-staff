import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import { Notification } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";

NProgress.configure({ showSpinner: false });

const whiteList = [
  "/login",
  "/auth-redirect",
  "/bind",
  "/register",
  "/staffLogin",
  "/shareScheme",
  "shareQuotation",
];

router.beforeEach((to, from, next) => {
  //未匹配到正确路由
  // if (to.matched.length === 0) from.path ? next({ path: from.path }) : next('/')
  if (!to.meta.noCache && to.matched && to.matched.length > 2) {
    /*
      使用vue的keep-alive缓存组件，三级菜单组件无法缓存问题解决
      keep-alive本身存在的缺陷，需要在路由守卫中将matched属性做一下优化
    */
    to.matched.splice(1, to.matched.length - 2);
  }
  NProgress.start();
  if (getToken()) {
    if (store.getters.roles.length === 0) {
      store
        .dispatch("GetInfo")
        .then((res) => {
          let nextObj = { ...to, replace: true };
          /* has token*/
          if (to.path === "/login" || to.path === "/staffLogin") {
            nextObj = { path: "/" };
          }
          // 拉取user_info
          const roles = res.roles;
          store.dispatch("GenerateRoutes", { roles }).then((accessRoutes) => {
            // 测试 默认静态页面
            // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next(nextObj); // hack方法 确保addRoutes已完成
            NProgress.done();
          });
        })
        .catch((err) => {
          store.dispatch("FedLogOut").then(() => {
            Message.error(err);
            if (whiteList.includes(to.path)) {
              next();
            } else {
              next({ path: "/staffLogin" });
            }
          });
        });
    } else {
      // console.log("==", to, from);
      if (to.name == 404) {
        if (from.path === "/staffLogin") {
          next("/");
        } else {
          Notification.error({
            title: "暂无访问权限，请联系管理员",
          });
          next(from.fullPath);
          NProgress.done();
        }
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      // 否则全部重定向到登录页
      const path =
        to.fullPath.split("?")[0] === "/index"
          ? to.fullPath.split("?")[0]
          : to.fullPath;
      next(`/staffLogin?redirect=${path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
