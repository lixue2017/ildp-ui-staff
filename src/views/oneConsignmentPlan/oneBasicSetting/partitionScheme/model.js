import { httpUserSelect, httpCountrySelect } from "@/comModel/httpSelect";
import {
  httpCurrentWarehouseSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { logisticsProductList } from "@/api/warehouse/basic";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "nameLike",
  label: "方案名称：",
  placeholder: "方案名称(中英文)",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "logisticsProductIdEq",
  label: "物流产品：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect({ httpRequest: logisticsProductList }),
};
const SEARCH_COL_4 = {
  id: "logisticsChannelIdEq",
  label: "服务商渠道：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
};
const SEARCH_COL_5 = {
  id: "codeLike",
  label: "方案编码：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  id: "matchingMethodEq",
  label: "计算方式：",
  type: "select",
  placeholder: "请选择",
  basicType: "matchingMethod",
};
const SEARCH_COL_7 = {
  id: "stateEq",
  label: "状态：",
  type: "select",
  placeholder: "请选择",
  basicType: "status",
};
const SEARCH_COL_8 = {
  id: "createUserIdEq",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};
const SEARCH_COL_9 = {
  id: "countryId",
  label: "国家：",
  placeholder: "国家",
  ...httpCountrySelect,
};
const SEARCH_COL_10 = {
  id: "type",
  label: "是否偏远：",
  placeholder: "偏远",
  type: "select",
  options: [
    {
      label: "是",
      value: 2,
    },
    {
      label: "否",
      value: 1,
    },
  ],
};

export const searchColumns = () => {
  const SEARCH_COLS_1 = [
    SEARCH_COL_1,
    SEARCH_COL_2,
    // SEARCH_COL_3,
    // SEARCH_COL_4,
    // SEARCH_COL_6,
    SEARCH_COL_9,
    SEARCH_COL_5,
    SEARCH_COL_7,
    SEARCH_COL_8,
    SEARCH_COL_10,
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
  label: "方案编码",
  columnLink: true,
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "nameCn",
  label: "方案名称(CN)",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "nameEn",
  label: "方案名称(EN)",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "type",
  label: "是否遍远",
  minWidth: 110,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => (row.type === 2 ? "是" : row.type === 1 ? "否" : "--"),
};
const TABLE_COL_5 = {
  prop: "countryName",
  label: "国家信息",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) =>
    row.countryNum ? `${row.countryNum}个：${row.countryName}` : "--",
};
const TABLE_COL_6 = {
  prop: "matchingMethod",
  label: "计算方式",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "matchingMethod",
};
const TABLE_COL_7 = {
  prop: "matchingType",
  label: "匹配类型",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "matchingType",
};
const TABLE_COL_8 = {
  prop: "infoCount",
  label: "分区数量",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  // render: (rows) => {
  // 	return ['否', '是'][rows.isTrace]
  // }
};
const TABLE_COL_9 = {
  prop: "detailCount",
  label: "区域数量",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "createUserName",
  label: "创建人",
  sortable: true,
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "state",
  label: "状态",
  dotColor: true,
  sortable: true,
  width: 80,
  basicType: "status",
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
  // TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_99,
];

export const tableColumns = () => {
  return TABLE_COLS_1;
};

const EDIT_DLG_COL_1 = {
  span: 24,
  id: "nameCn",
  label: "方案名称(CN)：",
  placeholder: "请输入",
  type: "text",
  maxlength: 20,
};
const EDIT_DLG_COL_2 = {
  span: 24,
  id: "nameEn",
  label: "方案名称(EN)：",
  placeholder: "请输入",
  type: "text",
  maxlength: 30,
};
const EDIT_DLG_COL_3 = {
  span: 24,
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect({ httpRequest: logisticsProductList }),
};
const EDIT_DLG_COL_4 = {
  span: 24,
  id: "logisticsChannelId",
  label: "服务商渠道：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
};
const EDIT_DLG_COL_5 = {
  span: 24,
  id: "matchingMethod",
  label: "计算方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "matchingMethod",
  // dicsStr: 'web_freight_mode',
  // customDicsArr: [0, 1]
};
const EDIT_DLG_COL_6 = {
  span: 24,
  id: "matchingType",
  label: "匹配类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "matchingType",
  // dicsStr: 'web_freight_mode',
  // customDicsArr: [0, 1]
};
const EDIT_DLG_COL_7 = {
  span: 24,
  id: "remark",
  label: "规则备注：",
  placeholder: "请输入",
  type: "textarea",
  maxlength: 200,
};
const EDIT_DLG_COL_8 = {
  span: 24,
  id: "xx_temp_tip",
  type: "txt",
  render: () => "加拿大邮编：仅支持3位或者6位校验",
  txtStyleObj: {
    color: "#5094ff",
  },
};
const EDIT_DLG_COL_9 = {
  span: 24,
  id: "type",
  text: "是否偏远",
  type: "singleCheckbox",
};

const EDIT_DLG_FORM_COLS = [
  EDIT_DLG_COL_1,
  EDIT_DLG_COL_2,
  EDIT_DLG_COL_9,
  // EDIT_DLG_COL_3,
  // EDIT_DLG_COL_4,
  // EDIT_DLG_COL_5,
  // EDIT_DLG_COL_6,
  // EDIT_DLG_COL_8,
  EDIT_DLG_COL_7,
];

