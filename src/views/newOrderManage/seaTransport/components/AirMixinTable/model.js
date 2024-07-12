import { setOrderFreightTake } from "@/api/trandition/airTransport.js"
const tableColumns = {
  grossTotal: [
    {
    label: '总件数：',
    prop: 'packNum'
  },
  {
    label: '总重量：',
    prop: 'warehousingTotalWeight',
    unit:"KG",
    decimal: 2,
  },
  {
    label: '总体积：',
    prop: 'warehousingTotalVolume',
    unit:'m³',
    decimal: 2,
  }
  ],
  1: [
    {
      type: "selection",
      width: 50,
      align: "center",
    },
    {
      label: "箱序号",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "包装",
      prop: "packType",
      showOverflowTooltip: true,
      basicType: "packagingCode"
    },
    {
      label: "件数",
      prop: "packNum",
      align: "right",
      showOverflowTooltip: true,
    },
    {
      label: "单件毛重(KG)",
      prop: "weight",
      align: "right",
      width: 110,
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.weight.toFixed(2)}`
      }
    },
    {
      label: "长(CM)",
      prop: "length",
      align: "right",
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.length.toFixed(1)}`
      }
    },
    {
      label: "宽(CM)",
      prop: "width",
      align: "right",
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.width.toFixed(1)}`
      }
    },
    {
      label: "高(CM)",
      prop: "height",
      align: "right",
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.height.toFixed(1)}`
      }
    },
    {
      label: "单件体积(m³)",
      prop: "volume",
      align: "right",
      width: 110,
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.volume.toFixed(2)}`
      }
    },
    {
      label: "唛头",
      prop: "sku",
      showOverflowTooltip: true,
    },
    {
      label: "品名",
      prop: "productNameCn",
      showOverflowTooltip: true,
    },
    // {
    //   label: "品名(EN)",
    //   prop: "productNameEn",
    //   showOverflowTooltip: true,
    // },
    {
      label: "H S CODE",
      prop: "customsCode",
      width: 150,
      showOverflowTooltip: true,
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      showOverflowTooltip: true,
      basicType: "customsDeclarationType",
      render: (rows, dict) => {
        return rows.customsDeclarationType ? dict : '--'
      }
    },
    {
      label: "产品属性",
      prop: "productAttribute",
      showOverflowTooltip: true,
      render: (rows, dict) => {
        let productClass = ""
        if (rows.magnetic) productClass += '带磁,'
        if (rows.liquid) productClass += '液体,'
        if (rows.fragile) productClass += '易碎,'
        if (rows.electrified) productClass += '带电,'
        if (!rows.productAttribute) {
          return '普货'
        } else {
          productClass = productClass.substring(0, productClass.lastIndexOf(','))
          return productClass
        }
      }
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      width: 120
    }
  ],
  2: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "cusConsignee",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "addr",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "箱序号",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "提货件数",
      prop: "takeFreightNum",
      align: "right",
      showOverflowTooltip: true,
    },
    {
      label: "单件毛重(KG)",
      prop: "weight",
      align: "right",
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.weight.toFixed(2)}`
      }
    },
    {
      label: "总毛重(KG)",
      prop: "totalWeight",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
    },






    {
      label: "操作",
      prop: "operation",
      customRow: true,
      width: 250
    }
  ],
  3: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "柜量",
      prop: "quantity",
      showOverflowTooltip: true,
    },
    {
      label: "柜型",
      prop: "type",
      showOverflowTooltip: true,
    },
    {
      label: "单柜重量(KG)",
      prop: "weight",
      align: "right",
      showOverflowTooltip: true,
    },
    {
      label: "重量小计(KG)",
      prop: "totalWeight",
      align: "right",
      showOverflowTooltip: true,
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      width: 250
    }
  ]
}
const airTransportPickAddress = {
  httpRequest: setOrderFreightTake,
  orderType: "4",
  freightType: "1",
  columnConfig: [{
    type: "index",
    width: 50,
    align: "center",
  },
  {
    prop: "freightCode",
    label: "箱序号",
    showOverflowTooltip: true
  },
  {
    prop: "packNum",
    label: "件数",
    align: "right",
    showOverflowTooltip: true,
    maxNum: 1

  },
  {
    prop: "packType",
    label: "包装",
    showOverflowTooltip: true,
    basicType: "packagingCode"
  },
  {
    prop: "takeFreightNum",
    label: "提货数量",
    align: "right",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true,
    maxNum: 0
  },
  ]
}
export { tableColumns, airTransportPickAddress };
