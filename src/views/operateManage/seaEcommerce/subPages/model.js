// import { toFixedNum } from "@/utils/instructions";
import { getDictObj } from "@/utils/index";
import {
  routeOrderInfo,
  sortBoxOrderInfo,
} from "@/views/newOrderManage/trandition/details/model.js";

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
      label: "子单信息",
      key: 13,
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
    // {
    //   label: "扣货管理",
    //   key: 6,
    // },
    {
      label: "账单信息",
      key: 7,
    },
    // {
    //   label: "预约信息",
    //   key: 12,
    // },
    {
      label: "物流轨迹",
      key: 8,
    },
    // {
    //   label: "放货信息",
    //   key: 9,
    // },
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
  label: "目的国：",
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

/** 电商 */
export const ecBasicInfo = {
  title: "基本信息",
  rowClassName: "form-rows-box",
  titleClass: "-1",
  rows: [
    {
      cols: [
        MODEL_COL_1,
        MODEL_COL_2,
        MODEL_COL_3,
        // MODEL_COL_4,
        // MODEL_COL_5,
        MODEL_COL_7,
        MODEL_COL_8,
        MODEL_COL_6,
        MODEL_COL_10,
        MODEL_COL_9,
        // MODEL_COL_11,
        MODEL_COL_12,
      ],
    },
  ],
};

/** 订单详情、操作单空运与其他操作单详情、海外仓入库预报对接头程有引用 */
export const contactsOperationAddress = (tSpan) => {
  let txtLineCols = [
    {
      txtColSpan: 12,
      iconColClass: "el-icon-office-building", // 建筑物
      txtColKey: "company",
    },
    {
      txtColSpan: 12,
      iconColClass: "el-icon-phone-outline", // 电话
      txtColKey: "contacts",
      txtColRender: (row, fItem) => {
        return `${row[fItem.txtObjKey]?.contacts || "--"}(${
          row[fItem.txtObjKey]?.phone || "--"
        })`;
      },
    },
    {
      txtColSpan: tSpan,
      iconColClass: "el-icon-location-outline", // 地址
      txtColKey: "address",
    },
  ];
  if (tSpan === 12) {
    txtLineCols.push({
      txtColSpan: 12,
      txtColLabel: "VAT/EORI/POA：",
      txtColKey: "orderCustomsClearanceVos",
      txtColDictKey: "customsClearanceMode",
      txtColRender: (row, fItem, dict) => {
        return (
          (row.orderCustomsClearanceVos || row.customsClearanceList || [])
            .filter((i) => i)
            .map((e) => {
              return `${e.code}/${getDictObj(dict, e.customsClearanceType)}`;
            })
            .join(", ") || "--"
        );
      },
    });
  }
  return {
    span: 24,
    type: "txt",
    labelClassName: "item-label-title",
    txtLineCols,
  };
};

export const ecContactsConfig = {
  rowClassName: "form-rows-box",
  rows: [
    {
      cols: [
        {
          ...contactsOperationAddress(),
          label: "发货人",
          id: "cusConsigner_address",
          txtObjKey: "cusConsigner",
        },
        {
          ...contactsOperationAddress(12),
          label: "收货人",
          id: "cusConsignee_address",
          txtObjKey: "cusConsignee",
        },
        {
          ...contactsOperationAddress(),
          label: "通知人",
          id: "cusNotifier_address",
          txtObjKey: "cusNotifier",
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
  const sortBoxFrom = row.sortBoxDataId
    ? sortBoxOrderInfo(row.routeDataId ? 5 : 3, {
        showType: "slot",
      })
    : [];
  return [
    {
      fieldList: [ecBasicInfo, ecContactsConfig, ...extraFrom, ...sortBoxFrom],
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
