import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
// import '@/assets/styles/element-variables.scss'

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import App from "./App";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";
import "@/assets/iconfont/iconfont.css"; //员工端iconfont

import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree,
} from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
//自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar";
import {
  typeConversion,
  isValJudgment,
  getDictObj,
  formatMoney,
  toThousands,
} from "@/utils/index";
import { comRepeatedRequest } from "@/api/common";
import * as instructions from "@/utils/instructions"; // 小数点限制指令
import overseaLangObj from "@/language/overseasLang.js";

import VueQuillEditor from "vue-quill-editor"; //编辑器
import "quill/dist/quill.core.css"; // 编辑器样式
import "quill/dist/quill.snow.css"; // 编辑器样式
import "quill/dist/quill.bubble.css"; // 编辑器样式

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.VueQuillEditor = VueQuillEditor;
Vue.prototype.toThousands = toThousands;

Vue.prototype.msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success",
    duration: 1500,
  });
};

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function (msg) {
  this.$message.info({ showClose: true, message: msg });
};

Vue.prototype.msgWarning = function (msg) {
  this.$message({ showClose: true, message: msg, type: "warning" });
};

/**
 * 保留几位小数
 */
Vue.prototype.formatNum = function (e, type, key, decimal) {
  if (type !== "number" && !decimal) return;
  let temp = e.target.value.toString();
  if (decimal === 0) {
    temp = temp < 0 ? 0 : Math.trunc(temp);
  } else {
    let reg = new RegExp(`^(\\-)*(\\d+)\\.(\\d{${decimal}}).*$`);
    temp = temp < 0 ? 0 : temp.replace(reg, "$1$2.$3");
  }

  const max_num = 1000000000000;
  temp = temp > max_num ? max_num : temp;
  this.formModel[key] = temp;
};

/**
 * 禁止输入+-e
 */
Vue.prototype.inputLimit = function (e, type) {
  if (type !== "number") return;
  let key = e.key;
  if (key === "+" || key === "-" || key === "e") {
    e.returnValue = false;
    return false;
  }
  return true;
};

// 自定义四舍五入
Number.prototype.toRoundFixed = function (len) {
  return instructions.toNewFixed(this, len).toFixed(len);
};

// 大于0的最小值限制
Vue.prototype.minLimitNumber = instructions.minLimitNumber;
// 小数位四舍五入
Vue.prototype.toFixedNum = instructions.toFixedNum;
// 小数位截取
Vue.prototype.interceptNum = instructions.interceptNum;
// 加减乘除
Vue.prototype.accumulationFn = instructions.accumulationFn;
Vue.prototype.subtractFn = instructions.subtractFn;
Vue.prototype.multiplicationFn = instructions.multiplicationFn;
Vue.prototype.isValJudgment = isValJudgment; // 判断是否有值或者值为0
Vue.prototype.typeConversion = typeConversion; // 数据类型转换
Vue.prototype.getDictObj = getDictObj; // 获取字典词对象
Vue.prototype.formatMoney = formatMoney; // 金额格式化千位符
Vue.prototype.overseaLangObj = overseaLangObj; // 中英文语言

Vue.directive("inputLimit", instructions.inputLimt);
Vue.directive("inputNumberLimit", instructions.inputNumberLimt);

// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);

Vue.use(permission);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  ...(overseaLangObj.yu_yan_lang === "en-us" ? { locale } : {}),
  size: Cookies.get("size") || "medium", // set element-ui default size
});
//防抖
Vue.directive("debounce", {
  inserted(el, binding) {
    el.addEventListener("click", (e) => {
      if (el.disabled) return; // 表格多选操作，防止点击按钮跳转页面清空选择项后，禁止按钮重置为可点击
      const { value: banDebounce } = binding;
      el.classList.add("is-disabled");
      el.disabled = true;
      const setTime = setTimeout(() => {
        el.disabled = false;
        el.classList.remove("is-disabled");
      }, 800); // 时间设置-需要小于mixinTimeResetSelection中的延时
      if (banDebounce) {
        //列表右侧按钮如果需要置灰需要在按钮配置处加入banDebounce这个参数，否则所点击的按钮置灰后过1秒延时会在这里重新激活
        clearTimeout(setTime);
      }
    });
  },
});

//节流
Vue.directive("throttle", {
  inserted: function (el, binding) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 600);
      }
    });
  },
});

// 点击事件接口防抖
Vue.prototype.comRepeatedRequest = comRepeatedRequest;

Vue.directive("loadmore", {
  bind(el, binding) {
    const SELECTWRAP_DOM = el.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    SELECTWRAP_DOM.addEventListener("scroll", function () {
      // console.log('this.scrollHeight: ', this.scrollHeight)
      const CONDITION =
        this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight;
      if (CONDITION) {
        binding.value();
      }
    });
  },
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
