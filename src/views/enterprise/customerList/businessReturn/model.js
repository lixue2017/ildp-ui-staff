import { httpCustomerSelect,httpgetCustlist } from "@/comModel/httpSelect";
const SEARCH_COL_1 = {
  id: "customerId",
  label: "企业信息：",
  type: "text",
  placeholder: "请选择企业信息",
  ...httpgetCustlist({status:"0,1,2,3,4,5,9"})
};
const SEARCH_COL_2 = {
  id: "orderType",
  label: "配置类型：",
  type: "select",
  placeholder: "请选择配置类型",
  hideList:[1,2,3],
  basicType:'settlementBusinessType'
};
const SEARCH_COL_3 = {
  id: "settleModel",
  label: "业务类型：",
  type: "select",
  placeholder: "请选择业务类型",
  basicType:'settleModel'
};
export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [SEARCH_COL_1, SEARCH_COL_2, SEARCH_COL_3],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "customerName",
  label: "公司简称",
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "salesmanName",
  label: "业务员",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "orderType",
  label: "配置类型",
  showOverflowTooltip: true,
  basicType:'settlementBusinessType'
};
const TABLE_COL_4 = {
  prop: "updateUserName",
  label: "最后修改人",
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "updateTime",
  label: "最后修改时间",
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "createUserName",
  label: "创建人",
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COL_8 = {
  prop: "settleModel",
  label: "业务类型",
  showOverflowTooltip: true,
  basicType:'settleModel',
  fontColor:true
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
};
export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_8,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_OPERATION,
];

const DIALOG_FORM_COL_1 = {
  span: 24,
  id: "orderType",
  // label: "库存调整为：",
  placeholder: "请输入",
  type: "multiCheckbox",
  hideList:[1,2,3],
  basicType: "settlementBusinessType",
};

export const customDialogCols = () => {
  return {
    title: "回款配置",
    width: "700px",
    labelWidth: "105px",
    simpleCustomCols: [DIALOG_FORM_COL_1],
    formRules: {
      xx_502: [{ required: true, message: `请输入库存`, trigger: "blur" }],
    },
  };
};

const DIALOG_FORM_COL_2 = {
  span: 24,
  id: "customerId",
  label: "企业信息：",
  placeholder: "请选择",
  selectLabelKey:'customerName',
  ...httpgetCustlist({status:"0,1,2,3,4,5,9"}),
  type:'slot'
};

const DIALOG_FORM_COL_3 = {
  span: 24,
  id: "tableSlot",
  labelWidth:'0px',
  type: "slot",
};
export const getFormConfig = (row = {}) => {
  return {
    title: "回款配置",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [DIALOG_FORM_COL_2,DIALOG_FORM_COL_3],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      customerId: [{ required: true, message: `请选择企业信息`, trigger: "blur" }],
    },
  };
};




const DIALOG_TABLE_COL_1={
  prop: "orderType",
  label: "业务类型",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true
}

const DIALOG_TABLE_COL_2={
  prop: "settleModel",
  label: "回款类型",
  customRow: true,
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true
}


export const dialogTableConfig = [
  DIALOG_TABLE_COL_1,
  DIALOG_TABLE_COL_2
];


