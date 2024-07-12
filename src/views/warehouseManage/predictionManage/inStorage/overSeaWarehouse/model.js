import overseaLangObj from "@/language/overseasLang.js";
import {
  httpCustomerSelect,
  httpUserSelect,
  httpCountrySelect,
} from "@/comModel/httpSelect";
const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "nlCode",
  label: `${overseaLangObj.qg_dh || "清关单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "bailorPeopleId",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  ...httpCustomerSelect(),
};
const SEARCH_COL_4 = {
  id: "freightType",
  label: `${overseaLangObj.zx_fs || "装箱方式"}：`,
  placeholder: "请选择",
  basicType: "freightType",
  type: "select",
};
const SEARCH_COL_5 = {
  id: "salesman",
  label: `${overseaLangObj.ywy_salesman || "业务员"}：`,
  ...httpUserSelect(),
};
const SEARCH_COL_6 = {
  id: "countryId",
  label: `${overseaLangObj.mdg_country || "目的国"}：`,
  ...httpCountrySelect,
};
const SEARCH_COL_7 = {
  id: "traceNumber",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_8 = {
  id: "referenceNumber",
  label: `${overseaLangObj.ck_bm || "参考单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_9 = {
  id: "actualityDevannTime",
  label: `${overseaLangObj.sj_tcg() || "实际提拆柜"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COL_10 = {
  id: "warehousingSource",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  placeholder: "请选择",
  basicType: "warehousingSource",
  type: "select",
};

const SEARCH_COL_11 = {
  id: "createId",
  label: "创建人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COL_12 = {
  id: "warehouseStatus",
  label: `${overseaLangObj.zt_status || "入仓状态"}：`,
  placeholder: "请选择",
  basicType: "inWarehouseStatus",
  type: "select",
};

const SEARCH_COL_13 = {
  id: "jobNo",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};

const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "nlCode",
  label: overseaLangObj.qg_dh || "清关单号",
  sortable: true,
  minWidth: 160,
  showOverflowTooltip: true,
  // cPageNoKey: "/warehouseManage/inStorage/overseasWarehouseDetails",//路由匹配字段
  // cOrderIdKey: "id",//跳转详情查询字段ID
  // columnLink: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "bailorPeopleName",
  label: overseaLangObj.wtr_customer || "委托人",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_3 = {
  prop: "salesmanName",
  label: overseaLangObj.ywy_salesman || "业务员",
  sortable: true,
  minWidth: 90,
  showOverflowTooltip: true,
};

const TABLE_COL_4 = {
  prop: "freightType",
  label: overseaLangObj.zx_fs || "装箱方式",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "freightType",
  align: "center",
};
const TABLE_COL_5 = {
  prop: "warehouseSourceName",
  label: overseaLangObj.rk_ly || "入库来源",
  sortable: true,
  minWidth: 180,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "traceNumber",
  label: overseaLangObj.tracking_no || "跟踪号",
  sortable: true,
  minWidth: 180,
  showOverflowTooltip: true,
};

const TABLE_COL_7 = {
  prop: "referenceNumber",
  label: overseaLangObj.ck_bm || "参考编码",
  sortable: true,
  minWidth: 180,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "takeGoodsAddress",
  label: overseaLangObj.sh_address || "目的地址",
  sortable: true,
  minWidth: 180,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "warehousingTime",
  label: overseaLangObj.yj_rc_sj || "预计入仓时间",
  sortable: true,
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "firstTakeGoodsTime",
  label: overseaLangObj.sc_sh_time || "首次收货时间",
  sortable: true,
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "warehouseRemark",
  label: overseaLangObj.rc_remark || "入仓备注",
  sortable: true,
  minWidth: 180,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "contryName",
  label: overseaLangObj.mdg_country || "目的国",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "overseasOperatorName",
  label: overseaLangObj.czy_operator || "操作员",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "operationMainName",
  label: overseaLangObj.ss_gs("所属公司"),
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  sortable: true,
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "createBy",
  label: overseaLangObj.cjr_create || "创建人",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "warehouseStatus",
  label: overseaLangObj.zt_status || "状态",
  sortable: true,
  width: 86,
  showOverflowTooltip: true,
  dotColor: true,
  fixed: "right",
  basicType: "inWarehouseStatus",
};
const TABLE_COL_18 = {
  prop: "jobNo",
  label: overseaLangObj.gz_dh || "工作单号",
  sortable: true,
  minWidth: 150,
  cPageNoKey: "/warehouseManage/inStorage/overseasWarehouseDetails", //路由匹配字段
  cOrderIdKey: "id", //跳转详情查询字段ID
  columnLink: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_OPERATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  sortable: true,
  minWidth: 110,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1, //创建时间
              SEARCH_COL_2, //清关单号
              SEARCH_COL_13, //工作单号
              SEARCH_COL_3, //委托人
              SEARCH_COL_4, //装箱方式
              SEARCH_COL_5, //业务员
              SEARCH_COL_7, //跟踪号
              SEARCH_COL_8, //参考单号
              SEARCH_COL_9, //实际提拆柜
              SEARCH_COL_6, //目的国
              SEARCH_COL_10, //入库来源
              // SEARCH_COL_11,//创建人
              SEARCH_COL_12, //入仓状态
            ],
          },
        ],
      },
    ],
  },
];

export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_SELECTION,
  TABLE_COL_18,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_OPERATION,
];
