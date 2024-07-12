import {
  httpWarehousePublicSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import {
  httpUserSelect,
  httpGetCostBindCustomer,
  httpCurrencySelect,
} from "@/comModel/httpSelect";
import {
  logisticsProductList,
  costPartitionSchemeList,
  weightSectionTempList,
} from "@/api/warehouse/basic";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "code",
  label: "价格编码：",
  placeholder: "价格编码",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "wmsId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({
    typeList: "2",
    topFlag: true,
    permissionType: 2,
    isHaveComId: 1,
  }),
};
const SEARCH_COLS_4 = {
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true
  }),
};
const SEARCH_COLS_5 = {
  id: "costPartitionSchemeId",
  label: "分区方案：",
  placeholder: "分区方案",
  ...httpLogisticsChannelListSelect({
    httpRequest: costPartitionSchemeList,
    stateKey: "stateEq",
  }),
};
const SEARCH_COLS_6 = {
  id: "weightSectionTempId",
  label: "重量段模板：",
  placeholder: "重量段模板",
  ...httpLogisticsChannelListSelect({
    httpRequest: weightSectionTempList,
    stateKey: "stateEq",
  }),
};
const SEARCH_COLS_7 = {
  id: "customerId",
  label: "客户：",
  placeholder: "客户",
  ...httpGetCostBindCustomer(),
};
const SEARCH_COLS_8 = {
  id: "priceCurrencyId",
  label: "币别：",
  placeholder: "币别",
  ...httpCurrencySelect,
};
const SEARCH_COLS_9 = {
  id: "goodsPackType",
  label: "包装类型：",
  placeholder: "包装类型",
  type: "select",
  basicType: "goodsPackType",
};
const SEARCH_COLS_10 = {
  id: "priceGrade",
  label: "价格等级：",
  placeholder: "价格等级",
  type: "select",
  basicType: "priceGrade",
};
const SEARCH_COLS_11 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};
const SEARCH_COLS_12 = {
  id: "stateList",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "costSaleLogisticsPriceState",
  // hideList:[3,5],
  multiple: true,
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "code",
  label: "价格编码",
  minWidth: 120,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "wmsCode",
  label: "计费仓",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "logisticsProductCode",
  label: "物流产品",
  minWidth: 140,
  showOverflowTooltip: true,
  render: (row) => `${row.logisticsProductCode}/${row.logisticsProductName}`,
};
const TABLE_COLS_4 = {
  prop: "costPartitionSchemeCode",
  label: "分区方案",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "weightSectionTempCode",
  label: "重量段模板",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "priceCurrencyCode",
  label: "币别",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "goodsPackType",
  label: "包装类型",
  minWidth: 140,
  showOverflowTooltip: true,
  basicType: "goodsPackType",
};
const TABLE_COLS_8 = {
  prop: "priceGrade",
  label: "价格等级",
  minWidth: 140,
  showOverflowTooltip: true,
  basicType: "priceGrade",
};
const TABLE_COLS_9 = {
  prop: "customerName",
  label: "客户",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "fallbackEmail",
  label: "回退",
  minWidth: 140,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_11 = {
  prop: "beginTime",
  label: "有效开始时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "endTime",
  label: "有效结束时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "createUserName",
  label: "创建人",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "updateTime",
  label: "最后修改时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "state",
  label: "状态",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "costSaleLogisticsPriceState",
  dotColor: true,
  fixed: "right",
};
const TABLE_COLS_17 = {
  prop: "enablingTime",
  label: "价格生效时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 150,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
  SEARCH_COLS_8,
  SEARCH_COLS_9,
  SEARCH_COLS_10,
  SEARCH_COLS_11,
  SEARCH_COLS_12,
];
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_13,
  TABLE_COLS_17,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_OPERATION,
];

export { searchColumns, tableColumns };


const DIALOG_FORM_1={
  span: 24,
  id:'remark',
  label:"通过说明：",
  placeholder: "请输入",
  type: "textarea",
  maxlength:2000,
}
const DIALOG_FORM_2={
  span: 24,
  id:'remark',
  label:"打回说明：",
  placeholder: "请输入",
  type: "textarea",
  maxlength:2000,
}
const DIALOG_FORM_3={
  span: 24,
  id: "enablingTime",
  label: "生效时间：",
  placeholder: "请输入",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
}


export const passCustomDialogCols = () => {
  return {
    title: '收款确认-通过',
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_3,
      DIALOG_FORM_1
    ],
    formRules: {
    }
  }
}

export const repulseCustomDialogCols = () => {
  return {
    title: '收款确认-打回',
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_2
    ],
    formRules: {
      remark: [
        { required: true, message: `请输入打回说明`, trigger: "blur" }
      ]
    }
  }
}

export const takeEffectCustomDialogCols = () => {
  return {
    title: '收款确认-生效',
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_3,
    ],
    formRules: {
    }
  }
}
export const diyCustomDialogCols = (row={}) => {
  const {title}=row
  return {
    title,
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_3,
    ],
    formRules: {
      enablingTime: [
        { required: true, message: `请选择生效时间`, trigger: "change" },
      ],
    }
  }
}
