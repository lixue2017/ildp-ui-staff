import { getUserList } from "@/api/common"
import { getportList2 } from '@/api/operationalData/index'
import { getContactsPublicList } from "@/api/publicInterface/index.js"
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
    id: "customerName",
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
    id: "orderNum",
    label: "订单号：",
    placeholder: "订单号",
    type: "text",
  },
  {
    id: "orderBusinessTypeSearch",
    label: "业务类型：",
    placeholder: "业务类型（多选）",
    type: "select",
    multiple: true,
    basicType: "orderBusinessType"
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
    id: "portOfLoadingId",
    label: "装运港：",
    placeholder: "请选择装运港",
    type: "autocomplete",
    category: "country",
    searchParamName: 'search',
    labelWidth: "120px",
    httpRequest: (params) => getportList2({ ...params, portTypes: "0,1,2,3" }),
    defaultProp: {
      value: 'id',
      label: 'code,nameCn'
    }
  },
  {
    id: "destinationPortId",
    label: "目的港：",
    placeholder: "请选择目的港",
    type: "autocomplete",
    category: "country",
    searchParamName: 'search',
    httpRequest: (params) => getportList2({ ...params, portTypes: "0,1,2,3" }),
    defaultProp: {
      value: 'id',
      label: 'code,nameCn'
    }
  },
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
    id: "countryId",
    label: "国家：",
    placeholder: "请选择国家",
    type: "autocomplete",
    category: "country",
    defaultProp: {
      value: 'id',
      label: 'twoCode,nameCn'
    }
  },
  {
    id: "statusSearch",
    label: "状态：",
    placeholder: "状态（多选）",
    labelWidth: "120px",
    type: "select",
    multiple: true,
    basicType: "orderStatus"
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
  ],
};
const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    label: "订单号",
    prop: "orderNum",
    customRow: true,
    showOverflowTooltip: true
  },
  {
    label: "委托人",
    prop: "customerName",
    width: 120,
    showOverflowTooltip: true
  },
  {
    label: "国家",
    prop: "countryName",
    width: 140,
    showOverflowTooltip: true
  },
  // {
  //   label: "贸易条款",
  //   prop: "tradeClause",
  //   basicType: "tradeClause",
  //   customRow: true,
  //   width: 80
  // },
  // {
  //   label: "运输方式",
  //   prop: "transportMode",
  //   basicType: "transportMode",
  //   customRow: true,
  //   width: 80
  // },
  {
    label: "业务类型",
    prop: "orderBusinessType",
    basicType: "orderBusinessType",
    width: 120
  },
  {
    label: "装运港",
    prop: "portOfLoading",
    width: 120,
    showOverflowTooltip: true
  },
  {
    label: "目的港",
    prop: "destinationPort",
    width: 120,
    showOverflowTooltip: true
  },
  // {
  //   label: "装箱方式",
  //   prop: "freightType",
  //   basicType: "freightType",
  //   customRow: true,
  //   width: 80
  // },
  // {
  //   label: "上门提货",
  //   prop: "isHomeDelivery",
  //   customRow: true,
  //   width: 80
  // },
  {
    label: "发货人",
    prop: "consigneeName",
    width: 150,
    showOverflowTooltip: true
  },
  {
    label: "收货人",
    prop: "shipperName",
    width: 150,
    showOverflowTooltip: true
  },
  {
    label: "通知人",
    prop: "notifierName",
    width: 150,
    showOverflowTooltip: true
  },
  {
    label: "备注",
    prop: "remark",
    showOverflowTooltip: true
  },
  {
    label: "状态",
    prop: "orderStatus",
    customRow: true,
    width: 120,
    basicType: 'orderStatus',
    showOverflowTooltip: true
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 135
  },
  {
    label: "打回次数",
    prop: "backNum",
    align: "right",
    render: (row) => {
      return row.audit.auditNum
    }
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    customRow: true,
    width: 140
  }
]

export { searchColumns, tableColumns };
