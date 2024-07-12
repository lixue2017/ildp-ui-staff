import axios from "axios";
import { Notification, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { errorCode, errorLoginExpired } from "@/utils/errorCode";
import qs from "qs";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
// console.log('process.env.VUE_APP_BASE_API===', process.env.VUE_APP_BASE_API)
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: "https://www.baosencloud.com:10010/prod-api", // 生产环境
  // baseURL: "http://47.243.49.0:10010/prod-api", // 生产环境
  // baseURL: "https://uat.baosencloud.com:10010/prod-api", // UAT环境
  // baseURL: "http://47.107.237.68:10010/prod-api", // 测试环境
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'http://192.168.1.171:8080', //  争辉 后端联调本地
  // baseURL: "http://192.168.1.98:8080", //  礼峰 后端联调本地
  // baseURL: "http://192.168.0.38:8080", //  谭康 后端联调本地
  // baseURL: "http://192.168.1.216:8080", //  国航 后端联调本地
  // 超时
  timeout: 500000,
  paramsSerializer: (params) => {
    // 序列化GET请求防止[]解析为数组导致接口报错
    return qs.stringify(params, { indices: false });
  },
});

let cancelRequest;
let requestObj = {};
let temp_token = null;

const { CancelToken, isCancel } = axios;

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    if (config.data) {
      // post/put 请求
      if (store.getters.isFormSubmit) {
        // 防止表单重复点击提交
        store.dispatch("settings/actionRepeatedClick", true);
        store.dispatch("settings/actionFormSubmit", false);
      }
      if (
        ["AutoComplete", "webCancelOldRequest"].includes(
          config.data.webRequestSource
        )
      ) {
        delete config.data.webRequestSource;
        terminateRequestFn(config);
      }
    }

    if (config.params) {
      // get 请求
      // for (let key in config.params) {
      // 	if (config.params[key] && typeof config.params[key] === 'string') {
      // 		config.params[key] = config.params[key].replace(/\[/g, '').replace(/\]/g, '');
      // 	}
      // }
      if (
        ["AutoComplete", "webCancelOldRequest"].includes(
          config.params.webRequestSource
        )
      ) {
        delete config.params.webRequestSource;
        terminateRequestFn(config);
      }
    }

    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      // if (!temp_token) {
        temp_token = getToken(); // 在同一浏览器其他页面登录不同账户, 需要刷新当前用户信息
      // }
      config.headers["Authorization"] = "Bearer " + temp_token; // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers["Accept-Language"] = store.getters.languageType; // 语言
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

function terminateRequestFn(config) {
  // console.log('config==', config)
  /**
   * 不需要终止上一次请求的接口，旧的下拉框ID定位值
   * 如：字典词、币别、人员、航次管理的港口、收发通知人
   * */
  const filterUrlList = [
    "/operate/data/listByTypeEns",
    "/basic/info/list",
    "/system/user/all",
    "/operate/port/publicList",
    "/system/contacts/main/list",
  ];

  if (!filterUrlList.includes(config.url)) {
    if (requestObj[config.url] && cancelRequest)
      cancelRequest(`取消上一次请求 ${config.url}`);
    requestObj[config.url] = true;
    config.cancelToken = new CancelToken((c) => (cancelRequest = c));
  }
}

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态

    if (res.config.url) {
      const urlKey = res.config.url.split(res.config.baseURL)[1] || "";
      // console.log('res===', requestObj, urlKey)
      delete requestObj[urlKey];
    }
    const code = res.data.code || 200;

    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      errorLoginExpired();
      return res.data;
    } else if (code === 500) {
      Message({
        message: msg,
        type: "error",
        showClose: true,
      });
      return Promise.reject(new Error(msg));
    } else if (code == 1001) {
      Notification.error({
        title: msg,
      });
      return Promise.reject(res.data);
    } else if ([207, 1002].includes(code)) {
      // 页面单独处理提示信息, 不在此处显示提示信息  207-msgList: 提示信息为数组
      return Promise.reject(res.data);
    } else if (code === 201) {
      // 请求成功后, 只用于警告提示
      if (msg) {
        setTimeout(() => {
          Message.closeAll(); // 先关闭单独处理的成功提示
          Message({
            message: msg,
            type: "error",
            showClose: true,
          });
        }, 20);
      }
      return res.data;
    } else if (code !== 200) {
      Notification.error({
        title: msg,
      });
      return Promise.reject("error");
    } else {
      if (res.config.customStreamFileParam) {
        // 流文件下载
        return res;
      }
      return res.data;
    }
  },
  (error) => {
    if (isCancel(error)) {
      /** 相同接口不能同时请求，需要在前一接口响应后再次请求，否则会终止上一个请求 */
      return console.log("用户取消了请求，原因为：" + error);
    }
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      const errNum = message.substr(message.length - 3);
      if (errNum === "502") {
        message = "正在发布新版本，请稍后再试";
      } else {
        message = "系统接口" + errNum + "异常";
      }
    }
    Message({
      message: message,
      type: "error",
      duration: 5 * 1000,
      showClose: true,
    });
    return Promise.reject(error);
  }
);

/** 不能在此处调用，其他接口请求完成后也可重复点击 */
function blockDuplicateRequests() {
  if (store.getters.isFormSubmit) {
    // 防止表单重复点击提交
    store.dispatch("settings/actionFormSubmit", false);
    setTimeout(() => {
      // 延时返回，先更新页面DOM结构
      store.dispatch("settings/actionRepeatedClick", false);
    }, 100);
  }
}

export default service;
