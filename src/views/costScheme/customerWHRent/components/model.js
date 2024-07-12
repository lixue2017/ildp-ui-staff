const FORM_COLS_1 = {
  span: 12,
  id: "name",
  label: "名称：",
  type: "txt",
}
const FORM_COLS_2 = {
  span: 12,
  id: "billWarehouseName",
  label: "计费仓：",
  type: "txt",
}
const FORM_COLS_3 = {
  span: 12,
  id: "billCurrencyName",
  label: "币种：",
  type: "txt",
}
const FORM_COLS_4 = {
  span: 12,
  id: "closingTypeName",
  label: "结算方式：",
  type: "txt",
}
const FORM_COLS_5 = {
  span: 12,
  id: "billUnit",
  label: "计价单位：",
  type: "txt",
  basicType: "warehousePricingUnit"
}
const FORM_COLS_6 = {
  span: 12,
  id: "UNCHARTED_FORM_6",
  label: "计量类型：",
  type: "txt",
}
const FORM_COLS_7 = {
  span: 24,
  id: "tableSlots",
  labelWidth: '0px',
  type: "slot",
}
const FORM_COLS_8 = {
  span: 12,
  id: "billCompanyName",
  label: "计费公司：",
  type: "txt",
}


const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  prop: "startValue",
  label: "开始值",
  minWidth: 120,
  decimal: 0,
  // sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  prop: "endValue",
  label: "结束值",
  decimal: 0,
  minWidth: 120,
  showOverflowTooltip: true,
}

const TABLE_COLS_3 = {
  prop: "unitPrice",
  label: "单价",
  decimal: 3,
  minWidth: 120,
  showOverflowTooltip: true,
}

const TABLE_COLS_4 = {
  prop: "minPrice",
  label: "最低费用",
  decimal: 3,
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "maxPrice",
  label: "最高费用",
  decimal: 3,
  minWidth: 120,
  showOverflowTooltip: true,
}


export const rulesConfig = {
  title: '查看规则',
  width: '800px',
  labelWidth: '103px',
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_8,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_7,
              ],
            },
          ],
        }
      ],
    }
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5
  ]
}







