import {
	httpLogisticsCompanySelect, httpBusinessSalesmanSelect,
	httpCustomerSelect, httpOperationListSelect, httpLogisticsCustomerSelect, httpSalesmanSelect
} from '@/comModel/httpSelect'
// import { httpFBAWarehouseSelect } from '@/comModel/warehouse'
import { getEffectiveTimeSalesman } from "@/api/settlementManage/paymentReceived.js";

const SEARCH_COLS_1 = {
  span:6,
  id: "registerNo",
  label: "国内登记号：",
  placeholder: "请输入",
	type: "text"
}
const SEARCH_COLS_2 = {
  span:6,
	id: "operationOrderNo",
  label: "工作单号：",
	type: "text",
	placeholder: "请输入",
	// ...httpOperationListSelect(),
}
const SEARCH_COLS_3 = {
  span:6,
  // id: "salesmanIds",
	label: "业务员：",
	id: "salesmanId",
  ...httpSalesmanSelect(),
  // ...httpBusinessSalesmanSelect({ httpRequest: getEffectiveTimeSalesman}),
  // multiple: true,
  // collapseTags: true,
  type:"slot"
}
const SEARCH_COLS_4 = {
  span:6,
  id: "customerId",
  label: "客户：",
  ...httpLogisticsCompanySelect(),
  type: "slot"
}
const SEARCH_COLS_5 = {
  span:6,
  id: "warehouseCode",
  label: "仓库代码：",
	type: "text",
	placeholder: "请输入",
	// ...httpFBAWarehouseSelect()
}
const SEARCH_COLS_6 = {
  span:6,
  id: "sendWays",
	label: "派送方式：",
	placeholder: "请选择",
	type: "select",
	basicType: "outWarehouseWay"
}
const SEARCH_COLS_7 = {
  span:6,
  id: "businessCompany",
  label: "公司：",
  isDefaultSelectVal: true,
  ...httpLogisticsCustomerSelect()
}

export const searchFormCols = (obj) => {
	const { salesmanHandle,businessCompanyHanele } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...SEARCH_COLS_7,
                  handle:businessCompanyHanele
                },//公司
                {
									...SEARCH_COLS_3,
									handle: salesmanHandle
								},//业务员
								SEARCH_COLS_4,//客户
                SEARCH_COLS_1,//国内登记号
								SEARCH_COLS_2,//工作单号
								SEARCH_COLS_5,//仓库代码
								SEARCH_COLS_6,//派送方式
              ],
            },
          ],
        },
      ],
    }
  ]
}

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
}
const TABLE_COL_1 = {
  label: "国内登记号",
  prop: "registerNo",
  minWidth: 120,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  label: "工作单号",
  prop: "operationOrderNo",
  minWidth: 120,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  label: "客户名称",
  prop: "customerName",
  minWidth: 120,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  label: "业务员",
  prop: "salesmanName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  label: "仓库代码",
  prop: "warehouseCode",
	minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  labelTop: "ATD",
	labelBottom: "实际离港时间",
	headerTopBottom: true,
  prop: "atdtime",
  width: 136,
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  labelTop: "ETA",
	labelBottom: "预计到港时间",
	headerTopBottom: true,
  prop: "etatime",
  minWidth: 126,
  showOverflowTooltip: true,
}
const TABLE_COL_8 = {
  labelTop: "ATA",
	labelBottom: "实际到港时间",
	headerTopBottom: true,
  prop: "atatime",
  minWidth: 126,
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  label: "清关放行",
  prop: "clearnOutTime",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_10 = {
  label: "航期（天）",
  prop: "sailingSchedule",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_11 = {
  labelTop: "延船天数",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "lastShipDays",
  minWidth: 120,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_12 = {
  labelTop: "清关时效",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "clearnEffectiveDays",
  minWidth: 120,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_13 = {
  label: "查验日期",
  prop: "checkTime",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_14 = {
  label: "查验放行日期",
  prop: "checkOutTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  labelTop: "查验放行时效",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "checkOutEffectiveDays",
  minWidth: 125,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_16 = {
  label: "提拆柜日期",
  prop: "actualSplitTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_17 = {
  labelTop: "清关到拆柜时效",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "clearnToliftingAndDisassemblingEffectiveDays",
  minWidth: 130,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_18 = {
  label: "派送方式",
  prop: "sendWays",
  minWidth: 110,
  sortable: true,
  showOverflowTooltip: true,
	// basicType: "timelyDeliveryWay",
	// dotColor: true
}
const TABLE_COL_19 = {
  label: "派送时间",
  prop: "sendTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_20 = {
  label: "POD",
  prop: "podTime",
  width: 136,
  showOverflowTooltip: true,
}
const TABLE_COL_21 = {
  labelTop: "POD回传时效",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "podToReceiveEffectiveDays",
  minWidth: 130,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_22 = {
  labelTop: "从拆柜到派送时效",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "liftingToSendEffectiveDays",
  minWidth: 130,
  showOverflowTooltip: true,
	fixed: "right",
	align: "right",
}
const TABLE_COL_23 = {
  labelTop: "从开船到派送时效",
	labelBottom: "（天）",
	headerTopBottom: true,
  prop: "shipToSendEffectiveDays",
  minWidth: 130,
  showOverflowTooltip: true,
	fixed: "right",
	align: "right",
}
const TABLE_COL_24 = {
  label: "公司",
  prop: "businessCompany",
  showOverflowTooltip: true,
}

export const tableColumns = [
	TABLE_COL_INDEX,
	TABLE_COL_1,
	TABLE_COL_2,
	TABLE_COL_3,
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
	TABLE_COL_17,
	TABLE_COL_18,
	TABLE_COL_19,
	TABLE_COL_20,
	TABLE_COL_21,
	TABLE_COL_22,
	TABLE_COL_23
]


export const timeStatFormRules={
  businessCompany: [
    { required: true, message: "请选择公司", trigger: "change" },
  ],
}
