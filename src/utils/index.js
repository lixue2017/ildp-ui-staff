import store from "@/store";
import { parseTime } from "./ruoyi";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { Notification } from "element-ui";
// import Base64 from 'js-base64'
const Base64 = require("js-base64").Base64;
/**
 * 表格时间格式化
 * import { formatDate } from "@/utils/index.js";
 */
export function formatDate(cellValue, format = "-", dateType = "datetime") {
  if (cellValue == null || cellValue == "") return "";
  var date = new Date(cellValue);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (dateType === "date") {
    return year + `${format}` + month + `${format}` + day;
  } else if (dateType === "month") {
    return year + `${format}` + month;
  } else if (dateType === "monthDate") {
    return month + `${format}` + day;
  }
  return (
    year +
    `${format}` +
    month +
    `${format}` +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
}

export function DateCompute(date, day) {
  //DAY为-1时候，结果为指定日期前一天，DAY为1时，结果为指定日期后一天
  var dd = new Date(date);
  dd.setDate(dd.getDate() + day);
  var y = dd.getFullYear();
  var m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  return y + "-" + m + "-" + d;
}

// 日期前进一个月
export function dateForwardMon(date) {
  const oDate = new Date(date);
  const y = oDate.getFullYear();
  const m = oDate.getMonth() + 1;
  const oDay = new Date(y, m, 0).getDate();
  return DateCompute(oDate, -oDay);
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 * url拼接参数
 * decodeUrlArr: 不需要编码的值
 * pageSign: 详情上下页的ID值
 */
export function paramUrl(json, decodeUrlArr = ["id", "pageSign"]) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return "";
      // return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      if (decodeUrlArr.includes(key)) {
        return key + "=" + json[key];
      }
      return key + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function urlParamObj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val];
}

export const exportDefault = "export default ";

export const beautifierConf = {
  html: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "separate",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
  js: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "normal",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
};

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/-[a-z]/g, (str1) => str1.substr(-1).toUpperCase());
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}

// 删除页面最后一条数据，向上翻页
export function delLastPageUp(total, page, limit = 20, remainder = 1) {
  const nPage =
    total > limit && total % limit === remainder && page > total / limit
      ? page - 1
      : page;
  return nPage;
}
// 去重
export function duplicateRemoval(arr, key) {
  return arr.filter((i, idx) => {
    return (
      arr.findIndex((j) => {
        return key !== undefined && key !== null ? j[key] === i[key] : j === i;
      }) === idx
    );
  });
}

// 数值类型转换
export function typeConversion(val, type = "string") {
  if (val === null || val === undefined || val === "") {
    return val;
  }
  if (type === "number") {
    return Number(val);
  }
  // typeof val === 'number' && val.toString(),
  return val.toString();
}

// 判断是否有值或者值为0
export function isValJudgment(val) {
  if (val === null || val === undefined || val === "") {
    return false;
  }
  return true;
}

// 深拷贝
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = deepCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

// XDOC文档预览云服务---在线文件预览
//文档：http://kkfileview.keking.cn/zh-cn/docs/usage.html
export function filesPreview(url) {
  if (!url) {
    return;
  }
  const url_suffix = url.split(".").pop().toLocaleLowerCase();
  if (["pdf"].includes(url_suffix)) {
    window.open(url);
    return;
  }
  //const url = 'http://47.107.237.68/profile/download/BSEC22100097b4836e00-e2a9-49c5-bdb3-28d65e18a3f8.docx'
  const { hostname } = window.location;
  store.dispatch("dictionary/getDictionary", ["loginClientHost"]).then(() => {
    const { loginClientHost } = store.getters.dictData;
    const hostObj = loginClientHost.find((e) => e.nameCn === hostname) || {};
    window.open(
      `${
        hostObj.nameEn || "http://47.107.237.68:8012"
      }/onlinePreview?url=${encodeURIComponent(Base64.encode(url))}`
    );
  });
}

export function getNowDate(format = "/") {
  //获取当天日期，YYYY/MM/DD
  var time = new Date();
  var year = time.getFullYear(); //年
  var month = ("0" + (time.getMonth() + 1)).slice(-2); //月
  var day = ("0" + time.getDate()).slice(-2); //日
  var mydate = year + format + month + format + day;
  return mydate;
}

