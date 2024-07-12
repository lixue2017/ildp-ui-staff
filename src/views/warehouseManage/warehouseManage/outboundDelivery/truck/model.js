import {
  httpCustomerSelect,
  httpLogisticsCustomerSelect,
  httpgetCustlist,
} from "@/comModel/httpSelect";
import {
  httpCurrentWarehouseSelect,
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import { getUserList } from "@/api/common.js";
import { getFacilitatorlist } from "@/api/customerManage/customerList.js";
import overseaLangObj from "@/language/overseasLang.js";

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
  // ...httpCustomerSelect(),
};
const SEARCH_COL_3 = {
  id: "businessSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 500,
};
const SEARCH_COL_4 = {
  id: "receivingAddress",
  label: `${overseaLangObj.md_c_dz("收件地址")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "businessTypeList",
  label: `${overseaLangObj.yw_type || "业务类型"}：`,
  placeholder: "请选择（多选）",
  multiple: true,
  type: "select",
  basicType: "distributionBusinessType",
};
const SEARCH_COL_6 = {
  id: "trackingNumber",
  label: `${overseaLangObj.gn_djh || "国内登记号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "overseasDeliveryChannelId",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COL_8 = {
  id: "destinationId",
  label: `${overseaLangObj.mdc_warehouse() || "目的仓"}：`,
  ...httpWarehousePublicSelect({ typeList: "0,1,2,3,4" }),
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

const SEARCH_COL_204 = {
  id: "code",
  label: `${overseaLangObj.kc_xx_bm("卡车信息编号")}：`,
  placeholder: "请输入",
  type: "text",
};
export const SEARCH_KC_COL_205 = {
  id: "expressCompanyId",
  label: `卡车公司：`,
  ...httpgetCustlist({
    httpRequest: getFacilitatorlist,
    status: 3,
    categoryLike: 15,
  }),
};
export const SEARCH_KC_COL_206 = {
  id: "thTime",
  label: "提货时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

export const searchColumns = (tab = "1") => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
							cols: [
                ...(tab === "2" ? [SEARCH_KC_COL_206] : []),
                SEARCH_COL_6,
                {
                  ...SEARCH_COL_3,
                  residueCol: 2,
                },
                ...(tab === "2" ? [SEARCH_COL_204, SEARCH_KC_COL_205] : []),
								SEARCH_COL_8,
                SEARCH_COL_5,
                SEARCH_COL_2,
                SEARCH_COL_7,
                SEARCH_COL_4,
                SEARCH_COL_9,
                SEARCH_COL_10,
                SEARCH_COL_11,
                SEARCH_COL_1,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION_0 = {
  type: "selection",
  width: 50,
  align: "center",
};
const TABLE_COL_INDEX_0 = {
  type: "index",
  width: 45,
  align: "center",
};

const TABLE_COL_SELECTION = {
  ...TABLE_COL_SELECTION_0,
  fixed: "left",
};
const TABLE_COL_0 = {
  ...TABLE_COL_INDEX_0,
  fixed: "left",
};
const TABLE_COL_1 = (fixed = "left", sortable = true) => {
  return {
    prop: "businessSn",
    label: overseaLangObj.gz_dh || "工作单号",
    minWidth: 120,
    showOverflowTooltip: true,
    sortable,
    fixed,
  };
};
const TABLE_COL_2 = {
  prop: "businessType",
  label: overseaLangObj.yw_type || "业务类型",
  minWidth: 100,
  basicType: "distributionBusinessType",
  showOverflowTooltip: true,
  fontColor: true,
  sortable: true,
};
const TABLE_COL_3_1 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number("托盘号"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_3 = {
  ...TABLE_COL_3_1,
  sortable: true,
};
const TABLE_COL_4 = {
  prop: "overseasDeliveryChannelName",
  label: overseaLangObj.ps_qd || "派送渠道",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_5 = {
  prop: "trackingNumber",
  label: overseaLangObj.gn_djh || "国内登记号",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_6_1 = {
  prop: "totalWeight",
  label: overseaLangObj.zl_weight || "重量(KG)",
  minWidth: 110,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_6 = {
  ...TABLE_COL_6_1,
  sortable: true,
};
const TABLE_COL_7_1 = {
  prop: "totalVolume",
  label: overseaLangObj.tj_m_volume || "体积(m³)",
  minWidth: 110,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_7 = {
  ...TABLE_COL_7_1,
  sortable: true,
};
const TABLE_COL_8 = {
  prop: "forecastTime",
  label: overseaLangObj.yb_time || "预报时间",
  minWidth: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_9 = {
  prop: "verificationTime",
  label: overseaLangObj.hs_time || "核实时间",
  minWidth: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_10 = {
  prop: "forecastNum",
  label: overseaLangObj.yb_sl || "预报数量",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_11 = {
  prop: "verificationNum",
  label: overseaLangObj.hs_sl("核实数量"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_12 = {
  prop: "registrationNum",
  label: overseaLangObj.ydj_sl || "已登记数量",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_13 = {
  prop: "destinationType",
  label: overseaLangObj.mdd_type || "目的地类型",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "destinationType",
  sortable: true,
};
const TABLE_COL_14 = {
  prop: "wmsCode",
  label: overseaLangObj.mdd_code("目的仓编码"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_15 = {
  prop: "destinationCountryCode",
  label: overseaLangObj.gj_country || "国家",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  render: (r) =>
    `${r.destinationCountryCode || ""}[${r.destinationCountryName || "--"}]`,
};
const TABLE_COL_16 = {
  prop: "receivingInfo",
  label: overseaLangObj.sj_info() || "收件信息",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_17 = {
  prop: "receivingAddress",
  label: overseaLangObj.md_c_dz("收件地址"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_18 = {
  prop: "totalSkuNum",
  label: overseaLangObj.sku_num() || "SKU数",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  sortable: true,
};
const TABLE_COL_19 = {
  prop: "remark",
  label: overseaLangObj.bz_remark("备注"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_20_1 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_20 = {
  ...TABLE_COL_20_1,
  sortable: true,
};
const TABLE_COL_21 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  width: 136,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_22 = {
  prop: "outboundWmsName",
  label: overseaLangObj.ck_lb("所在仓库"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_23 = {
  prop: "affiliatedCompanyName",
  label: overseaLangObj.ss_gs("所属公司"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_24_1 = {
  prop: "state",
  label: overseaLangObj.hw_zt || "货物状态",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "distributionPlanState",
  dotColor: true,
};
const TABLE_COL_24 = {
  ...TABLE_COL_24_1,
  sortable: true,
  fixed: "right",
};
const TABLE_COL_25 = {
  prop: "trayCount",
  label: overseaLangObj.plt_sl || "PLT数",
  width: 82,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_26 = {
  prop: "sortTime",
  label: overseaLangObj.kap_time || "可安排时间",
  width: 132,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_201 = {
  prop: "code",
  label: overseaLangObj.kc_xx_bm("卡车信息编号"),
  minWidth: 146,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
  columnLink: true,
};
const TABLE_COL_202 = {
  prop: "overseasDeliveryChannelName",
  label: "派送渠道",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
};
const TABLE_COL_203 = {
  prop: "num",
  label: overseaLangObj.jh_num || "计划数量",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_204 = {
  prop: "expressCompanyName",
  label: "卡车公司",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_205 = {
  prop: "pickupTime",
  label: "提货时间",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: 180,
};

export const tableColumns = (tab = "1") => {
  const TABLE_COLS_1 = [
    TABLE_COL_SELECTION,
    TABLE_COL_1(),
    TABLE_COL_5, // 国内登记号
    TABLE_COL_2, // 业务类型
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_26,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
    TABLE_COL_25,
    TABLE_COL_3,
    {
      ...TABLE_COL_203,
      label: overseaLangObj.bc_jhs || "本次计划数",
    },
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_4,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_9,
  ];
  const TABLE_COLS_2 = [
    TABLE_COL_201,
    // TABLE_COL_202,
    TABLE_COL_1(),
    TABLE_COL_204,
    TABLE_COL_205,
    TABLE_COL_5, // 国内登记号
    TABLE_COL_2,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_203,
    TABLE_COL_6,
    TABLE_COL_7,
  ];
  return [
    TABLE_COL_0,
    ...[TABLE_COLS_1, TABLE_COLS_2][tab - 1],
    TABLE_COL_18,
    TABLE_COL_19,
    TABLE_COL_20,
    TABLE_COL_21,
    TABLE_COL_22,
    TABLE_COL_23,
    TABLE_COL_24,
    TABLE_COL_99,
  ];
};

const DETAIL_SEE_COL_1 = {
  span: 12,
  id: "code",
  label: `${overseaLangObj.kc_xx_bm("卡车编号")}：`,
  type: "txt",
};
const DETAIL_SEE_COL_2 = {
  span: 12,
  id: "amazonAppintmentId",
  label: "Appointment ID：",
  type: "txt",
  labelWidth: "162px",
};
const DETAIL_SEE_COL_3 = {
  span: 12,
  id: "overseasDeliveryChannelName",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  type: "txt",
};
const DETAIL_SEE_COL_4 = {
  span: 12,
  id: "scheduledTime",
  label: "Scheduled Time：",
  type: "txt",
  labelWidth: "162px",
};
const DETAIL_SEE_COL_5 = {
  span: 12,
  id: "remark",
  label: `${overseaLangObj.bz_remark("备注信息")}：`,
  type: "txt",
};

export const seeDlgFormCols = () => {
  return {
    title: overseaLangObj.kc_info || "卡车信息",
    width: "800px",
    labelWidth: "95px",
    ftShowBtnArr: ["fBtnCancel"],
    simpleCustomCols: [
      DETAIL_SEE_COL_1,
      DETAIL_SEE_COL_2,
      DETAIL_SEE_COL_3,
      DETAIL_SEE_COL_4,
      DETAIL_SEE_COL_5,
    ],
  };
};

/*
 添加/编辑页
*/
const EDIT_PAGE_COL_1 = {
  span: 14,
  id: "receivingInfo",
  label: "派送地：",
  label: `${overseaLangObj.ps_dz || "派送地"}：`,
  type: "txt",
  txtClassName: "base-flex-align",
  txtTagArr: [
    {
      basicType: "destinationType",
      basicTypeVal: "destinationType",
    },
  ],
};
const EDIT_PAGE_COL_2 = {
  span: 14,
  id: "receivingAddress",
  type: "txt",
  iconColClass: "el-icon-location-outline",
  render: (r) =>
    `${r.destinationCountryCode}[${r.destinationCountryName || "--"}]/${
      r.receivingAddress || "--"
    }`,
};
const EDIT_PAGE_COL_4 = {
  span: 10,
  id: "amazonAppintmentId",
  label: "Appointment ID：",
  labelWidth: "135px",
  noSlotLabel: true,
};
const EDIT_PAGE_COL_5 = {
  span: 10,
  id: "bsRef",
  label: "CMR No：",
  labelWidth: "135px",
};
const EDIT_PAGE_COL_6 = {
  span: 10,
  id: "loadIn",
  label: "LOAD IN：",
};
const EDIT_PAGE_COL_7 = {
  id: "expressCompanyId",
  selectLabelKey: "expressCompanyName",
  ...httpgetCustlist({
    httpRequest: getFacilitatorlist,
    status: 3,
    categoryLike: 15,
  }),
};
const SEE_PAGE_COL_7 = {
  id: "expressCompanyName",
  type: "txt",
};
const EDIT_PAGE_COL_8 = {
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
  placeholder: "请选择",
};
const SEE_PAGE_COL_8 = {
  type: "txt",
};

/* 派卡车信息查看页面有引用 */
export const multipleTruckFormCols = (isSee) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...EDIT_PAGE_COL_4,
                  placeholder: isSee ? "--" : "请输入",
                  type: isSee ? "txt" : "text",
                },
                EDIT_PAGE_COL_1,
                {
                  span: 10,
                  id: "scheduledTime",
                  label: "Scheduled Time：",
                  labelWidth: "135px",
                  placeholder: isSee ? "--" : "请选择",
                  type: isSee ? "txt" : "datetime",
                  valueFormat: "yyyy-MM-dd HH:mm:ss",
                },
                EDIT_PAGE_COL_2,
                {
                  ...EDIT_PAGE_COL_5,
                  placeholder: isSee ? "--" : "请输入",
                  type: isSee ? "txt" : "slot",
                },
                {
                  ...EDIT_PAGE_COL_6,
                  placeholder: isSee ? "--" : "请输入",
                  type: isSee ? "txt" : "text",
                },
                {
                  span: 10,
                  label: "卡车公司：",
                  labelWidth: "135px",
                  ...(isSee ? SEE_PAGE_COL_7 : EDIT_PAGE_COL_7),
                },
                {
                  id: "pickupTime",
                  span: 10,
                  label: "提货时间：",
                  ...(isSee ? SEE_PAGE_COL_8 : EDIT_PAGE_COL_8),
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};
export const editFormRules = {
  amazonAppintmentId: [
    { required: true, message: "请输入Appointment ID", trigger: "blur" },
  ],
  scheduledTime: [
    { required: true, message: "请选择Scheduled Time", trigger: "change" },
  ],
  bsRef: [{ required: true, message: "请输入CMR No.", trigger: "blur" }],
  expressCompanyId: [
    { required: true, message: "请选择卡车公司", trigger: "change" },
  ],
};

const EDIT_PAGE_TABLE_COL_2 = (sortable = false) => {
  return {
    ...TABLE_COL_2,
    label: overseaLangObj.order_type || "订单类型",
    sortable,
  };
};
const EDIT_PAGE_TABLE_COL_4 = {
  prop: "vat",
  label: "VAT",
  minWidth: 100,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_5 = {
  prop: "orderNr",
  label: "Ordee Nr",
  minWidth: 100,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_6 = {
  prop: "trackingNumber",
  label: overseaLangObj.gn_djh || "国内登记号", // NL编号
  minWidth: 100,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_7 = {
  prop: "totalSkuNum",
  label: overseaLangObj.product_num || "产品数",
  minWidth: 75,
  showOverflowTooltip: true,
  align: "right",
};
const EDIT_PAGE_TABLE_COL_10 = {
  prop: "pltNum",
  label: "PLT",
  minWidth: 90,
  showOverflowTooltip: true,
  decimal: 0,
};
const EDIT_PAGE_TABLE_COL_11 = {
  prop: "fbaId",
  label: "FBAID",
  minWidth: 95,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_12 = {
  prop: "fbaRef",
  label: "FBA ref",
  minWidth: 100,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_13 = {
  prop: "num",
  label: overseaLangObj.xs_total || "箱数",
  minWidth: 90,
  align: "right",
  showOverflowTooltip: true,
  decimal: 0,
  min: 1,
  maxKey: "checkNum",
};
const EDIT_PAGE_TABLE_COL_14 = {
  prop: "xx_14",
  label: "关联PLT",
  minWidth: 75,
  showOverflowTooltip: true,
  decimal: 0,
};
const EDIT_PAGE_TABLE_COL_15 = {
  prop: "xx_15",
  label: "预估PLT",
  minWidth: 90,
  showOverflowTooltip: true,
  decimal: 0,
};
const EDIT_PAGE_TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: overseaLangObj.yu_yan_lang === "en-us" ? 132 : 92,
};
/** 新增、编辑托盘 */
export const trayTableColumns = (pageType) => {
  return [
    ...(pageType === "edit" ? [TABLE_COL_INDEX_0] : [TABLE_COL_SELECTION_0]),
    TABLE_COL_1(false, false),
    TABLE_COL_3_1,
    TABLE_COL_20_1,
    EDIT_PAGE_TABLE_COL_11,
    EDIT_PAGE_TABLE_COL_12,
    EDIT_PAGE_TABLE_COL_7,
    EDIT_PAGE_TABLE_COL_13,
    ...(pageType === "edit"
      ? [
          {
            ...EDIT_PAGE_TABLE_COL_99,
            fixed: undefined,
          },
        ]
      : []),
  ];
};
/** 新增、编辑已关联托盘 */
export const addTableColumns = (tIdx = 0) => {
  return [
    TABLE_COL_0,
    TABLE_COL_1(false, false),
    EDIT_PAGE_TABLE_COL_2(),
    TABLE_COL_20_1,
    EDIT_PAGE_TABLE_COL_4,
    EDIT_PAGE_TABLE_COL_5,
    EDIT_PAGE_TABLE_COL_6,
    EDIT_PAGE_TABLE_COL_7,
    TABLE_COL_6_1,
    TABLE_COL_7_1,
    ...(tIdx === 1
      ? [
          {
            ...EDIT_PAGE_TABLE_COL_10,
            label: overseaLangObj.yg_plt || "预估PLT",
            customRow: true,
          },
        ]
      : []),
    // EDIT_PAGE_TABLE_COL_14,
    // EDIT_PAGE_TABLE_COL_15
    EDIT_PAGE_TABLE_COL_11,
    EDIT_PAGE_TABLE_COL_12,
    TABLE_COL_24_1,
    {
      ...EDIT_PAGE_TABLE_COL_13,
      customRow: tIdx === 1,
      request: tIdx === 1,
    },
    ...(tIdx === 1
      ? [
          {
            ...EDIT_PAGE_TABLE_COL_99,
            width: overseaLangObj.yu_yan_lang === "en-us" ? 66 : 52,
          },
        ]
      : []),
  ];
};
/** 编辑未关联托盘 */
export const editTableColumns = () => {
  return [
    TABLE_COL_0,
    TABLE_COL_1(false, false),
    EDIT_PAGE_TABLE_COL_2(),
    TABLE_COL_20_1,
    EDIT_PAGE_TABLE_COL_4,
    EDIT_PAGE_TABLE_COL_5,
    EDIT_PAGE_TABLE_COL_6,
    EDIT_PAGE_TABLE_COL_7,
    TABLE_COL_6_1,
    TABLE_COL_7_1,
    {
      ...EDIT_PAGE_TABLE_COL_10,
      label: overseaLangObj.yg_plt || "预估PLT",
      customRow: true,
    },
    EDIT_PAGE_TABLE_COL_11,
    EDIT_PAGE_TABLE_COL_12,
    TABLE_COL_24_1,
    {
      ...EDIT_PAGE_TABLE_COL_13,
      customRow: true,
      request: true,
    },
    EDIT_PAGE_TABLE_COL_99,
  ];
};

/** 派卡车信息查看页面有引用 */
export const multipleTruckSeeTableCols = () => {
  return [
    TABLE_COL_0,
    TABLE_COL_1(false, true),
    EDIT_PAGE_TABLE_COL_2(true),
    TABLE_COL_20,
    EDIT_PAGE_TABLE_COL_4,
    {
      ...EDIT_PAGE_TABLE_COL_13,
      sortable: true,
    },
    TABLE_COL_6,
    TABLE_COL_7,
    EDIT_PAGE_TABLE_COL_7,
    EDIT_PAGE_TABLE_COL_5,
    EDIT_PAGE_TABLE_COL_6,
    // EDIT_PAGE_TABLE_COL_10,
    EDIT_PAGE_TABLE_COL_11,
    EDIT_PAGE_TABLE_COL_12,
    EDIT_PAGE_TABLE_COL_99,
  ];
};

/** 侧边栏Drawer抽屉查询 */
export const searchDrawerFormCols = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_3,
                {
                  ...SEARCH_COL_5,
                  label: `${overseaLangObj.order_type || "订单类型"}：`,
                },
                SEARCH_COL_2,
              ],
            },
          ],
        },
      ],
    },
  ];
};

/** 侧边栏Drawer抽屉表格 */
export const tableDrawerCols = () => [
  TABLE_COL_SELECTION_0,
  TABLE_COL_1(false),
  EDIT_PAGE_TABLE_COL_2(true),
  {
    ...EDIT_PAGE_TABLE_COL_13,
    sortable: true,
  },
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_25,
  EDIT_PAGE_TABLE_COL_5,
  TABLE_COL_26,
  EDIT_PAGE_TABLE_COL_6,
  {
    ...TABLE_COL_24_1,
    sortable: true,
  },
  TABLE_COL_20,
  {
    ...TABLE_COL_17,
    label: overseaLangObj.sh_address || "目的地址",
  },
];
