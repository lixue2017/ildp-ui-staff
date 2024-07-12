import { getUserList, getChargeStaff } from "@/api/common.js";
import { getContactsPublicList } from "@/api/publicInterface/index.js" //公共接口
import { httpPortPublicSelect } from '@/comModel/httpSelect.js'
const searchColumns = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "customerName",
    label: "委托人：",
    placeholder: "委托人",
    type: "autocomplete",
    searchParamName: "companyNameCn",
    httpRequest: getUserList,
    defaultProp: {
      value: 'companyNameCn',
      label: 'companyNameCn'
    }
  },
  {
    id: "operationOrderNum",
    label: "工作单号：",
    placeholder: "工作单号",
    type: "text",
  },
  {
    id: "tradeClauseSearch",
    label: "贸易条款：",
    placeholder: "贸易条款（多选）",
    type: "select",
    multiple: true,
    basicType: "tradeClause"
  },
  {
    id: "consigneeId",
    label: "收货人：",
    placeholder: "请选择收货人",
    type: "autocomplete",
    searchParamName: 'orderSearch',
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
    id: "sono",
    label: "SONO号：",
    placeholder: "SONO号",
    type: "text",
  },
  {
    id: "ontainerSno",
    label: "箱号：",
    placeholder: "请输入箱号",
    type: "text",
  },
  {
    id: "mblNo",
    label: "MBL号：",
    placeholder: "MBL号",
    type: "text",
  },
  {
    id: "sortBoxRegisterNo",
    label: "拼柜登记号：",
    placeholder: "拼柜登记号",
    type: "text",
  },
  {
    id: "portOfLoadingId",
    label: "装运港：",
    placeholder: "请选择装运港",
    type: "autocomplete",
    category: "country",
    searchParamName: 'search',
    ...httpPortPublicSelect('3'),

  },
  {
    id: "destinationPortId",
    label: "目的港：",
    placeholder: "请选择目的港",
    type: "autocomplete",
    category: "country",
    searchParamName: 'search',
    ...httpPortPublicSelect('3'),

  },
  {
    id: "orderBusinessTypeSearch",
    label: "运输方式：",
    placeholder: "运输方式（多选）",
    type: "select",
    multiple: true,
    basicType: "orderBusinessType",
    hideList: [2, 3, 4, 5]
  },
  {
    id: "salesman",
    label: "销售员：",
    placeholder: "请选择销售员",
    type: "autocomplete",
    httpRequest: getChargeStaff,
    defaultProp: {
      value: 'id',
      label: 'nickName'
    }
  },
  // {
  //   id: "freightType",
  //   label: "装箱方式：",
  //   placeholder: "装箱方式",
  //   type: "select",
  //   basicType: "freightType"
  // },
  {
    id: "shipperId",
    label: "发货人：",
    placeholder: "请选择发货人",
    type: "autocomplete",
    searchParamName: 'orderSearch',
    httpRequest: (params) => getContactsPublicList({ ...params, typeList: 1 }),
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
    id: "operator",
    label: "操作员：",
    placeholder: "请选择操作员",
    type: "autocomplete",
    httpRequest: getChargeStaff,
    defaultProp: {
      value: 'id',
      label: 'nickName'
    }
  },
  {
    id: "statusSearch",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    basicType: "orderStatus"
  },
];

const commonTop = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    label: "工作单号",
    prop: "operationOrderNum",
    customRow: true,
    showOverflowTooltip: true,
    width: 120,
    fixed: "left",
  },
  // {
  //   label: "订单号",
  //   prop: "orderNum",
  //   showOverflowTooltip: true,
  //   width: 120,
  //   fixed: "left",
  // },
  {
    label: "委托人",
    prop: "customerName",
    width: 120,
    showOverflowTooltip: true,
    fixed: "left",
  },
  {
    label: "订舱号/SO NO号",
    prop: "sono",
    showOverflowTooltip: true,
    width: 130,
  },
  {
    label: "MBL号",
    prop: "mblNo",
    showOverflowTooltip: true,
    width: 120,
  },
  {
    label: "箱号",
    prop: "ontainerSno",
    showOverflowTooltip: true,
    width: 120,
  },
  {
    label: "拼柜登记号",
    prop: "sortBoxRegisterNo",
    showOverflowTooltip: true,
    width: 120,
  },
  {
    label: "运输方式",
    prop: "transportMode",
    width: 80,
    render: (row) => {
      return `空运${Number(row.orderBusinessType) === 1 ? '进口' : '出口'}`
    }
  },
  // {
  //   label: "运输方式",
  //   prop: "transportMode",
  //   width: 80,
  //   render: (row, name) => {
  //     if (row.orderType !== 2) {
  //       return name
  //     }
  //     return "空运"
  //   },
  //   basicType: "transportMode",
  //   basicTypeVal: "transportMode",
  // },
  {
    label: "贸易条款",
    prop: "tradeClause",
    basicType: "tradeClause",
    basicTypeVal: "tradeClause",
    width: 80
  }
]

const commonBtm = [
  {
    label: "是否订舱",
    prop: "isBookingSpace",
    customRow: true,
    width: 80
  },
  // {
  //   label: "装箱方式",
  //   prop: "freightType",
  //   basicType: "freightType",
  //   basicTypeVal: "freightType",
  //   width: 80
  // },
  {
    label: "上门提货",
    prop: "isHomeDelivery",
    customRow: true,
    width: 80
  },
  {
    label: "发货人",
    prop: "consignerCompany",
    width: 150,
    showOverflowTooltip: true
  },
  {
    label: "收货人",
    prop: "consigneeCompany",
    width: 150,
    showOverflowTooltip: true
  },
  {
    label: "计重重量 (KG)",
    prop: "realFreightWeight",
    showOverflowTooltip: true,
    width: 140,
    align: 'right'
  },
  {
    label: "计费体积 (CBM)",
    prop: "realFreightVolume",
    showOverflowTooltip: true,
    width: 150,
    align: 'right'
  },
  {
    label: "操作员",
    prop: "operatorName",
    showOverflowTooltip: true
  },
  {
    label: "销售员",
    prop: "salesmanName",
    showOverflowTooltip: true
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 140,
  },
  {
    label: "状态",
    prop: "orderStatus",
    customRow: true,
    basicType: "orderStatus",
    basicTypeVal: "operationOrderStatus",
    showOverflowTooltip: true,
    fixed: "right",
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    customRow: true,
    width: 200
  }
]

const tableColumns = [
  ...commonTop,
  {
    label: "装运港",
    prop: "portOfLoading",
    render: (row) => {
      return `${row.portOfLoading || '--'}`
    },
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: "目的港",
    prop: "destinationPort",
    render: (row) => {
      return `${row.destinationPort || '--'}`
    },
    showOverflowTooltip: true,
    width: 120
  },
  ...commonBtm.filter(e => e.prop !== 'freightType') // 空运不显示装箱方式
]
const ecTableColumns = [
  ...commonTop,
  {
    label: "起始仓",
    prop: "transactionWarehouseName",
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: "目的仓",
    prop: "destinationWarehouseName",
    showOverflowTooltip: true,
    width: 120
  },
  ...commonBtm
]
const tdTableColumns = [
  ...commonTop,
  {
    label: "装运港",
    prop: "portOfLoading",
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: "目的港",
    prop: "destinationPort",
    showOverflowTooltip: true,
    width: 120
  },
  ...commonBtm
]
export { searchColumns, tableColumns, ecTableColumns, tdTableColumns };
