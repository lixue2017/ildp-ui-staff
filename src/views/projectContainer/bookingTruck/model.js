import { httpCustomerSelect, httpUserSelect } from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";

const SEARCH_COL_1 = {
  id: "beginTime",
  label: "预计入仓时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "orderNumber",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};
const SEARCH_COL_3 = {
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "headTransportMode",
};
const SEARCH_COL_4 = {
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "outWarehouseWay",
};
const SEARCH_COL_5 = {
  id: "salesmanId",
  label: "业务员：",
  ...httpUserSelect(),
};
const SEARCH_COL_6 = {
  id: "transactionWarehouseId",
  label: "交货仓：",
  ...httpWarehousePublicSelect({ typeList: "2,3", flagAvailable: "y" }),
};

const SEARCH_COL_7 = {
  id: "destinationWarehouseId",
  label: "目的仓：",
  ...httpWarehousePublicSelect({ typeList: "0,1,2,3,4" }),
};
const SEARCH_COL_8 = {
  id: "customerId",
  label: "委托人：",
  ...httpCustomerSelect(),
};

const SEARCH_COL_203 = {
  id: "phone",
  label: "司机手机号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_204 = {
  id: "name",
  label: "司机姓名：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_205 = {
  id: "state",
  label: "状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "orderReservationCarState",
};
const SEARCH_COL_206 = {
  ...SEARCH_COL_6,
  id: "warehouseId",
};
export const searchColumns = (tName) => {
  const SEARCH_COLS_1 = [
    SEARCH_COL_1,
    SEARCH_COL_2,
    SEARCH_COL_6,
    SEARCH_COL_3,
    SEARCH_COL_4,
    SEARCH_COL_5,
    SEARCH_COL_7,
    SEARCH_COL_8,
  ];
  const SEARCH_COLS_2 = [
    {
      ...SEARCH_COL_1,
      label: "预约入仓时间：",
    },
    SEARCH_COL_2,
    SEARCH_COL_203,
    SEARCH_COL_204,
    SEARCH_COL_205,
    SEARCH_COL_206,
  ];
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_COLS_1, SEARCH_COLS_2][tName - 1],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  // fixed: 'left'
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_1 = {
  prop: "orderNumber",
  label: "工作单号",
  // columnLink: true,
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "customerName",
  label: "委托人",
  minWidth: 118,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "headTransportModeName",
  label: "头程运输方式",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "outWarehouseWayName",
  label: "尾程运输方式",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "countryName",
  label: "目的国",
  sortable: true,
  width: 110,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "transactionWarehouseName",
  label: "交货仓",
  sortable: true,
  minWidth: 110,
  showOverflowTooltip: true,
  render: (r) =>
    `${r.transactionWarehouseCode || "--"}/${
      r.transactionWarehouseName || "--"
    }`,
};
const TABLE_COL_7 = {
  prop: "destinationWarehouseCode",
  label: "目的仓",
  sortable: true,
  width: 112,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "warehousingTime",
  label: "预计入仓时间",
  sortable: true,
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "totalQuantity",
  labelTop: "(预计)",
  labelBottom: "总箱/件数",
  headerTopBottom: true,
  sortable: true,
  width: 100,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const TABLE_COL_10 = {
  prop: "totalWeight",
  labelTop: "(预计)",
  labelBottom: "总重量(KG)",
  headerTopBottom: true,
  sortable: true,
  width: 110,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_COL_11 = {
  prop: "totalVolume",
  labelTop: "(预计)",
  labelBottom: "立方(CBM)",
  headerTopBottom: true,
  sortable: true,
  width: 110,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_COL_12 = {
  prop: "remark",
  label: "订单备注",
  sortable: true,
  minWidth: 112,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: true,
  minWidth: 112,
  showOverflowTooltip: true,
};

const TABLE_COL_202 = {
  prop: "warehouseName",
  label: "交货仓",
  sortable: true,
  minWidth: 110,
  showOverflowTooltip: true,
  render: (r) => `${r.warehouseCode || "--"}/${r.warehouseName || "--"}`,
};
const TABLE_COL_203 = {
  prop: "entryDate",
  label: "预约入仓时间",
  sortable: true,
  width: 172,
  showOverflowTooltip: true,
  render: (r) => `${r.entryDate || "--"} ${r.entryTimePeriod || ""}`,
};
const TABLE_COL_209 = {
  prop: "totalQuantity",
  label: "总箱/件数",
  sortable: true,
  width: 100,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const TABLE_COL_210 = {
  prop: "totalWeight",
  label: "总重量(KG)",
  sortable: true,
  width: 110,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_COL_211 = {
  prop: "totalVolume",
  label: "总立方(CBM)",
  sortable: true,
  width: 124,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_COL_212 = {
  prop: "classify",
  label: "约车方",
  sortable: true,
  width: 110,
  showOverflowTooltip: true,
  basicType: "orderReserveCarClassify",
};
const TABLE_COL_214 = {
  prop: "state",
  label: "约车状态",
  sortable: true,
  width: 95,
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "orderReservationCarState",
};
const TABLE_COL_215 = {
  prop: "phone",
  label: "司机手机号",
  sortable: true,
  width: 110,
  showOverflowTooltip: true,
};
const TABLE_COL_216 = {
  prop: "name",
  label: "司机姓名",
  sortable: true,
  width: 95,
  showOverflowTooltip: true,
};
const TABLE_COL_217 = {
  prop: "createTime",
  label: "约车时间",
  sortable: true,
  width: 128,
  showOverflowTooltip: true,
};

const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: 86,
};

export const tableColumns = (tName = "1") => {
  const TABLE_COLS_1 = [
    TABLE_COL_0,
    TABLE_COL_SELECTION,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
  ];
  const TABLE_COLS_2 = [
    {
      ...TABLE_COL_0,
      fixed: "left",
    },
    {
      ...TABLE_COL_1,
      fixed: "left",
    },
    TABLE_COL_202,
    TABLE_COL_203,
    TABLE_COL_209,
    TABLE_COL_210,
    TABLE_COL_211,
    TABLE_COL_212,
    TABLE_COL_214,
    TABLE_COL_217,
    TABLE_COL_215,
    TABLE_COL_216,
    TABLE_COL_99,
  ];
  return [TABLE_COLS_1, TABLE_COLS_2][tName - 1];
};
