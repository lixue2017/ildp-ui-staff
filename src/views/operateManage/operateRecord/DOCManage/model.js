import { httpCustomerSelect, httpUserSelect } from '@/comModel/httpSelect'

const searchLists = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "code",
    label: "扣货编码：",
    placeholder: "请输入扣货编码",
    type: "text",
  },
  {
    id: "clientId",
    label: "委托人：",
    placeholder: "请选择委托人",
    ...httpCustomerSelect()
  },
  {
    id: "operationOrderNum",
    label: "操作单：",
    placeholder: "请选择关联操作单",
    type: "text",
  },
  {
    id: "stateList",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    basicType: "docStatus"
  },
  {
    id: "exportTypeList",
    label: "全部类型：",
    placeholder: "请选择类型",
    type: "select",
    basicType: "docType"
  },
  {
    id: "salesmanId",
    label: "业务员：",
    placeholder: "请选择业务员",
    ...httpUserSelect()
  },
  {
    id: "operatorId",
    label: "操作人：",
    placeholder: "请选择操作人",
    ...httpUserSelect()
  },
  {
    id: "createBy",
    label: "创建人：",
    placeholder: "请选择创建人",
    ...httpUserSelect()
  },



]
const searchColumns = {
  searchNum: searchLists.length,
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchLists,
            },
          ],
        },
      ],
    },
  ],
};

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    label: "扣货编号",
    prop: "code",
    customRow: true,
    sortable: true,
    fixed: "left",
    width: 120,
    showOverflowTooltip: true
  },

  {
    label: "类型",
    prop: "type",
    fixed: "left",
    basicType: "docType",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "委托人",
    prop: "bailorPeople",
    fixed: "left",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "关联操作单",
    prop: "joinOrder",
    sortable: true,
    showOverflowTooltip: true,
    width: 120
  },
  // {
  //   label: "船公司",
  //   prop: "ship_company",
  //   showOverflowTooltip: true
  // },
  // {
  //   label: "MBLNO",
  //   prop: "mblno",
  //   showOverflowTooltip: true
  // },
  // {
  //   label: "HBLNO",
  //   prop: "hblno",
  //   showOverflowTooltip: true
  // },
  // {
  //   label: "ETA",
  //   prop: "cut_gate_time",
  //   showOverflowTooltip: true
  // },
  {
    label: "SO NO.",
    prop: "soNo",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "船名",
    prop: "flightName",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "航次",
    prop: "name",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "开船时间",
    prop: "sailOpenTime",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "装船日期",
    prop: "cabinOpenTime",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "业务员",
    prop: "salesmanName",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "文件",
    prop: "fileMemberName",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "操作人",
    prop: "operatorName",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "打回次数",
    prop: "count",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "任务创建人",
    prop: "createBy",
    sortable: true,
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: "任务生成时间",
    prop: "createTime",
    width: 180,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "状态",
    fixed: "right",
    prop: "status",
    basicType: "docStatus",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true,
    width: 140,
  }
]

export { searchColumns, tableColumns, searchLists };
