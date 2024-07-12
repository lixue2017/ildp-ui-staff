import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";
import overseaLangObj from "@/language/overseasLang.js";

const FORM_COLS_1 = {
  span: 6,
  id: "agentName",
  label: `${overseaLangObj.qg_hw_dl || "清关海外代理"}：`,
  type: "txt",
};
const FORM_COLS_2 = {
  span: 6,
  id: "customsBrokerName",
  label: `${overseaLangObj.qgh_customs_clearance || "清关行"}：`,
  type: "txt",
};
const FORM_COLS_3 = {
  span: 6,
  id: "delivertAgentType",
  label: `${overseaLangObj.ps_type("派送代理类型")}：`,
  type: "radio",
  disable: true,
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const FORM_COLS_4 = {
  span: 6,
  id: "deliverAgentName",
  label: "派送海外代理：",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 6,
  id: "warehouseName",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
};
const FORM_COLS_6 = {
  span: 6,
  id: "freightType",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType",
  disable: true,
};
// 清关信息
const FORM_COLS_1_1 = {
  span: 6,
  id: "directClearanceOrderDetail_agentType",
  label: "清关代理类型：",
  type: "radio",
  disable: true,
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const FORM_COLS_1_2 = {
  span: 6,
  id: "directClearanceOrderDetail_declareTime",
  label: `${overseaLangObj.sb_rq_date || "申报日期"}：`,
  type: "txt",
};
const FORM_COLS_1_3 = {
  span: 6,
  id: "directClearanceOrderDetail_pod",
  label: "POD：",
  type: "txt",
  basicType: "pod",
};
const FORM_COLS_1_4 = {
  span: 6,
  id: "directClearanceOrderDetail_airlineCompanyName",
  label: `${overseaLangObj.cgs_hk_gs || "船/航空公司"}：`,
  type: "txt",
};
const FORM_COLS_1_5 = {
  span: 6,
  id: "directClearanceOrderDetail_mblNum",
  label: `${overseaLangObj.mbl_no || "MBL号"}：`,
  type: "txt",
};
const FORM_COLS_1_6 = {
  span: 6,
  id: "directClearanceOrderDetail_registerNo",
  label: `${overseaLangObj.xh_container_no || "箱号"}：`,
  type: "txt",
};
const FORM_COLS_1_7 = {
  span: 6,
  id: "directClearanceOrderDetail_pdo",
  label: "DO：",
  type: "txt",
  basicType: "do",
};
const FORM_COLS_1_8 = {
  span: 6,
  id: "directClearanceOrderDetail_customsReleaseTime",
  label: `${overseaLangObj.customs_release_date || "海关放行日期"}：`,
  type: "txt",
};
const FORM_COLS_1_9 = {
  span: 6,
  id: "directClearanceOrderDetail_startPortName",
  label: `${overseaLangObj.qy_gk || "起运港"}：`,
  type: "txt",
};
const FORM_COLS_1_10 = {
  span: 6,
  id: "directClearanceOrderDetail_endPortName",
  label: `${overseaLangObj.md_gk || "目的港"}：`,
  type: "txt",
};
const FORM_COLS_1_11 = {
  span: 6,
  id: "directClearanceOrderDetail_flightName",
  label: `${overseaLangObj.carrier_vessel || "船名/航名"}：`,
  type: "txt",
};
const FORM_COLS_1_12 = {
  span: 6,
  id: "directClearanceOrderDetail_voyageNumber",
  label: `${overseaLangObj.voyage_flight || "船次/航次"}：`,
  type: "txt",
};
const FORM_COLS_1_13 = {
  span: 6,
  id: "directClearanceOrderDetail_reachTime",
  label: "ETA：",
  type: "txt",
};
const FORM_COLS_1_14 = {
  span: 6,
  id: "directClearanceOrderDetail_departureTime",
  label: "ETD：",
  type: "txt",
};
const FORM_COLS_1_15 = {
  span: 24,
  id: "directClearanceOrderDetail_remark",
  label: `${overseaLangObj.qg_bz || "清关备注"}：`,
  type: "txt",
};
const FORM_COLS_1_16 = {
  span: 6,
  id: "transportMode",
  label: `运输方式：`,
  type: "txt",
  basicType:"headTransportMode"
};
const FORM_COLS_1_17 = {
  span: 6,
  id: "registerNo",
  label: `箱号：`,
  type: "txt",
};
// 派送登记
const FORM_COLS_2_1 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_delivertAgentType",
  label: "派送代理类型：",
  type: "radio",
  disable: true,
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const FORM_COLS_2_2 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_logisticsChannelName",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  type: "txt",
};
const FORM_COLS_2_3 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_deliveryPlaceName",
  label: `${overseaLangObj.place_delivery || "发货地"}：`,
  type: "txt",
};
const FORM_COLS_2_3_1 = {
  span: 6,
  id: "deliveryPlaceType",
  label: `${overseaLangObj.fhd_type || "发货地类型"}：`,
  showTag: true,
  type: "slot",
  tagId: "deliveryClearanceOrderDeatail_deliveryPlaceType",
  tagColor: "#35D06F",
  basicType: "clearanceDeliveryPlaceType",
};
const FORM_COLS_2_4 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_isInsure",
  type: "singleCheckbox",
  text: overseaLangObj.insurance_services || "保险服务",
  disabled: true,
};
const FORM_COLS_2_5 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_amazonDeliveryNumber",
  label: "Shipment ID：",
  type: "txt",
};
const FORM_COLS_2_6 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_amazonReferenceNumber",
  label: "Amazon参考号：",
  type: "txt",
};
const FORM_COLS_2_7 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_platformStore",
  label: `${overseaLangObj.platform_store || "平台店铺"}：`,
  type: "txt",
};
const FORM_COLS_2_8 = {
  span: 6,
  id: "deliveryClearanceOrderDeatail_referenceNumber",
  label: `${overseaLangObj.ck_bm || "参考号"}：`,
  type: "txt",
};
const FORM_COLS_2_9 = {
  span: 24,
  id: "deliveryClearanceOrderDeatail_deliveryPlaceAddress",
  label: `${overseaLangObj.fhd_dz || "发货地地址"}：`,
  type: "txt",
};
const FORM_COLS_2_10 = {
  span: 24,
  id: "deliveryClearanceOrderDeatail_remark",
  label: `${overseaLangObj.ps_remark || "派送备注"}：`,
  type: "txt",
};
// 存仓入库
const FORM_COLS_3_1 = {
  span: 6,
  id: "warehouseOrderDetailVo_warehouseSourceName",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  type: "txt",
  // type: "multiCheckbox",
  // basicType: "warehousingSource",
  // disable: true
};
const FORM_COLS_3_2 = {
  span: 6,
  id: "warehouseOrderDetailVo_intendDevannTime",
  label: `${overseaLangObj.yj_tcg || "预计提拆柜"}：`,
  type: "txt",
};
const FORM_COLS_3_3 = {
  span: 6,
  id: "warehouseOrderDetailVo_traceNumber",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  type: "txt",
};
const FORM_COLS_3_4 = {
  span: 6,
  id: "warehouseOrderDetailVo_referenceNumber",
  label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  type: "txt",
};
const FORM_COLS_3_5 = {
  span: 24,
  id: "warehouseOrderDetailVo_remark",
  label: "入仓备注：",
  type: "txt",
};

