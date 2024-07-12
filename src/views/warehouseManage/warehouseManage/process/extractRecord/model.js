import { httpCurrentWarehouseSelect } from "@/comModel/warehouse";
import {
  httpCustomerSelect,
} from "@/comModel/httpSelect";
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
  id: "number",
	label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
// const SEARCH_COL_4 = {
//   id: "statusList",
//   label: "状态：",
//   placeholder: "状态（多选）",
//   type: "select",
//   multiple: true,
//   basicType: "outStorageStatus",
//   hideList: [0, 1, 2, 3, 4]
// }
const SEARCH_COL_5 = {
  id: "warehouseId",
	label: `${overseaLangObj.ck_lb("所在仓库")}：`,
  ...httpCurrentWarehouseSelect(),
};

const SEARCH_TAB_1 = [
  SEARCH_COL_1,
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_5,
  // SEARCH_COL_4
];
export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_TAB_1,
            },
          ],
        },
      ],
    },
  ];
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "number",
  label: overseaLangObj.gz_dh || "工作单号",
  customRow: true,
  minWidth: 130,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "markStatus",
  label: overseaLangObj.yw_type || "业务类型",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: "deliveryDic",
  customDicsArr: [0, 1, 2],
};
const TABLE_COL_3 = {
  prop: "company",
  label: overseaLangObj.kd_gs("卡车公司/快递公司"),
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "pickUpCode",
  label: overseaLangObj.zt_hm || "自提码",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "licenseNumber",
  label: overseaLangObj.cp_hm || "车牌号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "tname",
  label: overseaLangObj.ps_qd || "派送渠道",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "receivingCode",
  label: overseaLangObj.sj_info() || "收件信息",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    return `${row?.name}[${row?.phone}]`;
  },
};
const TABLE_COL_8 = {
  prop: "detailsAddr",
  label: overseaLangObj.md_c_dz("收件地址"),
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "productType",
  label: overseaLangObj.sku_zl || "SKU类数",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "productTotal",
  label: overseaLangObj.sku_num("SKU总数"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "createNickName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "scheduledTime",
  label: overseaLangObj.dj_sj || "登记时间",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "status",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  dotColor: true,
  fixed: "right",
  basicType: "outStorageStatus",
};
const TABLE_TAB_1 = [
  TABLE_COL_0,
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
];
export const tableColumns = () => TABLE_TAB_1;

const SEE_DLG_COL_1 = {
  span: 8,
  id: "expressOmpany",
  label: "卡车公司/快递公司：",
  type: "txt",
};
const SEE_DLG_COL_2 = {
  span: 8,
  id: "expressNum",
  label: "工作单号：",
  type: "txt",
};
const SEE_DLG_COL_3 = {
  span: 8,
  id: "mailTime",
  label: "自提码：",
  placeholder: "--",
  type: "txt",
};
const SEE_DLG_COL_4 = {
  span: 8,
  id: "see_xx4",
  label: "车牌号：",
  placeholder: "--",
  type: "txt",
  render: () => "地址",
};
const SEE_DLG_COL_5 = {
  span: 8,
  id: "name",
  label: "收件人信息：",
  placeholder: "--",
  type: "txt",
  render: (row) => `${row.name}[${row.phone}]`,
};
const SEE_DLG_COL_6 = {
  span: 8,
  id: "xx_see_6",
  label: "提货日期：",
  placeholder: "--",
  type: "txt",
};
const SEE_DLG_COL_7 = {
  span: 24,
  id: "address",
  label: "收件人地址：",
  placeholder: "--",
  type: "txt",
};
const SEE_DLG_COL_8 = {
  span: 24,
  id: "attachId",
  label: "",
  labelWidth: "0px",
  type: "customUploadFile",
  disable: true,
};
const SEE_DLG_FORM_COLS = {
  columns: [
    SEE_DLG_COL_1,
    SEE_DLG_COL_2,
    SEE_DLG_COL_3,
    SEE_DLG_COL_4,
    SEE_DLG_COL_5,
    SEE_DLG_COL_6,
    SEE_DLG_COL_7,
    SEE_DLG_COL_8,
  ],
  formRules: {},
};

export const editDlgFormCols = (mode_type = 0) => SEE_DLG_FORM_COLS;
// 快递出库调用
export { SEARCH_TAB_1, TABLE_TAB_1 };