export const editDlgFormCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: EDIT_DLG_FORM_COLS,
            },
          ],
        },
      ],
    },
  ];
};

const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};
export const dlgFormRules = () => {
  return {
    nameCn: [{ required: true, message: "请输入方案名称", trigger: "blur" }],
    nameEn: [txtRules],
    logisticsProductId: [
      { required: true, message: "请选择物流产品", trigger: "change" },
    ],
    matchingMethod: [
      { required: true, message: "请选择计算方式", trigger: "change" },
    ],
    matchingType: [
      { required: true, message: "请选择匹配类型", trigger: "change" },
    ],
  };
};

/** 详情编辑页模板 */
export const detailTableLeftCols = (obj) => {
  const { isSee } = obj || {};
  const TABLE_COL_LEFT_601 = {
    prop: "code",
    label: "分区编码",
    width: 88,
    customRow: true,
    request: !isSee,
    showOverflowTooltip: true,
    maxLength: 20,
  };
  const TABLE_COL_LEFT_602 = {
    prop: "nameCn",
    label: "分区名称",
    minWidth: 110,
    customRow: true,
    request: !isSee,
    showOverflowTooltip: true,
    maxLength: 20,
  };
  const TABLE_COL_LEFT_603 = {
    prop: "nameEn",
    label: "分区名称(EN)",
    minWidth: 110,
    customRow: true,
    showOverflowTooltip: true,
    maxLength: 30,
  };
  const TABLE_COL_LEFT_604 = {
    prop: "remark",
    label: "备注",
    width: 110,
    customRow: true,
    showOverflowTooltip: true,
    maxLength: 200,
  };
  return [
    {
      ...TABLE_COL_0,
      width: 36,
    },
    TABLE_COL_LEFT_601,
    TABLE_COL_LEFT_602,
    TABLE_COL_LEFT_603,
    // TABLE_COL_LEFT_604,
    ...(isSee
      ? []
      : [
          {
            ...TABLE_COL_99,
            width: 82,
          },
        ]),
  ];
};

const SEARCH_COL_RIGHT_651 = {
  id: "xx_right_651",
  label: "分区：",
  labelWidth: "45px",
  placeholder: "请选择",
  ...httpCurrentWarehouseSelect(),
};
const SEARCH_COL_RIGHT_652 = {
  id: "nameLike",
  label: "国家：",
  labelWidth: "50px",
  placeholder: "国家",
  type: "text",
};
export const detailRightFormCols = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_COL_RIGHT_652],
            },
          ],
        },
      ],
    },
  ];
};

export const detailTableRightCols = (obj) => {
  const { isSee } = obj || {};
  const TABLE_COL_RIGHT_801 = {
    prop: "costPartitionInfoCode",
    label: "分区",
    minWidth: 120,
    showOverflowTooltip: true,
  };
  const TABLE_COL_RIGHT_802 = {
    prop: "countryName",
    label: "国家",
    width: 150,
    customRow: true,
    request: !isSee,
    showOverflowTooltip: true,
    fieldItem: {
      id: "countryId",
      selectLabelKey: "countryCode",
      placeholder: "国家",
      type: "autocomplete",
      category: "country",
      defaultProp: {
        value: "id",
        label: "twoCode,nameCn",
      },
    },
  };
  const TABLE_COL_RIGHT_803 = {
    prop: "province",
    label: "省/州",
    width: 135,
    customRow: true,
    request: !isSee,
    showOverflowTooltip: true,
  };
  const TABLE_COL_RIGHT_804 = {
    prop: "city",
    label: "城市/府",
    width: 135,
    customRow: true,
    showOverflowTooltip: true,
  };
  const TABLE_COL_RIGHT_805 = {
    prop: "postalDeliveryArea",
    label: "邮域",
    width: 135,
    customRow: true,
    showOverflowTooltip: true,
  };
  const TABLE_COL_RIGHT_806 = {
    prop: "startPostalCode",
    label: "开始邮编",
    width: 135,
    customRow: true,
    // request: !isSee,
    showOverflowTooltip: true,
  };
  const TABLE_COL_RIGHT_807 = {
    prop: "endPostalCode",
    label: "结束邮编",
    width: 135,
    customRow: true,
    // request: !isSee,
    showOverflowTooltip: true,
  };
  const TABLE_COL_RIGHT_808 = {
    prop: "type",
    label: "类型",
    width: 100,
    customRow: true,
    request: !isSee,
    showOverflowTooltip: true,
    fieldItem: {
      type: "select",
      basicType: "costPartitionDetailType",
    },
  };

  return [
    {
      ...TABLE_COL_0,
      width: 36,
    },
    TABLE_COL_RIGHT_801,
    TABLE_COL_RIGHT_802,
    TABLE_COL_RIGHT_808,
    // TABLE_COL_RIGHT_803,
    // TABLE_COL_RIGHT_804,
    // TABLE_COL_RIGHT_805,
    TABLE_COL_RIGHT_806,
    TABLE_COL_RIGHT_807,
    ...(isSee
      ? []
      : [
          {
            ...TABLE_COL_99,
            width: 140,
          },
        ]),
  ];
};
