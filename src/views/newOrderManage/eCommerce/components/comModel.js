import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import {
  httpPortPublicSelect,
  httpCabinetTypeSelect,
} from "@/comModel/httpSelect.js";
import { MAX_FCL_NUM } from "@/utils/instructions";
const FORM_COL_1 = {
  span: 24,
  id: "countryId",
  label: "目的国：",
  placeholder: "请选择目的国",
  noClearable: true,
  isBackAll: true,
  defaultKey: "id",
  type: "slot",
  category: "country",
  selectLabelKey: "country",
  defaultProp: {
    value: "id",
    label: "twoCode,nameCn",
  },
};
const FORM_COL_2 = {
  span: 24,
  id: "encasementWay",
  label: "装箱方式：",
  placeholder: "请选择装箱方式",
  type: "slot",
  basicType: "freightType",
};
const FORM_COL_3 = {
  span: 24,
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "请选择头程运输方式",
  type: "select",
  basicType: "headTransportMode",
};
const FORM_COL_4 = {
  span: 24,
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "请选择尾程运输方式",
  type: "select",
  basicType: "outWarehouseWay",
};
const FORM_COL_5 = {
  span: 8,
  id: "startPort",
  label: "装运港：",
  placeholder: "请选择装运港",
  ...httpPortPublicSelect(),
  type: "slot",
};
const FORM_COL_6 = {
  span: 8,
  id: "endPort",
  label: "目的港：",
  placeholder: "请选择目的港",
  ...httpPortPublicSelect(),
  type: "slot",
};
const FORM_COL_7 = {
  span: 8,
  id: "platform",
  label: "平台：",
  placeholder: "-请选择-",
  type: "select",
  basicType: "orderPlatform",
};
const FORM_COL_8 = {
  span: 8,
  id: "transactionWarehouse",
  label: "国内交货仓：",
  placeholder: "请选择",
  type: "autocomplete",
  selectLabelKey: "transactionWarehouseCode",
  ...httpWarehousePublicSelect({
    flagAvailable: "y",
    typeList: "2,3",
  }),
};
const FORM_COL_9 = {
  span: 8,
  id: "putWarehouseTime",
  label: "入仓时间：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const FORM_COL_10 = {
  span: 8,
  id: "insured",
  text: "单独购买保险",
  type: "singleCheckbox",
};
const FORM_COL_11 = {
  span: 8,
  id: "reportCustomsWay",
  label: "报关方式：",
  type: "select",
  basicType: "customsDeclarationType",
};
const FORM_COL_12 = {
  span: 8,
  id: "customsClearanceType",
  label: "清关方式：",
  type: "radio",
  basicType: "customsClearanceType",
};
const FORM_COL_13 = {
  span: 8,
  id: "reportCurrencyId",
  label: "清关币别：",
  placeholder: "-请选择-",
  type: "autocomplete",
  category: "currency",
  selectLabelKey: "currency",
  defaultProp: {
    value: "id",
    label: "code,nameCn",
  },
};
const FORM_COL_14 = {
  span: 5,
  id: "boxCount",
  label: "柜量/柜型：",
  placeholder: "柜量",
  type: "inputNumber",
  max: MAX_FCL_NUM,
  numDecimal: 0,
};
const FORM_COL_15 = {
  span: 3,
  id: "boxId",
  labelWidth: "0px",
  placeholder: "柜型",
  className: "item-margin-left",
  ...httpCabinetTypeSelect,
  currData: true,
  selectLabelKey: "code",
};
const FORM_COL_16 = {
  span: 16,
  id: "cusOrderNumber",
  label: "客户单号：",
  placeholder: "此处填写客户单号",
  type: "text",
  maxlength: 256,
};
const FORM_COL_17 = {
  span: 12,
  id: "consignerId",
  label: "发货人",
  labelWidth: "76px",
  labelClassName: "item-label-title",
  placeholder: "请选择发货人",
  selectTxtWidth: 390,
  type: "slot",
  maxWidth: "170px",
  inputWidth: "408px",
  noClearable: true,
  isHidePhone: true,
};
const FORM_COL_18 = {
  span: 24,
  id: "consigneeId",
  label: "收货人",
  labelWidth: "76px",
  labelClassName: "item-label-title",
  placeholder: "请选择收货人",
  selectTxtWidth: 390,
  type: "slot",
  maxWidth: "170px",
  inputWidth: "408px",
  isHidePhone: true, //只有电商需要隐藏，传统与其他不用
  showClearanceCustoms: true,
  isClearanceRequest: true,
  noClearable: true,
};
const FORM_COL_19 = {
  span: 12,
  id: "notifierId",
  label: "通知人",
  labelWidth: "76px",
  labelClassName: "item-label-title",
  placeholder: "请选择通知人",
  selectTxtWidth: 390,
  type: "slot",
  maxWidth: "170px",
  inputWidth: "408px",
  isHidePhone: true,
};
const FORM_COL_20 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};
const FORM_COL_21 = {
  span: 24,
  id: "slotFiles",
  labelWidth: "0",
  type: "slot",
};
const FORM_COL_22 = (isSee) => [
  {
    cols: [
      {
        span: 24,
        labelWidth: "58px",
        label: "订单备注",
        type: "slot",
        className: "custom-remark",
      },
      {
        span: 24,
        id: "remark",
        labelWidth: "0px",
        placeholder: isSee ? "--" : "请输入备注信息",
        type: "textarea",
        disable: isSee,
        maxlength: 2000,
      },
    ],
  },
];

