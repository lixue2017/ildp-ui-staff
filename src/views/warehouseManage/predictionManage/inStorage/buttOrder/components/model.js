import overseaLangObj from "@/language/overseasLang.js";

const FORM_COL_1 = {
  span: 24,
  id: "customerRemark",
	label: `${overseaLangObj.kh_xd_remark || "客户下单备注"}：`,
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
}
const FORM_COL_2 = {
  span: 24,
  id: "businessRemark",
	label: `${overseaLangObj.ywy_remark || "业务员备注"}：`,
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
}
const FORM_COL_3 = {
  span: 24,
  id: "remark",
	label: `${overseaLangObj.qg_bz || "清关备注"}：`,
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
}
const FORM_COL_4 = {
  span: 24,
  id: "warehouseRemark",
	label: `${overseaLangObj.hw_rc_remark || "海外入仓备注"}：`,
  placeholder: "请输入",
  type: "textarea",
  rows: 5
}
export const formRemarksCols = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COL_1,
              FORM_COL_2,
              FORM_COL_3,
              FORM_COL_4,
            ],
          },
        ],
      }
    ],
  }
]



const BTN_COLS_1 = {
	id: 'customsEstimate',
	span: 24,
	text: overseaLangObj.yy_ps || '预约派送',
	btnType: 'estimate',
}


export const ectrajectoryBtn=[
  BTN_COLS_1
]
