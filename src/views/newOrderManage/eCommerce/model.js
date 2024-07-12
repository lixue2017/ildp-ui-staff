import { getUserList } from "@/api/common.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { SEARCH_COL } from "@/views/newOrderManage/components/model.js";

const SEARCH_COL_9 = {
  id: "shipmentId",
  label: "Shipment ID：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "cusOrderNumber",
  label: "客户单号：",
  placeholder: "客户单号",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "quickOrder",
  label: "快速下单：",
  placeholder: "快速下单",
  type: "select",
  basicType: "quickOrderType",
};
const SEARCH_COL_11 = {
  id: "productAttributeList",
  label: "产品属性：",
  placeholder: "请选择",
  type: "select",
  multiple: true,
  basicType: "orderProductAttribute",
};
export const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  {
    id: "companyNameCn",
    label: "委托人：",
    placeholder: "委托人",
    type: "autocomplete",
    searchParamName: "companyNameCn",
    httpRequest: getUserList,
    defaultProp: {
      value: "Id",
      label: "companyNameCn",
    },
  },
  {
    id: "number",
    label: "工作单号：",
    placeholder: "请输入（空格隔开查询多个）",
    type: "textarea",
    maxlength: 1850,
    minRows: 1,
    maxRows: 1,
    zkRows: 3,
    sqRows: 1,
    showWordLimit: false,
    // residueCol: 2,
  },
  SEARCH_COL_4,
  {
    id: "wholeCabinetSn",
    label: "国内登记号：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "salesmanName",
    label: "业务员：",
    ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
    selectLabelKey: "salesman",
  },
  {
    id: "headTransportMode",
    label: "头程运输方式：",
    placeholder: "头程运输方式",
    type: "select",
    basicType: "headTransportMode",
  },
  {
    id: "outWarehouseWay",
    label: "尾程运输方式：",
    placeholder: "尾程运输方式",
    type: "select",
    basicType: "outWarehouseWay",
  },
  {
    id: "countryId",
    label: "目的国：",
    type: "autocomplete",
    category: "country",
    defaultProp: {
      value: "id",
      label: "twoCode,nameCn",
    },
  },
  // {
  //   id: "inlandExportParam",
  //   label: "产品情况：",
  //   placeholder: "请选择",
  //   type: "select",
  //   basicType: 'productSituation',
  // },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    basicType: "orderStatus",
    hideList: [45],
    expandValFilter: ["2", "4", "6"],
  },
  {
    id: "encasementWay",
    label: "装箱方式：",
    placeholder: "请选择",
    type: "select",
    basicType: "freightType",
  },
  {
    id: "transactionWarehouseId",
    label: "国内交货仓：",
    ...httpWarehousePublicSelect({
      itemId: "parentId",
      flagAvailable: "y",
      dataStatusIn: "1,2",
    }), //flagAvailable:y筛选杭州仓
  },
  {
    id: "consigneeWarehouseId",
    label: "目的仓：",
    ...httpWarehousePublicSelect({ typeList: "0,1,2,3,4", itemId: "id" }),
  },
  {
    id: "reportCustomsWays",
    label: "报关类型：",
    placeholder: "报关类型（多选）",
    type: "select",
    multiple: true,
    basicType: "customsDeclarationType",
  },
  {
    id: "customsClearanceType",
    label: "清关方式：",
    placeholder: "请选择",
    type: "select",
    basicType: "customsClearanceType",
  },
  // {
  //   id: "xx_search_17",
  //   label: "SONO号：",
  //   placeholder: "SONO号",
  //   type: "text",
  // },
  // {
  //   id: "xx_search_18",
  //   label: "箱号：",
  //   placeholder: "箱号",
  //   type: "text",
  // },
  // {
  //   id: "xx_search_19",
  //   label: "MBL号：",
  //   placeholder: "MBL号",
  //   type: "text",
  // },
  // {
  //   id: "xx_search_20",
  //   label: "拼柜登记号：",
  //   placeholder: "拼柜登记号",
  //   type: "text",
  // },
  SEARCH_COL_9,
  SEARCH_COL_10, // 快速下单
  SEARCH_COL_11,
  // SEARCH_COL[13], //发货人从传统订单MODEL.JS文件中引用
  // SEARCH_COL[14], //收货人
];

