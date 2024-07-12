import overseaLangObj from "@/language/overseasLang.js";

const WMS_FORM_COL_1 = {
  span: 5,
  id: "orderSn",
  label: "WMS入库单号：",
  type: "txt",
}
const WMS_FORM_COL_2 = {
  span: 8,
  id: "customerName",
	label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  type: "txt"
}
const WMS_FORM_COL_3 = {
  span: 8,
  id: "totalPredictionBoxNum",
	label: `${overseaLangObj.forecast_box_count || "预报箱数"}：`,
  type: "txt"
}
const WMS_FORM_COL_4 = {
  span: 4,
  id: "skuTypeNum",
  label: "SKU类数：",
  type: "txt"
}
const WMS_FORM_COL_5 = {
  span: 8,
  id: "totalPredictionSkuNum",
	label: `${overseaLangObj.sku_total || "SKU总数"}：`,
  type: "txt"
}

const WMS_FORM_COL_6 = {
  span: 8,
  id: "customerBeLongName",
	label: `${overseaLangObj.kh_gs || "客户归属"}：`,
  type: "txt"
}
const WMS_FORM_COL_7 = {
  span: 8,
  id: "warehouseName",
	label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt"
}
const WMS_FORM_COL_8 = {
  span: 8,
  id: "estimateWarehousingTime",
	label: `${overseaLangObj.yj_rc_sj || "预计入仓时间"}：`,
  type: "txt"
}
const WMS_FORM_COL_9 = {
  span: 8,
  id: "warehousingSource",
	label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  type: "radio",
  basicType: 'downListWarehousingSource',
  disable: true
}
const WMS_FORM_COL_10 = {
  span: 8,
  id: "trackingSn",
	label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  type: "txt"
}
const WMS_FORM_COL_11 = {
  span: 8,
  id: "consultSn",
	label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  type: "txt"
}

export const receiptFormCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                // WMS_FORM_COL_1,
                WMS_FORM_COL_2,
                WMS_FORM_COL_3,
                // WMS_FORM_COL_4,
                WMS_FORM_COL_5,
                WMS_FORM_COL_6,
                WMS_FORM_COL_7,
                WMS_FORM_COL_8,
                WMS_FORM_COL_9,
                WMS_FORM_COL_10,
                WMS_FORM_COL_11
              ],
            },
          ],
        },
      ],
    }
  ]
}
