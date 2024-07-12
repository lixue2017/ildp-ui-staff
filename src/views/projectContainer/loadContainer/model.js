import * as comModel from "../components/comModel";
import {
  httpRouteSelect,
  httpGETConfigMianOrderList,
} from "@/comModel/httpSelect.js";
import { toFixedNum } from "@/utils/instructions";

const searchColumns = [
  {
    id: "dataStatusArr",
    label: "状态：",
    type: "select", // 选择框
    multiple: true,
    placeholder: "状态（多选）",
    basicType: "clearanceTrailerStatus",
    hideList: [0, 2],
  },
  {
    id: "code",
    label: "编号：",
    placeholder: "系统批次号、SO No.、整柜登记号",
    type: "text",
  },
  {
    // id: "orderNo",
    id: "multipleOrderNo",
    label: "关联操作单：",
    placeholder: "关联操作单",
    type: "text",
    labelWidth: "100px",
  },
  {
    id: "routeCode",
    label: "航线：",
    placeholder: "航线",
    ...httpRouteSelect(),
  },
  {
    ...comModel.estimateTime,
    label: "创建时间：",
  },
  {
    ...comModel.cabinetTypeCol, // 需要引用，防止影响编辑页的数据
  },
  {
    ...comModel.startWarehouse,
  },
  {
    ...comModel.destinationWarehouse,
  },
];

const cols_obj = {
  0: {
    prop: "code",
    label: "系统批次号",
  },
  1: {
    prop: "registerNo",
    label: "整柜登记号",
  },
  2: {
    prop: "soNo",
    label: "SO No.",
  },
  3: {
    prop: "boxModel",
    label: "柜型",
  },
  4: {
    prop: "singleBoxWeight",
    label: "重量(KG)",
    align: "right",
    render: (rows) => toFixedNum(rows.singleBoxWeight),
  },
  5: {
    prop: "cbm",
    label: "立方(CBM)",
    align: "right",
    render: (rows) => toFixedNum(rows.cbm),
  },
  6: {
    prop: "startWarehouse",
    label: "起始港",
  },
  7: {
    prop: "endWarehouse",
    label: "目的港",
  },
  8: {
    prop: "num",
    label: "件数",
  },
};

const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 160,
  columnOperation: true,
  fixed: "right",
};

const TABLE_COLS_29 = {
  prop: "headTransportModeName",
  label: "头程运输方式",
  minWidth: 130,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_30 = {
  prop: "outWarehouseWayName",
  label: "尾程运输方式",
  minWidth: 130,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_31 = {
  prop: "bookingSpaceProxyName",
  label: "订舱代理",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    ...cols_obj[0],
    customRow: true,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[1],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[2],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[3],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[8],
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[4],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[5],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[6],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    ...cols_obj[7],
    minWidth: 120,
    showOverflowTooltip: true,
  },
  TABLE_COLS_31,
  {
    prop: "joinOrder",
    label: "关联操作单",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  //  {
  //   prop: "joinRouteName",
  //   label: "关联航线",
  //   minWidth: 120,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "joinTrailer",
  //   label: "关联拖车",
  //   minWidth: 120,
  //   showOverflowTooltip: true
  // },
  {
    prop: "createTime",
    label: "创建时间",
    minWidth: 150,
    showOverflowTooltip: true,
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    prop: "dataStatus",
    label: "状态",
    minWidth: 120,
    customRow: true,
    showOverflowTooltip: true,
    basicType: "clearanceTrailerStatus",
  },
  {
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true,
    fixed: "right",
    width: "120px",
  },
];

const FORM_COL_1 = {
  span: 12,
  id: "configMianOrderId",
  label: "订舱路线：",
  placeholder: "此处选择订舱路线",
  isBackAll: true,
  isAutoInitRequest: true,
  defaultKey: "id",
};
const FORM_COL_2 = {
  span: 12,
  id: "bookingSpaceProxyName",
  label: "订舱代理：",
  type: "txt",
};

export const editFormColumns = (row) => {
  const {
    changeBookingRoute,
    isintBookingRoute,
    bookingSpaceProxy,
    warehouseId,
    id,
  } = row;
  const key=id?'bookingSpaceProxy':'operationMain'
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "registerNo",
                  label: "整柜参考号：",
                  placeholder: "此处填写整柜参考号",
                  type: "text",
                },
                {
                  ...comModel.cabinetTypeCol,
                  span: 12,
                },
                // {
                //   ...comModel.startWarehouse,
                //   span: 12,
                // },
                // {
                //   ...comModel.destinationWarehouse,
                //   span: 12,
                // }
                {
                  ...FORM_COL_1,
                  ...httpGETConfigMianOrderList({
                    [key]: bookingSpaceProxy,
                    warehouseId,
                  }),
                  handle: changeBookingRoute,
                  getSearchOptions: isintBookingRoute,
                  type: "slot",
                },
                FORM_COL_2,
              ],
            },
          ],
        },
      ],
    },
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "remark",
                  label: "备注信息：",
                  placeholder: "此处填写备注信息",
                  type: "textarea",
                  rows: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_28 = [
  {
    ...comModel.comTableCols[8],
    minWidth: 130,
    label: "客户下单资料",
    prop: "meansNum",
  },
  {
    ...comModel.comTableCols[8],
    minWidth: 130,
    label: "客户报关资料",
    prop: "declareNum",
  },
  {
    ...comModel.comTableCols[8],
    label: "产品信息",
  },
];

