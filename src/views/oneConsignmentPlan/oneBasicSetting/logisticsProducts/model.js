import {
  httpUserSelect,
  httpPOSTApiConfigGetPage,
} from "@/comModel/httpSelect";
import {
  httpLogisticsChannelListSelect,
  httpWarehousePublicSelect,
} from "@/comModel/warehouse";
import { logisticsProductList } from "@/api/warehouse/basic";
import { toFixedNum } from "@/utils/instructions";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "codeLike",
  label: "产品代码：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "nameLike",
  label: "产品名称：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "logisticsChannelId",
  label: "物流渠道：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
};
const SEARCH_COL_5 = {
  id: "xx_search_5",
  label: "方案编码：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  id: "transportMethodEq",
  label: "出库方式：",
  type: "select",
  placeholder: "请选择",
  basicType: "transportMethod",
};
const SEARCH_COL_7 = {
  id: "stateIn",
  label: "状态：",
  type: "select",
  placeholder: "请选择",
  basicType: "status",
};
const SEARCH_COL_8 = {
  id: "createUserIdEq",
  label: "创建人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};

export const searchColumns = () => {
  const SEARCH_COLS_1 = [
    SEARCH_COL_1,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4,
    // SEARCH_COL_5,
    SEARCH_COL_6,
    SEARCH_COL_7,
    SEARCH_COL_8,
  ];
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_COLS_1,
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
  prop: "code",
  label: "产品代码",
  columnLink: true,
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "nameCn",
  label: "产品名称(CN)",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "nameEn",
  label: "产品名称(EN)",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "logisticsChannelName",
  label: "物流渠道",
  minWidth: 110,
  // sortable: true,
  showOverflowTooltip: true,
  // basicType: "out_warehouse_way"
};
const TABLE_COL_5 = {
  prop: "apiName",
  label: "API服务",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "billingMode",
  label: "渠道模式",
  minWidth: 140,
  // sortable: true,
  fontColor: true,
  showOverflowTooltip: true,
  basicType: "logisticsProductBillingMode",
};
const TABLE_COL_7 = {
  prop: "transportMethod",
  label: "运输方式",
  minWidth: 100,
  // sortable: true,
  showOverflowTooltip: true,
  basicType: "transportMethod",
};
const TABLE_COL_8 = {
  prop: "publicSales",
  label: "公开销售",
  width: 75,
  // sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_9 = {
  prop: "remoteVerification",
  label: "是否偏远",
  width: 75,
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_10 = {
  prop: "traceable",
  label: "可追踪",
  width: 65,
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_11 = {
  prop: "insuranceService",
  label: "保险服务",
  width: 75,
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_12 = {
  prop: "signatureService",
  label: "签名服务",
  width: 75,
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_13 = {
  prop: "computeUnit",
  label: "计价单位",
  minWidth: 75,
  // sortable: true,
  showOverflowTooltip: true,
  basicType: "computeUnit",
};
const TABLE_COL_14 = {
  prop: "computeBegin",
  label: "计价区间",
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
  render: (r) =>
    r.computeBegin || r.computeBegin === 0
      ? `${toFixedNum(r.computeBegin, 3)} ~ ${toFixedNum(r.computeEnd, 3)}`
      : "--",
};
const TABLE_COL_15 = {
  prop: "bindCustomerWarehouseName",
  label: "绑定仓库",
  minWidth: 145,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "state",
  label: "状态",
  dotColor: true,
  sortable: true,
  width: 80,
  basicType: "status",
};
const TABLE_COL_17 = {
  prop: "createUserName",
  label: "创建人",
  sortable: true,
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_19 = {
  prop: "retoureService",
  label: "退件服务",
  width: 75,
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: "136px",
};

const TABLE_COLS_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  // TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_19,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  // TABLE_COL_13,
  // TABLE_COL_14,
  // TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_99,
];

export const tableColumns = () => {
  return TABLE_COLS_1;
};

const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};

const EDIT_DLG_COL_1 = {
  span: 8,
  id: "code",
  label: "产品代码：",
  placeholder: "请输入",
  type: "text",
  maxlength: 20,
};
const EDIT_DLG_COL_2 = {
  span: 8,
  id: "nameCn",
  label: "产品名称(CN)：",
  placeholder: "请输入",
  type: "text",
  maxlength: 20,
};
const EDIT_DLG_COL_3 = {
  span: 8,
  id: "nameEn",
  label: "产品名称(EN)：",
  placeholder: "请输入",
  type: "text",
  maxlength: 30,
};
const EDIT_DLG_COL_4 = {
  span: 8,
  id: "transportMethod",
  label: "运输方式：",
  placeholder: "请选择",
  type: "radio",
  basicType: "transportMethod",
  hideList: [4],
};
const EDIT_DLG_COL_5 = {
  span: 8,
  id: "trackQueryWebsite",
  label: "轨迹查询网站：",
  placeholder: "请输入",
  type: "text",
  maxlength: 100,
};
const EDIT_DLG_COL_6 = {
  span: 4,
  id: "publicSales",
  label: "公开销售：",
  type: "singleCheckbox",
  // basicType: "trueOrFalse",
  // dicsStr: "web_whether_not",
  // customDicsArr: [0, 1],
};
const EDIT_DLG_COL_7 = {
  span: 16,
  id: "bindCustomerWarehouseList",
  label: "绑定客户仓库：",
  placeholder: "请选择客户仓库（支持多选）",
  multiple: true,
  ...httpWarehousePublicSelect(),
  searchIdKey: "sParentMultipleIds",
};
const EDIT_DLG_COL_8 = {
  span: 21,
  id: "bindFbaList",
  label: "绑定FBA：",
  placeholder: "请选择FBA仓库（支持多选）",
  multiple: true,
  ...httpWarehousePublicSelect({ typeList: "0,1,2,3" }),
  searchIdKey: "sParentMultipleIds",
  type: "slot",
};
const EDIT_DLG_COL_9 = {
  span: 3,
  id: "bindAllFba",
  text: "全选",
  type: "singleCheckbox",
  labelWidth: "0px",
};

export const EDIT_KEY_ARR = [
  "id",
  "code",
  "nameCn",
  "nameEn",
  "transportMethod",
  "trackQueryWebsite",
  "publicSales",
  "bindCustomerWarehouseList",
  "bindFbaList",
  "bindAllFba",
  "apiId",
];
export const editDlgFormCols = (isSee) => {
  const EDIT_DLG_FORM_COLS_1 = [
    EDIT_DLG_COL_1,
    EDIT_DLG_COL_2,
    EDIT_DLG_COL_3,
    EDIT_DLG_COL_4,
    EDIT_DLG_COL_5,
  ];
  const SEE_DLG_FORM_COLS_1 = EDIT_DLG_FORM_COLS_1.map((e) => {
    return {
      ...e,
      placeholder: "--",
      type: "txt",
    };
  });
  const SEE_DLG_COL_7 = {
    span: 16,
    id: "bindCustomerWarehouseName",
    label: "绑定客户仓库：",
    type: "txt",
  };
  const SEE_DLG_COL_8 = {
    span: 21,
    id: "bindFbaName",
    label: "绑定FBA：",
    type: "txt",
  };
  const EDIT_DLG_FORM_COLS_2 = isSee ? [SEE_DLG_COL_8] : [EDIT_DLG_COL_8];
  const EDIT_DLG_FORM_COLS_3 = isSee ? [SEE_DLG_COL_113] : [EDIT_DLG_COL_113];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...(isSee ? SEE_DLG_FORM_COLS_1 : EDIT_DLG_FORM_COLS_1),
                {
                  ...EDIT_DLG_COL_6,
                  disable: isSee,
                },
                ...EDIT_DLG_FORM_COLS_2,
                {
                  ...EDIT_DLG_COL_9,
                  disabled: isSee,
                },
                ...EDIT_DLG_FORM_COLS_3,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const dlgFormRules = (isSee) => {
  return isSee
    ? {}
    : {
        code: [
          { required: true, message: "请输入", trigger: "blur" },
          txtRules,
        ],
        nameCn: [
          { required: true, message: "请输入产品名称(CN)", trigger: "blur" },
        ],
        nameEn: [
          { required: true, message: "请输入产品名称(EN)", trigger: "blur" },
          txtRules,
        ],
        transportMethod: [
          { required: true, message: "请选择运输方式", trigger: "change" },
        ],
        publicSales: [
          { required: true, message: "请选择公开销售", trigger: "change" },
        ],
      };
};

const EDIT_DLG_COL_101 = {
  span: 9,
  id: "logisticsChannelId",
  selectLabelKey: "logisticsChannelName",
  label: "物流渠道：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
};
const EDIT_DLG_COL_102 = {
  span: 5,
  id: "computeUnit",
  label: "计算单位：",
  type: "radio",
  basicType: "computeUnit",
};
const EDIT_DLG_COL_103 = {
  span: 10,
  id: "startEndMoney",
  startId: "computeBegin",
  endId: "computeEnd",
  label: "计算区间：",
  startPlaceholder: "计算区间≤",
  endPlaceholder: "≤计算区间",
  type: "rangeSelect",
  numDecimal: 3,
};
const EDIT_DLG_COL_104 = {
  span: 9,
  id: "minFreightEfficiency",
  label: "货运最低时效：",
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 3,
};
const EDIT_DLG_COL_105 = {
  span: 12,
  id: "billingWeight",
  label: "计费重：",
  placeholder: "请选择",
  type: "select",
  basicType: "logisticsBilling",
};
const EDIT_DLG_COL_106 = {
  span: 3,
  id: "calculatePackMaterials",
  text: "计算包材",
  type: "singleCheckbox",
  labelWidth: "0px",
};
const EDIT_DLG_COL_107 = {
  span: 9,
  id: "optimalFreightEfficiency",
  label: "货运最佳时效：",
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 3,
};
const EDIT_DLG_COL_108 = {
  span: 15,
  id: "fbaBillingWeight",
  label: "FBA计费重：",
  placeholder: "请选择",
  type: "select",
  basicType: "logisticsBilling",
};
const EDIT_DLG_COL_109 = {
  span: 6,
  id: "returnFreightType",
  label: "服务商退件运费：",
  placeholder: "请选择",
  type: "select",
  fontTxtColor: "#63a103",
  basicType: "returnFreightType",
};
const EDIT_DLG_COL_110 = {
  span: 3,
  id: "returnFreightValue",
  labelWidth: "0px",
  placeholder: "金额",
  type: "inputNumber",
  numDecimal: 3,
};
const EDIT_DLG_COL_111 = {
  span: 15,
  id: "presetPackMaterials",
  label: "预设包材：",
  placeholder: "请输入",
  type: "text",
  maxlength: 50,
};
const EDIT_DLG_COL_SLOT = {
  //站位用
  span: 8,
  type: "slot",
};
const EDIT_DLG_COL_OPTIONS = [
  {
    label: "验证偏远",
    value: "remoteVerification",
  },
  {
    label: "可追踪",
    value: "traceable",
  },
  {
    label: "量体积",
    value: "measureVolume",
  },
  {
    label: "信封",
    value: "envelope",
  },
  {
    label: "签名服务",
    value: "signatureService",
  },
  {
    label: "保险服务",
    value: "insuranceService",
  },
  {
    label: "是否上传标签",
    value: "uploadLabel",
  },
  {
    label: "验证标签",
    value: "verifyLabel",
  },
  {
    label: "是否忽略地址",
    value: "ignoreAddress",
  },
  {
    label: "不含电",
    value: "nonElectric",
  },
  {
    label: "按规则收费",
    value: "chargedByRule",
  },
  {
    label: "VAT税号",
    value: "vatNumber",
  },
  {
    label: "年龄验证服务",
    value: "ageVerifyService",
  },
  {
    label: "FBA量体积",
    value: "fbaMeasureVolume",
  },
  {
    label: "默认保险服务",
    value: "defaultInsuranceService",
  },
  {
    label: "自提",
    value: "selfPickup",
  },
  {
    label: "地址校验前置",
    value: "preAddressVerify",
  },
  {
    label: "退件服务",
    value: "retoureService",
  },
];
export const otherServicesOptions = EDIT_DLG_COL_OPTIONS.map((e) => e.value);
const EDIT_DLG_COL_112 = {
  span: 24,
  id: "otherServicesChecks",
  label: "其他服务：",
  type: "multiCheckbox",
  options: EDIT_DLG_COL_OPTIONS,
};
const EDIT_DLG_COL_113 = {
  span: 8,
  id: "apiId",
  label: "api服务：",
  ...httpPOSTApiConfigGetPage({
    apiType: 1,
  }),
  type: "slot",
};
const SEE_DLG_COL_113 = {
  span: 8,
  id: "apiName",
  label: "api服务：",
  type: "txt",
};
const EDIT_DLG_COL_201 = {
  span: 21,
  id: "priceCompareRules",
  label: "比价规则：",
  placeholder: "请选择",
  type: "select",
};
const EDIT_DLG_COL_202 = {
  span: 3,
  id: "isTracking",
  text: "isTracking",
  type: "singleCheckbox",
  labelWidth: "0px",
};
const EDIT_DLG_COL_203 = {
  span: 24,
  id: "logisticsProductIdList",
  label: "物流产品：",
  multiple: true,
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
  }),
  searchIdKey: "idList",
  // type: "multiCheckbox",
  // basicType: "status",
};

const EDIT_DLG_COL_303 = {
  span: 3,
  id: "measureVolume",
  text: "量体积",
  type: "singleCheckbox",
  labelWidth: "0px",
};
const EDIT_DLG_COL_304 = {
  span: 3,
  id: "fbaMeasureVolume",
  text: "FBA量体积",
  type: "singleCheckbox",
  labelWidth: "0px",
};
const EDIT_DLG_COL_307 = {
  span: 24,
  id: "logisticsChannelIdList",
  label: "物流渠道：",
  multiple: true,
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
  searchIdKey: "idList",
};

const SEE_DLG_COL_101 = {
  span: 9,
  id: "logisticsChannelName",
  label: "服务商渠道：",
  type: "txt",
  render: (row = {}) => {
    const { WEBProductName, logisticsChannelName } = row;
    return `${WEBProductName}${
      logisticsChannelName ? `[${logisticsChannelName}]` : ""
    }`;
  },
};
const SEE_DLG_COL_103 = {
  span: 10,
  id: "computeBegin",
  label: "计算区间：",
  type: "txt",
  render: (r) =>
    `${toFixedNum(r.computeBegin, 3)} ~ ${toFixedNum(r.computeEnd, 3)}`,
};
const SEE_DLG_COL_203 = {
  span: 24,
  id: "logisticsProductName",
  label: "物流产品：",
  type: "txt",
};
const SEE_DLG_COL_307 = {
  span: 24,
  id: "logisticsChannelName",
  label: "物流渠道：",
  type: "txt",
};

export const SAVE_TAB_KEY_ARR_1 = [
  "id",
  "logisticsChannelId",
  "computeUnit",
  "computeBegin",
  "computeEnd",
  "minFreightEfficiency",
  "billingWeight",
  "calculatePackMaterials",
  "optimalFreightEfficiency",
  "fbaBillingWeight",
  "returnFreightType",
  "returnFreightValue",
  "presetPackMaterials",
  "otherServicesChecks",
];

export const dlgTabFormCols = (tName = "1", isSee) => {
  // if (isSee) {
  // 	EDIT_DLG_COL_109.render = (v, d) => {
  // 		return `（${d || '--'}）`
  // 	}
  // }
  const EDIT_DLG_FORM_TAB_101 = [
    ...(isSee ? [SEE_DLG_COL_101] : [EDIT_DLG_COL_101]),
    {
      ...EDIT_DLG_COL_102,
      disable: true,
    },
    ...(isSee ? [EDIT_DLG_COL_SLOT] : [EDIT_DLG_COL_SLOT]),
    {
      ...EDIT_DLG_COL_104,
      span: 8,
      type: isSee ? "txt" : "inputNumber",
    },
    // {
    //   ...EDIT_DLG_COL_105,
    //   type: isSee ? "txt" : "select",
    // },
    // {
    //   ...EDIT_DLG_COL_106,
    //   disabled: isSee,
    // },
    {
      ...EDIT_DLG_COL_107,
      span: 8,
      type: isSee ? "txt" : "inputNumber",
    },
    // {
    //   ...EDIT_DLG_COL_108,
    //   type: isSee ? "txt" : "select",
    // },
    {
      ...EDIT_DLG_COL_109,
      span: 6,
      type: isSee ? "txt" : "select",
    },
    {
      ...EDIT_DLG_COL_110,
      span: 2,
      type: isSee ? "txt" : "inputNumber",
    },
    // {
    //   ...EDIT_DLG_COL_111,
    //   type: isSee ? "txt" : "text",
    // },
    {
      ...EDIT_DLG_COL_112,
      disable: isSee,
    },
  ];

  const EDIT_DLG_FORM_TAB_201 = [
    {
      ...EDIT_DLG_COL_201,
      basicType: "salesPriceCompareRules",
      type: isSee ? "txt" : "select",
    },
    {
      ...EDIT_DLG_COL_202,
      disabled: isSee,
    },
    ...(isSee ? [SEE_DLG_COL_203] : [EDIT_DLG_COL_203]),
  ];

  const EDIT_DLG_FORM_TAB_301 = [
    {
      ...EDIT_DLG_COL_201,
      span: 15,
      basicType: "costPriceCompareRules",
      type: isSee ? "txt" : "select",
    },
    {
      ...EDIT_DLG_COL_202,
      disabled: isSee,
    },
    {
      ...EDIT_DLG_COL_303,
      disabled: isSee,
    },
    {
      ...EDIT_DLG_COL_304,
      disabled: isSee,
    },
    {
      ...EDIT_DLG_COL_105,
      span: 15,
      type: isSee ? "txt" : "select",
    },
    {
      ...EDIT_DLG_COL_108,
      span: 15,
      type: isSee ? "txt" : "select",
    },
    ...(isSee ? [SEE_DLG_COL_307] : [EDIT_DLG_COL_307]),
  ];

  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                EDIT_DLG_FORM_TAB_101,
                EDIT_DLG_FORM_TAB_201,
                EDIT_DLG_FORM_TAB_301,
              ][tName - 1],
            },
          ],
        },
      ],
    },
  ];
};

export const dlgTabFormRules = (tName, isSee) => {
  if (isSee) {
    return {};
  }
  if (tName === "1") {
    return {
      logisticsChannelId: [
        { required: true, message: "请选择物流渠道", trigger: "change" },
      ],
      startEndMoney: [
        { required: true, message: "请输入计算区间", trigger: "blur" },
      ],
      computeUnit: [
        { required: true, message: "请选择计算单位", trigger: "change" },
      ],
      minFreightEfficiency: [
        { required: true, message: "请输入货运最低时效", trigger: "blur" },
      ],
      optimalFreightEfficiency: [
        { required: true, message: "请输入货运最佳时效", trigger: "blur" },
      ],
    };
  }
  return {};
};