const comFormRule = {
  countryId: [{ required: true, message: "请选择目的国", trigger: "change" }],
  encasementWay: [
    { required: true, message: "请选择装箱方式", trigger: "change" },
  ],
  headTransportMode: [
    { required: true, message: "请选择头程运输方式", trigger: "change" },
  ],
  outWarehouseWay: [
    { required: true, message: "请选择尾程运输方式", trigger: "change" },
  ],
  startPort: [{ required: true, message: "请选择装运港", trigger: "change" }],
  endPort: [{ required: true, message: "请选择目的港", trigger: "change" }],
  transactionWarehouse: [
    { required: true, message: "请选择国内交货仓", trigger: "change" },
  ],
  putWarehouseTime: [
    { required: true, message: "请选择入仓时间", trigger: "blur" },
  ],
  reportCustomsWay: [
    { required: true, message: "请选择报关方式", trigger: "change" },
  ],
  customsClearanceType: [
    { required: true, message: "请选择清关方式", trigger: "change" },
  ],
  reportCurrencyId: [
    { required: true, message: "请选择清关币别", trigger: "change" },
  ],
  cabinetQuantity: [
    { required: true, message: "请选择柜量", trigger: "change" },
  ],
  cabinetId: [{ required: true, message: "请选择柜型", trigger: "change" }],
  consignerId: [{ required: true, message: "请选择发货人", trigger: "change" }],
  consigneeId: [{ required: true, message: "请选择收货人", trigger: "change" }],
};

function getFormRule(list) {
  const formRules = {};
  list.forEach((prop) => {
    if (comFormRule[prop]) {
      formRules[prop] = comFormRule[prop];
    }
  });
  console.log(formRules);
  return formRules;
}

export {
  FORM_COL_1, // 目的国
  FORM_COL_2, // 装箱方式
  FORM_COL_3, // 头程运输方式
  FORM_COL_4, // 尾程运输方式
  FORM_COL_5, // 装运港
  FORM_COL_6, // 目的港
  FORM_COL_7, // 平台
  FORM_COL_8, // 国内交货仓
  FORM_COL_9, // 入仓时间
  FORM_COL_10, // 单独购买保险
  FORM_COL_11, // 报关方式
  FORM_COL_12, // 清关方式
  FORM_COL_13, // 清关币别
  FORM_COL_14, // 柜量/柜型
  FORM_COL_15, // 柜型
  FORM_COL_16, // 客户单号
  FORM_COL_17, // 发货人
  FORM_COL_18, // 收货人
  FORM_COL_19, // 通知人
  FORM_COL_20, // 列表
  FORM_COL_21, // 附件
  FORM_COL_22, // 备注
  getFormRule, // 必填项校验
};
