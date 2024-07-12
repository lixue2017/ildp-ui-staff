import { getUserList } from "@/api/common"
import { getContactsPublicList } from "@/api/publicInterface/index.js"
import { httpWarehousePublicSelect, httpDeliveryChannelSelect } from '@/comModel/warehouse'
import overseaLangObj from "@/language/overseasLang.js";

const searchLists = [
    {
        id: "beginTime",
        label: "创建时间：",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        type: "daterange",
        valueFormat: "yyyy-MM-dd"
    },
    {
        id: "companyName",
        label: "创建来源客户：",
        placeholder: "创建来源客户",
        type: "autocomplete",
        searchParamName: 'companyNameCn',
        httpRequest: getUserList,
        defaultProp: {
            value: 'companyNameCn',
            label: 'companyNameCn'
        },
        labelWidth: "120px"
    },
    {
        id: "number",
        label: "订单编号：",
        placeholder: "订单编号",
        type: "text",
    },
    {
        id: "deliveryWarehouseid",
        label: "发货仓：",
        placeholder: "请选择发货仓",
        ...httpWarehousePublicSelect({ itemId: "id" }),
    },
    {
        id: "deliveryChannelid",
        label: "派送方式：",
        placeholder: "请选择",
        ...httpDeliveryChannelSelect()
    },
    {
        id: "contactsid",
        label: "收件人：",
        placeholder: "请选择收件人",
        type: "autocomplete",
        searchParamName: 'orderSearch',
        labelWidth: "120px",
        httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
        getCustomData: (item) => {
            return {
                key: item.id,
                label: `${item.name}(${item.phone})`,
                value: item.id,
                title: `${item.name}(${item.phone})/${item.company}`,
                subtitle: `${item.address}`
            }
        }
    },
    {
        id: "receivingWarehouseid",
        label: "收货仓：",
        placeholder: "请选择收货仓",
        ...httpWarehousePublicSelect({ typeList: "0,1", itemId: "id" }),
    },
    {
        id: "state",
        label: "状态：",
        placeholder: "状态（多选）",
        type: "select",
        multiple: true,
        basicType: 'outStorageStatus'
    },
]
const searchColumns = {
    searchNum: searchLists.length,
    lists: [
        {
            className: "search-form-width",
            fieldList: [
                {
                    rows: [
                        {
                            cols: searchLists,
                        },
                    ],
                },
            ],
        },
    ]
};

const tableColumns = [
    {
        type: "index",
        width: 50,
        align: "center",
    },
    {
        label: "订单编号",
        prop: "number",
        customRow: true,
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        label: "保险服务",
        prop: "insurance",
        customRow: true,
        minWidth: 80
    },
    {
        label: "订单类型",
        prop: "orderType",
        showOverflowTooltip: true,
        width: 100,
        render: (row) => {
            return row.orderType == '1' ? '平台订单' : '整箱出库'
        }
    },
    {
        label: "发货仓(海外仓)",
        prop: "deliveryWarehouse",
        showOverflowTooltip: true,
        minWidth: 130,
        render: row => row.deliveryWarehouse ? `${row.deliveryWarehouse.code}/${row.deliveryWarehouse.name}` : '--'
    },
    {
        label: "收货仓(FBA仓)",
        prop: "receivingWarehouse",
        showOverflowTooltip: true,
        minWidth: 130,
        render: row => row.receivingWarehouse ? `${row.receivingWarehouse.code}/${row.receivingWarehouse.name}` : '--'
    },
    {
        label: "收件人",
        prop: "contacts",
        showOverflowTooltip: true,
        minWidth: 120,
        render: (rows) => {
            return rows.orderType == 1 ? `${rows.contacts}(${rows.phone})` : '--'
        }
    },
    {
        label: "派送渠道",
        prop: "deliveryChannel",
        showOverflowTooltip: true,
				minWidth: 120,
				render: r => `${r.tcode}[${r.tname}]`
    },
    {
        label: "产品类型",
        prop: "productType",
        width: 80
    },
    {
        label: "产品总数",
        prop: "productTotal",
        minWidth: 100,
        align: "right"
    },
    {
        label: "产品信息",
        prop: "product",
        customRow: true,
        showOverflowTooltip: true,
        width: 80,
        basicType: 'productSituation',
        basicTypeVal: "foreignExportParam"
    },
    {
        label: "状态",
        prop: "status",
        customRow: true,
        width: 100,
        basicType: 'outStorageStatus'
    },
    {
        label: "委托人",
        prop: "createNickName",
        showOverflowTooltip: true
    },
    {
        label: "创建时间",
        prop: "createTime",
        width: 180
    },
    // {
    //     fixed: "right",
    //     label: "操作",
    //     prop: "operation",
    //     customRow: true,
    //     width: 80
    // }
]

