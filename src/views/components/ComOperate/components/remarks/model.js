import overseaLangObj from "@/language/overseasLang.js";

const FORM_COL_1 = {
  span: 24,
  id: "customerRemark",
  label: "客户备注：",
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
};
const FORM_COL_2 = {
  ...FORM_COL_1,
  id: "orderRemark",
  label: `${overseaLangObj.order_remark || "订单备注"}：`,
};
const FORM_COL_3 = {
  ...FORM_COL_1,
  id: "businessRemark",
  label: `${overseaLangObj.yw_remark || "业务备注"}：`,
};
const FORM_COL_4 = {
  span: 24,
  id: "operationRemark",
  label: `${overseaLangObj.cz_remark || "操作备注"}：`,
  placeholder: "请输入",
  type: "textarea",
  rows: 5,
};
const FORM_COLS_1 = (isMainBill) => [
  ...(isMainBill !== 5 ? [FORM_COL_1, FORM_COL_2] : []),
  FORM_COL_3,
  FORM_COL_4,
];

const FORM_COL_201 = {
  ...FORM_COL_1,
  id: "remark",
  label: `${overseaLangObj.jj_bz || "交接备注"}：`,
  render: (r) => r.secondInstanceRemark || r.remark || "--",
};
const FORM_COL_202 = {
  ...FORM_COL_1,
  id: "boxRemark",
  label: `${overseaLangObj.yj_tcg_bz || "预计提拆柜备注"}：`,
};
const FORM_COL_203 = {
  ...FORM_COL_4,
  id: "customsClearanceRemark",
  label: `${overseaLangObj.qg_bz || "清关备注"}：`,
};
const FORM_COLS_201 = [FORM_COL_201, FORM_COL_202, FORM_COL_203];

const FORM_COL_301 = {
  ...FORM_COL_1,
  id: "remark",
  label: `${overseaLangObj.rc_bc_sm || "入仓补充说明"}：`,
};
const FORM_COL_302 = {
  ...FORM_COL_1,
  id: "businessRemark",
  label: `${overseaLangObj.yw_remark || "业务备注"}：`,
};
const FORM_COL_303 = {
  ...FORM_COL_4,
  id: "operationOrderRemark",
  label: `${overseaLangObj.cz_remark || "操作备注"}：`,
};
const FORM_COLS_301 = [FORM_COL_301, FORM_COL_302, FORM_COL_303];

const FORM_COL_401 = {
  ...FORM_COL_1,
  id: "remark",
  label: `${overseaLangObj.order_remark || "订单备注"}：`,
};
const FORM_COL_402 = {
  ...FORM_COL_1,
  id: "businessRemark",
  label: `${overseaLangObj.yw_remark || "业务备注"}：`,
};
const FORM_COL_403 = {
  ...FORM_COL_4,
  id: "operationOrderRemark",
  label: `${overseaLangObj.cz_remark || "操作备注"}：`,
};
const FORM_COLS_401 = [FORM_COL_401, FORM_COL_402, FORM_COL_403];

export const formRemarksCols = (obj) => {
  const {
    colsKey = "operation",
    isOperationWarehouseRemark,
    isMainBill,
  } = obj || {};
  const colsObj = {
    operation: FORM_COLS_1(isMainBill), // 操作单详情备注
    customs: FORM_COLS_201, // 清关详情备注
    operationReceiving: FORM_COLS_301, // 操作单第三方入库详情备注
    warehouseReceiving: [
      FORM_COL_301,
      FORM_COL_302,
      ...(isOperationWarehouseRemark
        ? [
            {
              ...FORM_COL_1,
              id: "operationOrderRemark",
              label: `${overseaLangObj.cz_remark || "操作备注"}：`, // 直接客户没有
            },
          ]
        : []),
      {
        ...FORM_COL_4,
        id: "warehouseOrderRemark",
        label: `${overseaLangObj.ck_remark || "仓库备注"}：`,
      },
    ], // 仓库管理第三方入库详情备注
    webOperationOutbound: FORM_COLS_401, // 操作单 FBA / 一件代发 出库详情备注
    webWarehouseOutbound: [
      FORM_COL_401,
      FORM_COL_402,
      ...(isOperationWarehouseRemark
        ? [
            {
              ...FORM_COL_1,
              id: "operationOrderRemark",
              label: `${overseaLangObj.cz_remark || "操作备注"}：`, // 直接客户没有
            },
          ]
        : []),
      {
        ...FORM_COL_4,
        id: "warehouseOrderRemark",
        label: `${overseaLangObj.ck_remark || "仓库备注"}：`,
        maxlength: 500,
      },
    ], // 仓库管理 FBA / 一件代发 出库详情备注
    tc_operate: [
      FORM_COL_401,
      FORM_COL_3,
      {
        ...FORM_COL_4,
        id: "operateRemark",
      },
    ], // wms退仓操作详情备注
    tc_warehouse: [
      FORM_COL_401,
      FORM_COL_3,
      {
        ...FORM_COL_1,
        id: "operateRemark",
        label: `${overseaLangObj.cz_remark || "操作备注"}：`,
      },
      {
        ...FORM_COL_4,
        id: "wmsRemark",
        label: `${overseaLangObj.ck_remark || "仓库备注"}：`,
      },
    ], // wms退仓操作详情备注
  };
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: colsObj[colsKey],
            },
          ],
        },
      ],
    },
  ];
};

const FORMDIALOG_COLS_1 = {
  span: 24,
  id: "businessConfig",
  label: "业务配置：",
  type: "select",
  clearable: false,
  basicType: "clearanceConfig",
};
const FORMDIALOG_COLS_2 = {
  span: 24,
  id: "businessConfigtType",
  type: "slot",
  labelWidth: "15px",
};
export const customDialogCols = (row = {}) => {
  const { orderType } = row;
  return {
    title: "业务配置",
    width: "500px",
    labelWidth: "80px",
    simpleCustomCols: [
      {
        ...FORMDIALOG_COLS_1,
        disabled: orderType != 2, //非电商直接置灰
      },
      FORMDIALOG_COLS_2,
    ],
    formRules: {
      // xx_502: [
      //   { required: true, message: `请输入库存`, trigger: "blur" }
      // ]
    },
  };
};

export const businessTypeLists = [
  {
    title: "海外清关",
    showType: ["1", "2", "3"],
    chilren: [
      {
        label: "清关登记",
      },
      {
        label: "清关放行",
      },
    ],
  },
  {
    title: "整柜入仓",
    showType: ["1"],
    chilren: [
      {
        label: "预计提拆柜",
      },
      {
        label: "实际提拆柜",
      },
    ],
  },
  {
    title: "存仓入库",
    showType: ["1"],
    chilren: [
      {
        label: "入仓登记",
      },
      {
        label: "收货完成",
      },
      {
        label: "上架完成",
      },
    ],
  },
  {
    title: "派送",
    showType: ["2"],
    chilren: [
      {
        label: "预约派送",
      },
      {
        label: "实际派送",
      },
      {
        label: "上传POD",
      },
    ],
  },
  // {
  //   title:'客户自提',
  //   showType:['3'],
  //   chilren:[
  //     {
  //       label:"自提登记"
  //     },
  //   ]
  // }
];