// 获取当前日期的上一个月
export function getlastMonth() {
  let now = new Date();
  // 当前月的日期
  let nowDate = now.getDate();
  let lastMonth = new Date(now.getTime());
  // 设置上一个月（这里不需要减1）
  lastMonth.setMonth(lastMonth.getMonth());
  // 设置为0，默认为当前月的最后一天
  lastMonth.setDate(0);
  // 上一个月的天数
  let daysOflastMonth = lastMonth.getDate();
  // 设置上一个月的日期，如果当前月的日期大于上个月的总天数，则为最后一天
  lastMonth.setDate(nowDate > daysOflastMonth ? daysOflastMonth : nowDate);
  return lastMonth;
}

// 获取上个月到当前日期一个月区间
export function getInitDate() {
  const endTime = new Date();
  const beginTime = new Date(
    endTime.getTime() - (endTime.getDate() + 1) * 3600 * 24 * 1000
  );
  let oDate = `${beginTime.getFullYear()}-${beginTime.getMonth() + 1}-${
    endTime.getDate() + 1
  }`;
  if (new Date(oDate) == "Invalid Date") {
    oDate = `${endTime.getFullYear()}-${endTime.getMonth() + 1}-1`;
  }

  return [formatDate(oDate, "-", "date"), formatDate(endTime, "-", "date")];
}

// 获取字典词
export function getDictObj(dictKeys, val, isName = true) {
  let dictArr = [];
  if (typeof dictKeys === "string") {
    // 属性名
    dictArr = store.getters.dictData[dictKeys] || [];
  } else {
    dictArr = dictKeys || []; // 属性值
  }

  if ((typeof val === "string" && val.includes(",")) || Array.isArray(val)) {
    // 多个字典词, 如："0,1,2" 或数组
    const vKeys = Array.isArray(val) ? val : val.split(",");
    return vKeys.map((v) => {
      const sDictObj = (dictArr || []).find((t) => t.value === typeConversion(v)) || {};
      if (isName) {
        return sDictObj.nameCn;
      }
      return sDictObj;
    });
  }

  const dictObj =
    (dictArr || []).find((t) => t.value === typeConversion(val)) || {};
  if (isName) {
    return dictObj.nameCn; // 有判断条件，不能设置默认值。需要默认值加传一个参数值
  }
  return dictObj;
}

// 判断当前环境-本地、测试、UAT、生产
export function hostCurrentEnv() {
  const { hostname } = window.location;
  const obj = {
    localhost: "test",
    "47.107.237.68": "test",
    "8.210.139.106": "uat",
    "uat.baosencloud.com": "uat",
    "www.baosencloud.com": "prod",
  };
  return obj[hostname] || "test";
}

// 登录客户端
export function hostLoginClient(userId) {
  const { hostname, port } = window.location;
  store.dispatch("dictionary/getDictionary", ["loginClientHost"]).then(() => {
    const { loginClientHost } = store.getters.dictData;
    const hostObj = loginClientHost.find((e) => e.nameCn === hostname) || {};
    const encode_user = encodeURIComponent(
      encodeURIComponent(`bao堡${userId}森sen`)
    );
    window.open(
      `${
        hostObj.value || "http://undefined"
      }/login?customerUserWord=${encode_user}`
    );
  });
}

export function handleContent(text) {
  return text
    .replaceAll("<p", "<span")
    .replaceAll("</p>", "</span>")
    .replaceAll("<br>", "");
}

export function convertCurrency(money=0, decimal = 2) {
  //金额数字转中文默认保留两位小数
  money = money.toFixed(decimal);
  var cnNums = new Array(
    "零",
    "壹",
    "贰",
    "叁",
    "肆",
    "伍",
    "陆",
    "柒",
    "捌",
    "玖"
  ); //汉字的数字
  var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
  var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
  var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
  var cnInteger = "整"; //整数金额时后面跟的字符
  var cnIntLast = "元"; //整型完以后的单位
  var maxNum = 999999999999999.9999; //最大处理的数字
  var IntegerNum; //金额整数部分
  var DecimalNum; //金额小数部分
  var ChineseStr = ""; //输出的中文金额字符串
  var parts; //分离金额后用的数组，预定义
  var Symbol = ""; //正负值标记
  if (money == "") {
    return "";
  }

  money = parseFloat(money);
  if (money >= maxNum) {
    alert("超出最大处理数字");
    return "";
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    return ChineseStr;
  }
  if (money < 0) {
    money = -money;
    Symbol = "负 ";
  }
  money = money.toString(); //转换为字符串
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = "";
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) {
    //获取整型部分转换
    var zeroCount = 0;
    var IntLen = IntegerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum != "") {
    //小数部分
    var decLen = DecimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1);
      if (n != "0") {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == "") {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (DecimalNum == "") {
    ChineseStr += cnInteger;
  }
  ChineseStr = Symbol + ChineseStr;

  return ChineseStr;
}

