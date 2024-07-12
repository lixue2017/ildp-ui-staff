import { httpGetRelationVo } from "@/comModel/httpSelect.js"
const FORM_COLS_1 = {
  span: 12,
  id: "number",
  label: "操作单号：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_2 = {
  span: 12,
  id: "warehouseCode",
  label: "目的仓：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_3 = {
  span: 12,
  id: "totalWeight",
  label: "总重量：",
  placeholder: "--",
  decimal: 2,
  type: "txt",
}
const FORM_COLS_4 = {
  span: 12,
  id: "totalVolume",
  label: "总体积：",
  placeholder: "--",
  decimal: 2,
  type: "txt",
}
const FORM_COLS_5 = {
  span: 24,
  id: "table",
  labelWidth: '0px',
  type: "slot",
}








export const costTrialForm = {
  title: '费用试算',
  width: '1000px',
  labelWidth: "90px",
  className: 'content-padding-20',
  lists: [
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
                FORM_COLS_5
              ]
            }
          ]
        }
      ]
    }
  ],
  formRules: {
    // traceNumber: [
    //   { required: true, message: "请输入跟踪单号", trigger: "blur" },
    // ]
  }
}













const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  showOverflowTooltip: true,
  customRow: true,
  basicType: "billType"
}

const TABLE_COLS_2 = {
  prop: "matched",
  label: "是否匹配",
  showOverflowTooltip: true,
  customRow: true,
  basicType: "matchStatus"
}

const TABLE_COLS_3 = {
  prop: "dealingsCompany",
  label: "往来单位",
  width: 160,
  showOverflowTooltip: true,
  customRow: true,
  putFieldItem: {
    //应收
    id: "dealingsCompany",
    selectLabelKey: "dealingsCompanyName",
    label: "往来单位：",
    placeholder: "请选择",
    ...httpGetRelationVo({ customerType: 2, customerName: "nameCn" }),
  },
  payFieldItem: {
    //应付
    id: "dealingsCompany",
    selectLabelKey: "dealingsCompanyName",
    label: "往来单位：",
    placeholder: "请选择",
    ...httpGetRelationVo({ customerType: 3, customerName: "nameCn" }),
  }
}

const TABLE_COLS_4 = {
  prop: "unitPrice",
  label: "金额",
  showOverflowTooltip: true,
  // customRow: true,
  decimal: 2,
}

const TABLE_COLS_5 = {
  prop: "currencyId",
  label: "币别",
  width: 140,
  showOverflowTooltip: true,
  customRow: true,
  fieldItem: {
    id: "currencyId",
    label: "币别：",
    isBackAll: true,
    isAutoInitRequest: false,
    defaultKey: 'id',
    selectLabelKey: "currencyName",
    type: "autocomplete",
    category: "currency"
  }
}

const TABLE_COLS_6 = {
  prop: "price",
  label: "单价",
  customRow: true,
  placeholder:"请输入",
  decimal: 2,
  showOverflowTooltip: true,
}
const TABLE_COLS_7 = {
  prop: "quantity",
  label: "计费数量",
  customRow: true,
  placeholder:"请输入",
  decimal: 2,
  showOverflowTooltip: true,
}
const TABLE_COLS_8 = {
  prop: "billUnitName",
  label: "计费单位",
  showOverflowTooltip: true,
}
export const costTrialTabel = [
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_4,
  TABLE_COLS_5,
]
