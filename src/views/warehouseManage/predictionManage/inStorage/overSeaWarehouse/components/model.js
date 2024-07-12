import overseaLangObj from "@/language/overseasLang.js";

const FORM_COLS_1 = {
  span: 6,
  id: "warehouseName",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
};
const FORM_COLS_2 = {
  span: 6,
  id: "freightType",
  label: `${overseaLangObj.zx_fs || "装箱方式"}：`,
  type: "txt",
  basicType: "freightType",
};
const FORM_COLS_3 = {
  span: 6,
  id: "traceNumber",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  type: "txt",
};
const FORM_COLS_4 = {
  span: 6,
  id: "referenceNumber",
  label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  type: "txt",
};
const FORM_COLS_5 = {
  span: 6,
  id: "warehouseSourceName",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  type: "slot",
};
const FORM_COLS_6 = {
  span: 6,
  id: "intendDevannTime",
  label: `${overseaLangObj.yj_tcg || "预计提拆柜"}：`,
  type: "txt",
};
const FORM_COLS_7 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.rc_remark || "入仓备注"}：`,
  type: "txt",
};

export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_1,
              FORM_COLS_2,
              FORM_COLS_3,
              FORM_COLS_4,
              FORM_COLS_5,
              FORM_COLS_6,
              FORM_COLS_7,
            ],
          },
        ],
      },
    ],
  },
];

export const cardConfig = [
  {
    backgroundColor: "#FFF4EE",
    topLabel: overseaLangObj.nl_no || "NL编号",
    topValue: "nlCode",
    topDictVal: "",
    bottomLabel: overseaLangObj.mdg_country || "目的国",
    bottomValue: "countryName",
    bottomDictVal: "",
    fontColor: "#FA541C",
  },
  {
    backgroundColor: "#EBECFE",
    topLabel: overseaLangObj.wtr_customer || "委托人",
    topValue: "bailorPeopleName",
    bottomLabel: overseaLangObj.yw_unit || "业务单位",
    bottomValue: "businessUnitName",
    fontColor: "#6C2CD6",
    topDictVal: "",
    bottomDictVal: "",
  },
  {
    backgroundColor: "#ECF2FF",
    topLabel: overseaLangObj.ks_volume("核实体积(CMB)"),
    topDecimal: 2,
    topValue: "actualityVloume",
    bottomLabel: overseaLangObj.yb_volume("预报体积(CBM)"),
    bottomValue: "predictionVolume",
    bottomDecimal: 2,
    fontColor: "#3179EF",
    topDictVal: "",
    bottomDictVal: "",
  },
  {
    backgroundColor: "#D1F1FE",
    topLabel: overseaLangObj.ks_weight("核实重量(KG)"),
    topValue: "actualityWeight",
    topDecimal: 2,
    bottomLabel: overseaLangObj.yb_weight("预报重量(KG)"),
    bottomValue: "predictionWeight",
    bottomDecimal: 2,
    fontColor: "#409EFF",
    topDictVal: "",
    bottomDictVal: "",
  },
];
