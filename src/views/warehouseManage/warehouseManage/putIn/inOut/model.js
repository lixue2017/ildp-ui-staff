import {
  httpCustomerSelect,
  httpAllDealingCompanySelect,
} from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";
import { getDictObj } from "@/utils/index";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.rk_time || "入库时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COL_2 = {
  id: "customerName",
  label: "客户名称：",
  placeholder: "客户名称",
  type: "text",
  // ...httpCustomerSelect()
};

const SEARCH_COL_3 = {
  id: "orderNum",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "searchYwdhm",
  label: "目的地址：",
  placeholder: "目的地址",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "deliveryStatus",
  label: "派送状态：",
  placeholder: "派送状态（多选）",
  multiple: true,
  type: "select",
  basicType: "truckDeliveryStatus",
};
const SEARCH_COL_6 = {
  id: "trayNumber",
  label: `${overseaLangObj.pallet_number() || "托盘号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "orderTypes",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  placeholder: "请选择（多选）",
  multiple: true,
  type: "select",
  basicType: "warehousingSource",
};

const SEARCH_COL_8 = {
  id: "shipmentId",
  label: 'Shipment Id：',
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_9 = {
  id: "warehouseName",
  label: `${overseaLangObj.mdc_warehouse() || "目的仓"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "UNCHARTED_SEARCH_10",
  label: "派车单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_11 = {
  id: "customerId",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  ...httpAllDealingCompanySelect(),
};

const SEARCH_TAB_1 = [
  SEARCH_COL_1,
  SEARCH_COL_7,
  SEARCH_COL_3,
  SEARCH_COL_6,
  // SEARCH_COL_5,
  SEARCH_COL_8,
  SEARCH_COL_9,
  // SEARCH_COL_10,
  SEARCH_COL_11,
];
export const searchColumns = (idx) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_TAB_1][idx],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "trayNum",
  label: overseaLangObj.pallet_number() || "托盘号",
  minWidth: 140,
  sortable: true,
  columnLink: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "volume",
  label: overseaLangObj.tj_m_volume || "体积/m³",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 4,
  align: "right",
};

const TABLE_COL_3 = {
  prop: "weight",
  label: overseaLangObj.zl_weight || "重量/KG",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 4,
  align: "right",
};