const comForm = (types = []) => {
  const typeConfig = {
    1: [FORM_COLS_1, FORM_COLS_2],
    2: [FORM_COLS_3], // FORM_COLS_4
    3: [FORM_COLS_5], //FORM_COLS_6
  };
  const list = [];
  types.forEach((type) => {
    list.push(...typeConfig[type]);
  });
  return list;
};

const customsClearance_1 = [
  // FORM_COLS_1_1,
  FORM_COLS_1_2,
  FORM_COLS_1_3,
  FORM_COLS_1_4,
  FORM_COLS_1_5,
  FORM_COLS_1_6,
  FORM_COLS_1_7,
  FORM_COLS_1_8,
];
const customsClearance_2 = [
  FORM_COLS_1_9,
  FORM_COLS_1_10,
  FORM_COLS_1_11,
  FORM_COLS_1_12,
  FORM_COLS_1_13,
  FORM_COLS_1_14,
  FORM_COLS_1_15,
];

const delivery = ({pageType="",freightType})=>{
  return[
      // FORM_COLS_2_1,
  FORM_COLS_2_2,
  FORM_COLS_2_3,
  FORM_COLS_2_3_1,
  FORM_COLS_2_4,
  FORM_COLS_2_5,
  // FORM_COLS_2_6,
  FORM_COLS_2_7,
  FORM_COLS_2_8,
  ...(pageType==2?[FORM_COLS_1_16]:[]),
  ...(freightType==1?[]:[FORM_COLS_1_17]),
  FORM_COLS_2_9,
  FORM_COLS_2_10,
  ]
}

