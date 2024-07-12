import { toFixedNum } from "@/utils/instructions";
import {
  httpProductSkuSelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import { httpTraySelect } from "@/comModel/warehouse";
import { httpPushLocationSelect } from "@/views/warehouseManage/predictionManage/receiving/components/batchGrounding/model.js";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "入库时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "trackSn",
  label: "包裹跟踪号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "kuwei",
  label: "库位：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "stateList",
  label: "状态：",
  placeholder: "状态(多选)",
  type: "select",
  multiple: true,
  basicType: "claimOrderState",
};

export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_COL_1, SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_4],
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
  align: "center",
};
const TABLE_COL_1 = {
  prop: "trackSn",
  label: "包裹跟踪号",
  columnLink: true,
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "warehousingTime",
  label: "入库日期",
  minWidth: 120,
  // sortable: true,
};
const TABLE_COL_3 = {
  prop: "traySn",
  label: "托盘号",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "kw",
  label: "库位",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
  render: (r) => `${r.kq || "--"}${r.kw || ""}`,
};
const TABLE_COL_5 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "claimUserName",
  label: "认领人",
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "state",
  label: "状态",
  dotColor: true,
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
  basicType: "claimOrderState",
};
const TABLE_COL_8 = {
  prop: "claimTime",
  label: "认领时间",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "createUserName",
  label: "创建人",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
};

export const tableColumns = () => {
  return [
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_8,
    TABLE_COL_7,
    TABLE_COL_9,
    {
      ...TABLE_COL_99,
      fixed: "right",
      width: 135,
    },
  ];
};

const EDIT_PAGE_COL_1 = {
  span: 6,
  id: "trackSn",
  label: "包裹跟踪号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_PAGE_COL_2 = {
  span: 6,
  id: "trayId",
  label: "暂存托盘：",
  ...httpTraySelect({ storageMode: "0" }), // 默认SKU存仓
  selectLabelKey: "traySn",
  type: "slot",
};
const EDIT_PAGE_COL_3 = {
  span: 6,
  id: "kwId",
  label: "暂存库位：",
  ...httpPushLocationSelect(),
  selectLabelKey: "kqKw",
  type: "slot",
};
const EDIT_PAGE_COL_4 = {
  span: 6,
  id: "warehousingTime",
  label: "入库时间：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_PAGE_COL_5 = {
  span: 6,
  id: "packageType",
  label: "类型：",
  type: "select",
  placeholder: "请选择",
  basicType: "packageType",
};
export const unEditPageFormCols = (tDisable = false) => {
  return {
    columns: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...EDIT_PAGE_COL_1,
                    disable: tDisable,
                  },
                  EDIT_PAGE_COL_2,
                  EDIT_PAGE_COL_3,
                  EDIT_PAGE_COL_4,
                  EDIT_PAGE_COL_5,
                  {
                    span: 24,
                    id: "tableData",
                    labelWidth: "0",
                    type: "slot",
                  },
                  {
                    span: 24,
                    id: "remark",
                    label: "退仓备注：",
                    placeholder: "请输入",
                    type: "textarea",
                    maxlength: 200,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      trackSn: [
        { required: true, message: "请填写包裹跟踪号", trigger: "blur" },
      ],
      warehousingTime: [
        { required: true, message: "请选择入库时间", trigger: "change" },
      ],
      packageType: [
        { required: true, message: "请选择类型", trigger: "change" },
      ],
    },
  };
};

