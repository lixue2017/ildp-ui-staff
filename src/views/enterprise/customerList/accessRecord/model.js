import {
  httpCustomerSelect
} from "@/comModel/httpSelect";
const FORM_COLS_1 = {
  id: "customerId",
  label: "企业信息：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const FORM_COLS_2 = {
  id: "apiType",
  label: "配置类型：",
  placeholder: "请选择",
  type: "select",
  basicType:"apiType"
};
const FORM_COLS_3 = {
  id: "returnCode",
  label: "返回码：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COLS_4 = {
  id: "packageParam",
  label: "请求参数：",
  placeholder: "请输入",
  type: "text",
};
export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_1,
              FORM_COLS_2,
              FORM_COLS_3,
              FORM_COLS_4
            ],
          },
        ],
      },
    ],
  },
]




const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left"
}
const TABLE_COL_1 = {
  prop: "customerName",
  label: "公司简称",
  // showOverflowTooltip: true,
  minWidth: 120,
  customRow: true,
  align: "left",
  // fixed: "left"
}
const TABLE_COL_2 = {
  prop: "apiType",
  label: "配置类型",
  showOverflowTooltip: true,
  basicType:"apiType"
}
const TABLE_COL_3 = {
  prop: "createTime",
  label: "访问时间",
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "entryMethod",
  label: "接口名称",
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "packageParam",
  label: "请求参数",
  showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  prop: "returnCode",
  label: "返回码",
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  prop: "returnCount",
  label: "处理数据",
  showOverflowTooltip: true,
}
const TABLE_COL_8 = {
  prop: "returnValue",
  label: "返回结果",
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  prop: "errMsg",
  label: "处理结果",
  customRow:true,
  showOverflowTooltip: true,
  basicType:'apiErrMsg',
  basicTypeVal:"errMsgColor"
}
const TABLE_COL_10 = {
  prop: "callType",
  label: "调用类型",
  customRow:true,
  showOverflowTooltip: true,
  basicType:"apiCallType",
  basicTypeVal:"callTypeColor"
}

const TABLE_COL_11 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_12 = {
  prop: "startTime",
  label: "调用开始时间",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_13 = {
  prop: "endTime",
  label: "调用结束时间",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  prop: "createUserName",
  label: "创建人",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_16 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  // fixed: "right",
  columnOperation: true,
};
export const tableColumns = [
  TABLE_COL_INDEX,
  {
    ...TABLE_COL_1,
    fixed:'left'
  },
  TABLE_COL_2,
  TABLE_COL_10,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
]

export const detailTableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_11,
  TABLE_COL_2,
  TABLE_COL_10,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_9,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_OPERATION
]







export const suborder = [
  {
    label: "接口名称",
    value: "entryMethod",
    tipsWidth:100,
  },
  {
    label: "请求参数",
    value: "packageParam",
    tipsWidth:400,
  },
  {
    label: "返回码",
    value: "returnCode",
    tipsWidth:100,
  },
  {
    label: "处理数据",
    value: "returnCount",
    tipsWidth:100,
  },
  {
    label: "返回结果",
    value: "returnValue",
    tipsWidth:400,
  },
  {
    label: "说明",
    value: "errMsg",
    tipsWidth:100,
  },
];