// const TABLE_COL_4 = {
//   prop: "inventoryTotalNum",
//   label: "SKU总数",
//   minWidth: 120,
//   showOverflowTooltip: true
// }
// const TABLE_COL_5 = {
//   prop: "state",
//   label: "派送状态",
//   customRow: true,
//   minWidth: 120,
//   showOverflowTooltip: true,
//   basicType: "truckDeliveryStatus"
// }
const TABLE_COL_6 = {
  prop: "orderNum",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_6_1 = {
  prop: "wholeCabinetSn",
  label: overseaLangObj.gn_djh || "国内登记号",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_7 = {
  prop: "receivingSource",
  label: "来源",
  width: 100,
  sortable: true,
  fontColor: true,
  showOverflowTooltip: true,
  basicType: "warehousingSource",
  fixed: "left",
};
const TABLE_COL_8 = {
  prop: "enterWarehouseTime",
  label: overseaLangObj.rk_time || "入库日期",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "packingTrackingNum",
  label: overseaLangObj.xh_container_no || "箱号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "destination",
  label: overseaLangObj.md_dz || "目的地址",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer() || "客户信息",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "localCode",
  label: "库位代码",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "warehouseCode",
  label: overseaLangObj.mdc_warehouse() || "目的仓",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "putShelfTime",
  label: "存仓时间",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "packingTrackingNum",
  label: overseaLangObj.box_number || "箱序号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  // render: (row) => {
  //   const { twarehouseStorageListSonVos } = row
  //   return twarehouseStorageListSonVos ? twarehouseStorageListSonVos[0]&&twarehouseStorageListSonVos[0].packingTrackingNum : ''

  // }
};

const TABLE_COL_16 = {
  prop: "UNCHARTED_TABLE_16",
  label: "派车单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_17 = {
  prop: "UNCHARTED_TABLE_17",
  label: "派送时间",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_18 = {
  prop: "UNCHARTED_TABLE_18",
  label: "派送状态",
  minWidth: 100,
  dotColor: true,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "right",
};
const TABLE_COL_19 = {
  prop: "num",
  label: overseaLangObj.xs_total || "箱数",
  width: 80,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const TABLE_COL_20 = {
  prop: "localCode",
  label: overseaLangObj.kw_location() || "库位",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    return `${row.partitionCode || "--"}/${row.localCode || "--"}`;
  },
};
const TABLE_COL_21 = {
  prop: "dpCodes",
  label: overseaLangObj.ps_bm || "派送编码",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
  // render: (row) => {
  // 	return (row.twarehouseStorageListSonVos || []).map(e => e.dpCodes).filter(ele => !!ele).join(", ") || "--"
  // }
};

const TABLE_COL_22 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_OPERATION = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  // customRow: true,
  columnOperation: true,
  fixed: "right",
  minWidth: 100,
};
const TABLE_TAB_1 = [
  TABLE_COL_INDEX,
  TABLE_COL_SELECTION,
  TABLE_COL_1, //托盘号
  TABLE_COL_6, //工作单号
  TABLE_COL_6_1, //国内登记号
  {
    ...TABLE_COL_7,
    prop: "orderTypeList",
    label: overseaLangObj.rk_ly || "入库来源",
    render: (cRow, cNameCn) => {
      if (cRow.orderTypes && cRow.orderTypes.length > 1) {
        return (
          getDictObj("warehousingSource", cRow.orderTypes).join(", ") || "--"
        );
      }
      return cNameCn;
    },
  }, //入库来源
  // TABLE_COL_15, //箱序号
  TABLE_COL_20,
  TABLE_COL_21,
  TABLE_COL_19, // 箱数
  TABLE_COL_2, //体积
  TABLE_COL_3, //重量
  TABLE_COL_22,
  TABLE_COL_13, //目的仓
  TABLE_COL_10, //目的地址
  TABLE_COL_8, //入库日期
  TABLE_COL_11, //客户信息
  // TABLE_COL_16,//派车单号
  // TABLE_COL_17,//派送时间
  // TABLE_COL_18,//派送状态

  TABLE_COL_OPERATION,
];
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1][tab];
};

const DETAIL_COL_0 = {
  span: 12,
  id: "customerName",
  label: "委托客户：",
  type: "txt",
  txtTagArr: [
    {
      basicType: "truckReceivingSource",
      basicTypeVal: "receivingSource",
    },
  ],
};
const DETAIL_COL_1 = {
  span: 12,
  id: "orderNum",
  label: "工作单号：",
  type: "txt",
};
const DETAIL_COL_2 = {
  span: 12,
  id: "destination",
  label: "目的地址：",
  type: "txt",
};
const DETAIL_COL_3 = {
  span: 12,
  id: "trayNum",
  label: "托盘号：",
  type: "txt",
};
const DETAIL_COL_4 = {
  span: 12,
  id: "xx_4",
  label: "派送编号：",
  type: "txt",
};
const DETAIL_COL_5 = {
  span: 12,
  id: "xx_5",
  label: "出发时间：",
  type: "txt",
};
export const detailFromCols = () => {
  const DETAIL_COL_FROM = [
    DETAIL_COL_0,
    DETAIL_COL_1,
    DETAIL_COL_2,
    DETAIL_COL_3,
    DETAIL_COL_4,
    DETAIL_COL_5,
  ];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: DETAIL_COL_FROM,
            },
          ],
        },
      ],
    },
  ];
};

const DETAIL_TABLE_TAB_1 = [
  TABLE_COL_INDEX,
  TABLE_COL_7,
  TABLE_COL_6,
  TABLE_COL_9,
  TABLE_COL_2,
  TABLE_COL_10,
];
export const detailTableColumns = () => DETAIL_TABLE_TAB_1;

export const tableTotalArr = [
  {
    label: "业务数：",
    key: "orderNum",
    value: 0,
  },
  {
    label: "箱数：",
    key: "total_xs",
    value: 0,
  },
  {
    label: "体积/m³：",
    key: "volume",
    value: 0,
  },
];
