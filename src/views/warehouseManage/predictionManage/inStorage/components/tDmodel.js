import overseaLangObj from "@/language/overseasLang.js";

const SEE_FORM_COL_1 = {
  span: 8,
  id: "nlCode",
	label: `${overseaLangObj.nl_no || "NL单号"}：`,
  type: "txt",
}
const SEE_FORM_COL_2 = {
  span: 8,
  id: "boxNum",
	label: `${overseaLangObj.forecast_box_count || "预报箱数"}：`,
  type: "txt",
}
const SEE_FORM_COL_3 = {
  span: 8,
  id: "totalSukNum",
	label: `${overseaLangObj.yb_sku_num || "预报SKU数"}：`,
  type: "txt",
}
const SEE_FORM_COL_4 = {
  span: 8,
  id: "customerBeLongName",
	label: `${overseaLangObj.ck_gs || "仓库归属"}：`,
  type: "txt",
}
const SEE_FORM_COL_5 = {
  span: 8,
  id: "warehouseName",
	label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
}
const SEE_FORM_COL_6 = {
  span: 8,
  id: "warehousingTime",
	label: `${overseaLangObj.yj_rc_sj || "预计入仓时间"}：`,
  type: "txt",
}
const SEE_FORM_COL_7 = {
  span: 8,
  id: "bailorPeople",
	label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  type: "txt",
}
const SEE_FORM_COL_8 = {
  span: 8,
  id: "freightType",
	label: `${overseaLangObj.zx_fs || "装箱方式"}：`,
  type: "txt",
  basicType: "freightType",
}
const SEE_FORM_COL_9 = {
  span: 8,
  id: "sortBoxRegisterNo",
	label: `${overseaLangObj.gn_djh || "国内登记号"}：`,
  type: "txt",
}

export const storehouseLists = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEE_FORM_COL_1,
              SEE_FORM_COL_2,
              SEE_FORM_COL_3,
              SEE_FORM_COL_4,
              SEE_FORM_COL_5,
              SEE_FORM_COL_6,
              SEE_FORM_COL_7,
              SEE_FORM_COL_8,
              SEE_FORM_COL_9
            ]
          }
        ],
      },
    ],
  }
]

const eCommerceTable = (isSee) => {
  return {
    prediction1: [
      {
        type: 'selection',
        width: 50,
        align: "center",
        fixed: 'left'
      },
      {
        type: 'index',
        width: 50,
        align: "center"
      },
      {
        prop: "shipmentId",
        label: "Shipment ID",
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: "referenceId",
        label: "Reference ID",
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: "length",
        label: overseaLangObj.xc_length || "箱长(CM)",
        decimal: 1,
        align: "right",
        showOverflowTooltip: true,
      },
      {
        prop: "width",
        label: overseaLangObj.xk_width || "箱宽(CM)",
        decimal: 1,
        align: "right",
        showOverflowTooltip: true,
      },
      {
        prop: "height",
        label: overseaLangObj.xg_height || "箱高(CM)",
        decimal: 1,
        align: "right",
        showOverflowTooltip: true,
      },
      {
        prop: "weight",
        label: overseaLangObj.dx_mz || "单箱毛重(KG)",
        showOverflowTooltip: true,
        decimal: 2,
        align: "right",
        minWidth: 120,
      },
      {
        prop: "volume",
        label: overseaLangObj.dx_lf || "单箱立方(CBM)",
        showOverflowTooltip: true,
        decimal: 3,
        align: "right",
        minWidth: 120,
      },
      {
        prop: "destination",
        label: overseaLangObj.receipt_warehouse || "目的地",
        showOverflowTooltip: true,
      },
      {
        prop: "storageWay",
        label: overseaLangObj.cc_fs || "存仓方式",
        showOverflowTooltip: true,
        minWidth: 100,
        fontColor: true,
        dicsStr: 'storageWay',
        customDicsArr: [0, 1], // 对象属性名
        customDicsVal: "storageWay"
      },
      {
        prop: "forecastBoxNum",
        label: overseaLangObj.xs_forecast || "预计箱数",
        align: "right",
        decimal: 0,
        showOverflowTooltip: true,
      },
      {
        prop: "takeFreightBoxNum",
        label: overseaLangObj.ys_xs || "已收箱数",
        showOverflowTooltip: true,
        decimal: 0,
        min: 1,
        align: "right",
      },
      {
        prop: "takeAmountBox",
        label: overseaLangObj.sh_xs || "收货箱数",
        customRow: true,
        minWidth: 120,
        decimal: 0,
        min: 1,
        max: 99999999,
        fixed: 'right'
      },
    ],
    received1: [
      {
        type: 'index',
        width: 50,
        align: "center"
      },
      {
        prop: "shipmentId",
        label: "Shipment ID",
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: "referenceId",
        label: "Reference ID",
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: "destination",
        label: overseaLangObj.receipt_warehouse || "目的地",
        showOverflowTooltip: true,
      },
      {
        prop: "freightNum",
        label: overseaLangObj.ys_xs || "已收箱数",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 180,
        decimal: 0,
        min: 1,
        max: 99999999,
        align: "right",
        placeholder: '数量'
      },
      {
        prop: "trayNum",
        label: overseaLangObj.pallet_number() || "托盘号",
        showOverflowTooltip: true,
        minWidth: 180
      },
      {
        prop: "updateTime",
        label: overseaLangObj.last_modified() || "最后修改时间",
        width: "136px",
        showOverflowTooltip: true
      },
      {
        prop: "operation",
        label: overseaLangObj.cz_operation || "操作",
        width: 120,
        fixed: 'right',
        customRow: true
      },
    ]
  }
}