const editFormRules = {
  registerNo: [{ required: true, message: "整柜参考号不能为空" }],
  startWarehouse: [{ required: true, message: "请选择起始仓" }],
  boxModel: [{ required: true, message: "请选择柜型" }],
  endWarehouse: [{ required: true, message: "请选择目的仓" }],
  configMianOrderId: [{ required: true, message: "请选择订舱路线" }],
};

export const editTableColumns = (type) => {
  return [
    {
      type: "index",
      width: 50,
      align: "center",
      fixed: "left",
    },
    comModel.comTableCols[0],
    comModel.comTableCols[2],
    TABLE_COLS_29,
    TABLE_COLS_30,
    comModel.comTableCols[4],
    ...TABLE_COL_28,
    comModel.comTableCols[7],
    comModel.comTableCols[5],
    comModel.comTableCols[6],
    {
      ...comModel.comTableCols[type === 2 ? 11 : 10],
    },
    {
      ...comModel.comTableCols[12],
      label: "总箱数/件数",
    },
    {
      ...comModel.comTableCols[13],
      label: "总重量(KG)",
    },
    {
      ...comModel.comTableCols[14],
      label: "方数(CBM)",
    },
    comModel.comTableCols[15],
    comModel.comTableCols[16],
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: "right",
      width: 80,
    },
  ];
};

const editSearchFormCols = [
  {
    span: 24,
    id: "multipleOrderNo",
    label: "工作单号：",
    placeholder: "请输入（空格隔开查询多个）",
    type: "text",
    maxlength: 1000,
  },
  // {
  //   ...comModel.startWarehouses,
  //   label: "起始仓：",
  //   span: 6,
  // },
  {
    ...comModel.searchEndWarehouses,
    span: 6,
  },
  {
    ...comModel.materialInfo,
    span: 6,
  },
  {
    ...comModel.warehousingStatus,
    span: 6,
  },
  {
    ...comModel.shortNameCol,
    span: 6,
  },
  {
    ...comModel.estimateTime,
    span: 6,
    labelWidth: "105px",
  },
  {
    ...comModel.actualTime,
    span: 6,
    labelWidth: "105px",
  },
  {
    ...comModel.salesmanCol,
    span: 6,
  },
];

const editDrawerTableCols = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    type: "selection",
    align: "center",
    width: 50,
  },
  {
    label: "工作单号",
    // labelBtm: "渠道",
    prop: "operationNo",
    customRow: true,
    // customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    labelTop: "客户简称",
    labelBtm: "业务员",
    prop: "customer",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    labelTop: "起始仓",
    labelBtm: "报关方式",
    prop: "start",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true,
    basicTypeVal: "customsDeclarationType",
    basicType: "customsDeclarationType",
  },
  {
    labelTop: "目的仓",
    labelBtm: "目的国",
    prop: "objective",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    labelTop: "入仓状态",
    labelBtm: "产品信息",
    prop: "inWarehouseStatus",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    basicType: "inOutWarehouseStatus",
    showOverflowTooltip: true,
  },
  {
    labelTop: "预计入仓时间",
    labelBtm: "实际入仓时间",
    prop: "warehousingDate",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    label: "(预计)总箱数/件数",
    prop: "expectSumBoxNum",
    customRow: true,
    minWidth: 120,
    showOverflowTooltip: true,
    align: "center",
    decimal: 0,
  },
  {
    label: "(预计)总重量(KG)",
    prop: "expectSumWeight",
    // customRow: true,
    align: "right",
    decimal: 2,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    label: "(预计)方数(CBM)",
    prop: "expectCbm",
    // customRow: true,
    align: "right",
    decimal: 2,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  // {
  //   labelLeft: "(预计)总箱数/件数",
  //   labelRightMiddle: "(预计)总重量(KG)",
  //   labelRight: "(预计)方数(CBM)",
  //   prop: "estimate",
  //   customRow: true,
  //   customHeader: true,
  //   minWidth: 400,
  //   showOverflowTooltip: true
  // },
];

