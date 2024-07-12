import { getUserList } from "@/api/common.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpGetServiceChannel } from "@/comModel/httpSelect";

const SEARCH_FORM_COL_1 = {
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "头程运输方式",
  type: "select",
  basicType: "headTransportMode",
};

const SEARCH_FORM_COL_2 = {
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "尾程运输方式",
  type: "select",
  basicType: "outWarehouseWay",
};

const searchColumns_fixed = [
  {
    id: "customerId",
    label: "委托人信息：",
    placeholder: "委托人信息",
    type: "autocomplete",
    searchParamName: "companyNameCn",
    httpRequest: getUserList,
    defaultProp: {
      value: "Id",
      label: "companyNameCn",
    },
  },
  {
    id: "operationOrderNum",
    label: "工作单号：",
    placeholder: "工作单号",
    type: "text",
  },
  {
    id: "sortCode",
    label: "国内登记号：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "transactionWarehouseId",
    label: "国内交货仓：",
    placeholder: "国内交货仓",
    ...httpWarehousePublicSelect({
      itemId: "parentId",
      flagAvailable: "y",
      dataStatusIn: "1,2",
    }),
  },
];

const searchColumns = [
  {
    id: "warehousingTime",
    label: "预计入仓时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  ...searchColumns_fixed,
  {
    startId: "forecastWeightBegin",
    endId: "forecastWeightEnd",
    label: "预报重量：",
    startPlaceholder: "重量<",
    endPlaceholder: "≤重量",
    type: "rangeSelect",
    numDecimal: 2,
  },
  {
    startId: "forecastVolumeBegin",
    endId: "forecastVolumeEnd",
    label: "预报体积：",
    startPlaceholder: "体积<",
    endPlaceholder: "≤体积",
    type: "rangeSelect",
    numDecimal: 2,
  },
  SEARCH_FORM_COL_1,
  SEARCH_FORM_COL_2,
];

const searchColumnsDone = [
  {
    id: "realWarehousingTime",
    label: "实际入仓时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  ...searchColumns_fixed,
  {
    startId: "warehousingWeightBegin",
    endId: "warehousingWeightEnd",
    label: "核实重量：",
    startPlaceholder: "重量<",
    endPlaceholder: "≤重量",
    type: "rangeSelect",
    numDecimal: 2,
  },
  {
    startId: "warehousingVolumeBegin",
    endId: "warehousingVolumeEnd",
    label: "核实体积：",
    startPlaceholder: "体积<",
    endPlaceholder: "≤体积",
    type: "rangeSelect",
    numDecimal: 2,
  },
  {
    id: "warehousingStatusList",
    label: "状态：",
    placeholder: "状态",
    type: "select",
    basicType: "inOutWarehouseStatus",
    hideList: [0],
  },
  SEARCH_FORM_COL_1,
  SEARCH_FORM_COL_2,
];

const searchConfig = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns,
            },
          ],
        },
      ],
    },
  ],
  searchNum: searchColumns.length,
};

const searchConfigDone = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumnsDone,
            },
          ],
        },
      ],
    },
  ],
  searchNum: searchColumnsDone.length,
};

const tableColumns_fixed_1 = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    prop: "operationOrderNum",
    label: "工作单号",
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
    sortable: true,
    fixed: "left",
  },
  {
    prop: "customerName",
    label: "委托人信息",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
  },
  {
    prop: "sortCode",
    // label: "排柜编码",
    label: "国内登记号",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
  },
  {
    prop: "headTransportModeName",
    label: "头程运输方式",
    minWidth: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "outWarehouseWayName",
    label: "尾程运输方式",
    minWidth: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
];

const tableColumns_fixed = [
  {
    prop: "boxCount",
    label: "预报箱数",
    showOverflowTooltip: true,
    align: "center",
    minWidth: 100,
    sortable: true,
  },
  {
    prop: "boxWeight",
    label: "预报重量/KG",
    showOverflowTooltip: true,
    minWidth: 130,
    sortable: true,
    align: "right",
    render: (row) => {
      return row.boxWeight ? Number(row.boxWeight).toFixed(2) : "0.00";
    },
  },
  {
    prop: "boxVolume",
    label: "预报体积/CBM",
    showOverflowTooltip: true,
    minWidth: 140,
    sortable: true,
    align: "right",
    render: (row) => {
      return row.boxVolume ? Number(row.boxVolume).toFixed(2) : "0.00";
    },
  },
  {
    prop: "transactionWarehouse",
    label: "交货仓",
    showOverflowTooltip: true,
    minWidth: 140,
    sortable: true,
    align: "right",
  },
];

const tableColumns_wait_1 = [
  {
    prop: "warehousingTime",
    label: "预计入仓时间",
    showOverflowTooltip: true,
    minWidth: 130,
    sortable: true,
  },
  ...tableColumns_fixed,
];

const tableColumns_done_1 = [
  {
    prop: "realWarehousingTime",
    label: "实际入仓时间",
    showOverflowTooltip: true,
    minWidth: 130,
    sortable: true,
  },
  ...tableColumns_fixed,
];

const tableColumns_done_2 = [
  {
    prop: "warehousingBoxNum",
    label: "核实箱数",
    showOverflowTooltip: true,
    align: "center",
    minWidth: 120,
    sortable: true,
  },
  {
    prop: "warehousingWeight",
    label: "核实重量/KG",
    showOverflowTooltip: true,
    minWidth: 130,
    sortable: true,
    align: "right",
    render: (row) => {
      return row.warehousingWeight
        ? Number(row.warehousingWeight).toFixed(2)
        : "0.00";
    },
  },
  {
    prop: "warehousingVolume",
    label: "核实体积/CBM",
    showOverflowTooltip: true,
    minWidth: 140,
    sortable: true,
    align: "right",
    render: (row) => {
      return row.warehousingVolume
        ? Number(row.warehousingVolume).toFixed(2)
        : "0.00";
    },
  },
];

