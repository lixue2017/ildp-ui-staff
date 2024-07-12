import {
  httpLogisticsCustomerSelect,
  httpUserSelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import {
  httpCurrentWarehouseSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import { getUserList } from "@/api/common.js";
import {
  SEARCH_KC_COL_205,
  SEARCH_KC_COL_206,
} from "../../outboundDelivery/truck/model";
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
};
const SEARCH_COL_3 = {
  id: "businessSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "code",
  label: `${overseaLangObj.kc_xx_bm("卡车信息编号")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "stateList",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "distributionPlanKcState",
};
const SEARCH_COL_6 = {
  id: "overseasDeliveryChannelId",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COL_7 = {
  id: "outboundWmsId",
  label: `${overseaLangObj.ck_lb("所在仓库")}：`,
  ...httpCurrentWarehouseSelect(),
};
const SEARCH_COL_8 = {
  id: "affiliatedCompanyId",
  label: `${overseaLangObj.ss_gs("所属公司")}：`,
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_9 = {
  id: "createUserId",
  label: `${overseaLangObj.cjr_create || "创建人"}：`,
  ...httpUserSelect(),
};
const SEARCH_COL_10 = {
  id: "amazonAppintmentId",
  label: "Shipment ID：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_11 = {
  id: "bsRef",
  label: "CMR No：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_TAB_1 = [
  SEARCH_KC_COL_206,
  SEARCH_COL_2,
  SEARCH_COL_7,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_KC_COL_205,
  SEARCH_COL_6,
  SEARCH_COL_5,
  SEARCH_COL_8,
  SEARCH_COL_9,
  SEARCH_COL_10,
  SEARCH_COL_11,
  SEARCH_COL_1,
];
export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_TAB_1,
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "code",
  label: overseaLangObj.kc_xx_bm("卡车信息编号"),
  columnLink: true,
  minWidth: 150,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "overseasDeliveryChannelName",
  label: overseaLangObj.ps_qd || "派送渠道",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "amazonAppintmentId",
  label: "Shipment ID",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "totalWeight",
  label: overseaLangObj.total_weight("总重量(KG)"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_5 = {
  prop: "totalVolume",
  label: overseaLangObj.total_volume() || "总体积(CBM)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_6 = {
  prop: "destinationCountryCode",
  label: overseaLangObj.gj_country || "国家",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (r) =>
    `${r.destinationCountryCode || ""}[${r.destinationCountryName || "--"}]`,
};
const TABLE_COL_7 = {
  prop: "businessSnNum",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 150,
  showOverflowTooltip: true,
  sortable: true,
  render: (r) => `${r.businessSnNum || "-"}个：${r.businessSn || "-"}`,
};
const TABLE_COL_8 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "scheduledTime",
  label: overseaLangObj.yj_fc_sj || "预计发车时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "actualTime",
  label: overseaLangObj.sj_fc_sj() || "实际发车时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "destinationType",
  label: overseaLangObj.mdd_type || "目的地类型",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  basicType: "destinationType",
};
const TABLE_COL_12 = {
  prop: "wmsCode",
  label: overseaLangObj.mdd_code("仓库编码"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "receivingInfo",
  label: overseaLangObj.sj_info() || "收件信息",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "receivingAddress",
  label: overseaLangObj.md_c_dz("收件地址"),
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "totalNum",
  label: overseaLangObj.zxs_total("总箱数"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_16 = {
  prop: "totalPltNum",
  label: overseaLangObj.z_plt_num || "总PLT数",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_17 = {
  prop: "bsRef",
  label: "Baosen REf",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_19 = {
  prop: "updateTime",
  label: overseaLangObj.last_modified("最后更新时间"),
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_20 = {
  prop: "createUserName",
  label: overseaLangObj.cjr_create || "创建人",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_21 = {
  prop: "outboundWmsName",
  label: overseaLangObj.ck_lb("所在仓库"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_22 = {
  prop: "affiliatedCompanyName",
  label: overseaLangObj.ss_gs("所属公司"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_23 = {
  prop: "noVerifyVoteNum",
  label: overseaLangObj.dhs_num || "待核实数",
  minWidth: 102,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_24 = {
  prop: "totalVoteNum",
  label: overseaLangObj.hs_sl("核实"),
  minWidth: 80,
  customHeader: true,
  sortable: true,
  showOverflowTooltip: true,
  render: (r) => `${r.verifyVoteNum}/${r.totalVoteNum}`,
};
const TABLE_COL_25 = {
  prop: "state",
  label: overseaLangObj.zt_status || "状态",
  dotColor: true,
  minWidth: 100,
  basicType: "distributionPlanKcState",
  fixed: "right",
  sortable: true,
};
const TABLE_COL_26 = {
  prop: "bsRef",
  label: "CMR No",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_27 = {
  prop: "expressCompanyName",
  label: "卡车公司",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_28 = {
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
};
const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_27,
  TABLE_COL_28,
  TABLE_COL_26,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  // TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_19,
  TABLE_COL_20,
  TABLE_COL_21,
  TABLE_COL_22,
  TABLE_COL_23,
  TABLE_COL_24,
  TABLE_COL_25,
  {
    ...TABLE_COL_99,
    width: 160,
    columnMoreOperation: true,
    moreBtnLen: 2,
  },
];
export const tableColumns = () => TABLE_TAB_1;

const SEE_DLG_COL_1 = {
  span: 24,
  id: "code",
  label: `${overseaLangObj.pc_dh || "派车单号"}：`,
  type: "txt",
  txtTagArr: [
    {
      basicType: "distributionAttachRefType",
      basicTypeVal: "type",
    },
  ],
};
const SEE_DLG_COL_2 = {
  span: 24,
  id: "businessSn",
  label: `${overseaLangObj.gz_dh_fn("关联工作单号")}：`,
  type: "txt",
};
const SEE_DLG_COL_3 = {
  span: 24,
  id: "attachId",
  labelWidth: "10px",
  type: "customUploadFile",
  pasteUpload: true,
};
// 上传POD
export const podDlgFormCols = () => {
  return {
    title: overseaLangObj.sc_pod || "上传POD",
    width: "506px",
    labelWidth: "100px",
    dictionaryWords: ["distributionAttachRefType"],
    isAttachFileId: true,
    simpleCustomCols: [SEE_DLG_COL_1, SEE_DLG_COL_2, SEE_DLG_COL_3],
    formRules: {
      attachId: [{ required: true, message: "请上传附件", trigger: "change" }],
    },
  };
};

// 表单模板
export const formOutboundCols = () => {
  return {
    title: "出库完成",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "actualFinishTime",
        label: `${overseaLangObj.sj_fc_sj() || "实际发车时间"}：`,
        placeholder: "日期",
        type: "datetime",
        valueFormat: "yyyy/MM/dd HH:mm:ss",
      },
    ],
    formRules: {
      actualFinishTime: [
        { required: true, message: `请选择时间`, trigger: "change" },
      ],
    },
  };
};

const TABLE_POD_COL_1 = {
  prop: "type",
  label: overseaLangObj.lx_type("类型"),
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionAttachRefType",
};
const TABLE_POD_COL_2 = {
  prop: "businessSn",
  label: overseaLangObj.order_bh("关联订单号"),
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_POD_COL_3 = {
  label: overseaLangObj.fj_attachment || "附件信息",
  prop: "name",
  minWidth: 150,
  showOverflowTooltip: true,
};
const TABLE_POD_COL_4 = {
  label: overseaLangObj.sc_time("上传时间"),
  prop: "createTime",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_POD_COL_5 = {
  label: overseaLangObj.sc_user("上传人"),
  prop: "createUserName",
  minWidth: 100,
  showOverflowTooltip: true,
};
export const podTableFileCol = () => {
  return [
    TABLE_COL_0,
    TABLE_POD_COL_1,
    TABLE_POD_COL_2,
    TABLE_POD_COL_3,
    TABLE_POD_COL_4,
    TABLE_POD_COL_5,
    {
      ...TABLE_COL_99,
      width: overseaLangObj.yu_yan_lang === "en-us" ? 230 : 130,
    },
  ];
};
