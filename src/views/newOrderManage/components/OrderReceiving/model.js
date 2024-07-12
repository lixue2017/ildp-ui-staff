import { httpUserSelect, httpRoleDeptUserSelect, httpEnterprisetSelect } from "@/comModel/httpSelect.js"
import { httpWarehousePublicSelect } from '@/comModel/warehouse';

// 接单配置
const FORM_TABLE_1 = {
  span: 12,
  id: "operationOrderNum",
  label: "工作单号：",
  labelWidth: "120px",
  placeholder: "--",
  type: "slot",
}
const FORM_TABLE_2 = {
  span: 12,
  id: "isWarehousing",
  label: "是否入仓：",
  type: "slot",
  labelWidth: "120px",
}
const FORM_TABLE_3 = {
  span: 12,
  id: "freightType",
  label: "装箱方式：",
  placeholder: "--",
  type: "txt",
  labelWidth: "120px",
  basicType: "freightType",
  basicTypeVal: "freightType",
}
const FORM_TABLE_4 = {
  span: 12,
  id: "putWarehouseTime",
  label: "预计入库时间：",
  labelWidth: "120px",
  placeholder: "--",
  type: "txt",
}
const FORM_TABLE_5 = {
  span: 12,
  id: "operator",
  label: "操作员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
}
const FORM_TABLE_6 = {
  span: 12,
  id: "proxyType",
  label: "代理类型：",
  placeholder: "--",
  type: "radio",
  basicType: "clientIdentity",
  hideList: [2, 3, 4],
  labelWidth: "120px",
}
const FORM_TABLE_7 = {
  span: 12,
  id: "fileMember",
  label: "文件员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
}
const FORM_TABLE_8 = {
  span: 12,
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  labelWidth: "120px",
  placeholder: "请选择订舱代理",
  ...httpEnterprisetSelect(),
  type: "slot",
}
const FORM_TABLE_9 = {
  span: 12,
  id: "salesman",
  label: "销售员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
	disabled: true

}
const FORM_TABLE_10 = {
  span: 12,
  id: "salesAssistant",
  label: "销售助理：",
  labelWidth: "120px",
  placeholder: "请选择销售助理",
  ...httpUserSelect()
}
const FORM_TABLE_11 = {
  span: 12,
  id: "cusService",
  label: "客服：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
}
const FORM_TABLE_12 = {
  span: 12,
  id: "bookingPeople",
  label: "订舱人：",
  labelWidth: "120px",
  placeholder: "请选择订舱人",
  ...httpUserSelect()
}
const FORM_TABLE_13 = {
  span: 24,
  id: "remark",
  label: "备注：",
  labelWidth: "120px",
  placeholder: "备注说明",
  type: "text",
}
const FORM_TABLE_14 = {
  span: 12,
  id: "proxyType",
  label: "头程代理类型：",
  type: "radio",
  dicsStr: 'headAgency_type',
  customDicsArr: [0, 1],
  labelWidth: "120px",
}
const FORM_TABLE_15 = {
  span: 12,
  id: "overseasAgency",
  label: "海外代理：",
  labelWidth: "120px",
  ...httpEnterprisetSelect({ typeList: 0 }),
  type: "slot",
  searchIdPageSize: 100,
};
const FORM_TABLE_17 = {
  span: 12,
  id: "containerTrailer",
  label: "集装箱拖车：",
  type: "radio",
  dicsStr: 'containerTrailer_type',
  customDicsArr: [0, 1],
  labelWidth: "120px",
}
const FORM_TABLE_18 = {
  span: 12,
  id: "overseasAgencyType",
  label: "海外代理类型：",
  type: "radio",
  dicsStr: 'overseasAgent_type',
  customDicsArr: [0, 1, 2],
  labelWidth: "120px",
}
const FORM_TABLE_19 = {
  id: "transactionWarehouse",
  label: "国内交货仓：",
  placeholder: "国内交货仓",
  labelWidth: "120px",
  ...httpWarehousePublicSelect({ itemId: "parentId" }),
}
const FORM_TABLE_20 = {
  span: 12,
  id: "orderBusinessType",
  label: "业务类型：",
  placeholder: "--",
  type: "txt",
  labelWidth: "120px",
  basicType: "orderBusinessType",
  basicTypeVal: "orderBusinessType",
}
export const FORMRULES_CONFIG = {
  bookingSpaceProxy: [
    { required: true, message: "请选择订舱代理", trigger: "blur" },
  ],
  operator: [
    { required: true, message: "请选择操作员", trigger: "blur" },
  ],
  salesman: [
    { required: true, message: "请选择销售员", trigger: "blur" },
  ],
  fileMember: [
    { required: true, message: "请选择文件员", trigger: "blur" },
  ],
  isWarehousing: [
    { required: true, message: "请选择是否入仓", trigger: "blur" },
  ],
  shipmentPeriod: [
    { required: true, message: "请选择开航期", trigger: "blur" },
  ],
  overseasAgencyType: [
    { required: true, message: "请选择海外代理类型", trigger: "blur" },
  ],
  overseasAgency: [
    { required: true, message: "请选择海外代理", trigger: "blur" },
  ],
  containerTrailer: [
    { required: true, message: "请选择集装箱拖车", trigger: "blur" },
  ],
  proxyType: [
    { required: true, message: "请选择头程代理类型", trigger: "blur" },
  ],
  transactionWarehouse: [
    { required: true, message: "请选择国内交货仓", trigger: "blur" },
  ],
}


