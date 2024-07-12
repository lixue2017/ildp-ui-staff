import { toFixedNum } from "@/utils/instructions";
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
    // {
    //   label: "预约信息",
    //   key: 12,
    //   showType: 2,
    // },
  ],
  active: 1,
};

/** 订单详情用到，展示已经绑定的航次信息详情 */
export const routeInfo = [
  {
    title: "航次信息",
    titleClass: "-2",
    rows: [
      {
        cols: [
          {
            span: 8,
            id: "shipCompanyName",
            label: "船公司：",
            type: "txt",
          },
          {
            span: 7,
            id: "airflightStartPortName",
            label: "起运港：",
            type: "txt",
          },
          {
            span: 7,
            id: "flightName",
            label: "船名：",
            type: "txt",
          },
          {
            span: 8,
            id: "airflightCode",
            label: "航次编码：",
            type: "slot",
          },
          {
            span: 7,
            id: "airflightEndPortName",
            label: "目的港：",
            type: "txt",
          },
          {
            span: 7,
            id: "name",
            label: "船次：",
            type: "txt",
          },
          {
            span: 2,
            id: "expansion",
            label: "",
            labelWidth: "0",
            type: "slot",
            expansion: true,
            changeIndex: 3,
          },
        ],
      },
    ],
  },
  {
    className: "expansion-show",
    rows: [
      {
        cols: [
          {
            span: 8,
            id: "cabinOpenTime",
            label: "开舱日期：",
            type: "txt",
          },
          {
            span: 7,
            id: "cutGateTime",
            label: "截关日期：",
            type: "txt",
          },
          {
            span: 7,
            id: "airflightRouteCodeName",
            label: "航线组：",
            type: "txt",
          },
          {
            span: 8,
            id: "routeOrderInfoCode",
            label: "航线信息：",
            type: "txt",
          },
          // {
          //   span: 8,
          //   id: "countryName",
          //   label: "目的国：",
          //   placeholder: "--",
          //   type: "txt"
          // },
          {
            span: 7,
            id: "sailOpenTime",
            label: "开航期：",
            type: "txt",
          },
          {
            span: 7,
            id: "airflightSoNo",
            label: "SO No.：",
            type: "txt",
          },
          {
            span: 24,
            id: "airflightRemark",
            label: "备注：",
            type: "txt",
            tipWidth: "520px",
          },
          {
            span: 24,
            id: "attachId_xx",
            attachIdKeyName: "attachId_xx",
            attachListKeyName: "routeOrderAttachList",
            label: "订舱资料：",
            // labelWidth: "0px",
            type: "customUploadFile",
            disable: true,
            detailDisplay: true,
          },
        ],
      },
    ],
  },
];

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
  id: "containerTrailer",
  label: "国内交货仓：",
  type: "slot",
  basicType: "containerTrailerType",
  // render: row => `${row.transactionWarehouseCode || '--'}/${row.transactionWarehouseName || '--'}`
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
  render: (r) => (r.insured ? "是" : "否"), //`${toFixedNum(r.insuranceAmount) || '--'} ${r.insuranceAmountCurrencyCode || ''}`
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
        MODEL_COL_4,
        MODEL_COL_5,
        MODEL_COL_6,
        MODEL_COL_7,
        MODEL_COL_8,
        MODEL_COL_9,
        ...[MODEL_COL_10],
        MODEL_COL_11,
        MODEL_COL_12,
      ],
    },
  ],
};

