import {
  httpCurrentWarehouseSelect,
  httpFBAWarehouseSelect,
  httpPackingSelect,
  httpTraySelect,
} from "@/comModel/warehouse";
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
  // id: "warehouseId",
  // label: "所属仓库：",
  // placeholder: "请选择",
  // ...httpCurrentWarehouseSelect(),
};
const SEARCH_COL_3 = {
  id: "trayNum",
  label: `${overseaLangObj.pallet_number() || "托盘号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "useStatus",
  label: `${overseaLangObj.sy_qk || "使用情况"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "trueOrFalse",
};

export const searchColumns = [
  {
    className: "search-form-width",
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              // SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4,
              SEARCH_COL_5,
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  // fixed: 'left'
};
const TABLE_COL_1 = {
  prop: "trayNum",
  label: overseaLangObj.pallet_number("托盘号"),
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "warehouseName",
  label: overseaLangObj.ck_lb("所属仓库"),
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "useStatus",
  label: overseaLangObj.sy_qk || "使用情况",
  width: 98,
  sortable: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_4 = {
  prop: "storageModeName",
  label: overseaLangObj.cc_fs || "存仓方式",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer("客户"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "createBy",
  label: overseaLangObj.cjr_create || "创建人",
  width: 110,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  width: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  // fixed: "right",
  width: 113,
};
const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_SELECTION,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_99,
];
export const tableColumns = () => {
  return TABLE_TAB_1;
};

const EDIT_COL_1 = {
  span: 24,
  id: "warehouseId",
  selectLabelKey: "curWarehouseName",
  label: `${overseaLangObj.ck_lb("所属仓库")}：`,
  ...httpCurrentWarehouseSelect(),
};
const EDIT_COL_2 = {
  span: 24,
  id: "trayCount",
  label: `${overseaLangObj.tp_num || "托盘数量"}：`,
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 0,
  max: 1000,
  min: 1,
  noSlotLabel: true,
};
const EDIT_COL_3 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.bz_remark("备注说明")}：`,
  placeholder: "请输入",
  type: "textarea",
  maxlength: 1000,
};

export const customTrayDialogCols = () => {
  return {
    title: overseaLangObj.add_tp || "添加托盘",
    width: "550px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "150px" : "105px",
    simpleCustomCols: [EDIT_COL_1, EDIT_COL_2, EDIT_COL_3],
    formRules: {
      warehouseId: [
        { required: true, message: "请选择所属仓库", trigger: "change" },
      ],
      trayCount: [
        { required: true, message: "请输入托盘数量", trigger: "blur" },
      ],
    },
  };
};

const EDIT_DLG_COL_1 = {
  span: 8,
  id: "traySn",
  label: `${overseaLangObj.pallet_number("托盘号")}：`,
  type: "txt",
};
const EDIT_DLG_COL_2 = {
  span: 8,
  id: "locationSn",
  label: `${overseaLangObj.kw_location("库位")}：`,
  type: "txt",
};
const EDIT_DLG_COL_3 = {
  span: 24,
  id: "tableSlot",
  type: "slot",
  labelWidth: "0px",
};
const EDIT_DLG_COL_4 = {
  span: 8,
  id: "newTrayId",
  label: `${overseaLangObj.mb_tp || "目标托盘"}：`,
};
const EDIT_DLG_COL_5 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.bz_remark("备注信息")}：`,
  placeholder: "请输入",
  type: "textarea",
  maxlength: 500,
};

export const movingDlgFormCols = (oldTrayId) => {
  return {
    title: overseaLangObj.moving_goods("移货物"),
    width: "960px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "110px" : "80px",
    simpleCustomCols: [
      EDIT_DLG_COL_1,
      EDIT_DLG_COL_2,
      {
        ...EDIT_DLG_COL_4,
        ...httpTraySelect({ oldTrayId }),
      },
      EDIT_DLG_COL_3,
      EDIT_DLG_COL_5,
    ],
    formRules: {
      // remark: [{ required: true, message: "请输入备注信息", trigger: "blur" }],
    },
  };
};

// const TABLE_M_COL_1 = {
//   prop: "xx_m_1",
//   label: "SKU",
//   minWidth: 120,
//   showOverflowTooltip: true,
// };
// const TABLE_M_COL_2 = {
//   prop: "xx_m_2",
//   label: "产品名称",
//   minWidth: 120,
//   showOverflowTooltip: true,
// };
const TABLE_M_COL_3 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh_fn("单号"),
  minWidth: 130,
  showOverflowTooltip: true,
};
// const TABLE_M_COL_4 = {
//   prop: "xx_m_4",
//   label: "长(CM)",
//   minWidth: 90,
//   showOverflowTooltip: true,
//   align: "right",
//   decimal: 2,
// };
// const TABLE_M_COL_5 = {
//   prop: "xx_m_5",
//   label: "宽(CM)",
//   minWidth: 90,
//   showOverflowTooltip: true,
//   align: "right",
//   decimal: 2,
// };
// const TABLE_M_COL_6 = {
//   prop: "xx_m_6",
//   label: "高(CM)",
//   minWidth: 90,
//   showOverflowTooltip: true,
//   align: "right",
//   decimal: 2,
// };
// const TABLE_M_COL_7 = {
//   prop: "xx_m_7",
//   label: "立方(CBM)",
//   minWidth: 100,
//   showOverflowTooltip: true,
//   align: "right",
//   decimal: 2,
// };
// const TABLE_M_COL_8 = {
//   prop: "xx_m_8",
//   label: "商品毛重(KG)",
//   minWidth: 100,
//   showOverflowTooltip: true,
//   align: "right",
//   decimal: 2,
// };
const TABLE_M_COL_9 = {
  prop: "totalNum",
  label: overseaLangObj.tp_total_num || "总数量",
  width: 90,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const TABLE_M_COL_10 = {
  prop: "movingNum",
  label: overseaLangObj.yd_sl || "移动数量",
  minWidth: 130,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
  customRow: true,
};
const TABLE_M_COL_11 = {
  prop: "optNum",
  label: overseaLangObj.cz_num || "操作数量",
  width: 110,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const TABLE_M_COL_12 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_M_COL_13 = {
  prop: "sku",
  label: "SKU",
  minWidth: 120,
  showOverflowTooltip: true,
};
export const tableMovingColumns = () => {
  return [
    TABLE_COL_0,
    TABLE_M_COL_3,
    TABLE_M_COL_12,
    TABLE_M_COL_13,
    TABLE_M_COL_9,
    TABLE_M_COL_11,
    TABLE_M_COL_10,
  ];
};
