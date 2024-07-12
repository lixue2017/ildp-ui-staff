const FORM_COLS_1 = {
  span: 12,
  titleSlot: true,
  id: "consigneeContactAndCompany",
  labelTop: "CONSIGNEE",
  labelBtm: "注册VAT的公司名",
  placeholder: "收货公司名称",
  type: "text",
};
const FORM_COLS_2 = {
  span: 12,
  titleSlot: true,
  id: "consignerContactAndCompany",
  labelTop: "SHIPPER",
  labelBtm: "发货人英文公司名",
  placeholder: "发货公司名称",
  type: "text",
};
const FORM_COLS_3 = {
  span: 12,
  titleSlot: true,
  id: "consigneeCompanyAddress",
  labelTop: "ADDRESS",
  labelBtm: "注册VAT的公司地址",
  type: "slot",
  list: [
    {
      id: "consigneeCountryId",
      selectLabelKey: "consigneeCountryName",
      type: "autocomplete",
      placeholder: "国家",
      category: "country",
      defaultProp: {
        value: "id",
        label: "twoCode,nameCn",
      },
      className: "country",
    },
    {
      id: "consigneeCompanyAddress",
      type: "text",
      placeholder: "收货公司地址",
      className: "address",
      maxlength: 255,
    },
  ],
};
const FORM_COLS_4 = {
  span: 12,
  titleSlot: true,
  id: "consignerCompanyAddress",
  labelTop: "ADDRESS",
  labelBtm: "发货人的英文公司地址",
  type: "slot",
  list: [
    {
      id: "consignerCountryId",
      selectLabelKey: "consignerCountryName",
      type: "autocomplete",
      placeholder: "国家",
      category: "country",
      defaultProp: {
        value: "id",
        label: "twoCode,nameCn",
      },
      className: "country",
    },
    {
      id: "consignerCompanyAddress",
      type: "text",
      placeholder: "发货公司地址",
      className: "address",
      maxlength: 255,
    },
  ],
};
const FORM_COLS_5 = {
  span: 12,
  titleSlot: true,
  id: "customsClearanceType",
  labelTop: "VAT Number",
  labelBtm: "在国外注册的税号",
  placeholder: "VAT",
  type: "text",
  maxlength: 50,
};
const FORM_COLS_6 = {
  span: 12,
  titleSlot: true,
  id: "customsClearanceType1",
  labelTop: "EORI Number",
  labelBtm: "注册VAT对应的EORI NO.",
  placeholder: "EORI号",
  type: "text",
  maxlength: 50,
};
const FORM_COLS_7 = {
  span: 8,
  titleSlot: true,
  id: "cusOrderNumber",
  labelTop: "INVOICE NUMBER",
  labelBtm: "发票号码",
  placeholder: "请输入客户单号",
  type: "text",
  maxlength: 256,
};
const FORM_COLS_8 = {
  span: 8,
  titleSlot: true,
  id: "invoiceDate",
  labelTop: "INVOICE DATE",
  labelBtm: "发票日期",
  placeholder: "请选择发票日期",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_9 = {
  span: 8,
  titleSlot: true,
  id: "reportCurrencyId",
  labelTop: "Currency",
  labelBtm: "申报币种",
  placeholder: "请选择申报币种",
  type: "autocomplete",
  category: "currency",
  defaultProp: {
    value: "id",
    label: "code,nameCn",
  },
};
const FORM_COLS_10 = {
  span: 8,
  titleSlot: true,
  id: "tradeTerms",
  labelTop: "INVOICE TERM",
  labelBtm: "发票条款",
  placeholder: "请输入发票条款",
  type: "text",
};
const FORM_COLS_11 = {
  span: 8,
  titleSlot: true,
  id: "headTransportMode",
  labelBtm: "头程运输方式",
  placeholder: "头程运输方式",
  type: "txt",
  basicType: "headTransportMode",
};
const FORM_COLS_12 = {
  span: 8,
  titleSlot: true,
  id: "encasementWay",
  labelBtm: "装箱方式",
  placeholder: "装箱方式",
  type: "txt",
  basicType: "freightType",
};
const FORM_COLS_13 = {
  span: 8,
  titleSlot: true,
  id: "clearanceType",
  labelBtm: "清关方式",
  placeholder: "清关方式",
  type: "select",
  basicType: "customsClearanceType",
};
const FORM_COLS_14 = {
  span: 8,
  titleSlot: true,
  id: "outWarehouseWay",
  labelBtm: "尾程运输方式",
  placeholder: "尾程运输方式",
  type: "select",
  basicType: "outWarehouseWay",
};
const FORM_COLS_15 = {
  span: 8,
  titleSlot: true,
  id: "reportCustomsWayId",
  labelBtm: "国内出口报关方式",
  placeholder: "报关方式",
  type: "select",
  basicType: "customsDeclarationType",
};
const FORM_COLS_16 = {
  span: 8,
  titleSlot: true,
  id: "tradeTerms",
  labelBtm: "贸易条款",
  placeholder: "贸易条款",
  type: "select",
  basicType: "tradeClause",
};

export const formColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
  FORM_COLS_8,
  FORM_COLS_9,
  // FORM_COLS_10,
  FORM_COLS_16,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_14,
  FORM_COLS_15,
];

export const formRule = {
  consigneeContactAndCompany: "请输入收货公司名称",
  consignerContactAndCompany: "请输入发货公司名称",
  consigneeCountryId: "请选择收货国家",
  consigneeCompanyAddress: "请输入收货公司地址",
  consignerCountryId: "请选择发货国家",
  consignerCompanyAddress: "请输入发货公司地址",
  customsClearanceType: "请输入VAT号",
  customsClearanceType1: "请输入EORI号",
  // cusOrderNumber: "请输入客户单号",
  invoiceDate: "请选择发票日期",
  reportCurrencyId: "请选择币种",
  tradeTerms: "请输入发票条款",
  headTransportMode: "请选择头程运输方式",
  encasementWay: "请选择装箱方式",
  clearanceType: "请选择清关方式",
  outWarehouseWay: "请选择尾程运输方式",
  reportCustomsWayId: "国内出口报关方式",
};
