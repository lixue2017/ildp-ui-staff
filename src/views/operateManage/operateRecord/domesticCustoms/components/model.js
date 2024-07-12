import {
  httpCountryListSelect,
  httpCustomerSelect,
  httpRoleDeptUserSelect,
  httpEnterprisetSelect,
  shipCompanyList,
  httpPortPublicSelect,
} from "@/comModel/httpSelect";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "sortBoxRegisterNo",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "orderSn",
  label: "工作单号：",
  placeholder: "请输入工作单号、子单号",
  type: "text",
  residueCol: 2,
};
const SEARCH_COL_4 = {
  id: "orderOperatorId",
  label: "操作员：",
  ...httpRoleDeptUserSelect(),
};
const SEARCH_COL_5 = {
  id: "consignerId",
  label: "委托人：",
  ...httpCustomerSelect(),
};
const SEARCH_COL_6 = {
  id: "countryId",
  label: "目的国：",
  ...httpCountryListSelect(),
};
const SEARCH_COL_7 = {
  id: "boxNo",
  label: "箱号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_8 = {
  id: "xx_s_8",
  label: "状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "clearanceReview",
  hideList: [2],
};
const SEARCH_COL_9 = {
  id: "overseaAgentId",
  label: "海外代理：",
  ...httpEnterprisetSelect({ typeList: "0,1,2,3" }),
};
const SEARCH_COL_10 = {
  id: "shipCompanyId",
  label: "航空/船公司：",
  ...shipCompanyList(),
};
const SEARCH_COL_11 = {
  id: "flightName",
  label: "船名/航名：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_12 = {
  id: "exportType",
  label: "类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "importExportType",
};
const SEARCH_COL_13 = {
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_14 = {
  id: "startPortId",
  label: "起运港：",
  ...httpPortPublicSelect(),
};
const SEARCH_COL_15 = {
  id: "endPortId",
  label: "目的港：",
  ...httpPortPublicSelect(),
};
const SEARCH_COL_16 = {
  id: "expectWarehouseType",
  label: "预报入库仓：",
  basicType: "clearanceReservationWarehouse",
  type: "select",
};
const SEARCH_COL_17 = {
  id: "tradeClauseSearch",
  label: "贸易条款：",
  placeholder: "请选择",
  type: "select",
  basicType: "tradeClause",
};
const SEARCH_COL_18 = {
  id: "salesman",
  label: "业务员：",
  ...httpRoleDeptUserSelect(),
};
const SEARCH_COL_19 = {
  id: "productAttributeList",
  label: "产品属性：",
  placeholder: "请选择",
  type: "select",
  multiple: true,
  basicType: "orderProductAttribute",
};

export const ecFirstSearchCols = (vPage) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_1,
                SEARCH_COL_2,
                SEARCH_COL_3,
                SEARCH_COL_4,
                SEARCH_COL_5,
                SEARCH_COL_6,
                SEARCH_COL_7, // 箱号
                ...(["c_s601"].includes(vPage) ? [SEARCH_COL_17] : []),
                // SEARCH_COL_8,
                SEARCH_COL_9,
                SEARCH_COL_10,
                SEARCH_COL_11,
                SEARCH_COL_12,
                SEARCH_COL_13,
                SEARCH_COL_14,
                SEARCH_COL_15,
                SEARCH_COL_16,
                ...(["c_s601"].includes(vPage) ? [] : [SEARCH_COL_19]),
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "orderSn",
  label: "工作单号",
  minWidth: 120,
  sortable: true,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "sortBoxRegisterNo",
  label: "国内登记号",
  minWidth: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "consigner",
  label: "委托人",
  minWidth: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "operationOrderType",
  label: "类型",
  minWidth: 76,
  sortable: true,
  showOverflowTooltip: true,
  render: (r) => {
    return `${["海运", "空运"][r.operationOrderType] || "--"}${
      ["出口", "进口"][r.orderBusinessType] || ""
    }`;
  },
};
const TABLE_COL_5 = {
  prop: "sonOrderSn",
  label: "子单号",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COL_6 = {
  prop: "packingListInfo",
  label: "箱单信息",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COL_7 = {
  prop: "boxNo",
  label: "箱号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "startPortNameEn",
  label: "起运港",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "endPortNameEn",
  label: "目的港",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "shipCompanyShortName",
  label: "航空/船公司",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "flightName",
  label: "船名/航名",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "voyageNumber",
  label: "船次/航次",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "etdTime",
  label: "ETD",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "etaTime",
  label: "ETA",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "destinationCountryTwoCode",
  label: "目的国",
  minWidth: 90,
  sortable: true,
  showOverflowTooltip: true,
  render: (r) =>
    `${r.destinationCountryTwoCode || "--"}/${
      r.destinationCountryNameCn || "--"
    }`,
};
const TABLE_COL_16 = {
  prop: "orderOperatorUserName",
  label: "操作员",
  minWidth: 92,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "createTime",
  label: "创建时间",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  prop: "updateTime",
  label: "最后修改时间",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COL_19 = {
  prop: "overseaAgentShortName",
  label: "海外代理",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COL_20 = {
  prop: "customsClearanceStatus",
  label: "状态",
  minWidth: 78,
  sortable: true,
  showOverflowTooltip: true,
  // fixed: "right",
  dotColor: true,
  basicType: "clearanceReview",
};
const TABLE_COL_21 = {
  prop: "expectWarehouseType",
  label: "预报入库仓",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  basicType: "clearanceReservationWarehouse",
};

const TABLE_COL_22 = {
  prop: "registerStatus",
  label: "清关登记状态",
  minWidth: 120,
  sortable: true,
  dotColor: true,
  showOverflowTooltip: true,
  fixed: "right",
  basicType: "registerStatusLists",
};

const TABLE_COL_23 = {
  prop: "productAttributeList",
  label: "产品属性",
  minWidth: 110,
  showOverflowTooltip: true,
  basicType: "orderProductAttribute",
};
const TABLE_COL_24 = {
  prop: "mblNum",
  label: "MBL",
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_COL_25 = {
  prop: "qgStatus",
  label: "清关状态",
  // fixed: "right",
  minWidth: 98,
  sortable: true,
  dotColor: true,
  basicType: "clearanceStatus",
};
const TABLE_COL_207 = {
  prop: "nlCode",
  label: "海外清关单号",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COL_208 = {
  prop: "overseasOperatorUserName",
  label: "海外操作",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COL_209 = {
  prop: "csOperatorUserName",
  label: "湖南操作",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COL_210 = {
  prop: "remarkCount",
  label: "审核/备注",
  minWidth: 100,
  sortable: true,
  customRow: true,
  align: "right",
  showOverflowTooltip: true,
};

const TABLE_COL_603 = {
  prop: "tradeClause",
  label: "贸易条款",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "tradeClause",
};

const TABLE_COL_99 = {
  prop: "operation",
  label: "操作",
  minWidth: 140,
  columnOperation: true,
  columnMoreOperation: true,
  moreBtnLen: 2,
  fixed: "right",
};

export const ecFirstTableCols = (vPage) => {
  let TABLE_COLS_1 = [
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    ...(["c_t601", "c_t602"].includes(vPage) ? [TABLE_COL_603] : []),
    TABLE_COL_4,
    ...(["c_t601", "c_t602"].includes(vPage) ? [] : [TABLE_COL_5]),
  ];
  if (["e_1", "e_2", "e_3", "e_201", "e_202", "e_203"].includes(vPage)) {
    // 电商箱单信息
    TABLE_COLS_1.push(TABLE_COL_23, TABLE_COL_24, {
      ...TABLE_COL_6,
      render: (r) => {
        if (["e_201", "e_202", "e_203"].includes(vPage)) {
          // 二审
          return `${r.isEditCheckGoodsCount || 0}/${
            r.totalCheckGoodsCount || 0
          }`;
        }
        return `${r.isEditYbCheckGoodsCount || 0}/${
          r.totalCheckGoodsCount || 0
        }`; // 一审
      },
    });
  }
  TABLE_COLS_1 = [
    ...TABLE_COLS_1,
    TABLE_COL_7,
    ...(["e_2", "e_201", "e_202", "e_203", "c_t602"].includes(vPage)
      ? [TABLE_COL_207]
      : []),
    TABLE_COL_8,
    TABLE_COL_9,
    TABLE_COL_21,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
    TABLE_COL_18,
  ];
  if (["e_2", "e_201", "e_202", "e_203"].includes(vPage)) {
    TABLE_COLS_1.push(TABLE_COL_208, TABLE_COL_209);
  }
  if (["c_t602"].includes(vPage)) {
    TABLE_COLS_1.push(TABLE_COL_208); // 海外操作
  }
  TABLE_COLS_1.push(TABLE_COL_19); // 海外代理
  if (["e_3", "e_201", "e_202", "e_203", "c_t602"].includes(vPage)) {
    TABLE_COLS_1.push(TABLE_COL_210); // 备注
  }
  return [
    ...TABLE_COLS_1,
    ...(["e_1", "e_2", "c_t601"].includes(vPage) ? [] : [TABLE_COL_25]),
    ...(["e_2", "e_202", "c_t602"].includes(vPage) ? [] : [TABLE_COL_20]),
    TABLE_COL_22,
    {
      ...TABLE_COL_99,
      minWidth: ["e_2", "e_202", "e_203", "c_t601"].includes(vPage)
        ? 100
        : ["e_201"].includes(vPage)
        ? 196
        : 162,
    },
  ];
};
