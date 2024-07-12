import store from "@/store";

const basicLangAll = {
  "zh-cn": {
    cz_reset: "重置",
    cx_search: "搜索",
    zk_expand: "展开",
    sq_retract: "收起",
    lsz_set_cols: "列设置",
    cjr_create: "创建人",
    cj_date: "创建时间",
    syt_previous: "上一条",
    xyt_next: "下一条",
    fh_back: "返回",
    ywy_salesperson: "业务员",
  },
  "en-us": {
    cz_reset: "RESET",
    cx_search: "SEARCH",
    zk_expand: "UNFOLD",
    sq_retract: "PACK UP",
    lsz_set_cols: "COLUMN SETTINGS",
    cjr_create: "CREATOR",
    cj_date: "CREATION TIME",
    syt_previous: "PREVIOUS",
    xyt_next: "NEXT",
    fh_back: "BACK",
    ywy_salesperson: "SALESPERSON",
  },
};

export default basicLangAll[store.getters.languageType];

/**
 * import basicLangObj from "@/language/basicLang.js";
 */
