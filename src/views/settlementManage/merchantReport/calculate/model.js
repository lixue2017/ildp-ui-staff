import { httpAccountSubjectSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'
// import { getCustomerVoucherSubject } from "@/api/settlementManage/paymentReceived.js";

const SEARCH_COL_1 = {
  id: "code",
  label: "编码：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_2 = {
  id: "shortName",
  label: "简称：",
  placeholder: "请输入",
  type: "text"
}
// const SEARCH_COL_3 = {
//   id: "businessOwnership",
//   label: "业务归属：",
//   placeholder: "请选择",
// 	isDefaultSelectVal: true,
//   ...httpAccountSubjectSelect({httpRequest: getCustomerVoucherSubject})
// }
const SEARCH_COL_4 = {
  id: "billingMain",
  label: "主体：",
	placeholder: "请选择",
  selectLabelKey:"billingMainName",
  // isDefaultSelectVal: true,
  ...httpLogisticsCustomerSelect()
}

export const searchFormCols = (obj) => {
  const { tName, customerHandle } = obj || {};
  const SEARCH_COL_CODE = tName == 1 ? SEARCH_COL_1 : { ...SEARCH_COL_1, label: '核算代码：', id: "checkCode" }
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
								// {
								// 	...SEARCH_COL_4,
								// 	handle: customerHandle
								// },
                SEARCH_COL_4,
                SEARCH_COL_CODE,
                SEARCH_COL_2
              ]
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
	billingMain: [
    { required: true, message: "请选择主体", trigger: "change" },
  ],
} // 表单校验规则

const TABLE_COL_0 = {
  type: "selection",
  align: "center",
  width: 50,
}
const TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 60,
}
const TABLE_COL_1 = {
  prop: "code",
  label: "编码",
  minWidth: 150,
  // customRow: true,
  // sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "shortName",
  label: "简称",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "nameCn",
  label: "中文名",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "nameEn",
  label: "英文名",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "checkCode",
  label: "核算代码",
  minWidth: 110,
  showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  prop: "jindieShortName",
  label: "金蝶客户全称",
  minWidth: 110,
  showOverflowTooltip: true,
}

const TABLE_COL_99 = {
  prop: "operation",
  label: "操作",
  width: 80,
  columnOperation: true,
  fixed: "right"
}

export const tableColumns = (tName = '1') => {
  if (tName === '2') {
    return [
      TABLE_COL_0,
      TABLE_COL_INDEX,
      TABLE_COL_1,
      TABLE_COL_2,
      TABLE_COL_3,
      TABLE_COL_4,
      TABLE_COL_5,
      TABLE_COL_6
    ]
  }

  return [
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    {
      ...TABLE_COL_5,
      customRow: true,
      maxLength: 200,
      request: true
    },
    {
      ...TABLE_COL_6,
      customRow: true,
      maxLength: 200
    },
    TABLE_COL_99
  ]
}
