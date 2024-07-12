import { toFixedNum } from "@/utils/instructions";
import {
  httpFBAWarehouseSelect,
  httpWarehousePublicSelect,
} from "@/comModel/warehouse.js";
import {
  httpUserSelect,
  httpCabinetTypeSelect,
  httpChannelSelect,
  httpPortPublicSelect,
} from "@/comModel/httpSelect.js";
import { getUserList } from "@/api/common.js";
export const channelCol = {
  id: "channel",
  label: "渠道：",
  placeholder: "渠道",
  ...httpChannelSelect,
};

export const startWarehouse = {
  id: "startWarehouse",
  label: "起始港：",
  placeholder: "起始港",
  ...httpPortPublicSelect("0"),
};
export const startWarehouses = {
  id: "startWarehouse",
  label: "起始仓：",
  placeholder: "起始仓",
  // ...httpFBAWarehouseSelect('0,1,2,3', { itemValue: "id" })
  ...httpWarehousePublicSelect({
    itemId: "parentId",
    flagAvailable: "y",
    dataStatusIn: "1,2",
  }),
};
export const destinationWarehouse = {
  id: "endWarehouse",
  label: "目的港：",
  placeholder: "目的港",
  ...httpPortPublicSelect("0"),
};

// 货物目的港
export const searchEndWarehouse = {
  id: "endWarehouse",
  label: "目的港：",
  placeholder: "目的港",
  ...httpPortPublicSelect("0"),
};
// 货物目的仓
export const searchEndWarehouses = {
  id: "endWarehouse",
  label: "目的仓：",
  placeholder: "目的仓",
  ...httpFBAWarehouseSelect("0,1,2,3", { itemValue: "warehouseId" }),
};

export const salesmanCol = {
  id: "name",
  label: "业务员：",
  placeholder: "业务员",
  type: "autocomplete",
  ...httpUserSelect(),
};

export const warehousingStatus = {
  id: "inWarehouseStatus",
  label: "入仓状态：",
  placeholder: "入仓状态",
  type: "select",
  basicType: "inOutWarehouseStatus",
  hideList: [2, 3, 4],
};

export const materialInfo = {
  id: "infoType",
  label: "产品信息：",
  placeholder: "请选择",
  type: "select",
  basicType: "information",
};

export const cabinetTypeCol = {
  id: "boxModel",
  label: "柜型：",
  placeholder: "此处选择柜型",
  ...httpCabinetTypeSelect,
};
export const TABLE_COL_1 = {
  prop: "bookingSpaceProxyName",
  label: "订舱代理",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

// 列表顺序固定 - 使用下标引用
export const comTableCols = [
  //待排柜
  {
    prop: "torderNo",
    label: "工作单号",
    minWidth: 120,
    fixed: "left",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "channel",
    label: "渠道",
    minWidth: 120,
    fixed: "left",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "userShortName",
    label: "委托人",
    minWidth: 100,
    fixed: "left",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "transportType",
    label: "运输方式",
    minWidth: 120,
    fixed: "left",
    sortable: true,
    showOverflowTooltip: true,
    render: (row) => {
      return row.channel || "";
    },
  },
  {
    prop: "aimCountry",
    label: "目的国",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "startWarehouse",
    label: "交货仓",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "endWarehouse",
    label: "目的仓",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "customsDeclarationType",
    label: "报关方式",
    minWidth: 120,
    customRow: true,
    showOverflowTooltip: true,
    sortable: true,
    basicType: "customsDeclarationType",
  },
  {
    prop: "dataMsg",
    label: "资料信息",
    customRow: true,
    minWidth: 100,
    basicType: "information",
    showOverflowTooltip: true,
  },
  {
    prop: "inWarehouseStatus",
    label: "入仓状态",
    width: 100,
    fontColor: true,
    basicType: "inOutWarehouseStatus",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "expectInWarehouseTime",
    label: "预计入仓时间",
    width: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "inWarehouseTime",
    label: "实际入仓时间",
    width: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "expectSumBoxNum",
    label: "(预计)总箱数/件数",
    align: "center",
    width: 155,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "expectSumWeight",
    label: "(预计)总重量(KG)",
    width: 155,
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    render: (rows) => toFixedNum(rows.expectSumWeight),
  },
  {
    prop: "expectCbm",
    label: "(预计)立方(CBM)",
    width: 155,
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    render: (rows) => toFixedNum(rows.expectCbm),
  },
  {
    prop: "remark",
    label: "备注",
    width: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "followBy",
    label: "业务员",
    width: 100,
    sortable: true,
    showOverflowTooltip: true,
  },
  TABLE_COL_1,
];

export const comTableDoneCols = [
  //已排柜
  {
    prop: "torderNo",
    label: "工作单号",
    fixed: "left",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "channel",
    label: "渠道",
    fixed: "left",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "userShortName",
    label: "委托人",
    fixed: "left",
    minWidth: 100,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "transportType",
    label: "运输方式",
    minWidth: 120,
    fixed: "left",
    sortable: true,
    showOverflowTooltip: true,
    render: (row) => {
      return row.channel || "";
    },
  },
  {
    prop: "aimCountry",
    label: "目的国",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "startWarehouse",
    label: "交货仓",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "endWarehouse",
    label: "目的仓",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "startPort",
    label: "起始港",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "endPort",
    label: "目的港",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "customsDeclarationType",
    label: "报关方式",
    minWidth: 120,
    customRow: true,
    showOverflowTooltip: true,
    sortable: true,
    basicType: "customsDeclarationType",
  },
  {
    prop: "dataMsg",
    label: "资料信息",
    customRow: true,
    minWidth: 100,
    basicType: "information",
    showOverflowTooltip: true,
  },
  {
    prop: "inWarehouseStatus",
    label: "入仓状态",
    width: 100,
    fontColor: true,
    sortable: true,
    basicType: "inOutWarehouseStatus",
    showOverflowTooltip: true,
  },
  {
    prop: "expectInWarehouseTime",
    label: "预计入仓时间",
    width: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "inWarehouseTime",
    label: "实际入仓时间",
    width: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "expectSumBoxNum",
    label: "(预计)总箱数/件数",
    align: "center",
    width: 155,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "expectSumWeight",
    label: "(预计)总重量(KG)",
    width: 155,
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    render: (rows) => toFixedNum(rows.expectSumWeight),
  },
  {
    prop: "expectCbm",
    label: "(预计)立方(CBM)",
    width: 155,
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    render: (rows) => toFixedNum(rows.expectCbm),
  },
  {
    prop: "remark",
    label: "备注",
    width: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "followBy",
    label: "业务员",
    width: 100,
    sortable: true,
    showOverflowTooltip: true,
  },
];

export const estimateTime = {
  id: "estimateTime",
  label: "预计入仓时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

export const actualTime = {
  id: "actualTime",
  label: "实际入仓时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

export const shortNameCol = {
  id: "shortName",
  label: "客户名称：",
  placeholder: "客户名称",
  type: "text",
};

export const orderNoCol = {
  id: "multipleOrderNo",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text",
};
