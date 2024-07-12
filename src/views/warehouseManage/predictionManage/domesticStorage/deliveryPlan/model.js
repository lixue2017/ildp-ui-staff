import * as comModel from '@/views/projectContainer/components/comModel'
import { httpRouteSelect } from '@/comModel/httpSelect.js'
import { toFixedNum } from '@/utils/instructions'

const searchColumns = [
  {
    id: "statusList",
    label: "状态：",
    type: "select", // 选择框
    multiple: true,
    placeholder: "状态（多选）",
    basicType: "clearanceTrailerStatus",
  },
  {
    id: "searchNum",
    label: "编号：",
    placeholder: "系统批次号、SO No.、整柜登记号",
    type: "text",
  },
  {
    id: "sonOperationOrderNum",
    label: "关联操作单：",
    placeholder: "关联操作单",
    type: "text",
    labelWidth: "100px",
  },
  {
    id: "routeId",
    label: "航线：",
    placeholder: "航线",
    ...httpRouteSelect()
  },
	{
    ...comModel.estimateTime,
    label: "创建时间：",
  },
  {
    ...comModel.cabinetTypeCol // 需要引用，防止影响编辑页的数据
  },
  {
    ...comModel.startWarehouse
  },
  {
    ...comModel.destinationWarehouse
  }
];



const TABLE_COLS_1={
    prop: "bookingSpaceProxyName",
    label: "订舱代理",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true
}

const cols_obj = {
  0: {
    prop: "operationOrderNum",
    label: "系统批次号",
    sortable: true,
  },
  1: {
    prop: "registerNo",
    label: "国内登记号",
    sortable: true,
  },
  2: {
    prop: "sono",
    label: "SO No.",
    sortable: true,
  },
  3: {
    prop: "boxCode",
    label: "柜型",
    sortable: true,
  },
  4: {
    prop: "singleBoxWeight",
    label: "重量(KG)",
    sortable: true,
    align: "right",
    render: rows => toFixedNum(rows.singleBoxWeight)
  },
  5: {
    prop: "cbm",
    label: "立方(CBM)",
    sortable: true,
    align: "right",
    render: rows => toFixedNum(rows.cbm)
  },
  6: {
    prop: "startWarehouse",
    label: "起始港",
    sortable: true,
  },
  7: {
    prop: "endWarehouse",
    label: "目的港",
    sortable: true,
  },
  8: {
    prop: "num",
    label: "件数",
    sortable: true,
  }
}

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    ...cols_obj[0],
    customRow: true,
    minWidth: 120,
    showOverflowTooltip: true,
    fixed: "left"
  },
  {
    ...cols_obj[1],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[2],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[3],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[8],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[4],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[5],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[6],
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[7],
    minWidth: 120,
    showOverflowTooltip: true
  },
  TABLE_COLS_1,
  {
    prop: "sonOperationOrderNum",
    label: "关联操作单",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "routeName",
    label: "关联航线",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "createTime",
    label: "创建时间",
    minWidth: 150,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "stuffingFinishTime",
    label: "装柜完成时间",
    minWidth: 150,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "dataStatus",
    label: "状态",
    minWidth: 120,
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    basicType: "clearanceTrailerStatus",
    fixed: "right"
  },
  {
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true,
    fixed: 'right',
    width: '120px'
  }
]


export const editFormColumns = () => {
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
                {
                  ...comModel.startWarehouse,
                  span: 12,
                },
                {
                  ...comModel.destinationWarehouse,
                  span: 12,
                }
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
                  rows: 3
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}

const editFormRules = {
  registerNo: [{ required: true, message: "整柜参考号不能为空" }],
  startWarehouse: [{ required: true, message: "请选择起始仓" }],
  boxModel: [{ required: true, message: "请选择柜型" }],
  endWarehouse: [{ required: true, message: "请选择目的仓" }],
}

