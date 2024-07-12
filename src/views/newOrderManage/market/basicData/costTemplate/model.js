import {
  httpCostTypeSelect,
  httpCurrencySelect,
  httpAllDealingCompanySelect,
} from "@/comModel/httpSelect";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  span: 8,
  id: "name",
  label: "模板名称：",
  placeholder: "请输入",
  type: "text",
};

export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_COL_1],
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
  align: "center",
};
const TABLE_COL_1 = {
  prop: "name",
  label: "模板名称",
  columnLink: true,
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "costInfoNum",
  label: "模板明细数量",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  width: 150,
  showOverflowTooltip: true,
};

const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  // fixed: "right",
  width: 86,
};

export const tableColumns = () => {
  return [TABLE_COL_0, TABLE_COL_1, TABLE_COL_2, TABLE_COL_3, TABLE_COL_99];
};

export const editOrDetailFormCols = (isSee) => {
  const VIEW_FORM_COL_1 = {
    span: 24,
    id: "name",
    label: "模板名称：",
    placeholder: "请输入",
    type: isSee ? "txt" : "text",
  };
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [VIEW_FORM_COL_1],
            },
          ],
        },
      ],
    },
  ];
};

export const pageFormRules = () => {
  return {
    name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
  };
};

const TABLE_COL_PAGE_201 = {
  label: overseaLangObj.lx_type("费用类型"),
  prop: "type",
  basicType: "billType",
  width: 110,
  customRow: true,
  request: true,
  showOverflowTooltip: true,
  // fixed: "left",
};
const TABLE_COL_PAGE_202 = {
  label: overseaLangObj.wl_dw || "往来单位",
  prop: "dealingsCompanyName",
  minWidth: 138,
  customRow: true,
  // request: true,
  showOverflowTooltip: true,
  // fixed: "left",
  fieldItem: {
    id: "dealingsCompany",
    size: "mini",
    selectLabelKey: "dealingsCompanyName",
    placeholder: "往来单位",
    // ...httpSubjectCompanySelect(),
    ...httpAllDealingCompanySelect(),
  },
};
const TABLE_COL_PAGE_203 = {
  label: overseaLangObj.cost_name || "费用名称",
  prop: "costName",
  minWidth: 138,
  customRow: true,
  request: true,
  showOverflowTooltip: true,
  // fixed: "left",
  fieldItem: {
    id: "costId",
    size: "mini",
    selectLabelKey: "costName",
    placeholder: "费用名称",
    ...httpCostTypeSelect({ type: 0 }),
  },
};
const TABLE_COL_PAGE_204 = {
  label: overseaLangObj.bz_currency || "币别",
  prop: "currency",
  width: 130,
  customRow: true,
  request: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "currencyId",
    size: "mini",
    selectLabelKey: "currencyCode",
    placeholder: "币别",
    ...httpCurrencySelect,
  },
};

const TABLE_COL_PAGE_205 = {
  label: overseaLangObj.unit_price || "单价",
  prop: "unitPrice",
  width: 120,
  customRow: true,
  request: true,
  align: "right",
  showOverflowTooltip: true,
  precision: 2,
  decimal: 2,
  max: 9999999999.99,
};
const TABLE_COL_PAGE_206 = {
  label: overseaLangObj.sl_num || "数量",
  prop: "num",
  minWidth: 120,
  customRow: true,
  request: true,
  align: "right",
  showOverflowTooltip: true,
  decimal: 4,
  colFormat: "fixedNum",
  max: 99999999.999,
};
const TABLE_COL_PAGE_207 = {
  label: overseaLangObj.je_money || "金额",
  prop: "totalMoney",
  width: 120,
  align: "right",
  customMoney: true,
  showOverflowTooltip: true,
  decimal: 2,
};
const TABLE_COL_PAGE_208 = {
  label: overseaLangObj.df_yf || "到付预付",
  prop: "prepaidCollect",
  width: 100,
  customRow: true,
  basicType: "paymentType",
};
const TABLE_COL_PAGE_209 = {
  label: overseaLangObj.including_tax || "含税",
  prop: "isIncludeTax",
  width: 80,
  customRow: true,
};
const TABLE_COL_PAGE_210 = {
  label: overseaLangObj.tax_rate("税率%"),
  prop: "taxRate",
  width: 120,
  customRow: true,
  align: "right",
  decimal: 2,
};

export const editOrDetailTableCols = (isSee) => {
  return [
    TABLE_COL_0,
    TABLE_COL_PAGE_201,
    TABLE_COL_PAGE_202,
    TABLE_COL_PAGE_203,
    TABLE_COL_PAGE_204,
    TABLE_COL_PAGE_205,
    TABLE_COL_PAGE_206,
    // TABLE_COL_PAGE_207,
    TABLE_COL_PAGE_208,
    TABLE_COL_PAGE_209,
    TABLE_COL_PAGE_210,
    ...(isSee ? [] : [TABLE_COL_99]),
  ];
};
