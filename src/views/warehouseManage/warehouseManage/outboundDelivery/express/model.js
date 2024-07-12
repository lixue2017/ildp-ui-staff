import {
  httpLogisticsCustomerSelect,
  httpCustomerSelect,
  httpgetCustlist,
  httpCountryListSelect,
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
  placeholder: "请选择",
  // type: "autocomplete",
  // searchParamName: 'companyNameCn',
  // httpRequest: getUserList,
  // defaultProp: {
  // 	value: 'Id',
  // 	label: 'companyNameCn'
  // }
  ...httpCustomerSelect(),
};
const SEARCH_COL_3 = {
  id: "businessSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
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
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
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
  label: `${overseaLangObj.mdc_warehouse("目的仓")}：`,
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

const SEARCH_COL_203 = {
  id: "trackingSn",
  label: `${overseaLangObj.wl_ps_info("快递单号")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_204 = {
  id: "expressCompanyName",
  label: `${overseaLangObj.kd_gs("快递公司")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_205 = {
  id: "code",
  label: `${overseaLangObj.kd_info_bm("快递信息编号")}：`,
  placeholder: "请输入",
  type: "text",
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
                SEARCH_COL_1,
                SEARCH_COL_2,
                SEARCH_COL_3,
                ...(tab === "2"
                  ? [SEARCH_COL_203, SEARCH_COL_204, SEARCH_COL_205]
                  : []),
                SEARCH_COL_4,
                SEARCH_COL_5,
                SEARCH_COL_6,
                SEARCH_COL_7,
                SEARCH_COL_8,
                SEARCH_COL_9,
                SEARCH_COL_10,
                SEARCH_COL_11,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "businessSn",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
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
const TABLE_COL_3 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number("托盘号"),
  minWidth: 120,
  showOverflowTooltip: true,
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
const TABLE_COL_6 = {
  prop: "totalWeight",
  label: overseaLangObj.dx_weight("单件重量(KG)"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_7 = {
  prop: "totalVolume",
  label: overseaLangObj.dx_tj_volume("单件体积(m³)"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 2,
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
  label: overseaLangObj.mdg_country || "目的国",
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
const TABLE_COL_20 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  minWidth: 120,
  showOverflowTooltip: true,
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
const TABLE_COL_24 = {
  prop: "state",
  label: overseaLangObj.hw_zt || "货物状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionPlanState",
  dotColor: true,
  fixed: "right",
  sortable: true,
};
const TABLE_COL_25 = {
  prop: "sortTime",
  label: overseaLangObj.kap_time || "可安排时间",
  width: 132,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_201 = {
  prop: "code",
  label: overseaLangObj.kd_info_bm("快递信息编号"),
  minWidth: 136,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
  columnLink: true,
};
const TABLE_COL_202 = {
  prop: "expressCompanyName",
  label: overseaLangObj.kd_gs("快递公司"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  fixed: "left",
};
const TABLE_COL_203 = {
  prop: "trackingSn",
  label: overseaLangObj.wl_ps_info("快递单号"),
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_204 = {
  prop: "num",
  label: overseaLangObj.jh_num || "计划数量",
  minWidth: 110,
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_205 = {
  prop: "infoState",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "distributionPlanKdState",
  dotColor: true,
  fixed: "right",
  sortable: true,
};
const TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: 186,
};

export const tableColumns = (tab = "1") => {
  const TABLE_COLS_501 = [
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
  ];
  const TABLE_COLS_1 = [
    {
      ...TABLE_COL_1,
      fixed: "left",
    },
    TABLE_COL_5,
    TABLE_COL_2,
    ...TABLE_COLS_501,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_25,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_9,
    {
      ...TABLE_COL_204,
      label: overseaLangObj.bc_jhs || "本次计划数",
    },
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
  ];
  const TABLE_COLS_2 = [
    TABLE_COL_201,
    TABLE_COL_5,
    TABLE_COL_202,
    TABLE_COL_203,
    TABLE_COL_1,
    TABLE_COL_2,
    ...TABLE_COLS_501,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_204,
    TABLE_COL_6,
    TABLE_COL_7,
  ];
  return [
    TABLE_COL_0,
    TABLE_COL_SELECTION,
    ...[TABLE_COLS_1, TABLE_COLS_2][tab - 1],
    TABLE_COL_18,
    TABLE_COL_19,
    TABLE_COL_20,
    TABLE_COL_21,
    TABLE_COL_22,
    TABLE_COL_23,
    TABLE_COL_24,
    ...(tab === "2" ? [TABLE_COL_205] : []),
    TABLE_COL_99,
  ];
};

const EDIT_DLG_COL_1 = {
  span: 24,
  id: "businessSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  type: "txt",
  txtTagArr: [
    {
      basicType: "distributionBusinessType",
      basicTypeVal: "businessType",
    },
  ],
};
const EDIT_DLG_COL_2 = {
  // id: "expressCompanyId",
  id: "logisticsProductId",
  selectLabelKey: "logisticsProductCode",
  ...httpDeliveryChannelSelect(),
  // ...httpgetCustlist({
  //   httpRequest: getFacilitatorlist,
  //   status: 3,
  //   categoryLike: 6,
  // }),
};
const EDIT_DLG_COL_3 = {
  span: 12,
  id: "trackingSn",
  label: `${overseaLangObj.wl_ps_info("快递单号")}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_4 = {
  span: 12,
  id: "scheduledTime",
  label: `${overseaLangObj.jj_rq("寄件日期")}：`,
  placeholder: "请选择",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
  noSlotLabel: true,
};
const EDIT_DLG_COL_5 = {
  // span: 24,
  // id: "weight",
  // label: "重量(KG)：",
  // placeholder: "请输入",
  // type: "inputNumber",
  // numDecimal: 2
};
const EDIT_DLG_COL_6 = {
  // span: 12,
  // id: "name",
  // label: "收件人信息：",
  // placeholder: "姓名",
  // type: "slot",
};
const EDIT_DLG_COL_7 = {
  // span: 24,
  // id: "address",
  // label: "收件人地址：",
  // placeholder: "收件人地址",
  // type: "textarea",
};
const EDIT_DLG_COL_8 = {
  // span: 24,
  // id: "bzxx",
  // label: "备注信息：",
  // type: "textarea",
};
const EDIT_DLG_COL_9 = {
  span: 24,
  id: "attachId",
  labelWidth: "0px",
  type: "customUploadFile",
};
const EDIT_DLG_COL_10 = {
  // span: 24,
  // id: "number",
  // label: "工作单号：",
  // type: "txt",
};
const EDIT_DLG_COL_11 = {
  span: 24,
  id: "num",
  label: `${overseaLangObj.sl_num || "数量"}：`,
  type: "txt",
  decimal: 0,
};
const EDIT_DLG_COL_12 = {
  span: 12,
  id: "expressCompanyName",
  label: `${overseaLangObj.kd_gs("快递公司")}：`,
  type: "txt",
};

const EDIT_DLG_COL_13 = {
  span: 24,
  id: "tableSlot",
  labelWidth: "0px",
  type: "slot",
};

const EDIT_DLG_COL_201 = {
  span: 12,
  id: "contacts",
  label: "联系人：",
  placeholder: "请输入",
  type: "text",
  maxlength: 20,
};
const EDIT_DLG_COL_202 = {
  span: 12,
  id: "phone",
  label: "联系电话：",
  placeholder: "请输入",
  type: "text",
  maxlength: 200,
};
const EDIT_DLG_COL_203 = {
  span: 12,
  id: "email",
  label: "联系邮箱：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_204 = {
  span: 12,
  id: "destinationType",
  label: "目的地类型：",
  type: "txt",
  basicType: "destinationType",
};
const EDIT_DLG_COL_205 = {
  span: 12,
  id: "wmsObj",
  label: "目的仓：",
  selectLabelKey: "wmsCode",
  ...httpWarehousePublicSelect({ typeList: "0,1,2,3,4" }),
  isBackAll: true,
};
const EDIT_DLG_COL_206 = {
  span: 12,
  id: "nationId",
  label: "国家：",
  selectLabelKey: "nationTwoCode",
  ...httpCountryListSelect(),
};
const EDIT_DLG_COL_207 = {
  span: 12,
  id: "postCode",
  label: "邮编：",
  placeholder: "请输入",
  type: "text",
  // colUppercase: true, // 转大写
};
const EDIT_DLG_COL_208 = {
  span: 12,
  id: "province",
  label: "省(州)：",
  placeholder: "请输入",
  type: "text",
  // maxlength: 30,
};
const EDIT_DLG_COL_209 = {
  span: 12,
  id: "city",
  label: "城市：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_210 = {
  span: 12,
  id: "area",
  label: "区(县)：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_211 = {
  span: 12,
  id: "street",
  label: "街道：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_212 = {
  span: 12,
  id: "houseNumber",
  label: `${overseaLangObj.house_number || "门牌号"}：`,
  placeholder: "请输入",
  type: "text",
  maxlength: 100,
};
const EDIT_DLG_COL_213 = {
  span: 24,
  id: "detailAddress",
  label: "详细地址：",
  placeholder: "请输入",
  type: "textarea",
  maxlength: 200,
};

export const registrationDlgFormCols = (obj) => {
  const { isSee = false, destinationType } = obj || {};
  let EDIT_COLS_1 = [
    {
      span: 12,
      // label: `${overseaLangObj.kd_gs("快递公司")}：`,
      label: `${overseaLangObj.wl_cp("物流产品")}：`,
      ...EDIT_DLG_COL_2,
    },
  ];
  if (isSee) {
    EDIT_COLS_1 = [
      {
        span: 12,
        label: `${overseaLangObj.wl_cp("物流产品")}：`,
        id: "logisticsProductCode",
        type: "txt",
      },
      EDIT_DLG_COL_12,
    ];
  }
  EDIT_COLS_1 = [
    ...EDIT_COLS_1,
    EDIT_DLG_COL_3,
    EDIT_DLG_COL_4,
    ...(isSee
      ? []
      : [
          {
            // 占位用
            span: 12,
            id: "seize_a_seat",
            type: "slot",
          },
        ]),
    EDIT_DLG_COL_201,
    EDIT_DLG_COL_202,
    EDIT_DLG_COL_203,
    EDIT_DLG_COL_204,
    EDIT_DLG_COL_206, // 国家
    ...(destinationType == "1"
      ? [EDIT_DLG_COL_205]
      : [
          {
            span: 12,
            id: "wmsCode",
            label: "目的仓：",
            type: "txt",
          },
        ]),
    EDIT_DLG_COL_207,
    EDIT_DLG_COL_208,
    EDIT_DLG_COL_209,
    EDIT_DLG_COL_210,
    EDIT_DLG_COL_211,
    EDIT_DLG_COL_212,
    EDIT_DLG_COL_213,
  ];
  if (isSee) {
    EDIT_COLS_1 = EDIT_COLS_1.map((ele) => {
      let seeItem = {
        ...ele, // 浅拷贝防止查看后影响编辑的显示类型
        type: "txt",
        placeholder: "--",
      };
      if (ele.id === "wmsObj") {
        seeItem.render = (r) => r.wmsCode;
      }
      if (ele.id === "nationId") {
        seeItem.render = (r) =>
          `${r.nationTwoCode || "--"}[${r.nationName || "--"}]`;
      }
      return seeItem;
    });
  }

  let EDIT_COLS_2 = [...EDIT_COLS_1, EDIT_DLG_COL_13];
  return {
    title: overseaLangObj.kd_info_bm("快递信息"),
    width: "1150px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "152px" : "100px",
    dictionaryWords: ["distributionBusinessType", "destinationType"],
    isAttachFileId: true,
    ftShowBtnArr: isSee ? ["fBtnCancel"] : undefined,
    simpleCustomCols: [
      ...EDIT_COLS_2,
      {
        ...EDIT_DLG_COL_9,
        disable: isSee,
      },
    ],
    formRules: isSee
      ? {}
      : {
          logisticsProductId: [
            { required: true, message: "请选择物流产品", trigger: "change" },
          ],
          scheduledTime: [
            { required: true, message: "请选择日期", trigger: "change" },
          ],
          // trackingSn: [
          //   { required: true, message: "请输入快递单号", trigger: "blur" },
          // ],
        },
  };
};

export const expressBatchColumn = () => {
  return [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "businessSn",
      label: overseaLangObj.gz_dh || "工作单号",
      minWidth: 120,
      showOverflowTooltip: true,
    },
    {
      prop: "businessType",
      label: overseaLangObj.yw_type || "业务类型",
      minWidth: 100,
      basicType: "distributionBusinessType",
      fontColor: true,
    },
    {
      prop: "num",
      label: overseaLangObj.bc_jhs || "本次计划数",
      minWidth: 110,
      showOverflowTooltip: true,
      align: "right",
      decimal: 0,
    },
  ];
};