export const eCommerceTotalLists=[
  {
    label: "合计已收箱数",
    value: "freightNum",
  },
  {
    label: "合计托盘数",
    getParamLength:true,
    value: "trayNum",
  },
]

const fbaTable = (isSee) => {
  return {
    prediction2: [
      {
        type: 'selection',
        width: 50,
        align: "center"
      },
      {
        type: 'index',
        width: 50,
        align: "center"
      },
      {
        prop: "sku",
        label: "SKU",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100
      },
      {
        prop: "productNameCn",
        label: "产品名称",
        showOverflowTooltip: true,
        minWidth: 100
      },
      {
        prop: "length",
        label: "长(CM)",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100,
        decimal: 1,
        align: "right"
      },
      {
        prop: "width",
        label: "宽(CM)",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100,
        decimal: 1,
        align: "right"
      },
      {
        prop: "height",
        label: "高(CM)",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100,
        decimal: 1,
        align: "right"
      },
      {
        prop: "caseNo",
        label: "包裹号",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100
      },
      {
        prop: "forecastNum",
        label: "预收SKU数",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100,
        decimal: 0,
        align: "right"
      },
      {
        prop: "takeNum",
        label: "已收SKU数",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100,
        decimal: 0,
        align: "right"
      },
      {
        prop: "takeAmount",
        label: "收货数量",
        showOverflowTooltip: true,
        customRow: true,
        decimal: 0,
        min: 1,
        maxlength: 8,
        align: "right",
        width: 160
      },
    ],
    received2: [
      {
        type: 'index',
        width: 50,
        align: "center"
      },
      {
        prop: "sku",
        label: "SKU",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100
      },
      {
        prop: "productNameCn",
        label: "产品名称",
        showOverflowTooltip: true,
        minWidth: 100
      },
      {
        prop: "caseNo",
        label: "包裹号",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100
      },
      {
        prop: "takeNum",
        label: "已收数量",
        showOverflowTooltip: true,
        customRow: true,
        minWidth: 100,
        decimal: 0,
        align: "right"
      },
      {
        prop: "trayNumber",
        label: "托盘号",
        showOverflowTooltip: true,
        minWidth: 180
      },
      {
        prop: "updateTime",
        label: "最后修改时间",
        width: "136px",
        showOverflowTooltip: true
      },
      {
        prop: "operation",
        label: "操作",
        width: 120,
        customRow: true
      },
    ]
  }
}



export { eCommerceTable, fbaTable };



const SEARCH_COL_2 = {
  span: 8,
  id: "slotNum",
  label: "单号：",
  type: "slot"
}
export const searchColumns = (Fn) => {
  const SEARCH_COL_1 = {
    span: 8,
    id: "receivingSource",
    label: "入库来源：",
    placeholder: "入库来源",
    type: "select",
    basicType: "truckReceivingSource",
    hideList: [3],
    clearable: false,
    handle: (val) => {
      Fn && Fn(val)
    }
  }

  const SEARCH_TAB_1 = [
    SEARCH_COL_1,
    SEARCH_COL_2
  ]
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_TAB_1,
            },
          ],
        },
      ],
    },
  ]
}
