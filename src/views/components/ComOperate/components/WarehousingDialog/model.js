import { MAX_PRODUCT_LWH, MAX_BOX_WEIGHT, MAX_PRODUCT_NUM } from "@/utils/instructions.js";

const FROM_COLS_1 = {
  span: 8,
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "--",
  type: "txt"
}
const FROM_COLS_2 = {
  span: 8,
  id: "bailorPeople",
  label: "委托人：",
  placeholder: "--",
  type: "txt"
}
const FROM_COLS_3 = {
  span: 8,
  id: "createTime",
  label: "下单时间：",
  placeholder: "--",
  type: "txt"
}
const FROM_COLS_4 = {
  span: 8,
  id: "headTransportModeName",
  label: "头程运输方式：",
  placeholder: "--",
  type: "txt"
}
const FROM_COLS_5 = {
  span: 8,
  id: "outWarehouseWayName",
  label: "尾程运输方式：",
  placeholder: "--",
  type: "txt"
}
const formColumn = (type, showTransportMode) => [
  FROM_COLS_1,
  FROM_COLS_2,
  { ...FROM_COLS_3, label: type === 'inStorage' ? "接单时间：" : "下单时间：" },
  ...showTransportMode ? [FROM_COLS_4, FROM_COLS_5] : []
]
export const formConfig = (type, showTransportMode) => [
  {
    fieldList: [
      {
        rows: [
          {
            cols: formColumn(type, showTransportMode),
          },
        ],
      },
    ],
  },
]

const TABLE_INDEX_SLOT = {
	prop: "indexSlot",
	width: 60,
	align: "center",
	customRow: true,
}

export const config = {
  tableColumn: [
    TABLE_INDEX_SLOT,
    // {
    //   labelTop: "Shipment ID",
    //   labelBtm: "Reference ID",
    //   prop: "shipmentId",
    //   width: 120,
    //   customRow: true,
    //   customHeader: true,
    //   showOverflowTooltip: true
    // },
    // {
    //   label: "ShipmentId",
    //   prop: "shipmentId",
    //   showOverflowTooltip: true,
    //   width: 100
    // },
    // {
    //   label: "ReferenceId",
    //   prop: "referenceId",
    //   showOverflowTooltip: true,
    //   width: 100
    // },
    {
      label: "件数",
      prop: "boxCount",
      showOverflowTooltip: true,
      customRow: true,
      align: "center",
			decimal: 0,
			colMax: MAX_PRODUCT_NUM
    },
    {
      label: " 长(CM)",
      prop: "boxLength",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
			decimal: 1,
			colMax: MAX_PRODUCT_LWH
    },
    {
      label: "宽(CM)",
      prop: "boxWidth",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1,
			colMax: MAX_PRODUCT_LWH
    },
    {
      label: "高(CM)",
      prop: "boxHeight",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1,
			colMax: MAX_PRODUCT_LWH
    },
    {
      label: "单件毛重(KG)",
      prop: "boxWeight",
      verifyProp: "warehousingWeight",//核实单件毛重字段
      minWidth: 100,
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 2,
			colMax: MAX_BOX_WEIGHT,
    },
    {
      label: "单件体积(CBM)",
      prop: "boxVolume",
      verifyProp: "warehousingVolume",//核实单件体积字段
      minWidth: 100,
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 2
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: 125
    },
  ],
  CTTableColumn: [
    TABLE_INDEX_SLOT,
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      customRow: true,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType"
    },
    {
      label: "包装",
      prop: "packType",
      // width: 100,
      customRow: true,
      basicType: "packagingCode",
      basicTypeVal: "packType",
      align: "center",
      showOverflowTooltip: true
    },
    {
      label: "件数",
      prop: "boxCount",
      showOverflowTooltip: true,
      customRow: true,
      align: "center",
      decimal: 0,
			colMax: MAX_PRODUCT_NUM
      // width: 80
    },
    // {
    //   label: " 长(CM)",
    //   prop: "boxLength",
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   // align: "right",
    //   decimal: 1,
    //   width: 80
    // },
    // {
    //   label: "宽(CM)",
    //   prop: "boxWidth",
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   // align: "right",
    //   decimal: 1,
    //   width: 80
    // },
    // {
    //   label: "高(CM)",
    //   prop: "boxHeight",
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   // align: "right",
    //   decimal: 1,
    //   width: 80
    // },
    // {
    //   label: "单件体积(CBM)",
    //   prop: "boxVolume",//预报单件体积字段
    //   // minWidth: 100,
    //   verifyProp: "warehousingVolume",//核实单件体积字段
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   align: "center",
    //   decimal: 2,
    // },
    // {
    //   label: "单件毛重(KG)",
    //   prop: "boxWeight",//预报单件毛重字段
    //   // minWidth: 100,
    //   verifyProp: "warehousingWeight",//核实单件毛重字段
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   align: "center",
    //   decimal: 2,
		// 	colMax: MAX_BOX_WEIGHT,
    // },
    {
      label: "体积小计(CBM)",
      prop: "totalVolume",
      // minWidth: 100,
      verifyProp: "warehousingTotalVolume",
      showOverflowTooltip: true,
      customRow: true,
      align: "center",
    },
    {
      label: "毛重小计(KG)",
      prop: "totalWeight",
      // minWidth: 100,
      verifyProp: "warehousingTotalWeight",
      showOverflowTooltip: true,
      customRow: true,
      align: "center",
      decimal: 2,
			colMax: MAX_BOX_WEIGHT,
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: '120px'
    },
  ],
  grossTotal: [
    //   {
    //   label: '目的地：',
    //   prop: 'consigneeCount',
    //   util: '个',
    //   hideDiffMark: true
    // },
    {
      label: '合计箱数：',
      prop: 'totalBoxCount',
      propVery: 'warehousingTotalBoxNum',
      decimal: 0
    },
    {
      label: '总体积(CBM)：',
      prop: 'totalVolume',
      propVery: 'warehousingTotalVolume',
      decimal: 2
    },
    {
      label: '总毛重(KG)：',
      prop: 'totalWeight',
      propVery: 'warehousingTotalWeight',
      decimal: 2
    },
  ],
}