/** 传统海运 */
export const tranditionBasicInfo = {
  title: "基本信息",
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
        ...[MODEL_COL_10],
        MODEL_COL_11,
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

export const tranditionContactsConfig = {
  className: "border-top-solid",
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

export const basicInfoConfig = {
  lists: [
    {
      fieldList: [
        { ...ecBasicInfo },
        { ...ecContactsConfig },
        ...routeInfo,
        {
          title: "排柜信息",
          disable: false,
          titleClass: "-2",
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "argCabinetCode",
                  label: "系统批次号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 7,
                  id: "argCabinetWeight",
                  label: "总重量：",
                  placeholder: "--",
                  type: "txt",
                  render: (rows) => {
                    return rows.argCabinetWeight && rows.argCabinetWeight !== 0
                      ? `${rows.argCabinetWeight.toFixed(2)}KG`
                      : "--";
                  },
                },
                {
                  span: 7,
                  id: "argCabinetBoxModelCode",
                  label: "柜型：",
                  placeholder: "--",
                  type: "txt",
                },
                // {
                //   span: 5,
                //   id: "argCabinetStartPortName",
                //   label: "起始港：",
                //   placeholder: "--",
                //   type: "txt"
                // },
                // {
                //   span: 5,
                //   id: "argCabinetEndPortName",
                //   label: "目的港：",
                //   placeholder: "--",
                //   type: "txt"
                // },
                {
                  span: 8,
                  id: "argCabinetRegisterNo",
                  label: " 整柜参考号：",
                  placeholder: "--",
                  type: "slot",
                },
                // {
                //   span: 8,
                //   id: "argCabinetSono",
                //   label: "SO No.：",
                //   placeholder: "--",
                //   type: "txt"
                // },
                {
                  span: 7,
                  id: "argCabinetVolume",
                  label: "总体积：",
                  placeholder: "--",
                  type: "txt",
                  render: (rows) => {
                    return rows.argCabinetVolume && rows.argCabinetVolume !== 0
                      ? `${rows.argCabinetVolume.toFixed(2)}CBM`
                      : "--";
                  },
                },
                {
                  span: 7,
                  id: "argCabinetCreateBy",
                  label: "创建人：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 2,
                  id: "expansion",
                  label: "",
                  labelWidth: "0",
                  type: "slot",
                  expansion: true,
                  changeIndex: 5,
                },
              ],
            },
          ],
        },
        {
          disable: false,
          className: "expansion-show",
          rows: [
            {
              cols: [
                // {
                //   span: 6,
                //   id: "aimCountry",
                //   label: "国家：",
                //   placeholder: "--",
                //   type: "txt"
                // },
                {
                  span: 8,
                  id: "argCabinetCreateTime",
                  label: "创建时间：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "argCabinetRemark",
                  label: "备注信息：",
                  placeholder: "--",
                  type: "txt",
                  tipWidth: "600px",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const eCommerceOperate = (row = {}) => {
  const extraFrom = row.routeDataId
    ? routeOrderInfo({
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
      fieldList: [
        { ...(row.orderType == 2 ? ecBasicInfo : tranditionBasicInfo) },
        {
          ...(row.orderType == 2 ? ecContactsConfig : tranditionContactsConfig),
        },
        ...extraFrom,
        ...sortBoxFrom,
      ],
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
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "code",
                  label: "报关编号：",
                  placeholder: "--",
                  type: "slot",
                },
                {
                  span: 8,
                  id: "shortName",
                  label: "报关行：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "dcNumbers",
                  label: "报关单号：",
                  placeholder: "--",
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
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "releaseTime",
                  label: "放行日期：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "accessory",
                  label: "附件资料：",
                  type: "slot",
                  disable: true,
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

export const billConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 4,
                  id: "platform",
                  label: "应付：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "custNo",
                  label: " 实付：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "ys",
                  label: "应收：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "ss",
                  label: "实收：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "skl",
                  label: "收款率：",
                  placeholder: "--",
                  type: "txt",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const billColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    label: "类型",
    prop: "type",
    showOverflowTooltip: true,
  },
  {
    label: "费用名称",
    prop: "feeName",
    showOverflowTooltip: true,
  },
  {
    label: "往来单位",
    prop: "wldw",
    showOverflowTooltip: true,
  },
  {
    label: "币种",
    prop: "bz",
    showOverflowTooltip: true,
  },
  {
    label: "金额",
    prop: "money",
    showOverflowTooltip: true,
  },
  {
    label: "单价",
    prop: "dj",
    showOverflowTooltip: true,
  },
  {
    label: "数量",
    prop: "num",
    showOverflowTooltip: true,
  },
  {
    label: "备注",
    prop: "remark",
    showOverflowTooltip: true,
  },
  {
    label: "状态",
    prop: "zt",
    showOverflowTooltip: true,
  },
  {
    label: "创建时间",
    prop: "cjsj",
    showOverflowTooltip: true,
  },
  {
    prop: "operation",
    label: "操作",
    showOverflowTooltip: true,
    width: 100,
    customRow: true,
    fixed: "right",
  },
];

export const relCargoConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "放货信息",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "operationOrderNum",
                  label: "操作工作单：",
                  placeholder: "--",
                  type: "slot",
                },
                {
                  span: 8,
                  id: "bailorPeople",
                  label: "委托人：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "hBlNo",
                  label: "H B/L No.：",
                  placeholder: "--",
                  type: "slot",
                  basicType: "freightType",
                  basicTypeVal: "freightType",
                },
                {
                  span: 8,
                  id: "shipCompany",
                  label: "航空/船公司：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "issuingMethod",
                  label: "签发方式：",
                  type: "txt",
                  basicType: "issuingMethod",
                  render: (rows, dics) => {
                    return dics;
                  },
                },
                {
                  span: 8,
                  id: "destinationPort",
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "accountCycle",
                  label: "结算方式：",
                  type: "txt",
                  basicType: "accountCycle",
                  render: (rows, dics) => {
                    return dics;
                  },
                },
                {
                  span: 8,
                  id: "releaseMethod",
                  label: "放单方式：",
                  type: "txt",
                  basicType: "releaseMethod",
                  render: (rows, dics) => {
                    return dics;
                  },
                },
                {
                  span: 8,
                  id: "takeMethod",
                  label: "取单方式：",
                  type: "txt",
                  basicType: "takeMethod",
                  render: (rows, dics) => {
                    return dics || "--";
                  },
                },
                {
                  span: 8,
                  id: "customerExpress",
                  label: "寄客户快递：",
                  type: "txt",
                  basicType: "express",
                  render: (rows, dics) => {
                    return dics
                      ? `${dics}${" " + rows.customerExpressNum}`
                      : "--";
                  },
                },
                {
                  span: 8,
                  id: "filialeExpress",
                  label: "寄分公司快递：",
                  type: "txt",
                  basicType: "express",
                  render: (rows, dics) => {
                    return dics
                      ? `${dics}${" " + rows.filialeExpressNum}`
                      : "--";
                  },
                },
                {
                  span: 8,
                  id: "isPrintTakeEntrust",
                  text: "--",
                  type: "txt",
                  render: (rows) => {
                    return `${
                      rows.isPrintTakeEntrust
                        ? "取单委托书已打印"
                        : "取单委托书未打印"
                    }`;
                  },
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  type: "txt",
                  tipWidth: "600px",
                },
                {
                  span: 24,
                  id: "attachId",
                  label: "附件资料：",
                  type: "slot",
                  disable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const detnCargoConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "扣货管理",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "code",
                  label: "扣货编号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "type",
                  label: "扣货类型：",
                  placeholder: "--",
                  type: "txt",
                  basicType: "docType",
                },
                {
                  span: 8,
                  id: "registerNo",
                  label: "关联整柜编号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "salesman_name",
                  label: "跟进业务员：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "company",
                  label: "扣货单位：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "detainTime",
                  label: "扣货时间：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "operationOrderNum",
                  label: "工作单：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "releaseTime",
                  label: "放货时间：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "agent",
                  label: "订舱代理：",
                  placeholder: "--",
                  type: "txt",
                },
                // {
                //   span: 8,
                //   id: "shipCompany",
                //   label: "船公司：",
                //   placeholder: "--",
                //   type: "txt",
                // },
                {
                  span: 8,
                  id: "operator_name",
                  label: "跟进操作员：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明",
                  placeholder: "--",
                  type: "txt",
                  tipWidth: "600px",
                },
                {
                  span: 24,
                  id: "accessory",
                  label: "附件资料：",
                  type: "slot",
                  disable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
