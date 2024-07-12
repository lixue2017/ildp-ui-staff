import * as recordModel from '../components/recordModel'
import { httpRouteSelect, httpCustomerSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect.js'
import { toFixedNum } from '@/utils/instructions'

const SEARCH_COL_1 = {
  id: "businessOwnership",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
}

const searchColumns = [
  recordModel.createTimeCol,
  {
    id: "code",
    label: "报关编号：",
    placeholder: "报关编号",
    type: "text",
  },
  // recordModel.cusSearch,
  {
    id: "cusBId",
    label: "报关行：",
    placeholder: "报关行",
    ...httpCustomerSelect({ clientIdentity: 3 })
  },
  {
    id: "operationOrderNum",
    label: "工作单号：",
    placeholder: "工作单号",
    type: "text",
  },
  {
    ...recordModel.statusCol,
    id: "stateList",
    basicType: "customsType"
  },
  {
    ...recordModel.typeCol,
    id: "exportTypeList",
  },
  {
    ...recordModel.createTimeCol,
    id: "declareDate",
    label: "报关时间：",
  },
  {
    id: "createBy",
    label: "创建人：",
    placeholder: "创建人",
    type: "text",
  },
  {
    id: "registerNo",
    label: "整柜参考号：",
    placeholder: "整柜参考号",
    type: "text",
  },
	SEARCH_COL_1
];

const cols_obj = {
  0: {
    type: "index",
    width: 50,
    align: "center"
  },
  1: {
    prop: "joinOrder",
    label: "关联操作单",
    minWidth: 120,
    showOverflowTooltip: true
  },
  2: {
    prop: "exportType",
    label: "类型",
    minWidth: 100,
    customRow: true,
    showOverflowTooltip: true,
    basicType: "importExportType",
  },
  3: {
    prop: "twoCode",
    label: "目的国",
    minWidth: 120,
    showOverflowTooltip: true,
    render: row => {
      if (row.nameCn) {
        return `${row.nameCn}`
      }
      return row.twoCode || '--'
    }
  },
  4: {
    prop: "startPort",
    label: "装货港",
    minWidth: 120,
    showOverflowTooltip: true
  },
  5: {
    prop: "endPort",
    label: "卸货港",
    minWidth: 120,
    showOverflowTooltip: true
  },
  6: {
    prop: "freightBoxInfo",
    label: "货物信息",
    minWidth: 120,
    showOverflowTooltip: true
  },
  7: {
    prop: "createBy",
    label: "委托人",
    minWidth: 120,
    showOverflowTooltip: true
  },
  8: {
    prop: "operationOrderNum",
    label: "操作单",
    minWidth: 120,
    showOverflowTooltip: true
  },
  9: {
    prop: "rowRadio",
    label: "",
    minWidth: 36,
    customRow: true,
  },
}

const TABLE_COL_1 = {
  prop: "businessOwnershipName",
  label: "所属公司",
  minWidth: 120,
	sortable: true,
  showOverflowTooltip: true
}

const tableColumns = [
  {
    ...cols_obj[0],
    fixed: 'left'
  },
  {
    prop: "code",
    label: "报关编码",
    customRow: true,
    sortable: true,
    fixed: 'left',
    minWidth: 130,
    showOverflowTooltip: true
  },
  {
    prop: "shortName",
    label: "报关行",
    fixed: 'left',
    sortable: true,
    // customRow: true,
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    ...cols_obj[2],
    label: "进出口类型",
    sortable: true,
    width: 120,
    fixed: 'left',
  },
  {
    prop: "declareTime",
    label: "申报日期",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "releaseTime",
    label: "放行日期",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "dcNumbers",
    label: "报关单号",
    minWidth: 100,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "registerNo",
    label: "整柜参考号",
    minWidth: 120,
    sortable: true,
    showOverflowTooltip: true,
    render: row => {
      return row.busType === 2 ? row.registerNo : '--'
    }
  },
  {
    ...cols_obj[1],
    sortable: true,
    render: row => {
      // "busType": 0,   // 0单票   1 整柜   2拼柜
      return row.busType === 2 ? row.joinOrder : row.operationOrderNum
    }
  },
  {
    prop: "xx_table_11",
    label: "包含HK港口",
    minWidth: 120,
    // customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    // render: row => row.hk ? '√是' : '否'
  },
  {
    ...cols_obj[3],
    sortable: true,
  },
  {
    ...cols_obj[4],
    sortable: true,
    prop: "startPort",
    label: "装运港",
  },
  {
    ...cols_obj[5],
    sortable: true,
    prop: "endPort",
    label: "目的港",
  },
  {
    prop: "remark",
    label: "备注说明",
    width: 150,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "createBy",
    label: "创建人员",
    width: 100,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 160,
    sortable: true,
    showOverflowTooltip: true,
  },
	TABLE_COL_1,
  // {
  //   prop: "count",
  //   label: "打回次数",
  //   sortable: true,
  //   width: 100,
	// 	align: "right"
  // },
  {
    prop: "status",
    label: "状态",
    dotColor: true,
    sortable: true,
    width: 100,
    fixed: 'right',
    basicType: "customsType"
  },
  {
    label: "操作",
    prop: "operation",
    customRow: true,
    fixed: 'right',
    width: '120px'
  },
]

const declare_form_1 = {
  span: 12,
  id: "operationOrderNum",
  label: "工作单号：",
  type: "txt",
  render: item => {
    if (item.busType == 2) {
      return item.registerNo || item.operationOrderNum || '--'
    }
    return item.operationOrderNum || '--'
  }
}

const declare_form_2 = {
  span: 12,
  id: "exportType",
  labelWidth: "0",
  type: "slot",
  basicType: "importExportType"
}
const declare_form_3 = {
  id: "cusBId",
  label: "报关行：",
  span: 12,
	selectLabelKey: "shortName",
  ...httpCustomerSelect({ clientIdentity: 3 }),
}
const declare_form_3_1 = {
  id: "shortName",
  label: "报关行：",
  span: 12,
  placeholder: "--",
  type: "txt",
}
const declare_form_4 = {
  span: 12,
  id: "declareTime",
  label: "申报日期：",
  placeholder: "此处选择申报日期",
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const declare_form_4_1 = {
  span: 12,
  id: "declareTime",
  label: "申报日期：",
  placeholder: "--",
  type: "txt",
}
const declare_form_5 = {
  span: 12,
  id: "dcNumbers",
  label: "报关单号：",
  placeholder: "此处填写报关单号",
  type: "text",
}
const declare_form_6 = {
  span: 12,
  id: "releaseTime",
  label: "放行日期：",
  placeholder: "此处选择放行日期",
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const declare_form_7 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "此处填写备注说明",
  type: "textarea"
}
const declare_form_8 = {
  span: 24,
  id: "attachId",
  labelWidth: "0",
  type: "customUploadFile"
}

const declare_formRules_1 = {
  cusBId: [
    { required: true, message: "请选择报关行", trigger: "change" },
  ]
}
const declare_formRules_2 = {
  declareTime: [
    { required: true, message: "请选择申报日期", trigger: "change" },
  ]
}
const declare_formRules_3 = {
  releaseTime: [
    { required: true, message: "请选择放行时间", trigger: "change" },
  ]
}

export const trailerDialogForm = (isRelease) => {
  const columns = [
    declare_form_1,
    declare_form_2,
    (isRelease ? declare_form_3_1 : declare_form_3),
    (isRelease ? declare_form_4_1 : declare_form_4),
    declare_form_5,
    declare_form_6,
    declare_form_7,
  ]
  const formRules = {
    ...(isRelease ? { ...declare_formRules_3 } : {
      ...declare_formRules_1,
      ...declare_formRules_2
    })
  }
  return {
    columns,
    formRules, // 表单校验规则
  }
}

export const examineFormCols = (isCheckTime = true) => {
  let examineCols = [{
    span: 24,
    id: "state",
    label: "查验结果：",
    type: "radio",
    value: '0', // 默认值
    options: [{
      label: '放行登记',
      value: '0',
    }, {
      label: '打回登记',
      value: '1',
    }]
  }]
  if (isCheckTime) {
    examineCols.push({
      span: 24,
      id: "releaseTime",
      label: "放行日期：",
      placeholder: "此处选择放行日期",
      type: "date",
    })
  }
  return {
    columns: [
      ...examineCols,
      {
        span: 24,
        id: "remark",
        label: "备注说明：",
        placeholder: "此处填写备注说明",
        type: "textarea"
      },
    ],
    formRules: {
      state: [
        { required: true, message: "请选择查验结果", trigger: "blur" },
      ],
      releaseTime: [
        { required: true, message: "请选择放行日期", trigger: "blur" },
      ],
    }, // 表单校验规则
  }
}

const tableDetailCols = [
  {
    ...cols_obj[0],
    fixed: "left",
  },
  {
    prop: "operationOrderNum",
    label: "操作单号",
    minWidth: 120,
    showOverflowTooltip: true,
    customRow: true,
    fixed: "left",
  },
  {
    prop: "freightTypeName",
    label: "装箱方式",
    minWidth: 120,
    showOverflowTooltip: true,
    // basicType: "freightType",
  },
  {
    prop: "shortName",
    label: "委托人",
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    label: "报关方式",
    prop: "reportName",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  // {
  //   prop: "startPort",
  //   label: "起运港",
  //   minWidth: 120,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "endPort",
  //   label: "目的港",
  //   minWidth: 120,
  //   showOverflowTooltip: true
  // },
  {
    prop: "realFreightVolume",
    label: "总体积(m³)",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    prop: "realFreightWeight",
    label: "总重量(KG)",
    minWidth: 120,
    showOverflowTooltip: true,
    render: rows => rows.realFreightWeight ? toFixedNum(rows.realFreightWeight) : toFixedNum(rows.singleBoxWeight)
  },
  {
    prop: "userName",
    label: "业务员",
    minWidth: 80,
    showOverflowTooltip: true
  },
  {
    prop: "operatorName",
    label: "操作员",
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "declareData",
    label: "客户报关资料",
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
    fixed: "right",
    align: "center"
  },
  {
    prop: "releaseData",
    label: "报关放行资料",
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
    fixed: "right",
    align: "center"
  },
  {
    prop: "operation",
    label: "操作",
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
    fixed: "right",
    align: "center"
  },
  // {
  //   prop: "createTime",
  //   label: "创建时间",
  //   minWidth: 120,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "orderStatus",
  //   label: "状态",
  //   minWidth: 120,
  //   customRow: true,
  //   showOverflowTooltip: true,
  //   basicType: "orderStatus",
  // },
]

const recordDetailCols = [
  {
    span: 8,
    id: "code",
    label: "报关编号：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "shortName",
    label: "报关行：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "dcNumbers",
    label: "报关单号：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "exportType",
    label: "",
    placeholder: "--",
    type: "slot",
    basicType: "importExportType"
  },
  {
    span: 8,
    id: "declareTime",
    label: "申报日期：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "releaseTime",
    label: "放行日期：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 24,
    id: "remark",
    label: "备注说明：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 24,
    id: "attachId",
    labelWidth: "0",
    type: "customUploadFile",
    disable: true
  }
]

export const transportTableCols = [
  cols_obj[9],
  cols_obj[8],
  cols_obj[2],
  cols_obj[3],
  cols_obj[4],
  cols_obj[5],
  cols_obj[6],
  cols_obj[7]
]

export const otherTableCols = [
  cols_obj[9],
  cols_obj[8],
  cols_obj[2],
  cols_obj[3],
  cols_obj[4],
  cols_obj[5],
  {
    ...cols_obj[6],
    label: '整柜信息'
  }
]


export const assemblyTableCols = [
  cols_obj[9],
  {
    prop: "registerNo",
    label: "整柜登记号",
    minWidth: 120,
    showOverflowTooltip: true
  },
  cols_obj[1],
  cols_obj[2],
  cols_obj[3],
  cols_obj[4],
  cols_obj[5],
  {
    prop: "boxModel",
    label: "柜型",
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: "singleBoxWeight",
    label: "单柜重量(KG)",
    minWidth: 120,
    showOverflowTooltip: true,
    render: rows => toFixedNum(rows.singleBoxWeight)
  }
]

export {
  searchColumns, tableColumns, tableDetailCols,
  recordDetailCols
};

const detail_form_1 = {
  id: "shortName",
  label: "报关行：",
  span: 12,
  placeholder: "--",
  type: "txt",
}
const detail_form_2 = {
  id: "declareTime",
  label: "申报日期：",
  span: 12,
  placeholder: "--",
  type: "txt",
}
const detail_form_3 = {
  id: "dcNumbers",
  label: "报关单号：",
  span: 12,
  placeholder: "--",
  type: "txt",
}
const detail_form_4 = {
  id: "releaseTime",
  label: "放行日期：",
  span: 12,
  placeholder: "--",
  type: "txt",
}
const detail_form_5 = {
  id: "remark",
  label: "备注说明：",
  span: 24,
  placeholder: "--",
  type: "txt",
}
const detail_form_6 = {
  span: 12,
  id: "shipCompany",
  label: "船公司：",
  placeholder: "--",
  type: "slot",
  basicType: "importExportType",
  basicTypeVal: "exportType"
}
const detail_form_7 = {
  span: 12,
  id: "startPort",
  label: "起运港：",
  placeholder: "--",
  type: "txt",
}
const detail_form_8 = {
  id: "sono",
  label: "SO No：",
  span: 12,
  placeholder: "--",
  type: "txt",
}
const detail_form_9 = {
  id: "endPort",
  label: "目的港：",
  span: 12,
  placeholder: "--",
  type: "txt",
}

export const detailFormCols = [
  {
    className: "border-right",
    fieldList: [
      {
        rows: [
          {
            cols: [
              detail_form_1,
              detail_form_2,
              detail_form_3,
              detail_form_4,
              detail_form_5
            ]
          }
        ]
      }
    ]
  },
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              detail_form_6,
              detail_form_7,
              detail_form_8,
              detail_form_9
            ]
          }
        ]
      }
    ]
  }
]

