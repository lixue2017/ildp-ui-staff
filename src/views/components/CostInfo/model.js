import {
  httpOrderInfoListSelect,
  httpSubjectCompanySelect,
  httpCostTypeSelect,
  httpCurrencySelect,
  httpAllDealingCompanySelect,
  httpGETAccountsOrderInfoList,
  httpReturnWmsPackageList,
} from "@/comModel/httpSelect";
import { getSearchBusinessUnit } from "@/api/performance/record";
import { getMarketOrderList } from "@/api/settlementManage/statementManage";
import { deepCopy } from "@/utils/index.js";
import overseaLangObj from "@/language/overseasLang.js";
import { MAX_MONEY_NUM } from "@/utils/instructions.js";

// 清关详情应收应付操作单号
const customsOperationSelect = () => {
  return {
    // ...httpOperationListSelect(),
    httpRequest: (params) => {
      const { name, clearanceId, pageNum, pageSize } = params;
      return getSearchBusinessUnit({
        name,
        clearanceId,
        pageNum,
        pageSize,
      });
    },
    getCustomData: (item) => {
      return {
        key: item.orderOperationId,
        value: item.orderOperationId,
        label: `${item.orderOperationNum}`,
      };
    },
  };
};

export const formConfig = {
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
                  id: "skl",
                  label: "付款率：",
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

const EDIT_TABLE_COL_0 = {
  type: "index",
  width: 38,
  align: "center",
  fixed: "left",
};
const EDIT_TABLE_COL_01 = {
  type: "selection",
  width: 45,
  align: "center",
  fixed: "left",
};
const EDIT_TABLE_COL_1 = {
  label: overseaLangObj.lx_type() || "类型",
  prop: "type",
  basicType: "billType",
  width: 90,
  customRow: true,
  request: true,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const EDIT_TABLE_COL_2 = {
  label: overseaLangObj.wl_dw || "往来单位",
  prop: "dealingsCompanyName",
  width: 138,
  customRow: true,
  request: true,
  showOverflowTooltip: true,
  fixed: "left",
  sortable: true,
  // request: true,
  fieldItem: {
    id: "dealingsCompany",
    size: "mini",
    selectLabelKey: "dealingsCompanyName",
    placeholder: "往来单位",
    ...httpSubjectCompanySelect(),
  },
};
const EDIT_TABLE_COL_3 = {
  label: overseaLangObj.cost_name || "费用名称",
  prop: "costName",
  width: 138,
  customRow: true,
  request: true,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  fieldItem: {
    id: "costId",
    size: "mini",
    selectLabelKey: "costName",
    placeholder: "费用名称",
    ...httpCostTypeSelect({ type: 0 }),
  },
};
const EDIT_TABLE_COL_4 = {
  label: overseaLangObj.bz_currency || "币种",
  prop: "currency",
  width: 100,
  customRow: true,
  request: true,
  sortable: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "currencyId",
    size: "mini",
    selectLabelKey: "currencyCode",
    placeholder: "币别",
    ...httpCurrencySelect,
  },
};
const EDIT_TABLE_COL_5 = {
  label: overseaLangObj.unit_price || "单价",
  prop: "unitPrice",
  width: 120,
  customRow: true,
  request: true,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  precision: 2,
  decimal: 2,
  max: MAX_MONEY_NUM,
};
const EDIT_TABLE_COL_6 = {
  label: overseaLangObj.sl_num || "数量",
  prop: "num",
  minWidth: 120,
  customRow: true,
  request: true,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  decimal: 3,
  colFormat: "fixedNum",
  max: 99999999.999,
};
const EDIT_TABLE_COL_7 = {
  label: overseaLangObj.je_money || "金额",
  prop: "totalMoney",
  width: 120,
  align: "right",
  sortable: true,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
};
const EDIT_TABLE_COL_8 = {
  label: overseaLangObj.df_yf || "到付预付",
  prop: "prepaidCollect",
  width: 100,
  sortable: true,
  customRow: true,
  basicType: "paymentType",
};
const EDIT_TABLE_COL_9 = {
  label: overseaLangObj.including_tax || "含税",
  prop: "isIncludeTax",
  width: 80,
  sortable: true,
  customRow: true,
};
const EDIT_TABLE_COL_10 = {
  label: overseaLangObj.tax_rate("税率%"),
  prop: "taxRate",
  width: 120,
  sortable: true,
  customRow: true,
  align: "right",
  decimal: 2,
};
const EDIT_TABLE_COL_11 = {
  label: overseaLangObj.bz_remark() || "备注",
  prop: "remark",
  minWidth: 240,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_12 = {
  label: overseaLangObj.cjr_create || "创建人",
  prop: "createBy",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_13 = {
  label: overseaLangObj.zt_status || "状态",
  // prop: "isGenerateStatement",
  // basicType: "soaStatus",
  prop: "status",
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
  fontColor: true,
  basicType: "accountBillStatus",
};
const EDIT_TABLE_COL_14 = {
  label: overseaLangObj.create_time || "创建时间",
  prop: "createTime",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
};
const EDIT_TABLE_COL_15 = {
  label: overseaLangObj.lock_order || "是否锁单",
  prop: "lockOrder",
  width: 100,
  fontColor: true,
  align: "center",
  basicType: "trueOrFalse",
  // render: (row) => {
  //   return row.lockOrder ? "是" : "否"
  // },
  sortable: true,
};
const EDIT_TABLE_COL_16 = {
  label: overseaLangObj.dz_dh || "对账单号",
  prop: "billNo",
  minWidth: 120,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_17 = {
  label: "操作单号",
  prop: "bsNo",
  width: 150,
  customRow: true,
  showOverflowTooltip: true,
  fixed: "left",
  sortable: true,
  fieldItem: {
    id: "bsId",
    size: "mini",
    selectLabelKey: "bsNo",
    isBackAll: true,
    placeholder: "操作单号",
    ...customsOperationSelect(),
  },
};
const EDIT_TABLE_COL_18 = {
  label: "记账主体",
  prop: "billingMainName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_19 = {
  label: overseaLangObj.gl_dh || "关联单号",
  prop: "contactsOrderNum",
  sortable: true,
  minWidth: 160,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_20 = {
  label: overseaLangObj.write_off_amount("已核销金额"),
  prop: "verificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_21 = {
  label: overseaLangObj.under_verification || "核销中金额",
  prop: "underwayVerificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_22 = {
  label: overseaLangObj.write_off_all || "全部核销",
  prop: "verificationStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_23 = {
  label: overseaLangObj.ykp_je || "已开票金额",
  prop: "invoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_24 = {
  label: overseaLangObj.kpz_je || "开票中金额",
  prop: "underwayInvoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};

const EDIT_TABLE_COL_25 = {
  label: overseaLangObj.kp_all || "全部开票",
  prop: "invoiceStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
};

const EDIT_TABLE_COL_26 = {
  label: overseaLangObj.gl_sd || "关联水单",
  prop: "contactsBankNo",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_27 = {
  label: overseaLangObj.jz_time || "记账时间",
  prop: "accountingTime",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};

const EDIT_TABLE_COL_28 = {
  label: "包裹号",
  prop: "tracksn",
  width: 138,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "tracksn",
    size: "mini",
    placeholder: "包裹号",
    selectLabelKey: "bsNo",
    ...httpReturnWmsPackageList(),
    isBackAll: true,
  },
};
const EDIT_TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  width: 120,
  customRow: true,
  fixed: "right",
};
const EDIT_TABLE_COLS = [
  EDIT_TABLE_COL_0,
  EDIT_TABLE_COL_01,
  EDIT_TABLE_COL_1, //类型
  EDIT_TABLE_COL_17, //操作单号
  EDIT_TABLE_COL_2, //往来单位
  EDIT_TABLE_COL_3, //费用名称
  EDIT_TABLE_COL_4, //币种
  EDIT_TABLE_COL_5, //单价
  EDIT_TABLE_COL_6, //数量
  EDIT_TABLE_COL_7, //金额
  EDIT_TABLE_COL_11, //备注
  EDIT_TABLE_COL_8, //到付预付
  EDIT_TABLE_COL_19, //关联单号
  EDIT_TABLE_COL_16, //对账单号
  EDIT_TABLE_COL_20, //已核销金额
  EDIT_TABLE_COL_21, //核销中金额
  EDIT_TABLE_COL_22, //全部核销
  EDIT_TABLE_COL_23, //已开票金额
  EDIT_TABLE_COL_24, //开票中金额
  EDIT_TABLE_COL_25, //全部开票
  EDIT_TABLE_COL_26, //关联水单
  EDIT_TABLE_COL_9, //含税
  EDIT_TABLE_COL_10, //税率
  EDIT_TABLE_COL_12, //创建人
  EDIT_TABLE_COL_13, //状态
  EDIT_TABLE_COL_27, //记账时间
  EDIT_TABLE_COL_14, //创建时间
  EDIT_TABLE_COL_15, //是否锁单
  EDIT_TABLE_COL_18, //记账主体
  EDIT_TABLE_COL_99,
];

const ORDER_TABLE_COLS = EDIT_TABLE_COLS.filter(
  (e) => !["bsNo", "billingMainName"].includes(e.prop)
);

export const chargeInfo = {
  title: "计费信息",
  columns: ORDER_TABLE_COLS,
};

// 海外订单操作详情费用
export const overSeaBillingTable = () => {
  // console.log("ORDER_TABLE_COLS", ORDER_TABLE_COLS);
  return ORDER_TABLE_COLS.map((e) => {
    if (e.customRow) {
      e.customSlot = true;
    }
    if(e.prop=='operation'){
      e.width=200
    }else if(e.prop=='num'){
      e.decimal=3
    }
    return e;
  });
};

const WMS_EDIT_TABLE_COLS = [
  EDIT_TABLE_COL_0,
  EDIT_TABLE_COL_01,
  EDIT_TABLE_COL_1, //类型
  EDIT_TABLE_COL_17, //操作单号
  EDIT_TABLE_COL_2, //往来单位
  EDIT_TABLE_COL_3, //费用名称
  EDIT_TABLE_COL_28, //包裹号
  EDIT_TABLE_COL_4, //币种
  EDIT_TABLE_COL_5, //单价
  EDIT_TABLE_COL_6, //数量
  EDIT_TABLE_COL_7, //金额
  EDIT_TABLE_COL_11, //备注
  EDIT_TABLE_COL_8, //到付预付
  EDIT_TABLE_COL_19, //关联单号
  EDIT_TABLE_COL_16, //对账单号
  EDIT_TABLE_COL_20, //已核销金额
  EDIT_TABLE_COL_21, //核销中金额
  EDIT_TABLE_COL_22, //全部核销
  EDIT_TABLE_COL_23, //已开票金额
  EDIT_TABLE_COL_24, //开票中金额
  EDIT_TABLE_COL_25, //全部开票
  EDIT_TABLE_COL_26, //关联水单
  EDIT_TABLE_COL_9, //含税
  EDIT_TABLE_COL_10, //税率
  EDIT_TABLE_COL_12, //创建人
  EDIT_TABLE_COL_13, //状态
  EDIT_TABLE_COL_27, //记账时间
  EDIT_TABLE_COL_14, //创建时间
  EDIT_TABLE_COL_15, //是否锁单
  EDIT_TABLE_COL_18, //记账主体
  EDIT_TABLE_COL_99,
];

const WMS_ORDER_TABLE_COLS = WMS_EDIT_TABLE_COLS.filter(
  (e) => !["bsNo", "billingMainName"].includes(e.prop)
);

// WMS退仓详情费用
export const WmsBillingTable = () => {
  return WMS_ORDER_TABLE_COLS.map((e) => {
    if (e.customRow) {
      e.customSlot = true;
    }
    if(e.prop=='operation'){
      e.width=200
    }else if(e.prop=='num'){
      e.decimal=3
    }
    return e;
  });
};

// 电商头程入库详情费用
export const billingTable = () => {
  return ORDER_TABLE_COLS.map((e) => {
    if (e.customRow) {
      e.customSlot = true;
    }
    return e;
  });
};

// 市场航次详情费用
export const marketTableCols = () => {
  const MARKET_TABLE_COLS = EDIT_TABLE_COLS.filter(
    (e) => !["bsNo"].includes(e.prop)
  );
  return MARKET_TABLE_COLS.map((e) => {
    if (e.customRow) {
      e.customSlot = true;
    }
    return e;
  });
};



const CLEARANCE_TABLE_COLS = ({orderType})=>{
  if(orderType==2){
    return EDIT_TABLE_COLS
  }else{
    //非电商没有操作单号
    return EDIT_TABLE_COLS.filter(
      (e) => !["bsNo"].includes(e.prop)
    );
  }
}

// 清关详情费用
export const customsClearanceCols = ({isBs = false,orderType}) => {
  // 委托人包含“堡森”身份时，多一列“操作单”栏
  const CUSTOMS_TABLE_COLS = isBs ? CLEARANCE_TABLE_COLS({orderType}) : ORDER_TABLE_COLS;
  // const CUSTOMS_TABLE_COLS = isBs ? EDIT_TABLE_COLS : ORDER_TABLE_COLS;
  return CUSTOMS_TABLE_COLS.map((e) => {
    if (e.customRow) {
      e.customSlot = true;
    }
    return e;
  });
};

// 仓租日账单费用
export const stotageBillTable = () => {
  return ORDER_TABLE_COLS.map((e) => {
    //会改变原配置的结构，需要深拷贝，否则同样用到这个配置的页面互相跳转会报错
    const originalConfig = deepCopy(e);
    if (originalConfig.customRow) {
      originalConfig.customSlot = true;
    }
    if (originalConfig.prop == "operation") {
      originalConfig.width = 190;
      originalConfig.prop = "operationLists";
    } else if (originalConfig.prop == "dealingsCompanyName") {
      originalConfig.fieldItem = {
        ...originalConfig.fieldItem,
        ...httpAllDealingCompanySelect({ defaultPropLabel: "nameCn" }),
      };
    }
    return originalConfig;
  });
};

const COPY_FORM_COL_1 = {
  span: 10,
  id: "xx_copy_1",
  label: "复制来源订单：",
};
const COPY_FORM_COL_2 = {
  span: 7,
  id: "customerShortName",
  label: "往来单位：",
  type: "txt",
  render: (row) => row.customerShortName || row.customerName || "--",
};
const COPY_FORM_COL_3 = {
  span: 7,
  id: "slotRowsLeng",
  label: "已选数量：",
  placeholder: "--",
  type: "slot",
};

// 航次信息复制来源订单
const COPY_FORM_COL_VOYAGE = () => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      getMarketOrderList({
        ...params,
        tsabiFilter: true,
      }),
    getCustomData: (item) => {
      const { sono, routeNo, routeSonoId, orderSn, customerName } = item;
      const label = `${sono}/${routeNo}`;
      const subtitle = `${orderSn}/${customerName}`;
      return {
        label,
        title: label,
        value: routeSonoId,
        key: routeSonoId,
        subtitle,
      };
    },
  };
};

export const copyFormCols = (obj = {}) => {
  const { handle, params = {}, webViewSource } = obj;
  const WEB_httpSelect = {
    webMarketVoyage: COPY_FORM_COL_VOYAGE(), //航次
    order: httpGETAccountsOrderInfoList({ ...params }), //直清直派订单
    orderReceiving: httpGETAccountsOrderInfoList({ ...params }), //第三方订单
    webOrderOutbound: httpGETAccountsOrderInfoList({ ...params }), //一件代发FBA订单
  }[webViewSource];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...COPY_FORM_COL_1,
                  ...(WEB_httpSelect
                    ? WEB_httpSelect
                    : httpOrderInfoListSelect({ ...params })),
                  noClearable: true,
                  handle,
                },
                COPY_FORM_COL_2,
                COPY_FORM_COL_3,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const COPY_TABLE_COL_0 = {
  type: "selection",
  width: 60,
  align: "center",
  fixed: "left",
};
const COPY_TABLE_COL_1 = {
  label: overseaLangObj.lx_type(),
  prop: "type",
  basicType: "billType",
  width: 100,
  fontColor: true,
  showOverflowTooltip: true,
};
const COPY_TABLE_COL_2 = {
  label: overseaLangObj.cost_name,
  prop: "costName",
  width: 150,
  showOverflowTooltip: true,
};
const COPY_TABLE_COL_3 = {
  label: overseaLangObj.wl_dw,
  prop: "dealingsCompanyName",
  width: 150,
  showOverflowTooltip: true,
};
const COPY_TABLE_COL_4 = {
  label: overseaLangObj.bz_currency,
  prop: "currencyCode",
  width: 100,
  showOverflowTooltip: true,
  render: (r) => r.currencyCode || r.currencyName || "--",
};
const COPY_TABLE_COL_5 = {
  label: overseaLangObj.unit_price,
  prop: "unitPrice",
  width: 120,
  align: "right",
  showOverflowTooltip: true,
};
const COPY_TABLE_COL_6 = {
  label: overseaLangObj.sl_num,
  prop: "num",
  minWidth: 120,
  align: "right",
  showOverflowTooltip: true,
};
const COPY_TABLE_COL_7 = {
  label: overseaLangObj.je_money,
  prop: "totalMoney",
  width: 120,
  align: "right",
  showOverflowTooltip: true,
};
const COPY_TABLE_COL_8 = {
  label: overseaLangObj.df_yf,
  prop: "prepaidCollect",
  width: 100,
  // customRow: true,
  basicType: "paymentType",
};
const COPY_TABLE_COL_9 = {
  label: overseaLangObj.including_tax || "含税",
  prop: "isIncludeTax",
  width: 80,
  render: (row) => (row.isIncludeTax ? "✓" : "--"),
};

export const copyTableCols = () => {
  return [
    EDIT_TABLE_COL_0,
    COPY_TABLE_COL_0,
    COPY_TABLE_COL_1,
    COPY_TABLE_COL_2,
    COPY_TABLE_COL_3,
    COPY_TABLE_COL_4,
    COPY_TABLE_COL_5,
    COPY_TABLE_COL_6,
    COPY_TABLE_COL_7,
    COPY_TABLE_COL_8,
    COPY_TABLE_COL_9,
  ];
};

/** 利润合计表 */
const TABLE_PROFIT_COL_1 = {
  label: "",
  prop: "type",
  width: 136,
  fixed: "left",
  showOverflowTooltip: true,
  basicType: "billType",
  customRow: true,
  align: "right",
};
const TABLE_PROFIT_COL_2 = {
  label: "RMB",
  prop: "payRMB",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_3 = {
  label: "USD",
  prop: "payUSD",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_4 = {
  label: "HKD",
  prop: "payHKD",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_5 = {
  label: "EUR",
  prop: "payEUR",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_6 = {
  label: "GBP",
  prop: "payGBP",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_7 = {
  label: "VND",
  prop: "payVND",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_8 = {
  label: "折合RMB",
  prop: "equivalentProfitRMB",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_PROFIT_COL_9 = {
  label: "折合USD",
  prop: "equivalentProfitUSD",
  minWidth: 110,
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};

const TABLE_PROFIT_COL_10 = (row={}) => {
  const {code}=row
  return {
    label: code,
    prop: `pay${code}`,
    minWidth: 110,
    customMoney: true,
    showOverflowTooltip: true,
    decimal: 2,
    align: "right",
  };
};

const TABLE_PROFIT_COL_11 = (row={}) => {
  const {code}=row
  return {
    label:`折合${code}`,
    prop: `equivalentProfit${code}`,
    minWidth: 110,
    customMoney: true,
    showOverflowTooltip: true,
    decimal: 2,
    align: "right",
  };
};

export const profitTableCols = (row = {}) => {
  const { PROVIDECURRFILTER, filterCURRList, filterEquivalentCURRList } = row;
  if (PROVIDECURRFILTER) {
    const CURRlist = filterCURRList.map((e) => {
      return TABLE_PROFIT_COL_10(e);
    });
    const equivalentCURRList = filterEquivalentCURRList.map((e) => {
      return TABLE_PROFIT_COL_11(e);
    });
    return [TABLE_PROFIT_COL_1, ...CURRlist, ...equivalentCURRList];
  } else {
    return [
      TABLE_PROFIT_COL_1,
      TABLE_PROFIT_COL_2,
      TABLE_PROFIT_COL_3,
      TABLE_PROFIT_COL_4,
      TABLE_PROFIT_COL_5,
      TABLE_PROFIT_COL_6,
      TABLE_PROFIT_COL_7,
      TABLE_PROFIT_COL_8,
      TABLE_PROFIT_COL_9,
    ];
  }
};

const TABLE_TEMP_COL_101 = {
  prop: "radioSlot",
  label: "",
  width: 36,
  customRow: true,
};
const TABLE_TEMP_COL_102 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_TEMP_COL_103 = {
  prop: "name",
  label: "模板名称",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_TEMP_COL_104 = {
  prop: "costInfoNum",
  label: "模板明细数量",
  width: 120,
  showOverflowTooltip: true,
};
export const tableCostTempCols = () => {
  return [
    TABLE_TEMP_COL_101,
    TABLE_TEMP_COL_102,
    TABLE_TEMP_COL_103,
    TABLE_TEMP_COL_104,
  ];
};

/** 费用模板名称 */
export const costTempDialogCols = () => {
  return {
    title: "生成费用模板",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "costNum",
        label: "已选费用数量：",
        type: "txt",
      },
      {
        span: 24,
        id: "name",
        label: "模板名称：",
        placeholder: "请输入",
        type: "text",
      },
    ],
    formRules: {
      name: [{ required: true, message: `请输入模板名称`, trigger: "blur" }],
    },
  };
};