export { searchColumns, tableColumns };

const GOODS_TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
}
// 一件代发-货物信息表格
export const goodsTableColumns = () => {
  let GOODS_CLOS = [
    GOODS_TABLE_COL_0,
    {
      label: "唛头",
      prop: "sku",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "平台编码",
      prop: "productCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "产品名称(EN)",
      prop: "productNameEn",
      showOverflowTooltip: true,
      minWidth: 110,
    },
    {
      label: "产品长宽高(CM)",
      minWidth: 120,
      showOverflowTooltip: true,
      render: (rows) => {
        return rows.productLength ? `${rows.productLength}*${rows.productWidth}*${rows.productHigh}` : '--'
      }
    },
    {
      label: "库存数量",
      prop: "quantityInventory",
      showOverflowTooltip: true,
      align: "right",
    },
    {
      label: "数量",
      prop: "quantity",
      width: 80,
      showOverflowTooltip: true,
      align: "right"
    },
    {
      label: "产品总价",
      prop: "productPrice",
      showOverflowTooltip: true,
      align: "right",
      minWidth: 150
    },
    {
      label: "产品信息",
      prop: "product",
      customRow: true,
      basicType: 'productSituation',
      basicTypeVal: "foreignExportParam"
    }
  ]
  return GOODS_CLOS
}

export const fbaGoodsTableColumns = (colsType = 'fbaBox') => {
  const GOODS_TABLE_COL_1 = {
    label: "客户箱号",
    prop: "cusBoxNumber",
    showOverflowTooltip: true,
  }
  const GOODS_TABLE_COL_2 = {
    label: overseaLangObj.ck_xh || "出库箱号",
    prop: "warehouseBoxNumber",
    showOverflowTooltip: true,
  }
  const GOODS_TABLE_COL_3 = {
    label: "SKU",
    prop: "sku",
    showOverflowTooltip: true,
  }
  const GOODS_TABLE_COL_4 = {
    label: overseaLangObj.single_box_sku || "单箱SKU数",
    prop: "productCount",
    showOverflowTooltip: true,
  }
  const GOODS_TABLE_COL_5 = {
    label: overseaLangObj.dx_weight() || "单箱重量",
    prop: "warehousingWeight",
    showOverflowTooltip: true,
  }
  const GOODS_TABLE_COL_6 = {
    label: overseaLangObj.cc_xs || "库存箱数",
    prop: "quantityInventory",
    showOverflowTooltip: true,
    align: "right"
  }
  const GOODS_TABLE_COL_7 = {
    label: overseaLangObj.ck_xs || "出库箱数",
    prop: "quantity",
    width: 80,
    showOverflowTooltip: true,
    align: "right"
  }
  const GOODS_TABLE_COL_8 = {
    label: overseaLangObj.pt_bm || "平台编码",
    prop: "productCode",
    showOverflowTooltip: true,
  }
  const GOODS_TABLE_COL_9 = {
    label: overseaLangObj.product_name_en || "产品名称(EN)",
    prop: "productNameEn",
    showOverflowTooltip: true,
    minWidth: 100,
  }
  const GOODS_TABLE_COL_10 = {
    label: overseaLangObj.product_ckg || "产品长宽高(CM)",
    minWidth: 120,
    showOverflowTooltip: true,
    render: (row) => {
      return row.productLength ? `${row.productLength}*${row.productWidth}*${row.productHigh}` : '--'
    }
  }
  const GOODS_TABLE_COL_11 = {
    label: overseaLangObj.cp_zj || "产品总价",
    prop: "productPrice",
    showOverflowTooltip: true,
  }
  // 整箱
  let GOODS_TABLE_COLS = [
    GOODS_TABLE_COL_0,
    // GOODS_TABLE_COL_1,
    {
      label: overseaLangObj.xh_container_no || "箱号",
      // prop: "boxNumber",
      prop: "warehouseBoxNumber",
      showOverflowTooltip: true,
    },
    {
      ...GOODS_TABLE_COL_3,
      prop: "boxSku",
    },
    GOODS_TABLE_COL_4,
    GOODS_TABLE_COL_5,
    GOODS_TABLE_COL_6,
    GOODS_TABLE_COL_7
  ]
  // 散货
  if (colsType === 'fbaSku') {
    GOODS_TABLE_COLS = [
      GOODS_TABLE_COL_0,
      GOODS_TABLE_COL_2,
      GOODS_TABLE_COL_3,
      GOODS_TABLE_COL_8,
      GOODS_TABLE_COL_9,
      GOODS_TABLE_COL_10,
      GOODS_TABLE_COL_6,
      GOODS_TABLE_COL_7,
      GOODS_TABLE_COL_11
    ]
  }
  return GOODS_TABLE_COLS
}
