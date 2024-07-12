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
    httpRequest: getUserList,
    searchParamName: "companyNameCn",
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
    id: "orderBusinessTypeSearch",
    label: "业务类型：",
    placeholder: "业务类型（多选）",
    type: "select",
    multiple: true,
    basicType: "orderBusinessType",
    hideList: [0, 1]
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
    ...httpPortPublicSelect('0,1,2,3'),
  },
  {
    id: "destinationPortId",
    label: "目的港：",
    placeholder: "请选择目的港",
    type: "autocomplete",
    category: "country",
    searchParamName: 'search',
    ...httpPortPublicSelect('0,1,2,3')
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

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    label: "操作单",
    prop: "operationOrderNum",
    customRow: true,
    sortable:true,
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
    widtH: 120,
    sortable:true,
    showOverflowTooltip: true,
    fixed: "left",
  },
  {
    label: "业务类型",
    prop: "orderBusinessType",
    basicType: "orderBusinessType",
    basicTypeVal: "orderBusinessType",
    sortable:true,
    width: 120
  },
  {
    label: "起运港",
    prop: "portOfLoading",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    label: "目的港",
    prop: "destinationPort",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    label: "发货人",
    prop: "consignerCompany",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    label: "收货人",
    prop: "consigneeCompany",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    label: "操作员",
    prop: "operatorName",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    label: "销售员",
    prop: "salesmanName",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    label: "创建时间",
    prop: "createTime",
    sortable:true,
    minWidth: 140,
  },
  {
    label: "状态",
    prop: "orderStatus",
    sortable:true,
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
export { searchColumns, tableColumns };