const DETAIL_PAGE_TABLE_COL_1 = {
  prop: "sku",
  label: "SKU",
  minWidth: 130,
  showOverflowTooltip: true,
  fieldItem: {
    id: "cpmId",
    size: "mini",
    selectLabelKey: "sku",
    placeholder: "产品SKU",
    selectEmitItem: true,
    ...httpProductSkuSelect(),
  },
};
const DETAIL_PAGE_TABLE_COL_2 = {
  prop: "customsCode",
  label: "平台编码",
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_PAGE_TABLE_COL_3 = {
  prop: "productNameCn",
  label: "产品名称(CN)",
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_PAGE_TABLE_COL_4 = {
  prop: "length",
  label: "产品长宽高(CM)",
  minWidth: 130,
  showOverflowTooltip: true,
  render: (r) =>
    `${toFixedNum(r.singleLength)}*${toFixedNum(r.singleWidth)}*${toFixedNum(
      r.singleHeight
    )}`,
};
const DETAIL_PAGE_TABLE_COL_5 = {
  prop: "num",
  label: "收货数量",
  minWidth: 130,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const DETAIL_PAGE_TABLE_COL_6 = {
  prop: "remark",
  label: "备注",
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_PAGE_TABLE_COL_7 = {
  prop: "attachList",
  label: "图片",
  width: 220,
  customRow: true,
  editCellKeyName: "temp_secondId",
  isEditEasyCell: true,
  fieldItem: {
    type: "attachList",
    editUploadKey: "rBtnUpdate",
  },
};
export const editPageTableColumns = (isSee) => {
  return [
    TABLE_COL_0,
    {
      ...DETAIL_PAGE_TABLE_COL_1,
      customRow: !isSee,
    },
    DETAIL_PAGE_TABLE_COL_2,
    DETAIL_PAGE_TABLE_COL_3,
    DETAIL_PAGE_TABLE_COL_4,
    {
      ...DETAIL_PAGE_TABLE_COL_5,
      customRow: !isSee,
      request: !isSee,
    },
    {
      ...DETAIL_PAGE_TABLE_COL_6,
      customRow: !isSee,
    },
    {
      ...DETAIL_PAGE_TABLE_COL_7,
      request: !isSee,
    },
    ...(isSee
      ? []
      : [
          {
            ...TABLE_COL_99,
            width: 110,
          },
        ]),
  ];
};

export const detailFromCols = () => {
  const DETAIL_COL_FROM = [
    {
      span: 8,
      id: "trackSn",
      label: "包裹跟踪号：",
      type: "txt",
      txtTagArr: [
        {
          basicTypeVal: "state",
          basicType: "claimOrderState",
        },
      ],
    },
    {
      span: 8,
      id: "claimCustomerShortName",
      label: "客户信息：",
      type: "txt",
    },
    {
      span: 8,
      id: "warehousingTime",
      label: "入库时间：",
      type: "txt",
    },
    {
      span: 8,
      id: "kqKw",
      label: "暂存库位：",
      type: "txt",
    },
    {
      span: 8,
      id: "packageType",
      label: "类型：",
      type: "txt",
      basicType: "packageType",
    },
    {
      span: 8,
      id: "claimTime",
      label: "认领时间：",
      type: "txt",
    },
    {
      span: 8,
      id: "traySn",
      label: "托盘号：",
      type: "txt",
    },
    {
      span: 8,
      id: "belongBusinessSn",
      label: "关联退仓单：",
      type: "txt",
    },
    {
      span: 24,
      id: "remark",
      label: "退仓备注：",
      type: "txt",
      textLineClamp: 3,
    },
    {
      span: 24,
      id: "tableData",
      labelWidth: "0",
      type: "slot",
    },
  ];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: DETAIL_COL_FROM,
            },
          ],
        },
      ],
    },
  ];
};

// const EDIT_DLG_COL_TXT = (
//   txtObj = {
//     span: 12,
//     id: "tpbh",
//     label: "产品SKU：",
//   }
// ) => {
//   return {
//     ...txtObj,
//     placeholder: "--",
//     type: "txt",
//   };
// };
// const EDIT_DLG_COL_2 = {
//   span: 24,
//   id: "customerId",
//   label: "关联客户：",
//   placeholder: "此处选择关联客户",
//   ...httpCustomerSelect(),
// };
// const EDIT_DLG_FORM_COLS_1 = {
//   columns: [EDIT_DLG_COL_2],
//   formRules: {
//     customerId: [
//       { required: true, message: "请选择关联客户", trigger: "change" },
//     ],
//   },
// };

// const EDIT_DLG_2_COL_2 = {
//   span: 24,
//   id: "hsCode",
//   label: "HS CODE：",
//   placeholder: "--",
//   type: "txt",
// };

// const EDIT_DLG_2_COL_3 = EDIT_DLG_COL_TXT({
//   span: 24,
//   id: "productNameCn",
//   label: "产品名称(CN)：",
// });
// const EDIT_DLG_2_COL_4 = EDIT_DLG_COL_TXT({
//   span: 24,
//   id: "length",
//   label: "产品长宽高：",
//   render: (row) =>
//     `${toFixedNum(row.length)} * ${toFixedNum(row.width)} * ${toFixedNum(
//       row.height
//     )}`,
// });
// const EDIT_DLG_2_COL_5 = {
//   span: 24,
//   id: "takeFreightNum",
//   label: "收货数：",
//   placeholder: "收货数",
//   type: "slot",
// };

// export const editDlgFormCols = (mode_type = 0, Fn) => {
//   const EDIT_DLG_2_COL_1 = {
//     span: 24,
//     id: "product_obj",
//     label: "产品SKU：",
//     placeholder: "产品SKU",
//     ...httpProductSkuSelect(),
//     isBackAll: true,
//     handle: (val) => {
//       Fn && Fn(val);
//     },
//   };
//   const EDIT_DLG_FORM_COLS_2 = {
//     columns: [
//       EDIT_DLG_2_COL_1,
//       EDIT_DLG_2_COL_2,
//       EDIT_DLG_2_COL_3,
//       EDIT_DLG_2_COL_4,
//       EDIT_DLG_2_COL_5,
//     ],
//     formRules: {
//       product_obj: [
//         { required: true, message: "请选择产品SKU", trigger: "change" },
//       ],
//       takeFreightNum: [
//         { required: true, message: "请填写收货数", trigger: "blur" },
//       ],
//     },
//   };
//   return [EDIT_DLG_FORM_COLS_1, EDIT_DLG_FORM_COLS_2][mode_type];
// };
