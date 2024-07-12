import overseaLangObj from "@/language/overseasLang.js";
import { httpCustomerSelect } from "@/comModel/httpSelect";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.yb_time || "预报时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "orderSns",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "labelingTypeList",
  label: `单位：`,
  placeholder: "单位（多选）",
  type: "select",
  multiple: true,
  basicType: "outboundLabelingType",
};
const SEARCH_COL_4 = {
  id: "customerId",
  label: `${overseaLangObj.kh_customer_name || "客户名称"}：`,
  ...httpCustomerSelect(),
};
const SEARCH_COL_5 = {
  id: "orderType",
  label: `${overseaLangObj.yw_type || "业务类型"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "outboundOrderType",
};

export const searchColumns = (idx) => {
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
                SEARCH_COL_4,
                SEARCH_COL_5,
                SEARCH_COL_3,
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
  align: "center",
  width: 50,
  // fixed: 'left'
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  // fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  // columnLink: true,
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "orderType",
  label: overseaLangObj.yw_type || "业务类型",
  minWidth: 100,
  // sortable: true,
  basicType: "outboundOrderType",
};
const TABLE_COL_3 = {
  prop: "xx_c_3",
  label: "派送方式",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "labelingType",
  label: "单位",
  minWidth: 90,
  showOverflowTooltip: true,
  basicType: "outboundLabelingType",
};
const TABLE_COL_5 = {
  prop: "labelingNumOfGoods",
  label: "贴标数量", // overseaLangObj.wx_tbs || "外箱贴标数",
  minWidth: 110,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "totalLabelingNum",
  label: "合计",
  minWidth: 110,
  // sortable: true,
};
const TABLE_COL_7 = {
  prop: "labelingNumOfUnit",
  label: "每单位贴标数量", // overseaLangObj.sku_tbs || "SKU贴标数",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "isSort",
  label: overseaLangObj.in_order || "按顺序",
  minWidth: 100,
  // sortable: true,
  render: (row) =>
    row.isSort == 0 ? overseaLangObj.s_correct : overseaLangObj.f_deny,
};
const TABLE_COL_9 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "forecastTime",
  label: overseaLangObj.yb_time || "预报时间",
  width: "136px",
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "finishTime",
  label: "处理时间",
  width: "136px",
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "status",
  label: overseaLangObj.zt_status || "状态",
  width: 80,
  showOverflowTooltip: true,
  dotColor: true,
  // sortable: true,
  basicType: "outboundStatus",
};
const TABLE_COL_13 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "goodsName",
  label: "SKU/箱号",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "labelingTime",
  label: overseaLangObj.wj_time || "完结时间",
  width: "136px",
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  // fixed: "right",
  width: 80,
};

export const tableColumns = (tab = 0) => {
  return [
    ...(tab === 0 ? [TABLE_COL_SELECTION] : []),
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_COL_14,
    TABLE_COL_2,
    // TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_7,
    TABLE_COL_6,
    TABLE_COL_10,
    ...(tab === 0 ? [] : [TABLE_COL_15]),
    TABLE_COL_13,
    TABLE_COL_9,
    ...(tab === 0 ? [TABLE_COL_12, TABLE_COL_99] : []),
  ];
};

const EDIT_DLG_COL_1 = {
  span: 24,
  id: "markStatus",
  label: `${overseaLangObj.gz_dh_fn("关联工作单号：")}：`,
  type: "slot",
  basicType: "labelingBusinessType",
};
const EDIT_DLG_COL_2 = {
  span: 24,
  id: "createNickName",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  type: "txt",
};
const EDIT_DLG_COL_3 = {
  span: 24,
  id: "quantity",
  label: `${overseaLangObj.xs_total || "箱数"}：`,
  type: "txt",
};
const EDIT_DLG_COL_4 = {
  span: 24,
  id: "skus",
  label: "SKU数：",
  placeholder: "--",
  type: "txt",
};
const EDIT_DLG_COL_5 = {
  span: 24,
  id: "stickerType",
  label: `${overseaLangObj.tb_type || "贴标类型"}：`,
  type: "radio",
  basicType: "warehouseLabelType",
  disable: true,
  noSlotLabel: true,
  // hideList: [-1]
};
const EDIT_DLG_COL_6 = {
  span: 24,
  id: "stickerCarton",
  orderKey: "isSort",
  label: `${overseaLangObj.wx_labeling || "外箱贴标"}：`,
  placeholder: "外箱贴标总数",
  type: "slot",
};
const EDIT_DLG_COL_7 = {
  span: 24,
  id: "stickerSku",
  orderKey: "isSort",
  label: `${overseaLangObj.sku_labeling || "SKU贴标"}：`,
  placeholder: "产品贴标总数",
  type: "slot",
};
const EDIT_DLG_COL_8 = {
  span: 24,
  id: "bzxx",
  label: "备注信息：",
  type: "textarea",
};
const EDIT_DLG_COL_9 = {
  span: 24,
  id: "attachId",
  labelWidth: "0px",
  type: "customUploadFile",
};
const EDIT_DLG_FORM_COLS = {
  columns: [
    EDIT_DLG_COL_1,
    EDIT_DLG_COL_2,
    EDIT_DLG_COL_3,
    // EDIT_DLG_COL_4,
    EDIT_DLG_COL_5,
    EDIT_DLG_COL_6,
    EDIT_DLG_COL_7,
    // EDIT_DLG_COL_8,
    // EDIT_DLG_COL_9
  ],
  formRules: {
    stickerType: [
      { required: true, message: "请选择贴标类型", trigger: "change" },
    ],
    stickerCarton: [
      { required: true, message: "请输入外箱贴标", trigger: "blur" },
    ],
    stickerSku: [{ required: true, message: "请输入SKU贴标", trigger: "blur" }],
  },
};

const SEE_DLG_FORM_COLS = {
  columns: [
    {
      ...EDIT_DLG_COL_5,
      disable: true,
      span: 12,
    },
    {
      ...EDIT_DLG_COL_6,
      disable: true,
      span: 12,
    },
    {
      ...EDIT_DLG_COL_7,
      disable: true,
      span: 12,
    },
    // {
    //   ...EDIT_DLG_COL_8,
    //   type: "txt"
    // },
    {
      ...EDIT_DLG_COL_9,
      disable: true,
    },
  ],
  formRules: {},
};

export const editDlgFormCols = (mode_type = 0) => {
  return [EDIT_DLG_FORM_COLS, SEE_DLG_FORM_COLS][mode_type];
};