const traditionFcl = (row) => {
  //传统整柜
  const { isTradeClause } = row
  const config = {
    defaultModel: {
      proxyType: 1,
      isWarehousing: '0',
      isArrangeContainer: 1
    },
    lists: [
      {
        ...FORM_TABLE_1,//关联订单
        basicType: "tradeClause",
        basicTypeVal: "tradeClause",
      },
      FORM_TABLE_17,//集装箱拖车，
      FORM_TABLE_9,//销售员
      {
        ...FORM_TABLE_19,
        label: "交货仓："
      },//交货仓
      FORM_TABLE_10,//销售助理
      {
        ...FORM_TABLE_4,
        type: 'date',
        placeholder: "请选择预计入库时间"
      },//预计入库时间
      FORM_TABLE_5,//操作员
      FORM_TABLE_8,//订舱代理
      FORM_TABLE_7,//文件员
      {
        ...FORM_TABLE_18,
        // disable: isTradeClause == 1 ? false : true,
        disable: true,
        customDicsArr: [0, 1],
      },//海外代理类型
      FORM_TABLE_11,//客服
      {
        ...FORM_TABLE_15,
        // disabled: isTradeClause == 1 ? false : true,
        // className: isTradeClause == 1 ? "" : 'auto-dis-no-icon auto-dis-search'
        disabled: true,
        className: 'auto-dis-no-icon auto-dis-search'
      },//海外代理
      FORM_TABLE_13,//备注
    ],
    formRules: {
       containerTrailer: [
        { required: true, message: "请选择集装箱拖车", trigger: "blur" },
      ],
      bookingSpaceProxy: [
        { required: true, message: "请选择订舱代理", trigger: "blur" },
      ],
      operator: [
        { required: true, message: "请选择操作员", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "blur" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "blur" },
      ],
    }
  }
  return config
}
const traditionLcl = (row) => {
  // 传统-散货
  const { isTradeClause } = row
  const config = {
    defaultModel: {
      proxyType: 1,
      isWarehousing: '0'
    },
    lists: [
      {
        ...FORM_TABLE_1,//关联订单
        basicType: "tradeClause",
        basicTypeVal: "tradeClause",
      },
      {
        ...FORM_TABLE_2,//是否入仓
        type: "radio",
        dicsStr: 'web_whether',
        customDicsArr: [1, 0],
      },
      FORM_TABLE_9,//销售员
      FORM_TABLE_19,//国内交货仓
      FORM_TABLE_10,//销售助理
      {
        ...FORM_TABLE_14,
        type: "txt"
      },//头程代理类型,
      FORM_TABLE_5,//操作员
      FORM_TABLE_8,//订舱代理
      FORM_TABLE_7,//文件员
      {
        ...FORM_TABLE_18,
        disable: isTradeClause == 1 ? false : true,
        customDicsArr: [0, 1],
      },//海外代理类型
      FORM_TABLE_11,//客服
      {
        ...FORM_TABLE_15,
        disabled: isTradeClause == 1 ? false : true,
        className: isTradeClause == 1 ? "" : 'auto-dis-no-icon auto-dis-search'
      },//海外代理
      FORM_TABLE_13,//备注
    ],

    formRules: {
      isWarehousing: [
        { required: true, message: "请选择是否入仓", trigger: "blur" },
      ],
      bookingSpaceProxy: [
        { required: true, message: "请选择订舱代理", trigger: "blur" },
      ],
      shipmentPeriod: [
        { required: true, message: "请选择开航期", trigger: "blur" },
      ],
      operator: [
        { required: true, message: "请选择操作员", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "blur" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "blur" },
      ],
      overseasAgencyType: [
        { required: true, message: "请选择海外代理类型", trigger: "blur" },
      ],
      overseasAgency: [
        { required: true, message: "请选择海外代理", trigger: "blur" },
      ],
    }
  }
  if (isTradeClause !== 1) {
    config.formRules = {
      isWarehousing: [
        { required: true, message: "请选择是否入仓", trigger: "blur" },
      ],
      bookingSpaceProxy: [
        { required: true, message: "请选择订舱代理", trigger: "blur" },
      ],
      shipmentPeriod: [
        { required: true, message: "请选择开航期", trigger: "blur" },
      ],
      operator: [
        { required: true, message: "请选择操作员", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "blur" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "blur" },
      ],
    }
  }
  return config
}
const eCommerceFcl = (row, configures) => {
  // 电商-整柜FCL
  const { transactionWarehouse } = configures
  transactionWarehouse.disabled = true
  transactionWarehouse.className = 'auto-dis-no-icon auto-dis-search'
  const { isEligible } = row
  const config = {
    defaultModel: {
      proxyType: 0,//代理类型
      orderType: 2,//订单类型
      isArrangeContainer: 1,//是否安排集装箱
      overseasAgencyType: '0',
      containerTrailer: "0"
    },
    lists: [
      FORM_TABLE_1,//关联订单
      FORM_TABLE_17,//集装箱拖车，
      FORM_TABLE_9,//销售员
      {
        ...FORM_TABLE_19,
        type: "slot"
      },//国内交货仓
      FORM_TABLE_10,//销售助理
      {
        ...FORM_TABLE_14,
        disable: true,
        className: 'auto-dis-no-icon auto-dis-search'
      },//头程代理类型,
      FORM_TABLE_5,//操作员
      {
        ...FORM_TABLE_8,
        disabled: true,
        className: 'auto-dis-no-icon auto-dis-search',
        type: "autocomplete"
      },//订舱代理
      FORM_TABLE_7,//文件员
      {
        ...FORM_TABLE_18,
        customDicsArr: [0, 1]
      },//海外代理类型
      FORM_TABLE_11,//客服
      FORM_TABLE_15,//海外代理
      FORM_TABLE_13,//备注
    ],
    formRules: {
      bookingSpaceProxy: [
        { required: true, message: "请选择订舱代理", trigger: "blur" },
      ],
      operator: [
        { required: true, message: "请选择操作员", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "blur" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "blur" },
      ],
      containerTrailer: [
        { required: true, message: "请选择集装箱拖车", trigger: "blur" },
      ],
      proxyType: [
        { required: true, message: "请选择头程代理类型", trigger: "blur" },
      ],
      overseasAgencyType: [
        { required: true, message: "请选择海外代理类型", trigger: "blur" },
      ],
      overseasAgency: [
        { required: true, message: "请选择海外代理", trigger: "blur" },
      ],
    }
  }
  return config
}
const eCommerceLcl = (row) => {
  //电商散货
  const { isEligible, operationOrderType } = row
  const config = {
    defaultModel: {
      proxyType: '',
      orderType: 2,
      isWarehousing: 1
    },
    lists: [
      FORM_TABLE_1,//关联订单
      FORM_TABLE_2,//是否入仓
      FORM_TABLE_9,//销售员
      FORM_TABLE_4,//预计入库时间
      FORM_TABLE_10,//销售助理
      {
        ...FORM_TABLE_14,
        customDicsArr: isEligible == 1 ? [0, 1] : [1],//只有海运，目的国为欧盟和英国，才可选“堡森”
      },//头程代理类型,
      FORM_TABLE_5,//操作员
      FORM_TABLE_8,//订舱代理
      FORM_TABLE_7,//文件员
      {
        ...FORM_TABLE_18,
        customDicsArr: operationOrderType == 0 ? [0, 1] : [0, 1, 2]

      },//海外代理类型
      FORM_TABLE_11,//客服
      FORM_TABLE_15,//海外代理
      FORM_TABLE_13,//备注
    ],
    formRules: {
      bookingSpaceProxy: [
        { required: true, message: "请选择订舱代理", trigger: "blur" },
      ],
      operator: [
        { required: true, message: "请选择操作员", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "blur" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "blur" },
      ],
      proxyType: [
        { required: true, message: "请选择头程代理类型", trigger: "blur" },
      ],
      overseasAgency: [
        { required: true, message: "请选择海外代理", trigger: "blur" },
      ],
    }
  }
  return config
}


const otherOrders = () => {
  const config = {
    lists: [
      {
        ...FORM_TABLE_1,
        type: "txt",
      },//关联订单
      FORM_TABLE_20,//订单业务
      FORM_TABLE_9,//销售员
      FORM_TABLE_10,//销售助理
      FORM_TABLE_5,//操作员
      FORM_TABLE_7,//文件员
      FORM_TABLE_11,//客服
      FORM_TABLE_13,//备注
    ],
    formRules: {
      operator: [
        { required: true, message: "请选择操作员", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "blur" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "blur" },
      ],

    }
  }
  return config
}
export const formConfig = (row = {}, configures) => {
  const { type, ...data } = row
  const lists = {
    '1': traditionFcl(data),//传统整柜
    '2': traditionLcl(data),//传统散货
    '3-0': eCommerceFcl(data, configures),//电商整柜
    '3-1': eCommerceLcl(data),//电商散货
    '4': otherOrders(),//其他订单
  }
  return lists[type]
}
