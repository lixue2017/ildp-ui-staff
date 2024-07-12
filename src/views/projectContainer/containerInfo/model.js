import { httpGetServiceChannel } from '@/comModel/httpSelect'
import * as comModel from '../components/comModel'

const searchCols = [
  {
    ...comModel.estimateTime,//预计入仓
    labelWidth: '105px'
  },
  {
    ...comModel.shortNameCol,//客户名称
  },
]

// const searchDoneCols = [
//   {
//     ...comModel.estimateTime,
//     labelWidth: '105px'
//   },
//   {
//     ...comModel.actualTime,
//     labelWidth: '105px'
//   },
//   {
//     ...comModel.startWarehouse,
//   },
//   {
//     ...comModel.destinationWarehouse
//   },
//   {
//     ...comModel.warehousingStatus,
//     labelWidth: '105px'
//   },
//   {
//     ...comModel.materialInfo,
//     labelWidth: '105px'
//   }
// ]


// const searchColumns = [
//   {
//     ...comModel.shortNameCol,
//     labelWidth: '105px'
//   },
//   {
//     ...comModel.salesmanCol,
//     labelWidth: '105px'
//   }
// ];

const SEARCH_FORM_COL_1 = {
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "头程运输方式",
  type: 'select',
  basicType: "headTransportMode",
}

const SEARCH_FORM_COL_2 = {
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "尾程运输方式",
  type: 'select',
  basicType: "outWarehouseWay",
}
const SEARCH_FORM_COL_3 = {
  id: "multipleOrderNo",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
	type: "text",
	maxlength: 1000,
	residueCol: 1
}


const waitSearchCols = [
  //待排柜
  {
    ...comModel.estimateTime,//预计入仓
    labelWidth: '105px'
  },
  SEARCH_FORM_COL_3,//工作单号
  SEARCH_FORM_COL_1,
  SEARCH_FORM_COL_2,
  {
    ...comModel.shortNameCol,//客户名称
    label: "委托人："
  },
  {
    ...comModel.actualTime,//实际入仓
    labelWidth: '105px'
  },
  {
    // id: "startWarehouse",
    // label: "交货仓：",
    // placeholder: "请选择",
    ...comModel.startWarehouses,//交货仓
    label: "交货仓：",
    placeholder: "请选择"
  },
  {
    ...comModel.searchEndWarehouses,//目的仓
  },
  {
    ...comModel.salesmanCol,//业务员
  },
  {
    ...comModel.warehousingStatus,//入仓状态
    labelWidth: '105px'
  },
  {
    ...comModel.materialInfo,//资料信息

  },
]

const doneSearchCols = [
  //已排柜
  {
    ...comModel.estimateTime,//预计入仓
    labelWidth: '105px'
  },
  SEARCH_FORM_COL_3,//工作单号
  {
    id: "registerNo",
    label: "国内登记号：",
    placeholder: "请输入",
    type: "text"
  },
  SEARCH_FORM_COL_1,
  SEARCH_FORM_COL_2,
  {
    ...comModel.actualTime,//实际入仓
    labelWidth: '105px'
  },
  {
    ...comModel.shortNameCol,//客户名称
    label: "委托人："
  },
  {
    ...comModel.startWarehouse,
    id: "startPort"
  },
  {
    ...comModel.warehousingStatus,//入仓状态
  },
  {
    ...comModel.salesmanCol,
    labelWidth: '105px'
  },
  {
    ...comModel.destinationWarehouse,
    id: "endPort"
  },
  {
    ...comModel.materialInfo,//资料信息
  },
  {
    ...comModel.startWarehouses,//交货仓
    label: "交货仓：",
    placeholder: "请选择",
  },
  {
    ...comModel.searchEndWarehouses,//目的仓
    labelWidth: '105px'
  },
]

const TABLE_COLS_28 = [{
  ...comModel.comTableCols[8],
  minWidth: 130,
  label: "客户下单资料",
  prop: "meansNum",
},
{
  ...comModel.comTableCols[8],
  minWidth: 130,
  label: "客户报关资料",
  prop: "declareNum",
},
{
  ...comModel.comTableCols[8],
  label: "产品信息",
}]

const TABLE_COLS_29 = {
  prop: "headTransportModeName",
  label: "头程运输方式",
  minWidth: 130,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_30 = {
  prop: "outWarehouseWayName",
  label: "尾程运输方式",
  minWidth: 130,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}

let TABLE_COLS = [];
comModel.comTableCols.forEach(e => {
  if (e.prop === "transportType") {
    TABLE_COLS.push(TABLE_COLS_29, TABLE_COLS_30)
  } else if (e.prop !== "channel") {
    if (e.prop === "dataMsg") {
      TABLE_COLS.push(...TABLE_COLS_28)
    } else {
      TABLE_COLS.push(e);
    }
  }
})

let TABLE_DONE_COLS = [];
comModel.comTableDoneCols.forEach(e => {
  if (e.prop === "transportType") {
    TABLE_DONE_COLS.push(TABLE_COLS_29, TABLE_COLS_30)
  } else if (e.prop !== "channel") {
    if (e.prop === "dataMsg") {
      TABLE_DONE_COLS.push(...TABLE_COLS_28)
    } else {
      TABLE_DONE_COLS.push(e);
    }
  }
})

const waitTableCols = [
  //待排柜
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    type: "selection",
    width: 50,
    align: "center",
    fixed: "left"
  },
  ...TABLE_COLS
]

const doneTableCols = [
  //已排柜
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    prop: "registerNo",
    label: "国内登记号",
    customRow: true,
    minWidth: 120,
    fixed: "left",
    showOverflowTooltip: true
  },
  ...TABLE_DONE_COLS
]

export { waitTableCols, doneTableCols, waitSearchCols, doneSearchCols }
