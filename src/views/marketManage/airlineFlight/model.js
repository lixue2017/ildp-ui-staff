import { bookingAgent } from "@/api/common";
import {
  httpPortPublicSelect,
  shipCompanyList,
} from "@/comModel/httpSelect.js";
const searchColumns = [
  // {
  //   id: "createTime",
  //   label: "创建时间：",
  //   startPlaceholder: "开始日期",
  //   endPlaceholder: "结束日期",
  //   type: "daterange",
  //   valueFormat: "yyyy-MM-dd",
  // },
  {
    id: "code",
    label: "航次编码：",
    placeholder: "航次编码",
    type: "text",
  },
  {
    id: "cabinProxyId",
    label: "订舱代理：",
    placeholder: "订舱代理",
    type: "autocomplete",
    defaultKey: "id",
    httpRequest: bookingAgent,
    defaultProp: {
      value: "id",
      label: "shortName",
    },
  },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态",
    type: "select",
    multiple: true,
    basicType: "navigationStatus",
  },
  {
    id: "name",
    label: "船/航次信息：",
    placeholder: "航空/船公司、船名/航班次、航次",
    type: "text",
  },
  {
    id: "shipCompanyId",
    label: "航空/船公司：",
    placeholder: "请选择航空/船公司",
    ...shipCompanyList(),
  },
  {
    id: "startPortId",
    label: "装货港：",
    placeholder: "请选择装货港",
    ...httpPortPublicSelect(),
  },
  {
    id: "endPortId",
    label: "卸货港：",
    placeholder: "请选择卸货港",
    ...httpPortPublicSelect(),
  },
  // {
  //   id: "type",
  //   label: "类型：",
  //   placeholder: "类型",
  //   type: "select",
  //   basicType: 'transportMode',
  // }
];

const TABLE_COL_5 = {
  prop: "sameIndustryProxyName",
  label: "同行代理",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    prop: "code",
    label: "航次编码",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
    fixed: "left",
  },
  // {
  //   prop: "lineTypeName",
  //   label: "类型",
  //   sortable:true,
  //   showOverflowTooltip: true,
  //   width: 100,
  //   // basicType: 'transportMode',
  //   fixed: 'left'
  // },
  {
    prop: "cabinProxyName",
    label: "订舱代理",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
    fixed: "left",
  },
  // {
  //   prop: "routeName",
  //   label: "航线",
  //   minWidth: 150,
  //   sortable:true,
  //   showOverflowTooltip: true,
  // },
  {
    prop: "shipCompanyName",
    label: "航空/船公司",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 160,
  },
  TABLE_COL_5,
  {
    prop: "flightName",
    label: "船名/航班名",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140,
  },
  {
    prop: "name",
    label: "航次",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "sailOpenTime",
    label: "ETD",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "etaTime",
    label: "ETA",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "startPortName",
    sortable: true,
    showOverflowTooltip: true,
    width: 150,
    label: "装货港",
  },
  // {
  //   prop: "transferName",
  //   sortable:true,
  //   showOverflowTooltip: true,
  //   width:150,
  //   label: "中转港"
  // },
  {
    prop: "endPortName",
    sortable: true,
    showOverflowTooltip: true,
    width: 150,
    label: "卸货港",
  },
  {
    prop: "cabinOpenTime",
    label: "开舱日期",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "cutGateTime",
    label: "截关日期",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "createTime",
    label: "创建时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 150,
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  // {
  //   prop: "cabinNum",
  //   label: "仓位数",
  //   sortable:true,
  //   width: 100,
  //   fixed: 'right',
  // },
  // {
  //   prop: "status",
  //   label: "状态",
  //   dotColor: true,
  //   sortable:true,
  //   showOverflowTooltip: true,
  //   width: 100,
  //   fixed: 'right',
  //   basicType: 'navigationStatus'
  // },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: "right",
    customRow: true,
  },
];

export { searchColumns, tableColumns };
