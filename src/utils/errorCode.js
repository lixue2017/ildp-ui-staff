import { MessageBox } from "element-ui";
import store from "@/store";

export const errorCode = {
  401: "认证失败，无法访问系统资源",
  403: "当前操作没有权限",
  404: "访问资源不存在",
  default: "系统未知错误，请反馈给管理员",
};

export const errorLoginExpired = () => {
  MessageBox.confirm(
    "登录状态已过期，您可以继续留在该页面，或者重新登录",
    "系统提示",
    {
      confirmButtonText: "重新登录",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    store.dispatch("LogOut").then(() => {
      location.href = `/staffLogin`;
    });
  });
};
