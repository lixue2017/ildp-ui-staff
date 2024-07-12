import {
  httpLogisticsCustomerSelect,
  httpUserSelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import { httpCurrentWarehouseSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "customerId",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  ...httpCustomerSelect(),
};
const SEARCH_COL_3 = {
  id: "businessSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
  maxlength: 500,
};
const SEARCH_COL_4 = {
  id: "trackingSn",
  label: `${overseaLangObj.wl_ps_info("快递单号")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "stateList",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "请选择（多选）",
  multiple: true,
  type: "select",
  basicType: "distributionPlanKdState",
};
const SEARCH_COL_6 = {
  id: "trackingNumber",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "code",
  label: `${overseaLangObj.kd_info_bm("快递信息编号")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_8 = {
  id: "expressCompanyName",
  label: `${overseaLangObj.kd_gs("快递公司")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "outboundWmsId",
  label: `${overseaLangObj.ck_lb("所在仓库")}：`,
  ...httpCurrentWarehouseSelect(),
};
const SEARCH_COL_11 = {
  id: "affiliatedCompanyId",
  label: `${overseaLangObj.ss_gs("所属公司")}：`,
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_12 = {
  id: "createUserId",
  label: `${overseaLangObj.cjr_create || "创建人"}：`,
  ...httpUserSelect(),
};
const SEARCH_COL_13 = {
  id: "pickingNumber",
  label: `捡货单号：`,
  placeholder: "请输入",
  type: "text",
};

export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_1,
                SEARCH_COL_2,
                SEARCH_COL_3,
                SEARCH_COL_4,
                SEARCH_COL_5,
                SEARCH_COL_6,
                SEARCH_COL_7,
                SEARCH_COL_8,
                SEARCH_COL_10,
                SEARCH_COL_11,
                SEARCH_COL_12,
                SEARCH_COL_13,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "code",
  label: overseaLangObj.kd_info_bm("快递信息编号"),
  minWidth: 148,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
  columnLink: true,
};
const TABLE_COL_2 = {
  prop: "expressCompanyName",
  label: overseaLangObj.kd_gs("快递公司"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
};
const TABLE_COL_3 = {
  prop: "trackingSn",
  label: overseaLangObj.wl_ps_info("快递单号"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
};
const TABLE_COL_4 = {
  prop: "totalWeight",
  label: overseaLangObj.total_weight("总重量/KG"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_5 = {
  prop: "totalVolume",
  label: overseaLangObj.total_volume("总体积/m³"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_6 = {
  prop: "businessSnNum",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 150,
  showOverflowTooltip: true,
  sortable: true,
  render: (r) => `${r.businessSnNum || "-"}个：${r.businessSn || "-"}`,
};
const TABLE_COL_7 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_8 = {
  prop: "scheduledTime",
  label: overseaLangObj.yj_jj_sj || "预计寄件日期",
  minWidth: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_9 = {
  prop: "destinationType",
  label: overseaLangObj.mdd_type || "目的地",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "destinationType",
  sortable: true,
};
const TABLE_COL_10 = {
  prop: "destinationCountryCode",
  label: overseaLangObj.mdg_country || "目的国",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  render: (r) =>
    `${r.destinationCountryCode || ""}[${r.destinationCountryName || "--"}]`,
};
const TABLE_COL_11 = {
  prop: "wmsCode",
  label: overseaLangObj.mdd_code("仓库编码"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_12 = {
  prop: "receivingInfo",
  label: overseaLangObj.sj_info("收件信息"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_13 = {
  prop: "receivingAddress",
  label: overseaLangObj.md_c_dz("收件地址"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_14 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  width: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_15 = {
  prop: "updateTime",
  label: overseaLangObj.last_modified("最后更新时间"),
  width: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_16 = {
  prop: "createUserName",
  label: overseaLangObj.cjr_create || "创建人",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_17 = {
  prop: "outboundWmsName",
  label: overseaLangObj.ck_lb("所在仓库"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_18 = {
  prop: "affiliatedCompanyName",
  label: overseaLangObj.ss_gs("所属公司"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_19 = {
  prop: "freightState",
  label: overseaLangObj.hw_zt || "货物状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionPlanState",
  dotColor: true,
  fixed: "right",
  sortable: true,
};
const TABLE_COL_20 = {
  prop: "state",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionPlanKdState",
  dotColor: true,
  fixed: "right",
  sortable: true,
};
const TABLE_COL_21 = {
  prop: "pickingNumber",
  label: "捡货单号",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: overseaLangObj.yu_yan_lang === "en-us" ? 188 : 160,
};

export const tableColumns = () => {
  return [
    TABLE_COL_0,
    TABLE_COL_SELECTION,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_21,
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
    TABLE_COL_18,
    TABLE_COL_19,
    TABLE_COL_20,
    TABLE_COL_99,
  ];
};

const SEE_DLG_COL_1 = {
  span: 8,
  id: "code",
  label: "快递信息编号：",
  type: "txt",
};
const SEE_DLG_COL_2 = {
  span: 8,
  id: "expressCompanyName",
  label: "快递公司：",
  type: "txt",
};
const SEE_DLG_COL_3 = {
  span: 8,
  id: "trackingSn",
  label: "快递单号：",
  type: "txt",
};
const SEE_DLG_COL_4 = {
  span: 8,
  id: "scheduledTime",
  label: "预计寄件日期：",
  type: "txt",
};
const SEE_DLG_COL_5 = {
  span: 16,
  id: "receivingInfo",
  label: "收件人信息：",
  type: "txt",
};
const SEE_DLG_COL_6 = {
  span: 24,
  id: "receivingAddress",
  label: "收件人地址：",
  type: "txt",
};
const SEE_DLG_COL_7 = {
  // span: 24,
  // id: "remark",
  // label: "备注信息：",
  // type: "txt",
};
const SEE_DLG_COL_8 = {
  span: 24,
  id: "attachId",
  labelWidth: "0px",
  type: "customUploadFile",
  disable: true,
};

export const seeDlgFormCols = () => {
  return {
    title: overseaLangObj.kd_info_bm("快递信息"),
    width: "880px",
    labelWidth: "95px",
    ftShowBtnArr: ["fBtnCancel"],
    isAttachFileId: true,
    simpleCustomCols: [
      SEE_DLG_COL_1,
      SEE_DLG_COL_2,
      SEE_DLG_COL_3,
      SEE_DLG_COL_4,
      SEE_DLG_COL_5,
      SEE_DLG_COL_6,
      // SEE_DLG_COL_7,
      SEE_DLG_COL_8,
    ],
  };
};
