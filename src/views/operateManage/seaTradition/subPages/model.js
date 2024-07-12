// import { toFixedNum } from "@/utils/instructions";
import { routeOrderInfo } from "@/views/newOrderManage/trandition/details/model.js";
import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";

export const tabsConfig = {
  columns: [
    {
      label: "基本信息",
      key: 1,
    },
    {
      label: "货物信息",
      key: 2,
    },
    {
      label: "拖车信息",
      key: 3,
    },
    {
      label: "清报关信息",
      key: 4,
    },
    {
      label: "提单信息",
      key: 5,
    },
    {
      label: "账单信息",
      key: 7,
    },
    {
      label: "物流轨迹",
      key: 8,
    },
    {
      label: "附件信息",
      key: 10,
    },
    {
      label: "操作记录",
      key: 11,
    },
  ],
  active: 1,
};

const MODEL_COL_1 = {
  span: 8,
  id: "countryName",
  label: "国家：",
  type: "txt",
};
const MODEL_COL_2 = {
  span: 8,
  id: "startPortName",
  label: "起运港：",
  type: "txt",
};
const MODEL_COL_3 = {
  span: 8,
  id: "endPortName",
  label: "目的港：",
  type: "txt",
};
const MODEL_COL_4 = {
  span: 8,
  id: "customsClearanceType",
  label: "清关方式：",
  type: "txt",
  basicType: "customsClearanceType",
};
const MODEL_COL_5 = {
  span: 8,
  id: "currency",
  label: "清关币别：",
  type: "txt",
};
const MODEL_COL_6 = {
  span: 8,
  id: "platform",
  label: "平台：",
  type: "txt",
  basicType: "orderPlatform",
};
const MODEL_COL_7 = {
  span: 8,
  id: "transactionWarehouseCode",
  label: "国内交货仓：",
  type: "txt",
  render: (r) =>
    `${r.transactionWarehouseCode || "--"}/${
      r.transactionWarehouseName || "--"
    }`,
  txtTagArr: [
    {
      basicTypeVal: "containerTrailer",
      basicType: "containerTrailerType",
      noDictValueHide: true,
    },
  ],
};
const MODEL_COL_8 = {
  span: 8,
  id: "putWarehouseTime",
  label: "预计入仓时间：",
  type: "txt",
};
const MODEL_COL_9 = {
  span: 8,
  id: "insured",
  label: "单独购买保险：",
  type: "txt",
  render: (r) => (r.insured ? "是" : "否"), //`${toFixedNum(r.insuredAmount) || '--'} ${r.insuranceAmountCurrencyCode || ''}`
};
const MODEL_COL_10 = {
  // 非主、子单显示
  span: 8,
  id: "wholeCabinetSn",
  label: "整柜单号：",
  type: "txt",
};
const MODEL_COL_11 = {
  span: 8,
  id: "cusOrderNumber",
  label: "客户单号：",
  type: "txt",
};
const MODEL_COL_12 = {
  span: 8,
  id: "insureNo",
  label: "保险单号：",
  type: "txt",
};

const MODEL_COL_201 = {
  span: 8,
  id: "transportMode",
  label: "运输方式：",
  type: "txt",
  basicType: "transportMode",
};
const MODEL_COL_202 = {
  span: 8,
  id: "declareCurrencyName",
  label: "清关币别：",
  type: "txt",
};
const MODEL_COL_203 = {
  // 传统
  span: 8,
  id: "insured",
  label: "单独购买保险：",
  type: "txt",
  render: (r) => (r.insured ? "是" : "否"),
};

/** 传统海运 */
export const tranditionBasicInfo = {
  title: "基本信息",
  rowClassName: "form-rows-box",
  titleClass: "-1",
  rows: [
    {
      cols: [
        MODEL_COL_4,
        MODEL_COL_202,
        MODEL_COL_201,
        MODEL_COL_7,
        MODEL_COL_8,
        MODEL_COL_203,
        MODEL_COL_10,
        MODEL_COL_11,
        MODEL_COL_12,
      ],
    },
  ],
};

export const tranditionContactsConfig = {
  rowClassName: "form-rows-box",
  rows: [
    {
      cols: [
        {
          ...contactsOperationAddress(),
          label: "发货人",
          id: "shipper_address",
          txtObjKey: "shipper",
        },
        {
          ...contactsOperationAddress(),
          label: "收货人",
          id: "consignee_address",
          txtObjKey: "consignee",
        },
        {
          ...contactsOperationAddress(),
          label: "通知人",
          id: "notifier_address",
          txtObjKey: "notifier",
        },
      ],
    },
  ],
};

export const eCommerceOperate = (row = {}) => {
  const extraFrom = row.routeDataId
    ? routeOrderInfo({
        operationOrderType: row.operationOrderType,
        showType: "slot",
      })
    : [];
  return [
    {
      fieldList: [tranditionBasicInfo, tranditionContactsConfig, ...extraFrom],
    },
  ];
};

export const cardConfig = [
  {
    bgColor: "#ECF3FF",
    icon: "yunshu1",
    type: "slot",
    prop: "addr",
    labelColor: "#5094FF",
    valueColor: "#5094FF",
  },
  {
    bgColor: "#FFF3EC",
    type: "slot",
    prop: "orderNo",
    valueColor: "#FF985C",
  },
  {
    bgColor: "#ECECFF",
    icon: "icon-zhongliang",
    label: "核实重量(KG)",
    prop: "realFreightWeight",
    labelColor: "#B1B1FF",
    valueColor: "#7676FF",
  },
  {
    bgColor: "#D2F1FF",
    icon: "icon-tiji",
    label: "核实体积(CBM)",
    prop: "realFreightVolume",
    labelColor: "#64CFFF",
    valueColor: "#13B5FF",
  },
];

export const customsConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "报关信息",
          rowClassName: "tab-field-rows-box",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "code",
                  label: "报关编号：",
                  type: "slot",
                },
                {
                  span: 8,
                  id: "shortName",
                  label: "报关行：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "dcNumbers",
                  label: "报关单号：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "exportType",
                  label: "",
                  type: "slot",
                  basicType: "importExportType",
                },
                {
                  span: 8,
                  id: "declareTime",
                  label: "申报日期：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "releaseTime",
                  label: "放行日期：",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  type: "txt",
                },
              ],
            },
          ],
        },
        {
          title: "清关信息",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "slotCustomsClearance",
                  labelWidth: "0px",
                  // label: "清关资料：",
                  type: "slot",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