// export const detailFromCols = (type = 0) => {
//   const type_obj = {
//     0: {
//       label: "操作单：",
//     },
//     1: {
//       id: "twoCodeName",
//       label: "目的国：",
//       render: row => {
//         if (row.nameCn) {
//           return `${row.nameCn}`
//         }
//         return row.twoCode || '--'
//       }
//     },
//     2: {
//       id: "cabinProxy",
//       label: "订舱代理：",
//     }
//   }
//   const typeArr = [
//     type_obj,
//     type_obj,
//     {
//       0: {
//         label: "整柜参考号：",
//         labelWidth: '91px'
//       },
//       1: {
//         id: "boxModel",
//         label: "柜型：",
//       },
//       2: {
//         id: "singleBoxWeight",
//         label: "单柜重量：",
//         render: rows => `${toFixedNum(rows.singleBoxWeight)}KG`
//       }
//     }
//   ]
//   return [
//     {
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 {
//                   ...typeArr[type][0],
//                   id: "exportType",
//                   span: 6,
//                   placeholder: "--",
//                   type: "slot",
//                   basicType: "importExportType"
//                 },
//                 {
//                   ...typeArr[type][1],
//                   span: 6,
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 6,
//                   id: "shipCompany",
//                   label: "船公司：",
//                   placeholder: "--",
//                   type: "txt",
//                   render: row => {
//                     if (row.name) {
//                       return `${row.shipCompany}[${row.name}]`
//                     }
//                     return row.shipCompany || '--'
//                   }
//                 },
//                 {
//                   span: 6,
//                   id: "shipmentPeriod",
//                   label: "开航期：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   id: "nameAxs",
//                   label: "",
//                   span: 6,
//                   type: "slot"
//                 },
//                 {
//                   ...typeArr[type][2],
//                   span: 6,
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 6,
//                   id: "startPort",
//                   label: "起运港：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 6,
//                   id: "endPort",
//                   label: "目的港：",
//                   placeholder: "--",
//                   type: "txt",
//                 }
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ]
// }

// 维护放行资料
export const maintainReleaseFormCols = {
  title: '维护放行资料',
  width: '420px',
  labelWidth: "66px",
  isAttachFileId: true,
  lists: [{
    fieldList: [{
      rows: [{
        cols: [
          {
            span: 24,
            id: "operationOrderNum",
            label: "工作单号：",
            placeholder: "--",
            type: "txt",
          },
          {
            span: 24,
            id: "attachId",
            fileLabel: "报关底单/放行通知书",
            labelWidth: "0px",
            type: "customUploadFile",
            pasteUpload: true
          }
        ]
      }]
    }]
  }],
  formRules: {}
}
