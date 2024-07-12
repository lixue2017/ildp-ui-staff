
import { httpDeptUserSelect } from '@/comModel/httpSelect'
const searchColumns = [
  {
    id: "queryCreateTime",
    label: "操作时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "createBy",
    label: "操作人员：",
    placeholder: "请输入操作人员",
    ...httpDeptUserSelect(),
  },
  {
    id: "serviceName",
    label: "所属应用：",
    placeholder: "请输入所属应用",
    type: "select",
    dicsStr: 'application',
    customDicsArr: [1, 2]
  },
  {
    id: "moduleName",
    label: "操作对象：",
    placeholder: "请输入操作对象",
    type: "select",
    dicsStr: 'operation_object',
    customDicsArr: [20, 30],
  },
  {
    id: "type",
    label: "操作类型：",
    placeholder: "请输入操作类型",
    type: "select",
    dicsStr: 'operation_type',
    customDicsArr: [10, 20, 30],
  },
  {
    id: "businessNo",
    label: "实例名称：",
    placeholder: "请输入操作对象的实例名称",
    type: "text",
  },
  {
    id: "remark",
    label: "操作内容：",
    placeholder: "请输入操作内容",
    type: "text",
  },
]

const searchConfig = {
  lists: [{
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
  }],
  searchNum: searchColumns.length
}

const tableColumns = [
  {
    type: "index",
    align: "center",
    width: 50
  },
  {
    prop: "createBy",
    label: "操作人员",
    width: 80,
    showOverflowTooltip: true,

  },
  {
    prop: "createTime",
    label: "操作时间",
    width: 140,
    showOverflowTooltip: true,
  },
  {
    prop: "serviceName",
    label: "所属应用",
    width: 75,
    showOverflowTooltip: true,
    dicsStr: "application",
    customDicsArr: [1, 2]
  },
  {
    prop: "moduleName",
    label: "被操作对象",
    width: 120,
    showOverflowTooltip: true,
    basicType: "operationObj"
  },
  {
    prop: "type",
    label: "操作",
    width: 50,
    showOverflowTooltip: true,
    dicsStr: 'operation_type',
    customDicsArr: [10, 20, 30],
  },
  {
    prop: "businessNo",
    label: "被操作对象的实例名称",
    width: 160,
    showOverflowTooltip: true,
  },
  {
    prop: "remark",
    label: "操作内容",
    showOverflowTooltip: true,
  }
]
export { searchConfig, tableColumns };
