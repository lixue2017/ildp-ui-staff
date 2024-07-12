import {
  httpCurrentWarehouseSelect,
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import {
  httpLogisticsCustomerSelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import { getUserList } from "@/api/common.js";
import overseaLangObj from "@/language/overseasLang.js";
// 过程记录/自提信息

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "customerId",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  ...httpCustomerSelect(),
  // type: "autocomplete",
  // searchParamName: 'companyNameCn',
  // httpRequest: getUserList,
  // defaultProp: {
  // 	value: 'Id',
  // 	label: 'companyNameCn'
  // }
};
const SEARCH_COL_3 = {
  id: "businessSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "trackingNumber",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "receivingAddress",
  label: `${overseaLangObj.md_c_dz("收件地址")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  id: "businessTypeList",
  label: `${overseaLangObj.yw_type || "业务类型"}：`,
  placeholder: "请选择（多选）",
  multiple: true,
  type: "select",
  basicType: "distributionBusinessType",
};
const SEARCH_COL_7 = {
  id: "UNCHARTED_SEARCH_9",
  label: "物流产品：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_8 = {
  id: "destinationId",
  label: "目的仓：",
  label: `${overseaLangObj.mdc_warehouse() || "目的仓"}：`,
  ...httpWarehousePublicSelect({ typeList: "2,3" }),
};
const SEARCH_COL_9 = {
  id: "traySn",
  label: `${overseaLangObj.pallet_number("托盘号")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "outboundWmsId",
  label: `${overseaLangObj.ck_lb("所在仓库")}：`,
  ...httpCurrentWarehouseSelect(),
};
const SEARCH_COL_11 = {
  id: "affiliatedCompanyId",
  label: `${overseaLangObj.ss_gs("所属公司")}：`,
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_12 = {
  id: "pickupCode",
  label: `${overseaLangObj.zt_hm || "自提码"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_13 = {
  id: "UNCHARTED_SEARCH_15",
  label: "卡车公司：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_14 = {
  id: "carSn",
  label: `${overseaLangObj.cp_hm || "车牌号"}：`,
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COL_15 = {
  id: "overseasDeliveryChannelId",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  ...httpDeliveryChannelSelect(),
};
const SEARCH_TAB_1 = [
  SEARCH_COL_1, //创建时间
  SEARCH_COL_2, //委托人
  SEARCH_COL_3, //工作单号
  SEARCH_COL_5, //收件地址
  SEARCH_COL_6, //业务类型
  SEARCH_COL_4, //跟踪号
  SEARCH_COL_15, //派送渠道
  SEARCH_COL_8, //目的仓
  SEARCH_COL_9, //托盘号
  SEARCH_COL_10, //所在仓库
  SEARCH_COL_11, //所属公司
];
const SEARCH_TAB_2 = [
  SEARCH_COL_1, //创建时间
  SEARCH_COL_2, //委托人
  SEARCH_COL_3, //工作单号
  SEARCH_COL_12, //自提码
  SEARCH_COL_6, //业务类型
  SEARCH_COL_14, //车牌号
  SEARCH_COL_15, //派送渠道
  SEARCH_COL_8, //目的仓
  SEARCH_COL_9, //托盘号
  SEARCH_COL_10, //所在仓库
  SEARCH_COL_11, //所属公司
];
export const searchColumns = (idx) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_TAB_1, SEARCH_TAB_2][idx],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "businessSn",
  label: overseaLangObj.gz_dh || "工作单号",
  // customRow: true,
  fixed: "left",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_1_1 = {
  prop: "trackingNumber",
  label: overseaLangObj.gn_djh || "国内登记号",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "businessType",
  label: overseaLangObj.yw_type || "业务类型",
  minWidth: 140,
  basicType: "distributionBusinessType",
  fontColor: true,
  sortable: true,
};
const TABLE_COL_3 = {
  prop: "receivingCode",
  label: "收件信息",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    return `${row?.name}[${row?.phone}]`;
  },
};
const TABLE_COL_4 = {
  prop: "detailsAddr",
  label: "收件地址",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "tname",
  label: "派送渠道",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "productType",
  label: "SKU类数",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "productTotal",
  label: "产品数量",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "scheduledTime",
  label: "登记时间",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number("托盘号"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_11 = {
  prop: "trackingNumber",
  label: overseaLangObj.tracking_no || "跟踪号",
  minWidth: 100,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_12 = {
  prop: "overseasDeliveryChannelName",
  label: overseaLangObj.ps_qd || "派送渠道",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_13 = {
  prop: "totalWeight",
  label: overseaLangObj.dx_weight("单件重量(KG)"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_14 = {
  prop: "totalVolume",
  label: overseaLangObj.dx_tj_volume("单件体积(m³)"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 2,
};

const TABLE_COL_15 = {
  prop: "forecastTime",
  label: overseaLangObj.yb_time || "预报时间",
  minWidth: 160,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_16 = {
  prop: "verificationTime",
  label: overseaLangObj.hs_time || "核实时间",
  minWidth: 160,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_17 = {
  prop: "forecastNum",
  label: overseaLangObj.yb_sl || "预报数量",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_18 = {
  prop: "verificationNum",
  label: overseaLangObj.hs_sl("核实数量"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_19 = {
  prop: "registrationNum",
  label: overseaLangObj.ydj_sl || "已登记数量",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_20 = {
  prop: "destinationType",
  label: overseaLangObj.mdd_type || "目的地类型",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "destinationType",
  sortable: true,
};

const TABLE_COL_21 = {
  prop: "wmsCode",
  label: overseaLangObj.mdd_code("目的仓编码"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_22 = {
  prop: "destinationCountryCode",
  label: overseaLangObj.mdg_country || "目的国",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  render: (r) =>
    `${r.destinationCountryCode || ""}[${r.destinationCountryName || "--"}]`,
};
const TABLE_COL_23 = {
  prop: "receivingInfo",
  label: overseaLangObj.sj_info() || "收件信息",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_24 = {
  prop: "receivingAddress",
  label: overseaLangObj.md_c_dz("收件地址"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_25 = {
  prop: "totalSkuNum",
  label: overseaLangObj.sku_num() || "SKU数",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  sortable: true,
};
const TABLE_COL_26 = {
  prop: "remark",
  label: overseaLangObj.bz_remark("备注"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_27 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  width: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_28 = {
  prop: "outboundWmsName",
  label: overseaLangObj.ck_lb("所在仓库"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_29 = {
  prop: "affiliatedCompanyName",
  label: overseaLangObj.ss_gs("所属公司"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_30 = {
  prop: "state",
  label: overseaLangObj.hw_zt || "货物状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionPlanState",
  dotColor: true,
  fixed: "right",
  sortable: true,
};

const TABLE_COL_31 = {
  prop: "num",
  label: overseaLangObj.bc_jhs || "本次计划数",
  minWidth: 110,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_32 = {
  prop: "expressCompanyName",
  label: overseaLangObj.kd_gs("卡车公司/快递公司"),
  minWidth: 160,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_33 = {
  prop: "pickupCode",
  label: overseaLangObj.zt_hm || "自提码",
  minWidth: 120,
  sortable: true,
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COL_34 = {
  prop: "carSn",
  label: overseaLangObj.cp_hm || "车牌号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_35 = {
  prop: "infoState",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionPlanKdState",
  dotColor: true,
  fixed: "right",
  sortable: true,
};
const TABLE_COL_36 = {
  prop: "num",
  label: overseaLangObj.jh_num || "计划数量",
  minWidth: 110,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_37 = {
  prop: "sortTime",
  label: overseaLangObj.kap_time || "可安排时间",
  width: 132,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_38 = {
  prop: "predictPickupTime",
  label: "预计提货时间",
  minWidth: 140,
  showOverflowTooltip: true,
  sortable: true,
};


const TABLE_COL_OPERATION = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: 180,
};

const TABLE_TAB_1 = [
  TABLE_COL_INDEX,
  TABLE_COL_SELECTION,
  TABLE_COL_1, //工作单号
  TABLE_COL_2, //业务类型
  TABLE_COL_10, //托盘号
  TABLE_COL_12, //派送渠道
  TABLE_COL_11, //跟踪号
  TABLE_COL_13, //单件重量
  TABLE_COL_14, //单件体积
  TABLE_COL_20, //目的地类型
  TABLE_COL_21, //目的仓编码
  TABLE_COL_22, //目的国
  TABLE_COL_23, //收件信息
  TABLE_COL_24, //收件地址
  TABLE_COL_25, //SKU数
  TABLE_COL_26, //备注
  TABLE_COL_8, //委托人
  TABLE_COL_27, //创建时间
  TABLE_COL_28, //所在仓库
  TABLE_COL_29, //所属公司
  // TABLE_COL_1_1, // 国内登记号
  // TABLE_COL_37, // 可安排时间
  // TABLE_COL_15, //预报时间
  // TABLE_COL_16, //核实时间
  // TABLE_COL_31, //本次计划数
  // TABLE_COL_17, //预报数量
  // TABLE_COL_18, //核实数量
  // TABLE_COL_19, //已登记数量

  TABLE_COL_30, //货物状态
  TABLE_COL_OPERATION,
];
const TABLE_TAB_2 = [
  TABLE_COL_INDEX,
  TABLE_COL_1, //工作单号
  TABLE_COL_32, //卡车快递公司
  TABLE_COL_38,//预计提货时间
  TABLE_COL_33, //自提码
  TABLE_COL_34, //车牌号
  TABLE_COL_2, //业务类型
  TABLE_COL_10, //托盘号
  TABLE_COL_12, //派送渠道
  TABLE_COL_11, //跟踪号
  TABLE_COL_13, //单件重量
  TABLE_COL_14, //单件体积
  TABLE_COL_20, //目的地类型
  TABLE_COL_21, //目的仓编码
  TABLE_COL_22, //目的国
  TABLE_COL_23, //收件信息
  TABLE_COL_24, //收件地址
  TABLE_COL_25, //SKU数
  TABLE_COL_26, //备注
  TABLE_COL_8, //委托人
  TABLE_COL_27, //创建时间
  TABLE_COL_28, //所在仓库
  TABLE_COL_29, //所属公司
  // TABLE_COL_1_1, // 国内登记号
  // TABLE_COL_36, //计划数量
  TABLE_COL_30, //货物状态
  TABLE_COL_35, //状态
  {
    ...TABLE_COL_OPERATION,
    width:80
  }
];
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1, TABLE_TAB_2][tab];
};

const EDIT_DLG_COL_1 = {
  span: 24,
  id: "businessType",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  type: "slot",
  basicType: "distributionBusinessType",
  // dicsStr: 'deliveryDic',
  // customDicsArr: [0, 1, 2],
  // basicType: "labelingBusinessType",
};
const EDIT_DLG_COL_2 = {
  span: 12,
  id: "expressCompanyName",
  label: `${overseaLangObj.kd_gs("快递公司")}：`,
  placeholder: "卡车公司/快递公司",
  type: "text",
};
const EDIT_DLG_COL_3 = {
  span: 12,
  id: "pickupCode",
  label: `${overseaLangObj.zt_hm || "自提码"}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_4 = {
  span: 12,
  id: "carSn",
  label: `${overseaLangObj.cp_hm || "车牌号"}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_5 = {
  span: 12,
  id: "predictPickupTime",
  label: '预计提货日期：',
  placeholder: "日期",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const EDIT_DLG_COL_6 = {
  span: 7,
  id: "pickupPeople",
  label: `${overseaLangObj.sj_ry("收件人信息")}：`,
  placeholder: overseaLangObj.sj_ry("姓名"),
  type: "slot",
};
const EDIT_DLG_COL_6_2 = {
  span: 5,
  id: "pickupPhone",
  labelWidth:"0px",
  placeholder: overseaLangObj.lx_dh_telephone("手机号"),
  type: "slot",
};
const EDIT_DLG_COL_7 = {
  span: 24,
  id: "pickupAddress",
  label: `${overseaLangObj.sj_info("收件人地址")}：`,
  placeholder: "请输入",
  type: "textarea",
  maxlength: 500,
};
const EDIT_DLG_COL_8 = {
  span: 24,
  id: "bzxx",
  label: "备注信息：",
  type: "textarea",
};
const EDIT_DLG_COL_9 = {
  span: 24,
  id: "attachId",
  labelWidth: "10px",
  type: "customUploadFile",
};
const EDIT_DLG_COL_10 = {
  span: 12,
  id: "pickupTime",
  label: '实际提货日期：',
  placeholder: "请选择",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const EDIT_DLG_COL_11 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};


const EDIT_DLG_FORM_COLS=(row)=>{
  const {activeName}=row
  return {
    columns: [
      EDIT_DLG_COL_3,//自提码
      EDIT_DLG_COL_5,//提货日期
      EDIT_DLG_COL_2,//快递公司
      ...(activeName==2?[EDIT_DLG_COL_10]:[]),//实际提货日期
      EDIT_DLG_COL_4,//车牌号
      EDIT_DLG_COL_6,//收件人信息
      EDIT_DLG_COL_6_2,//手机号
      EDIT_DLG_COL_7,//收件人地址
      EDIT_DLG_COL_11,//表格
      EDIT_DLG_COL_9,//图片上传
    ],
    formRules:activeName==1?
    {
      expressCompanyName: [
        { required: true, message: "请输入快递公司", trigger: "change" },
      ],
    }: {
      expressCompanyName: [
        { required: true, message: "请输入快递公司", trigger: "change" },
      ],
      pickupTime: [
        { required: true, message: "请选择实际提货日期", trigger: "change" },
      ],
    },
  }
}

export const DETAILS_DLG_FORM_COLS = () => {
  const arr=[
    EDIT_DLG_COL_3,//自提码
    EDIT_DLG_COL_5,//提货日期
    EDIT_DLG_COL_2,//快递公司
    EDIT_DLG_COL_10,//实际提货日期
    EDIT_DLG_COL_4,//车牌号
    {
      ...EDIT_DLG_COL_6,
      span:12
    },//收件人信息
    {
      ...EDIT_DLG_COL_6_2,
      span:12,
      labelWidth:'110px',
      label:`${overseaLangObj.lx_dh_telephone("手机号")}：`,
    },//手机号
    EDIT_DLG_COL_7
  ]
  const arrResult=arr.map((e)=>{
    return {
      ...e,
      type:'txt',
      placeholder:'--'
    }
  })
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...arrResult,
                EDIT_DLG_COL_11,
                {
                  span: 24,
                  id: "attachId",
                  label: "",
                  labelWidth: "0px",
                  type: "customUploadFile",
                  disable: true,
                }
              ]
            },
          ],
        },
      ],
    },
  ];
};


const EDIT_DLG_TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left"
}

const EDIT_DLG_TABLE_COL_1 = {
  prop: "businessSn",
  label: "工作单号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_DLG_TABLE_COL_2 = {
  prop: "businessType",
  label: "业务类型",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType:"distributionBusinessType",
  fontColor:true,
};
const EDIT_DLG_TABLE_COL_3 = {
  prop: "num",
  label: "本次计划数",
  minWidth: 120,
  showOverflowTooltip: true,
};
export const EDIT_DLG_TABLE_COLS = [
  EDIT_DLG_TABLE_COL_INDEX,
  EDIT_DLG_TABLE_COL_1,
  EDIT_DLG_TABLE_COL_2,
  EDIT_DLG_TABLE_COL_3
]

export const editDlgFormCols = (row) => EDIT_DLG_FORM_COLS(row);