export const editTableColumns = (type) => {
  return [
    {
      type: "index",
      width: 50,
      align: "center"
    },
    comModel.comTableCols[0],
    comModel.comTableCols[2],
    comModel.comTableCols[3],
    comModel.comTableCols[7],
    comModel.comTableCols[6],
    comModel.comTableCols[4],
    comModel.comTableCols[5],
    {
      ...comModel.comTableCols[type === 2 ? 10 : 9]
    },
    {
      ...comModel.comTableCols[11],
      label: "总箱数/件数",
    },
    {
      ...comModel.comTableCols[12],
      label: "总重量(KG)",
    },
    {
      ...comModel.comTableCols[13],
      label: "方数(CBM)",
    },
    comModel.comTableCols[14],
    comModel.comTableCols[15],
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: 80
    },
  ]
}

const editSearchFormCols = [
  {
    ...comModel.orderNoCol,
    span: 6
  },
  {
    ...comModel.startWarehouse,
    span: 6,
  },
  {
    ...comModel.searchEndWarehouse,
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
    ...comModel.estimateTime,
    span: 6,
    labelWidth: '105px'
  },
  {
    ...comModel.actualTime,
    span: 6,
    labelWidth: '105px'
  },
  {
    ...comModel.shortNameCol,
    span: 6
  },
  {
    ...comModel.salesmanCol,
    span: 6,
  },
]

const editDrawerTableCols = [
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
    showOverflowTooltip: true
  },
  {
    labelTop: "客户简称",
    labelBtm: "业务员",
    prop: "customer",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true
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
    basicType: "customsDeclarationType"
  },
  {
    labelTop: "目的仓",
    labelBtm: "目的国",
    prop: "objective",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    labelTop: "入仓状态",
    labelBtm: "资料信息",
    prop: "inWarehouseStatus",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    basicType: "inWarehouseStatus",
    showOverflowTooltip: true
  },
  {
    labelTop: "预计入仓时间",
    labelBtm: "实际入仓时间",
    prop: "warehousingDate",
    customRow: true,
    customHeader: true,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    labelLeft: "(预计)总箱数/件数",
    labelRightMiddle: "(预计)总重量(KG)",
    labelRight: "(预计)方数(CBM)",
    prop: "estimate",
    customRow: true,
    customHeader: true,
    minWidth: 280,
    showOverflowTooltip: true
  },
]

export const grossTotal = [
  {
    label: '数据行：',
    prop: 'totalRows',
  },
  {
    label: '总箱数/件数：',
    compute: true,
    factor: [
      { prop: "expectSumBoxNum" },
    ],
    prop: 'expectSumBoxNum'
  },
  {
    label: '总重量(KG)：',
    decimal: 2,
    compute: true,
    factor: [
      { prop: "expectSumWeight" },
    ],
    prop: 'expectSumWeight'
  },
  {
    label: '总方数(CBM)：',
    decimal: 2,
    compute: true,
    factor: [
      { prop: "expectCbm" },
    ],
    prop: 'expectCbm'
  },
  // {
  //   label: '总件数：',
  //   valClass: 'val-bold',
  //   prop: 'packNum'
  // },
  // {
  //   label: '总毛重：',
  //   prop: 'weight',
  //   decimal: 2,
  //   compute: true,
  //   valClass: 'val-bold',
  //   factor: [
  //     { prop: "packNum" },
  //     { prop: "weight" },
  //   ]
  // },
  // {
  //   label: '总体积：',
  //   prop: 'volume',
  //   decimal: 2,
  //   compute: true,
  //   valClass: 'val-bold',
  //   factor: [
  //     { prop: "packNum" },
  //     { prop: "volume" },
  //   ]
  // }
]
const tableDetailCols = [
  //排柜详情操作单信息
  {
    type: "index",
    width: 50,
    align: "center"
  }, {
    // customRow: true,
    ...comModel.comTableCols[0],
  },
  comModel.comTableCols[4],
  comModel.comTableCols[5],
  comModel.comTableCols[7],
  comModel.comTableCols[6],
  comModel.comTableCols[8],
  comModel.comTableCols[11],
  comModel.comTableCols[12],
  comModel.comTableCols[13],
  comModel.comTableCols[2],
  comModel.comTableCols[15],
]

const subtotalList = [{
  label: '数据行：',
  key: 'total_rows'
}, {
  label: '总箱数/件数：',
  key: 'expectSumBoxNum'
}, {
  label: '总重量(KG)：',
  key: 'expectSumWeight'
}, {
  label: '总方数(CBM)：',
  key: 'expectCbm'
}]

