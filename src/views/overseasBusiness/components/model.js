import {
  httpCountrySelect,
  httpCustomerSelect,
  httpUserSelect,
  httpEnterprisetSelect,
  shipCompanyList,
  httpPortPublicSelect,
} from "@/comModel/httpSelect";
import {
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "nlCode",
  label: "清关单号：",
  placeholder: "清关单号",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "bailorPeopleId",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  ...httpCustomerSelect(),
};
const SEARCH_COLS_4 = {
  id: "salesman",
  label: `${overseaLangObj.ywy_salesman || "业务员"}：`,
  ...httpUserSelect(),
};
const SEARCH_COLS_5 = {
  id: "customsBroker",
  label: "清关行：",
  placeholder: "清关行",
  ...httpEnterprisetSelect({ typeList: "3" }),
};
const SEARCH_COLS_6 = {
  id: "createBy",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
  defaultProp: {
    value: "userName",
    label: "userName,nickName",
  },
};
const SEARCH_COLS_7 = {
  id: "airlineCompany",
  label: "船/航空公司：",
  placeholder: "船/航空公司",
  ...shipCompanyList(),
};
const SEARCH_COLS_8 = {
  id: "countryId",
  label: `${overseaLangObj.mdg_country || "目的国"}：`,
  ...httpCountrySelect,
};
const SEARCH_COLS_9 = {
  id: "customsRleaseTime",
  label: "放行时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_10 = {
  id: "pdo",
  label: "DO：",
  placeholder: "DO",
  type: "select",
  basicType: "do",
};
const SEARCH_COLS_11 = {
  id: "pod",
  label: "POD：",
  placeholder: "POD",
  type: "select",
  basicType: "pod",
};
const SEARCH_COLS_12 = {
  id: "freightType",
  label: "装箱方式：",
  placeholder: "装箱方式",
  type: "select",
  basicType: "freightType",
};
const SEARCH_COLS_13 = {
  id: "flightName",
  label: "船名/航名：",
  placeholder: "船名/航名",
  type: "text",
};
const SEARCH_COLS_14 = {
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "船次/航次",
  type: "text",
};
const SEARCH_COLS_15 = {
  id: "registerNo",
  label: "箱号：",
  placeholder: "箱号",
  type: "text",
};
const SEARCH_COLS_16 = {
  id: "mblNum",
  label: "MBL：",
  placeholder: "MBL",
  type: "text",
};
const SEARCH_COLS_17 = {
  id: "logisticsChannelId",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  placeholder: "请选择",
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COLS_18 = {
  id: "warehouseId",
  label: "目的仓：",
  placeholder: "目的仓",
  ...httpWarehousePublicSelect({
    typeList: "2",
    isHaveComId: 1,
    flagAvailable: "h",
  }),
};
const SEARCH_COLS_19 = {
  id: "status",
  label: "清关状态：",
  type: "select", // 选择框
  // multiple: true,
  placeholder: "状态",
  basicType: "clearanceStatus",
};
const SEARCH_COLS_20 = {
  id: "deliveryPlaceType",
  label: `${overseaLangObj.fhd_type || "发货地类型"}：`,
  type: "select", // 选择框
  placeholder: "请选择",
  basicType: "clearanceDeliveryPlaceType",
};
const SEARCH_COLS_21 = {
  id: "amazonDeliveryNumber",
  label: `${overseaLangObj.amazon_fhh || "Amazon发货号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_22 = {
  id: "amazonReferenceNumber",
  label: "Amazon参考号：",
  placeholder: "Amazon参考号",
  type: "text",
};
const SEARCH_COLS_23 = {
  id: "platformStore",
  label: `${overseaLangObj.platform_store || "平台店铺"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_24 = {
  id: "referenceNumber",
  label: `${overseaLangObj.ck_bm || "参考号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_25 = {
  id: "devlieryStatus",
  label: `${overseaLangObj.zt_status_fn("派送状态")}：`,
  type: "select", // 选择框
  // multiple: true,
  placeholder: "状态",
  basicType: "clearanceDeliveryStatus",
};
const SEARCH_COLS_26 = {
  id: "intendDevannTime",
  label: "预计提拆柜：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_27 = {
  id: "warehousingSource",
  label: "入库来源：",
  type: "select", // 选择框
  basicType: "warehousingSource",
};
const SEARCH_COLS_28 = {
  id: "traceNumber",
  label: "跟踪号：",
  placeholder: "跟踪号",
  type: "text",
};
const SEARCH_COLS_29 = {
  id: "referenceNumber",
  label: "参考单号：",
  placeholder: "参考单号",
  type: "text",
};
const SEARCH_COLS_30 = {
  id: "actualityDevannTime",
  label: "实际提拆柜：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_31 = {
  id: "warehouseStatus",
  label: "入仓状态：",
  type: "select", // 选择框
  // multiple: true,
  placeholder: "状态",
  basicType: "inWarehouseStatus",
};
const SEARCH_COLS_32 = {
  id: "jobNo",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_33 = {
  id: "overseaBusinessTypes",
  label: `${overseaLangObj.yw_type || "业务类型"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "overseaBusinessTypes",
};
const SEARCH_COLS_34 = {
  ...SEARCH_COLS_33,
  id: "deliveryBusinessTypes",
  basicType: "deliveryBusinessTypes",
};
const SEARCH_COLS_35 = {
  id: "transportMode",
  label: "运输方式：",
  basicType: "headTransportMode",
  type: "select", // 选择框
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "nlCode",
  label: "清关单号",
  minWidth: 133,
  sortable: true,
  align: "left",
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "bailorPeopleName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "salesmanName",
  label: overseaLangObj.ywy_salesman || "业务员",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "checkCode",
  label: "查验",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "pdo",
  label: "DO",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  fontColor: true,
  basicType: "do",
};
const TABLE_COLS_6 = {
  prop: "pod",
  label: "POD",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  fontColor: true,
  basicType: "pod",
};
const TABLE_COLS_7 = {
  prop: "remark",
  label: "备注",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "registerNo",
  label: "箱号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "mblNum",
  label: "MBL",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "flightName",
  label: "船名",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "voyageNumber",
  label: "船次",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "reachTime",
  label: "ETA预计到港",
  minWidth: 130,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "customsBrokerName",
  label: "清关行",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "declareTime",
  label: "申报日期",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "contryName",
  label: overseaLangObj.mdg_country || "目的国",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "warehouseName",
  label: "入库仓",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "freightType",
  label: "装箱方式",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  basicType: "freightType",
};
const TABLE_COLS_18 = {
  prop: "logisticsChannelName",
  label: overseaLangObj.ps_qd || "派送渠道",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "overseasOperatorName",
  label: "操作员",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  prop: "operationMainName",
  label: overseaLangObj.ss_gs("所属公司"),
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_21 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  minWidth: 160,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  prop: "createBy",
  label: overseaLangObj.cjr_create || "创建人",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  prop: "status",
  label: "清关状态",
  minWidth: 100,
  sortable: true,
  align: "left",
  fixed: "right",
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "clearanceStatus",
};
const TABLE_COLS_24 = {
  prop: "warehouseStatus",
  label: "入仓状态",
  minWidth: 100,
  sortable: true,
  align: "left",
  fixed: "right",
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "inWarehouseStatus",
};
const TABLE_COLS_25 = {
  prop: "deliveryPlaceType",
  label: overseaLangObj.fhd_type || "发货地类型",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  basicType: "clearanceDeliveryPlaceType",
};
const TABLE_COLS_26 = {
  prop: "deliveryPlaceName",
  label: overseaLangObj.place_delivery || "发货地",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_27 = {
  prop: "amazonDeliveryNumber",
  label: overseaLangObj.amazon_fhh || "Amazon发货号",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_28 = {
  prop: "amazonReferenceNumber",
  label: "Amazon参考号",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_29 = {
  prop: "platformStore",
  label: overseaLangObj.platform_store || "平台店铺",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  prop: "referenceNumber",
  label: overseaLangObj.ck_bm || "参考号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_31 = {
  prop: "warehouseSourceName",
  label: "入库来源",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_32 = {
  prop: "intendDevannTime",
  label: "预计提拆柜",
  minWidth: 160,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_33 = {
  prop: "actualityDevannTime",
  label: "实际提拆柜",
  minWidth: 160,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_34 = {
  prop: "traceNumber",
  label: "跟踪号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_35 = {
  prop: "referenceNumber",
  label: "参考编码",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_36 = {
  prop: "remark",
  label: "入仓备注",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_37 = {
  prop: "deliveryStatus",
  label: overseaLangObj.zt_status_fn("派送状态"),
  minWidth: 100,
  sortable: true,
  align: "left",
  fixed: "right",
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "clearanceDeliveryStatus",
};
const TABLE_COLS_38 = {
  prop: "customsReleaseTime",
  label: "放行时间",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_39 = {
  prop: "jobNo",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_40 = {
  prop: "overseaBusinessTypes",
  label: overseaLangObj.yw_type || "业务类型",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  render: (row) => {
    const [type1, type2] = row.overseaBusinessTypes || [1];
    const obj = {
      1: "仅清关",
      2: "清关+派送",
      3: "清关+入仓",
    };
    return obj[type2 || type1];
  },
};
const TABLE_COLS_41 = {
  ...TABLE_COLS_40,
  render: (row) => {
    const [type1, type2] = row.overseaBusinessTypes || [2];
    const obj = {
      2: "直派",
      3: "入仓+派送",
    };
    return obj[type2 || type1];
  },
};
const TABLE_COLS_42 = {
  prop: "transportMode",
  label: "运输方式",
  minWidth: 100,
  basicType:"headTransportMode",
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  minWidth: 155,
  columnOperation: true,
  columnMoreOperation: true,
  fixed: "right",
};

// 海外直清订单
export const customsClearance = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_2, // NL编号
    SEARCH_COLS_32, // 工作单号
    SEARCH_COLS_3, // 委托人
    SEARCH_COLS_33, // 业务类型
    SEARCH_COLS_4, // 业务员
    SEARCH_COLS_5, // 清关行
    // SEARCH_COLS_6, // 创建人
    SEARCH_COLS_7, // 船/航空公司
    SEARCH_COLS_8, // 目的国
    SEARCH_COLS_9, // 放行时间
    SEARCH_COLS_10, // DO
    SEARCH_COLS_11, // POD
    SEARCH_COLS_12, // 装箱方式
    SEARCH_COLS_13, // 船名/航名
    SEARCH_COLS_14, // 船次/航次
    SEARCH_COLS_15, // 箱号
    SEARCH_COLS_16, // MBL
    SEARCH_COLS_17, // 派送渠道
    SEARCH_COLS_18, // 目的仓
    SEARCH_COLS_19, // 清关状态
    SEARCH_COLS_35,//运输方式
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, // NL编号
    TABLE_COLS_39, // 工作单号
    TABLE_COLS_2, // 委托人
    TABLE_COLS_40, // 业务类型
    TABLE_COLS_3, // 业务员
    TABLE_COLS_4, // 查验
    TABLE_COLS_5, // DO
    TABLE_COLS_6, // POD
    TABLE_COLS_7, // 备注
    TABLE_COLS_8, // 箱号
    TABLE_COLS_9, // MBL
    TABLE_COLS_10, // 船名
    TABLE_COLS_11, // 船次
    TABLE_COLS_12, // ETA预计到港
    TABLE_COLS_13, // 清关行
    TABLE_COLS_14, // 申报日期
    TABLE_COLS_15, // 目的国
    TABLE_COLS_16, // 入库仓
    TABLE_COLS_17, // 装箱方式
    TABLE_COLS_18, // 派送渠道
    TABLE_COLS_19, // 操作员
    TABLE_COLS_38, // 放行时间
    TABLE_COLS_20, // 所属公司
    {
      ...TABLE_COLS_21,
      label: "提交时间",
    }, // 创建时间
    // TABLE_COLS_22, // 创建人
    {
      ...TABLE_COLS_24,
      fixed: undefined,
    }, // 入仓状态
    {
      ...TABLE_COLS_37,
      fixed: undefined,
    }, // 派送状态
    TABLE_COLS_42,//运输方式
    TABLE_COLS_23, // 清关状态
    TABLE_COLS_OPERATION, // 操作
  ],
};

// 海外提派订单
export const delivery = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_32, //工作单号
    SEARCH_COLS_3, // 委托人
    SEARCH_COLS_34, // 业务类型
    SEARCH_COLS_4, // 业务员
    SEARCH_COLS_17, // 派送渠道
    SEARCH_COLS_20, // 发货地类型
    SEARCH_COLS_8, // 目的国
    SEARCH_COLS_21, // Amazon发货号
    SEARCH_COLS_23, // 平台店铺
    SEARCH_COLS_24, // 参考号
    SEARCH_COLS_25, // 派送状态
    SEARCH_COLS_35,//运输方式
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    {
      ...TABLE_COLS_39,
      columnLink: true,
    }, //工作单号
    TABLE_COLS_2, // 委托人
    TABLE_COLS_41, // 业务类型
    TABLE_COLS_3, // 业务员
    TABLE_COLS_19,//操作员
    TABLE_COLS_18, // 派送渠道
    TABLE_COLS_25, // 发货地类型
    TABLE_COLS_26, // 发货地
    TABLE_COLS_27, // Amazon发货号
    TABLE_COLS_29, // 平台店铺
    TABLE_COLS_30, // 参考号
    TABLE_COLS_15, // 目的国
    TABLE_COLS_20, // 所属公司
    TABLE_COLS_21, // 创建时间
    TABLE_COLS_22, // 创建人
    TABLE_COLS_42,//运输方式
    TABLE_COLS_8, //箱号
    {
      ...TABLE_COLS_37,
      basicType: "clearanceDeliveryStatus",
    }, // 派送状态
    TABLE_COLS_OPERATION, // 操作
  ],
};

// 海外入仓订单
export const warehousing = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_2, // NL编号
    SEARCH_COLS_3, // 委托人
    SEARCH_COLS_18, // 目的仓
    SEARCH_COLS_4, // 业务员
    SEARCH_COLS_6, // 创建人
    SEARCH_COLS_12, // 装箱方式
    SEARCH_COLS_8, // 目的国
    SEARCH_COLS_26, // 预计提拆柜
    SEARCH_COLS_27, // 入库来源
    SEARCH_COLS_28, // 跟踪号
    SEARCH_COLS_29, // 参考单号
    SEARCH_COLS_30, // 实际提拆柜
    // SEARCH_COLS_17, // 派送渠道
    SEARCH_COLS_5, // 清关行
    SEARCH_COLS_31, // 入仓状态
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, // NL编号
    TABLE_COLS_2, // 委托人
    TABLE_COLS_3, // 业务员
    TABLE_COLS_16, // 入库仓
    TABLE_COLS_17, // 装箱方式
    TABLE_COLS_31, // 入库来源
    TABLE_COLS_32, // 预计提拆柜
    TABLE_COLS_33, // 实际提拆柜
    TABLE_COLS_34, // 跟踪号
    TABLE_COLS_35, // 参考编码
    TABLE_COLS_36, // 入仓备注
    TABLE_COLS_13, // 清关行
    TABLE_COLS_14, // 申报日期
    TABLE_COLS_15, // 目的国
    // TABLE_COLS_18, // 派送渠道
    TABLE_COLS_19, // 操作员
    TABLE_COLS_20, // 所属公司
    TABLE_COLS_21, // 创建时间
    TABLE_COLS_22, // 创建人
    TABLE_COLS_24, // 入仓状态
    TABLE_COLS_OPERATION, // 操作
  ],
};

const RELEASE_COLS_1 = {
  span: 24,
  id: "customsReleaseTime",
  label: "海关放行时间：",
  placeholder: "海关放行时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
};
const RELEASE_COLS_2 = {
  span: 24,
  id: "checkRemark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea",
};

// 清关放行
export const releaseFormConfig = {
  title: "清关放行",
  width: "450px",
  labelWidth: "120px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [RELEASE_COLS_1, RELEASE_COLS_2],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customsReleaseTime: [
      { required: true, message: "请选择海关放行时间", trigger: "change" },
    ],
  },
};

const FORM_COLS_1 = {
  span: 24,
  id: "nlCode",
  label: "NL编号：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 24,
  id: "jobNo",
  label: "工作单号：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "bailorPeopleName",
  label: "委托人：",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 12,
  id: "operationMainName",
  label: "客户所属公司：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 12,
  id: "warehousingTime",
  label: "拆柜预约：",
  placeholder: "拆柜预约时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
};
const FORM_COLS_7 = {
  span: 12,
  id: "trailerId",
  label: "拖车行：",
  placeholder: "拖车行",
  ...httpCustomerSelect({ clientIdentity: 3 }),
};
// const FORM_COLS_8 = {
//   span: 12,
//   id: "bailorPeopleName",
//   label: "海外委托人：",
//   type: "txt"
// }
const FORM_COLS_9 = {
  span: 12,
  id: "businessUnitName",
  label: "海外业务单位：",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea",
  maxlength: 500,
};
// 预计提拆柜、入仓登记 mType:0=预计提拆柜;1=入仓登记
export const warehousingFormConfig = (obj) => {
  const { mType, salesman, isDelivery } = obj || {};
  return {
    title: ["预计提拆柜", "入仓登记"][mType],
    width: ["635px", "550px"][mType],
    labelWidth: ["92px", "102px"][mType],
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...(isDelivery ? [FORM_COLS_2] : [FORM_COLS_1]),
                  FORM_COLS_3,
                  FORM_COLS_4,
                  {
                    span: 12,
                    id: "warehouseId",
                    label: "入库仓：",
                    ...httpWarehousePublicSelect({
                      typeList: "2",
                      isHaveComId: 1,
                      flagAvailable: "h",
                      salesman,
                      permissionType: 2,
                    }),
                    selectLabelKey: "warehouseName",
                  },
                  [
                    FORM_COLS_6,
                    {
                      ...FORM_COLS_6,
                      label: "预计入仓时间：",
                      placeholder: "预计入仓时间",
                    },
                  ][mType],
                  ...(mType==1?[FORM_COLS_7]:[]),
                  FORM_COLS_9,
                  FORM_COLS_10,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      warehouseId: [
        { required: true, message: "请选择入库仓", trigger: "change" },
      ],
      warehousingTime: [
        {
          required: true,
          message: ["请选择拆柜预约时间", "请选择预计入仓时间"][mType],
          trigger: "change",
        },
      ],
    },
  };
};