export function permissionJump(row = {}) {
  //判断是否有权限跳转
  const { hasPermi, tips = "请联系管理员添加权限" } = row;
  return new Promise((resolve, reject) => {
    if (hasBtnPermits(hasPermi)) {
      resolve(true);
    } else {
      Notification.error({
        title: tips,
      });
      reject(tips);
    }
  });
}

//金额转财务金额 - 此这个方法废弃，金额格式化的都用formatMoney
export function toThousands(num) {
  if (!isNaN(parseFloat(num))) {
    var newNum = Number(Number(num).toFixed(2)).toLocaleString("zh", {
      minimumFractionDigits: 2,
    });
    return newNum;
  } else {
    return 0.0; //自动补小数点后两位
  }
}

export async function getFirstInitData(row) {
  //页面初始化，搜索条件被隐藏使用，获取第一条数据的参数, 直接在页面调接口即可
  const { httpRequest } = row || {};
  const params = {
    pageNum: 1,
    pageSize: 10,
  };
  const res = await httpRequest(params);
  const nRow = res.rows ? res.rows[0] : res.data ? res.data[0] : {};
  return nRow;
}

// 金额格式化千位符
export function formatMoney(num, decimal = 2, str = "--") {
  if ((num || num === 0) && !isNaN(num)) {
    const numStr = Number(num).toFixed(decimal);
    if (str === "fixedNum") {
      return numStr;
    }
    return numStr.toString().replace(/\d+/, function (s) {
      return s.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    });
  }
  return num || ([null, undefined, "fixedNum"].includes(str) ? "--" : str);
}

// 获取可用参数 - 过滤多余参数
export function getAvailableParams(getKeyArr, dataObj = {}) {
  // const getKeyArr = ["id", "remark", "attachId"];
  const { webOriginalDataObj, ...paramObj } = dataObj || {};
  const originalData = webOriginalDataObj || {};
  const optObj = getKeyArr.reduce((sOpt, sKey) => {
    sOpt[sKey] = originalData[sKey];
    return sOpt;
  }, paramObj);
  return optObj;
}

export function resultSameValue(arr1, arr2) {
  //取出两个数组中相同的数值
  let newArr = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      newArr.push(arr1[i]);
    }
  }
  return newArr;
}

export function getInterceptChar(str = "", sym, type = "string") {
  if (str.includes(sym)) {
    let index = str.lastIndexOf(sym) + sym.length - 1;
    str = str.substring(index + 1, str.length);
    if (type == "string") {
      return str;
    } else if (type == "number") {
      return Number(str);
    }
  } else {
    return undefined;
  }
}

export function getTableCurrency(rows=[],config={}){
  //获取动态币种,仅用于报表
  //type列表取值，!type下方表格汇总
  let Config = [];
  const {width=180,parentProp,isTotal=false}=config
  if(isTotal){
    Config = [
      {
        prop: "leftHeader",
        customRow: true,
        showOverflowTooltip: true,
      },
    ];
  }
  rows.map((e) => {
    Config.push({
      label: e.code,
      prop: e.code,
      minWidth: width,
      align: "right",
      showOverflowTooltip: true,
      className: !isTotal?"border-right":undefined,
      render:(row)=>{
        if(!isTotal){
          return formatMoney((row[parentProp]&&row[parentProp][e.code])||row[e.code]||0,2)
        }else{
          return formatMoney(row[e.code]||0,2)
        }
      }
    });
  });
  return Config;
}

export function sumObjectsByKey(...objs) {
  //多个对象中相同键值对相加
  const res = objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
  return res;
}



export function timeConversionAdd({selectTime,addTime=0}) {
  //当前选择的时间戳加上额外的时间戳(天数)，再转化成YYYY-MM-DD
  const time=Date.parse(selectTime)+(86400000*addTime)
  const timeStamp =formatDate(time,"-",'date')
  return timeStamp
}