export {
  searchColumns, tableColumns, editFormRules,
  editSearchFormCols, editDrawerTableCols, tableDetailCols, subtotalList
}

export const voyageNumber = {
  size: "small",
  labelWidth: "130px",
  cols: [
    {
      id: "routeCode",
      nameTxt: 'routeName',
      label: "航线信息：",
      customRow: true,
      placeholder: "--",
    }, {
      id: "routeGroupCode",
      nameTxt: 'routeGroupName',
      label: "航线组：",
      placeholder: "--",
    }, {
      id: "shipCompany",
      label: "船公司：",
      placeholder: "--",
      className: 'divider'
    }, {
      id: "countyCode",
      nameTxt: 'countyName',
      label: "目的国：",
      placeholder: "--",
    }, {
      id: "startPort",
      label: "起运港：",
      placeholder: "--",
    }, {
      id: "endPort",
      label: "目的港：",
      placeholder: "--",
    }, {
      id: "cabinProxy",
      label: "订舱代理：",
      placeholder: "--",
      className: 'divider'
    }, {
      id: "flightName",
      label: "船名：",
      placeholder: "--",
    }, {
      id: "name",
      label: "船次：",
      placeholder: "--",
    }, {
      id: "sailOpenTime",
      label: "开航期：",
      placeholder: "--",
    }, {
      id: "cabinOpenTime",
      label: "开仓日期：",
      placeholder: "--",
    }, {
      id: "cutGateTime",
      label: "截关日期：",
      placeholder: "--",
      className: 'divider'
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
}

const cols_batch = {
  id: cols_obj[0].prop,
  span: 6,
  label: "系统批次号：",
  placeholder: "--",
  type: "txt",
}

const cols_cabinet_type = {
  id: "boxModelName",
  span: 6,
  label: "柜型：",
  placeholder: "--",
  type: "txt",
}

const cols_so_no = {
  id: cols_obj[2].prop,
  span: 6,
  label: "SO No.：",
  placeholder: "--",
  type: "txt",
}

const cols_reference_mun = {
  id: cols_obj[1].prop,
  span: 6,
  label: "整柜参考号：",
  placeholder: "--",
  type: "txt",
}

const cols_remark = {
  span: 18,
  id: "remark",
  label: "备注：",
  placeholder: "--",
  type: "txt",
}

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
                cols_batch,
                cols_cabinet_type,
                {
                  id: "startWarehouseName",
                  span: 6,
                  label: "起始港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  id: "endWarehouseName",
                  span: 6,
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                },
                cols_reference_mun,
                cols_so_no,
                {
                  id: cols_obj[4].prop,
                  span: 6,
                  label: "总重量：",
                  placeholder: "--",
                  type: "txt",
                  render: rows => toFixedNum(rows[cols_obj[4].prop])
                },
                {
                  id: cols_obj[5].prop,
                  span: 6,
                  label: "总体积：",
                  placeholder: "--",
                  type: "txt",
                  render: rows => toFixedNum(rows[cols_obj[5].prop])
                }, {
                  span: 6,
                  id: "aimCountry",
                  label: "国家：",
                  placeholder: "--",
                  type: "txt",
                },
                cols_remark
              ]
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {},
}
export const settlementTableColumns = [{
  type: "index",
  width: 50,
  align: "center"
},
{
  prop: "number",
  label: "工作单号",
  width: 150,
  showOverflowTooltip: true
},
{
  prop: "feeName",
  label: "费用名称",
  width: 150,
  showOverflowTooltip: true
},
{
  label: "类型",
  prop: "billType",
  showOverflowTooltip: true,
  minWidth: 100,
  basicType: 'billType',
  customRow: true,
},
{
  prop: "address",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 100
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
  minWidth: 120
},
{
  prop: "billStatus",
  label: "状态",
  showOverflowTooltip: true,
  basicType: 'billStatus',
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
  sortable: true
},
{
  prop: "lastTime",
  label: "创建时间",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 150
},
{
  prop: "operation",
  label: "操作",
  showOverflowTooltip: true,
  width: 100,
  customRow: true,
  fixed: "right"
}]


