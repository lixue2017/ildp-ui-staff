import { httpDealingCompanySelect } from '@/comModel/httpSelect'
import { httpBillCompanyList } from "@/comModel/httpSelect.js"
const FORM_COLS_1 = {
  id: "createTime",
  label: "启用时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}

const FORM_COLS_2 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择往来单位",
  ...httpDealingCompanySelect()
}

const FORM_COLS_3 = {
  id: "useStorageLocation",
  label: "库位：",
  placeholder: "请输入库位",
  type: "text",
}

const FORM_COLS_4 = {
  id: "billUnit",
  label: "计费类型：",
  placeholder: "请选择计费类型",
  type: "select",
  basicType: "warehousePricingUnit",
}

const FORM_COLS_5 = {
  id: "type",
  label: "收费类型：",
  placeholder: "请选择收费类型",
  type: "select",
  basicType: "billType"
}
const FORM_COLS_6 = {
  id: "billCurrency",
  label: "计费币别：",
  placeholder: "请选择计费币别",
  type: "autocomplete",
  category: "currency",
}
const FORM_COLS_7 = {
  startId: "minMoney",
  endId: "maxMoney",
  label: "金额：",
  startPlaceholder: "金额(大于)",
  endPlaceholder: "(小于)金额",
  type: "rangeSelect",
}
const FORM_COLS_8 = {
  id: "trayLocation",
  label: "所在托盘号：",
  placeholder: "请输入所在托盘号",
  type: "text",
}
const FORM_COLS_9 = {
  id: "batchNumber",
  label: "批次号：",
  placeholder: "请输入批次号",
  type: "text",
}
const FORM_COLS_10 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: "select",
  // hideList: [2],
  basicType: "warehouseBusinessType"
}
const FORM_COLS_11 = {
  id: "warehousingType",
  label: "存库方式：",
  placeholder: "请选择存库方式",
  type: "select",
  basicType: "warehouseRepositoryType"
}
const FORM_COLS_12 = {
  id: "billCompanyId",
  label: "计费公司：",
  placeholder: "计费公司",
  ...httpBillCompanyList({ type: 0, searchName: "billCompanyName" })
}
const FORM_COLS_13 = {
  id: "billWarehouseId",
  label: "计费仓库：",
  placeholder: "请选择计费仓库",
  ...httpBillCompanyList({ type: 1, searchName: "billWarehouseName" }),
  type: "slot"
}


const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}


const TABLE_COLS_1 = {
  prop: "createTime",
  label: "账单时间",
  minWidth: 140,
  fixed: 'left',
  align: "center",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 140,
  fixed: 'left',
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "useStorageLocation",
  label: "使用库位位置",
  minWidth: 140,
  align: "lrft",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "businessNum",
  label: "工作单号",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "billUnitName",
  label: "计费类型",
  minWidth: 120,
  align: "center",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "type",
  label: "类型",
  align: "center",
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "billType"
}
const TABLE_COLS_8 = {
  prop: "billCurrencyName",
  label: "币别",
  align: "center",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_9 = {
  prop: "unitPrice",
  label: "单价",
  minWidth: 100,
  align: "right",
  decimal: 4,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_10 = {
  prop: "num",
  label: "数量",
  minWidth: 100,
  align: "right",
  decimal: 4,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_11 = {
  prop: "money",
  label: "金额",
  align: "right",
  decimal: 2,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_12 = {
  prop: "trayLocation",
  minWidth: 140,
  label: "所在托盘号",
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_13 = {
  prop: "batchNumber",
  label: "批次号",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_15 = {
  prop: "businessType",
  label: "业务类型",
  minWidth: 140,
  align: "center",
  sortable: true,
  fontColor: true,
  showOverflowTooltip: true,
  TagArrConfig: [
    {
      basicType: 'warehouseBusinessType',
      basicTypeVal: 'businessType'
    }
  ]
}
const TABLE_COLS_16 = {
  prop: "warehousingType",
  label: "存库方式",
  align: "left",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehouseRepositoryType"
}
const TABLE_COLS_17 = {
  prop: "billCompanyName",
  label: "计费公司",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_18 = {
  prop: "billWarehouseName",
  label: "计费仓库",
  align: "left",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_20 = {
  ...TABLE_COLS_1,
  label: "记录时间"
}
const TABLE_COLS_21 = {
  prop: "inStorageTime",
  label: "入库时间",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_22 = {
  prop: "volume",
  label: "体积m³",
  align: "right",
  decimal: 2,
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_23 = {
  prop: "trayUseTime",
  label: "托盘使用时间",
  minWidth: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_24 = {
  prop: "remark",
  label: "备注",
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_25 = {
  prop: "matchType",
  label: "匹配类型",
  minWidth: 120,
  fontColor: true,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
  TagArrConfig: [
    {
      basicType: 'warehouseRentMatchType',
      basicTypeVal: 'matchType'
    }
  ]
}


export const warehouseFeeFormConfig = (row) => {
  //仓租费用form
  const { warehouseChange } = row
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_1,
                  label: "账单时间："
                },
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
                FORM_COLS_7,
                FORM_COLS_8,
                FORM_COLS_9,
                FORM_COLS_10,
                FORM_COLS_11,
                {
                  ...FORM_COLS_12,
                  handle: warehouseChange
                },
                FORM_COLS_13,
              ],
            },
          ],
        },
      ],
    },
  ]
}
export const warehouseFeeTableConfig = [
  //仓租费用table
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
]

export const unmatchFeeFormConfig = (row) => {
  //未匹配仓租记录form
  const { warehouseChange } = row
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_1,
                  label: '记录时间：'
                },
                FORM_COLS_2,
                FORM_COLS_3,
                // FORM_COLS_4,
                // FORM_COLS_5,
                // FORM_COLS_6,
                // FORM_COLS_7,
                FORM_COLS_8,
                FORM_COLS_9,
                FORM_COLS_10,
                FORM_COLS_11,
                {
                  ...FORM_COLS_12,
                  handle: warehouseChange
                },
                FORM_COLS_13,
              ],
            },
          ],
        },
      ],
    },
  ]
}
export const unmatchFeeTableConfig = [
  //未匹配仓租记录table
  TABLE_COLS_INDEX,
  TABLE_COLS_20,
  TABLE_COLS_2,
  TABLE_COLS_13,
  TABLE_COLS_15,
  TABLE_COLS_3,
  TABLE_COLS_16,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_23,
  TABLE_COLS_12,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_25,
  TABLE_COLS_24
]



