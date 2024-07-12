import { setOrderFreightTake } from "@/api/trandition/otherOrder"
const tableColumns = {
  10: [
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
      label: "柜型",
      prop: "boxCode",
      showOverflowTooltip: true,
      // basicType:"box"
    },
    {
      label: "柜量",
      prop: "boxNum",
      showOverflowTooltip: true,
    },
    {
      label: "单柜重量(KG)",
      prop: "weight",
      showOverflowTooltip: true,
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
      showOverflowTooltip: true,
    },
    {
      label: "重量小计(KG)",
      prop: "totalWeight",
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
      width: 160
    }
  ],
  11: [
    {
      type: "selection",
      width: 50,
      align: "center",
    },
    {
      label: "件数",
      prop: "packNum",
      showOverflowTooltip: true,
    },
    {
      label: "包装",
      prop: "packType",
      showOverflowTooltip: true,
      // basicType:"box"
    },
    {
      label: "毛重",
      prop: "weight",
      showOverflowTooltip: true,
    },
    {
      label: "长",
      prop: "length",
      showOverflowTooltip: true,
    },
    {
      label: "宽",
      prop: "width",
      showOverflowTooltip: true,
    },
    {
      label: "高",
      prop: "height",
      showOverflowTooltip: true,
    },
    // {
    //   label: "品名(EN)",
    //   prop: "productNameEn",
    //   showOverflowTooltip: true,
    // },
    {
      label: "体积",
      prop: "volume",
      showOverflowTooltip: true,
    },
    {
      label: "品名",
      prop: "productNameCn",
      showOverflowTooltip: true,
    },
    {
      label: "HSCODE",
      prop: "customsCode",
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
      width: 160
    }
  ],
  20: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "pickInfo",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "pickAddress",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "箱序号",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "提货柜量",
      prop: "takeFreightNum",
      showOverflowTooltip: true,
    },
    {
      label: " 单柜重量(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.weight.toFixed(2)}`
      }
    },
    {
      label: "总重量(KG)",
      prop: "totalWeight",
      showOverflowTooltip: true,
      customRow: true
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      width: 250
    }
  ],
  21: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "pickInfo",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "pickAddress",
      customRow: true,
      showOverflowTooltip: true,
    },
    // {
    //   label: "货物编码",
    //   prop: "freightCode",
    //   showOverflowTooltip: true,
    // },
    {
      label: "提货件数",
      prop: "takeFreightNum",
      showOverflowTooltip: true,
    },
    {
      label: "单件毛重(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      render: (rows) => {
        return `${rows.weight.toFixed(2)}`
      }
    },
    {
      label: "总毛重(KG)",
      prop: "totalWeight",
      showOverflowTooltip: true,
      customRow: true
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      width: 250
    }
  ],
}



const otherPickAddressFcl = {
  httpRequest: setOrderFreightTake,
  orderType: "5",
  freightType: "0",
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
    prop: "boxCode",
    label: "柜型",
    showOverflowTooltip: true,
    // basicType: "box"
  },
  {
    prop: "boxNum",
    label: "柜量",
    showOverflowTooltip: true,
    maxNum: 1
  },
  {
    prop: "takeFreightNum",
    label: "提货数量",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true,
    maxNum: 0
  },
  ]
}


const otherPickAddressLcl = {
  httpRequest: setOrderFreightTake,
  orderType: "5",
  freightType: "1",
  columnConfig: [{
    type: "index",
    width: 50,
    align: "center",
  },
  // {
  //   prop: "freightCode",
  //   label: "货物编码",
  //   showOverflowTooltip: true
  // },
  {
    prop: "packNum",
    label: "件数",
    showOverflowTooltip: true,
    maxNum: 1
  },
  {
    prop: "packType",
    label: "包装",
    showOverflowTooltip: true,
    basicType: 'packagingCode'
  },
  {
    prop: "takeFreightNum",
    label: "提货数量",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true,
    maxNum: 0

  },
  ]
}
export { tableColumns, otherPickAddressFcl, otherPickAddressLcl };
