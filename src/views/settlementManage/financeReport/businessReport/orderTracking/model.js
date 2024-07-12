import { httpLogisticsCustomerSelect, httpBusinessSalesmanSelect, httpLogisticsCompanySelect } from '@/comModel/httpSelect'
import { getOrderTraceSalesman } from "@/api/settlementManage/paymentReceived.js";
import { goodsOrderTableCols } from "../goodsTracking/model.js";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: "下单时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  }
}
const SEARCH_COLS_2 = {
	...SEARCH_COLS_1,
  id: "oDate",
  label: "入仓时间：",
}
// const SEARCH_COLS_3 = {
//   id: "companyId",
//   label: "公司：",
//   ...httpLogisticsCustomerSelect(),
// 	isDefaultSelectVal: true
// }
const SEARCH_COLS_4 = {
	id: "salesmanIds",
  label: "业务员：",
  ...httpBusinessSalesmanSelect({ httpRequest: getOrderTraceSalesman}),
  type: "slot",
  multiple: true,
  collapseTags: true
}
const SEARCH_COLS_5 = {
  id: "customerId",
  label: "客户：",
  ...httpLogisticsCompanySelect(),
  type: "slot"
}
const SEARCH_COLS_6 = {
  id: "operationOrderNo",
  label: "工作单号：",
  placeholder: "请输入",
	type: "text"
}
const SEARCH_COLS_7 = {
  id: "orderState",
	label: "状态：",
	placeholder: "请选择",
  type: "select",
	dicsStr: 'order_report_state',
  customDicsArr: [0, 3],
}
const SEARCH_COLS_8 = {
  id: "orderClass",
	label: "订单类型：",
	placeholder: "请选择",
  type: "select",
	basicType: 'orderTrackingTableType',
	clearable: false,
}