const FORM_COL_1 = {
  label: "起运港",
  prop: "startPortName",
  minWidth: 120,
  showOverflowTooltip: true,
};

const FORM_COL_2 = {
  label: "目的港",
  prop: "endPortName",
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_9 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 120,
  showOverflowTooltip: true,
};

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    label: "工作单号",
    prop: "number",
    customRow: true,
    sortable: true,
    minWidth: 136,
    fixed: "left",
    showOverflowTooltip: true,
  },
  {
    label: "委托人",
    prop: "customerShortName",
    minWidth: 120,
    fixed: "left",
    showOverflowTooltip: true,
  },
  {
    label: "目的国",
    prop: "country",
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    label: "头程运输方式",
    prop: "headTransportModeName",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    label: "尾程运输方式",
    prop: "outWarehouseWayName",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    label: "交货仓",
    prop: "transactionWarehouseCode",
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    label: "目的仓",
    prop: "receivingAddress",
    showOverflowTooltip: true,
    minWidth: 200,
    render: (row) => {
      return `${row.totalAddressCount || "--"}个：${
        (row.consigneeCodes && row.consigneeCodes.join("、")) || "--"
      }`;
    },
  },
  {
    prop: "productAttributeList",
    label: "产品属性",
    minWidth: 110,
    showOverflowTooltip: true,
    basicType: "orderProductAttribute",
  },
  {
    label: "快速下单",
    prop: "quickOrder",
    showOverflowTooltip: true,
    minWidth: 110,
    basicType: "quickOrderType",
    fontColor: true,
  },
  {
    label: "报关方式",
    prop: "reportCustomsWay",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
    basicType: "customsDeclarationType",
    basicTypeVal: "reportCustomsWay",
  },
  {
    label: "国内登记号",
    prop: "wholeCabinetSn",
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    label: "装箱方式",
    prop: "encasementWay",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
    basicType: "freightType",
    basicTypeVal: "encasementWay",
  },
  FORM_COL_1,
  FORM_COL_2,
  // TABLE_COL_9,
  {
    label: "上门提货",
    prop: "pickUpHome",
    sortable: true,
    minWidth: 100,
    showOverflowTooltip: true,
    render: (row) => {
      return row.pickUpHome ? "是" : "否";
    },
  },
  {
    label: "件数",
    prop: "boxCount",
    sortable: true,
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    label: "毛重",
    prop: "totalWeight",
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    decimal: 2,
    minWidth: 120,
  },
  {
    label: "立方",
    prop: "totalVolume",
    showOverflowTooltip: true,
    align: "right",
    decimal: 2,
    minWidth: 120,
  },
  // {
  //   label: "产品信息",
  //   prop: "inlandExportParam",
  //   customRow: true,
  //   sortable: true,
  //   minWidth: 100,
  //   showOverflowTooltip: true,
  //   basicType: "productSituation",
  // },
  {
    label: "客户单号",
    prop: "cusOrderNumber",
    showOverflowTooltip: true,
  },
  // {
  //   label: "发货人",
  //   prop: "consignerCompany",
  //   showOverflowTooltip: true,
  //   minWidth: 150,
  // },
  // {
  //   label: "收货人",
  //   prop: "consigneeCompany",
  //   minWidth: 150,
  //   showOverflowTooltip: true,
  // },
  {
    label: "业务员",
    prop: "salesmanName",
    showOverflowTooltip: true,
  },
  {
    label: "创建时间",
    sortable: true,
    prop: "createTime",
    minWidth: 136,
    showOverflowTooltip: true,
  },
  // {
  //   label: "打回/作废",
  //   prop: "auditCount",
  //   minWidth: 100,
  //   align: "right",
  // },
  {
    label: "状态",
    prop: "status",
    dotColor: true,
    basicType: "orderStatus",
    minWidth: 100,
    fixed: "right",
    showOverflowTooltip: true,
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true,
    minWidth: 160,
  },
];

export { tableColumns };