const tableColumns_fixed_2 = [
  {
    prop: "consigneeWarehouseCode",
    label: "目的地址",
    width: 150,
    showOverflowTooltip: true,
    render: (row) => {
      return row.consigneeCount
        ? `${row.consigneeCount}个: ${row.consigneeWarehouseCode}`
        : "--";
    },
    sortable: true,
  },
  {
    prop: "warehousingStatus",
    label: "状态",
    width: 100,
    sortable: true,
    dotColor: true,
    showOverflowTooltip: true,
    basicType: "inOutWarehouseStatus",
    fixed: "right",
  },
  {
    prop: "salesman",
    label: "业务员",
    showOverflowTooltip: true,
    width: 100,
    sortable: true,
    fixed: "right",
  },
  {
    prop: "operator",
    label: "操作员",
    showOverflowTooltip: true,
    width: 100,
    sortable: true,
    fixed: "right",
  },
  {
    prop: "operation",
    label: "操作",
    width: 100,
    fixed: "right",
    customRow: true,
  },
];

const tableColumns = {
  grossTotal: [
    {
      label: "预报箱数：",
      prop: "boxCount",
      decimal: 0,
    },
    {
      label: "预报重量/KG：",
      prop: "boxWeight",
      decimal: 2,
    },
    {
      label: "预报体积/CBM：",
      prop: "boxVolume",
      decimal: 2,
    },
  ],
  tableLists: [
    ...tableColumns_fixed_1,
    ...tableColumns_wait_1,
    ...tableColumns_fixed_2,
  ],
};
const tableColumnsDone = {
  grossTotal: [
    {
      label: "预报箱数：",
      prop: "boxCount",
      decimal: 0,
    },
    {
      label: "预报重量/KG：",
      prop: "boxWeight",
      decimal: 2,
    },
    {
      label: "预报体积/CBM：",
      prop: "boxVolume",
      decimal: 2,
    },
    {
      label: "核实箱数：",
      prop: "warehousingBoxNum",
      decimal: 0,
    },
    {
      label: "核实重量/KG：",
      prop: "warehousingWeight",
      decimal: 2,
    },
    {
      label: "核实体积/CBM：",
      prop: "warehousingVolume",
      decimal: 2,
    },
  ],
  tableLists: [
    ...tableColumns_fixed_1,
    ...tableColumns_done_1,
    ...tableColumns_done_2,
    ...tableColumns_fixed_2,
  ],
};

const cardConfig = [
  {
    bgColor: "#ECF3FF",
    icon: "yunshu1",
    type: "slot",
    prop: "addr",
    labelColor: "#80B1FF",
    valueColor: "#5094FF",
    flex: 1,
  },
  {
    bgColor: "#FFF3EC",
    icon: "songhuofangshi",
    type: "slot",
    label: "运输方式",
    prop: "transportType",
    labelColor: "#FF965E",
    valueColor: "#FF813D",
    flex: 0.5,
  },
  {
    bgColor: "#ECECFF",
    icon: "icon-dingdanhao",
    label: "工作单号",
    prop: "operationOrderNum",
    labelColor: "#B1B1FF",
    valueColor: "#7676FF",
    flex: 0.5,
  },
  // {
  //   bgColor: '#D2F1FF',
  //   icon: 'icon-dingdanhao',
  //   label: '订单号',
  //   prop: 'operationOrderNum',
  //   labelColor: '#64CFFF',
  //   valueColor: '#13B5FF'
  // },
];

const goodsTableColumns = {
  grossTotal: [
    {
      label: "目的地：",
      prop: "consigneeWarehouseId",
      util: "个",
    },
    {
      label: "合计箱数：",
      propTop: "boxCount",
      propBtm: "warehousingBoxNum",
      decimal: 0,
    },
    {
      label: "总毛重：",
      compute: true,
      factor: [
        { propTop: "boxWeight", propBtm: "warehousingWeight" },
        { propTop: "boxCount", propBtm: "warehousingBoxNum" },
      ],
    },
    {
      label: "总体积：",
      compute: true,
      factor: [
        { propTop: "boxVolume", propBtm: "warehousingVolume" },
        { propTop: "boxCount", propBtm: "warehousingBoxNum" },
      ],
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "ShipmentId",
      prop: "shipmentId",
      showOverflowTooltip: true,
      minWidth: 100,
    },
    {
      label: "ReferenceId",
      prop: "referenceId",
      showOverflowTooltip: true,
      minWidth: 100,
    },
    {
      label: "箱号",
      prop: "boxNumber",
      showOverflowTooltip: true,
    },
    {
      label: "目的地",
      prop: "consigneeWarehouseCode",
      showOverflowTooltip: true,
      customRow: true,
    },
    {
      label: "箱数",
      prop: "boxCount",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 100,
      decimal: 0,
    },
    {
      label: " 箱长(CM)",
      prop: "boxLength",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
    },
    {
      label: "箱宽(CM)",
      prop: "boxWidth",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
    },
    {
      label: "箱高(CM)",
      prop: "boxHeight",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
    },
    {
      label: "单箱毛重(KG)",
      prop: "boxWeight",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
    },
    {
      label: "单箱体积m³",
      prop: "boxVolume",
      align: "right",
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
    },
  ],
};

export {
  searchConfig,
  searchConfigDone,
  tableColumns,
  tableColumnsDone,
  cardConfig,
  goodsTableColumns,
};