export const grossTotal = [
  {
    label: "数据行：",
    decimal: 0,
    prop: "totalRows",
  },
  {
    label: "总箱数/件数：",
    decimal: 0,
    prop: "singleBoxSum",
  },
  {
    label: "总重量(KG)：",
    decimal: 2,
    prop: "singleBoxWeight",
  },
  {
    label: "总方数(CBM)：",
    decimal: 2,
    prop: "cbm",
  },
];
const TABLE_COL_616 = {
  label: "排柜备注",
  prop: "rowCabinetRemark",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_617 = {
  label: "产品属性",
  prop: "productAttribute",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
  render: (row) => ["普货", "敏感货"][row.productAttribute] || "--",
};
const TABLE_COL_618 = {
  label: "装柜顺序",
  prop: "rowCabinetSort",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const tableDetailCols = [
  //排柜详情操作单信息
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    ...comModel.comTableCols[0],
    columnLink: true,
  },
  comModel.comTableCols[2],
  TABLE_COLS_29,
  TABLE_COLS_30,
  comModel.comTableCols[5],
  comModel.comTableCols[6],
  ...TABLE_COL_28,
  TABLE_COL_617,
  TABLE_COL_618,
  comModel.comTableCols[7],
  comModel.comTableCols[9],
  comModel.comTableCols[12],
  comModel.comTableCols[13],
  comModel.comTableCols[14],
  comModel.comTableCols[16],
  TABLE_COL_616,
  {
    ...TABLE_COL_616,
    label: "业务备注",
    prop: "remark",
  },
  TABLE_COL_OPERATION,
];

/** 待排柜列表、编辑页合计 */
const subtotalList = [
  {
    label: "数据行：",
    key: "total_rows",
    decimal: 0,
  },
  {
    label: "总箱数/件数：",
    key: "expectSumBoxNum",
    decimal: 0,
  },
  {
    label: "总重量(KG)：",
    key: "expectSumWeight",
    decimal: 2,
  },
  {
    label: "总方数(CBM)：",
    key: "expectCbm",
    decimal: 2,
  },
];

export {
  searchColumns,
  tableColumns,
  editFormRules,
  editSearchFormCols,
  editDrawerTableCols,
  tableDetailCols,
  subtotalList,
};

export const voyageNumber = {
  size: "small",
  labelWidth: "130px",
  cols: [
    {
      id: "routeCode",
      nameTxt: "routeName",
      label: "航线信息：",
      customRow: true,
      placeholder: "--",
    },
    {
      id: "routeGroupCode",
      nameTxt: "routeGroupName",
      label: "航线组：",
      placeholder: "--",
    },
    {
      id: "shipCompany",
      label: "船公司：",
      placeholder: "--",
      className: "divider",
    },
    {
      id: "countyCode",
      nameTxt: "countyName",
      label: "目的国：",
      placeholder: "--",
    },
    {
      id: "startPort",
      label: "起运港：",
      placeholder: "--",
    },
    {
      id: "endPort",
      label: "目的港：",
      placeholder: "--",
    },
    {
      id: "cabinProxy",
      label: "订舱代理：",
      placeholder: "--",
      className: "divider",
    },
    {
      id: "flightName",
      label: "船名：",
      placeholder: "--",
    },
    {
      id: "name",
      label: "船次：",
      placeholder: "--",
    },
    {
      id: "sailOpenTime",
      label: "开航期：",
      placeholder: "--",
    },
    {
      id: "cabinOpenTime",
      label: "开仓日期：",
      placeholder: "--",
    },
    {
      id: "cutGateTime",
      label: "截关日期：",
      placeholder: "--",
      className: "divider",
    },
    // {
    //   id: "name_x12",
    //   label: "拖车信息",
    //   className: 'trailer',
    //   customRow: true,
    // },
    // {
    //   id: "tcode",
    //   label: "拖车编号：",
    //   placeholder: "--",
    // }, {
    //   id: "shortName",
    //   label: "拖车公司：",
    //   placeholder: "--",
    // }, {
    //   id: "consigneeType",
    //   label: "目的地类型：",
    //   placeholder: "--",
    // }, {
    //   id: "consigneeName",
    //   label: "目的港：",
    //   placeholder: "--",
    // },
  ],
};

const cols_batch = {
  id: cols_obj[0].prop,
  span: 6,
  label: "系统批次号：",
  placeholder: "--",
  type: "txt",
};

const cols_cabinet_type = {
  id: "boxModelName",
  span: 6,
  label: "柜型：",
  placeholder: "--",
  type: "txt",
};

const cols_so_no = {
  id: cols_obj[2].prop,
  span: 6,
  label: "SO No.：",
  placeholder: "--",
  type: "txt",
};

const cols_reference_mun = {
  id: cols_obj[1].prop,
  span: 6,
  label: "整柜参考号：",
  placeholder: "--",
  type: "txt",
};

const cols_remark = {
  span: 18,
  id: "remark",
  label: "备注：",
  placeholder: "--",
  type: "txt",
};

export const detailFromDigModel = {
  size: "small",
  labelWidth: "130px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...cols_batch,
                  span: 8,
                }, //系统批次号
                {
                  ...cols_cabinet_type,
                  span: 8,
                }, //柜型
                {
                  id: "startWarehouseName",
                  span: 8,
                  label: "起始港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  ...cols_reference_mun,
                  span: 8,
                },
                {
                  ...cols_so_no,
                  span: 8,
                },
                {
                  id: "endWarehouseName",
                  span: 8,
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                },
                // {
                //   id: cols_obj[4].prop,
                //   span: 8,
                //   label: "总重量：",
                //   placeholder: "--",
                //   type: "txt",
                //   render: rows => toFixedNum(rows[cols_obj[4].prop])
                // },
                // {
                //   id: cols_obj[5].prop,
                //   span: 8,
                //   label: "总体积：",
                //   placeholder: "--",
                //   type: "txt",
                //   render: rows => toFixedNum(rows[cols_obj[5].prop])
                // },
                cols_remark,
              ],
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {},
};