const warehousing = [
  FORM_COLS_3_1,
  FORM_COLS_3_2,
  FORM_COLS_3_3,
  FORM_COLS_3_4,
  // FORM_COLS_3_5
];


const sfc = {
  rowClassName: "form-rows-box",
  rows: [
    {
      cols: [
        {
          ...contactsOperationAddress(),
          label: overseaLangObj.fhr_shipper || "发货人",
          id: "cusConsigner_address",
          txtObjKey: "cusConsigner",
        },
        {
          ...contactsOperationAddress(12),
          label: overseaLangObj.shr_consignee || "收货人",
          id: "cusConsignee_address",
          txtObjKey: "cusConsignee",
        },
        {
          ...contactsOperationAddress(),
          label: overseaLangObj.tzr_notifier || "通知人",
          id: "cusNotifier_address",
          txtObjKey: "cusNotifier",
        },
      ],
    },
  ],
};

const typeConfig =({pageType="",freightType=0})=>{
  return{
    1: {
      title: overseaLangObj.qg_customs_clearance("清关信息"),
      basicList: customsClearance_1,
      lists: [...customsClearance_1, ...customsClearance_2],
      lists2: [...customsClearance_2],
    },
    2: {
      title: "派送登记",
      lists: delivery({pageType,freightType}),
    },
    3: {
      title: "存仓入库",
      lists: warehousing,
    },
  };
}

export const basicForm = ({ pageType, types = [], isBasic,freightType=0 }) => {
  let fieldList = [];
  if (isBasic) {
    const { basicList, lists } = typeConfig({pageType,freightType})[pageType];
    fieldList = [
      {
        rows: [
          {
            cols: [
              ...comForm(types),
              ...(basicList || lists),
              ],
          },
        ],
      },
      ...(types.length === 1 && pageType !== 1
        ? [{ ...sfc, className: "border-top-solid" }]
        : []),
    ];
  } else {
    fieldList = types.map((type) => {
      const { title, lists, lists2 } = typeConfig({})[type];
      return {
        title: title,
        rows: [
          {
            cols: pageType === 1 && type === 1 ? lists2 : lists,
          },
        ],
      };
    });
    fieldList.push(sfc);
  }
  return [{ fieldList }];
};