const SEARCH_COLS_9 = {
  id: "freightType",
	label: "装箱方式：",
	placeholder: "请选择",
  type: "select",
	basicType: 'freightType',
}
const SEARCH_COLS_10 = {
  id: "isMainBill",
	label: "操作单类型：",
	placeholder: "请选择",
  type: "select",
	basicType: 'isMainBillType',
}
export const searchFormCols = (obj) => {
	const { selectTypeHandle, customerHandle, salesmanHandle } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COLS_1,
								// SEARCH_COLS_2,
								// {
								// 	...SEARCH_COLS_3,
								// 	handle: customerHandle
								// },
								{
									...SEARCH_COLS_8,
									handle: selectTypeHandle
								},
								{
									...SEARCH_COLS_4,
									handle: salesmanHandle
								},
								SEARCH_COLS_5,
								SEARCH_COLS_6,
								SEARCH_COLS_7,
                SEARCH_COLS_9,
                SEARCH_COLS_10
              ],
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
  createTime: [
    { required: true, message: "请选择下单时间", trigger: "change" },
  ],
	orderClass: [
    { required: true, message: "请选择订单类型", trigger: "change" },
  ],
  // companyId: [
  //   { required: true, message: "请选择公司", trigger: "change" },
  // ]
} // 表单校验规则

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
}
const TABLE_COL_1 = {
  label: "工作单号",
  prop: "operationOrderNo",
  minWidth: 120,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  label: "客户名称",
  prop: "customerName",
  minWidth: 120,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  label: "客户单号",
  prop: "customerNo",
  minWidth: 120,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  label: "FBA ID",
  prop: "shipmentId",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  label: "下单时间",
  prop: "orderDate",
 width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  label: "货物入仓时间",
  prop: "goodsWarehouseDate",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  label: "订单类型",
  prop: "orderType",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  label: "产品名称",
  prop: "productNames",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_10 = {
  label: "目的仓",
  prop: "destination",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_11 = {
  label: "件数",
  prop: "packages",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_COL_12 = {
  label: "体积m³",
  prop: "cbms",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
	decimal: 2,
	align: "right",
}
const TABLE_COL_13 = {
  label: "重量KG",
  prop: "kgs",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
	decimal: 2,
	align: "right",
}
const TABLE_COL_14 = {
  label: "柜型柜量",
  prop: "cabinetTypeQuantity",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  label: "起运港",
  prop: "startPort",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_16 = {
  label: "ETD/ATD",
  prop: "etdTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_17 = {
  label: "目的港",
  prop: "endPort",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_18 = {
  label: "ETA/ATA",
  prop: "etaTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_19 = {
  label: "最新进度(货物轨迹)",
  prop: "msg",
  minWidth: 162,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_20 = {
  label: "备注",
  prop: "remark",
  minWidth: 136,
  showOverflowTooltip: true,
}
const TABLE_COL_21 = {
  label: "订单利润(RMB)",
  prop: "profit",
  minWidth: 136,
  showOverflowTooltip: true,
	decimal: 2,
	colFormat: "thousandthMark",
	align: "right",
}
const TABLE_COL_22 = {
  label: "财务状态",
  prop: "financeStatus",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
	fixed: "right",
}
const TABLE_COL_23 = {
  label: "状态",
  prop: "operationOrderStatusName",
  minWidth: 100,
  sortable: true,
	// dotColor: true,
  showOverflowTooltip: true,
	// basicType: "orderStatus",
	fixed: "right",
}
const TABLE_COL_24 = {
  label: "业务员",
  prop: "salesmanName",
  minWidth: 95,
  showOverflowTooltip: true,
	fixed: "right",
}

const TABLE_COL_25 = {
  label: "头程运输方式",
  prop: "headTransportModeName",
  minWidth: 120,
  showOverflowTooltip: true,
}

const TABLE_COL_26 = {
  label: "尾程运输方式",
  prop: "outWarehouseWayName",
  minWidth: 120,
  showOverflowTooltip: true,
}

const TABLE_COL_27 = {
  label: "装箱方式",
  prop: "freightTypeName",
  minWidth: 120,
  showOverflowTooltip: true,
}


const TABLE_COL_28 = {
  label: "预计到港",
  prop: "etaTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COL_29 = {
  label: "实际到港",
  prop: "ataTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COL_30 = {
  label: "预计离港",
  prop: "etdTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COL_31 = {
  label: "实际离港",
  prop: "atdTime",
  width: 136,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_32 = {
  label: "操作单类型",
  prop: "isMainBillName",
  width: 136,
  sortable: true,
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
  TABLE_COL_25,
  TABLE_COL_26,
  TABLE_COL_27,
  TABLE_COL_32,
	TABLE_COL_9,
	TABLE_COL_10,
	TABLE_COL_11,
	TABLE_COL_12,
	TABLE_COL_13,
	TABLE_COL_14,
	TABLE_COL_15,
  TABLE_COL_28,
  TABLE_COL_29,
	TABLE_COL_17,
  TABLE_COL_30,
  TABLE_COL_31,
	TABLE_COL_19,
	TABLE_COL_20,
	TABLE_COL_21,
	TABLE_COL_22,
	TABLE_COL_23,
	TABLE_COL_24
];

export const exportDialogListCols = (tType) => {
  let EX_COLS_1 = [
    {
      span: 24,
      id: "col_list",
      label: "导出表头：",
      type: "multiCheckbox",
      basicType: "ddgzbdcl",
    },
  ];
  if (tType === "ex_all") {
    EX_COLS_1 = [
      {
        span: 24,
        id: "ds_col_list",
        label: "导出表头（电商）：",
        type: "multiCheckbox",
        basicType: "ddgzbdcqbDs",
      },
      {
        span: 24,
        id: "ct_col_list",
        label: "导出表头（传统）：",
        type: "multiCheckbox",
        basicType: "ddgzbdcqbCt",
      },
    ];
  }
  return {
    title: "导出",
    width: "660px",
    labelWidth: "128px",
    simpleCustomCols: EX_COLS_1,
    formRules: {
      col_list: [
        { required: true, message: `请选择导出表头`, trigger: "change" },
			],
			ds_col_list: [
        { required: true, message: `请选择电商导出表头`, trigger: "change" },
			],
			ct_col_list: [
        { required: true, message: `请选择出传统导出表头`, trigger: "change" },
      ],
    },
  };
};