export const deliveryPlanFromModel = {
  size: "small",
  labelWidth: "100px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...cols_batch,
                  span: 8,
                },
                {
                  ...cols_cabinet_type,
                  span: 8,
                },
                {
                  id: "startWarehouseName",
                  span: 8,
                  label: "起始港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  ...cols_reference_mun,
                  span: 8,
                },
                {
                  ...cols_so_no,
                  span: 8,
                },
                {
                  id: "endWarehouseName",
                  span: 8,
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                },
                cols_remark,
              ],
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {},
};

export const settlementTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    prop: "number",
    label: "工作单号",
    width: 150,
    showOverflowTooltip: true,
  },
  {
    prop: "feeName",
    label: "费用名称",
    width: 150,
    showOverflowTooltip: true,
  },
  {
    label: "类型",
    prop: "billType",
    showOverflowTooltip: true,
    minWidth: 100,
    basicType: "billType",
    customRow: true,
  },
  {
    prop: "address",
    label: "往来单位",
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "currency",
    label: "币种",
    showOverflowTooltip: true,
  },
  {
    prop: "zhje",
    label: "折合金额",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "billStatus",
    label: "状态",
    showOverflowTooltip: true,
    basicType: "billStatus",
    customRow: true,
  },
  {
    prop: "lockSheet",
    label: "锁单",
    showOverflowTooltip: true,
    customRow: true,
  },
  {
    prop: "busior",
    label: "创建人",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
  },
  {
    prop: "lastTime",
    label: "创建时间",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 150,
  },
  {
    prop: "operation",
    label: "操作",
    showOverflowTooltip: true,
    width: 100,
    customRow: true,
    fixed: "right",
  },
];

// 排柜列表备注
export const cabinetRemarkCols = {
  title: "编辑备注",
  width: "470px",
  labelWidth: "72px",
  simpleCustomCols: [
    {
      span: 24,
      id: "rowCabinetRemark",
      label: "备注：",
      placeholder: "请输入",
      type: "textarea",
    },
    {
      span: 24,
      id: "rowCabinetSort",
      label: "装柜顺序：",
      placeholder: "请输入",
      type: "inputNumber",
    },
  ],
  formRules: {},
};