export const cardConfig = [
  {
    labelColor: "#80B1FF",
    color: "#5094FF",
    bgColor: "#ECF3FF",
    icon: "yunshu1",
    list: [
      {
        prop: "jobNo",
      },
      {
        prop: "countryName",
        label: `${overseaLangObj.mdg_country || "目的国"}：`,
        labelWidth: "48px",
      },
    ],
  },
  {
    labelColor: "#FF985C",
    color: "#FF813D",
    bgColor: "#FFF3EC",
    list: [
      {
        prop: "bailorPeopleName",
        label: `${overseaLangObj.wtr_customer || "委托人"}：`,
        dictVal: "freightType",
      },
      {
        prop: "businessUnitName",
        label: `${overseaLangObj.yw_unit || "业务单位"}：`,
      },
    ],
  },
  {
    labelColor: "#B1B1FF",
    color: "#7676FF",
    bgColor: "#ECECFF",
    labelWidth: "38px",
    list: [
      {
        labelWidth: "auto",
        label: overseaLangObj.hj_ys_yf || "合计应收/应付(RMB)",
      },
      {
        prop: "totalReceiveRMB",
        label: `${overseaLangObj.ys_receivable || "应收"}：`,
        type: "formatMoney",
        decimals: 2,
      },
      {
        prop: "totalPayRMB",
        label: `${overseaLangObj.yf_meet || "应付"}：`,
        type: "formatMoney",
        decimals: 2,
      },
    ],
  },
  {
    labelColor: "#64CFFF",
    color: "#13B5FF",
    bgColor: "#D2F1FF",
    labelWidth: "38px",
    list: [
      {
        labelWidth: "auto",
        label: overseaLangObj.hj_ss_sf || "合计实收/实付(RMB)",
      },
      {
        prop: "totalRealityReceiveRMB",
        label: `${overseaLangObj.sh_net_receipts || "实收"}：`,
        type: "formatMoney",
        decimals: 2,
      },
      {
        prop: "totalRealityPayRMB",
        label: `${overseaLangObj.sh_actual_payment || "实付"}：`,
        type: "formatMoney",
        decimals: 2,
      },
    ],
  },
];

export const overSeaCardConfig = [
  //海外入仓card
  {
    labelColor: "#80B1FF",
    color: "#5094FF",
    bgColor: "#ECF3FF",
    labelWidth: "60px",
    list: [
      {
        prop: "bailorPeopleName",
        label: `${overseaLangObj.wtr_customer || "委托人"}：`,
      },
      {
        prop: "countryName",
        label: `${overseaLangObj.mdg_country || "目的国"}：`,
      },
    ],
  },
  {
    labelColor: "#FF985C",
    color: "#FF813D",
    bgColor: "#FFF3EC",
    labelWidth: "60px",
    list: [
      {
        prop: "nlCode",
        label: `${overseaLangObj.nl_no || "NL单号"}：`,
      },
      {
        prop: "jobNo",
        label: `${overseaLangObj.gz_dh || "工作单号"}：`,
      },
    ],
  },
  {
    labelColor: "#B1B1FF",
    color: "#7676FF",
    bgColor: "#ECECFF",
    labelWidth: "38px",
    list: [
      {
        labelWidth: "auto",
        label: overseaLangObj.hj_ys_yf,
      },
      {
        prop: "totalReceiveRMB",
        label: `${overseaLangObj.ys_receivable || "应收"}：`,
        type: "formatMoney",
        decimals: 2,
      },
      {
        prop: "totalPayRMB",
        label: `${overseaLangObj.yf_meet || "应付"}：`,
        type: "formatMoney",
        decimals: 2,
      },
    ],
  },
  {
    labelColor: "#64CFFF",
    color: "#13B5FF",
    bgColor: "#D2F1FF",
    labelWidth: "38px",
    list: [
      {
        labelWidth: "auto",
        label: overseaLangObj.hj_ss_sf,
      },
      {
        prop: "totalRealityReceiveRMB",
        label: "实收：",
        label: `${overseaLangObj.sh_net_receipts || "实收"}：`,
        type: "formatMoney",
        decimals: 2,
      },
      {
        prop: "totalRealityPayRMB",
        label: `${overseaLangObj.sh_actual_payment || "实付"}：`,
        type: "formatMoney",
        decimals: 2,
      },
    ],
  },
];
