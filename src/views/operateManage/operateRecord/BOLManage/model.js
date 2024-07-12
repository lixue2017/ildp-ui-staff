import { httpCustomerSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'

const SEARCH_COL_1 = {
  id: "businessOwnership",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
}

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
    id: "hblOrmbl",
    label: "提单号：",
    placeholder: "请输入提单号",
    type: "text",
  },
  {
    id: "clientId",
    label: "委托人：",
    placeholder: "请选择",
    ...httpCustomerSelect()
  },
  {
    id: "dataStatus",
    label: "状态：",
    placeholder: "状态",
    type: "select",
    multiple: true,
    basicType: "BOLStatus"
  },
  {
    id: "exportTypeList",
    label: "全部类型：",
    placeholder: "请选择",
    type: "select",
    basicType: "loadGoodsType"
  },
  {
    id: "createBy",
    label: "创建人：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "code",
    label: "提货编号：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "operationOrderNum",
    label: "工作单号：",
    placeholder: "请输入",
    type: "text",
  },
	SEARCH_COL_1
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


const TABLE_COL_1 = {
  prop: "businessOwnershipName",
  label: "所属公司",
  minWidth: 120,
	sortable: true,
  showOverflowTooltip: true
}
const tableColumns = [
  {
    type: "index",
    width: 50,
    fixed: "left",
    align: "center",
  },
  {
    label: "提货编号",
    prop: "code",
    customRow: true,
    sortable: true,
    fixed: "left",
    width: 120,
    showOverflowTooltip: true
  },

  {
    label: "委托人",
    prop: "bailorPeople",
    fixed: "left",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "提单类型",
    prop: "type",
    fixed: "left",
    basicType: "loadGoodsType",
    sortable: true,
    showOverflowTooltip: true,
    width: 100

  },
  {
    label: "船东提单号",
    prop: "mblNo",
    sortable: true,
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: "货代提单号",
    prop: "hblNo",
    sortable: true,
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: "订舱代理",
    prop: "cabinProxy",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "船公司",
    prop: "shipCompany",
    width: 150,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "船名",
    prop: "flightName",
    sortable: true,
    showOverflowTooltip: true,
    width: 80
  },
  {
    label: "航次",
    prop: "name",
    sortable: true,
    showOverflowTooltip: true,
    width: 80
  },
  {
    label: "开航期",
    prop: "sailOpenTime",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "SO NO",
    prop: "soNo",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    label: "工作单号",
    prop: "operationOrderNum",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "整柜批次号",
    prop: "sortBoxCode",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  // {
  //   label: "订单号",
  //   prop: "operationOrderId",
  //   showOverflowTooltip: true
  // },
  {
    label: "装货港",
    prop: "startPort",
    width: 150,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "中转港",
    prop: "transferPort",
    width: 150,
    sortable: true,
    showOverflowTooltip: true,
  },

  {
    label: "卸货港",
    prop: "endPort",
    width: 150,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    label: "装船日期",
    prop: "shipmentTime",
    width: 120,
    sortable: true,
    showOverflowTooltip: true,
  },
  // {
  //   label: "上传提单",
  //   prop: "isDraft",
  //   sortable: true,
  //   showOverflowTooltip: true,
  //   width: 100
  // },

  {
    label: "任务所属人",
    prop: "salesmanName",
    sortable: true,
    showOverflowTooltip: true,
    width: 120
  },

  // {
  //   label: "所属部门",
  //   prop: "sectionName",
  //   sortable: true,
  //   showOverflowTooltip: true,
  //   width: 100
  // },
  {
    label: "创建时间",
    prop: "createTime",
    width: 150,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    label: "任务创建人",
    prop: "createBy",
    sortable: true,
    showOverflowTooltip: true,
    width: 120
  },
	TABLE_COL_1,
  // {
  //   label: "退回次数",
  //   prop: "count",
  //   sortable: true,
  //   showOverflowTooltip: true,
  //   width: 100
  // },
  {
    label: "状态",
    prop: "status",
    fixed: "right",
    width: 100,
    sortable: true,
    dotColor: true,
    basicType: "BOLStatus"
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    columnOperation: true,
    width: 150,
  }
]

export { searchColumns, tableColumns, searchLists };
